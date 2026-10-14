export type Mp4Probe = {
  hasVideo: boolean;
  hasAudio: boolean;
  width?: number;
  height?: number;
  durationSec?: number;
  sampleRate?: number;
  audioBitrate?: number;
};

const CONTAINERS = new Set(["moov", "trak", "mdia", "minf", "stbl", "edts"]);

function u32(buf: Uint8Array, offset: number): number {
  return (
    ((buf[offset] << 24) |
      (buf[offset + 1] << 16) |
      (buf[offset + 2] << 8) |
      buf[offset + 3]) >>>
    0
  );
}

function u64(buf: Uint8Array, offset: number): number {
  return u32(buf, offset) * 2 ** 32 + u32(buf, offset + 4);
}

function fourcc(buf: Uint8Array, offset: number): string {
  return String.fromCharCode(
    buf[offset],
    buf[offset + 1],
    buf[offset + 2],
    buf[offset + 3],
  );
}

function indexOfFourcc(buf: Uint8Array, token: string, from = 0): number {
  const a = token.charCodeAt(0);
  const b = token.charCodeAt(1);
  const c = token.charCodeAt(2);
  const d = token.charCodeAt(3);
  for (let i = from; i <= buf.length - 4; i++) {
    if (buf[i] === a && buf[i + 1] === b && buf[i + 2] === c && buf[i + 3] === d) {
      return i;
    }
  }
  return -1;
}

/** Pull complete moov boxes out of a tail buffer that may start mid-mdat. */
export function extractMoovs(buf: Uint8Array): Uint8Array[] {
  const found: Uint8Array[] = [];
  let from = 0;
  while (from <= buf.length - 8) {
    const at = indexOfFourcc(buf, "moov", from);
    if (at < 4) break;
    const size = u32(buf, at - 4);
    if (size >= 16 && size < 50_000_000 && at - 4 + size <= buf.length) {
      found.push(buf.slice(at - 4, at - 4 + size));
      from = at - 4 + size;
    } else {
      from = at + 4;
    }
  }
  return found;
}

type Walk = {
  w: number;
  h: number;
  hasVideo: boolean;
  hasAudio: boolean;
  width?: number;
  height?: number;
  durationSec?: number;
  sampleRate?: number;
  audioBitrate?: number;
  trackTimescale?: number;
  inAudio: boolean;
};

function readMdhdTimescale(buf: Uint8Array, payload: number, end: number): number | null {
  if (payload >= end) return null;
  const version = buf[payload];
  const offset = version === 0 ? payload + 12 : payload + 20;
  if (offset + 4 > end) return null;
  const timescale = u32(buf, offset);
  return timescale > 0 ? timescale : null;
}

function findAvgBitrate(buf: Uint8Array, start: number, end: number): number | null {
  let from = start;
  while (from < end - 16) {
    const at = indexOfFourcc(buf, "btrt", from);
    if (at < 0 || at >= end) return null;
    const size = at >= 4 ? u32(buf, at - 4) : 0;
    if (size >= 20 && size <= 64 && at + 16 <= end) {
      const avg = u32(buf, at + 12);
      if (avg >= 8_000 && avg <= 2_000_000) return Math.round(avg / 1000);
    }
    from = at + 4;
  }
  return null;
}

function readTkhd(buf: Uint8Array, payload: number, end: number): { w: number; h: number } | null {
  if (payload >= end) return null;
  const version = buf[payload];
  let base = payload + 4;
  base += version === 0 ? 20 : 32;
  base += 8 + 2 + 2 + 2 + 2 + 36;
  if (base + 8 > end) return null;
  return { w: u32(buf, base) / 65536, h: u32(buf, base + 4) / 65536 };
}

function readMvhd(buf: Uint8Array, payload: number, end: number): number | null {
  if (payload >= end) return null;
  const version = buf[payload];
  if (version === 0) {
    if (payload + 20 > end) return null;
    const timescale = u32(buf, payload + 12);
    const duration = u32(buf, payload + 16);
    return timescale ? duration / timescale : null;
  }
  if (payload + 32 > end) return null;
  const timescale = u32(buf, payload + 20);
  const duration = u64(buf, payload + 24);
  return timescale ? duration / timescale : null;
}

function walk(buf: Uint8Array, start: number, end: number, ctx: Walk) {
  let p = start;
  while (p + 8 <= end) {
    let size = u32(buf, p);
    const type = fourcc(buf, p + 4);
    let header = 8;
    if (size === 1) {
      if (p + 16 > end) break;
      size = u64(buf, p + 8);
      header = 16;
    } else if (size === 0) {
      size = end - p;
    }
    if (size < header || p + size > end) break;
    const payload = p + header;
    const payloadEnd = p + size;

    if (type === "mvhd") {
      const duration = readMvhd(buf, payload, payloadEnd);
      if (duration && duration > 0) ctx.durationSec = duration;
    } else if (type === "tkhd") {
      const box = readTkhd(buf, payload, payloadEnd);
      if (box) {
        ctx.w = box.w;
        ctx.h = box.h;
      }
    } else if (type === "mdhd") {
      const timescale = readMdhdTimescale(buf, payload, payloadEnd);
      if (timescale) ctx.trackTimescale = timescale;
    } else if (type === "hdlr" && payload + 12 <= payloadEnd) {
      const handler = fourcc(buf, payload + 8);
      if (handler === "vide" && ctx.w > 0 && ctx.h > 0) {
        ctx.hasVideo = true;
        ctx.width = Math.round(ctx.w);
        ctx.height = Math.round(ctx.h);
      }
      if (handler === "soun") {
        ctx.hasAudio = true;
        ctx.inAudio = true;
        if (ctx.trackTimescale && ctx.trackTimescale >= 8000 && ctx.trackTimescale <= 192000) {
          ctx.sampleRate = ctx.trackTimescale;
        }
      }
    }

    if (type === "trak") {
      const savedW = ctx.w;
      const savedH = ctx.h;
      const savedScale = ctx.trackTimescale;
      const savedAudio = ctx.inAudio;
      const hadAudio = ctx.hasAudio;
      ctx.w = 0;
      ctx.h = 0;
      ctx.trackTimescale = undefined;
      ctx.inAudio = false;
      walk(buf, payload, payloadEnd, ctx);
      if (!hadAudio && ctx.hasAudio && ctx.audioBitrate == null) {
        const kbps = findAvgBitrate(buf, payload, payloadEnd);
        if (kbps) ctx.audioBitrate = kbps;
      }
      ctx.w = savedW;
      ctx.h = savedH;
      ctx.trackTimescale = savedScale;
      ctx.inAudio = savedAudio;
    } else if (CONTAINERS.has(type)) {
      walk(buf, payload, payloadEnd, ctx);
    }

    p += size;
  }
}

export function parseMoov(moov: Uint8Array): Mp4Probe | null {
  if (moov.length < 8 || fourcc(moov, 4) !== "moov") return null;
  const ctx: Walk = { w: 0, h: 0, hasVideo: false, hasAudio: false, inAudio: false };
  walk(moov, 8, moov.length, ctx);
  if (!ctx.hasVideo && !ctx.hasAudio && ctx.durationSec == null) return null;
  return {
    hasVideo: ctx.hasVideo,
    hasAudio: ctx.hasAudio,
    width: ctx.width,
    height: ctx.height,
    durationSec: ctx.durationSec,
    sampleRate: ctx.sampleRate,
    audioBitrate: ctx.audioBitrate,
  };
}
