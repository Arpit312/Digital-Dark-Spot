'use client';

import React, { useState } from 'react';
import { ChecklistItem } from '../lib/types';
import { CheckSquare, Square, ExternalLink, Download, CheckCircle2 } from 'lucide-react';

interface VerifyChecklistProps {
  items: ChecklistItem[];
  topicTitle: string;
}

export const VerifyChecklist: React.FC<VerifyChecklistProps> = ({ items, topicTitle }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(items);

  const toggleItem = (idx: number) => {
    setChecklist((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, done: !it.done } : it))
    );
  };

  const completedCount = checklist.filter((i) => i.done).length;

  const exportMarkdown = () => {
    let md = `# DarkSpot Atlas - Verify-Next Action Checklist\n`;
    md += `**Topic:** ${topicTitle}\n`;
    md += `**Export Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## Prioritized Action Steps\n`;
    checklist.forEach((item, idx) => {
      const mark = item.done ? '[x]' : '[ ]';
      md += `${idx + 1}. ${mark} **[${item.priority}]** ${item.action}\n`;
      if (item.link) md += `   - Official Link: ${item.link}\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DarkSpot_Atlas_Checklist_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-5 sm:p-6 shadow-md">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#2C2C30] gap-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F4F4F5] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={1.5} />
            <span>Verify-Next Action Planner (F11)</span>
          </h3>
          <p className="text-xs text-[#9A9AA2] mt-0.5">
            Prioritized checklist ranked by Impact × Uncertainty × Urgency using MMR diversity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#9A9AA2] font-mono-code">
            {completedCount} / {checklist.length} Verified
          </span>
          <button
            onClick={exportMarkdown}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded bg-[#1F1F22] hover:bg-[#2C2C30] border border-[#2C2C30] text-xs text-[#F4F4F5] transition-colors"
          >
            <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Export (.md)</span>
          </button>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {checklist.map((item, idx) => {
          const isHigh = item.priority === 'High';
          const isMed = item.priority === 'Medium';

          return (
            <div
              key={idx}
              onClick={() => toggleItem(idx)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-3 select-none ${
                item.done
                  ? 'bg-[#141416] border-[#232326] opacity-60'
                  : 'bg-[#1F1F22] hover:bg-[#26262A] border-[#2C2C30]'
              }`}
            >
              {/* Checkbox Icon */}
              <button
                type="button"
                className="mt-0.5 text-[#9A9AA2] hover:text-white transition-colors"
              >
                {item.done ? (
                  <CheckSquare className="w-4 h-4 text-white" strokeWidth={1.5} />
                ) : (
                  <Square className="w-4 h-4 text-[#6B6B76]" strokeWidth={1.5} />
                )}
              </button>

              {/* Action Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {/* Priority Badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider font-mono-code ${
                      isHigh
                        ? 'bg-white text-[#0F0F10]'
                        : isMed
                        ? 'bg-[#2C2C30] text-[#F4F4F5]'
                        : 'bg-[#18181A] border border-[#2C2C30] text-[#9A9AA2]'
                    }`}
                  >
                    {item.priority} Priority
                  </span>

                  {item.finding_attribute && (
                    <span className="text-[11px] text-[#6B6B76] font-mono-code">
                      #{item.finding_attribute}
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-relaxed ${
                    item.done ? 'line-through text-[#6B6B76]' : 'text-[#F4F4F5]'
                  }`}
                >
                  {item.action}
                </p>

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-[#9A9AA2] hover:text-white mt-1.5 transition-colors"
                  >
                    <span>Check Official Portal</span>
                    <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
