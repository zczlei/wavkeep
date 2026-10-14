import type { Metadata } from "next";
import Link from "next/link";
import { DownloadTool, mp3PageNote } from "@/components/download-tool";

const email = "tinaliu660@gmail.com";
const title = "Suno MP3 Downloader — Save Your Suno Songs as MP3 Without Using a Download | WAV Keep";
const description =
  "Free Suno accounts already get an MP3 — the scarce thing is the count: 7 downloads for life, 20 a month on Pro. Paste a public song link and save the MP3 without touching your account or its download menu.";

const faqs = [
  [
    "Does this use my Suno download allowance?",
    "No. We never sign in to your account and never call Suno's download menu, so saving a file here doesn't spend one of your monthly downloads. What Suno limits for your own account is unchanged — we can't raise a cap that isn't ours to raise.",
  ],
  [
    "Is the MP3 the same file as Suno's download button?",
    "No. Suno's download button, on a free account, generates a lightweight MP3 and spends one of your downloads. This page never opens that menu. It saves the MP3 the public CDN publishes for the song, when that file is there. The playable file we measured is AAC at 48 kHz, about 194 kbps. The MP3 is the smaller file for sharing; it is not the file to master from.",
  ],
  [
    "Which is better quality, Suno's MP3 or yours?",
    "We won't rank them. Both are lossy, and any page that claims a quality edge on an MP3 is selling you marketing. If quality matters to you, save the Original or the WAV and compare yourself.",
  ],
  [
    "Can I download all of my Suno songs as MP3?",
    "Not as one archive from this page. A browser-side bundle of hundreds of files fails late and quietly, so we don't offer one. For a whole set, use the bulk export page, which runs a queue one song at a time and states the real limit up front.",
  ],
  [
    "Does it work on iPhone or Android?",
    "Yes. It's a web page: no app, no browser extension, no command-line tool. Same paste box on every screen size.",
  ],
  [
    "Why are some songs missing?",
    "This page only reads public song pages. A private, unlisted or deleted song has nothing public to read, and we won't try to reach it. If a link you own fails, check that the song is published.",
  ],
  [
    "Can I release these MP3s commercially?",
    "That's decided by Suno's terms and the plan you were on when you made the song — not by this tool, and not by the fact that you hold a file. Ask Suno, or read their terms.",
  ],
  [
    "Do you remove the watermark?",
    "No, and no honest tool can. Suno has announced watermarking embedded in the audio itself. We save the published file and don't alter it to take a mark out, so whatever the source carries comes through. What we verified about watermarks is on the watermark page.",
  ],
] as const;

const pageLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://wavkeep.com/#website",
      url: "https://wavkeep.com/",
      name: "WAV Keep",
      publisher: { "@id": "https://wavkeep.com/#org" },
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": "https://wavkeep.com/#org",
      name: "WAV Keep",
      url: "https://wavkeep.com/",
      email,
      description: "An independent web tool that keeps the files a public Suno song page already publishes.",
    },
    {
      "@type": "WebPage",
      "@id": "https://wavkeep.com/suno-mp3-downloader/#webpage",
      url: "https://wavkeep.com/suno-mp3-downloader/",
      name: "Suno MP3 Downloader",
      isPartOf: { "@id": "https://wavkeep.com/#website" },
      inLanguage: "en",
      dateModified: "2026-10-14",
      description: "Save a Suno song as MP3 from its public link, without spending one of your account's downloads.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "WAV Keep", item: "https://wavkeep.com/" },
        { "@type": "ListItem", position: 2, name: "Suno MP3 downloader", item: "https://wavkeep.com/suno-mp3-downloader/" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([name, text]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text },
      })),
    },
  ],
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/suno-mp3-downloader/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "article",
    siteName: "WAV Keep",
    title: "Suno MP3 downloader — the MP3 was never the hard part",
    description: "Suno's free plan already hands you an MP3. What it caps is how many times. Save the file from a public song link instead.",
    url: "https://wavkeep.com/suno-mp3-downloader/",
  },
  twitter: { card: "summary" },
};

export default function SunoMp3DownloaderPage() {
  return (
    <main className="mp">
      <div className="hero subpage">
        <div className="wrap">
          <h1>Suno MP3 downloader — the MP3 was never the hard part</h1>
          <p className="sub">
            Free accounts already get one. What&apos;s scarce is the count: <b>7 downloads for the lifetime of a free account, 20 a month on Pro</b> (Suno&apos;s own help center, September 2026). This page saves the MP3 a public Suno song page already publishes — <b>without signing in, and without spending one of your downloads</b>.
          </p>
          <DownloadTool
            accept="suno-song"
            primary="mp3"
            pendingLabel="Inspecting…"
            invalidMessage="Paste a public song link in the form suno.com/song/… — nothing is fetched before you do."
            failureMessage="Could not read that song just now. Try again in a moment."
            inputLabel="Public Suno song link"
            describe={mp3PageNote}
            hint={
              <p className="hint">
                Public <b>suno.com</b> song links only. Nothing is fetched until you press Inspect.
              </p>
            }
            formats={[
              { k: "mp3", kicker: "Small and shareable", name: "MP3", detail: "The MP3 the CDN publishes, when one exists" },
              { k: "original", kicker: "No conversion at all", name: "Original (as delivered)", detail: "Exactly the file the CDN serves" },
              { k: "wav", kicker: "Editable · 48 kHz", name: "WAV", detail: "Decoded once from the delivered audio" },
              { k: "art", kicker: "With metadata", name: "Cover art", detail: "The artwork the song page publishes" },
              { k: "video", kicker: "Only if published", name: "Original video (MP4)", detail: "Suno's vertical lyric card, when the song has one" },
            ]}
          />
          <div className="mp-note">
            <b>Read this before you use the page:</b> an MP3 is a lossy format. This page saves the MP3 the song&apos;s public CDN already publishes — we don&apos;t encode a new one, and we won&apos;t tell you it sounds identical to the playable file or better than Suno&apos;s own button. If you want the file to edit or master, save <b>Original</b> or the <Link href="/suno-wav-downloader/">WAV</Link> instead.
          </div>
        </div>
      </div>

      <section>
        <div className="wrap">
          <h2>What you can save from one song link</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>Format</th><th>What it is</th><th>Use it for</th></tr>
              </thead>
              <tbody>
                <tr><td><b>MP3</b></td><td>The MP3 the public CDN publishes for that song, when one exists. Small, plays everywhere.</td><td>Sharing, phone listening, dropping into a chat</td></tr>
                <tr><td><b>Original (as delivered)</b></td><td>Exactly the file the CDN serves for that track. Nothing decoded, nothing re-made.</td><td>Your archive copy — the one to keep</td></tr>
                <tr><td><b>WAV</b></td><td>Decoded once from the delivered audio into an editable container. No second lossy pass.</td><td>Opening straight in a DAW or video editor</td></tr>
                <tr><td><b>Cover art</b></td><td>The artwork the song page publishes, with title, artist and song ID.</td><td>Keeping a folder readable instead of a wall of UUIDs</td></tr>
                <tr><td><b>Original video (MP4)</b></td><td>Only if the song publishes one. Suno&apos;s vertical lyric card, frame for frame.</td><td>Story clips and previews</td></tr>
              </tbody>
            </table>
          </div>
          <p className="lead">A format that isn&apos;t published for a given song shows as unavailable and its button stays hidden. We can&apos;t hand you a file the song page doesn&apos;t have.</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Why people look for a Suno MP3 downloader</h2>
          <p className="lead">Usually it isn&apos;t about the format. Suno&apos;s free plan already produces an MP3 — its own help center says the download button on a free account &quot;will generate a lightweight mp3&quot;. The friction is elsewhere, and all three causes have the same shape: <b>a count, a device, or a plan</b>.</p>
          <div className="steps">
            <div className="step"><h3>The counter, not the codec</h3><p>Free accounts get 7 downloads for the lifetime of the account; Pro gets 20 a month. Backing up a catalog of your own songs burns through that on the first afternoon. A public link doesn&apos;t have that problem.</p></div>
            <div className="step"><h3>Phone vs desktop</h3><p>Suno&apos;s help center notes that downloading from a mobile browser defaults to MP3, and that WAV files have to be fetched on the website. People searching this are often on a phone with no WAV button and no desktop at hand.</p></div>
            <div className="step"><h3>You don&apos;t want to log in</h3><p>To save a copy of a song you published, you shouldn&apos;t need an account session. This page reads the public page — nothing here touches your login.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Where those numbers come from</h2>
          <p className="lead">Quoted, not paraphrased, from Suno&apos;s own help center — so you can check the live article yourself. Plans and limits do change; the article carries its own date.</p>
          <div className="quote">
            <b>&quot;Wav file downloads are only available for Pro and Premier subscribers. Additionally, you must visit suno.com to get wav files; downloading via mobile will default to mp3 format. Free plan users currently only get one option: the Download button will generate a lightweight mp3.&quot;</b>
            <cite>
              — Suno Help Center, answering &quot;Why can&apos;t I download wav files?&quot;{" "}
              <a href="https://help.suno.com/en/articles/13614785" rel="nofollow noopener" target="_blank">Their Upcoming Changes FAQ</a>{" "}
              covers the download limits. Always check the live article.
            </cite>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>How to save a Suno song as MP3</h2>
          <div className="steps">
            <div className="step"><h3>Copy the public song link</h3><p>Open the track on suno.com and copy its address. It has to be a song you can already see — private and unlisted songs have no public page for anyone to read.</p></div>
            <div className="step"><h3>Paste it and press Inspect</h3><p>We read what that page publishes and report each format separately as available or not available.</p></div>
            <div className="step"><h3>Choose MP3</h3><p>One click, one file, straight to your machine. Keep the Original as well if you want the untouched copy.</p></div>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>MP3, WAV or original — which button</h2>
          <div className="table-scroll">
            <table>
              <thead>
                <tr><th>You want to</th><th>Press</th></tr>
              </thead>
              <tbody>
                <tr><td>Send it to a friend, listen on a phone, keep the file small</td><td><b>MP3</b> (this page)</td></tr>
                <tr><td>Open the audio in a DAW, a video editor, or a mastering chain</td><td><Link href="/suno-wav-downloader/">WAV</Link></td></tr>
                <tr><td>Keep the exact file Suno serves, unchanged</td><td><b>Original</b></td></tr>
                <tr><td>Save a whole playlist or catalog page at once</td><td><Link href="/suno-bulk-download/">Bulk export</Link></td></tr>
                <tr><td>Keep the vertical lyric video, for songs that have one</td><td><Link href="/suno-video-downloader/">Video</Link></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Questions people ask</h2>
          {faqs.map(([q, a], index) => (
            <details key={q} open={index === 0}>
              <summary>{q}</summary>
              <p>
                {q === "Can I download all of my Suno songs as MP3?" ? (
                  <>
                    Not as one archive from this page. A browser-side bundle of hundreds of files fails late and quietly, so we don&apos;t offer one. For a whole set, use <Link href="/suno-bulk-download/">the bulk export page</Link>, which runs a queue one song at a time and states the real limit up front.
                  </>
                ) : q === "Do you remove the watermark?" ? (
                  <>
                    No, and no honest tool can. Suno has announced watermarking embedded in the audio itself. We save the published file and don&apos;t alter it to take a mark out, so whatever the source carries comes through. <Link href="/suno-watermark/">What we verified about watermarks is here.</Link>
                  </>
                ) : (
                  a
                )}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Related tools</h2>
          <div className="tools">
            <Link className="tool-link" href="/suno-wav-downloader/"><b>Suno to WAV</b><small>The audio written into an editable 48 kHz container — the one to open in a DAW.</small></Link>
            <Link className="tool-link" href="/suno-bulk-download/"><b>Bulk export</b><small>A whole playlist or catalog page in one pass, with the limit stated up front.</small></Link>
            <Link className="tool-link" href="/wav-downloader/"><b>WAV downloader</b><small>General WAV saving from a public audio link.</small></Link>
          </div>
          <p className="mp-foot">Independent tool. Not affiliated with, endorsed by, or operated by Suno Inc. &quot;Suno&quot; is a mark of its owner and is used only to describe what this tool works with. See our <Link href="/terms/">Terms</Link>, <Link href="/disclaimer/">Disclaimer</Link> and <Link href="/privacy/">Privacy</Link>.</p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
    </main>
  );
}
