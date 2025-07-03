import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { VideoModel as ImportedVideoModel, type IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { moderateText } from "@/lib/aiModeration";

export async function GET(){
    try {
        await connectToDatabase()

        const videos = await ImportedVideoModel.find({}).sort({createdAt: -1}).lean()

        if(!videos || videos.length === 0){
            return NextResponse.json([], {status: 200})
        }
        return NextResponse.json(videos)
    } catch (error) {
        console.error("Error in GET /api/videos:", error)
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

        const moderationResult = await moderateText(body.description);

        const videoData: Partial<IVideo> = {
            title: body.title,
            description: body.description,
            videoUrl: body.videoUrl,
            thumbnailUrl: body.thumbnailUrl,
            controls: body.controls || true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality || 100
            },
            descriptionModerationStatus: moderationResult.isFlagged ? 'pending_review' : 'approved',
            descriptionModerationReason: moderationResult.reason,
            descriptionAISuggestedCategory: moderationResult.category
        }

        const newVideo = await ImportedVideoModel.create(videoData as IVideo)

        return NextResponse.json(newVideo, {status: 201})
    } catch (error) {
        console.error("Error in POST /api/videos:", error)
        return NextResponse.json({error: "Failed to create video"}, {status: 500})
    }
}