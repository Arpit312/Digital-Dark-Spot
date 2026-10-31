'use client';

import React from 'react';
import { CircleDashed, ArrowLeftRight, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const AnimatedTicker: React.FC = () => {
  const auditItems = [
    {
      topic: 'National Scholarship Portal',
      tag: 'Potential Gap',
      desc: 'Renewal policy & grade ceiling missing across guidelines',
      icon: CircleDashed,
    },
    {
      topic: 'Pradhan Mantri Awas Yojana',
      tag: 'Conflict',
      desc: 'State circular reports ₹1.5L ceiling vs Central ₹2.0L',
      icon: ArrowLeftRight,
    },
    {
      topic: 'JoSAA / JEE Advanced',
      tag: 'Outdated Notice',
      desc: 'Seat acceptance fee refers to 2024–25 expired cycle',
      icon: Clock,
    },
    {
      topic: 'UGC Ishan Uday Scholarship',
      tag: 'Verified Fact',
      desc: '₹5,400 monthly stipend confirmed with Gazette order',
      icon: ShieldCheck,
    },
    {
      topic: 'Ayushman Bharat PM-JAY',
      tag: 'Potential Gap',
      desc: 'Empanelled private hospital dispute clause missing',
      icon: CircleDashed,
    },
  ];

  return (
    <div className="w-full border-y border-[#2C2C30] bg-[#141416] py-2.5 overflow-hidden select-none">
      <div className="flex items-center">
        
        {/* Static Prefix Badge */}
        <div className="flex-shrink-0 px-4 flex items-center gap-2 border-r border-[#2C2C30] text-xs font-semibold text-[#F4F4F5] z-10 bg-[#141416]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-tight uppercase text-[11px] text-[#9A9AA2]">Live Dark Spots</span>
        </div>

        {/* Infinite Scrolling Ticker Track */}
        <div className="overflow-hidden flex-1 relative">
          <div className="animate-marquee flex gap-6 items-center whitespace-nowrap">
            {[...auditItems, ...auditItems].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-[#18181A] border border-[#2C2C30] text-xs text-[#F4F4F5] hover:border-[#3E3E44] transition-colors"
              >
                <item.icon className="w-3.5 h-3.5 text-[#9A9AA2]" strokeWidth={1.5} />
                <span className="font-medium text-[#F4F4F5]">{item.topic}</span>
                <span className="text-[#6B6B76]">•</span>
                <span className="text-[11px] text-[#9A9AA2]">{item.desc}</span>
                <span className="text-[10px] uppercase font-mono-code px-1.5 py-0.5 rounded bg-[#1F1F22] border border-[#2C2C30] text-[#E4E4E7]">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
