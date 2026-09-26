import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { serializeVideo } from "@/lib/serialize-video";
import VideoFeed from "@/components/VideoFeed";

export default async function Home() {
  await connectToDatabase();
  const limit = 8;
  const [videos, total] = await Promise.all([
    Video.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    Video.countDocuments(),
  ]);

  return (
    <VideoFeed
      initialVideos={videos.map(serializeVideo)}
      initialHasMore={limit < total}
    />
  );
}
