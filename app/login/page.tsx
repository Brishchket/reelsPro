import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-base-100/60 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="grid gap-8 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="hidden items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-primary/20 via-base-200 to-secondary/10 p-6 md:flex">
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.3em] text-primary/80">Build your audience</p>
              <h1 className="mt-4 text-4xl font-black leading-tight">
                Publish bold stories in a scroll-stopping feed.
              </h1>
              <p className="mt-4 text-base text-base-content/70">
                Edit your videos, build a creator brand, and turn every upload into a moment people watch to the end.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="badge badge-primary badge-soft rounded-full">Short-form videos</span>
                <span className="badge badge-secondary badge-soft rounded-full">Creator tools</span>
                <span className="badge badge-accent badge-soft rounded-full">Fast uploads</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Suspense fallback={<span className="loading loading-spinner loading-lg" />}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
