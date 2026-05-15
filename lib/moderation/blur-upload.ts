import { promises as fs } from "fs";
import path from "path";
import { blurEntireVideo, blurImageBuffer } from "./video-blur";
import { fetchBytes } from "./frame-extractor";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ImageKit = require("imagekit");

function ik() {
    return new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
        urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
    });
}

/**
 * Download → blur → upload to ImageKit `/blurred` folder. Returns the new URL.
 * Gracefully returns `null` on any failure so the caller can continue.
 */
export async function blurAndUploadVideo(videoUrl: string): Promise<string | null> {
    let cleanup: (() => Promise<void>) | null = null;
    try {
        const { localPath, cleanup: c } = await blurEntireVideo(videoUrl);
        cleanup = c;
        const buffer = await fs.readFile(localPath);
        const name = `blurred-${Date.now()}-${path.basename(localPath)}`;
        const res: any = await ik().upload({
            file: buffer,
            fileName: name,
            folder: "/videos/blurred",
            useUniqueFileName: true,
        });
        return res?.url ?? null;
    } catch (err) {
        console.warn("[moderation] blurAndUploadVideo failed:", (err as Error).message);
        return null;
    } finally {
        if (cleanup) await cleanup().catch(() => {});
    }
}

export async function blurAndUploadImage(imageUrl: string): Promise<string | null> {
    try {
        const original = await fetchBytes(imageUrl);
        const blurred = await blurImageBuffer(original);
        const res: any = await ik().upload({
            file: blurred,
            fileName: `blurred-${Date.now()}.jpg`,
            folder: "/images/blurred",
            useUniqueFileName: true,
        });
        return res?.url ?? null;
    } catch (err) {
        console.warn("[moderation] blurAndUploadImage failed:", (err as Error).message);
        return null;
    }
}
