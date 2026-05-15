import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import User from "@/models/User";

async function requireAdmin() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { error: "Unauthorized", status: 401 as const };
    await connectToDatabase();
    const me = await User.findById(session.user.id).select("isAdmin").lean<{ isAdmin?: boolean }>();
    if (!me?.isAdmin) return { error: "Forbidden", status: 403 as const };
    return { session };
}

export async function GET(req: NextRequest) {
    try {
        const gate = await requireAdmin();
        if ("error" in gate) return NextResponse.json({ error: gate.error }, { status: gate.status });

        const url = new URL(req.url);
        const status = url.searchParams.get("status") ?? "flagged";
        const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);

        const videos = await Video.find({ "moderation.status": status })
            .sort({ "moderation.maxScore": -1, createdAt: -1 })
            .limit(limit)
            .lean();

        return NextResponse.json(videos);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 });
    }
}
