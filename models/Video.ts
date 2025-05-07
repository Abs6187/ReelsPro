import mongoose, { Schema, model, models } from "mongoose";
import { shouldUseMockDatabase, mockModels } from "@/lib/mock-db";

export const VIDEO_DIMENSIONS = {
    width: 1080,
    height: 1920
} as const;

export interface IVideo {
    _id: mongoose.Types.ObjectId | string,
    title: string,
    description: string,
    videoUrl: string,
    thumbnailUrl: string,
    controls?: boolean,
    transformation?: {
        height: number,
        width: number,
        quality?: number
    }
    createdAt?: Date,
    updatedAt?: Date
}

const videoSchema = new Schema<IVideo>(
    {
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        default: true
    },
    transformation:{
        height: {
            type: Number,
            default: VIDEO_DIMENSIONS.height
        },
        width:{
            type: Number,
            default: VIDEO_DIMENSIONS.width
        },
        quality:{
            type: Number,
            min: 1,
            max:100
        }
    }
},
{
    timestamps: true
}
);

// Determine which model to use
let VideoModel;

if (shouldUseMockDatabase()) {
    console.log("Using mock Video model");
    VideoModel = mockModels.Video;
} else {
    // Use the real Mongoose model
    VideoModel = models?.Video || model<IVideo>("Video", videoSchema);
}

export default VideoModel;
