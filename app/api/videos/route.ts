import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video, { VIDEO_DIMENSIONS } from "@/models/Video";
import { serializeVideo } from "@/lib/serialize-video";
import { validateVideoPayload } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
    const limit = Math.min(20, Math.max(1, Number(searchParams.get("limit") || 8) || 8));
    const mine = searchParams.get("mine") === "1";

    const filter: Record<string, string> = {};
    if (mine) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      filter.userId = session.user.id;
    }

    const [videos, total] = await Promise.all([
      Video.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Video.countDocuments(filter),
    ]);

    return NextResponse.json({
      videos: videos.map(serializeVideo),
      page,
      limit,
      total,
      hasMore: page * limit < total,
    });
  } catch (error) {
    console.error("GET /api/videos failed", error);
    return NextResponse.json(
      { error: "Failed to load videos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validationError = validateVideoPayload(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    await connectToDatabase();

    const video = await Video.create({
      title: String(body.title).trim(),
      description: typeof body.description === "string" ? body.description.trim() : "",
      videoUrl: String(body.videoUrl).trim(),
      thumbnailUrl: String(body.thumbnailUrl).trim(),
      userId: session.user.id,
      userEmail: session.user.email ?? "unknown",
      transformations: {
        height: VIDEO_DIMENSIONS.height,
        width: VIDEO_DIMENSIONS.width,
        quality: 80,
      },
    });

    return NextResponse.json(
      { video: serializeVideo(video.toObject()) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/videos failed", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Failed to save video";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
