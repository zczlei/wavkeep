import type { Metadata } from "next";
import Link from "next/link";
import { BulkQueue } from "@/components/bulk-queue";

const title = "Suno Bulk Download — Export Your Own Songs in One Go | WAV Keep";
const description =
  "Paste a Suno playlist or profile link and take your own songs out one after another — WAV, MP3, cover art and the published video where a song has one. Nothing re-encoded, and it doesn't spend a Suno download.";

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WAV Keep — Suno Bulk Download",
  url: "https://wavkeep.com/suno-bulk-download/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Queue your own public Suno songs and keep each one as Suno already published it — WAV, MP3, cover art and, where a song has one, the vertical lyric video.",
  mainEntity: {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can I download all of my Suno songs at once?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, as a queue rather than a single archive. Paste your profile or playlist link, we list the songs, and each one is kept on its own — which also means you can pause, resume and keep the files that finished if something interrupts the run.",
        },
      },
      {
        "@type": "Question",
        name: "Does a bulk export spend my Suno download allowance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It does not go through the download button on suno.com. Suno's own help pages describe monthly download allowances on paid plans; keeping a copy through a public link is a separate action and does not draw on that count.",
        },
      },
      {
        "@type": "Question",
        name: "Why not one ZIP file?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Batch WAV files are large, and a browser has to hold an archive in memory before it hands it over — that is where batches fail halfway. We write each finished song to your disk as it completes instead.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a Chrome extension for this?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. The batch runs from this page. Extensions work by reading the Suno site itself, which is why they need broad access to a page you are logged into; a web tool only asks for a public song, playlist or profile link.",
        },
      },
      {
        "@type": "Question",
        name: "What if a song in my queue was never shared publicly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It cannot be read — a private or unshared song has no public page for us to fetch. Share it first, then add it to the queue.",
        },
      },
    ],
  },
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/suno-bulk-download/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "Suno Bulk Download — Export Your Own Songs in One Go",
    description:
      "A playlist queue for your own Suno songs: inspect once, keep each track as it is delivered — WAV, MP3, cover art, and the video where one is published.",
    url: "https://wavkeep.com/suno-bulk-download/",
  },
  twitter: { card: "summary_large_image" },
};

export default function SunoBulkDownloadPage() {
  return (
    <main className="bulk">
      <article>
        <div className="hero">
          <div className="wrap">
            <h1>
              Suno bulk download — get <em>your own songs</em> out, one after another
            </h1>
            <p className="sub">
              Paste a public Suno profile or playlist link. We list what is in it, you tick the songs you want, and each one is kept
              as Suno already published it — WAV, MP3, cover art and, where a song has one, the vertical lyric video.
              No archive to unpack, and it doesn&apos;t spend a Suno download.
            </p>
          </div>
        </div>

        <section className="bulk-tool">
          <div className="wrap">
            <BulkQueue />
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>Why a queue instead of one ZIP</h2>
            <div className="steps">
              <div className="step">
                <h3>Because batches fail at the end, not the start</h3>
                <p>A browser archive has to be held in memory until every song is inside it. On a 30-song run that means one slow track or one dropped connection can take the whole batch with it — you wait, you fail, you start over.</p>
              </div>
              <div className="step">
                <h3>So each song lands on its own</h3>
                <p>Every finished track is written to your disk the moment it completes. Interrupt the run and you keep what already arrived; resume and the rest carries on. Nothing is re-downloaded to rebuild an archive.</p>
              </div>
              <div className="step">
                <h3>And you see the real state of every song</h3>
                <p>The list marks each track as it goes — kept, waiting, or skipped because something about it was not readable. No silent &quot;done&quot; over a half-full folder.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>What you get per song</h2>
            <div className="table-scroll">
              <table className="cmp">
                <thead>
                  <tr><th>File</th><th>When it&apos;s there</th><th>What it is</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>WAV</strong></td><td>Always</td><td>48 kHz, opens straight in a DAW or editor. No second lossy pass on our side.</td></tr>
                  <tr><td><strong>MP3</strong></td><td>Always</td><td>Smaller copy for phones, messaging and quick sharing.</td></tr>
                  <tr><td><strong>Original (as delivered)</strong></td><td>Always</td><td>The file the page already serves, untouched — the same one you&apos;d get by saving it yourself.</td></tr>
                  <tr><td><strong>Cover art</strong></td><td>When the song has one</td><td>Saved alongside the audio, so your library isn&apos;t a wall of grey placeholders.</td></tr>
                  <tr><td><strong>Original video (MP4)</strong></td><td>Only if published</td><td>For songs that carry a video track. Everything else is audio — nothing is generated or filled in.</td></tr>
                  <tr><td><strong>Lyrics</strong></td><td>When the song has them</td><td>Written out as a plain text file next to the audio.</td></tr>
                </tbody>
              </table>
            </div>
            <p className="hint">Ticked songs are kept exactly as they exist. We don&apos;t render, re-sing, extend or re-encode anything — if a track has no video, the queue shows audio only rather than inventing one.</p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>Do you need a Chrome extension for this?</h2>
            <p>
              No — and it&apos;s worth knowing why so many people search for one. An extension lives inside the Suno site: it has to read your
              logged-in page to find the files, which is why it asks for broad access to suno.com. A browser-based tool asks for something much
              smaller — a public link you could paste to a friend.
            </p>
            <div className="table-scroll">
              <table className="cmp">
                <thead>
                  <tr><th></th><th>Browser extension</th><th>This page</th></tr>
                </thead>
                <tbody>
                  <tr><td><strong>What it reads</strong></td><td>Your logged-in Suno pages</td><td>One public playlist, profile or song link</td></tr>
                  <tr><td><strong>Access it needs</strong></td><td>Broad permission on suno.com</td><td>None — it&apos;s just a URL you paste</td></tr>
                  <tr><td><strong>Install</strong></td><td>Add to browser, keep it updated</td><td>Nothing to install</td></tr>
                  <tr><td><strong>Works on</strong></td><td>Desktop browsers only</td><td>Phone, tablet and desktop</td></tr>
                  <tr><td><strong>Batch behaviour</strong></td><td>Depends on the build</td><td>Queue with pause, resume and per-song status</td></tr>
                </tbody>
              </table>
            </div>
            <p className="hint">If you already use an extension and it works for you, that&apos;s fine — this page exists for the cases it doesn&apos;t cover, like keeping files on a phone, or archiving a whole profile without installing anything.</p>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>Bulk export vs the download button</h2>
            <p>
              Suno&apos;s own help pages describe a Download button on each song, with monthly allowances on the paid plans and a limited format on
              the free plan. That button is the right tool for one song you want right now. A queue is for the other job — getting a whole profile
              or playlist out before a subscription lapses, or before a track gets edited.
            </p>
            <div className="table-scroll">
              <table className="cmp">
                <thead>
                  <tr><th>Your situation</th><th>What usually fits</th></tr>
                </thead>
                <tbody>
                  <tr><td>One song, right now</td><td>The Download button on the song page</td></tr>
                  <tr><td>Twenty songs before your plan renews</td><td>A queue — one pass, each file saved as it finishes</td></tr>
                  <tr><td>You want the cover art and lyrics too</td><td>A queue saves them next to the audio</td></tr>
                  <tr><td>You&apos;re on your phone</td><td>The web queue — nothing to install</td></tr>
                  <tr><td>A song was never shared publicly</td><td>Nothing can read it; share it first</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>Questions people ask before a batch</h2>
            <details open>
              <summary>Can I download all of my Suno songs at once?</summary>
              <div className="bd"><p>As a queue, yes. Paste your profile or playlist link, we list the songs in it, and each one is kept on its own. You can pause the run, close the tab and come back, and anything already saved stays saved.</p></div>
            </details>
            <details>
              <summary>Does a batch spend my Suno download allowance?</summary>
              <div className="bd"><p>It doesn&apos;t go through the download button. Suno&apos;s own help pages describe download allowances tied to paid plans — keeping a copy from a public link is a separate action and doesn&apos;t draw on that count. You can check the current wording on Suno&apos;s help center any time.</p></div>
            </details>
            <details>
              <summary>How many songs can I queue at once?</summary>
              <div className="bd"><p>Start with 20–30. The queue itself has no hard limit, but a long run depends on your connection as much as on us, and a smaller batch is easier to verify. You can run it again for the rest.</p></div>
            </details>
            <details>
              <summary>Why is one song in my list marked &quot;audio only&quot;?</summary>
              <div className="bd"><p>Because that song has no published video file — a normal outcome, not a failure. You still get the WAV, MP3, original file, cover art and lyrics. The queue states it plainly instead of pretending a video exists.</p></div>
            </details>
            <details>
              <summary>Can I pick only some of the songs?</summary>
              <div className="bd"><p>Yes. After the list is read, untick anything you don&apos;t want. Use <b>Select all</b> to flip everything back on, and <b>Keep selected</b> to start the run.</p></div>
            </details>
            <details>
              <summary>What if I get a new song halfway through a run?</summary>
              <div className="bd"><p>Read the list again when you&apos;re done. Songs you&apos;ve already kept are matched by ID, so the queue won&apos;t quietly download the same track twice unless you tick it again.</p></div>
            </details>
          </div>
        </section>

        <section>
          <div className="wrap">
            <h2>Related tools</h2>
            <div className="tools">
              <Link className="tool-link" href="/wav-downloader/"><b>WAV downloader</b><small>Single song to 48 kHz WAV — the quick path when you only need one track.</small></Link>
              <Link className="tool-link" href="/suno-video-downloader/"><b>Suno video downloader</b><small>For songs that carry the vertical lyric video, and a plain answer when one doesn&apos;t.</small></Link>
              <Link className="tool-link" href="/"><b>Suno downloader</b><small>Start here: paste one public link, keep what&apos;s already published.</small></Link>
            </div>
          </div>
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
    </main>
  );
}
