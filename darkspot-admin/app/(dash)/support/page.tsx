"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Globe,
  Smartphone,
  Send,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  ChevronRight,
  Filter,
  RefreshCw,
  X,
  FileCheck2,
  Trash2,
  ArrowUpRight
} from "lucide-react";
import { api, useApi } from "@/lib/api";
import { PageHead, Table } from "@/components/ui";

interface TicketReply {
  sender: string;
  message: string;
  timestamp: string;
  iso?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  email: string;
  source?: "web" | "app" | "admin" | string;
  status: "In Triage" | "Under Investigation" | "Resolved" | "Closed" | string;
  assigned_agent?: string;
  created_at: string;
  sla?: string;
  resolution?: string;
  resolved_at?: string;
  replies?: TicketReply[];
}

const PRESET_RESOLUTIONS = [
  "Discrepancy verified against official gazette. Circular update notified to nodal portal.",
  "Issue resolved: Stale cached deadline replaced with active extended date.",
  "Mobile app cache serialization bug patched in build v1.2.1.",
  "Escalated to Ministry Nodal Desk. Verification checklist updated."
];

export default function SupportDesk() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Edit / Resolve Form State
  const [replyText, setReplyText] = useState("");
  const [resolutionText, setResolutionText] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editAgent, setEditAgent] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionNotice, setActionNotice] = useState("");

  // New Ticket Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Website Error / Technical Bug");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newSource, setNewSource] = useState("web");
  const [newEmail, setNewEmail] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creatingTicket, setCreatingTicket] = useState(false);

  // Query tickets with periodic polling every 10 seconds
  const ticketsQuery = useApi<SupportTicket[]>(
    `/support/tickets?q=${encodeURIComponent(q)}&status=${statusFilter === "All" ? "" : statusFilter.toLowerCase()}&priority=${priorityFilter === "All" ? "" : priorityFilter.toLowerCase()}&source=${sourceFilter === "All" ? "" : sourceFilter.toLowerCase()}`,
    10000
  );

  const rawTickets = ticketsQuery.data || [];

  // Metrics
  const totalCount = rawTickets.length;
  const inTriageCount = rawTickets.filter((t) => t.status === "In Triage").length;
  const underInvestigationCount = rawTickets.filter((t) => t.status === "Under Investigation").length;
  const resolvedCount = rawTickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
  const highPriorityCount = rawTickets.filter((t) => t.priority === "High" || t.priority === "Critical").length;
  const appTicketsCount = rawTickets.filter((t) => t.source === "app").length;
  const webTicketsCount = rawTickets.filter((t) => t.source !== "app").length;

  const handleOpenTicket = (t: SupportTicket) => {
    setSelectedTicket(t);
    setEditStatus(t.status);
    setEditAgent(t.assigned_agent || "Support Triage Agent & Tier-2 Engineering");
    setEditPriority(t.priority);
    setResolutionText(t.resolution || "");
    setReplyText("");
    setActionNotice("");
  };

  const handleSaveResolution = async (markAsResolved: boolean = false) => {
    if (!selectedTicket) return;
    setSubmitting(true);
    setActionNotice("");

    const targetStatus = markAsResolved ? "Resolved" : editStatus;
    const body: any = {
      status: targetStatus,
      assigned_agent: editAgent,
      priority: editPriority,
    };

    if (resolutionText.trim()) {
      body.resolution = resolutionText.trim();
    }
    if (replyText.trim()) {
      body.reply = replyText.trim();
    }

    try {
      const res = await api(`/support/ticket/${selectedTicket.id}`, {
        method: "PATCH",
        body
      });
      if (res.ticket) {
        setSelectedTicket(res.ticket);
        setEditStatus(res.ticket.status);
        setResolutionText(res.ticket.resolution || "");
        setReplyText("");
      }
      setActionNotice(markAsResolved ? "Ticket marked as Resolved and reply sent!" : "Ticket updated successfully.");
      ticketsQuery.reload();
    } catch (e: any) {
      alert(e.message || "Could not update ticket");
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionNotice(""), 4000);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!confirm(`Are you sure you want to delete ticket ${id}?`)) return;
    try {
      await api(`/support/ticket/${id}`, { method: "DELETE" });
      setSelectedTicket(null);
      ticketsQuery.reload();
    } catch (e: any) {
      alert(e.message || "Failed to delete ticket");
    }
  };

  const handleCreateTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDesc.trim()) return;
    setCreatingTicket(true);
    try {
      await api("/support/ticket", {
        method: "POST",
        body: {
          subject: newSubject.trim(),
          category: newCategory,
          priority: newPriority,
          description: newDesc.trim(),
          email: newEmail.trim() || "admin@darkspotatlas.org",
          source: newSource
        }
      });
      setShowCreateModal(false);
      setNewSubject("");
      setNewDesc("");
      setNewEmail("");
      ticketsQuery.reload();
    } catch (e: any) {
      alert(e.message || "Failed to create ticket");
    } finally {
      setCreatingTicket(false);
    }
  };

  return (
    <div className="space-y-7">
      <PageHead
        title="Customer Support & Complaints Desk"
        sub="Unified resolution console managing queries, complaints, and discrepancy reports from Website and Mobile App."
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-1.5 text-xs !py-2"
            >
              <LifeBuoy size={14} /> Log Manual Query
            </button>
            <button
              onClick={() => ticketsQuery.reload()}
              className="btn-ghost flex items-center gap-1.5 text-xs !py-2"
              title="Refresh queue"
            >
              <RefreshCw size={13} className={ticketsQuery.loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        }
      />

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div className="card p-4">
          <div className="text-xs text-muted">Total Queries</div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-white">{totalCount}</div>
          <div className="mt-1 text-[11px] text-subtle font-mono">{webTicketsCount} Web · {appTicketsCount} App</div>
        </div>

        <div className="card p-4 border-amber-500/20 bg-amber-500/[0.02]">
          <div className="text-xs text-amber-400 font-medium flex items-center gap-1">
            <Clock size={12} /> In Triage
          </div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-amber-300">{inTriageCount}</div>
          <div className="mt-1 text-[11px] text-muted">Awaiting triage</div>
        </div>

        <div className="card p-4 border-sky-500/20 bg-sky-500/[0.02]">
          <div className="text-xs text-sky-400 font-medium flex items-center gap-1">
            <RefreshCw size={12} /> Investigating
          </div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-sky-300">{underInvestigationCount}</div>
          <div className="mt-1 text-[11px] text-muted">Desk active</div>
        </div>

        <div className="card p-4 border-emerald-500/20 bg-emerald-500/[0.02]">
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> Resolved
          </div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-emerald-300">{resolvedCount}</div>
          <div className="mt-1 text-[11px] text-muted">Verified & closed</div>
        </div>

        <div className="card p-4 border-rose-500/20 bg-rose-500/[0.02]">
          <div className="text-xs text-rose-400 font-medium flex items-center gap-1">
            <ShieldAlert size={12} /> High / Critical
          </div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-rose-300">{highPriorityCount}</div>
          <div className="mt-1 text-[11px] text-muted">Immediate action</div>
        </div>

        <div className="card p-4">
          <div className="text-xs text-muted">Avg Resolution SLA</div>
          <div className="mt-1.5 text-2xl font-bold tracking-tight text-white font-mono">14m</div>
          <div className="mt-1 text-[11px] text-emerald-400">99.4% on-time</div>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="card p-4 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Ticket ID, subject, email or keyword..."
              className="input pl-9 text-xs w-full text-white"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-muted" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted font-mono mr-1">
              <Filter size={13} /> Filters:
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input !h-8 !py-1 text-xs bg-neutral-900 text-white !w-32"
            >
              <option value="All">All Statuses</option>
              <option value="In Triage">In Triage</option>
              <option value="Under Investigation">Investigating</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="input !h-8 !py-1 text-xs bg-neutral-900 text-white !w-32"
            >
              <option value="All">All Sources</option>
              <option value="web">Website (:3000)</option>
              <option value="app">Mobile App</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input !h-8 !py-1 text-xs bg-neutral-900 text-white !w-28"
            >
              <option value="All">All Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Ticket Queue Table */}
      <div className="card overflow-hidden">
        {ticketsQuery.loading && !ticketsQuery.data ? (
          <div className="p-8 text-center text-xs text-muted font-mono flex items-center justify-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-line-strong border-t-accent animate-spin" />
            Connecting to support triage queue...
          </div>
        ) : rawTickets.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <LifeBuoy size={28} className="mx-auto text-muted/60" />
            <div className="text-sm font-medium text-white">No complaints or queries in this view</div>
            <p className="text-xs text-muted">All incoming issues from Website and App will automatically appear here.</p>
          </div>
        ) : (
          <Table
            rows={rawTickets}
            onRow={(x: SupportTicket) => handleOpenTicket(x)}
            cols={[
              {
                h: "Ticket & Origin",
                r: (x: SupportTicket) => (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{x.id}</span>
                      {x.source === "app" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[10px] font-mono text-indigo-400">
                          <Smartphone size={10} /> App
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 border border-sky-500/20 px-1.5 py-0.5 text-[10px] font-mono text-sky-400">
                          <Globe size={10} /> Website
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-subtle truncate max-w-[140px]">{x.email}</div>
                  </div>
                )
              },
              {
                h: "Category & Subject",
                r: (x: SupportTicket) => (
                  <div className="max-w-md space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-muted bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">
                        {x.category}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-white line-clamp-1">{x.subject}</div>
                    <div className="text-xs text-muted line-clamp-1">{x.description}</div>
                  </div>
                )
              },
              {
                h: "Priority",
                r: (x: SupportTicket) => {
                  const p = x.priority?.toLowerCase() || "medium";
                  const color =
                    p === "critical"
                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      : p === "high"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : p === "low"
                      ? "bg-white/5 text-muted border-white/10"
                      : "bg-sky-500/10 text-sky-400 border-sky-500/20";
                  return (
                    <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase ${color}`}>
                      {x.priority}
                    </span>
                  );
                }
              },
              {
                h: "Status & SLA",
                r: (x: SupportTicket) => {
                  const s = x.status?.toLowerCase() || "in triage";
                  const isResolved = s === "resolved" || s === "closed";
                  return (
                    <div className="space-y-1">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          isResolved
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : s.includes("investigat")
                            ? "bg-sky-500/15 text-sky-400 border border-sky-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${isResolved ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {x.status}
                      </span>
                      <div className="text-[10px] font-mono text-subtle">{x.sla || "Within 15 mins"}</div>
                    </div>
                  );
                }
              },
              {
                h: "Assigned Desk",
                r: (x: SupportTicket) => (
                  <div className="text-xs text-muted max-w-[130px] truncate" title={x.assigned_agent}>
                    {x.assigned_agent || "General Triage"}
                  </div>
                )
              },
              {
                h: "Action",
                r: (x: SupportTicket) => (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenTicket(x);
                    }}
                    className="btn-ghost !py-1 text-xs flex items-center gap-1 text-white hover:text-white"
                  >
                    Solve <ChevronRight size={13} />
                  </button>
                )
              }
            ]}
          />
        )}
      </div>

      {/* RESOLUTION & DETAIL DRAWER / MODAL */}
      <AnimatePresence>
        {selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 border border-line-strong shadow-2xl bg-neutral-950"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-line pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{selectedTicket.id}</span>
                    <span className="text-[10px] font-mono rounded bg-white/10 px-2 py-0.5 text-white">
                      Source: {selectedTicket.source === "app" ? "Mobile App" : "Website Portal"}
                    </span>
                    <span className="text-[10px] font-mono text-muted">{selectedTicket.created_at}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{selectedTicket.subject}</h3>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {actionNotice && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-mono text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={15} /> {actionNotice}
                </div>
              )}

              {/* Citizen Details & Description */}
              <div className="space-y-3 rounded-xl border border-line bg-surface p-4 text-xs">
                <div className="grid grid-cols-2 gap-2 text-muted">
                  <div>
                    <span className="text-subtle font-mono">Citizen / User:</span>{" "}
                    <span className="text-white font-medium">{selectedTicket.email}</span>
                  </div>
                  <div>
                    <span className="text-subtle font-mono">Category:</span>{" "}
                    <span className="text-white font-medium">{selectedTicket.category}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-line/60">
                  <div className="text-subtle font-mono mb-1">Issue Statement & Complaint:</div>
                  <div className="text-white text-xs leading-relaxed whitespace-pre-wrap bg-neutral-900/80 p-3 rounded-lg border border-line/50">
                    {selectedTicket.description}
                  </div>
                </div>

                {selectedTicket.resolution && (
                  <div className="pt-2 border-t border-line/60">
                    <div className="text-emerald-400 font-mono mb-1 flex items-center gap-1.5">
                      <FileCheck2 size={13} /> Current Official Resolution:
                    </div>
                    <div className="text-emerald-300/90 text-xs bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/20">
                      {selectedTicket.resolution}
                    </div>
                  </div>
                )}
              </div>

              {/* Conversation / Reply Thread */}
              {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-mono text-muted flex items-center gap-1.5">
                    <MessageSquare size={13} /> Previous Desk Responses:
                  </div>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {selectedTicket.replies.map((rep, idx) => (
                      <div key={idx} className="rounded-lg border border-line bg-neutral-900 p-2.5 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-muted font-mono">
                          <span className="text-white font-semibold">{rep.sender}</span>
                          <span>{rep.timestamp}</span>
                        </div>
                        <p className="text-muted leading-relaxed">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Solve & Resolution Form */}
              <div className="space-y-4 pt-2 border-t border-line">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-white font-semibold">Triage & Resolution Controls</h4>
                  <span className="text-[11px] text-subtle font-mono">Direct sync with Citizen Portal & App</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted">Update Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="input !h-9 text-xs text-white bg-neutral-900 w-full"
                    >
                      <option value="In Triage">In Triage</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted">Assigned Desk / Officer</label>
                    <select
                      value={editAgent}
                      onChange={(e) => setEditAgent(e.target.value)}
                      className="input !h-9 text-xs text-white bg-neutral-900 w-full"
                    >
                      <option value="Policy Discrepancy Desk">Policy Discrepancy Desk</option>
                      <option value="Tier-2 Tech Engineering">Tier-2 Tech Engineering</option>
                      <option value="Mobile Core Engineering">Mobile Core Engineering</option>
                      <option value="Nodal Liaison Officer">Nodal Liaison Officer</option>
                      <option value="Institution Onboarding">Institution Onboarding</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted">Priority</label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="input !h-9 text-xs text-white bg-neutral-900 w-full"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-muted">Quick Resolution Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_RESOLUTIONS.map((pr, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setResolutionText(pr);
                          setReplyText(`Our team has investigated this issue: ${pr}`);
                        }}
                        className="rounded border border-line bg-white/5 px-2 py-1 text-[11px] text-muted hover:text-white hover:bg-white/10 transition text-left"
                      >
                        {pr.slice(0, 48)}...
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Official Resolution Note (Shown in resolved audit & report)</label>
                  <textarea
                    rows={2}
                    value={resolutionText}
                    onChange={(e) => setResolutionText(e.target.value)}
                    placeholder="e.g. Nodal circular #F-102 verified. Confirmed valid until Nov 30."
                    className="input text-xs text-white py-2 w-full"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Reply to Citizen / App User</label>
                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Send direct explanation or update back to citizen's support ticket view..."
                    className="input text-xs text-white py-2 w-full"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteTicket(selectedTicket.id)}
                    className="btn-ghost !text-rose-400 hover:!bg-rose-500/10 text-xs flex items-center gap-1.5"
                  >
                    <Trash2 size={13} /> Delete Ticket
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSaveResolution(false)}
                      className="btn-ghost text-xs !py-2"
                    >
                      Update Status
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSaveResolution(true)}
                      className="btn-primary text-xs !py-2 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white"
                    >
                      <CheckCircle2 size={14} /> Mark as Solved & Reply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MANUAL TICKET MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="card w-full max-w-lg p-6 space-y-5 bg-neutral-950 border border-line-strong shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <LifeBuoy size={16} /> Log Manual Citizen Query / Issue
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-muted hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateTicketSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted">Origin Channel</label>
                    <select
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      className="input !h-9 text-xs text-white bg-neutral-900 w-full"
                    >
                      <option value="web">Website Portal</option>
                      <option value="app">Mobile App</option>
                      <option value="admin">Helpline / Phone Call</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-muted">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="input !h-9 text-xs text-white bg-neutral-900 w-full"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="input !h-9 text-xs text-white bg-neutral-900 w-full"
                  >
                    <option value="Website Error / Technical Bug">Website Error / Technical Bug</option>
                    <option value="Mobile App Issue">Mobile App Issue</option>
                    <option value="Contradiction / Conflict">Policy Contradiction / Conflict</option>
                    <option value="Information Gap / Missing Data">Information Gap / Missing Data</option>
                    <option value="Account, Login & Verification">Account, Login & Verification</option>
                    <option value="General Query">General Question</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Citizen Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="citizen@edu.gov.in"
                    className="input text-xs text-white w-full"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Subject / Short Summary</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Discrepancy in income certificate requirement"
                    className="input text-xs text-white w-full"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted">Detailed Query / Complaint</label>
                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe citizen inquiry and relevant circular details..."
                    className="input text-xs text-white py-2 w-full"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="btn-ghost text-xs !py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingTicket}
                    className="btn-primary text-xs !py-2 flex items-center gap-1.5"
                  >
                    <Send size={13} /> {creatingTicket ? "Registering..." : "Register Ticket"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
