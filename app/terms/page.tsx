import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service | WAV Keep" },
  description:
    "Terms of service for WAV Keep — an independent tool that saves files a public Suno or Udio song page already publishes.",
  alternates: { canonical: "https://wavkeep.com/terms/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "Terms of Service | WAV Keep",
    description:
      "Terms of service for WAV Keep — an independent tool that saves files a public Suno or Udio song page already publishes.",
    url: "https://wavkeep.com/terms/",
  },
};

export default function TermsPage() {
  return (
    <main className="wrap legal">
      <h1>Terms of Service</h1>
      <p><time dateTime="2026-10-14">Last updated: 2026-10-14</time></p>

      <div className="box">
        <b>Not an official Suno or Udio product.</b> WAV Keep is an independent, third-party website. It is not affiliated with, endorsed by, or sponsored by Suno Inc., Udio, or any other music-generation service. “Suno”, “Udio” and related names and marks belong to their respective owners and are used only to describe what this tool works with.
      </div>

      <p>
        For how the tool works and what we won&apos;t do, see our <Link href="/about/">About page</Link>.
      </p>

      <p>By using wavkeep.com you agree to these terms. If you don&apos;t agree, don&apos;t use the site — there is no account to cancel; closing the tab is enough.</p>

      <h2>1. What this service does</h2>
      <p>You paste a link to a <b>publicly available</b> song page. The site reads which files that page already publishes and lets you save them as delivered: the original file, WAV, MP3, cover art and — for songs where a video file is published — that video.</p>

      <h2>2. What this service does not do</h2>
      <ul>
        <li><b>It does not generate music.</b> We are not a music-creation service and produce no audio or video of our own.</li>
        <li><b>It does not log in to your account.</b> We never ask for or accept Suno or Udio credentials, and we do not use your account&apos;s download function.</li>
        <li><b>It does not bypass access controls.</b> We only reach files that are already published to the open web and require no authentication, permission check or technical unlock on our side. If a song isn&apos;t public, this site cannot get it.</li>
        <li><b>It does not re-render, upscale or add captions to video.</b> What you save is the file as delivered.</li>
        <li><b>It does not host a library.</b> We store no song catalogue, and we do not keep the files you save.</li>
      </ul>

      <h2>3. Your responsibilities</h2>
      <p>You are solely responsible for the links you submit and for what you do with the files you save.</p>
      <ul>
        <li>Use this on content <b>you created</b>, or content you are otherwise permitted to download and keep.</li>
        <li>A downloadable file is <b>not a licence</b>. The terms of the platform that generated the audio, and the rights of any person whose voice, lyrics or material appear in it, still control what you may publish, sell or train on.</li>
        <li>You may not use this site to redistribute other people&apos;s work at scale, to build a competing mirror of another service&apos;s content, or to infringe any right.</li>
        <li>You are responsible for complying with the terms of service of the source platform. Those terms are separate from these, and they can change.</li>
      </ul>

      <h2>4. No warranty</h2>
      <p>The service is provided “as is” and “as available”, without warranty of any kind. We do not promise that any given song will be retrievable, that any format will exist for a given song, or that the site will keep working. Upstream platforms change their URL structure, their CDN behaviour, their publishing rules and their rate limits without notice — and a page that worked last month may stop. If a file matters, keep your own copy.</p>

      <h2>5. Availability and limits</h2>
      <p>We may apply limits to protect the service, including file size, request rate, and batch size. Large batch exports are deliberately capped or processed one item at a time, because a browser cannot assemble an archive of uncompressed audio for hundreds of tracks without failing.</p>

      <h2>6. Copyright and takedowns</h2>
      <p>We maintain a designated agent and a notice-and-takedown process under the U.S. Digital Millennium Copyright Act. See our <Link href="/dmca/">DMCA and copyright policy</Link>. Repeat, substantiated infringement by a user may result in that user&apos;s access being blocked.</p>

      <h2>7. Your indemnity</h2>
      <p>If you use this site in a way that breaches these terms or someone else&apos;s rights, you — not WAV Keep — are responsible for the resulting claims, and you agree to cover the reasonable costs of defending them.</p>

      <h2>8. Limitation of liability</h2>
      <p>To the maximum extent permitted by law, WAV Keep is not liable for lost data, lost revenue, lost downloads or allowance, business interruption, or any indirect or consequential loss arising from use of, or inability to use, the service. The site is free to use, and that is the whole of what we owe you.</p>

      <h2>9. Changes to these terms</h2>
      <p>We may update these terms. Material changes will be reflected in the date above. Continued use after that date means the updated terms apply to you.</p>

      <h2>10. Contact</h2>
      <p>
        Questions about these terms go to <a href="mailto:tinaliu660@gmail.com">tinaliu660@gmail.com</a>. For copyright matters please use the <Link href="/dmca/">DMCA page</Link> so your message reaches the right process.
      </p>

      <p><small>These terms are written for a small independent tool and are not legal advice. If you take paid plans or large-scale traffic, have a lawyer read them against your jurisdiction.</small></p>
    </main>
  );
}
