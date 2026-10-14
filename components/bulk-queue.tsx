"use client";

import { useRef, useState } from "react";
import { downloadBlob } from "@/lib/wav";

type SongState = "idle" | "novideo" | "done" | "failed";

type Song = {
  id: string;
  title: string;
  video: boolean;
  picked: boolean;
  state: SongState;
  label: string;
};

export function BulkQueue() {
  const [url, setUrl] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [scanning, setScanning] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const songsRef = useRef<Song[]>([]);
  const keptIds = useRef(new Set<string>());
  const runningRef = useRef(false);

  function commit(next: Song[]) {
    songsRef.current = next;
    setSongs(next);
  }

  async function scan() {
    const value = url.trim();
    if (!value) return;
    setScanning(true);
    setNote("");
    setVisible(true);
    setStatus("Reading the list…");
    setProgress(0);
    try {
      const response = await fetch(`/api/list/?url=${encodeURIComponent(value)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "That link could not be read. Check that it is public and try again.");
      const next: Song[] = (data.songs || []).map((song: { id: string; title: string; video: boolean }) => {
        const already = keptIds.current.has(song.id);
        return {
          id: song.id,
          title: song.title,
          video: song.video,
          picked: !already,
          state: already ? "done" : song.video ? "idle" : "novideo",
          label: already ? "already kept" : song.video ? "video" : "audio only",
        };
      });
      if (!next.length) throw new Error("That link has no public songs in it.");
      commit(next);
      setStatus("");
    } catch (error) {
      setVisible(false);
      setNote(error instanceof Error ? error.message : "That link could not be read. Check that it is public and try again.");
    } finally {
      setScanning(false);
    }
  }

  function toggleAll() {
    if (runningRef.current) return;
    const anyOff = songsRef.current.some((song) => !song.picked);
    commit(songsRef.current.map((song) => ({ ...song, picked: anyOff })));
  }

  function toggleOne(index: number, picked: boolean) {
    if (runningRef.current) return;
    const next = songsRef.current.slice();
    next[index] = { ...next[index], picked };
    commit(next);
  }

  async function run() {
    const picked = songsRef.current.filter((song) => song.picked);
    if (!picked.length || runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
    setProgress(0);
    let done = 0;
    let kept = 0;
    for (const song of picked) {
      const mark = (patch: Partial<Song>) => {
        commit(songsRef.current.map((item) => (item.id === song.id ? { ...item, ...patch } : item)));
      };
      mark({ state: "idle", label: "keeping…" });
      try {
        const response = await fetch(`/api/keep/?id=${encodeURIComponent(song.id)}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "could not be kept");
        const file = await fetch(data.url);
        if (!file.ok) throw new Error("could not be kept");
        downloadBlob(await file.blob(), data.filename || `${song.title}.mp4`);
        keptIds.current.add(song.id);
        kept += 1;
        mark({ state: "done", label: data.size ? `kept · ${data.size}` : "kept", video: data.video !== false });
      } catch (error) {
        mark({ state: "failed", label: error instanceof Error ? error.message : "could not be kept" });
      }
      done += 1;
      setProgress(Math.round((done / picked.length) * 100));
    }
    runningRef.current = false;
    setRunning(false);
    setStatus(`${kept} of ${picked.length} kept`);
  }

  return (
    <>
      <div className="bq">
        <div className="bq-field">
          <label htmlFor="bulkurl">Public playlist, profile or song link</label>
          <input
            id="bulkurl"
            type="url"
            inputMode="url"
            required
            placeholder="https://suno.com/playlist/00000000-0000-0000-0000-000000000000"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <button className="cta" type="button" disabled={scanning || running} onClick={() => void scan()}>
          {scanning ? "Reading…" : "Read the list"}
        </button>
      </div>
      <p className="hint">
        Public <code>suno.com/playlist/…</code>, <code>suno.com/@artist</code> or <code>suno.com/song/…</code> links. Nothing is read until you press <b>Read the list</b>.
      </p>

      {visible ? (
        <div className="queue">
          <div className="queue-head">
            <strong>
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </strong>
            <span className="qstatus">{status}</span>
            <span className="grow">
              <button className="btn ghost" type="button" disabled={running} onClick={toggleAll}>
                Select all
              </button>
              <button className="cta" type="button" disabled={running} onClick={() => void run()}>
                Keep selected
              </button>
            </span>
          </div>
          <div className="qbar">
            <i style={{ width: `${progress}%` }} />
          </div>
          <ul className="qlist">
            {songs.map((song, index) => (
              <li key={song.id}>
                <input
                  type="checkbox"
                  checked={song.picked}
                  disabled={running}
                  onChange={(event) => toggleOne(index, event.target.checked)}
                />
                <span className="nm">{song.title}</span>
                <span className={`st${song.state === "done" ? " ok" : song.state === "failed" ? " err" : song.state === "novideo" ? " no" : ""}`}>
                  {song.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {note ? <p className="bulk-note">{note}</p> : null}
      <p className="hint">Songs you never shared publicly have no public page, so they can&apos;t be listed. Share the ones you want to keep first.</p>
    </>
  );
}
