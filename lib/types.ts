export type FileState = "available" | "not_published" | "not_reachable";

export type InspectFile = {
  state: FileState;
  resolution?: string;
  bytes?: number;
};

export type InspectResponse = {
  platform: "suno" | "udio";
  title: string;
  artist: string;
  songId: string;
  duration: number | null;
  sampleRate: number | null;
  sourceBitrate: number | null;
  /** Single published media URL. Not repeated on each format. */
  mediaUrl: string | null;
  imageUrl: string | null;
  /** Set only when a distinct MP3 file exists. */
  mp3Url: string | null;
  files: {
    original: InspectFile;
    wav: InspectFile;
    mp3: InspectFile;
    video: InspectFile;
    art: InspectFile;
  };
};
