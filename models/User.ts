import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";
import { shouldUseMockDatabase, mockModels } from "@/lib/mock-db";

export interface IUser {
    email: string,
    password: string,
    _id?: mongoose.Types.ObjectId | string,
    createdAt?: Date,
    updatedAt?: Date
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
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

// Determine which model to use
let UserModel;

if (shouldUseMockDatabase()) {
    console.log("Using mock User model");
    UserModel = mockModels.User;
} else {
    // Use the real Mongoose model
    UserModel = models?.User || model<IUser>("User", userSchema);
}

export default UserModel;

