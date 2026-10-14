import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="fcols">
          <div>
            <Link className="logo" href="/">
              WAV<span>Keep</span>
            </Link>
            <p className="brand-blurb">Save the file a public Suno song page already published. WAV, MP3, cover art, and the lyric video when one exists.</p>
          </div>
          <div>
            <h4>Tools</h4>
            <ul>
              <li><Link href="/wav-downloader/">WAV Downloader</Link></li>
              <li><Link href="/suno-video-downloader/">Suno Video Downloader</Link></li>
              <li><Link href="/suno-bulk-download/">Bulk Download</Link></li>
              <li><Link href="/udio-downloader/">Udio Downloader</Link></li>
            </ul>
          </div>
          <div>
            <h4>Guides</h4>
            <ul>
              <li><Link href="/suno-stems/">Suno stems explained</Link></li>
              <li><Link href="/suno-watermark/">Download limits &amp; watermark</Link></li>
              <li><Link href="/suno-wav-downloader/">Suno to WAV</Link></li>
            </ul>
          </div>
          <div>
            <h4>Site</h4>
            <ul>
              <li><Link href="/about/">About WAV Keep</Link></li>
              <li><Link href="/contact/">Contact</Link></li>
              <li><Link href="/privacy/">Privacy</Link></li>
              <li><Link href="/terms/">Terms</Link></li>
              <li><Link href="/dmca/">DMCA</Link></li>
              <li><Link href="/disclaimer/">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="disc">
          <b>Not affiliated with Suno or Udio.</b> WAV Keep is an independent tool and is not endorsed by, sponsored by, or officially connected to Suno, Inc. or Udio, Inc. “Suno” and “Udio” are trademarks of their respective owners and appear here only to describe which links this tool can read.
          <br /><br />
          WAV Keep does not host, sell or distribute music. It saves files that a song page already publishes to the public internet, at the request of a person holding that link. You are responsible for having the rights to save, keep and use the audio. If you believe a song is being saved without permission, see our <Link href="/dmca/">DMCA</Link> page.
        </div>
        <p className="copy">© 2026 WAV Keep · Also on <a href="https://mp3keep.com">mp3keep.com</a> (same team, same tool)</p>
      </div>
    </footer>
  );
}
