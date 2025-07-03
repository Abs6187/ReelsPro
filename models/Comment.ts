import mongoose, { Schema, model, models, Document, Types } from "mongoose";

export interface IComment extends Document {
    user: Types.ObjectId; // Reference to User model
    video: Types.ObjectId; // Reference to Video model
    text: string;
    textModerationStatus: 'pending_review' | 'approved' | 'rejected' | 'not_analyzed';
    textModerationReason?: string;
    textAISuggestedCategory?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const commentSchema = new Schema<IComment>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        textModerationStatus: {
            type: String,
            enum: ['pending_review', 'approved', 'rejected', 'not_analyzed'],
            default: 'not_analyzed',
        },
        textModerationReason: {
            type: String,
        },
        textAISuggestedCategory: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = models?.Comment || model<IComment>("Comment", commentSchema);

export default Comment; 