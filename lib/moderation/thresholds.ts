import type { FilterLevel, NsfwScores } from "./types";

export interface ThresholdSet {
  /** If any class score exceeds its threshold, content is considered unsafe. */
  porn: number;
  hentai: number;
  sexy: number;
}

/** Upload-time thresholds (server-side gate). */
export const UPLOAD_THRESHOLDS: ThresholdSet = {
  porn: Number(process.env.NSFW_THRESHOLD_PORN ?? 0.6),
  hentai: Number(process.env.NSFW_THRESHOLD_HENTAI ?? 0.6),
  sexy: Number(process.env.NSFW_THRESHOLD_SEXY ?? 0.85),
};

/** Feed-time thresholds per viewer preference. */
export const VIEW_THRESHOLDS: Record<FilterLevel, ThresholdSet> = {
  off: { porn: 1.01, hentai: 1.01, sexy: 1.01 }, // never filter
  moderate: { porn: 0.6, hentai: 0.6, sexy: 0.9 },
  strict: { porn: 0.3, hentai: 0.3, sexy: 0.5 },
};

export function exceedsThreshold(
  scores: NsfwScores,
  t: ThresholdSet
): { unsafe: boolean; reason?: string } {
  if (scores.Porn >= t.porn)
    return { unsafe: true, reason: `Porn score ${scores.Porn.toFixed(2)} ≥ ${t.porn}` };
  if (scores.Hentai >= t.hentai)
    return { unsafe: true, reason: `Hentai score ${scores.Hentai.toFixed(2)} ≥ ${t.hentai}` };
  if (scores.Sexy >= t.sexy)
    return { unsafe: true, reason: `Sexy score ${scores.Sexy.toFixed(2)} ≥ ${t.sexy}` };
  return { unsafe: false };
}
