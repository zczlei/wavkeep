import { extractMoovs, parseMoov, type Mp4Probe } from "@/lib/mp4";
import type { FileState, InspectFile, InspectResponse } from "@/lib/types";

const PAGE_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const UUID =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const cache = new Map<string, { at: number; value: InspectResponse }>();
const CACHE_MS = 5 * 60 * 1000;

export class InspectError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function parsePublicLink(raw: string): { platform: "suno" | "udio"; href: string } {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new InspectError(400, "That doesn't look like a public Suno or Udio song link.");
  }
  if (url.protocol !== "https:") {
    throw new InspectError(400, "That doesn't look like a public Suno or Udio song link.");
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  const parts = url.pathname.split("/").filter(Boolean);
  const kind = parts[0];
  const id = parts[1];
  if (!id || id.length > 80) {
    throw new InspectError(400, "That doesn't look like a public Suno or Udio song link.");
  }
  if (host === "suno.com" && (kind === "song" || kind === "hook" || kind === "s")) {
    return { platform: "suno", href: url.toString() };
  }
  if (host === "udio.com" && (kind === "song" || kind === "hook")) {
    return { platform: "udio", href: url.toString() };
  }
  throw new InspectError(400, "That doesn't look like a public Suno or Udio song link.");
}

function decodeEntities(value: string) {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (all, ent: string) => {
    const named: Record<string, string> = {
      amp: "&",
      quot: '"',
      apos: "'",
      lt: "<",
      gt: ">",
      nbsp: " ",
    };
    if (named[ent]) return named[ent];
    if (ent[0] === "#") {
      const code =
        ent[1] === "x" || ent[1] === "X"
          ? Number.parseInt(ent.slice(2), 16)
          : Number.parseInt(ent.slice(1), 10);
      if (!Number.isFinite(code)) return all;
      try {
        return String.fromCodePoint(code);
      } catch {
        return all;
      }
    }
    return all;
  });
}

function metaContent(html: string, key: string): string | null {
  const attr = key.startsWith("og:") || key.startsWith("music:") ? "property" : "name";
  const patterns = [
    new RegExp(`<meta[^>]*${attr}=["']${key}["'][^>]*content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${key}["'][^>]*>`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]).trim();
  }
  return null;
}

function isAllowedMediaHost(hostname: string) {
  const host = hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) return false;
  return (
    host === "suno.ai" ||
    host.endsWith(".suno.ai") ||
    host === "suno.com" ||
    host.endsWith(".suno.com") ||
    host === "udio.com" ||
    host.endsWith(".udio.com") ||
    host === "udio.ai" ||
    host.endsWith(".udio.ai")
  );
}

function safeMediaUrl(candidate: string | null | undefined): string | null {
  if (!candidate) return null;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:") return null;
    if (!isAllowedMediaHost(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

async function fetchPage(href: string): Promise<{ html: string; finalUrl: string }> {
  const response = await fetch(href, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: {
      "user-agent": PAGE_UA,
      accept: "text/html,application/xhtml+xml",
    },
  });
  if (!response.ok) {
    throw new InspectError(
      502,
      "We couldn't read that page. It may be private, deleted, or our fetch got blocked — audio may still be fine if you retry.",
    );
  }
  const finalHost = new URL(response.url).hostname.replace(/^www\./, "");
  if (finalHost !== "suno.com" && finalHost !== "udio.com") {
    throw new InspectError(502, "We couldn't read that page. The link left the public song host.");
  }
  const html = await response.text();
  if (html.length > 3_000_000) {
    throw new InspectError(502, "We couldn't read that page. The response was larger than we accept.");
  }
  return { html, finalUrl: response.url };
}

type Remote = {
  ok: boolean;
  status: number;
  length: number | null;
  contentType: string | null;
};

async function probeRemote(url: string): Promise<Remote> {
  const head = await fetch(url, {
    method: "HEAD",
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
  const headLength = Number(head.headers.get("content-length") || 0) || null;
  if (head.ok && headLength) {
    return {
      ok: true,
      status: head.status,
      length: headLength,
      contentType: head.headers.get("content-type"),
    };
  }

  const ranged = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: { Range: "bytes=0-15" },
  });
  if (ranged.status === 200 || ranged.status === 206) {
    const match = ranged.headers.get("content-range")?.match(/\/(\d+)\s*$/);
    const length = match ? Number(match[1]) : Number(ranged.headers.get("content-length") || 0) || null;
    return {
      ok: true,
      status: ranged.status,
      length,
      contentType: ranged.headers.get("content-type"),
    };
  }
  return { ok: false, status: ranged.status || head.status, length: null, contentType: null };
}

function absentState(status: number): FileState {
  if (status === 404 || status === 403 || status === 410) return "not_published";
  return "not_reachable";
}

async function readRange(url: string, start: number, end: number): Promise<Uint8Array | null> {
  const response = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
    headers: { Range: `bytes=${start}-${end}` },
  });
  if (response.status !== 206 && response.status !== 200) return null;
  const lengthHeader = Number(response.headers.get("content-length") || 0);
  if (response.status === 200 && lengthHeader > end - start + 1024) return null;
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > 8 * 1024 * 1024 + 64) return null;
  return bytes;
}

async function probeMp4(url: string, length: number): Promise<Mp4Probe | null> {
  const windows = [2 * 1024 * 1024, 8 * 1024 * 1024];
  for (const window of windows) {
    const start = Math.max(0, length - window);
    const bytes = await readRange(url, start, length - 1);
    if (!bytes) return null;
    const parsed = extractMoovs(bytes)
      .map((moov) => parseMoov(moov))
      .filter((item): item is Mp4Probe => Boolean(item));
    const hit = parsed.find((item) => item.hasVideo || item.hasAudio) || parsed[0];
    if (hit) return hit;
    if (start === 0) break;
  }
  return null;
}

async function imageLooksReal(url: string): Promise<boolean> {
  const response = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
    headers: { Range: "bytes=0-15" },
  });
  if (response.status !== 200 && response.status !== 206) return false;
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 3) return false;
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e;
  const webp = bytes.length >= 12 && fourccAscii(bytes, 0, "RIFF") && fourccAscii(bytes, 8, "WEBP");
  return jpeg || png || webp;
}

function fourccAscii(buf: Uint8Array, offset: number, text: string) {
  return String.fromCharCode(...buf.slice(offset, offset + text.length)) === text;
}

function file(state: FileState, extra?: Partial<InspectFile>): InspectFile {
  return { state, ...extra };
}

function emptyFiles(state: FileState): InspectResponse["files"] {
  return {
    original: file(state),
    wav: file(state),
    mp3: file(state),
    video: file(state),
    art: file(state),
  };
}

export async function inspectLink(raw: string): Promise<InspectResponse> {
  const link = parsePublicLink(raw);
  const cached = cache.get(link.href);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;

  const { html, finalUrl } = await fetchPage(link.href);
  const title = metaContent(html, "og:title") || metaContent(html, "twitter:title") || "";
  const description = metaContent(html, "description") || "";
  const artistMatch = description.match(/\bby\s+(.+?)\s+\(@[^)]+\)/i);
  const artist = artistMatch?.[1]?.trim() || "";
  const embeddedMp4 = [...html.matchAll(/https:\/\/cdn1\.suno\.ai\/[0-9a-f-]{36}\.mp4/gi)].map((match) => match[0]);
  const uuid = finalUrl.match(UUID)?.[0] || embeddedMp4[0]?.match(UUID)?.[0] || "";
  const mediaCandidates = [
    uuid ? safeMediaUrl(`https://cdn1.suno.ai/${uuid}.mp4`) : null,
    ...embeddedMp4.map((item) => safeMediaUrl(item)),
  ].filter((value, index, list): value is string => Boolean(value) && list.indexOf(value) === index);

  const ogImage = safeMediaUrl(metaContent(html, "og:image"));
  const imageCandidates = [
    ogImage,
    uuid ? safeMediaUrl(`https://cdn2.suno.ai/image_large_${uuid}.jpeg`) : null,
    uuid ? safeMediaUrl(`https://cdn2.suno.ai/image_${uuid}.jpeg`) : null,
  ].filter((value, index, list): value is string => Boolean(value) && list.indexOf(value) === index);

  if (!mediaCandidates.length) {
    throw new InspectError(
      502,
      "We couldn't read that page. It may be private, deleted, or our fetch got blocked — audio may still be fine if you retry.",
    );
  }

  const files = emptyFiles("not_published");
  let mediaUrl: string | null = null;
  let duration: number | null = null;
  let sampleRate: number | null = null;
  let sourceBitrate: number | null = null;
  let mp4Status: Remote = { ok: false, status: 404, length: null, contentType: null };

  for (const candidate of mediaCandidates) {
    mp4Status = await probeRemote(candidate);
    if (mp4Status.ok) {
      mediaUrl = candidate;
      break;
    }
  }

  if (!mediaUrl) {
    const state = absentState(mp4Status.status);
    files.original = file(state);
    files.wav = file(state);
    files.video = file(state === "not_published" ? "not_published" : "not_reachable");
  } else {
    files.original = file("available", mp4Status.length ? { bytes: mp4Status.length } : {});
    let parsed: Mp4Probe | null = null;
    if (mp4Status.length && mp4Status.length > 32) {
      try {
        parsed = await probeMp4(mediaUrl, mp4Status.length);
      } catch {
        parsed = null;
      }
    }
    if (!parsed) {
      files.wav = file("available");
      files.video = file("not_reachable");
    } else {
      duration = parsed.durationSec ?? null;
      sampleRate = parsed.sampleRate ?? null;
      sourceBitrate = parsed.audioBitrate ?? null;
      files.wav = file(parsed.hasAudio ? "available" : "not_published");
      if (parsed.hasVideo && parsed.width && parsed.height) {
        files.video = file("available", { resolution: `${parsed.width}×${parsed.height}` });
      } else if (parsed.hasVideo) {
        files.video = file("available");
      } else if (parsed.hasAudio) {
        files.video = file("not_published");
      } else {
        files.video = file("not_reachable");
      }
    }
  }

  const mp3Guess = uuid ? safeMediaUrl(`https://cdn1.suno.ai/${uuid}.mp3`) : null;
  if (mp3Guess && mp3Guess !== mediaUrl) {
    try {
      const mp3 = await probeRemote(mp3Guess);
      const type = mp3.contentType || "";
      const audioLike = type.startsWith("audio/") || type.includes("mpeg") || type.includes("mp3");
      if (mp3.ok && (audioLike || !type || type === "application/octet-stream")) {
        files.mp3 = file("available", mp3.length ? { bytes: mp3.length } : {});
      } else {
        files.mp3 = file(mp3.ok ? "not_reachable" : absentState(mp3.status));
      }
    } catch {
      files.mp3 = file("not_reachable");
    }
  }

  let imageUrl: string | null = null;
  for (const candidate of imageCandidates) {
    try {
      if (await imageLooksReal(candidate)) {
        imageUrl = candidate;
        files.art = file("available");
        break;
      }
    } catch {
      files.art = file("not_reachable");
    }
  }
  if (!imageUrl && files.art.state !== "not_reachable") files.art = file("not_published");

  if (files.mp3.state === "available" && !mp3Guess) files.mp3 = file("not_published");

  const result: InspectResponse = {
    platform: link.platform,
    title: title || "Untitled song",
    artist,
    songId: uuid,
    duration,
    sampleRate,
    sourceBitrate,
    mediaUrl,
    imageUrl,
    mp3Url: files.mp3.state === "available" ? mp3Guess : null,
    files,
  };

  if (result.mediaUrl) cache.set(link.href, { at: Date.now(), value: result });
  return result;
}
