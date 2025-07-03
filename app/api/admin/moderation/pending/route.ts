import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { VideoModel as ImportedVideoModel, type IVideo } from "@/models/Video"; 
import CommentModel, { type IComment } from "@/models/Comment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { shouldUseMockDatabase, mockModels, MockQuery } from "@/lib/mock-db";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
        }

        await connectToDatabase();

        let pendingVideosData: IVideo[];
        let pendingCommentsData: IComment[];

        if (shouldUseMockDatabase()) {
            console.log("API: Using MOCK models to fetch pending items.");
            const videoQueryInstance: MockQuery = mockModels.Video.find({ descriptionModerationStatus: 'pending_review' });
            pendingVideosData = await videoQueryInstance.sort({ updatedAt: -1 }).lean().exec();

            const commentQueryInstance: MockQuery = mockModels.Comment.find({ textModerationStatus: 'pending_review' });
            pendingCommentsData = await commentQueryInstance.populate('user', 'name email').populate('video', 'title').sort({ updatedAt: -1 }).lean().exec();
            
        } else {
            console.log("API: Using REAL models to fetch pending items.");
            pendingVideosData = await ImportedVideoModel.find({
                descriptionModerationStatus: 'pending_review'
            })
            .sort({ updatedAt: -1 })
            .lean()
            .exec() as unknown as IVideo[]; 

            pendingCommentsData = await CommentModel.find({
                textModerationStatus: 'pending_review'
            })
            .populate('user', 'name email') 
            .populate('video', 'title') 
            .sort({ updatedAt: -1 })
            .lean()
            .exec() as unknown as IComment[];
        }

        return NextResponse.json({
            pendingVideos: pendingVideosData,
            pendingComments: pendingCommentsData
        }, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/admin/moderation/pending:", error); 
        let errorMessage = "Failed to fetch pending items. Please check server logs.";
        if (error instanceof Error) {
            errorMessage = process.env.NODE_ENV === 'development' ? error.message : "An internal server error occurred while fetching pending items.";
        }
        errorMessage += " If this issue persists with a real database, please contact contact2abhaygupta@gmail.com for support.";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
} 