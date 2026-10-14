import type { Metadata } from "next";
import Link from "next/link";

const title = "About WAV Keep — what this tool does, and what it won't claim | WAV Keep";
const description =
  "WAV Keep keeps the audio file a public Suno song page already serves. Who runs it, how the fetch works, and the promises we deliberately refuse to make — no watermark removal, no stems, no Udio files.";

const aboutLd = {
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
      description: "A web tool that keeps the audio and video files a public Suno song page already publishes.",
      email: "tinaliu660@gmail.com",
      sameAs: [],
    },
    {
      "@type": "AboutPage",
      "@id": "https://wavkeep.com/about/#webpage",
      url: "https://wavkeep.com/about/",
      isPartOf: { "@id": "https://wavkeep.com/#website" },
      about: { "@id": "https://wavkeep.com/#org" },
      inLanguage: "en",
      dateModified: "2026-10-14",
      citation: [
        {
          "@type": "Article",
          name: "Upcoming Changes FAQ: Downloads, Models, and Terms of Service",
          url: "https://help.suno.com/en/articles/13614785",
          publisher: { "@type": "Organization", name: "Suno Help Center" },
        },
        {
          "@type": "Article",
          name: "Introduction to Studio",
          url: "https://help.suno.com/en/articles/7940161",
          publisher: { "@type": "Organization", name: "Suno Help Center" },
        },
        {
          "@type": "Article",
          name: "Changes associated with the Universal Music Group (UMG) partnership",
          url: "https://help.udio.com/en/articles/12683565-changes-associated-with-the-universal-music-group-umg-partnership",
          publisher: { "@type": "Organization", name: "Udio Help Center" },
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/about/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "article",
    siteName: "WAV Keep",
    title: "About WAV Keep",
    description: "What WAV Keep does, how it does it, and what it won't promise. Not affiliated with Suno or Udio.",
    url: "https://wavkeep.com/about/",
  },
  twitter: { card: "summary_large_image" },
};

export default function AboutPage() {
  return (
    <main className="ab">
      <article className="wrap">
        <div className="hero">
          <h1>About WAV Keep</h1>
          <p className="ab-lede">
            A small web tool that takes your own songs out of Suno — keeping the file that Suno&apos;s public song page
            already serves. Where you save a WAV, that audio is written once into an editable container, with no second lossy pass from us.
            This page explains how it works, who&apos;s behind it, and the promises we deliberately refuse to make.
          </p>
        </div>

        <section>
          <h2 className="ab-h">Why this exists</h2>
          <p>
            Two platform changes in late 2025 and 2026 pushed people into the same spot: they had songs they had made, and no easy way
            to get the files onto their own machine. Suno tightened its download rules in <b>September 2026</b>; Udio switched downloads off
            entirely in <b>October 2025</b> as part of its Universal Music Group agreement. Between them, &quot;how do I keep my own song&quot; went from
            a non-question to a search box.
          </p>
          <p>
            WAV Keep answers the half of that question that has an honest answer. Where a public Suno page already publishes a file,
            we let you take a copy of it — WAV, MP3, cover art, and where the song has one, the video — without going through the
            download button on suno.com, so the copy costs you nothing from your allowance. Where a file was never published,
            we say so and stop.
          </p>
        </section>

        <section>
          <h2 className="ab-h">What it does, in plain words</h2>
          <ol>
            <li>You paste a <b>public</b> link — a song page, a playlist, or a profile.</li>
            <li>We read that page and list what it actually publishes.</li>
            <li>You pick the formats you want; we save the file as delivered.</li>
          </ol>
          <p>
            Three things follow from that, and they&apos;re the reason some requests fail: a song you never shared publicly has no public page,
            so there is nothing to read; a song without a video has no video file, and we won&apos;t render one to make the count look better;
            and a file is what it is — a WAV is the published audio written once, and we don&apos;t describe that result as a master or a cleaner file.
          </p>
          <p>
            No sign-in, no account, no app to install. It runs from this page and asks for no permission on any other site — which is why
            it isn&apos;t a browser extension.
          </p>
        </section>

        <section>
          <h2 className="ab-h">What we won&apos;t promise</h2>
          <div className="table-scroll">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Claim</th>
                  <th>Our answer</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>“Watermark remover / watermark-free audio”</td>
                  <td className="n">We don&apos;t do this</td>
                  <td>
                    Suno announced audio watermarking and fingerprinting for generated songs, with reports describing the mark as carried <em>inside</em> the audio. Taking it out means processing the whole track. We hand back the published file as published — mark included — and point you to <Link href="/suno-watermark/">what the mark is</Link> instead of claiming around it.
                  </td>
                </tr>
                <tr>
                  <td>“Stem splitter / download stems from a link”</td>
                  <td className="n">We don&apos;t do this</td>
                  <td>
                    Stems aren&apos;t separate files sitting on a public song page; a public page publishes the finished mix. Suno&apos;s own help pages describe exporting individual tracks through <b>Studio</b>, which is on the Premier plan. Details on <Link href="/suno-stems/">the stems page</Link>.
                  </td>
                </tr>
                <tr>
                  <td>“Udio downloader”</td>
                  <td className="n">Nobody can, right now</td>
                  <td>
                    Udio&apos;s help center states that downloading of audio, video, and stems has been disabled. We keep a page explaining <Link href="/udio-downloader/">what was switched off and when</Link>, and we don&apos;t sell a workaround for it.
                  </td>
                </tr>
                <tr>
                  <td>“Lossless / uncompressed / studio master quality”</td>
                  <td className="n">We don&apos;t write this</td>
                  <td>
                    Our WAV export carries the audio from the file the page serves, at 48 kHz, ready for a DAW. What it does is <b>no second lossy pass</b> on our side. Calling the result a master would be marketing, not a description.
                  </td>
                </tr>
                <tr>
                  <td>“We&apos;re the official Suno downloader”</td>
                  <td className="n">Absolutely not</td>
                  <td>
                    WAV Keep is independent. It is not affiliated with, endorsed by, or operated by Suno or Udio — see <Link href="/terms/">our Terms</Link>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="ab-note">
            <b>If a page on this site ever sounds like a promise we&apos;ve refused here, that&apos;s a bug in our copy, not a feature.</b> Forward it to the address below and we&apos;ll fix the wording.
          </p>
        </section>

        <section>
          <h2 className="ab-h">Where our claims come from</h2>
          <div className="ab-sources">
            <p>
              We quote platform documentation rather than paraphrasing it, so you can check the sentence yourself. As fetched on <b>14 October 2026</b>:
            </p>
            <ul>
              <li>
                Suno Help Center —{" "}
                <a href="https://help.suno.com/en/articles/13614785" rel="nofollow noopener" target="_blank">
                  “Upcoming Changes FAQ: Downloads, Models, and Terms of Service”
                </a>{" "}
                (download rules; and that stems from a song count as part of that song&apos;s download, not separate downloads)
              </li>
              <li>
                Suno Help Center —{" "}
                <a href="https://help.suno.com/en/articles/7940161" rel="nofollow noopener" target="_blank">
                  “Introduction to Studio”
                </a>{" "}
                (the Export menu&apos;s Multitracks option; Studio&apos;s plan requirement)
              </li>
              <li>
                Udio Help Center —{" "}
                <a href="https://help.udio.com/en/articles/12683565-changes-associated-with-the-universal-music-group-umg-partnership" rel="nofollow noopener" target="_blank">
                  “Changes associated with the UMG partnership”
                </a>{" "}
                (downloading of audio, video, and stems disabled)
              </li>
              <li>
                Suno —{" "}
                <a href="https://suno.com/terms-of-service" rel="nofollow noopener" target="_blank">
                  Terms of Service
                </a>{" "}
                (last revised 10 August 2026, effective 3 September 2026)
              </li>
            </ul>
          </div>
          <p>
            Platform rules move. When a plan tier or a disabled feature changes, the page that quotes it should say so and carry a date — which is why each of those pages links back here.
          </p>
        </section>

        <section>
          <h2 className="ab-h">Who runs it</h2>
          <p>
            WAV Keep is a solo project, not a company with a press team. One person builds it, answers email, and maintains it — running the tool against real songs and real failure cases, and publishing what doesn&apos;t work as plainly as what does. If you&apos;d like to know who&apos;s writing to you, the reply comes from the same address below.
          </p>
        </section>

        <section className="ab-contact">
          <h2>Contact, rights and takedowns</h2>
          <p>
            <b>General questions, bugs, wording you think is wrong:</b> <a href="mailto:tinaliu660@gmail.com">tinaliu660@gmail.com</a>
          </p>
          <p>
            <b>Copyright concerns about your own songs:</b> <Link href="/dmca/">DMCA policy</Link> — including how to ask us to stop resolving a link of yours, which takes effect the same day.
          </p>
          <p>
            <b>The rules of using this site:</b> <Link href="/terms/">Terms of Service</Link> · <Link href="/privacy/">Privacy Policy</Link>. We don&apos;t host copies of your songs; a file you take is on your machine.
          </p>
          <div className="ab-links">
            <Link href="/">Downloader</Link>
            <Link href="/wav-downloader/">WAV</Link>
            <Link href="/suno-wav-downloader/">Suno to WAV</Link>
            <Link href="/suno-bulk-download/">Bulk export</Link>
            <Link href="/suno-watermark/">Watermarks</Link>
          </div>
        </section>

        <p className="ab-updated">
          This page last reviewed 14 October 2026. WAV Keep is an independent tool and is not affiliated with, endorsed by, or operated by Suno or Udio. All product names belong to their respective owners.
        </p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
    </main>
  );
}
