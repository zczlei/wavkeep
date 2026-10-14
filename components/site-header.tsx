"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/wav-downloader/", label: "WAV" },
  { href: "/suno-video-downloader/", label: "Video" },
  { href: "/suno-bulk-download/", label: "Bulk" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
];

function current(path: string, href: string) {
  const normalize = (value: string) => value.replace(/\/$/, "") || "/";
  return normalize(path) === normalize(href);
}

export function SiteHeader() {
  const path = usePathname();
  return (
    <header>
      <div className="wrap nav">
        <Link className="logo" href="/">
          <span className="mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1 8h2.2L5 4.2 7.4 12 9.6 6.2 11 8H15" stroke="#3fb950" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          WAV<span>Keep</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="nav-links">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} aria-current={current(path, link.href) ? "page" : undefined}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
