import type { Metadata } from "next";
import { DownloadTool } from "@/components/download-tool";
import { HomeSections } from "@/components/home-sections";
import { faqs, howTo, webApp } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Suno Downloader — Save WAV, MP3, Cover Art | WAV Keep" },
  description:
    "Paste a public Suno link and keep what it already publishes — WAV, MP3, cover art, and the lyric video when there is one. No sign-in, no download spent.",
  alternates: { canonical: "https://wavkeep.com/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HomePage() {
  return (
    <main>
      <div className="hero">
        <div className="wrap">
          <p className="eyebrow">Public song link</p>
          <h1>
            Suno downloader — keep the file <em>Suno already published</em> for your song
          </h1>
          <p className="sub">
            Paste a public Suno song link. Your own songs shouldn&apos;t cost you downloads: we read what that song page exposes and save it as delivered — <b>WAV, MP3, cover art</b>, and for songs that have one, the <b>vertical lyric video</b>. No sign-in, no re-encoding, no watermarks we can&apos;t verify.
          </p>
          <DownloadTool />
          <p className="hint quota">
            Suno&apos;s limits (since September 2026) are 7 downloads for free accounts and 20 per month on Pro — saving from a public link here stays outside that menu.
          </p>
        </div>
      </div>
      <HomeSections />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </main>
  );
}
