"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Sparkles,
  Globe,
  Smartphone,
  Server,
  LifeBuoy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useApi, WEBSITE_URL, APP_URL, BASE } from "@/lib/api";
import { Data, PageHead, Seg, Sev } from "@/components/ui";
import Chart from "@/components/Chart";

export default function Overview() {
  const [range, setRange] = useState("7d");
  const stats = useApi<any[]>("/admin/stats", 15000);
  const ts = useApi<any[]>(`/admin/timeseries?metric=analyses&range=${range}`);
  const ins = useApi<any[]>("/admin/ai/insights", 60000);
  const hl = useApi<any[]>("/admin/health", 30000);
  const au = useApi<any[]>("/admin/audit?limit=8", 15000);
  const tickets = useApi<any[]>("/support/tickets?status=In%20Triage", 15000);

  const pendingTickets = (tickets.data || []).filter((t: any) => t.status === "In Triage");

  return (
    <div className="space-y-6">
      <PageHead
        title="DarkSpot Management Hub"
        sub="Unified mission control managing the Web Portal, Mobile Application, and 8-Agent AI Discrepancy Engine."
        right={
          <div className="flex items-center gap-2">
            <span className="badge flex items-center gap-1.5 font-mono">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Ecosystem Active
            </span>
          </div>
        }
      />

      {/* PLATFORM CONNECTIVITY CONTROL BANNER */}
      <div className="card p-5 border border-line-strong bg-gradient-to-r from-surface via-card to-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono uppercase text-white font-semibold">
                Connected Services
              </span>
              <span className="text-xs text-muted font-mono">Real-time sync enabled</span>
            </div>
            <h3 className="text-sm font-semibold text-white">
              Website, Mobile App & Backend Gateway Synced
            </h3>
            <p className="text-xs text-muted max-w-xl">
              All citizen queries, scheme reports, and circular checks submitted via Web or Mobile App are ingested live into this administration dashboard.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-white/5 px-3 py-2 text-xs font-medium text-white hover:bg-white/10 transition"
            >
              <Globe size={13} className="text-sky-400" />
              Open Website (:3000)
              <ExternalLink size={11} className="text-muted" />
            </a>

            <Link
              href="/support"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition"
            >
              <LifeBuoy size={13} />
              Support Queue
              {pendingTickets.length > 0 && (
                <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-mono text-black font-bold">
                  {pendingTickets.length}
                </span>
              )}
            </Link>

            <Link
              href="/users"
              className="btn-primary text-xs !py-2 flex items-center gap-1.5"
            >
              Manage Users <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* URGENT SUPPORT TRIAGE ALERT (If pending complaints exist) */}
      {pendingTickets.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.05] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <LifeBuoy size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-300 font-mono">
                {pendingTickets.length} Customer Query / Complaint Waiting in Triage
              </div>
              <div className="text-xs text-muted line-clamp-1 mt-0.5">
                Latest: &ldquo;{pendingTickets[0].subject}&rdquo; from {pendingTickets[0].email} via {pendingTickets[0].source === "app" ? "Mobile App" : "Website"}
              </div>
            </div>
          </div>

          <Link
            href="/support"
            className="btn-primary shrink-0 text-xs !py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold flex items-center gap-1"
          >
            Review & Solve Now <ArrowUpRight size={13} />
          </Link>
        </div>
      )}

      {/* KPI Stats Strip */}
      <Data r={stats} empty="No stats yet">
        {(d: any[]) => (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {d.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-5"
              >
                <div className="text-xs text-muted">{s.label}</div>
                <div className="mt-2 text-2xl font-bold tracking-tight text-white">{s.value}</div>
                {s.delta && <div className="mt-1 text-xs text-subtle font-mono">{s.delta}</div>}
              </motion.div>
            ))}
          </div>
        )}
      </Data>

      {/* Main Charts & AI Insights Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Analyses & Verification Activity</div>
              <div className="text-xs text-muted">Audits executed across Web and Mobile App</div>
            </div>
            <Seg id="range" value={range} onChange={setRange} options={["24h", "7d", "30d"]} />
          </div>
          <Data r={ts} empty="No data for this range">
            {(d: any[]) => <Chart points={d} />}
          </Data>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-medium text-white">
            <Sparkles size={15} strokeWidth={1.5} className="text-amber-400" />
            AI Operations Insights
          </div>
          <Data r={ins} empty="No insights right now">
            {(d: any[]) => (
              <ul className="space-y-4">
                {d.map((x) => (
                  <li key={x.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-medium text-white">{x.title}</div>
                      <Sev s={x.severity} />
                    </div>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{x.detail}</p>
                    {x.action && (
                      <Link
                        href={x.action.href}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-fg hover:underline font-medium"
                      >
                        {x.action.label} <ArrowUpRight size={12} />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Data>
        </div>
      </div>

      {/* System Health & Audit Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-medium text-white">System & Service Health</div>
            <span className="text-[11px] font-mono text-muted">Poll: 30s</span>
          </div>
          <Data r={hl} empty="No health data">
            {(d: any[]) =>
              d.map((x) => (
                <div
                  key={x.name}
                  className="flex items-center justify-between border-t border-line py-3 text-sm first:border-0"
                >
                  <span className="text-xs font-medium text-white">{x.name}</span>
                  <span className="flex items-center gap-3 text-xs text-muted">
                    {x.latency_ms != null && (
                      <span className="font-mono text-[11px]">{x.latency_ms} ms</span>
                    )}
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                      {x.status}
                    </span>
                  </span>
                </div>
              ))
            }
          </Data>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex justify-between text-sm font-medium">
            <span className="text-white">Recent Platform Activity</span>
            <Link href="/audit" className="text-xs text-muted hover:text-white flex items-center gap-0.5">
              View all <ChevronRight size={12} />
            </Link>
          </div>
          <Data r={au} empty="No activity yet">
            {(d: any[]) =>
              d.map((x) => (
                <div
                  key={x.id}
                  className="flex justify-between items-center gap-4 border-t border-line py-3 text-xs first:border-0"
                >
                  <span className="text-muted leading-relaxed line-clamp-1">{x.text}</span>
                  <span className="shrink-0 font-mono text-[10px] text-subtle">
                    {x.created_at ? new Date(x.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
              ))
            }
          </Data>
        </div>
      </div>
    </div>
  );
}
