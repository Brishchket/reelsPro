"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoDTO } from "@/lib/serialize-video";
import ReelPlayer from "@/components/ReelPlayer";

type FeedResponse = {
  videos: VideoDTO[];
  hasMore: boolean;
  error?: string;
};

export default function VideoFeed({
  initialVideos,
  initialHasMore,
}: {
  initialVideos: VideoDTO[];
  initialHasMore: boolean;
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/videos?page=${nextPage}&limit=8`);
      const data = (await res.json()) as FeedResponse;
      if (!res.ok) {
        throw new Error(data.error || "Failed to load more videos");
      }
      setVideos((current) => {
        const seen = new Set(current.map((v) => v._id));
        return [...current, ...data.videos.filter((v) => !seen.has(v._id))];
      });
      setPage(nextPage);
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  if (videos.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="reel-surface reel-glow w-full max-w-md rounded-[2rem] p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-2xl">
            ✦
          </div>
          <h1 className="text-2xl font-black">No reels yet</h1>
          <p className="mt-2 text-sm text-base-content/70">
            Upload the first video from your dashboard and start the feed.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 md:px-6">
      <div className="flex items-center justify-between gap-3 px-2">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary/75">For you</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight">Reels</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-primary badge-soft rounded-full">Trending</span>
          <span className="badge badge-ghost rounded-full">Fresh</span>
        </div>
      </div>

      <div className="h-[calc(100dvh-8rem)] overflow-y-auto snap-y snap-mandatory pb-4">
        {videos.map((video) => (
          <section
            key={video._id}
            className="flex snap-start items-center justify-center py-2"
          >
            <article className="relative h-full w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-base-100 shadow-[0_30px_80px_rgba(0,0,0,0.46)]">
              <ReelPlayer video={video} />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 text-white">
                <div className="mb-3 flex items-center justify-between text-xs text-white/80">
                  <span className="badge badge-primary badge-soft rounded-full">Live</span>
                  <span>{video.userEmail}</span>
                </div>
                <h2 className="text-xl font-bold leading-tight">{video.title}</h2>
                {video.description ? (
                  <p className="mt-2 max-w-xs text-sm text-white/80 line-clamp-3">
                    {video.description}
                  </p>
                ) : null}
              </div>
            </article>
          </section>
        ))}

        <div ref={sentinelRef} className="h-8" />
        {loading ? (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner loading-md text-primary" />
          </div>
        ) : null}
        {error ? (
          <div className="flex justify-center pb-8">
            <button className="btn btn-outline btn-sm rounded-full" onClick={loadMore}>
              {error} — retry
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
