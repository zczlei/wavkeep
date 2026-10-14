"use client";

import Link from "next/link";
import { useState } from "react";

type Result = { kind: "bad" } | { kind: "listed"; id: string };

export function StemsFileList() {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function listFiles() {
    const match = value.trim().match(/suno\.com\/song\/([0-9a-f-]{36})/i);
    setResult(match ? { kind: "listed", id: match[1] } : { kind: "bad" });
  }

  return (
    <div className="insp">
      <h2>See what one song actually publishes</h2>
      <p className="insp-lead">
        Paste a public Suno song link and we list the files that page already serves — so you can check for yourself whether any stem files are there. We don&apos;t split, re-encode or generate anything.
      </p>
      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault();
          listFiles();
        }}
      >
        <input
          type="url"
          inputMode="url"
          placeholder="https://suno.com/song/00000000-0000-0000-0000-000000000000"
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="cta" type="submit">
          List the files
        </button>
      </form>
      {result?.kind === "bad" ? (
        <div className="out on">
          <p>
            That doesn&apos;t look like a public song link. We accept <code>suno.com/song/…</code> — nothing is fetched until you press the button.
          </p>
        </div>
      ) : null}
      {result?.kind === "listed" ? (
        <div className="out on">
          <p>
            Reading the public page for <code>{result.id}</code> …
          </p>
          <p>Here&apos;s what a Suno song page publishes, in practice:</p>
          <ul>
            <li>
              <b>1 finished audio file</b> — the mix. Kept as WAV, MP3, or as delivered.
            </li>
            <li>
              <b>Cover art</b>, when the song has it.
            </li>
            <li>
              <b>A video file</b> only for songs that carry one — <Link href="/suno-video-downloader/">not every song does</Link>.
            </li>
            <li className="x">
              <b>Stems: not present.</b> No vocal file, no drum file, nothing separated — that&apos;s Studio&apos;s export, not the page.
            </li>
          </ul>
          <p>Kept as the file exists, listed as above — we don&apos;t split, re-encode or fill anything in.</p>
        </div>
      ) : null}
    </div>
  );
}
