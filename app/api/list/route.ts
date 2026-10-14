import { NextResponse } from "next/server";
import { InspectError } from "@/lib/inspect";
import { listSongs } from "@/lib/list";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url") || "";
  if (!url.trim()) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  try {
    const songs = await listSongs(url);
    return NextResponse.json({ songs });
  } catch (error) {
    if (error instanceof InspectError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      { error: "That link could not be read. Check that it is public and try again." },
      { status: 502 },
    );
  }
}
