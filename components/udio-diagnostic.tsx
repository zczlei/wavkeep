"use client";

import { useState } from "react";

type Choice = "yes" | "no" | "web" | "ios" | "android";

const platforms: Record<"web" | "ios" | "android", string> = {
  web: "the website",
  ios: "the iOS app",
  android: "Android",
};

function Group({
  legend,
  value,
  options,
  onPick,
}: {
  legend: string;
  value: string | null;
  options: { value: Choice; label: string }[];
  onPick: (value: Choice) => void;
}) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="opts">
        {options.map((option) => (
          <button
            key={option.value}
            className="opt"
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onPick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function UdioDiagnostic() {
  const [owner, setOwner] = useState<"yes" | "no" | null>(null);
  const [when, setWhen] = useState<"yes" | "no" | null>(null);
  const [surface, setSurface] = useState<"web" | "ios" | "android" | null>(null);
  const ready = owner && when && surface;

  return (
    <div className="diag">
      <Group
        legend="1. Did you make this song yourself, on your own account?"
        value={owner}
        onPick={(value) => setOwner(value === "no" ? "no" : "yes")}
        options={[
          { value: "yes", label: "Yes, it's mine" },
          { value: "no", label: "No, someone else's" },
        ]}
      />
      <Group
        legend="2. Did you save it before 30 October 2025?"
        value={when}
        onPick={(value) => setWhen(value === "no" ? "no" : "yes")}
        options={[
          { value: "yes", label: "Yes, I have a copy" },
          { value: "no", label: "No / not sure" },
        ]}
      />
      <Group
        legend="3. Where are you looking for the button?"
        value={surface}
        onPick={(value) => setSurface(value === "ios" || value === "android" ? value : "web")}
        options={[
          { value: "web", label: "Website" },
          { value: "ios", label: "iOS app" },
          { value: "android", label: "Android" },
        ]}
      />
      {ready ? (
        <div className="diag-out" aria-live="polite">
          {owner === "no" ? (
            <p>
              <strong>You were never able to download that one.</strong> Udio logged “Hide download button for non-owners of songs” back on 18 December 2024 — the button only ever appeared for the person who created the track.
            </p>
          ) : (
            <p>
              <strong>The button is gone for owners too.</strong> The notice covers audio, video and stems, with no exception for accounts that created the song.
            </p>
          )}
          <p>Looking on {platforms[surface]} doesn&apos;t change it: the disabled notice isn&apos;t scoped to one surface.</p>
          {when === "yes" ? (
            <p>
              <strong>Good news for that copy.</strong> Anything you saved before 30 October 2025 is yours already — keep a second copy somewhere you control, because that&apos;s now the only copy that exists outside Udio.
            </p>
          ) : (
            <p>
              <strong>If you need the audio out,</strong> the only route that produces a file today is capturing it while it plays on your own device — a real-time capture at stream quality, not the original render, and one full pass per track.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}
