'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, Calendar, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ReportsPage() {
  const pastReports = [
    {
      id: 'f4d616e8-699b-4fbd-adae-6941635fd66d',
      title: 'National Scholarship Portal Post Matric Scholarship eligibility and deadline',
      topicType: 'Scholarship',
      date: '31 Oct 2026',
      coverage: 25.9,
      dsi: 74.1,
      gaps: 3,
      conflicts: 14,
      status: 'Completed',
    },
    {
      id: 'pmay-audit-2026',
      title: 'Pradhan Mantri Awas Yojana (PMAY-G) Income Ceiling & Beneficiary Verification',
      topicType: 'Scheme',
      date: '30 Oct 2026',
      coverage: 58.0,
      dsi: 42.0,
      gaps: 2,
      conflicts: 1,
      status: 'Completed',
    },
    {
      id: 'josaa-counselling-2026',
      title: 'JoSAA IIT JEE Advanced Counselling Seat Acceptance Fee and Medical Certificate Format',
      topicType: 'Admission',
      date: '28 Oct 2026',
      coverage: 72.5,
      dsi: 27.5,
      gaps: 1,
      conflicts: 0,
      status: 'Completed',
    },
    {
      id: 'ugc-ishan-uday-2026',
      title: 'UGC Ishan Uday Special Scholarship for North Eastern Region Rules & Renewal Conditions',
      topicType: 'Scholarship',
      date: '25 Oct 2026',
      coverage: 45.0,
      dsi: 55.0,
      gaps: 3,
      conflicts: 2,
      status: 'Completed',
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#2C2C30] gap-4">
        <div>
          <span className="text-[11px] font-mono-code font-semibold text-[#6B6B76] uppercase tracking-wider">
            ARCHIVE & AUDIT REPOSITORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Historical Policy & Scheme Audits
          </h1>
          <p className="text-xs text-[#9A9AA2] mt-1 max-w-xl">
            Immutable record of all analyzed public notices, government circulars, and scholarship guidelines stored in Supabase PostgreSQL.
          </p>
        </div>

        <Link
          href="/"
          className="h-9 px-4 rounded-xl bg-white hover:bg-[#E4E4E7] text-[#0F0F10] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <span>Run New Audit</span>
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </Link>
      </div>

      {/* Reports List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pastReports.map((report) => (
          <div
            key={report.id}
            className="p-5 rounded-xl bg-[#18181A] hover:bg-[#1F1F22] border border-[#2C2C30] hover:border-[#3E3E44] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#9A9AA2] mb-2">
                <span className="font-mono-code px-2 py-0.5 rounded bg-[#1F1F22] border border-[#2C2C30] text-[11px] uppercase">
                  {report.topicType}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#6B6B76]">
                  <Calendar className="w-3 h-3" strokeWidth={1.5} />
                  {report.date}
                </span>
              </div>

              <h3 className="text-base font-semibold text-[#F4F4F5] group-hover:text-white transition-colors leading-snug mb-3">
                {report.title}
              </h3>

              {/* Metric Badges */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#232326] text-center my-3">
                <div>
                  <div className="text-[10px] text-[#6B6B76] uppercase">Coverage</div>
                  <div className="text-sm font-bold text-white font-mono-code">{report.coverage}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6B6B76] uppercase">Dark Spot Index</div>
                  <div className="text-sm font-bold text-white font-mono-code">{report.dsi}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#6B6B76] uppercase">Conflicts</div>
                  <div className="text-sm font-bold text-white font-mono-code">{report.conflicts}</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-[#6B6B76] font-mono-code">ID: {report.id.slice(0, 12)}...</span>
              <Link
                href={`/?query=${encodeURIComponent(report.title)}`}
                className="text-xs font-semibold text-white flex items-center gap-1 hover:underline"
              >
                <span>View Full Atlas</span>
                <ExternalLink className="w-3 h-3" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
