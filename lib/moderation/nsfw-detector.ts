import { loadTF, isNativeTF } from "./tf-loader";
import type { NsfwScores, NsfwClass } from "./types";

// nsfwjs types
type NSFWJSModel = {
  classify: (
    img: unknown,
    topk?: number
  ) => Promise<{ className: string; probability: number }[]>;
};

let modelPromise: Promise<NSFWJSModel> | null = null;

async function getModel(): Promise<NSFWJSModel> {
  if (modelPromise) return modelPromise;
  modelPromise = (async () => {
    await loadTF(); // register backend before loading nsfwjs
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nsfwjs = require("nsfwjs");
    // MobileNetV2 is smaller and faster than the default.
    const model = await nsfwjs.load("MobileNetV2");
    return model as NSFWJSModel;
  })();
  return modelPromise;
}

function emptyScores(): NsfwScores {
  return { Porn: 0, Sexy: 0, Hentai: 0, Neutral: 0, Drawing: 0 };
}

/**
 * Classify an image buffer (jpeg/png/webp) and return NSFWJS class scores.
 */
export async function classifyImageBuffer(
  buffer: Buffer
): Promise<{ scores: NsfwScores; maxClass: NsfwClass; maxScore: number }> {
  const tf = await loadTF();
  const model = await getModel();

  let tensor: any;
  if (isNativeTF() && (tf as any).node?.decodeImage) {
    tensor = (tf as any).node.decodeImage(buffer, 3);
  } else {
    // Pure-JS fallback: decode via sharp → raw RGB → tensor3d
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sharp = require("sharp");
    const { data, info } = await sharp(buffer)
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    tensor = (tf as any).tensor3d(
      new Uint8Array(data),
      [info.height, info.width, 3],
      "int32"
    );
  }

  try {
    const predictions = await model.classify(tensor, 5);
    const scores = emptyScores();
    for (const p of predictions) {
      const key = p.className as NsfwClass;
      if (key in scores) scores[key] = p.probability;
    }
    let maxClass: NsfwClass = "Neutral";
    let maxScore = 0;
    (Object.keys(scores) as NsfwClass[]).forEach((k) => {
      if (scores[k] > maxScore) {
        maxScore = scores[k];
        maxClass = k;
      }
    });
    return { scores, maxClass, maxScore };
  } finally {
    if (tensor && typeof tensor.dispose === "function") tensor.dispose();
  }
}

/** Average several NSFW reports (e.g. across video frames). */
export function aggregateScores(list: NsfwScores[]): NsfwScores {
  if (list.length === 0) return emptyScores();
  const agg = emptyScores();
  for (const s of list) {
    agg.Porn += s.Porn;
    agg.Sexy += s.Sexy;
    agg.Hentai += s.Hentai;
    agg.Neutral += s.Neutral;
    agg.Drawing += s.Drawing;
  }
  const n = list.length;
  agg.Porn /= n;
  agg.Sexy /= n;
  agg.Hentai /= n;
  agg.Neutral /= n;
  agg.Drawing /= n;
  return agg;
}

export function worstOf(list: NsfwScores[]): NsfwScores {
  const worst = emptyScores();
  for (const s of list) {
    worst.Porn = Math.max(worst.Porn, s.Porn);
    worst.Sexy = Math.max(worst.Sexy, s.Sexy);
    worst.Hentai = Math.max(worst.Hentai, s.Hentai);
    worst.Neutral = Math.max(worst.Neutral, s.Neutral);
    worst.Drawing = Math.max(worst.Drawing, s.Drawing);
  }
  return worst;
}
