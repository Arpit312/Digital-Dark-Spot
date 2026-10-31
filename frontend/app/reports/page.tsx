"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, FileText } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { API } from "@/lib/api";

type ReportSummary = {
  id: string;
  title: string;
  date: string;
  coverage: number;
  verifyCount: number;
};

const defaultReports: ReportSummary[] = [
  { id: "demo", title: "Scholarship verification checklist", date: "31 Oct 2026", coverage: 62, verifyCount: 4 },
  { id: "r2", title: "Admission notice audit", date: "29 Oct 2026", coverage: 48, verifyCount: 6 },
  { id: "r3", title: "Scheme eligibility check", date: "27 Oct 2026", coverage: 71, verifyCount: 3 }
];

export default function Reports() {
  const [q, setQ] = useState("");
  const [reports, setReports] = useState<ReportSummary[]>(defaultReports);

  useEffect(() => {
    async function fetchBackendReports() {
      try {
        const res = await fetch(`${API}/analyses`);
        if (res.ok) {
          const list = await res.json();
          if (Array.isArray(list) && list.length > 0) {
            const formatted: ReportSummary[] = list.map((item: any) => ({
              id: item.id,
              title: item.question || "Analysis Audit",
              date: "Today",
              coverage: Math.round(item.coverage > 1 ? item.coverage : (item.coverage || 0.6) * 100),
              verifyCount: item.checklist?.length || item.findings?.length || 3
            }));
            // Merge unique by id
            setReports((prev) => {
              const ids = new Set(formatted.map((f) => f.id));
              return [...formatted, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        }
      } catch (err) {
        // Backend offline or no extra reports
      }
    }
    fetchBackendReports();
  }, []);

  const list = reports.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader
        eyebrow="REPORTS"
        title="Your reports"
        sub="Every analysis is saved with its quote evidence and action checklist."
      />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="relative mb-6 max-w-sm">
          <Search size={15} className="absolute left-3 top-3.5 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reports"
            className="input pl-9"
          />
        </div>
        {list.length === 0 ? (
          <div className="card flex flex-col items-center p-14 text-center">
            <FileText size={24} strokeWidth={1.5} className="text-subtle" />
            <p className="mt-4 text-sm text-muted">No reports found matching your search.</p>
            <Link href="/analyze" className="btn-primary mt-5">
              New analysis
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {list.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.06}>
                <Link
                  href={`/report/${r.id}`}
                  className="card group block p-6 transition hover:border-white/30"
                >
                  <div className="text-xs text-subtle">{r.date}</div>
                  <div className="mt-3 text-lg font-medium line-clamp-2">{r.title}</div>
                  <div className="mt-6 h-1 overflow-hidden rounded bg-line">
                    <div className="h-1 bg-fg" style={{ width: `${r.coverage}%` }} />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>Coverage {r.coverage}%</span>
                    <span>{r.verifyCount} to verify</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
