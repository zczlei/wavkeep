import type { Metadata } from "next";
import Link from "next/link";
import { DownloadTool, wavPageNote } from "@/components/download-tool";

const title = "Suno to WAV — Download Songs as 48 kHz WAV | WAV Keep";
const description =
  "Paste a public Suno song link and get a 48 kHz WAV from the audio that page already publishes — the format Suno keeps behind Pro and Premier.";

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WAV Keep — Suno to WAV",
  url: "https://wavkeep.com/suno-wav-downloader/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Convert a public Suno song link into a 48 kHz WAV file, plus the original delivered file, MP3 and cover art.",
};

const schemaFaqs = [
  [
    "Can you export WAV from Suno?",
    "Suno's own help article states that WAV file downloads are available to Pro and Premier subscribers, and that you must use suno.com to get them — on mobile the download defaults to MP3, and the article says free plan users get a lightweight MP3 only. That is Suno's plan, not ours, and we can't change it. WAV Keep does not access your account: it reads the audio a public song page publishes and writes a 48 kHz WAV file from it.",
  ],
  [
    "Is a Suno WAV better sounding than the Suno MP3?",
    "No. The songs we measured arrive as AAC audio at 48 kHz around 194 kbps. Converting that to WAV gives you the same audio in an editable container — it cannot add detail that isn't in the source. Community measurements of Suno downloads report the same: the WAV carries audio only up to the range the compressed source already covered.",
  ],
  [
    "Why is there no WAV button for my song?",
    "WAV is written from the audio a song page publishes. If the page publishes no playable audio, there is nothing to write a WAV from, so the button stays disabled instead of producing a broken file.",
  ],
  [
    "Do I need a Suno account to use this page?",
    "No. WAV Keep never asks for Suno or Udio credentials and never signs in. All you need is a public song link.",
  ],
  [
    "Does converting to WAV use one of my monthly downloads?",
    "No. This page reads the public song page and writes the file on your machine. Nothing here goes through the download menu on suno.com, so nothing here spends one of your monthly downloads.",
  ],
  [
    "Can I convert anyone's Suno song to WAV?",
    "Use it on songs you created, or audio you are permitted to keep. A downloadable file is not a licence, and the terms of the platform that generated the audio still apply to what you do with it.",
  ],
] as const;

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: schemaFaqs.map(([name, text]) => ({
    "@type": "Question",
    name,
    acceptedAnswer: { "@type": "Answer", text },
  })),
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/suno-wav-downloader/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://wavkeep.com/suno-wav-downloader/",
  },
};

export default function SunoWavDownloaderPage() {
  return (
    <main>
      <div className="hero subpage">
        <div className="wrap">
          <h1>
            Suno to WAV — turn a public Suno link into a <em>48 kHz WAV</em>
          </h1>
          <p className="sub">
            Paste the song link and get a WAV you can open in a DAW, editor or mastering tool. It&apos;s written
            from the audio the song page already publishes — <b>the same audio your ears already heard</b>, in an editable
            container instead of a compressed one. If the WAV button isn&apos;t on your plan or your phone, this is the way
            around the format, not around the account: <b>nothing here signs in, and nothing here spends a download.</b>
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
                Public <code>suno.com/song/…</code> links. Nothing is fetched until you press Inspect.
              </p>
            }
            formats={[
              { k: "wav", kicker: "Editable · 48 kHz", name: "WAV", detail: "Decoded once from the delivered audio" },
              { k: "original", kicker: "No conversion at all", name: "Original (as delivered)", detail: "Exactly the file the CDN serves" },
              { k: "mp3", kicker: "Small and shareable", name: "MP3", detail: "Same source, compressed for sharing" },
              { k: "art", kicker: "With metadata", name: "Cover art", detail: "The artwork the song page publishes" },
            ]}
          />
        </div>
      </div>

      <section>
        <div className="wrap">
          <h2>Why a lot of people never see a WAV button</h2>
          <p className="lead">
            It isn&apos;t a bug on your side. Suno&apos;s own help centre says which plans get the WAV option and
            which device you have to be on to get it.
          </p>
          <div className="quote">
            <b>
              “Wav file downloads are only available for Pro and Premier subscribers. Additionally, you must visit
              suno.com to get wav files; downloading via mobile will default to mp3 format. Free plan users currently only
              get one option: the Download button will generate a lightweight mp3.”
            </b>
            <cite>
              — Suno Help Centre, “Why can&apos;t I download wav files?” (article dated 10 months before this page was written).
              Check the live article, plans and rules change.
            </cite>
          </div>
          <p>
            That sentence explains three different visitors landing on this page: the free account, the person on a
            phone, and the person who pressed the WAV button and heard no difference. <b>We can&apos;t change what Suno&apos;s plans
            include</b> — and we won&apos;t pretend otherwise. What this page does is read the audio a public song page
            publishes and write a 48 kHz WAV from it, so you have the file in the format you needed it in.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>What the WAV actually contains</h2>
          <p className="lead">We&apos;d rather you know this before you use 46 MB of disk than after.</p>
          <table className="spec">
            <tbody>
              <tr><th>Container</th><td>WAV (RIFF), PCM</td></tr>
              <tr><th>Sample rate</th><td>48 kHz, stereo — the rate the source carries</td></tr>
              <tr><th>Source audio</th><td>AAC 48 kHz, ≈194 kbps (measured on the songs we tested)</td></tr>
              <tr><th>Size</th><td>≈11.5 MB per minute (a 4-minute song ≈46 MB)</td></tr>
              <tr><th>Opens in</th><td>Any DAW, video editor or mastering tool, with no detect step</td></tr>
              <tr><th>Adds detail</th><td>No — this is a container change, not a fidelity upgrade</td></tr>
            </tbody>
          </table>
          <p className="lead" style={{ marginTop: 14 }}>
            A WAV holds PCM samples, so the file is large and every tool reads it. It does <b>not</b> put back
            anything the compression removed. Anyone telling you their Suno WAV sounds better than the source is selling you a container.
          </p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>How to turn a Suno song into a WAV</h2>
          <div className="steps">
            <div className="step"><h3>Copy the public song link</h3><p>Open the song and copy the address — <code>suno.com/song/…</code>. The link has to be public.</p></div>
            <div className="step"><h3>Paste it and press Inspect</h3><p>We read what the page publishes and show you the formats that actually exist for that song.</p></div>
            <div className="step"><h3>Choose WAV</h3><p>One click, one file, decoded once and written straight to your machine. Keep the original too if you want an untouched copy.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Questions people ask before they convert</h2>
          <details open>
            <summary>Will the WAV sound better than the MP3?</summary>
            <p>No, and be suspicious of anything that says yes. The songs we measured arrive as AAC audio at 48 kHz, around 194 kbps. Writing that to WAV changes the container, not the content. The WAV is the better file to <b>edit</b>; it isn&apos;t a better recording.</p>
          </details>
          <details>
            <summary>What does the WAV hold?</summary>
            <p>PCM samples, written once, with nothing compressed again after this step. What happened before it was decided upstream, and no converter can undo that. That&apos;s why we publish the source bitrate instead of a promise.</p>
          </details>
          <details>
            <summary>Why 48 kHz and not 44.1?</summary>
            <p>Because that&apos;s what the source carries. We write at the source rate rather than resampling it to fit a preset.</p>
          </details>
          <details>
            <summary>Does this get around the Pro requirement?</summary>
            <p>It doesn&apos;t touch your account at all. We never sign in, never call the download menu, and never change what your plan includes. If you need the files Suno holds for subscribers, that&apos;s a question for Suno.</p>
          </details>
          <details>
            <summary>How many can I convert at once?</summary>
            <p>One at a time by default. WAV is about five times heavier than the delivered file, so a large browser-side archive collapses — it fails late and quietly. For a whole set, use the <Link href="/suno-bulk-download/">bulk export page</Link>, which handles the queue and tells you where the real limit is.</p>
          </details>
          <details>
            <summary>Whose songs am I allowed to convert?</summary>
            <p>Your own, or audio you&apos;re permitted to keep. A downloadable file is not a licence, and platform terms still apply to whatever you publish or sell afterwards.</p>
          </details>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Related tools</h2>
          <div className="tools">
            <Link className="tool-link" href="/wav-downloader/"><b>WAV downloader</b><small>Any public audio link, saved as a 48 kHz WAV.</small></Link>
            <Link className="tool-link" href="/suno-video-downloader/"><b>Suno video downloader</b><small>The published vertical lyric card, as delivered — for songs that have one.</small></Link>
            <Link className="tool-link" href="/suno-bulk-download/"><b>Bulk export</b><small>A whole set of songs in one pass, with the limit stated up front.</small></Link>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </main>
  );
}
