import React from 'react';
import Link from 'next/link';
import { L3Logo } from './L3Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#2C2C30] bg-[#0F0F10] py-10 px-4 sm:px-6 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Brand & Tagline */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <L3Logo size={24} />
          <p className="text-xs text-[#9A9AA2] max-w-sm text-center md:text-left">
            Jahan jaankari mein andhera hai, wahan roshni. Multi-Agent AI engine auditing information gaps, conflicts, and staleness with verified quotes.
          </p>
        </div>

        {/* Center: System Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18181A] border border-[#2C2C30] text-xs text-[#9A9AA2]">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Core AI & Supabase Operational</span>
        </div>

        {/* Right: Quick Links */}
        <div className="flex items-center gap-6 text-xs text-[#9A9AA2]">
          <Link href="/about" className="hover:text-white transition-colors">
            Architecture
          </Link>
          <Link href="/accuracy" className="hover:text-white transition-colors">
            Accuracy & ECE
          </Link>
          <Link href="/watchtower" className="hover:text-white transition-colors">
            Watchtower
          </Link>
          <a
            href="https://github.com/Arpit312/Digital-Dark-Spot"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            GitHub
          </a>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#1F1F22] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6B76] gap-2">
        <span>© 2026 DarkSpot Atlas. Shinchan Online Hackathon.</span>
        <span>Graphite Theme · Lucide 1.5 · Zero Hallucination Design</span>
      </div>
    </footer>
  );
};
