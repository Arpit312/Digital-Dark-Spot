"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, FileText, ArrowRight } from "lucide-react";

interface PaletteItem {
  id: string;
  label: string;
  section: "REPORTS" | "ACTIONS";
  href: string;
}

const DEFAULT_ITEMS: PaletteItem[] = [
  { id: "r-scholarship", label: "Scholarship checklist", section: "REPORTS", href: "/report/demo" },
  { id: "r-admission", label: "Admission notice audit", section: "REPORTS", href: "/campus" },
  { id: "r-scheme", label: "Scheme eligibility check", section: "REPORTS", href: "/reports" },
  { id: "a-new", label: "New analysis", section: "ACTIONS", href: "/analyze" },
  { id: "a-support", label: "Customer support & resolver", section: "ACTIONS", href: "/support" },
  { id: "a-profile", label: "User profile & settings", section: "ACTIONS", href: "/profile" },
  { id: "a-campus", label: "Campus notice auditor", section: "ACTIONS", href: "/campus" }
];

export default function CommandPalette({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter items
  const filtered = DEFAULT_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(q.toLowerCase())
  );

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [q]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          router.push(filtered[selectedIndex].href);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, filtered, selectedIndex, router]);

  if (!open) return null;

  const reportItems = filtered.filter((i) => i.section === "REPORTS");
  const actionItems = filtered.filter((i) => i.section === "ACTIONS");

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center bg-black/80 p-4 pt-[14vh] backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* S1 Command Palette Container */}
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-3 text-fg shadow-[0_0_80px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar (matching S1) */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3">
          <Search size={16} strokeWidth={1.5} className="text-muted shrink-0" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reports, sources..."
            className="w-full bg-transparent text-sm text-white placeholder:text-muted outline-none"
          />
        </div>

        {/* Results List */}
        <div className="mt-3 max-h-80 overflow-y-auto px-1 py-1 space-y-4">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted">
              No reports or actions found matching &quot;{q}&quot;
            </div>
          ) : (
            <>
              {/* REPORTS Section */}
              {reportItems.length > 0 && (
                <div>
                  <div className="px-3 pb-1.5 text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
                    REPORTS
                  </div>
                  <div className="space-y-1">
                    {reportItems.map((item) => {
                      const globalIndex = filtered.indexOf(item);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            router.push(item.href);
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition flex items-center justify-between ${
                            isSelected
                              ? "bg-white/10 text-white font-medium"
                              : "text-muted hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <FileText size={14} className="text-muted" />
                            {item.label}
                          </span>
                          {isSelected && <ArrowRight size={13} className="text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTIONS Section */}
              {actionItems.length > 0 && (
                <div>
                  <div className="px-3 pb-1.5 text-[10px] font-mono font-medium uppercase tracking-wider text-muted">
                    ACTIONS
                  </div>
                  <div className="space-y-1">
                    {actionItems.map((item) => {
                      const globalIndex = filtered.indexOf(item);
                      const isSelected = globalIndex === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            router.push(item.href);
                            onClose();
                          }}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={`w-full rounded-xl px-3.5 py-2.5 text-left text-sm transition flex items-center justify-between ${
                            isSelected
                              ? "bg-white/10 text-white font-medium"
                              : "text-muted hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isSelected && <ArrowRight size={13} className="text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer (matching S1: "up/down enter esc") */}
        <div className="mt-3 border-t border-white/5 pt-2.5 px-3 flex items-center justify-between text-[11px] font-mono text-muted">
          <span>up/down enter esc</span>
          <span>DarkSpot Atlas</span>
        </div>
      </div>
    </div>
  );
}
