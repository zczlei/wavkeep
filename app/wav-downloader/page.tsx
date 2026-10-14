import type { Metadata } from "next";
import Link from "next/link";
import { DownloadTool, wavPageNote } from "@/components/download-tool";

const title = "WAV Downloader — Download WAV Files and Suno Songs | WAV Keep";
const description =
  "Paste a public song link and keep the WAV — 48 kHz, opens straight in your DAW. Also saves the file as delivered, MP3 and cover art. No sign-in, no download quota spent.";

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WAV Keep — WAV Downloader",
  url: "https://wavkeep.com/wav-downloader/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Save a public song as a 48 kHz WAV file, plus the delivered original, MP3 and cover art.",
};

const faqs = [
  ["Is this the same as a WAV converter?", "No. A converter takes a file you already hold and rewrites it. This reads a public song link, finds the audio behind it and writes the WAV — you never download a file and then convert it."],
  ["Is the WAV lossless?", "The WAV container and its PCM samples are lossless — there's no compression after this step. What came before it belongs to whoever made the song, and we can't undo that. We tell you the source bitrate rather than promising you a master."],
  ["Why 48 kHz and not 44.1?", "That's what the source we measured carries. We write at the source rate instead of resampling it down to fit a preset."],
  ["Does this use my Suno download allowance?", "No. We never sign in to your account and never go through the download menu, so a WAV saved here costs you nothing on that side."],
  ["Can I do this to anyone's song?", "Use it on songs you made or audio you're permitted to keep. A downloadable file is not a licence."],
] as const;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/wav-downloader/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    title: "WAV downloader — pull the WAV out of a public song link",
    description: "48 kHz, DAW-ready, saved without a second lossy pass. Works on public Suno and Udio links.",
    url: "https://wavkeep.com/wav-downloader/",
  },
};

export default function WavDownloaderPage() {
  return (
    <main>
      <div className="hero subpage">
        <div className="wrap">
          <h1>WAV downloader — pull the <em>WAV</em> out of a public song link</h1>
          <p className="sub">
            Paste the link, get a 48 kHz WAV that opens straight in your DAW or editor. The audio is decoded
            from the file the CDN serves and written once — <b>no second lossy pass</b>. If you&apos;d rather keep the source
            untouched, the same link also gives you the <b>original file as delivered</b>, plus MP3 and cover art.
            No sign-in, and nothing here spends one of your monthly downloads.
          </p>
          <DownloadTool
            accept="suno-udio-song"
            primary="wav"
            pendingLabel="Inspecting…"
            invalidMessage="Paste a public song link in the form suno.com/song/… — nothing is fetched before you do."
            failureMessage="Could not read that song just now. Try again in a moment."
            inputLabel="Public song link"
            describe={wavPageNote}
            hint={
              <p className="hint">
                Public <code>suno.com/song/…</code> or <code>udio.com/song/…</code> links. Nothing is fetched until you press Inspect.
              </p>
            }
            formats={[
              { k: "wav", kicker: "DAW-ready · 48 kHz", name: "WAV", detail: "Decoded once from the delivered audio" },
              { k: "original", kicker: "No conversion at all", name: "Original (as delivered)", detail: "Exactly the file the CDN serves" },
              { k: "mp3", kicker: "Small and shareable", name: "MP3", detail: "Same source, compressed for sharing" },
              { k: "art", kicker: "With metadata", name: "Cover art", detail: "The artwork the song page publishes" },
            ]}
          />
        </div>
      </div>

      <section>
        <div className="wrap">
          <h2>What you get, and what you don&apos;t</h2>
          <p className="lead">A WAV is uncompressed samples. Whether it&apos;s worth 5× the size depends on what you&apos;re doing next.</p>
          <div className="grid quad">
            <article className="card"><span className="tag">DOES</span><h3>Drop into a session</h3><p>48 kHz stereo PCM, recognised by every DAW, video editor and mastering service without a detect step.</p></article>
            <article className="card"><span className="tag">DOES</span><h3>Keep the source honest</h3><p>We decode the delivered audio once and write it. The samples are the ones the source carries.</p></article>
            <article className="card"><span className="tag">DOESN&apos;T</span><h3>Recover detail that isn&apos;t there</h3><p>If the source is a ~194 kbps AAC stream, the WAV holds that audio at full width — not more of it. We won&apos;t call it better than it is.</p></article>
            <article className="card"><span className="tag">HEADCASE</span><h3>Size</h3><p>48 kHz stereo WAV runs about <b>11.5 MB per minute</b>. A 4-minute song is roughly 46 MB — fine alone, heavy in a batch.</p></article>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>How to download a WAV from a song link</h2>
          <div className="steps">
            <div className="step"><h3>Copy the public link</h3><p>Open the song and copy the address — <code>suno.com/song/…</code>. It has to be a public link.</p></div>
            <div className="step"><h3>Paste and press Inspect</h3><p>We read what that page publishes. If there&apos;s audio, you&apos;ll see the formats that actually exist.</p></div>
            <div className="step"><h3>Save the WAV</h3><p>One click, one file. For more than a few songs, save them one at a time — see the batch note below.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Saving a lot of WAVs at once</h2>
          <p className="lead">
            The delivered file for the songs we measured is roughly <b>300 kbps ≈ 2.2 MB per minute</b>.
            WAV at the same length is about <b>5× heavier</b>. Twenty songs is a gigabyte-and-a-half of ZIP in the browser —
            that build fails, and it fails late and silently. So batch WAV goes out one song per request, with a running
            count. If you need the whole library at once, the <Link href="/suno-bulk-download/">bulk export page</Link> explains
            where the limit actually is.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Questions people run into</h2>
          {faqs.map(([q, a], index) => (
            <details key={q} open={index === 0}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Related tools</h2>
          <div className="tools">
            <Link className="tool-link" href="/suno-video-downloader/"><b>Suno video downloader</b><small>The published vertical lyric card, as delivered — for songs that have one.</small></Link>
            <Link className="tool-link" href="/suno-bulk-download/"><b>Bulk export</b><small>Save a whole set of songs in one pass.</small></Link>
            <Link className="tool-link" href="/suno-watermark/"><b>Watermarks and download limits</b><small>What the 2026 rules changed, and what they didn&apos;t.</small></Link>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
    </main>
  );
}
