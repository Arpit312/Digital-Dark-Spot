'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { L3Logo } from './L3Logo';
import { Search } from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const pathname = usePathname();

  const navLinks = [
    { label: 'Analyze', href: '/' },
    { label: 'Reports', href: '/reports' },
    { label: 'Watchtower', href: '/watchtower' },
    { label: 'Accuracy', href: '/accuracy' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-14 bg-[#0F0F10]/85 backdrop-blur-md border-b border-[#2C2C30]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: L3 Logo + Wordmark */}
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <L3Logo size={26} />
          </Link>

          {/* N1 Navigation Links with Underline */}
          <nav className="hidden md:flex items-center gap-1 h-14">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative h-full flex items-center px-3.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#F4F4F5]'
                      : 'text-[#9A9AA2] hover:text-[#F4F4F5]'
                  }`}
                >
                  {link.label}
                  {/* N1 Active Underline Indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-t-sm" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: S1 Search Trigger + Sign In */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 h-8 px-3 rounded-md bg-[#18181A] hover:bg-[#1F1F22] border border-[#2C2C30] text-xs text-[#9A9AA2] transition-colors"
          >
            <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] bg-[#0F0F10] border border-[#2C2C30] rounded text-[#6B6B76]">
              Ctrl K
            </kbd>
          </button>

          <Link
            href="/login"
            className="h-8 px-3.5 rounded-full bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-xs font-medium inline-flex items-center justify-center transition-all shadow-sm"
          >
            Sign in
          </Link>
        </div>

      </div>
    </header>
  );
};
