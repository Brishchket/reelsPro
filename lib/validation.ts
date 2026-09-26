const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (!value) return "Email is required";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must include a letter and a number";
  }
  return null;
}

export type VideoPayload = {
  title?: unknown;
  description?: unknown;
  videoUrl?: unknown;
  thumbnailUrl?: unknown;
};

export function validateVideoPayload(body: VideoPayload): string | null {
  if (typeof body.title !== "string" || !body.title.trim()) {
    return "Title is required";
  }
  if (body.title.trim().length > 120) {
    return "Title must be 120 characters or fewer";
  }
  if (body.description != null && typeof body.description !== "string") {
    return "Description must be a string";
  }
  if (typeof body.description === "string" && body.description.length > 2000) {
    return "Description must be 2000 characters or fewer";
  }
  if (typeof body.videoUrl !== "string" || !body.videoUrl.trim()) {
    return "Video URL is required";
  }
  if (typeof body.thumbnailUrl !== "string" || !body.thumbnailUrl.trim()) {
    return "Thumbnail URL is required";
  }
  return null;
}
