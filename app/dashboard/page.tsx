import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { serializeVideo } from "@/lib/serialize-video";
import VideoUploadForm from "@/components/VideoUploadForm";
import DashboardVideos from "@/components/DashboardVideos";

export default async function DashboardPage() {
  const session = await auth();
  await connectToDatabase();
  const videos = await Video.find({ userId: session?.user?.id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 p-4 py-6 md:p-8">
      <section className="reel-surface rounded-[2rem] p-5 md:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-primary/80">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
              Creator studio
            </h1>
            <p className="mt-2 text-base-content/70">
              Signed in as {session?.user?.email ?? "your account"}
            </p>
          </div>

          <div className="stats stats-vertical w-full max-w-sm bg-transparent text-primary-content shadow-none md:stats-horizontal">
            <div className="stat rounded-2xl bg-base-100/60 p-4 shadow-none">
              <div className="stat-title text-[10px] uppercase tracking-[0.22em] text-base-content/60">
                Uploads
              </div>
              <div className="stat-value text-2xl text-base-content">{videos.length}</div>
            </div>
            <div className="stat rounded-2xl bg-base-100/60 p-4 shadow-none">
              <div className="stat-title text-[10px] uppercase tracking-[0.22em] text-base-content/60">
                Status
              </div>
              <div className="stat-value text-xl text-success">Live</div>
            </div>
          </div>
        </div>
      </section>

      <VideoUploadForm />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-black tracking-tight">Your uploads</h2>
          <span className="badge badge-primary badge-soft rounded-full">{videos.length} reels</span>
        </div>
        <DashboardVideos initialVideos={videos.map(serializeVideo)} />
      </section>
    </main>
  );
}
