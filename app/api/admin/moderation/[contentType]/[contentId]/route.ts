import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { VideoModel as ImportedVideoModel, type IVideo } from "@/models/Video";
import CommentModel, { type IComment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

// const TypedCommentModel = CommentModel as Model<IComment>; // Removed cast

interface ContextParams {
    contentType: string;
    contentId: string;
}

export async function PUT(req: NextRequest, context: { params: ContextParams }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const { contentType, contentId } = context.params;
        const body = await req.json();
        const { status, moderatorReason } = body; 

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status. Must be 'approved' or 'rejected'." }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return NextResponse.json({ error: "Invalid contentId format." }, { status: 400 });
        }

        await connectToDatabase();
        let updatedDocument;

        if (contentType === 'videos') {
            updatedDocument = await ImportedVideoModel.findByIdAndUpdate(
                contentId,
                {
                    descriptionModerationStatus: status,
                    descriptionModerationReason: status === 'rejected' ? (moderatorReason || 'Rejected by moderator') : undefined,
                },
                { new: true } 
            );
        } else if (contentType === 'comments') {
            updatedDocument = await CommentModel.findByIdAndUpdate(
                contentId,
                {
                    textModerationStatus: status,
                    textModerationReason: status === 'rejected' ? (moderatorReason || 'Rejected by moderator') : undefined,
                },
                { new: true }
            );
        } else {
            return NextResponse.json({ error: "Invalid contentType. Must be 'videos' or 'comments'." }, { status: 400 });
        }

        if (!updatedDocument) {
            return NextResponse.json({ error: `${contentType} content with ID ${contentId} not found.` }, { status: 404 });
        }

        return NextResponse.json(updatedDocument, { status: 200 });

    } catch (error) {
        const errorLocation = `Error in PUT /api/admin/moderation/${context.params.contentType}/${context.params.contentId}`;
        console.error(errorLocation + ":", error); // Log actual error
        let errorMessage = "Failed to update moderation status";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 