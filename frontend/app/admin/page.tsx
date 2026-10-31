"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Cpu,
  Users,
  CheckCircle2,
  XCircle,
  Activity,
  Key,
  Database,
  Filter,
  RefreshCw,
  Clock,
  Server
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

interface OfficerQueueItem {
  id: string;
  name: string;
  designation: string;
  institution: string;
  email: string;
  govProof: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const initialQueue: OfficerQueueItem[] = [
  {
    id: "oq-1",
    name: "Dr. Asha Raghavan",
    designation: "Nodal Officer (Scholarships)",
    institution: "Directorate of Higher Education, Govt of Bihar",
    email: "asha.raghavan@gov.in",
    govProof: "Govt ID + Digital Sign Cert #99214",
    date: "10 mins ago",
    status: "Pending"
  },
  {
    id: "oq-2",
    name: "Prof. Vikram Sen",
    designation: "Registrar & Academic Dean",
    institution: "State Technological University",
    email: "registrar@stu.ac.in",
    govProof: "Institutional Gazette Endorsement #1029",
    date: "45 mins ago",
    status: "Pending"
  },
  {
    id: "oq-3",
    name: "Kavita Deshmukh",
    designation: "Assistant Welfare Commissioner",
    institution: "Social Justice Dept., Maharashtra",
    email: "k.deshmukh@maharashtra.gov.in",
    govProof: "NIC Verified Token ID #4402",
    date: "2 hours ago",
    status: "Pending"
  }
];

const agentTelemetry = [
  { id: "agent-01", name: "Tavily Ingestion Worker", status: "Healthy", latency: "1.2s", load: "14%", p99: "2.1s" },
  { id: "agent-02", name: "PyMuPDF Layout OCR", status: "Healthy", latency: "2.4s", load: "28%", p99: "4.8s" },
  { id: "agent-03", name: "Gemini 2.5 Flash Extractor", status: "Healthy", latency: "3.1s", load: "42%", p99: "5.5s" },
  { id: "agent-04", name: "Deterministic Math Engine", status: "Healthy", latency: "0.04s", load: "6%", p99: "0.1s" },
  { id: "agent-05", name: "Temporal Decay Engine", status: "Healthy", latency: "0.02s", load: "3%", p99: "0.05s" },
  { id: "agent-06", name: "Bayesian Red-Team Agent", status: "Healthy", latency: "2.8s", load: "35%", p99: "4.2s" },
  { id: "agent-07", name: "Zero-Hallucination Gate", status: "Healthy", latency: "0.15s", load: "9%", p99: "0.3s" },
  { id: "agent-08", name: "MMR Diversity Ranker", status: "Healthy", latency: "0.08s", load: "5%", p99: "0.2s" }
];

const auditTrail = [
  { event: "Fact Signed: NSP 2026 Cutoff Synchronized", actor: "Officer GOV-IN-7824", hash: "0x892a...c04", time: "12m ago", type: "signature" },
  { event: "Zero-Hallucination Gate Intercepted Unverified Claim", actor: "System Agent 07", hash: "0x110e...881", time: "28m ago", type: "alert" },
  { event: "Domain Trust Tier Elevated: scholarships.gov.in (Tier A)", actor: "Admin Console", hash: "0x55d1...ff2", time: "1h ago", type: "security" },
  { event: "Temporal Decay Applied to 2024 Gazette Circular", actor: "System Agent 05", hash: "0x33b8...99e", time: "2h ago", type: "engine" }
];

export default function Admin() {
  const [queue, setQueue] = useState<OfficerQueueItem[]>(initialQueue);
  const [activeTab, setActiveTab] = useState<"queue" | "telemetry" | "logs">("queue");

  const handleAction = (id: string, status: "Approved" | "Rejected") => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="SYSTEM OPERATIONS"
        title="Administrative Governance & Model Telemetry"
        sub="Monitor real-time pipeline inference throughput, verify cryptographic officer credentials, and inspect zero-hallucination security ledgers."
      />

      <div className="mx-auto max-w-6xl px-5 py-8">
        {/* Real-time Health Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Analyses Today</span>
              <Activity size={14} className="text-white" />
            </div>
            <div className="mt-1 text-2xl font-semibold">1,482</div>
            <div className="mt-1 text-[11px] text-white">+18% vs yesterday</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Active Model Workers</span>
              <Cpu size={14} className="text-blue-400" />
            </div>
            <div className="mt-1 text-2xl font-semibold">8 / 8 Online</div>
            <div className="mt-1 text-[11px] text-blue-400">0% degradation</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Hallucinations Caught</span>
              <ShieldAlert size={14} className="text-amber-400" />
            </div>
            <div className="mt-1 text-2xl font-semibold">94 claims</div>
            <div className="mt-1 text-[11px] text-amber-400">Dropped before UI</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>P95 End-to-End Latency</span>
              <Clock size={14} className="text-purple-400" />
            </div>
            <div className="mt-1 text-2xl font-semibold">8.4 s</div>
            <div className="mt-1 text-[11px] text-muted">Avg response time</div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-line mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("queue")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "queue"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Users size={15} />
            Officer Verification Queue
            <span className="badge ml-1 bg-white/10 text-xs">
              {queue.filter((q) => q.status === "Pending").length} pending
            </span>
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "telemetry"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Server size={15} />
            8-Agent Live Telemetry
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "logs"
                ? "border-white text-fg"
                : "border-transparent text-muted hover:text-fg"
            }`}
          >
            <Database size={15} />
            Cryptographic Audit Ledger
          </button>
        </div>

        {/* Tab 1: Queue */}
        {activeTab === "queue" && (
          <div className="card p-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-base font-semibold">Officer Cryptographic Access Approvals</h3>
                <p className="text-xs text-muted mt-0.5">
                  Designated authorities must verify government email and provide institutional proof before receiving Ed25519 co-signing keys.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl border border-line bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className="text-xs text-muted">• {item.designation}</span>
                    </div>
                    <div className="text-xs text-fg/80">{item.institution}</div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-muted">
                      <span>{item.email}</span>
                      <span>Proof: {item.govProof}</span>
                      <span className="text-subtle">{item.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(item.id, "Approved")}
                          className="btn-primary text-xs px-3 py-1.5 inline-flex items-center gap-1"
                        >
                          <CheckCircle2 size={13} /> Approve Passkey
                        </button>
                        <button
                          onClick={() => handleAction(item.id, "Rejected")}
                          className="btn-ghost text-xs px-3 py-1.5 inline-flex items-center gap-1"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`badge text-xs ${
                          item.status === "Approved"
                            ? "border-white/20 text-white"
                            : "border-red-500/30 text-red-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Telemetry */}
        {activeTab === "telemetry" && (
          <div className="card p-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <h3 className="text-base font-semibold">Active Agent Workers & Execution Health</h3>
                <p className="text-xs text-muted mt-0.5">
                  Detailed health metrics for each computational node in the multi-agent consensus pipeline.
                </p>
              </div>
              <span className="badge border-white/20 text-white text-xs">
                All Workers Healthy
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {agentTelemetry.map((worker) => (
                <div key={worker.id} className="rounded-xl border border-line bg-card/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-subtle">{worker.id}</span>
                    <span className="badge text-[10px] border-white/20 text-white">
                      {worker.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold">{worker.name}</div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line/60 pt-3 text-xs">
                    <div>
                      <span className="text-subtle text-[10px]">Avg Latency</span>
                      <div className="font-mono font-medium">{worker.latency}</div>
                    </div>
                    <div>
                      <span className="text-subtle text-[10px]">Worker Load</span>
                      <div className="font-mono font-medium">{worker.load}</div>
                    </div>
                    <div>
                      <span className="text-subtle text-[10px]">P99 Latency</span>
                      <div className="font-mono font-medium">{worker.p99}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Logs */}
        {activeTab === "logs" && (
          <div className="card p-6">
            <div className="border-b border-line pb-4">
              <h3 className="text-base font-semibold">Immutable Cryptographic Audit Trail</h3>
              <p className="text-xs text-muted mt-0.5">
                Every policy signature, model hallucination filter, and domain authorization is cryptographically logged.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {auditTrail.map((log, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-xl border border-line bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-fg">{log.event}</div>
                    <div className="text-muted text-[11px]">Actor: {log.actor}</div>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px]">
                    <span className="text-subtle">{log.hash}</span>
                    <span className="text-muted">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
