import mongoose, { model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  width: 1080,
  height: 1920,
} as const;

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  userId: string;
  userEmail: string;
  transformations?: {
    height?: number;
    width?: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new mongoose.Schema<IVideo>(
  {
    title: { type: String, required: true, trim: true, minlength: 1 },
    description: { type: String, default: "", trim: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    userId: { type: String, required: true, index: true },
    userEmail: { type: String, required: true },
    transformations: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, default: 80 },
    },
  },
  {
    timestamps: true,
  }
);

videoSchema.index({ createdAt: -1 });

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
