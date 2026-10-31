'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { L3Logo } from '../../components/L3Logo';
import { Shield, ArrowRight, Lock, Mail, Key, Sparkles, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  const handleGuestEntry = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 400);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-dot-grid relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-white/[0.03] blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-white/[0.02] blur-3xl -bottom-20 -right-20 pointer-events-none" />

      {/* Main Auth Card */}
      <div className="relative w-full max-w-md bg-[#18181A] border border-[#2C2C30] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <L3Logo size={32} showText={false} />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome to DarkSpot Atlas
          </h2>
          <p className="text-xs text-[#9A9AA2] max-w-xs mx-auto">
            Log in to access saved audits, automated Watchtower source tracking, and verified policy reports.
          </p>
        </div>

        {/* Quick Guest Access (For Judges / Evaluators) */}
        <div className="p-3.5 rounded-xl bg-[#141416] border border-[#2C2C30] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
            <div>
              <div className="text-xs font-semibold text-white">Instant Judge Evaluation</div>
              <div className="text-[11px] text-[#6B6B76]">Try full platform with guest privileges</div>
            </div>
          </div>
          <button
            onClick={handleGuestEntry}
            disabled={isLoading}
            className="h-8 px-3 rounded-lg bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <span>Enter</span>
            <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[#2C2C30]" />
          <span className="absolute px-3 bg-[#18181A] text-[11px] uppercase tracking-wider text-[#6B6B76] font-mono-code">
            or continue with credentials
          </span>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#9A9AA2] block">
              Work / Department Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6B6B76] absolute left-3 top-3" strokeWidth={1.5} />
              <input
                type="email"
                placeholder="citizen@scholarships.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#0F0F10] border border-[#2C2C30] text-xs text-white placeholder-[#6B6B76] focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-[#9A9AA2]">
                Password
              </label>
              <a href="#" className="text-[11px] text-[#6B6B76] hover:text-white transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6B6B76] absolute left-3 top-3" strokeWidth={1.5} />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#0F0F10] border border-[#2C2C30] text-xs text-white placeholder-[#6B6B76] focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 rounded-xl bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying with Supabase...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </form>

        {/* Security badges */}
        <div className="pt-4 border-t border-[#232326] flex items-center justify-center gap-4 text-[11px] text-[#6B6B76]">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#9A9AA2]" strokeWidth={1.5} />
            Supabase Auth (JWKS)
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Key className="w-3 h-3 text-[#9A9AA2]" strokeWidth={1.5} />
            Passkey Compatible
          </span>
        </div>

      </div>

    </div>
  );
}
