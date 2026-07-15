import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODERATION_ENABLED =
    (process.env.MODERATION_ENABLED ?? "true").toLowerCase() !== "false";

export async function POST(req: NextRequest) {
    if (!MODERATION_ENABLED) {
        return NextResponse.json({ error: "Moderation is disabled" }, { status: 503 });
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const url: string | undefined = body?.url;
        const mediaType: "image" | "video" = body?.mediaType === "video" ? "video" : "image";
        const skipFaces: boolean = !!body?.skipFaces;

        if (!url || typeof url !== "string") {
            return NextResponse.json({ error: "Missing url" }, { status: 400 });
        }

        // Lazy-load heavy moderation modules — prevents ffmpeg/TensorFlow from
        // crashing the serverless function at module-load time on Vercel.
        const { assertAllowedMediaUrl } = await import("@/lib/moderation/ssrf-guard");
        const { runModerationPipeline } = await import("@/lib/moderation/pipeline");

        try {
            assertAllowedMediaUrl(url);
        } catch (e) {
            return NextResponse.json({ error: (e as Error).message }, { status: 400 });
        }

        const report = await runModerationPipeline(url, { mediaType, skipFaces });
        return NextResponse.json(report);
    } catch (err) {
        console.error("[/api/moderation/scan]", err);
        return NextResponse.json(
            { error: "Scan failed", detail: (err as Error).message },
            { status: 500 }
        );
    }
}
