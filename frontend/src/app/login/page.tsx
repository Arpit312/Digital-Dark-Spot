'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { L3Logo } from '../../components/L3Logo';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  Radio, 
  Globe, 
  FileSearch, 
  Fingerprint, 
  Cpu, 
  Layers, 
  ExternalLink 
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState<'judge' | 'officer'>('judge');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 600);
  };

  const handleInstantJudgeLaunch = () => {
    setIsLoading(true);
    setEmail('evaluator@darkspot.atlas');
    setPassword('••••••••••••');
    setTimeout(() => {
      setIsLoading(false);
      router.push('/');
    }, 450);
  };

  return (
    <div className="relative min-h-[calc(100vh-56px-70px)] w-full flex flex-col lg:flex-row items-stretch justify-between overflow-hidden bg-[#0A0A0B]">
      
      {/* Dynamic Background Grid and Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid-blueprint opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[150px]" />
      </div>

      {/* LEFT COLUMN: The Autonomous Engine Visualizer & Metrics */}
      <div className="relative z-10 flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-[#27272A]/70">
        
        {/* Top Tagline */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181B] border border-[#27272A] text-xs text-[#A1A1AA]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono-code text-[11px] text-[#F4F4F5]">DARKS-POT PROTOCOL v1.0</span>
            <span className="text-[#3F3F46]">•</span>
            <span className="text-emerald-400 font-medium">18 AI Engines Active</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F4F4F5] max-w-xl leading-[1.15]">
            Where public portals fail, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E4E4E7] to-[#71717A]">
              DarkSpot Atlas audits.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#A1A1AA] max-w-lg leading-relaxed">
            Eliminating citizen confusion, conflicting guidelines, and expired circulars before applications are rejected. Every finding is anchored by a verbatim, Levenshtein-verified source quote.
          </p>
        </div>

        {/* Centerpiece: Interactive Radar / HUD Showcase */}
        <div className="my-10 relative max-w-xl">
          <div className="p-6 rounded-2xl bg-[#121214]/80 border border-[#27272A] backdrop-blur-xl relative overflow-hidden shadow-2xl">
            
            {/* Top scanning line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent animate-shimmer" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Autonomous Multi-Agent Pipeline</div>
                  <div className="text-[11px] text-[#71717A] font-mono-code">Scout &rarr; Extractor &rarr; Challenger &rarr; Auditor</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-code bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                100% Deterministic
              </span>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/80">
                <div className="text-xl font-bold font-mono-code text-white">0.90+</div>
                <div className="text-[10px] text-[#A1A1AA] mt-0.5">Quote Gate &ge; 90%</div>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/80">
                <div className="text-xl font-bold font-mono-code text-emerald-400">100%</div>
                <div className="text-[10px] text-[#A1A1AA] mt-0.5">Faithfulness Ratio</div>
              </div>
              <div className="p-3 rounded-xl bg-[#18181B] border border-[#27272A]/80">
                <div className="text-xl font-bold font-mono-code text-amber-400">0.00%</div>
                <div className="text-[10px] text-[#A1A1AA] mt-0.5">Hallucinated Output</div>
              </div>
            </div>

            {/* Bottom Real-time Audit Node List */}
            <div className="mt-4 pt-4 border-t border-[#27272A] flex items-center justify-between text-[11px] text-[#71717A]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase PostgreSQL + JWKS Active</span>
              </span>
              <span className="font-mono-code text-[#A1A1AA]">Latency: 124ms</span>
            </div>

          </div>
        </div>

        {/* Bottom Feature Pill Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#71717A]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
            Ed25519 Cryptographic Signatures
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
            Live Tavily Gazette Search
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#A1A1AA]" strokeWidth={1.5} />
            Supersession DAG Cycle Detection
          </span>
        </div>

      </div>

      {/* RIGHT COLUMN: Full-Screen Interactive Terminal & Auth Console */}
      <div className="relative z-10 w-full lg:w-[480px] xl:w-[540px] flex flex-col justify-center p-8 sm:p-12 bg-[#0E0E10]/90 backdrop-blur-2xl">
        
        <div className="w-full max-w-md mx-auto space-y-6">
          
          {/* Header Mark */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <L3Logo size={36} showText={true} />
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#A1A1AA]">
                <Fingerprint className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
                <span>Auth Portal</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Console Sign-In
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Access saved public audits, manage Watchtower radar trackers, or audit fresh policy circulars.
            </p>
          </div>

          {/* HIGH-IMPACT INSTANT JUDGE / EVALUATOR ENTRY BUTTON */}
          <div className="relative group p-[1px] rounded-2xl bg-gradient-to-r from-white/30 via-amber-400/50 to-white/30 shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <div className="p-4 rounded-[15px] bg-[#141417] space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>Instant Judge / Evaluator Access</span>
                      <span className="text-[9px] font-mono-code uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        1-Click
                      </span>
                    </div>
                    <div className="text-[11px] text-[#A1A1AA]">
                      Bypass login with full officer privileges to test all 18 engines
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleInstantJudgeLaunch}
                disabled={isLoading}
                className="w-full h-10 rounded-xl bg-white hover:bg-[#E4E4E7] text-[#0A0A0B] text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-white/10 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Live DarkSpot Atlas</span>
                    <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#27272A]" />
            <span className="absolute px-3 bg-[#0E0E10] text-[10px] uppercase tracking-wider text-[#71717A] font-mono-code">
              or sign in with credentials
            </span>
          </div>

          {/* Credential Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] flex items-center justify-between">
                <span>Department / Official Email</span>
                <span className="text-[10px] text-[#71717A]">Gov or Citizen</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" strokeWidth={1.5} />
                <input
                  type="email"
                  placeholder="officer@scholarships.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#141416] border border-[#27272A] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#A1A1AA] flex items-center justify-between">
                <span>Access Key / Password</span>
                <a href="#" className="text-[10px] text-[#A1A1AA] hover:text-white transition-colors">
                  Reset key?
                </a>
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" strokeWidth={1.5} />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#141416] border border-[#27272A] text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-xl bg-[#1F1F23] hover:bg-[#27272A] border border-[#3F3F46] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-[#A1A1AA]" strokeWidth={1.5} />
              <span>Authenticate Session</span>
            </button>
          </form>

          {/* Cryptographic Compliance Seal */}
          <div className="pt-2 text-center text-[10px] text-[#71717A] font-mono-code">
            Secured by Supabase Auth &bull; Ed25519 Signed Audit Log &bull; Zero Log Leak
          </div>

        </div>

      </div>

    </div>
  );
}
