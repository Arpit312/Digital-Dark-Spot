"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import AuthBackground from "@/components/AuthBackground";
import { authLogin } from "@/lib/api";

export default function Login() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await authLogin(email, password);
    setLoading(false);
    if (res.success) {
      router.push("/reports");
    } else {
      setError(res.error || "Invalid email or password.");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-12 overflow-hidden">
      {/* Dynamic Cybernetic / Cosmic Auth Background */}
      <AuthBackground />

      <div className="card relative w-full max-w-sm p-8 bg-card/85 backdrop-blur-2xl border-white/10 shadow-[0_0_70px_-15px_rgba(255,255,255,0.08)]">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to access your saved audit reports.</p>
        
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="relative">
            <input
              className="input pr-10"
              type={show ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3.5 text-muted transition hover:text-fg"
              aria-label="Toggle password"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 shadow-md disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin text-bg" /> Authenticating...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
          <div className="flex items-center gap-3 py-1 text-xs text-subtle">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>
          <button
            type="button"
            onClick={() => alert("Google OAuth requires domain redirect configuration in Supabase Dashboard.")}
            className="btn-ghost w-full py-3 text-xs"
          >
            Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/signup" className="text-fg underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-subtle border-t border-line pt-4">
          <ShieldCheck size={13} className="text-white" />
          <span>Secured via Supabase Cryptographic Auth</span>
        </div>
      </div>
    </div>
  );
}
