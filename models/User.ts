import mongoose, { Schema ,model,models } from "mongoose";
import bcrypt from "bcryptjs";

export type ContentFilterLevel = "off" | "moderate" | "strict";

export interface IUser {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId,
    createdAt?: Date,
    updatedAt?: Date,
    /** HaramBlur-style content filter preference for the feed. */
    contentFilter?: ContentFilterLevel,
    /** When true, female faces are blurred in thumbnails/feed (HaramBlur parity). */
    blurFaces?: boolean,
    /** Admin users can access the moderation dashboard. */
    isAdmin?: boolean,
}


const userSchema = new Schema<IUser>(
    {
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    contentFilter: {
        type: String,
        enum: ["off", "moderate", "strict"],
        default: "moderate",
    },
    blurFaces: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    },
    {
        timestamps: true
    }
)

userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

const User = models?.User || model<IUser>("User", userSchema)

export default User
