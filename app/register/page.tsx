import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import RegisterForm from "@/components/RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="flex flex-1 items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-base-100/60 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="grid gap-8 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-8">
          <div className="hidden items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-secondary/18 via-base-200 to-primary/10 p-6 md:flex">
            <div className="max-w-md">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary/80">Start creating</p>
              <h1 className="mt-4 text-4xl font-black leading-tight">
                Turn trending ideas into short-form content people love.
              </h1>
              <p className="mt-4 text-base text-base-content/70">
                Curate standout reels, engage your community, and grow your creator brand from day one.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="badge badge-secondary badge-soft rounded-full">Short clips</span>
                <span className="badge badge-primary badge-soft rounded-full">Audience growth</span>
                <span className="badge badge-accent badge-soft rounded-full">Creator mode</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <RegisterForm />
          </div>
        </div>
      </div>
    </main>
  );
}
