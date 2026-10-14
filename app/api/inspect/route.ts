import { NextResponse } from "next/server";
import { InspectError, inspectLink } from "@/lib/inspect";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  if (typeof body.url !== "string" || !body.url.trim()) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const result = await inspectLink(body.url);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof InspectError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json(
      {
        error:
          "We couldn't read that page. It may be private, deleted, or our fetch got blocked — audio may still be fine if you retry.",
      },
      { status: 502 },
    );
  }
}
