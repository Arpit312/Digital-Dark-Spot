import React from 'react';
import { Finding } from '../lib/types';
import { FileText, ExternalLink, ShieldCheck, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface EvidenceSheetProps {
  finding: Finding | null;
  onClose?: () => void;
}

export const EvidenceSheet: React.FC<EvidenceSheetProps> = ({ finding }) => {
  if (!finding) {
    return (
      <div className="h-full bg-[#18181A] border border-[#2C2C30] rounded-xl p-6 flex flex-col items-center justify-center text-center">
        <FileText className="w-8 h-8 text-[#6B6B76] mb-3" strokeWidth={1.5} />
        <h3 className="text-sm font-medium text-[#F4F4F5] mb-1">Evidence Inspector</h3>
        <p className="text-xs text-[#9A9AA2] max-w-xs">
          Select any finding on the left to inspect verbatim source quotes, trust ratings, and document locations.
        </p>
      </div>
    );
  }

  const isConflict = finding.type === 'conflict' && finding.evidence.length >= 2;
  const isGap = finding.label === 'not_found_in_reviewed_sources';

  return (
    <div className="bg-[#18181A] border border-[#2C2C30] rounded-xl p-5 sm:p-6 shadow-xl sticky top-20">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2C2C30] mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#F4F4F5]" strokeWidth={1.5} />
          <h3 className="text-sm font-semibold text-[#F4F4F5]">Evidence Audit</h3>
        </div>
        <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#1F1F22] border border-[#2C2C30] text-[#9A9AA2] uppercase">
          {finding.type.replace('_', ' ')}
        </span>
      </div>

      {/* Main Statement */}
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-[#6B6B76] uppercase tracking-wider mb-1">
          Audited Finding
        </h4>
        <p className="text-sm text-[#F4F4F5] leading-relaxed">
          {finding.statement}
        </p>
      </div>

      {/* Evidence Quotes Display */}
      {isGap ? (
        <div className="p-4 rounded-lg bg-[#1F1F22] border border-dashed border-[#3E3E44] mb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-[#9A9AA2] mb-1">
            <Info className="w-3.5 h-3.5 text-[#9A9AA2]" strokeWidth={1.5} />
            <span>Abstain Mode (Zero Hallucination)</span>
          </div>
          <p className="text-xs text-[#9A9AA2] leading-normal font-mono-code">
            Reviewed sources mein is attribute ({finding.attribute}) ke mutabiq koi certified quote ya policy clause nahi mila.
          </p>
        </div>
      ) : isConflict ? (
        <div className="space-y-3 mb-4">
          {/* Source 1 Quote */}
          <div className="p-3.5 rounded-lg bg-[#1F1F22] border border-[#2C2C30]">
            <div className="flex items-center justify-between text-[11px] text-[#9A9AA2] mb-1.5">
              <span className="font-medium text-[#F4F4F5]">Source 1 Quote</span>
              {finding.evidence[0]?.trust !== undefined && (
                <span>Trust: {(finding.evidence[0].trust * 100).toFixed(0)}%</span>
              )}
            </div>
            <p className="text-xs text-[#F4F4F5] font-mono-code leading-relaxed bg-[#0F0F10] p-2.5 rounded border border-[#2C2C30]">
              &ldquo;{finding.evidence[0]?.quote}&rdquo;
            </p>
            {finding.evidence[0]?.source_url && (
              <a
                href={finding.evidence[0].source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9A9AA2] hover:text-white mt-2 transition-colors truncate max-w-full"
              >
                <span className="truncate">{finding.evidence[0].source_url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
              </a>
            )}
          </div>

          {/* Source 2 Quote */}
          <div className="p-3.5 rounded-lg bg-[#1F1F22] border border-[#2C2C30]">
            <div className="flex items-center justify-between text-[11px] text-[#9A9AA2] mb-1.5">
              <span className="font-medium text-[#F4F4F5]">Source 2 Quote</span>
              {finding.evidence[1]?.trust !== undefined && (
                <span>Trust: {(finding.evidence[1].trust * 100).toFixed(0)}%</span>
              )}
            </div>
            <p className="text-xs text-[#F4F4F5] font-mono-code leading-relaxed bg-[#0F0F10] p-2.5 rounded border border-[#2C2C30]">
              &ldquo;{finding.evidence[1]?.quote}&rdquo;
            </p>
            {finding.evidence[1]?.source_url && (
              <a
                href={finding.evidence[1].source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-[#9A9AA2] hover:text-white mt-2 transition-colors truncate max-w-full"
              >
                <span className="truncate">{finding.evidence[1].source_url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
              </a>
            )}
          </div>
        </div>
      ) : (
        /* Single Verbatim Quote (Standard / Outdated) */
        finding.evidence[0]?.quote && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-[#6B6B76] uppercase tracking-wider mb-1.5">
              Verbatim Source Snippet
            </h4>
            <div className="p-3.5 rounded-lg bg-[#0F0F10] border border-[#2C2C30] font-mono-code text-xs text-[#F4F4F5] leading-relaxed">
              &ldquo;{finding.evidence[0].quote}&rdquo;
            </div>

            {/* Provenance Metadata */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[#9A9AA2]">
              {finding.evidence[0].location && (
                <span className="px-2 py-0.5 rounded bg-[#1F1F22] border border-[#2C2C30]">
                  Location: {finding.evidence[0].location}
                </span>
              )}
              {finding.evidence[0].source_trust !== undefined && (
                <span className="px-2 py-0.5 rounded bg-[#1F1F22] border border-[#2C2C30]">
                  Source Trust: {(finding.evidence[0].source_trust * 100).toFixed(0)}%
                </span>
              )}
            </div>

            {finding.evidence[0].source_url && (
              <a
                href={finding.evidence[0].source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#9A9AA2] hover:text-white mt-2.5 transition-colors"
              >
                <span>Visit Source URL</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </a>
            )}
          </div>
        )
      )}

      {/* Resolution Hint if Conflict */}
      {finding.resolution_hint && (
        <div className="p-3 rounded-lg bg-[#1F1F22] border border-[#2C2C30] mb-4 text-xs text-[#E4E4E7]">
          <span className="font-semibold text-white">Resolution Hint: </span>
          {finding.resolution_hint}
        </div>
      )}

      {/* Confidence & Severity Footnote */}
      <div className="pt-3 border-t border-[#2C2C30] flex items-center justify-between text-[11px] text-[#9A9AA2]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
          Confidence: {finding.label} ({(finding.confidence * 100).toFixed(0)}%)
        </span>
        <span>Severity: {(finding.severity * 10).toFixed(1)}/10</span>
      </div>

    </div>
  );
};
