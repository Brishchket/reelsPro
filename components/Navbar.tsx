import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-base-100/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-lg font-black text-primary-content shadow-lg shadow-primary/30">
            R
          </div>
          <div>
            <p className="text-base font-black tracking-tight">ReelsPro</p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-base-content/60">
              Creator hub
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/" className="btn btn-ghost btn-sm rounded-full">
            Feed
          </Link>
          {session?.user ? (
            <Link href="/dashboard" className="btn btn-ghost btn-sm rounded-full">
              Dashboard
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/dashboard" className="btn btn-primary btn-sm rounded-full shadow-lg shadow-primary/30">
                Studio
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="btn btn-outline btn-sm rounded-full">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm rounded-full">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm rounded-full shadow-lg shadow-primary/30">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
