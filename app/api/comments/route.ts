import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import CommentModel, { type IComment } from "@/models/Comment";
import { VideoModel as ImportedVideoModel, type IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { moderateText } from "@/lib/aiModeration";
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const body = await req.json();
        const { videoId, text } = body;

        if (!videoId || !text) {
            return NextResponse.json({ error: "Missing required fields: videoId and text are required." }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(videoId)) {
            return NextResponse.json({ error: "Invalid videoId format." }, { status: 400 });
        }

        const videoExists = await ImportedVideoModel.findById(videoId);
        if (!videoExists) {
            return NextResponse.json({ error: "Video not found." }, { status: 404 });
        }

        const moderationResult = await moderateText(text);

        const commentData: Partial<IComment> = {
            user: new mongoose.Types.ObjectId(session.user.id),
            video: new mongoose.Types.ObjectId(videoId),
            text: text,
            textModerationStatus: moderationResult.isFlagged ? 'pending_review' : 'approved',
            textModerationReason: moderationResult.reason,
            textAISuggestedCategory: moderationResult.category,
        };

        const newComment = await CommentModel.create(commentData as IComment);

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/comments:", error);
        let errorMessage = "Failed to create comment";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// Future GET request for comments of a video (example)
// export async function GET(req: NextRequest) {
//     const { searchParams } = new URL(req.url);
//     const videoId = searchParams.get('videoId');

//     if (!videoId) {
//         return NextResponse.json({ error: "Missing videoId query parameter" }, { status: 400 });
//     }

//     try {
//         await connectToDatabase();
//         const comments = await TypedCommentModel.find({ video: new mongoose.Types.ObjectId(videoId) })
//                                         .populate('user', 'name image')
//                                         .sort({ createdAt: -1 });
//         return NextResponse.json(comments);
//     } catch (error) {
//         console.error("Failed to fetch comments:", error);
//         return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
//     }
// } 