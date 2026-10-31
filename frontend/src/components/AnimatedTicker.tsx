'use client';

import React from 'react';
import { CircleDashed, ArrowLeftRight, Clock, ShieldCheck, Globe, Radio } from 'lucide-react';

export const AnimatedTicker: React.FC = () => {
  const verifiedPortals = [
    { name: 'scholarships.gov.in', tier: 'Tier 1 Official', trust: '95%', status: 'Live Audited' },
    { name: 'nta.ac.in (Exams Portal)', tier: 'Tier 1 Official', trust: '98%', status: 'Active Scan' },
    { name: 'pmayg.nic.in (Central Housing)', tier: 'Tier 1 Gazette', trust: '92%', status: 'Verified' },
    { name: 'ugc.gov.in (Higher Education)', tier: 'Tier 1 Circular', trust: '96%', status: 'Live Audited' },
    { name: 'josaa.nic.in (Admissions)', tier: 'Tier 1 Portal', trust: '94%', status: 'Active Scan' },
    { name: 'mohfw.gov.in (Ayushman Bharat)', tier: 'Tier 1 Ministry', trust: '91%', status: 'Verified' },
  ];

  const liveFindings = [
    {
      topic: 'National Scholarship Portal',
      type: 'Potential Gap',
      desc: 'Renewal conditions & grade ceiling missing across reviewed circulars',
      icon: CircleDashed,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    },
    {
      topic: 'Pradhan Mantri Awas Yojana',
      type: 'Conflict',
      desc: 'State circular requires ₹1.5L ceiling vs Central Gazette ₹2.0L',
      icon: ArrowLeftRight,
      color: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
    },
    {
      topic: 'JoSAA Counselling Notice',
      type: 'Outdated Circular',
      desc: 'Seat acceptance refund rule points to expired 2023–24 deadline',
      icon: Clock,
      color: 'text-amber-300 border-amber-400/20 bg-amber-400/5',
    },
    {
      topic: 'UGC Ishan Uday Stipend',
      type: 'Sourced Fact',
      desc: '₹5,400 monthly allowance confirmed verbatim with Gazette order',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5',
    },
    {
      topic: 'Ayushman PM-JAY Clause 4',
      type: 'Potential Gap',
      desc: 'Private empanelled dispute resolution tribunal timeline not found',
      icon: CircleDashed,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5',
    },
  ];

  return (
    <div className="w-full border-y border-[#27272A] bg-[#0E0E10]/90 backdrop-blur-md overflow-hidden select-none py-2 space-y-2">
      {/* Track 1: Government Portals & Real-Time Trust (Gliding Left) */}
      <div className="flex items-center">
        <div className="flex-shrink-0 px-3.5 py-0.5 flex items-center gap-2 border-r border-[#27272A] text-xs font-semibold text-[#F4F4F5] z-10 bg-[#0E0E10]">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="tracking-wider uppercase text-[10px] text-[#A1A1AA] font-mono-code">Audited Portals</span>
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee-left flex gap-4 items-center whitespace-nowrap">
            {[...verifiedPortals, ...verifiedPortals].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18181B]/80 border border-[#27272A] text-xs hover:border-[#3F3F46] transition-all hover:bg-[#222226]"
              >
                <Globe className="w-3 h-3 text-[#A1A1AA]" strokeWidth={1.5} />
                <span className="font-mono-code text-[11px] text-[#F4F4F5]">{item.name}</span>
                <span className="text-[#3F3F46]">•</span>
                <span className="text-[10px] text-[#A1A1AA]">{item.tier}</span>
                <span className="text-[10px] font-mono-code px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.trust} Trust
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Track 2: Real-Time Verified Findings & Dark Spots (Gliding Right) */}
      <div className="flex items-center">
        <div className="flex-shrink-0 px-3.5 py-0.5 flex items-center gap-2 border-r border-[#27272A] text-xs font-semibold text-[#F4F4F5] z-10 bg-[#0E0E10]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span className="tracking-wider uppercase text-[10px] text-[#A1A1AA] font-mono-code">Live Dark Spots</span>
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee-right flex gap-4 items-center whitespace-nowrap">
            {[...liveFindings, ...liveFindings].map((item, idx) => (
              <div
                key={idx}
                className={`inline-flex items-center gap-2.5 px-3 py-1 rounded-full border text-xs transition-all hover:scale-[1.02] ${item.color}`}
              >
                <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="font-medium text-[#F4F4F5]">{item.topic}</span>
                <span className="opacity-40">•</span>
                <span className="text-[11px] text-[#A1A1AA]">{item.desc}</span>
                <span className="text-[10px] font-mono-code uppercase px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[#F4F4F5]">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
