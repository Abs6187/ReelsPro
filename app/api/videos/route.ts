import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import User from "@/models/User";
import { runModerationPipeline } from "@/lib/moderation/pipeline";
import { VIEW_THRESHOLDS, exceedsThreshold } from "@/lib/moderation/thresholds";
import { assertAllowedMediaUrl } from "@/lib/moderation/ssrf-guard";
import { blurAndUploadVideo, blurAndUploadImage } from "@/lib/moderation/blur-upload";
import type { FilterLevel, NsfwScores } from "@/lib/moderation/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODERATION_ENABLED =
    (process.env.MODERATION_ENABLED ?? "true").toLowerCase() !== "false";

export async function GET(){
    try {
        await connectToDatabase()

        // Determine viewer's filter preference
        let filter: FilterLevel = "moderate";
        try {
            const session = await getServerSession(authOptions);
            if (session?.user?.id) {
                const viewer = await User.findById(session.user.id)
                    .select("contentFilter")
                    .lean<{ contentFilter?: FilterLevel }>();
                if (viewer?.contentFilter) filter = viewer.contentFilter;
            }
        } catch {
            // ignore — keep default
        }

        // Base query: exclude rejected content from everyone, and exclude
        // un-scanned (pending/processing) content for strict viewers.
        const okStatuses: string[] =
            filter === "strict"
                ? ["approved"]
                : ["approved", "pending"];
        const baseQuery: Record<string, unknown> = {
            $or: [
                { "moderation.status": { $in: okStatuses } },
                { "moderation.status": { $exists: false } },
            ],
        };

        const videos = await Video.find(baseQuery)
            .sort({ createdAt: -1 })
            .lean();

        // Apply view-time NSFW threshold filter in JS (worst is a nested doc
        // so we filter after the fact; acceptable for feed-sized result sets).
        const t = VIEW_THRESHOLDS[filter];
        const filtered = videos.filter((v: any) => {
            if (filter === "off") return true;
            const worst: NsfwScores | undefined = v.moderation?.worst;
            if (!worst) return filter !== "strict"; // strict hides unscanned
            return !exceedsThreshold(worst, t).unsafe;
        });

        if (filtered.length === 0) {
            return NextResponse.json([], { status: 200 });
        }
        return NextResponse.json(filtered);
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to fetch videos"}, {status: 500})
    }
}


export async function POST(req:NextRequest){
    try {
        const session = await getServerSession(authOptions)

        if(!session){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        await connectToDatabase()

        const body:IVideo = await req.json()

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json({error: "Missing required fields"}, {status: 400})
        }

        // --- ReelsPro-style moderation pass ---
        let moderation: IVideo["moderation"] = { status: "pending" };
        if (MODERATION_ENABLED) {
            // ImageKit uploads return relative paths (e.g. /videos/xyz).
            // Build full URLs for SSRF checking and moderation scanning.
            const ikEndpoint = (process.env.NEXT_PUBLIC_URL_ENDPOINT ?? "").replace(/\/$/, "");
            const toFullUrl = (pathOrUrl: string) => {
                if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
                    return pathOrUrl;
                }
                return `${ikEndpoint}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
            };

            const videoFullUrl = toFullUrl(body.videoUrl);
            const thumbFullUrl = toFullUrl(body.thumbnailUrl);

            // SSRF: only scan URLs from our allowed media hosts.
            try {
                assertAllowedMediaUrl(videoFullUrl);
                assertAllowedMediaUrl(thumbFullUrl);
            } catch (e) {
                return NextResponse.json(
                    { error: (e as Error).message },
                    { status: 400 }
                );
            }

            const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".avi", ".mkv", ".m4v"];
            const isVideoUrl = (url: string) =>
                VIDEO_EXTS.some((ext) => url.toLowerCase().includes(ext));
            // If thumbnailUrl is actually a video path (IK returns filePath for both),
            // skip the image scan to avoid "unsupported image format" errors.
            const thumbIsVideo = isVideoUrl(thumbFullUrl) || thumbFullUrl === videoFullUrl;

            try {
                const [thumb, video] = await Promise.all([
                    thumbIsVideo
                        ? Promise.resolve(null)
                        : runModerationPipeline(thumbFullUrl, {
                              mediaType: "image",
                          }).catch((e) => {
                              console.warn("[moderation] thumb scan failed:", e.message);
                              return null;
                          }),
                    runModerationPipeline(videoFullUrl, {
                        mediaType: "video",
                    }).catch((e) => {
                        console.warn("[moderation] video scan failed:", e.message);
                        return null;
                    }),
                ]);

                const report = video ?? thumb;
                if (report) {
                    if (report.verdict.status === "rejected") {
                        return NextResponse.json(
                            {
                                error: "Content violates community guidelines",
                                reason: report.verdict.reason,
                                moderation: {
                                    status: "rejected",
                                    maxScore: report.maxScore,
                                    dominantClass: report.dominantClass,
                                },
                            },
                            { status: 422 }
                        );
                    }

                    // If verdict says "blur", run ffmpeg boxblur and re-upload.
                    let blurredUrl: string | undefined;
                    if (report.verdict.shouldBlur) {
                        const [vBlur, iBlur] = await Promise.all([
                            blurAndUploadVideo(videoFullUrl),
                            blurAndUploadImage(thumbFullUrl),
                        ]);
                        blurredUrl = vBlur ?? iBlur ?? undefined;
                    }

                    moderation = {
                        status: report.verdict.status,
                        scannedAt: new Date(),
                        reason: report.verdict.reason,
                        aggregate: report.aggregate,
                        worst: report.worst,
                        maxScore: report.maxScore,
                        dominantClass: report.dominantClass,
                        faceCount: report.faceCount,
                        genderStats: report.genderStats,
                        frames: report.frames,
                        embedding: report.embedding,
                        blurredUrl,
                    };
                }
            } catch (err) {
                console.warn("[moderation] pipeline errored:", (err as Error).message);
            }
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality || 100
            },
            uploadedBy: session.user.id,
            moderation,
        }

        const newVideo = await Video.create(videoData)

        return NextResponse.json(newVideo, {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to create video"}, {status: 500})
    }
}
