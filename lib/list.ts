import { InspectError } from "@/lib/inspect";

const PAGE_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const HANDLE = /^[A-Za-z0-9._-]{2,40}$/;

export type ListedSong = {
  id: string;
  title: string;
  video: boolean;
};

const cache = new Map<string, { at: number; songs: ListedSong[] }>();
const CACHE_MS = 5 * 60 * 1000;

export function parseBulkLink(raw: string): string {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new InspectError(400, "That link could not be read. Check that it is public and try again.");
  }
  if (url.protocol !== "https:") {
    throw new InspectError(400, "That link could not be read. Check that it is public and try again.");
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "suno.com") {
    throw new InspectError(400, "Paste a public Suno playlist, profile or song link.");
  }
  const parts = url.pathname.split("/").filter(Boolean);
  const [kind, id] = parts;
  const song = kind === "song" && parts.length === 2 && UUID.test(id || "");
  const playlist = kind === "playlist" && parts.length === 2 && UUID.test(id || "");
  const profile = parts.length === 1 && kind?.startsWith("@") && HANDLE.test(kind.slice(1));
  if (!song && !playlist && !profile) {
    throw new InspectError(400, "Paste a public suno.com/playlist/…, suno.com/@artist or suno.com/song/… link.");
  }
  url.hash = "";
  return url.toString();
}

function unescapeFlight(html: string) {
  return html.replace(/\\"/g, '"').replace(/\\u0026/g, "&").replace(/\\n/g, " ").replace(/\\t/g, " ");
}

export function songsFromHtml(html: string): ListedSong[] {
  const text = unescapeFlight(html);
  const pattern =
    /"status":"complete","title":"([^"]*)"[\s\S]{0,800}?"id":"([0-9a-f-]{36})","entity_type":"song_schema","video_url":(null|"https:[^"]+")/gi;
  const songs: ListedSong[] = [];
  const seen = new Set<string>();
  for (const match of text.matchAll(pattern)) {
    const id = match[2].toLowerCase();
    if (seen.has(id)) continue;
    seen.add(id);
    const title = match[1].replace(/\s+/g, " ").trim() || "Untitled";
    songs.push({ id, title, video: match[3] !== "null" });
    if (songs.length >= 60) break;
  }
  return songs;
}

export async function listSongs(raw: string): Promise<ListedSong[]> {
  const href = parseBulkLink(raw);
  const cached = cache.get(href);
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.songs;

  const response = await fetch(href, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    headers: { "user-agent": PAGE_UA, accept: "text/html,application/xhtml+xml" },
  });
  if (!response.ok) {
    throw new InspectError(502, "That link could not be read. Check that it is public and try again.");
  }
  const finalHost = new URL(response.url).hostname.replace(/^www\./, "");
  if (finalHost !== "suno.com") {
    throw new InspectError(502, "That link could not be read. Check that it is public and try again.");
  }
  const html = await response.text();
  if (html.length > 3_000_000) {
    throw new InspectError(502, "That link could not be read. The page was larger than we accept.");
  }
  const songs = songsFromHtml(html);
  if (!songs.length) {
    throw new InspectError(502, "That link has no public songs in it.");
  }
  cache.set(href, { at: Date.now(), songs });
  return songs;
}
