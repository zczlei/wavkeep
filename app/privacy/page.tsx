import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | WAV Keep" },
  description:
    "Privacy policy for WAV Keep. The site reads a public song link you paste, does not ask you to sign in, and does not keep the files you save.",
  alternates: { canonical: "https://wavkeep.com/privacy/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "Privacy Policy | WAV Keep",
    description:
      "Privacy policy for WAV Keep. The site reads a public song link you paste, does not ask you to sign in, and does not keep the files you save.",
    url: "https://wavkeep.com/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <main className="wrap legal">
      <h1>Privacy Policy</h1>
      <p><time dateTime="2026-10-14">Last updated: 2026-10-14</time></p>

      <p>This Privacy Policy (the “Policy”) describes how WAV Keep (“we”, “us”, or “our”) handles information when you use wavkeep.com (the “Service”). It also explains how we use that information and how you can contact us about it.</p>
      <p>WAV Keep is a website. You paste a link to a song page that is already public. We read which files that page publishes so your browser can save them. There is no account, and we are not Suno or Udio.</p>

      <h2>1. Acceptance</h2>
      <p>Please read this Policy before you use the Service. By using wavkeep.com you agree to the collection and use described below. If you do not agree, do not use the site. There is no account to close.</p>

      <h2>2. Changes to this Policy</h2>
      <p>We will post changes on this page and update the date above. If you keep using the Service after that date, the revised Policy applies. If you do not agree with a change, stop using the site.</p>
      <p>We may also show a short notice next to a specific feature when that feature handles information differently from the rest of this Policy.</p>

      <h2>3. Information we collect</h2>
      <p><b>A. The link you paste.</b> To inspect a song we receive the public URL you submit. We use it to read that page and the files it already publishes. We do not ask you to sign in, and we do not ask for a Suno or Udio password.</p>
      <p><b>B. Ordinary request data.</b> Like most websites, the server that receives your request can see technical details your browser sends: IP address, browser type, the time of the request, and the page you asked for. We use this to run the site and to limit abuse. We do not use it to build an advertising profile.</p>
      <p><b>C. What we do not collect.</b> We do not offer an account, so we do not collect a name, email, or payment card to use the downloader. We do not ship a mobile app, and we do not use an advertising network, an advertising identifier, or a crash-reporting SDK. We do not ask you to connect a Suno or Udio account.</p>

      <h2>4. How we use information</h2>
      <p>We use the information above only to:</p>
      <ul>
        <li>read the public song page you asked about and tell you which files it publishes;</li>
        <li>let your browser save those files;</li>
        <li>keep the Service working, including rate limits and blocking obvious abuse;</li>
        <li>respond if you write to us, including a copyright notice.</li>
      </ul>
      <p>We do not sell personal information. We do not use the link you paste to sign in to anyone&apos;s account, and we do not use it for interest-based advertising.</p>

      <h2>5. Files and the song itself</h2>
      <p>We do not host a music library and we do not keep the audio, video, or artwork you save. Your browser fetches the published file from the source that already serves it. A downloadable file on that page is not stored by us as a copy for later.</p>

      <h2>6. Security</h2>
      <p>We use ordinary care intended to protect the Service against misuse of the information under our control. No transmission over the internet is perfectly secure. You send a link to us at your own risk, and you should only paste links you are willing to transmit.</p>

      <h2>7. Transfers</h2>
      <p>If you use the Service, information such as the link you paste and ordinary request data may be processed on servers outside the country where you are, including the United States. Those countries may have different privacy laws. If you do not want that, do not use the Service.</p>
      <p>If you are in the European Economic Area, the United Kingdom, or Switzerland, section 12 also applies.</p>

      <h2>8. Third-party sites</h2>
      <p>The Service reads publicly available pages on other services, including Suno and Udio, and the files those pages already publish on their own networks. We do not control how those services collect or use information. Their privacy policies and terms govern what happens on their sites. We are not affiliated with them.</p>

      <h2>9. Do Not Track</h2>
      <p>Some browsers send a “Do Not Track” signal. There is no common standard for what a site must do with it. This Service does not use that signal to change how a request is handled, because we do not run interest-based advertising in the first place.</p>

      <h2>10. Retention</h2>
      <p>We keep information only as long as we need it for the purpose it was collected. The public link is used to answer the request you just made. We do not add it to a catalogue of songs. Operational logs, if the host keeps them, are kept only as long as needed to operate and protect the Service, and then deleted or rotated. We may keep a copyright notice for as long as we need it to show what we did with that notice.</p>
      <p>After information is gone, we cannot provide a copy of it.</p>

      <h2>11. Children</h2>
      <p>The Service is not directed at children under 13, and we do not knowingly collect personal information from them. If you believe a child has sent us personal information, contact us and we will delete it.</p>

      <h2>12. European Economic Area, Switzerland, and the United Kingdom</h2>
      <p>This section applies if you use the Service from the European Economic Area, Switzerland, or the United Kingdom.</p>
      <p><b>A. Our role.</b> For the link you paste and the request data described above, WAV Keep decides why and how that information is processed. A company that only hosts the site on our instructions handles it for us.</p>
      <p><b>B. Legal bases.</b> We process this information because you asked us to read a specific public link (steps taken at your request before any contract), because we have a legitimate interest in running and protecting a free tool, and, where a copyright or other legal process requires it, because we have a legal obligation.</p>
      <p><b>C. Your rights.</b> Depending on where you live, you may have the right to access, correct, delete, or restrict personal information, to object to certain processing, to ask for a portable copy, and to withdraw consent where processing was based on consent. You can also complain to a supervisory authority where you live or work, or where you believe a problem happened. Contact us at the address in section 13. We may need to confirm it is you before we act.</p>

      <h2>13. How to contact us</h2>
      <p>Questions about this Policy go to <a href="mailto:tinaliu660@gmail.com">tinaliu660@gmail.com</a>. Copyright notices should go through the <Link href="/dmca/">DMCA page</Link> so they reach that process. The same contact is listed in our <Link href="/terms/">Terms of Service</Link>.</p>
      <p><small>This Policy describes how the site actually works. It is not legal advice.</small></p>
    </main>
  );
}
