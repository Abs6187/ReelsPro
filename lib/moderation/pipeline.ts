import {
  classifyImageBuffer,
  worstOf,
  aggregateScores,
} from "./nsfw-detector";
import { detectFacesInBuffer } from "./face-detector";
import { fetchBytes, sampleVideoFrames } from "./frame-extractor";
import { UPLOAD_THRESHOLDS, exceedsThreshold } from "./thresholds";
import type {
  FrameReport,
  ModerationReport,
  ModerationVerdict,
  NsfwClass,
  NsfwScores,
} from "./types";

export type MediaType = "image" | "video";

export interface PipelineOptions {
  mediaType: MediaType;
  /** Override default upload thresholds */
  block?: boolean;
  /** Skip face detection (faster) */
  skipFaces?: boolean;
}

function dominantOf(scores: NsfwScores): { cls: NsfwClass; score: number } {
  let cls: NsfwClass = "Neutral";
  let score = 0;
  (Object.keys(scores) as NsfwClass[]).forEach((k) => {
    if (scores[k] > score) {
      score = scores[k];
      cls = k;
    }
  });
  return { cls, score };
}

function decideVerdict(worst: NsfwScores): ModerationVerdict {
  const t = exceedsThreshold(worst, UPLOAD_THRESHOLDS);
  if (!t.unsafe) return { status: "approved" };

  const mode = (process.env.MODERATION_MODE ?? "flag").toLowerCase();
  if (mode === "block") return { status: "rejected", reason: t.reason };
  if (mode === "blur")
    return { status: "approved", reason: t.reason, shouldBlur: true };
  return { status: "flagged", reason: t.reason };
}

/**
 * Build a tiny fixed-length embedding from frame scores so we can do
 * cosine similarity for "find similar reels" without pgvector.
 * Embedding = [meanPorn, meanSexy, meanHentai, meanNeutral, meanDrawing,
 *              maxPorn,  maxSexy,  maxHentai,  faceCountNorm]
 */
function buildEmbedding(
  agg: NsfwScores,
  worst: NsfwScores,
  faceCount: number
): number[] {
  return [
    agg.Porn,
    agg.Sexy,
    agg.Hentai,
    agg.Neutral,
    agg.Drawing,
    worst.Porn,
    worst.Sexy,
    worst.Hentai,
    Math.min(1, faceCount / 10),
  ];
}

export async function runModerationPipeline(
  url: string,
  options: PipelineOptions
): Promise<ModerationReport> {
  const start = Date.now();
  const frames: FrameReport[] = [];

  if (options.mediaType === "image") {
    const buf = await fetchBytes(url);
    const { scores, maxClass, maxScore } = await classifyImageBuffer(buf);
    const faces = options.skipFaces ? [] : await detectFacesInBuffer(buf);
    frames.push({ ts: 0, scores, maxClass, maxScore, faces });
  } else {
    const sampled = await sampleVideoFrames(url);
    for (const f of sampled) {
      const { scores, maxClass, maxScore } = await classifyImageBuffer(f.buffer);
      const faces = options.skipFaces ? [] : await detectFacesInBuffer(f.buffer);
      frames.push({ ts: f.ts, scores, maxClass, maxScore, faces });
    }
  }

  const allScores = frames.map((f) => f.scores);
  const aggregate = aggregateScores(allScores);
  const worst = worstOf(allScores);
  const dominant = dominantOf(worst);
  void aggregate; // keep aggregate computed for embedding

  const allFaces = frames.flatMap((f) => f.faces);
  const genderStats = { male: 0, female: 0, unknown: 0 };
  for (const f of allFaces) {
    if (f.gender === "male") genderStats.male++;
    else if (f.gender === "female") genderStats.female++;
    else genderStats.unknown++;
  }

  const verdict = decideVerdict(worst);
  const embedding = buildEmbedding(aggregate, worst, allFaces.length);

  return {
    mediaType: options.mediaType,
    frames,
    aggregate,
    worst,
    maxScore: dominant.score,
    dominantClass: dominant.cls,
    faceCount: allFaces.length,
    genderStats,
    embedding,
    verdict,
    durationMs: Date.now() - start,
  };
}

/** Cosine similarity between two equal-length vectors. */
export function cosineSim(a: number[], b: number[]): number {
  const n = Math.min(a.length, b.length);
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
