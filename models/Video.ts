import mongoose , { Schema ,model,models } from "mongoose";
import type {
    ModerationStatus,
    NsfwClass,
    NsfwScores,
    FrameReport,
} from "@/lib/moderation/types";

export const VIDEO_DIMENSIONS ={
    width: 1080,
    height :1920
} as const

export interface IVideoModeration {
    status: ModerationStatus;
    scannedAt?: Date;
    reason?: string;
    aggregate?: NsfwScores;
    worst?: NsfwScores;
    maxScore?: number;
    dominantClass?: NsfwClass;
    faceCount?: number;
    genderStats?: { male: number; female: number; unknown: number };
    frames?: FrameReport[];
    embedding?: number[];
    blurredUrl?: string;
    reviewedBy?: string;
    reviewedAt?: Date;
    reviewNotes?: string;
}

export interface IVideo{
    _id: mongoose.Types.ObjectId,
    title: string,
    description: string,
    videoUrl: string,
    thumbnailUrl: string,
    controls?: boolean,
    transformation?: {
        height: number,
        width: number,
        quality?: number
    },
    category?: string,
    tags?: string[],
    uploadedBy?: mongoose.Types.ObjectId | string,
    moderation?: IVideoModeration,
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
    category: {
        type: String,
    },
    tags: {
        type: [String],
        default: []
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    moderation: {
        status: {
            type: String,
            enum: ["pending", "processing", "approved", "flagged", "rejected"],
            default: "pending",
            index: true,
        },
        scannedAt: { type: Date },
        reason: { type: String },
        aggregate: { type: Schema.Types.Mixed },
        worst: { type: Schema.Types.Mixed },
        maxScore: { type: Number, index: true },
        dominantClass: { type: String },
        faceCount: { type: Number },
        genderStats: { type: Schema.Types.Mixed },
        frames: { type: [Schema.Types.Mixed], default: [] },
        embedding: { type: [Number], default: undefined },
        blurredUrl: { type: String },
        reviewedBy: { type: String },
        reviewedAt: { type: Date },
        reviewNotes: { type: String },
    },
},
{
    timestamps:true
}
)

const Video = models?.Video || model<IVideo>("Video", videoSchema)

export default Video