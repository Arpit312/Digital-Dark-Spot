'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, BookOpen, Clock, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery?: (query: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectQuery,
}) => {
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const topics = [
    { title: 'National Scholarship Portal Post-Matric Scholarship', category: 'Topics' },
    { title: 'UGC Ishan Uday Special Scholarship for North Eastern Region', category: 'Topics' },
    { title: 'Pradhan Mantri Awas Yojana (PMAY-Gramin) Eligibility & Benefit', category: 'Topics' },
    { title: 'IIT JEE / JoSAA Counselling Document Requirements & Seat Acceptance', category: 'Topics' },
  ];

  const actions = [
    { title: 'Run New Real-Data Analysis', icon: Sparkles, href: '/' },
    { title: 'View Saved Reports & Historical Audits', icon: BookOpen, href: '/reports' },
    { title: 'Check Watchtower Source Change Radar', icon: Clock, href: '/watchtower' },
    { title: 'Evaluation Suite & Model Accuracy Metrics', icon: ShieldCheck, href: '/accuracy' },
  ];

  const filteredTopics = topics.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-[#18181A] border border-[#2C2C30] rounded-xl shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#2C2C30]">
          <Search className="w-4 h-4 text-[#9A9AA2]" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search reports, sources, topics, or actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#F4F4F5] placeholder-[#6B6B76] focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9A9AA2] hover:text-[#F4F4F5] hover:bg-[#1F1F22]"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-4">
          
          {/* Topics Section */}
          {filteredTopics.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[11px] font-semibold text-[#6B6B76] uppercase tracking-wider">
                Audited Public Topics
              </div>
              <div className="space-y-0.5 mt-1">
                {filteredTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (onSelectQuery) onSelectQuery(topic.title);
                      onClose();
                      router.push('/');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-[#F4F4F5] hover:bg-[#1F1F22] hover:text-white transition-colors group"
                  >
                    <span className="truncate">{topic.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B6B76] group-hover:text-white transition-colors" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="px-2 py-1 text-[11px] font-semibold text-[#6B6B76] uppercase tracking-wider">
              Navigation & Actions
            </div>
            <div className="space-y-0.5 mt-1">
              {actions.map((act, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onClose();
                    router.push(act.href);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-xs text-[#9A9AA2] hover:bg-[#1F1F22] hover:text-[#F4F4F5] transition-colors"
                >
                  <act.icon className="w-4 h-4 text-[#9A9AA2]" strokeWidth={1.5} />
                  <span>{act.title}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0F0F10] border-t border-[#2C2C30] flex items-center justify-between text-[11px] text-[#6B6B76]">
          <span>Use arrows to navigate, Esc to close</span>
          <kbd className="px-1.5 py-0.5 bg-[#18181A] border border-[#2C2C30] rounded">↵ Select</kbd>
        </div>

      </div>
    </div>
  );
};
