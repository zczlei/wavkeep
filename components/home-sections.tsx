import Link from "next/link";
import { faqs } from "@/lib/content";

const tools = [
  ["/wav-downloader/", "WAV Downloader", "General WAV saving and Suno-to-WAV without a re-encode pass"],
  ["/suno-video-downloader/", "Suno Video Downloader", "The MP4 lyric video, for songs that have one"],
  ["/suno-bulk-download/", "Bulk Download", "Keep a whole page or playlist of songs at once"],
  ["/suno-wav-downloader/", "Suno WAV Downloader", "Audio-only path for older songs"],
  ["/suno-mp3-downloader/", "Suno MP3 Downloader", "The published MP3, without spending a download"],
  ["/suno-stems/", "Suno Stems", "What stems Suno actually gives you, and what it doesn't"],
  ["/suno-watermark/", "Watermark & download limits", "How Suno's caps work and what they don't cover"],
  ["/udio-downloader/", "Udio Downloader", "Why a udio.com link can't fetch a file"],
] as const;

const reasons = [
  ["no re-encode", "As delivered", "Whatever Suno's CDN serves for the track is the file you save. You can check it against the source yourself — same codec, same duration, nothing stretched."],
  ["metadata", "Cover art, not just audio", "Title, artist and song ID come along with the artwork, so a folder of your own songs stays readable in a player instead of a wall of UUIDs."],
  ["bulk", "Past your daily 20", "Back up a whole catalog or a playlist page in one pass, one song at a time, instead of 20 clicks per month."],
  ["mobile", "Works on a phone", "No desktop app, no extension, no ffmpeg command. The same paste box on iOS and Android."],
  ["audio first", "WAV for the session", "Drop the audio into a DAW without a conversion step — the reason people move off a delivered file in the first place."],
  ["honest limits", "What we don't do", "We don't sign in, don't switch on paid Suno features, don't generate stems Suno never published, and don't make a video for a song that has none."],
] as const;

function FaqAnswer({ text, link }: { text: string; link?: { phrase: string; href: string } }) {
  if (!link) return <p>{text}</p>;
  const at = text.indexOf(link.phrase);
  if (at < 0) return <p>{text}</p>;
  return (
    <p>
      {text.slice(0, at)}
      <Link href={link.href}>{link.phrase}</Link>
      {text.slice(at + link.phrase.length)}
    </p>
  );
}

export function HomeSections() {
  return (
    <>
      <section id="tools">
        <div className="wrap">
          <h2>What each tool does</h2>
          <p className="lead">Same paste box on every page. Pick the one that matches what you want to keep.</p>
          <div className="tools">
            {tools.map(([href, title, text]) => (
              <Link className="tool-link" href={href} key={href}>
                <b>{title}</b>
                <small>{text}</small>
                <i>Open tool</i>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how">
        <div className="wrap">
          <h2>Three steps, no account</h2>
          <div className="steps">
            <div className="step">
              <h3>Copy the song link</h3>
              <p>Open the track on suno.com and copy its public address. It has to be a song you can already see — private songs aren&apos;t reachable by anyone.</p>
            </div>
            <div className="step">
              <h3>Press Inspect</h3>
              <p>We read what that page publishes and report each format separately as available or not available. We never ask for a Suno login.</p>
            </div>
            <div className="step">
              <h3>Save what exists</h3>
              <p>Each button pulls one file as delivered. No transcoding pass, no re-render, no added captions.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="formats">
        <div className="wrap">
          <h2>What you get, and what we won&apos;t promise</h2>
          <div className="outcomes">
            <article className="oc y">
              <b>Video available</b>
              <span>Original video (MP4)</span>
              <p>The vertical lyric card Suno rendered for that song — the same picture as the share page, frame for frame. Right for a story or a preview; not an edited music video, and we don&apos;t render one.</p>
            </article>
            <article className="oc n">
              <b>No video published for this song</b>
              <span>button stays hidden</span>
              <p>Some songs expose audio and cover art only. You still get WAV, MP3, artwork and lyrics. We can&apos;t create a video Suno hasn&apos;t published.</p>
            </article>
            <article className="oc q">
              <b>Published, but not reachable right now</b>
              <span>try again in a minute</span>
              <p>Occasionally a file exists but won&apos;t answer a fetch. We say &quot;couldn&apos;t confirm&quot; rather than &quot;doesn&apos;t exist&quot;, because we can always re-check — the source can&apos;t.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="why">
        <div className="wrap">
          <h2>Why people keep this bookmark open</h2>
          <div className="grid">
            {reasons.map(([tag, title, text]) => (
              <article className="card" key={tag}>
                <span className="tag">{tag}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <h2>Questions people actually ask</h2>
          {faqs.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <FaqAnswer text={item.a} link={item.link} />
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
