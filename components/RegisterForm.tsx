"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        throw new Error("Account created, but sign-in failed. Try logging in.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="card w-full max-w-md border border-white/10 bg-base-200/80 shadow-2xl shadow-secondary/10 backdrop-blur-xl">
      <form className="card-body gap-4 p-6 md:p-7" onSubmit={onSubmit}>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-secondary/80">Create account</p>
          <h1 className="card-title mt-2 text-3xl font-black">Join ReelsPro</h1>
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
            minLength={8}
            required
          />
          <span className="label-text-alt mt-2 text-xs text-base-content/60">
            At least 8 characters, including a letter and a number.
          </span>
        </label>

        <button className="btn btn-primary mt-2 rounded-full shadow-lg shadow-primary/25" disabled={pending}>
          {pending ? "Creating account…" : "Register"}
        </button>

        <p className="text-sm text-base-content/70">
          Already have an account?{" "}
          <Link href="/login" className="link link-primary font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
