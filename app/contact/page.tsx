import type { Metadata } from "next";
import Link from "next/link";

const email = "tinaliu660@gmail.com";
const title = "Contact WAV Keep — support, copyright notices, abuse | WAV Keep";
const description =
  "Reach WAV Keep by email for download problems, copyright notices, and misuse. What to include so we can actually help, and what we can't answer.";

function mail(subject: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}

const contactLd = {
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
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer support", email, availableLanguage: "English" },
        { "@type": "ContactPoint", contactType: "abuse", email, availableLanguage: "English" },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": "https://wavkeep.com/contact/#webpage",
      url: "https://wavkeep.com/contact/",
      isPartOf: { "@id": "https://wavkeep.com/#website" },
      about: { "@id": "https://wavkeep.com/#org" },
      inLanguage: "en",
      dateModified: "2026-10-14",
    },
  ],
};

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "https://wavkeep.com/contact/" },
  robots: { index: true, follow: true, "max-image-preview": "large" },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "Contact WAV Keep",
    description: "Support, copyright notices and abuse reports — which subject to use, and what to include in the first message.",
    url: "https://wavkeep.com/contact/",
  },
  twitter: { card: "summary_large_image" },
};

export default function ContactPage() {
  return (
    <main className="ct">
      <article className="wrap">
        <div className="hero">
          <h1>Contact WAV Keep</h1>
          <p className="ct-lede">
            One person reads this inbox, so the subject you put on the message matters. Use the one that matches what you need;
            a copyright notice with the right subject gets read ahead of a pile of download questions.
          </p>
        </div>

        <section>
          <h2 className="ct-h">Where to write</h2>
          <div className="ct-cards">
            <div className="ct-card">
              <h3>Tool problems &amp; ideas</h3>
              <a className="addr" href={mail("WAV Keep — support")}>{email}</a>
              <p className="subj">Subject: WAV Keep — support</p>
              <p>
                A link that won&apos;t resolve, a format that came out wrong, a song page we mis-read, or a feature you wish existed.
                Tell us what you pasted and what you expected — see the checklist below.
              </p>
            </div>
            <div className="ct-card danger">
              <h3>Copyright notices (DMCA)</h3>
              <a className="addr" href={mail("DMCA Notice")}>{email}</a>
              <p className="subj">Subject: DMCA Notice</p>
              <p>
                Rightsholders only. Please send the elements listed in <Link href="/dmca/">our DMCA page</Link> in the first message —
                a notice without them can&apos;t be actioned, and it costs you a round trip.
              </p>
            </div>
            <div className="ct-card">
              <h3>Abuse &amp; security</h3>
              <a className="addr" href={mail("WAV Keep — abuse report")}>{email}</a>
              <p className="subj">Subject: WAV Keep — abuse report</p>
              <p>
                Reports that someone is using this tool to reach content that was never published, or a link on this site you believe
                is harmful. Include the URL and the time.
              </p>
            </div>
          </div>
          <p className="ct-note">
            <b>One address, no contact form.</b> We don&apos;t run a form — a message only leaves your own mail client. If you&apos;d rather not email,
            the fastest fix for most issues is the <Link href="/suno-watermark/">watermark page</Link> or the FAQ on the page you were using:
            the questions we get most often are already answered there.
          </p>
        </section>

        <section>
          <h2 className="ct-h">Include this in your first message</h2>
          <div className="ct-list">
            <ol>
              <li>
                <b>The exact link you pasted</b> — the song, playlist or profile URL. This is the single thing that lets us reproduce a failure. <code>https://suno.com/song/…</code>
              </li>
              <li>
                <b>What you asked for</b> — which formats you selected (WAV / MP3 / cover art / video).
              </li>
              <li>
                <b>What came back</b> — the error text as written, or &quot;the file opened but was silent&quot;, or &quot;nothing downloaded&quot;. A screenshot helps if the words are awkward.
              </li>
              <li>
                <b>Where you are</b> — browser and rough device (Chrome on Windows, Safari on iPhone), and the approximate time.
              </li>
              <li>
                <b>Whether the song is public</b> — a private or unlisted song has no public page to read, and that&apos;s usually the whole answer. You don&apos;t need to send us a password or a session token; we never ask for either.
              </li>
            </ol>
          </div>
        </section>

        <section>
          <h2 className="ct-h">What we can&apos;t answer</h2>
          <p className="ct-lede">These come in often and there&apos;s nothing useful we can do with them — better to send them where they belong.</p>
          <div className="table-scroll">
            <table className="ct-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Who can actually answer it</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>“Why does my account only get 20 downloads?” / plan, billing, refund</td>
                  <td>
                    Suno&apos;s own support and{" "}
                    <a href="https://help.suno.com/en/articles/13614785" rel="nofollow noopener" target="_blank">their help pages</a>.
                    We have no access to any account and no relationship with Suno.
                  </td>
                </tr>
                <tr>
                  <td>“Can you remove the watermark from my file?”</td>
                  <td>Nobody, cleanly. The reason is on <Link href="/suno-watermark/">the watermark page</Link>.</td>
                </tr>
                <tr>
                  <td>“Can you get me the stems from this link?”</td>
                  <td>Not from a public link. What the official route is, is on <Link href="/suno-stems/">the stems page</Link>.</td>
                </tr>
                <tr>
                  <td>“Udio won&apos;t let me download — can you?”</td>
                  <td>No, and we won&apos;t pretend otherwise: <Link href="/udio-downloader/">why, on the Udio page</Link>.</td>
                </tr>
                <tr>
                  <td>“Can you download this song I never published / someone else&apos;s private link?”</td>
                  <td>No. There&apos;s no public page for us to read, and that&apos;s by design.</td>
                </tr>
                <tr>
                  <td>“Is my output allowed to be released on Spotify/Apple Music?”</td>
                  <td>That&apos;s Suno&apos;s licensing terms and your distributor&apos;s policy, not ours — and we won&apos;t guess on your behalf.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="ct-h">How quickly you&apos;ll hear back</h2>
          <div className="ct-reply">
            <h3>A few business days, not a 24-hour service</h3>
            <p>
              WAV Keep is maintained by one person alongside everything else. Mail is usually answered within a few business days.
              A complete copyright or abuse notice is read first. If you haven&apos;t heard back in two weeks, resend — mail does get lost, and a second message isn&apos;t an imposition.
            </p>
          </div>
          <p>
            No ticketing system, no phone line, no live chat. Everything runs through email so there&apos;s a written trail — which matters most exactly when it matters: copyright notices.
          </p>
        </section>

        <section>
          <h2 className="ct-h">One more thing before you write</h2>
          <p className="ct-lede">
            <b>Never send</b> your Suno password, an account session, a private share link with a token, or anything else that lets someone act as you. We have no use for it, we won&apos;t ask for it, and if a message arrives containing it we delete the message rather than read the file. Everything this tool needs is already in a public link.
          </p>
        </section>

        <p className="ct-updated">
          Independent tool. WAV Keep is not affiliated with, endorsed by, or operated by Suno or Udio — see <Link href="/terms/">Terms</Link>. Last updated 14 October 2026.
        </p>
        <div className="ct-links">
          <Link href="/about/">About</Link>
          <Link href="/terms/">Terms</Link>
          <Link href="/privacy/">Privacy</Link>
          <Link href="/dmca/">DMCA</Link>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }} />
    </main>
  );
}
