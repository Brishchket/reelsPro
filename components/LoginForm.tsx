"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "Sign-in failed. Try again." : null
  );
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setPending(false);
    if (result?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="card w-full max-w-md border border-white/10 bg-base-200/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
      <form className="card-body gap-4 p-6 md:p-7" onSubmit={onSubmit}>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-primary/80">Welcome back</p>
          <h1 className="card-title mt-2 text-3xl font-black">Log in</h1>
        </div>

        {error ? (
          <div role="alert" className="alert alert-error rounded-2xl text-sm">
            {error}
          </div>
        ) : null}

        <label className="form-control">
          <span className="label-text mb-2 text-sm font-medium">Email</span>
          <input
            type="email"
            className="input input-bordered w-full rounded-2xl border-white/10 bg-base-100/70"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-2 text-sm font-medium">Password</span>
          <input
            type="password"
            className="input input-bordered w-full rounded-2xl border-white/10 bg-base-100/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button className="btn btn-primary mt-2 rounded-full shadow-lg shadow-primary/25" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>

        <button
          type="button"
          className="btn btn-outline rounded-full"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </button>

        <p className="text-sm text-base-content/70">
          No account?{" "}
          <Link href="/register" className="link link-primary font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
