import type { IVideo } from "@/models/Video";
import { VIDEO_DIMENSIONS } from "@/models/Video";

export type VideoDTO = {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  transformations: {
    height: number;
    width: number;
    quality: number;
  };
  userId: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
};

type VideoLike = IVideo & {
  _id?: { toString(): string } | string;
  userId?: string;
  userEmail?: string;
};

export function serializeVideo(video: VideoLike): VideoDTO {
  const id =
    typeof video._id === "string" ? video._id : video._id?.toString() ?? "";

  return {
    _id: id,
    title: video.title,
    description: video.description,
    videoUrl: video.videoUrl,
    thumbnailUrl: video.thumbnailUrl,
    controls: video.controls ?? true,
    transformations: {
      height: video.transformations?.height ?? VIDEO_DIMENSIONS.height,
      width: video.transformations?.width ?? VIDEO_DIMENSIONS.width,
      quality: video.transformations?.quality ?? 80,
    },
    userId: video.userId ?? "",
    userEmail: video.userEmail ?? "",
    createdAt: video.createdAt ? new Date(video.createdAt).toISOString() : "",
    updatedAt: video.updatedAt ? new Date(video.updatedAt).toISOString() : "",
  };
}
