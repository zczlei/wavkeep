export const dynamic = "force-static";

const SITE = "https://wavkeep.com";

/** Change a page's date only when that page's content changes. The build clock must not refresh every URL. */
const PUBLISHED = "2026-10-14";

function entry(path: string, priority: number, changefreq = "weekly", lastmod = PUBLISHED) {
  return `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

function sitemapXml() {
  const urls = [
    entry("/", 1, "daily"),
    entry("/wav-downloader/", 0.8),
    entry("/suno-wav-downloader/", 0.8),
    entry("/suno-mp3-downloader/", 0.8),
    entry("/suno-video-downloader/", 0.8),
    entry("/suno-bulk-download/", 0.8),
    entry("/udio-downloader/", 0.6),
    entry("/suno-watermark/", 0.6),
    entry("/suno-stems/", 0.6),
    entry("/about/", 0.5),
    entry("/contact/", 0.3),
    entry("/terms/", 0.3),
    entry("/privacy/", 0.3),
    entry("/dmca/", 0.3),
    entry("/disclaimer/", 0.3),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}

export function GET() {
  return new Response(sitemapXml(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
