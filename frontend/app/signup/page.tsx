"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import AuthBackground from "@/components/AuthBackground";
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
    if (res.success && res.requiresEmailConfirmation) {
      setSuccess("Account created. Check your email to confirm it, then sign in.");
    } else if (res.success) {
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/reports");
      }, 1000);
    } else {
      setError(res.error || "Failed to create account.");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-12 overflow-hidden">
      {/* Dynamic Cybernetic / Cosmic Auth Background */}
      <AuthBackground />

      <div className="card relative w-full max-w-sm p-8 bg-card/85 backdrop-blur-2xl border-white/10 shadow-[0_0_70px_-15px_rgba(255,255,255,0.08)]">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Join DarkSpot Atlas to track verified audits.</p>
        
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 rounded-lg border border-white/20 bg-white/[0.04] p-3 text-xs text-white">
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
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Choose password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            required
          />
          <div className="flex gap-1 py-1">
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
            className="btn-primary w-full py-3 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-bg" /> Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>
          <button
            type="button"
            onClick={() => alert("Google OAuth requires domain redirect configuration in Supabase Dashboard.")}
            className="btn-ghost w-full py-3 text-xs"
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

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-subtle border-t border-line pt-4">
          <ShieldCheck size={13} className="text-white" />
          <span>Encrypted with Supabase JWT Authentication</span>
        </div>
      </div>
    </div>
  );
}
