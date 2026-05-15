// Shared moderation types

export type NsfwClass = "Porn" | "Sexy" | "Hentai" | "Neutral" | "Drawing";

export interface NsfwScores {
  Porn: number;
  Sexy: number;
  Hentai: number;
  Neutral: number;
  Drawing: number;
}

export interface FaceBox {
  x: number;
  y: number;
  w: number;
  h: number;
  gender?: "male" | "female" | "unknown";
  genderScore?: number;
  age?: number;
}

export interface FrameReport {
  /** Seconds from start of video (0 for still images) */
  ts: number;
  scores: NsfwScores;
  maxClass: NsfwClass;
  maxScore: number;
  faces: FaceBox[];
}

export type ModerationStatus =
  | "pending"
  | "processing"
  | "approved"
  | "flagged"
  | "rejected";

export type FilterLevel = "off" | "moderate" | "strict";

export interface ModerationVerdict {
  status: ModerationStatus;
  reason?: string;
  /** Whether the caller should auto-blur and keep the video. */
  shouldBlur?: boolean;
}

export interface ModerationReport {
  mediaType: "image" | "video";
  frames: FrameReport[];
  aggregate: NsfwScores;
  worst: NsfwScores;
  maxScore: number;
  dominantClass: NsfwClass;
  faceCount: number;
  genderStats: { male: number; female: number; unknown: number };
  embedding?: number[];
  verdict: ModerationVerdict;
  durationMs: number;
}
