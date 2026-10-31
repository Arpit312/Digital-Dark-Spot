"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  Radio,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Shield,
  Trash2,
  Radar
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Seg } from "@/components/ui";

interface TrackedSource {
  id: string;
  url: string;
  frequency: string;
  lastChecked: string;
  status: "Active" | "Changed" | "Monitoring";
  tier: number;
}

interface AlertItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  before: string;
  after: string;
  date: string;
  severity: "High" | "Medium" | "Low";
  driftType: string;
}

const initialTracked: TrackedSource[] = [
  {
    id: "s1",
    url: "https://scholarships.gov.in/guidelines/post-matric-2026",
    frequency: "Hourly",
    lastChecked: "12 mins ago",
    status: "Changed",
    tier: 1.0
  },
  {
    id: "s2",
    url: "https://education.gov.in/circulars/central-sector-scheme",
    frequency: "Daily",
    lastChecked: "2 hours ago",
    status: "Monitoring",
    tier: 1.0
  },
  {
    id: "s3",
    url: "https://ugc.gov.in/notices/admission-regulations-2026",
    frequency: "Daily",
    lastChecked: "5 hours ago",
    status: "Monitoring",
    tier: 1.0
  }
];

const initialAlerts: AlertItem[] = [
  {
    id: "a1",
    title: "Application closing deadline extended",
    source: "scholarships.gov.in/guidelines/post-matric-2026",
    sourceUrl: "https://scholarships.gov.in",
    before: "Last date for submission: 15 November 2026",
    after: "Last date for submission extended to: 30 November 2026 (5:00 PM IST)",
    date: "Today, 14:32 IST",
    severity: "High",
    driftType: "Deadline Shift"
  },
  {
    id: "a2",
    title: "Income eligibility verification certificate clause updated",
    source: "education.gov.in/circulars/central-sector-scheme",
    sourceUrl: "https://education.gov.in",
    before: "Competent Revenue Authority certificate issued within last 6 months required.",
    after: "Income Certificate issued within last 12 months or active DigiLocker verified e-Sanad accepted.",
    date: "Yesterday",
    severity: "High",
    driftType: "Document Requirement"
  },
  {
    id: "a3",
    title: "Grievance redressal contact email updated",
    source: "ugc.gov.in/notices/admission-regulations-2026",
    sourceUrl: "https://ugc.gov.in",
    before: "helpdesk@nsp.gov.in (inactive)",
    after: "helpdesk-scholarships@gov.in and toll-free 0120-6619540",
    date: "28 Oct 2026",
    severity: "Medium",
    driftType: "Helpline Rectification"
  }
];

export default function Watchtower() {
  const [sources, setSources] = useState<TrackedSource[]>(initialTracked);
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [freq, setFreq] = useState("Hourly");
  const [newUrl, setNewUrl] = useState("");

  const handleAdd = () => {
    if (!newUrl.trim()) return;
    const item: TrackedSource = {
      id: "s_" + Date.now(),
      url: newUrl.trim(),
      frequency: freq,
      lastChecked: "Just now",
      status: "Monitoring",
      tier: newUrl.includes(".gov.in") ? 1.0 : 0.8
    };
    setSources([item, ...sources]);
    setNewUrl("");
  };

  const handleRemove = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  return (
    <div>
      <PageHeader
        eyebrow="WATCHTOWER RADAR"
        title="Know the moment official policy changes."
        sub="Continuous change-detection radar. Employs SimHash Hamming distance and CUSUM algorithms to alert you whenever deadlines, eligibility, or circulars drift."
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Tracked Sources & Monitor Setup (5 cols) */}
          <div className="card space-y-6 p-6 lg:col-span-5 self-start">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-fg">
                <Radar size={16} className="text-zinc-400" />
                <span>Track New Official Portal</span>
              </div>
              <p className="mt-1 text-xs text-subtle">
                Enter government notice portal, state welfare URL, or university circular page.
              </p>
            </div>

            <div className="space-y-3">
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="input text-xs"
                placeholder="https://scholarships.gov.in/..."
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-subtle mb-1.5">Check Frequency</div>
                  <Seg id="freq" value={freq} onChange={setFreq} options={["Hourly", "Daily", "Weekly"]} />
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!newUrl.trim()}
                  className="btn-primary mt-4 px-4 py-2 text-xs self-end disabled:opacity-40"
                >
                  <Plus size={14} /> Add Source
                </button>
              </div>
            </div>

            {/* Tracked Sources List */}
            <div className="border-t border-line pt-5">
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-fg">
                <span>Active Tracked Endpoints ({sources.length})</span>
                <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live SimHash Radar
                </span>
              </div>

              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {sources.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-line bg-surface/60 p-3 text-xs transition hover:border-white/20"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="badge text-[10px] py-0 px-1.5">Tier {s.tier}</span>
                        <span className="text-zinc-300 font-mono text-[11px] truncate block">
                          {s.url.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-subtle">
                        <span>Check: {s.frequency}</span>
                        <span>•</span>
                        <span>{s.lastChecked}</span>
                        <span>•</span>
                        <span
                          className={`font-medium ${
                            s.status === "Changed" ? "text-amber-400" : "text-emerald-400"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(s.id)}
                      className="text-subtle hover:text-red-400 p-1"
                      aria-label="Remove tracked source"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Live Drift Alerts & Diff Inspector (7 cols) */}
          <div className="card p-6 lg:col-span-7">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-5">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-zinc-400" />
                <span className="text-sm font-semibold tracking-tight text-fg">
                  Policy Drift & Change Alerts ({alerts.length})
                </span>
              </div>
              <span className="badge text-[10px] font-mono">CUSUM Filtered (d_H &gt; 3)</span>
            </div>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-xl border border-line bg-surface/40 p-5 space-y-3 transition hover:border-white/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            alert.severity === "High"
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          }`}
                        >
                          {alert.severity} Risk
                        </span>
                        <span className="text-xs font-mono text-zinc-400">{alert.driftType}</span>
                      </div>
                      <h4 className="mt-2 text-base font-semibold text-fg tracking-tight">
                        {alert.title}
                      </h4>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-subtle">
                        <span className="truncate">{alert.source}</span>
                        <a
                          href={alert.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-fg"
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                    <span className="text-xs text-subtle font-mono shrink-0">{alert.date}</span>
                  </div>

                  {/* Side-by-Side Diff Comparison Box */}
                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-3 text-xs font-mono">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1">
                        Previous Rule (Superseded)
                      </div>
                      <div className="text-zinc-400 line-through leading-relaxed">
                        {alert.before}
                      </div>
                    </div>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-xs font-mono">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                        Active Verified Update
                      </div>
                      <div className="text-zinc-100 font-medium leading-relaxed">
                        {alert.after}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-line pt-4 flex items-center justify-between text-xs text-subtle">
              <span>SimHash change alerts ignore cosmetic HTML layout modifications.</span>
              <span className="font-mono">Hamming Threshold d_H = 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
