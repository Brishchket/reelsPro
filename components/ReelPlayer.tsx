"use client";

import { Video } from "@imagekit/next";
import { useEffect, useRef } from "react";
import type { VideoDTO } from "@/lib/serialize-video";

export default function ReelPlayer({
  video,
  autoPlayWhenVisible = true,
}: {
  video: VideoDTO;
  autoPlayWhenVisible?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !autoPlayWhenVisible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.65 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlayWhenVisible]);

  return (
    <Video
      ref={videoRef}
      src={video.videoUrl}
      poster={video.thumbnailUrl}
      controls={video.controls}
      playsInline
      loop
      muted
      preload="metadata"
      className="h-full w-full object-cover"
      transformation={[
        {
          height: video.transformations.height,
          width: video.transformations.width,
          quality: video.transformations.quality,
        },
      ]}
    />
  );
}
