"use client";

import { FormEvent, useState } from "react";
import type { VideoDTO } from "@/lib/serialize-video";
import ReelPlayer from "@/components/ReelPlayer";

export default function DashboardVideos({
  initialVideos,
}: {
  initialVideos: VideoDTO[];
}) {
  const [videos, setVideos] = useState(initialVideos);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const startEdit = (video: VideoDTO) => {
    setEditingId(video._id);
    setDraftTitle(video.title);
    setDraftDescription(video.description);
    setError(null);
  };

  const saveEdit = async (event: FormEvent, id: string) => {
    event.preventDefault();
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draftTitle,
          description: draftDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update video");
      setVideos((current) =>
        current.map((video) => (video._id === id ? data.video : video))
      );
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update video");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this reel? This cannot be undone.")) return;
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete video");
      setVideos((current) => current.filter((video) => video._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
    } finally {
      setBusyId(null);
    }
  };

  if (videos.length === 0) {
    return (
      <div className="reel-surface rounded-[2rem] p-6 text-center">
        <p className="text-base-content/70">You have not uploaded any reels yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div role="alert" className="alert alert-error text-sm rounded-2xl">
          {error}
        </div>
      ) : null}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <li key={video._id} className="reel-surface overflow-hidden rounded-[1.75rem]">
            <figure className="aspect-[9/16] overflow-hidden bg-black">
              <ReelPlayer video={video} autoPlayWhenVisible={false} />
            </figure>
            <div className="card-body gap-3 p-4">
              {editingId === video._id ? (
                <form
                  className="space-y-3"
                  onSubmit={(event) => saveEdit(event, video._id)}
                >
                  <input
                    className="input input-bordered w-full rounded-2xl border-white/10 bg-base-100/70"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    required
                  />
                  <textarea
                    className="textarea textarea-bordered w-full rounded-2xl border-white/10 bg-base-100/70"
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary btn-sm rounded-full"
                      disabled={busyId === video._id}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm rounded-full"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title text-base leading-tight">{video.title}</h3>
                    <span className="badge badge-primary badge-soft rounded-full">Reel</span>
                  </div>
                  <p className="text-sm text-base-content/75 line-clamp-3">
                    {video.description || "No description"}
                  </p>
                  <div className="card-actions justify-end pt-1">
                    <button
                      className="btn btn-ghost btn-sm rounded-full"
                      onClick={() => startEdit(video)}
                      disabled={busyId === video._id}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error btn-sm rounded-full"
                      onClick={() => remove(video._id)}
                      disabled={busyId === video._id}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
