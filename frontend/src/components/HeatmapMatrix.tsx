import React from 'react';
import { HeatmapRow } from '../lib/types';
import { Check, X, ShieldAlert, ShieldCheck, Globe, Layers, AlertTriangle } from 'lucide-react';

interface HeatmapMatrixProps {
  heatmap: HeatmapRow[];
  onSelectAttribute?: (attr: string) => void;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  heatmap,
  onSelectAttribute,
}) => {
  if (!heatmap || heatmap.length === 0) return null;

  return (
    <div className="bg-[#121214]/90 border border-[#27272A] rounded-2xl p-6 shadow-2xl space-y-6 backdrop-blur-xl">
      
      {/* Header with Info and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272A]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white">
              <Layers className="w-4 h-4 text-white" strokeWidth={1.5} />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[#F4F4F5] tracking-tight">
              Attribute Coverage Topology (F12)
            </h3>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Visual topology showing deterministic verification across all ingested public sources — no tabular guesswork.
          </p>
        </div>

        {/* Visual Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono-code text-[11px]">
            <Check className="w-3 h-3" strokeWidth={2} />
            <span>Verified Present</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono-code text-[11px]">
            <X className="w-3 h-3" strokeWidth={1.5} />
            <span>Dark Spot Gap</span>
          </div>
        </div>
      </div>

      {/* Futuristic Card Grid (Replacing Boring Tables) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {heatmap.map((row, rIdx) => {
          const coveredCount = row.sources.filter(s => s.covered).length;
          const totalCount = row.sources.length;
          const coveragePct = totalCount > 0 ? (coveredCount / totalCount) * 100 : 0;
          const isCompleteDarkSpot = coveredCount === 0;

          return (
            <div
              key={rIdx}
              onClick={() => onSelectAttribute && onSelectAttribute(row.attribute)}
              className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isCompleteDarkSpot 
                  ? 'bg-amber-500/[0.03] border-amber-500/30 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]'
                  : 'bg-[#18181B]/80 border-[#27272A] hover:border-[#3F3F46] hover:bg-[#1E1E22]'
              }`}
            >
              {/* Top Row: Attribute Name & Coverage Gauge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    isCompleteDarkSpot ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`} />
                  <span className="text-xs font-bold capitalize text-[#F4F4F5] tracking-wide">
                    {row.attribute.replace('_', ' ')}
                  </span>
                </div>

                <span className={`text-[11px] font-mono-code px-2 py-0.5 rounded-full border ${
                  isCompleteDarkSpot
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : coveragePct === 100
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-white/5 text-[#E4E4E7] border-white/10'
                }`}>
                  {isCompleteDarkSpot ? '0% — Critical Gap' : `${coveragePct.toFixed(0)}% Sourced`}
                </span>
              </div>

              {/* Progress bar visualizer */}
              <div className="w-full h-1.5 bg-[#0A0A0B] rounded-full overflow-hidden mb-3.5 border border-[#27272A]/50">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isCompleteDarkSpot
                      ? 'bg-amber-500/30'
                      : coveragePct === 100
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-emerald-400 to-amber-400'
                  }`}
                  style={{ width: `${Math.max(coveragePct, 6)}%` }}
                />
              </div>

              {/* Source Verification Chips */}
              <div className="space-y-1.5">
                <div className="text-[10px] uppercase font-mono-code text-[#71717A] tracking-wider">
                  Source Ingestion Nodes:
                </div>
                <div className="flex flex-wrap gap-2">
                  {row.sources.map((cell, cIdx) => (
                    <div
                      key={cIdx}
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] border transition-all ${
                        cell.covered
                          ? 'bg-[#141416] border-[#3F3F46] text-[#F4F4F5]'
                          : 'bg-[#0E0E10] border-dashed border-[#27272A] text-[#71717A]'
                      }`}
                    >
                      <Globe className="w-3 h-3 text-[#A1A1AA]" strokeWidth={1.5} />
                      <span className="font-mono-code text-[10px] truncate max-w-[120px]">
                        {cell.source_domain}
                      </span>
                      {cell.covered ? (
                        <Check className="w-3 h-3 text-emerald-400 ml-0.5" strokeWidth={2.5} />
                      ) : (
                        <X className="w-3 h-3 text-amber-500/70 ml-0.5" strokeWidth={2} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Hover Cue */}
              <div className="mt-3 pt-2.5 border-t border-[#27272A]/60 flex items-center justify-between text-[10px] text-[#71717A]">
                <span>Click to filter findings</span>
                <span className="font-mono-code text-[#A1A1AA] group-hover:text-white transition-colors">
                  &rarr; Inspect Evidence
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
