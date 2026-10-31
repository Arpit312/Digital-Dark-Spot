"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { authSignup } from "@/lib/api";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const score = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /\d/.test(pw),
    /[^A-Za-z0-9]/.test(pw)
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) {
      setError("Please fill in email and password.");
      return;
    }
    if (pw.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await authSignup(email, pw, name);
    setLoading(false);
    if (res.success) {
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/reports");
      }, 1000);
    } else {
      setError(res.error || "Failed to create account.");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-5">
      <div className="dot-grid absolute inset-0" />
      <div className="card relative w-full max-w-sm p-8">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Create your account</h1>
        
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            {success}
          </div>
        )}

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Full name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded transition-colors ${
                  i < score ? "bg-fg" : "bg-line-strong"
                }`}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
          <button
            type="button"
            onClick={() => alert("Google OAuth requires domain configuration in Supabase Dashboard.")}
            className="btn-ghost w-full py-3"
          >
            Continue with Google
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Have an account?{" "}
          <Link href="/login" className="text-fg underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-subtle">
          Officer access requires verification by an admin.
        </p>
      </div>
    </div>
  );
}
