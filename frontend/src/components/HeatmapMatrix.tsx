import React from 'react';
import { HeatmapRow } from '../lib/types';
import { Check, X, ShieldAlert } from 'lucide-react';

interface HeatmapMatrixProps {
  heatmap: HeatmapRow[];
  onSelectAttribute?: (attr: string) => void;
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  heatmap,
  onSelectAttribute,
}) => {
  if (!heatmap || heatmap.length === 0) return null;

  const sourcesList = heatmap[0]?.sources || [];

  return (
    <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-5 overflow-x-auto shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F4F4F5] flex items-center gap-2">
            <span>Information Coverage Matrix (F12)</span>
          </h3>
          <p className="text-xs text-[#9A9AA2] mt-0.5">
            Cross-document comparison showing which attributes are verified vs missing in each source.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#9A9AA2]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-white" />
            <span>Covered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#0F0F10] border border-dashed border-[#6B6B76]" />
            <span>Dark Spot (Gap)</span>
          </div>
        </div>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="border-b border-[#2C2C30]">
            <th className="py-2.5 px-3 font-semibold text-[#9A9AA2] uppercase tracking-wider text-[11px] w-48">
              Expected Attribute
            </th>
            {sourcesList.map((s, idx) => (
              <th key={idx} className="py-2.5 px-3 font-medium text-[#F4F4F5] text-center max-w-[140px] truncate">
                <div className="truncate text-xs font-mono-code">{s.source_domain || `Source ${idx+1}`}</div>
                <div className="text-[10px] text-[#6B6B76] font-normal">
                  Trust: {(s.trust * 100).toFixed(0)}%
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#2C2C30]">
          {heatmap.map((row, rIdx) => (
            <tr
              key={rIdx}
              onClick={() => onSelectAttribute && onSelectAttribute(row.attribute)}
              className="hover:bg-[#1F1F22] cursor-pointer transition-colors"
            >
              <td className="py-2.5 px-3 font-medium text-[#F4F4F5] capitalize">
                {row.attribute.replace('_', ' ')}
              </td>
              {row.sources.map((cell, cIdx) => (
                <td key={cIdx} className="py-2.5 px-3 text-center">
                  <div className="flex justify-center">
                    {cell.covered ? (
                      <span className="w-6 h-6 rounded flex items-center justify-center bg-white text-[#0F0F10] shadow-sm">
                        <Check className="w-3.5 h-3.5" strokeWidth={2} />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded flex items-center justify-center bg-[#0F0F10] border border-dashed border-[#3E3E44] text-[#6B6B76]">
                        <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
