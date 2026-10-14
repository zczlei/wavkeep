"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { FileState, InspectResponse } from "@/lib/types";
import { downloadBlob, downloadName, encodeWav, formatBytes, formatClock } from "@/lib/wav";

const FORMATS = [
  { k: "original", kicker: "Save as published", name: "Original (as delivered)", detail: "The file the CDN serves for this track" },
  { k: "wav", kicker: "Opens straight in a DAW", name: "WAV", detail: "48 kHz, no conversion step" },
  { k: "mp3", kicker: "Small and shareable", name: "MP3", detail: "Extracted from the delivered audio" },
  { k: "video", kicker: "Only if published", name: "Original video (MP4)", detail: "9:16, lyrics on screen" },
  { k: "art", kicker: "With metadata", name: "Cover art", detail: "Title, artist, song ID" },
] as const;

export type FormatKey = (typeof FORMATS)[number]["k"];

export type ToolFormat = {
  k: FormatKey;
  kicker: string;
  name: string;
  detail: string;
};

type Note = { text: string; kind: "ok" | "err" | "" };
type AcceptMode = "broad" | "suno-udio-song" | "suno-song";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NAMES: Record<FormatKey, string> = {
  original: "Original (as delivered)",
  wav: "WAV",
  mp3: "MP3",
  video: "Original video (MP4)",
  art: "Cover art",
};

function looksLikeSongLink(value: string, accept: AcceptMode) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return false;
    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const parts = url.pathname.split("/").filter(Boolean);
    const [kind, id] = parts;
    if (!id) return false;
    if (accept === "suno-song") return host === "suno.com" && parts.length === 2 && kind === "song" && UUID.test(id);
    if (accept === "suno-udio-song") {
      return (host === "suno.com" || host === "udio.com") && parts.length === 2 && kind === "song" && UUID.test(id);
    }
    if (host === "suno.com") return kind === "song" || kind === "hook" || kind === "s";
    if (host === "udio.com") return kind === "song" || kind === "hook";
    return false;
  } catch {
    return false;
  }
}

export function wavPageNote(data: InspectResponse): Note {
  const ready = (["wav", "original", "mp3", "art"] as const).filter((key) => data.files[key].state === "available");
  if (!ready.length) return { text: "Could not read that song just now. Try again in a moment.", kind: "err" };
  let text = `Available for this song: ${ready.map((key) => key.toUpperCase()).join(", ")}`;
  if (data.sourceBitrate && data.sampleRate) {
    text += ` — source audio ≈ ${data.sourceBitrate} kbps, written to WAV at ${data.sampleRate} Hz.`;
  } else if (data.sampleRate) {
    text += ` — written to WAV at ${data.sampleRate} Hz.`;
  }
  return { text, kind: "ok" };
}

export function videoPageNote(data: InspectResponse): Note {
  const video = data.files.video.state;
  if (video === "not_published") {
    return {
      text: "This song publishes audio and cover art, but no video file. Those are below — and we can't make a video Suno hasn't published.",
      kind: "",
    };
  }
  if (video === "not_reachable") {
    return { text: "A video exists for this song but isn't reachable right now. Try again in a moment.", kind: "err" };
  }
  if (video === "available") {
    const specs = data.files.video.resolution || "9:16";
    return { text: `Video for this song: ${specs} — saved exactly as delivered.`, kind: "ok" };
  }
  return { text: "Could not read that song just now. Try again in a moment.", kind: "err" };
}

function detailFor(key: FormatKey, data: InspectResponse, fallback: string) {
  const file = data.files[key];
  if (key === "video") {
    if (file.state === "available") return file.resolution ? `9:16 · ${file.resolution}` : "9:16, lyrics on screen";
    return "not confirmed for this song";
  }
  if (file.state === "not_published") return "Not published for this song";
  if (file.state === "not_reachable") return "Couldn't confirm right now";
  if (key === "original" && file.bytes) return `The file the CDN serves · ${formatBytes(file.bytes)}`;
  return fallback;
}

function noteFor(data: InspectResponse): Note {
  const video = data.files.video.state;
  const audioReady = data.files.original.state === "available" || data.files.wav.state === "available";
  if (video === "available") {
    return { text: "Video published for this song — saving it does not re-render anything.", kind: "ok" };
  }
  if (video === "not_published" && audioReady) {
    return {
      text: "No video file is published for this song. Audio and cover art are still available — we can't make a video Suno hasn't made.",
      kind: "",
    };
  }
  if (video === "not_reachable" && audioReady) {
    return {
      text: "A downloadable video could not be confirmed right now. Audio is still available; try again in a minute.",
      kind: "err",
    };
  }
  if (!audioReady) {
    return {
      text: "We couldn't read a published file for that link. It may be private, deleted, or blocked — try the public song page again.",
      kind: "err",
    };
  }
  return {
    text: `Only ${data.platform === "udio" ? "Udio" : "Suno"} song links can be read. Paste a public link in the form suno.com/song/…`,
    kind: "err",
  };
}

export function DownloadTool({
  formats = FORMATS,
  primary = "original",
  accept = "broad",
  hint,
  inputLabel = "Public Suno song link",
  pendingLabel = "Reading…",
  invalidMessage = "That doesn't look like a public Suno or Udio song link.",
  failureMessage = "We couldn't read that page. It may be private, deleted, or our fetch got blocked — audio may still be fine if you retry.",
  describe = noteFor,
}: {
  formats?: readonly ToolFormat[];
  primary?: FormatKey;
  accept?: AcceptMode;
  hint?: ReactNode;
  inputLabel?: string;
  pendingLabel?: string;
  invalidMessage?: string;
  failureMessage?: string;
  describe?: (data: InspectResponse) => Note;
} = {}) {
  const [url, setUrl] = useState("");
  const [pending, setPending] = useState(false);
  const [busy, setBusy] = useState<FormatKey | null>(null);
  const [done, setDone] = useState<FormatKey | null>(null);
  const [data, setData] = useState<InspectResponse | null>(null);
  const [message, setMessage] = useState<{ text: string; kind: "ok" | "err" | "" } | null>(null);

  async function inspect(raw: string) {
    const next = raw.trim();
    if (!looksLikeSongLink(next, accept)) {
      setData(null);
      setMessage({ text: invalidMessage, kind: "err" });
      return;
    }
    setPending(true);
    setDone(null);
    setMessage({ text: "Checking what this page publishes…", kind: "" });
    try {
      const response = await fetch("/api/inspect/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: next }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || `HTTP ${response.status}`);
      const result = payload as InspectResponse;
      setData(result);
      setMessage(describe(result));
    } catch (error) {
      setData(null);
      setMessage({
        text: error instanceof Error && error.message && !error.message.startsWith("HTTP")
          ? error.message
          : failureMessage,
        kind: "err",
      });
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("url");
    if (!preset) return;
    setUrl(preset);
    void inspect(preset);
    // Only the landing query should auto-run.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(key: FormatKey) {
    if (!data || busy) return;
    const state: FileState = data.files[key].state;
    if (state !== "available") return;
    setBusy(key);
    setMessage({ text: "Saving…", kind: "" });
    try {
      const filename = downloadName(
        data.title,
        data.artist,
        key === "wav" ? "wav" : key === "mp3" ? "mp3" : key === "art" ? "jpg" : key === "video" ? "mp4" : "mp4",
      );
      const videoName = downloadName(data.title, data.artist, "mp4").replace(/\.mp4$/, " video.mp4");
      if (key === "wav") {
        if (!data.mediaUrl) throw new Error("missing media");
        const response = await fetch(data.mediaUrl);
        if (!response.ok) throw new Error("media");
        const bytes = await response.arrayBuffer();
        const Context = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Context) throw new Error("audio");
        const context = new Context();
        const decoded = await context.decodeAudioData(bytes.slice(0));
        const channels = Array.from({ length: decoded.numberOfChannels }, (_, index) => decoded.getChannelData(index));
        const wav = encodeWav(channels, decoded.sampleRate);
        await context.close();
        downloadBlob(wav, filename);
      } else if (key === "art") {
        if (!data.imageUrl) throw new Error("missing art");
        const response = await fetch(data.imageUrl);
        if (!response.ok) throw new Error("art");
        downloadBlob(await response.blob(), filename);
      } else if (key === "mp3") {
        if (!data.mp3Url) throw new Error("missing mp3");
        const response = await fetch(data.mp3Url);
        if (!response.ok) throw new Error("mp3");
        downloadBlob(await response.blob(), filename);
      } else {
        if (!data.mediaUrl) throw new Error("missing media");
        const response = await fetch(data.mediaUrl);
        if (!response.ok) throw new Error("media");
        downloadBlob(await response.blob(), key === "video" ? videoName : filename);
      }
      setDone(key);
      setMessage({ text: `${NAMES[key]} saved.`, kind: "ok" });
    } catch {
      setMessage({ text: "That save failed — try one song at a time instead of a batch.", kind: "err" });
    } finally {
      setBusy(null);
    }
  }

  return (
    <form
      className="tool"
      id="tool"
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault();
        void inspect(url);
      }}
    >
      <div className="row">
        <input
          type="url"
          inputMode="url"
          spellCheck={false}
          aria-label={inputLabel}
          placeholder="https://suno.com/song/00000000-0000-0000-0000-000000000000"
          required
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <button className="go" type="submit" disabled={pending}>
          {pending ? pendingLabel : "Inspect"}
        </button>
      </div>
      {hint ?? (
        <p className="hint">
          Any public link works — <code>suno.com/song/…</code>, a <code>suno.com/s/…</code> share link, or <code>udio.com/song/…</code>. Nothing is fetched until you press Inspect.
        </p>
      )}

      {data && (data.title || data.imageUrl) && (
        <div className="song">
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.imageUrl} alt="" referrerPolicy="no-referrer" />
          ) : null}
          <div>
            <strong>{data.title}</strong>
            <p>
              {[data.artist, data.duration ? formatClock(data.duration) : "", data.platform === "udio" ? "Udio" : "Suno"]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>
      )}

      <div className={data ? `results on${formats.length === 5 ? "" : " fit"}` : "results"}>
        {formats.map((format) => {
          const state = data?.files[format.k].state;
          const hidden = format.k === "video" && state === "not_published";
          if (hidden) return null;
          const disabled = !data || state !== "available" || busy !== null;
          return (
            <button
              key={format.k}
              type="button"
              className={`fmt${format.k === primary && state === "available" ? " primary" : ""}${done === format.k ? " done" : ""}`}
              disabled={disabled}
              onClick={() => void save(format.k)}
            >
              <small className="kicker">{format.kicker}</small>
              <b>{busy === format.k ? "Saving…" : done === format.k ? `${format.name} ✓` : format.name}</b>
              <small>{data ? detailFor(format.k, data, format.detail) : format.detail}</small>
            </button>
          );
        })}
      </div>
      <div className={message ? `note${message.kind ? ` ${message.kind}` : ""}` : ""} aria-live="polite">
        {message?.text || ""}
      </div>
    </form>
  );
}
