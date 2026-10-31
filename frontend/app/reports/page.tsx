"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, FileText, CalendarDays, ClipboardCheck, ArrowUpRight, Plus, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { API, authHeaders } from "@/lib/api";

type ReportSummary = {
  id: string;
  title: string;
  date: string;
  coverage: number;
  verifyCount: number;
};

export default function Reports() {
  const [q, setQ] = useState("");
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBackendReports() {
      try {
        const res = await fetch(`${API}/analyses`, { cache: "no-store", headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Could not load reports.");
        if (!Array.isArray(data)) throw new Error("The reports service returned an invalid response.");
        setReports(data.map((item: any) => ({
          id: item.id,
          title: item.question,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "—",
          coverage: Math.round(item.coverage > 1 ? item.coverage : (item.coverage || 0) * 100),
          verifyCount: item.checklist?.length ?? 0,
        })));
        setError("");
      } catch (err: any) {
        setError(err.message || "Could not load reports.");
      } finally {
        setLoading(false);
      }
    }
    fetchBackendReports();
  }, []);

  const list = reports.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  const averageCoverage = reports.length
    ? Math.round(reports.reduce((total, report) => total + report.coverage, 0) / reports.length)
    : 0;
  const verificationCount = reports.reduce((total, report) => total + report.verifyCount, 0);

  return (
    <div>
      <PageHeader
        eyebrow="REPORTS"
        title="Your reports"
        sub="Every analysis is saved with its quote evidence and action checklist."
      />
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Saved audits", value: reports.length, icon: FileText, detail: "Your analysis history" },
            { label: "Average coverage", value: `${averageCoverage}%`, icon: ShieldCheck, detail: "Across saved reports" },
            { label: "To verify", value: verificationCount, icon: ClipboardCheck, detail: "Open checklist items" }
          ].map(({ label, value, icon: Icon, detail }) => (
            <div key={label} className="card flex items-center gap-4 p-5 transition hover:border-white/20">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <Icon size={18} strokeWidth={1.6} className="text-muted" />
              </span>
              <div className="min-w-0">
                <div className="text-xs text-muted">{label}</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
                <div className="mt-0.5 text-[11px] text-subtle">{detail}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search size={15} className="absolute left-3 top-3.5 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search reports"
              className="input pl-9"
              aria-label="Search reports"
            />
          </div>
          <Link href="/analyze" className="btn-primary shrink-0">
            <Plus size={15} /> New analysis
          </Link>
        </div>

        <div className="mb-4 flex items-center justify-between text-xs text-muted">
          <span>{q ? `${list.length} matching reports` : "Recent reports"}</span>
          <span className="font-mono text-subtle">{reports.length} TOTAL</span>
        </div>
        {loading ? (
          <div className="card p-10 text-center text-sm text-muted">Loading saved reports…</div>
        ) : error ? (
          <div className="card p-10 text-center text-sm text-muted" role="alert">{error}</div>
        ) : list.length === 0 ? (
          <div className="card flex flex-col items-center p-14 text-center">
            <FileText size={24} strokeWidth={1.5} className="text-subtle" />
            <p className="mt-4 text-sm text-muted">{q ? "No reports found matching your search." : "Your saved reports will appear here after an audit."}</p>
            <Link href="/analyze" className="btn-primary mt-5">
              <Plus size={15} /> Start an analysis
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.06}>
                <Link
                  href={`/report/${r.id}`}
                  className="card group flex h-full min-h-64 flex-col p-5 transition duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white/[0.025] sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs text-subtle">
                      <CalendarDays size={13} />
                      {r.date}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-muted">
                      Audit report
                    </span>
                  </div>
                  <div className="mt-5 flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-muted">
                      <FileText size={17} strokeWidth={1.6} />
                    </span>
                    <h2 className="min-h-12 flex-1 text-lg font-medium leading-snug tracking-tight line-clamp-2">{r.title}</h2>
                  </div>
                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <span className="text-muted">Source coverage</span>
                      <span className="font-mono text-fg">{r.coverage}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-fg transition-all duration-500 group-hover:bg-white" style={{ width: `${Math.min(100, Math.max(0, r.coverage))}%` }} />
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-4 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <ClipboardCheck size={14} />
                      {r.verifyCount} items to verify
                    </span>
                    <span className="inline-flex items-center gap-1 text-fg transition group-hover:gap-2">
                      Open report <ArrowUpRight size={14} />
                    </span>
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
