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
    default: "Suno Downloader — Save WAV, MP3, Cover Art | WAV Keep",
    template: "%s | WAV Keep",
  },
  description:
    "Paste a public Suno link and keep what it already publishes — WAV, MP3, cover art, and the lyric video when there is one. No sign-in, no download spent.",
  applicationName: "WAV Keep",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "WAV Keep",
    title: "Suno Downloader — Save WAV, MP3, Cover Art | WAV Keep",
    description: "Paste a public Suno link and keep what it already publishes — WAV, MP3, cover art, and the lyric video when there is one. No sign-in, no download spent.",
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
