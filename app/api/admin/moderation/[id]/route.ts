import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import User from "@/models/User";
import type { ModerationStatus } from "@/lib/moderation/types";

const ALLOWED: ModerationStatus[] = [
    "approved",
    "flagged",
    "rejected",
    "pending",
    "processing",
];

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const me = await User.findById(session.user.id)
            .select("isAdmin email")
            .lean<{ isAdmin?: boolean; email?: string }>();
        if (!me?.isAdmin) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await Promise.resolve(params);
        const body = await req.json();
        const status = body?.status as ModerationStatus | undefined;
        const notes = typeof body?.notes === "string" ? body.notes : undefined;

        if (!status || !ALLOWED.includes(status)) {
            return NextResponse.json(
                { error: `status must be one of ${ALLOWED.join(", ")}` },
                { status: 400 }
            );
        }

        const updated = await Video.findByIdAndUpdate(
            id,
            {
                $set: {
                    "moderation.status": status,
                    "moderation.reviewedBy": me.email ?? session.user.id,
                    "moderation.reviewedAt": new Date(),
                    ...(notes ? { "moderation.reviewNotes": notes } : {}),
                },
            },
            { new: true }
        ).lean();

        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
