import React from 'react';
import Link from 'next/link';
import { L3Logo } from '../../components/L3Logo';
import { 
  ShieldCheck, 
  Search, 
  Bot, 
  FileText, 
  GitCompare, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight,
  Layers
} from 'lucide-react';

export default function AboutPage() {
  const comparison = [
    { tool: 'Search Engines (Google, Bing)', limitation: 'Links dete hain, par ye nahi batate ki kya missing ya contradictory hai. Purane aur naye pages same rank par ho sakte hain.', fix: 'Multiple sources ko ek saath analyze karke gaps, conflicts aur staleness explicitly dikhata hai.' },
    { tool: 'AI Chatbots (ChatGPT-style)', limitation: 'Fluent jawab dete hain par hallucinate kar sakte hain; numbers/dates ke comparison mein kamzor hote hain.', fix: 'Har finding ke saath verbatim source quote; numbers/dates ka 100% deterministic code-based comparison; Abstain mode.' },
    { tool: 'Document Summarizers', limitation: 'Jo available hai use chhota karte hain, jo missing hai wo nahi batate.', fix: 'Expected-Information Checklist se compare karke missing attributes (Dark Spots) nikalta hai.' },
    { tool: 'Government Portals', limitation: 'Siloed data, conflicting notifications across departments, citizen ko pata nahi kaunsa page latest hai.', fix: 'Authoritative Source Registry + Cross-document consistency auditor.' },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181A] border border-[#2C2C30] text-xs text-[#9A9AA2]">
          <L3Logo size={18} showText={false} />
          <span>About the Platform & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
          Jahan jaankari mein andhera hai, <br />
          <span className="text-[#9A9AA2] font-normal">wahan roshni.</span>
        </h1>
        <p className="text-sm text-[#9A9AA2] leading-relaxed">
          DarkSpot Atlas is an autonomous multi-agent AI system built to solve the &ldquo;Digital Dark Spot&rdquo; crisis: the reality that people make high-stakes life decisions on fragmented, contradictory, and outdated public information.
        </p>
      </div>

      {/* The Story / Problem Context */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#18181A] border border-[#2C2C30] space-y-4 shadow-xl">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <span>The Digital Dark Spot Problem</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#9A9AA2] leading-relaxed">
          When a student applies for a scholarship or a farmer claims a welfare grant, they must inspect 5–10 websites, gazettes, PDFs, and circulars. 
          Eligibility is on one page, document lists are on another, and deadlines are on a third. Outdated coaching blogs rank high on Google with last year&apos;s expired deadlines. One source demands an <em>Income Certificate</em>, while another mentions an <em>Affidavit</em>.
        </p>
        <div className="p-4 rounded-xl bg-[#0F0F10] border border-[#2C2C30] text-xs text-[#E4E4E7] font-mono-code leading-relaxed">
          &ldquo;Baaki tools info lane par kaam karte hain. DarkSpot Atlas info ki kami, takraav aur purani cheezein pakadne par kaam karta hai.&rdquo;
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-white">
          Why Existing Technology Fails & How DarkSpot Atlas Fixes It
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comparison.map((c, i) => (
            <div key={i} className="p-5 rounded-xl bg-[#18181A] border border-[#2C2C30] space-y-3">
              <h3 className="text-sm font-semibold text-white">{c.tool}</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-[#6B6B76]">
                  <span className="font-semibold text-rose-400/90">Limitation: </span>
                  {c.limitation}
                </div>
                <div className="text-[#E4E4E7] pt-1">
                  <span className="font-semibold text-white">Atlas Fix: </span>
                  {c.fix}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#18181A] border border-[#2C2C30] space-y-6">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-white" strokeWidth={1.5} />
          <span>Core Engineering Principles</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-[#141416] border border-[#232326] space-y-2">
            <h4 className="font-semibold text-white">1. Verbatim Evidence Gate</h4>
            <p className="text-[#9A9AA2] leading-relaxed">
              Every single finding MUST be proven by verbatim source quotes verified with Levenshtein edit distance (similarity &ge; 0.90). No quote = Blocked.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141416] border border-[#232326] space-y-2">
            <h4 className="font-semibold text-white">2. Deterministic Mathematics</h4>
            <p className="text-[#9A9AA2] leading-relaxed">
              Dates, scholarship amounts (₹), deadlines, and document sets are audited using exact mathematical code, never LLM hallucination.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#141416] border border-[#232326] space-y-2">
            <h4 className="font-semibold text-white">3. Abstain-First Design</h4>
            <p className="text-[#9A9AA2] leading-relaxed">
              When information is absent, the system never fabricates. It transparently declares: <em>&ldquo;Reviewed sources mein nahi mila.&rdquo;</em>
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="h-10 px-6 rounded-full bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-xs font-semibold inline-flex items-center gap-2 transition-all shadow-md"
        >
          <span>Try an Audit in the Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      </div>

    </div>
  );
}
