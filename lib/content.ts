export const faqs: { q: string; a: string; link?: { phrase: string; href: string } }[] = [
  {
    q: "Why is there no video for some Suno songs?",
    a: "Some public Suno songs expose audio and cover art only. We read what the song page publishes, so when no video file is published we say so instead of offering a button. We do not create a video Suno has not made.",
  },
  {
    q: "Is the MP4 a music video?",
    a: "No. It is Suno's own vertical lyric card — measured at 824×1464 at 10 fps with AAC audio at 48 kHz. It is the same picture you see on the share page, with nothing added or re-rendered.",
  },
  {
    q: "Can I post it to Reels, Shorts or TikTok?",
    a: "The shape is right — it is 9:16. The width is about three-quarters of a 1080×1920 upload and platforms re-encode it, so treat it as a preview or story clip rather than a master.",
  },
  {
    q: "Does this use my Suno download allowance?",
    a: "No. We never sign in to your account and never go through Suno's download menu, so saving a file here does not spend one of your monthly downloads.",
  },
  {
    q: "Do I need to own the song?",
    a: "Use this on songs you made or content you are permitted to save. A downloadable file is not a licence — Suno's terms still decide what you may do with the audio, including whether you can release it commercially.",
  },
  {
    q: "Why is the WAV so much bigger than the delivered file?",
    a: "The delivered file is roughly 300 kbps overall, while 48 kHz stereo WAV runs about 11.5 MB per minute — five times the size. For long batches, save one song at a time rather than expecting a single ZIP.",
  },
  {
    q: "Does it work for Udio songs too?",
    a: "Yes, on the page built for it — Udio downloader. The inspection and the file list differ per platform, so they are kept apart on purpose.",
    link: { phrase: "Udio downloader", href: "/udio-downloader/" },
  },
];

export const howTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to download a Suno song without using your download quota",
  step: [
    {
      "@type": "HowToStep",
      name: "Copy the public song link",
      text: "Open your song on suno.com and copy the address in the form suno.com/song/XXXX.",
    },
    {
      "@type": "HowToStep",
      name: "Paste it into WAV Keep",
      text: "Press Inspect. We read what that song page publishes — no sign-in, no Suno download button.",
    },
    {
      "@type": "HowToStep",
      name: "Save the formats that exist",
      text: "Take WAV, MP3, cover art and, when the song has one, the MP4 video. Each file is saved as delivered.",
    },
  ],
};

export const webApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "WAV Keep",
  url: "https://wavkeep.com/",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any (web)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "Download your own Suno songs as WAV, MP3 or the published MP4 lyric video from a public song link.",
};
