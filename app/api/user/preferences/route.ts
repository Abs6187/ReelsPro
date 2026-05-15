import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import type { FilterLevel } from "@/lib/moderation/types";

const VALID: FilterLevel[] = ["off", "moderate", "strict"];

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const u = await User.findById(session.user.id)
            .select("contentFilter blurFaces isAdmin email")
            .lean<{ contentFilter?: FilterLevel; blurFaces?: boolean; isAdmin?: boolean; email?: string }>();
        return NextResponse.json({
            email: u?.email,
            contentFilter: u?.contentFilter ?? "moderate",
            blurFaces: u?.blurFaces ?? false,
            isAdmin: !!u?.isAdmin,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const update: Record<string, unknown> = {};
        if (typeof body.contentFilter === "string") {
            if (!VALID.includes(body.contentFilter)) {
                return NextResponse.json(
                    { error: `contentFilter must be one of ${VALID.join(", ")}` },
                    { status: 400 }
                );
            }
            update.contentFilter = body.contentFilter;
        }
        if (typeof body.blurFaces === "boolean") {
            update.blurFaces = body.blurFaces;
        }

        await connectToDatabase();
        const u = await User.findByIdAndUpdate(
            session.user.id,
            { $set: update },
            { new: true }
        )
            .select("contentFilter blurFaces")
            .lean<{ contentFilter?: FilterLevel; blurFaces?: boolean }>();

        return NextResponse.json({
            contentFilter: u?.contentFilter ?? "moderate",
            blurFaces: u?.blurFaces ?? false,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }
}
