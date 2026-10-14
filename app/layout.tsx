import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wavkeep.com"),
  title: {
    default: "Suno Downloader — Save Your Own Suno Songs as WAV, MP3 or MP4 | WAV Keep",
    template: "%s | WAV Keep",
  },
  description:
    "Paste a public Suno song link and keep the file Suno already published — WAV, MP3, cover art and, for songs that have one, the vertical lyric video. Nothing re-encoded, and it doesn't cost you a Suno download.",
  applicationName: "WAV Keep",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "Suno Downloader — save the file Suno published for your song",
    description: "Paste a public Suno link. Keep WAV, MP3, cover art and the published lyric video — without spending a download.",
    url: "https://wavkeep.com/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>
        <div className="site">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
