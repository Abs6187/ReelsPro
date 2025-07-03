import mongoose, { Schema, model, models, Model as MongooseModel } from "mongoose";
import { shouldUseMockDatabase, mockModels, MockCollection } from "@/lib/mock-db";

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
    descriptionModerationStatus?: 'pending_review' | 'approved' | 'rejected' | 'not_analyzed';
    descriptionModerationReason?: string;
    descriptionAISuggestedCategory?: string;
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
    },
    descriptionModerationStatus: {
        type: String,
        enum: ['pending_review', 'approved', 'rejected', 'not_analyzed'],
        default: 'not_analyzed'
    },
    descriptionModerationReason: {
        type: String
    },
    descriptionAISuggestedCategory: {
        type: String
    }
},
{
    timestamps: true
}
);

// Explicitly define the type for VideoModel to help TypeScript
// This type should ideally be an interface that both MongooseModel<IVideo> and MockCollection satisfy
// For now, we use a union type.
let VideoModel: MongooseModel<IVideo> | MockCollection;

if (shouldUseMockDatabase()) {
    console.log("models/Video.ts: Using mock Video model");
    VideoModel = mockModels.Video as MockCollection; // Explicit cast to MockCollection
} else {
    console.log("models/Video.ts: Using REAL Mongoose Video model");
    // Ensure the real Mongoose model is correctly typed
    VideoModel = models?.Video as MongooseModel<IVideo> || model<IVideo>("Video", videoSchema);
}

export { VideoModel };