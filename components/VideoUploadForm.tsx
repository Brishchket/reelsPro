"use client";

import { upload } from "@imagekit/next";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a video file first");
      return;
    }
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const authRes = await fetch("/api/upload-auth");
      if (!authRes.ok) {
        throw new Error("You must be signed in to upload");
      }
      const { token, expire, signature, publicKey } = await authRes.json();

      const result = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
        folder: "/reelspro/videos",
        onProgress: (e) => setProgress((e.loaded / e.total) * 100),
      });

      if (!result.url) {
        throw new Error("Upload succeeded but no video URL was returned");
      }

      const saveRes = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          videoUrl: result.url,
          thumbnailUrl: `${result.url}/ik-thumbnail.jpg`,
        }),
      });

      const saveJson = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) {
        throw new Error(saveJson.error || "Failed to save video after upload");
      }

      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setProgress(0);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="reel-surface reel-glow rounded-[2rem] p-1">
      <div className="card bg-base-200/80 shadow-none">
        <div className="card-body gap-4 p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.26em] text-primary/80">Creator studio</p>
              <h2 className="card-title mt-1 text-2xl">Upload a reel</h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-xl shadow-lg shadow-primary/30">
              ↑
            </div>
          </div>

          {error ? (
            <div role="alert" className="alert alert-error text-sm rounded-2xl">
              {error}
            </div>
          ) : null}

          <label className="form-control w-full">
            <span className="label-text mb-2 text-sm font-medium">Title</span>
            <input
              className="input input-bordered w-full rounded-2xl border-white/10 bg-base-100/70"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-2 text-sm font-medium">Description</span>
            <textarea
              className="textarea textarea-bordered w-full rounded-2xl border-white/10 bg-base-100/70"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
            />
          </label>

          <div className="rounded-2xl border border-dashed border-base-content/15 bg-base-100/50 p-3">
            <input
              type="file"
              accept="video/*"
              ref={fileInputRef}
              className="file-input file-input-bordered file-input-primary w-full rounded-2xl border-white/10 bg-base-100/70"
            />
          </div>

          {uploading ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-base-content/60">
                <span>Uploading</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <progress
                className="progress progress-primary h-3 w-full"
                value={progress}
                max={100}
              />
            </div>
          ) : null}

          <button type="submit" className="btn btn-primary rounded-full px-6 shadow-lg shadow-primary/25" disabled={uploading}>
            {uploading ? `Uploading… ${Math.round(progress)}%` : "Upload reel"}
          </button>
        </div>
      </div>
    </form>
  );
}
