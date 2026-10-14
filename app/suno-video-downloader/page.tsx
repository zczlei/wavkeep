import type { Metadata } from "next";
import Link from "next/link";
import { DownloadTool, videoPageNote } from "@/components/download-tool";

const title = "Suno Video Downloader — Save the Published MP4 | WAV Keep";
const description =
  "Paste a public Suno link. If that song publishes a video, you get it as delivered — vertical 9:16, with the cover and lyrics already on screen.";

const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WAV Keep — Suno Video Downloader",
  url: "https://wavkeep.com/suno-video-downloader/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description: "Download the MP4 video file a public Suno song publishes, exactly as delivered.",
};

const specs = [
  ["Container / video codec", "MP4 · H.264"],
  ["Frame size · aspect", "824×1464 · 0.5628 ≈ 9:16"],
  ["Frame rate", "10 fps"],
  ["Video bitrate", "~97–117 kbps"],
  ["Audio inside it", "AAC · 48 kHz · ~194–203 kbps"],
  ["Length", "The full song, not a clip"],
  ["What changes between songs", "Bitrate and the lyrics on screen"],
] as const;

const faqs = [
  ["Why is there no video for some Suno songs?", "Some public songs expose audio and cover art only. We read what the song page publishes, so when no video file is there we tell you instead of offering a dead button. We do not render one to fill the gap."],
  ["Is the MP4 a music video?", "No. It's Suno's own vertical lyric card — measured at 824×1464 at 10 fps with AAC audio at 48 kHz. Same picture as the share page, nothing added."],
  ["Can I post it to Reels, Shorts or TikTok?", "The shape is right — it's 9:16. The width is about three-quarters of a 1080×1920 upload and the platforms re-encode it, so treat it as a preview or story clip rather than a master."],
  ["Is there a watermark on it?", "Whatever appears on the file is what Suno publishes — we don't add anything and we don't remove anything. We haven't verified a clean version, so we won't promise one."],
  ["Does this use my Suno download allowance?", "No. We never sign in and never go through the download menu, so saving a video here doesn't spend one of your monthly downloads."],
  ["Can I download someone else's song as a video?", "Use it on songs you made or content you're permitted to save. A downloadable file is not a licence."],
  ["Can you make a real video out of my song?", "Not here — this page saves files that already exist. Turning a song into an edited video is a creative job, and the tools that do it are a different product."],
] as const;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/suno-video-downloader/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://wavkeep.com/suno-video-downloader/",
  },
};

export default function SunoVideoPage() {
  return (
    <main>
      <div className="hero subpage">
        <div className="wrap">
          <h1>Suno video downloader — save the video <em>Suno published</em> for your song</h1>
          <p className="sub">
            Paste a public Suno link. If that song has a video file, you get it exactly as delivered:
            vertical 9:16, your cover and lyrics already on screen, audio intact. If it doesn&apos;t, we say so before you
            click — and the audio and artwork are still there. <b>We never build a video, add captions or stretch your
            cover to fit.</b>
          </p>
          <DownloadTool
            accept="suno-song"
            primary="video"
            pendingLabel="Inspecting…"
            invalidMessage="That link isn't public, so there's nothing published to read."
            failureMessage="Could not read that song just now. Try again in a moment."
            inputLabel="Public Suno song link"
            describe={videoPageNote}
            hint={
              <p className="hint">
                Public <code>suno.com/song/…</code> links only on this page. Nothing is fetched until you press Inspect.
              </p>
            }
            formats={[
              { k: "video", kicker: "Only if published", name: "Original video (MP4)", detail: "9:16, lyrics on screen, as delivered" },
              { k: "original", kicker: "Same file, no edit", name: "Original (as delivered)", detail: "What the CDN serves for this track" },
              { k: "wav", kicker: "DAW-ready", name: "WAV", detail: "Audio decoded from the same source" },
              { k: "art", kicker: "With metadata", name: "Cover art", detail: "The artwork the song page publishes" },
            ]}
          />
        </div>
      </div>

      <section>
        <div className="wrap">
          <h2>What the file actually is — measured, not guessed</h2>
          <p className="lead">We read real Suno CDN files with a media inspector rather than describing them from memory. Three songs, three consistent shapes:</p>
          <table className="spec">
            <tbody>
              {specs.map(([label, value]) => (
                <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="hint">One file carries both picture and sound — so the audio options above come out of it, they aren&apos;t a second source.</p>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>What it&apos;s good for, and what it isn&apos;t</h2>
          <div className="grid quad">
            <article className="card"><span className="tag">GOOD FOR</span><h3>Sharing a song as it looks</h3><p>The same picture your share page shows — worth dropping into a story, a preview post or a DM.</p></article>
            <article className="card"><span className="tag">GOOD FOR</span><h3>Keeping your own copy</h3><p>Suno publishes this file; saving it costs you nothing and doesn&apos;t touch your download count.</p></article>
            <article className="card"><span className="tag">NOT</span><h3>An edited music video</h3><p>10 fps at ~100 kbps is a share card, not footage. No cuts, no motion graphics, no grade — and an edit like that should be yours anyway.</p></article>
            <article className="card"><span className="tag">NOT</span><h3>A 1080×1920 master</h3><p>It&apos;s about three-quarters of a full-HD vertical upload in width, and platforms re-encode it. Correct shape, preview-grade pixels.</p></article>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>Not every song has a video — and we name the reason</h2>
          <p className="lead">Some public Suno songs expose audio and cover art only. Pressing Inspect gives you one of three answers, and only the first one offers a button.</p>
          <div className="outcomes">
            <article className="oc y"><b>1 · Video available</b><span>download offered, as delivered</span><p>The song publishes a video file. You get it frame for frame.</p></article>
            <article className="oc n"><b>2 · No video published</b><span>button hidden, not greyed out mid-click</span><p>That song was only ever given audio and artwork. We can&apos;t create a video Suno hasn&apos;t made.</p></article>
            <article className="oc q"><b>3 · Published, not reachable now</b><span>retry, and we say so</span><p>The file exists but didn&apos;t answer this time. It&apos;s a fetch that&apos;s failing, not a song that&apos;s missing one.</p></article>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2>How to save it</h2>
          <div className="steps">
            <div className="step"><h3>Copy the public song link</h3><p>The address in the form <code>suno.com/song/…</code>. Private drafts don&apos;t work — there&apos;s nothing published to read.</p></div>
            <div className="step"><h3>Inspect</h3><p>We list what that song actually exposes. No sign-in, no download button involved.</p></div>
            <div className="step"><h3>Take the MP4</h3><p>Saved as delivered. Compare it against your own share page — it should match frame for frame.</p></div>
          </div>
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
            <Link className="tool-link" href="/wav-downloader/"><b>WAV downloader</b><small>The audio out of the same file, 48 kHz, DAW-ready.</small></Link>
            <Link className="tool-link" href="/"><b>Suno downloader</b><small>Everything a public song publishes, in one pass.</small></Link>
            <Link className="tool-link" href="/suno-bulk-download/"><b>Bulk export</b><small>Whole sets, one at a time, no failed ZIP.</small></Link>
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
    </main>
  );
}
