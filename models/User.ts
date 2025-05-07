import mongoose, { Schema, model, models, type Model } from "mongoose";
import bcrypt from "bcryptjs";
import { shouldUseMockDatabase, mockModels } from "@/lib/mock-db";

// 1. Define the IUser interface for your User documents
export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Create the Mongoose schema, tying it to IUser
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 3. Hash password on save if it’s new or changed
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// 4. Determine which model to export: mock or real
let UserModel: Model<IUser>;

if (shouldUseMockDatabase()) {
  console.log("Using mock User model");
  UserModel = mockModels.User as Model<IUser>;
} else {
  // Use existing compiled model if available, else compile a new one
  UserModel =
    (models.User as Model<IUser>) || model<IUser>("User", userSchema);
}

export default UserModel;
