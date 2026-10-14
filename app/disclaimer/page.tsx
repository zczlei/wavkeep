import type { Metadata } from "next";
import Link from "next/link";

const email = "tinaliu660@gmail.com";

function mail(subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

const title = "Disclaimer — what WAV Keep is and isn't responsible for | WAV Keep";
const description =
  "WAV Keep saves the files a public Suno song page already publishes. No warranties, no control over platform changes, no watermark removal, no access to unpublished songs, and no legal advice. What to report where.";

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
      description: "An independent web tool that keeps the audio and video files a public Suno song page already publishes.",
      email,
    },
    {
      "@type": "WebPage",
      "@id": "https://wavkeep.com/disclaimer/#webpage",
      url: "https://wavkeep.com/disclaimer/",
      name: "Disclaimer",
      isPartOf: { "@id": "https://wavkeep.com/#website" },
      about: { "@id": "https://wavkeep.com/#org" },
      inLanguage: "en",
      dateModified: "2026-10-14",
      description:
        "Limits of responsibility for WAV Keep: no warranties, no control over platform changes, no watermark removal, no access to unpublished content.",
    },
    {
      "@type": "ItemList",
      name: "Official sources this disclaimer refers to",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Article",
            name: "Upcoming Changes FAQ: Downloads, Models, and Terms of Service",
            url: "https://help.suno.com/en/articles/13614785",
            publisher: { "@type": "Organization", name: "Suno Help Center" },
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "Article",
            name: "Changes associated with the Universal Music Group (UMG) partnership",
            url: "https://help.udio.com/en/articles/12683565-changes-associated-with-the-universal-music-group-umg-partnership",
            publisher: { "@type": "Organization", name: "Udio Help Center" },
          },
        },
      ],
    },
  ],
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/disclaimer/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "WAV Keep — Disclaimer",
    description: "As-is tool, no warranties. What we can't control, what we won't do, and whose rights your files are.",
    url: "https://wavkeep.com/disclaimer/",
  },
  twitter: { card: "summary" },
};

export default function DisclaimerPage() {
  return (
    <main className="dl">
      <article className="wrap">
        <div className="hero">
          <h1>Disclaimer</h1>
          <p className="dl-lede">
            WAV Keep takes a public song page and saves the audio and video files that page already publishes, to your device.
            It does not host them, does not improve them, and cannot override what the platform decides to publish. Read that as the whole page.
          </p>
        </div>

        <section className="dl-sec key">
          <h2>1. No warranties</h2>
          <p>
            The tool is provided <b>as it is</b>, without warranty of any kind — not for uninterrupted availability, not for a particular output, not for fitness for any purpose. In plain terms:
          </p>
          <ul>
            <li>
              A link that works today may resolve to nothing tomorrow. The file behind a public song page is the platform&apos;s file, on the platform&apos;s infrastructure, and <b>we do not control either</b>.
            </li>
            <li>
              Saved output is the file the page already publishes. A WAV is that audio written once into an editable container, with no second lossy pass from us. If a file is silent, short, missing a video track, or differs from what you expected, that came from the source page.
            </li>
            <li>We keep no copy. If you close the tab before the file lands, it is gone; check your browser&apos;s downloads folder, then re-run.</li>
            <li>
              You use this at your own risk, including the risk that <b>a plan you hold changes what you may download</b>, or that a platform disables downloads altogether.
            </li>
          </ul>
        </section>

        <section className="dl-sec warn">
          <h2>2. What we don&apos;t control: the platforms change the rules</h2>
          <p>This is the realistic failure mode for a tool like ours, so we&apos;re naming it instead of hiding it behind general words.</p>
          <ul>
            <li>
              <b>Suno</b> has already rewritten its download policy once (announced in its help center, effective September 2026), setting per-plan download limits. Whatever limits apply to your account apply whether or not you use us.
            </li>
            <li>
              <b>Udio</b> switched off downloading of audio, video and stems entirely as part of its Universal Music Group announcement — its own help center states it in those words. We do not and cannot restore that; see <Link href="/udio-downloader/">the Udio page</Link> for what we say and why.
            </li>
            <li>
              Announcements like these are <b>edited and re-dated by the platform</b>, and Udio&apos;s public changelog has logged no entry since May 2025. When something changes, we update our pages to match — we don&apos;t get to decide it, and we don&apos;t argue with it.
            </li>
          </ul>
          <div className="dl-quote">
            Everything we attribute to Suno or Udio on this site is quoted from their own help pages, with a link and a date. Where we have not verified something first-hand, we say so rather than implying it works.
          </div>
        </section>

        <section className="dl-sec">
          <h2>3. What we won&apos;t do</h2>
          <ol>
            <li>
              <b>No watermark removal.</b> Suno has announced watermarking and fingerprinting embedded in the audio itself, not as an overlay on screen. Any &quot;removal&quot; means re-encoding your track. We save the published file and don&apos;t alter it to take a mark out, so <b>we don&apos;t claim a clean output, and no tool honestly can</b>. See <Link href="/suno-watermark/">the watermark page</Link>.
            </li>
            <li>
              <b>No access to what isn&apos;t published.</b> Unreleased, private or unlisted songs have no public page for us to read, and we won&apos;t attempt to reach them. If you send us a link with a token or share secret in it, we won&apos;t use it.
            </li>
            <li>
              <b>No getting you a paid feature for free.</b> If a format or a function sits behind a plan, we&apos;ll tell you it sits behind a plan and link to the official page that says so. We won&apos;t help you get around it.
            </li>
            <li>
              <b>No browser extensions, no scripts running on Suno&apos;s pages.</b> Anything that behaves that way is out of scope for us — the <Link href="/suno-bulk-download/">bulk export page</Link> explains why we draw the line where we do.
            </li>
          </ol>
        </section>

        <section className="dl-sec">
          <h2>4. Your files, and whose permission you need</h2>
          <p>
            Whatever rights you hold in a song you generated stay yours and are governed by <b>the platform&apos;s own terms and plan</b>, not by anything on this site. Two questions we get asked and deliberately won&apos;t answer:
          </p>
          <ul>
            <li>
              <b>&quot;Can I release this on Spotify / Apple Music / YouTube?&quot;</b> — That&apos;s Suno&apos;s licensing terms plus your distributor&apos;s policy. We have no visibility into your plan or your generation history and won&apos;t guess.
            </li>
            <li>
              <b>&quot;Can I use this commercially?&quot;</b> — Same answer: the platform&apos;s terms decide, not us.
            </li>
          </ul>
          <p>
            If you don&apos;t own or control the content you paste, <b>stop</b> — saving someone else&apos;s song doesn&apos;t give you a licence to it, and that&apos;s on you, not on this tool.
          </p>
        </section>

        <section className="dl-sec">
          <h2>5. What we don&apos;t claim about audio quality</h2>
          <p>
            We don&apos;t grade, compare, or advertise the fidelity of the files. A file described as &quot;the one Suno published&quot; is exactly that — a container and codec that come from the platform and can change without notice. We won&apos;t call output lossless, studio-grade, or better than what you get from the platform&apos;s own button, because we have no basis for it.
          </p>
        </section>

        <section className="dl-sec">
          <h2>6. Not professional or legal advice</h2>
          <p>
            Nothing on this site is legal advice, and we aren&apos;t lawyers. Explaining what a help-center article says is not a reading of your contract with the platform. For anything that matters commercially — releases, samples, ownership disputes — talk to someone qualified, or to the platform.
          </p>
        </section>

        <section className="dl-sec">
          <h2>7. Limits on liability</h2>
          <p>
            To the fullest extent the law allows, WAV Keep isn&apos;t liable for lost downloads, lost time, a plan&apos;s overage, an account restriction you attribute to using this site, or any indirect or consequential loss arising from its use. If something here has cost you real money, tell us — <a className="dl-mail" href={mail("WAV Keep — support")}>{email}</a>, subject <span className="dl-mail">WAV Keep — support</span> — we read it, and we&apos;d rather fix the page than have you find out twice.
          </p>
        </section>

        <section className="dl-sec">
          <h2>8. Names, marks, and affiliation</h2>
          <p>
            Suno and Udio are names and marks of their respective owners. WAV Keep is <b>not affiliated with, endorsed by, sponsored by, or operated by</b> Suno, Udio, or any record label. Naming a platform here is description, not endorsement, and we don&apos;t imply that any platform approved this tool.
          </p>
        </section>

        <section className="dl-sec">
          <h2>9. If something here is wrong</h2>
          <p>
            Corrections, and anything that looks like we&apos;ve over-promised, go to <a className="dl-mail" href={mail("WAV Keep — support")}>{email}</a> with the subject <span className="dl-mail">WAV Keep — support</span>. Rightsholders should use the same address with the subject <span className="dl-mail">DMCA Notice</span> and follow <Link href="/dmca/">the process on our DMCA page</Link>. Suspected misuse uses the subject <span className="dl-mail">WAV Keep — abuse report</span>. Which message is which is on <Link href="/contact/">Contact</Link>.
          </p>
        </section>

        <p className="dl-foot">
          Independent tool. This disclaimer sits alongside our <Link href="/terms/">Terms</Link>, <Link href="/privacy/">Privacy policy</Link> and <Link href="/about/">About page</Link>. Last updated 14 October 2026. If we change it, we change this date.
        </p>
        <div className="dl-links">
          <Link href="/terms/">Terms</Link>
          <Link href="/privacy/">Privacy</Link>
          <Link href="/dmca/">DMCA</Link>
          <Link href="/contact/">Contact</Link>
          <Link href="/about/">About</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
    </main>
  );
}
