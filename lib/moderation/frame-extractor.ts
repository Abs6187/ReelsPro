import { promises as fs } from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffprobeInstaller = require("@ffprobe-installer/ffprobe");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export interface ExtractedFrame {
  buffer: Buffer;
  ts: number; // seconds
}

export async function downloadToTemp(url: string, ext = ""): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const tmp = path.join(
    os.tmpdir(),
    `mod-${crypto.randomBytes(8).toString("hex")}${ext}`
  );
  await fs.writeFile(tmp, buf);
  return tmp;
}

export async function fetchBytes(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed (${res.status}) for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

function probeDuration(file: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file, (err: Error | null, data: any) => {
      if (err) return reject(err);
      const dur = Number(data?.format?.duration ?? 0);
      resolve(isFinite(dur) ? dur : 0);
    });
  });
}

/**
 * Sample N evenly-spaced frames from a video URL. Returns JPEG buffers + timestamps.
 */
export async function sampleVideoFrames(
  videoUrl: string,
  count = Number(process.env.VIDEO_FRAME_SAMPLE_COUNT ?? 5)
): Promise<ExtractedFrame[]> {
  const inputFile = await downloadToTemp(videoUrl, ".mp4");
  const outDir = path.join(
    os.tmpdir(),
    `frames-${crypto.randomBytes(6).toString("hex")}`
  );
  await fs.mkdir(outDir, { recursive: true });

  try {
    const duration = await probeDuration(inputFile);
    const safeDur = duration > 0 ? duration : 1;
    const n = Math.max(1, count);

    // Pick timestamps in (0, duration) excluding the very last frame
    const timestamps: number[] = [];
    for (let i = 0; i < n; i++) {
      const t = ((i + 1) / (n + 1)) * safeDur;
      timestamps.push(Number(t.toFixed(2)));
    }

    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputFile)
        .on("end", () => resolve())
        .on("error", reject)
        .screenshots({
          timestamps,
          folder: outDir,
          filename: "frame-%i.jpg",
          size: "640x?",
        });
    });

    const files = (await fs.readdir(outDir))
      .filter((f) => f.endsWith(".jpg"))
      .sort();
    const frames: ExtractedFrame[] = [];
    for (let i = 0; i < files.length; i++) {
      const buf = await fs.readFile(path.join(outDir, files[i]));
      frames.push({ buffer: buf, ts: timestamps[i] ?? 0 });
    }
    return frames;
  } finally {
    // best-effort cleanup
    fs.rm(outDir, { recursive: true, force: true }).catch(() => {});
    fs.unlink(inputFile).catch(() => {});
  }
}
