import { NextResponse } from "next/server";
import { InspectError, inspectLink } from "@/lib/inspect";
import { downloadName, formatBytes } from "@/lib/wav";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!UUID.test(id)) {
    return NextResponse.json({ error: "That song could not be kept." }, { status: 400 });
  }
  try {
    const song = await inspectLink(`https://suno.com/song/${id}`);
    if (!song.mediaUrl || song.files.original.state !== "available") {
      return NextResponse.json({ error: "No public file for that song." }, { status: 502 });
    }
    return NextResponse.json({
      url: song.mediaUrl,
      filename: downloadName(song.title, song.artist, "mp4"),
      size: song.files.original.bytes ? formatBytes(song.files.original.bytes) : "",
      video: song.files.video.state === "available",
    });
  } catch (error) {
    if (error instanceof InspectError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "That song could not be kept." }, { status: 502 });
  }
}
