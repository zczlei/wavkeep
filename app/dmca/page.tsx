import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "DMCA and Copyright Policy | WAV Keep" },
  description:
    "How to report copyright infringement on wavkeep.com, our designated agent, what happens after a valid notice, and how to file a counter-notification.",
  alternates: { canonical: "https://wavkeep.com/dmca/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "DMCA and Copyright Policy | WAV Keep",
    description:
      "How to report copyright infringement on wavkeep.com, our designated agent, what happens after a valid notice, and how to file a counter-notification.",
    url: "https://wavkeep.com/dmca/",
  },
};

export default function DmcaPage() {
  return (
    <main className="wrap legal">
      <h1>DMCA and copyright policy</h1>
      <p><time dateTime="2026-10-14">Last updated: 2026-10-14</time></p>

      <p>WAV Keep respects intellectual property and responds to notices of claimed infringement under the U.S. Digital Millennium Copyright Act (17 U.S.C. §512). Before you file, one thing about how this site works matters to your request:</p>

      <div className="box">
        <b>We do not host a music library and we do not store the files you save.</b> WAV Keep reads which files a <b>song page that is already public</b> publishes, and passes that link to your browser. So a takedown request against us usually has two different targets, and only the first is ours to act on:
        <ol>
          <li><b>Our page</b> — we can remove a link, a listing, or stop resolving a particular song ID. Do that immediately on a valid notice.</li>
          <li><b>The original file and the song itself</b> — these live on the source platform&apos;s CDN, not on our servers. Making them unavailable means asking the platform. Their own terms page lists the routes for that (the contact addresses are obfuscated on the page, so read them there).</li>
        </ol>
        Tell us which one you want, and we will act on the part we control.
      </div>

      <h2>Designated agent</h2>
      <div className="agent">
        <p>
          Send notices to <a href="mailto:tinaliu660@gmail.com">tinaliu660@gmail.com</a>. Put the song or page in the subject line, for example: DMCA — song or page identifier.
        </p>
      </div>

      <h2>What a valid notice must contain</h2>
      <p>Incomplete notices slow everything down, and some parts we cannot fill in for you. Please include all six:</p>
      <ol>
        <li>Your <b>physical or electronic signature</b> as the copyright owner or a person authorised to act for the owner.</li>
        <li><b>Identification of the copyrighted work</b> you say is infringed (title, and a link to where you hold it, if one link covers several works say so).</li>
        <li><b>Identification of the material</b> and where it is — <b>the exact wavkeep.com URL</b> and, if relevant, the song link. We need the specific page; a brand name alone is not enough.</li>
        <li>Your <b>contact information</b>: name, address, telephone, email.</li>
        <li>A statement that you have a <b>good faith belief</b> that the disputed use is not authorised by the copyright owner, its agent, or the law.</li>
        <li>A statement, <b>under penalty of perjury</b>, that the information in your notice is accurate and that you are the copyright owner or authorised to act on the owner&apos;s behalf.</li>
      </ol>
      <p>We also consider whether the use may be privileged or authorised, including <b>fair use</b> (§512(m)), so a sentence on why it isn&apos;t helps us act faster.</p>

      <h2>What happens after we receive a notice</h2>
      <ol>
        <li>We acknowledge it, usually within <b>2 business days</b>.</li>
        <li>If it is facially valid, we <b>disable access to the specific page or link on our side</b> — that is the part we control — and log the action.</li>
        <li>If we can identify who to notify, we do; if the request is about content that never left the source platform, we tell you plainly and point you to the platform&apos;s own process.</li>
        <li>Nothing is deleted that we don&apos;t have. We hold no copies, so there is no archive for us to purge.</li>
      </ol>

      <h2>Counter-notification</h2>
      <p>If you believe material was removed by mistake or misidentification, send the agent all five items required by §512(g)(3): your signature; identification of what was removed and where it was; a statement under penalty of perjury that you have a good faith belief the removal was mistake or misidentification; your name, address, telephone and email; and a statement consenting to jurisdiction of the federal district court for your address (or, if you are outside the United States, any district in which the service provider may be found, and to being served with the complainant&apos;s action).</p>

      <h2>Repeat infringers</h2>
      <p>We reserve the right to block access for users who repeatedly submit links for content they have no right to save, after substantiated notices. Under our <Link href="/terms/">Terms of Service</Link>, you are responsible for the links you submit.</p>

      <h2>Before you file, two practical notes</h2>
      <ul>
        <li><b>This site does not let anyone reach a private song.</b> If a track was never published, there is nothing here to take down — the page simply finds no files.</li>
        <li><b>Trademark complaints to Google are a different door.</b> If your issue is our use of a name in branding rather than a specific file, tell us that explicitly; we would rather rename a page than argue.</li>
      </ul>

      <p><small>This policy is provided for transparency, not as legal advice, and does not create an attorney–client relationship.</small></p>
    </main>
  );
}
