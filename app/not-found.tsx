import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Page not found | WAV Keep" },
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="wrap miss">
      <p className="eyebrow">404</p>
      <h1>That page isn&apos;t here yet</h1>
      <p className="sub">The downloader lives on the homepage. Paste a public song link and save the file that page already published.</p>
      <div className="miss-links">
        <Link href="/">Suno downloader</Link>
        <Link href="/wav-downloader/">WAV downloader</Link>
        <Link href="/suno-video-downloader/">Suno video</Link>
      </div>
    </main>
  );
}
