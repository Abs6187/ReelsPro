// models/Video.ts
import mongoose, {
  Schema,
  model,
  models,
  type Model,
  type Document,
} from "mongoose";
import { shouldUseMockDatabase, mockModels } from "@/lib/mock-db";

// 1. Export constants & TS interface for your Video documents
export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId | string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. Define the schema matching IVideo
const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: {
        type: Number,
        default: VIDEO_DIMENSIONS.height,
      },
      width: {
        type: Number,
        default: VIDEO_DIMENSIONS.width,
      },
      quality: {
        type: Number,
        min: 1,
        max: 100,
      },
    },
  },
  {
    timestamps: true,
  }
);

// 3. Create a typed Model<IVideo> reference
let VideoModel: Model<IVideo & Document>;

// 4. Swap in mock or real model based on env
if (shouldUseMockDatabase()) {
  console.log("Using mock Video model");
  // Cast mockModels.Video to Model<IVideo>
  VideoModel = mockModels.Video as Model<IVideo & Document>;
} else {
  // Reuse an existing compiled model if present, else compile a new one
  VideoModel =
    (models.Video as Model<IVideo & Document>) ||
    model<IVideo & Document>("Video", videoSchema);
}

// 5. Export the model
export default VideoModel;
