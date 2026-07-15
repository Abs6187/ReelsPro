import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

/** Cosine similarity — inlined to avoid importing the heavy moderation pipeline. */
function cosineSim(a: number[], b: number[]): number {
    const n = Math.min(a.length, b.length);
    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < n; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    if (na === 0 || nb === 0) return 0;
    return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await Promise.resolve(params);
        await connectToDatabase();

        const src = await Video.findById(id)
            .select("moderation.embedding title")
            .lean<{ moderation?: { embedding?: number[] }; title?: string }>();
        if (!src?.moderation?.embedding?.length) {
            return NextResponse.json([], { status: 200 });
        }
        const srcVec = src.moderation.embedding;

        const candidates = await Video.find({
            _id: { $ne: id },
            "moderation.embedding": { $exists: true, $ne: [] },
            "moderation.status": { $in: ["approved", "pending"] },
        })
            .select("title thumbnailUrl videoUrl moderation.embedding moderation.status")
            .limit(500)
            .lean();

        const scored = candidates
            .map((c: any) => ({
                video: c,
                score: cosineSim(srcVec, c.moderation?.embedding ?? []),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        return NextResponse.json(
            scored.map((s) => ({ ...s.video, similarity: s.score }))
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Similarity search failed" }, { status: 500 });
    }
}
