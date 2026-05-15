import { promises as fs } from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpeg = require("fluent-ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

import { downloadToTemp } from "./frame-extractor";

/**
 * Apply a uniform boxblur to the entire video. Returns local filesystem path
 * to the blurred mp4. Caller is responsible for uploading + cleanup.
 */
export async function blurEntireVideo(
  videoUrl: string,
  intensity = 20
): Promise<{ localPath: string; cleanup: () => Promise<void> }> {
  const inputFile = await downloadToTemp(videoUrl, ".mp4");
  const outputFile = path.join(
    os.tmpdir(),
    `blurred-${crypto.randomBytes(8).toString("hex")}.mp4`
  );

  await new Promise<void>((resolve, reject) => {
    ffmpeg(inputFile)
      .videoFilters(`boxblur=${intensity}:1`)
      .outputOptions(["-c:a", "copy", "-preset", "veryfast", "-movflags", "+faststart"])
      .on("end", () => resolve())
      .on("error", reject)
      .save(outputFile);
  });

  return {
    localPath: outputFile,
    cleanup: async () => {
      await Promise.allSettled([
        fs.unlink(inputFile),
        fs.unlink(outputFile),
      ]);
    },
  };
}

/** Blur a still image (jpeg/png) and return new buffer. */
export async function blurImageBuffer(buffer: Buffer, sigma = 25): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sharp = require("sharp");
  return sharp(buffer).blur(sigma).jpeg({ quality: 80 }).toBuffer();
}
