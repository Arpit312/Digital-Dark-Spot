"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LifeBuoy,
  Send,
  HelpCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Sparkles,
  Mail,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Bot,
  User,
  ArrowRight
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  getAuthUser,
  createSupportTicket,
  getSupportTickets,
  type SupportTicket,
  type AuthUser
} from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  actions?: Array<{ label: string; href?: string; onClickAction?: string }>;
}

const FAQ_ITEMS = [
  {
    q: "How does DarkSpot Atlas find information gaps and contradictions?",
    category: "Audit Pipeline",
    a: "An analysis searches or fetches source material, extracts claims, checks for gaps and conflicts, and returns findings with source evidence. Results are saved to your account when the analysis completes."
  },
  {
    q: "What should I do if my analysis request seems slow or stuck?",
    category: "Troubleshooting",
    a: "Analysis requires the API, source-search provider, and database to be available. Check the error shown on the Analyze page and retry; the app does not replace failed results with sample data."
  },
  {
    q: "How does the Dark Spot Index (DSI) work?",
    category: "Audit Pipeline",
    a: "The Dark Spot Index is calculated by the analysis pipeline from its coverage result. Review each finding and its linked evidence; the index is not a guarantee of policy correctness."
  },
  {
    q: "How can I upload a PDF circular or scheme guideline?",
    category: "Platform Usage",
    a: "Use the upload control on the Analyze page to extract PDF text. The extracted content must then be included in an analysis to generate findings."
  },
  {
    q: "How do I link my Google account or verify my phone number?",
    category: "Account & Profile",
    a: "Phone OTP delivery and Google account linking are not configured in this deployment. Do not treat either option as verified until a provider is configured."
  },
  {
    q: "How does an Officer dispatch work for emergency discrepancies?",
    category: "Officer Workflows",
    a: "Officer analytics are available only to accounts with an officer or admin role. Dispatch and directive workflows are not currently connected."
  }
];

const PRESET_QUERIES = [
  "How does quote verification work?",
  "Why is my login or signup failing?",
  "How to report conflicting scholarship dates?",
  "How to verify my phone number with OTP?",
  "How to upload an official circular PDF?"
];

export default function SupportPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // AI Chat Assistant State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "This assistant searches the published support FAQs. For issues not covered there, submit a support ticket.",
      time: "Just now"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [ticketError, setTicketError] = useState("");

  // Ticket Submission Form State
  const [category, setCategory] = useState("Website Error / Technical Bug");
  const [priority, setPriority] = useState("Medium");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketSuccessMsg, setTicketSuccessMsg] = useState("");

  // FAQ Search state
  const [faqSearch, setFaqSearch] = useState("");
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    const u = getAuthUser();
    setUser(u);
    if (u?.email) setTicketEmail(u.email);

    loadTickets();
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/health`, { cache: "no-store" })
      .then((response) => setBackendStatus(response.ok ? "Connected" : "Unavailable"))
      .catch(() => setBackendStatus("Unavailable"));
  }, []);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const list = await getSupportTickets();
      setTickets(list);
      setTicketError("");
    } catch (error: any) {
      setTicketError(error.message || "Could not load support tickets.");
    } finally {
      setLoadingTickets(false);
    }
  };

  // Automated Query Solver
  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || inputQuery.trim();
    if (!q) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      time: "Just now"
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery("");
    const terms = q.toLowerCase().split(/\W+/).filter((term) => term.length > 2);
    const match = FAQ_ITEMS.find((item) =>
      terms.some((term) => `${item.q} ${item.a}`.toLowerCase().includes(term))
    );
    setMessages((prev) => [...prev, {
      id: `b-${Date.now()}`,
      sender: "bot",
      text: match ? match.a : "No FAQ matched that question. Submit a support ticket below for follow-up.",
      time: "Now",
      actions: match
        ? [{ label: "Open FAQ", href: "#faq-section" }]
        : [{ label: "Submit a ticket", href: "#ticket-form" }],
    }]);
  };

  // Submit Ticket Handler
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmittingTicket(true);
    setTicketSuccessMsg("");
    setTicketError("");

    try {
      const res = await createSupportTicket({
        category,
        priority,
        subject,
        description,
        email: ticketEmail || undefined
      });

      if (res.success && res.ticket) {
        setTickets((prev) => [res.ticket!, ...prev]);
        setTicketSuccessMsg(`Support ticket ${res.ticket.id} was saved.`);
        setSubject("");
        setDescription("");
      } else {
        setTicketError(res.error || "Could not create support ticket.");
      }
    } catch (error: any) {
      setTicketError(error.message || "Could not create support ticket.");
    } finally {
      setSubmittingTicket(false);
      setTimeout(() => setTicketSuccessMsg(""), 6000);
    }
  };

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">
      <PageHeader
        eyebrow="SUPPORT & RESOLUTION DESK"
        title="Support & tickets"
        sub="Search the help articles or submit a ticket. Ticket status is stored with your account."
      />

      <div className="mx-auto max-w-5xl space-y-10 px-5 py-8">
        {/* Support and service status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-5 border-white/10 bg-white/[0.02] flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
              <LifeBuoy size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-white font-semibold">Support tickets</div>
              <div className="text-sm font-semibold text-white mt-0.5">Account-linked</div>
              <div className="text-[11px] text-muted">Submit an issue below</div>
            </div>
          </div>

          <div className="card p-5 border-white/10 bg-white/[0.02] flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-white font-semibold">Ticket updates</div>
              <div className="text-sm font-semibold text-white mt-0.5">Saved to your account</div>
              <div className="text-[11px] text-muted">Check status in this page</div>
            </div>
          </div>

          <div className="card p-5 border-white/10 bg-white/[0.02] flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-white font-semibold">API status</div>
              <div className="text-sm font-semibold text-white mt-0.5">{backendStatus}</div>
              <div className="text-[11px] text-muted">Live health endpoint</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: FAQ search */}
        <div className="card p-6 sm:p-7 space-y-6 border-white/10 bg-card/90 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  Search the support FAQs
                  <span className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-mono text-white">
                    FAQ Search
                  </span>
                </h3>
                <p className="text-xs text-muted">Answers are drawn from the published help articles.</p>
              </div>
            </div>
          </div>

          {/* Preset Quick Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-muted flex items-center gap-1">
              <Sparkles size={11} className="text-white" /> Quick Inquiries:
            </span>
            {PRESET_QUERIES.map((pq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(pq)}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted hover:border-white/30 hover:text-white hover:bg-white/10 transition"
              >
                {pq}
              </button>
            ))}
          </div>

          {/* Interactive Chat Window */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-4 sm:p-5 max-h-[380px] min-h-[220px] overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white flex items-center justify-center shrink-0">
                    <Bot size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === "user"
                      ? "bg-white text-black font-medium shadow-md"
                      : "bg-white/[0.05] border border-white/10 text-white"
                  }`}
                >
                  <p>{m.text}</p>

                  {m.actions && m.actions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-white/10">
                      {m.actions.map((act, i) =>
                        act.href ? (
                          <Link
                            key={i}
                            href={act.href}
                            className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-mono text-white hover:bg-white/20 transition"
                          >
                            {act.label} <ArrowRight size={11} />
                          </Link>
                        ) : (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] text-muted font-mono"
                          >
                            {act.label}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  <span
                    className={`block text-[9px] mt-1.5 font-mono ${
                      m.sender === "user" ? "text-neutral-500 text-right" : "text-muted"
                    }`}
                  >
                    {m.time}
                  </span>
                </div>

                {m.sender === "user" && (
                  <div className="h-8 w-8 rounded-full border border-white/20 bg-neutral-800 text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={14} />}
                  </div>
                )}
              </div>
            ))}

          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
              placeholder="Search the help articles..."
              className="input text-sm flex-1 text-white"
            />
            <button
              type="button"
              onClick={() => handleSendQuery()}
              className="btn-primary px-5 py-2.5 flex items-center gap-1.5 text-xs shrink-0"
            >
              <Send size={14} /> Send
            </button>
          </div>
        </div>

        {/* SECTION 2: Submit a Support Ticket / Problem Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 card p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <AlertTriangle size={18} className="text-white" />
                <h3 className="text-base font-semibold text-white">Log a Problem / Submit Support Ticket</h3>
              </div>
              <span className="text-xs text-muted font-mono">Triage Desk</span>
            </div>

            {ticketSuccessMsg && (
              <div className="rounded-xl border border-white/20 bg-white/10 p-4 text-xs font-mono text-white flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 size={16} className="text-white shrink-0" />
                <span>{ticketSuccessMsg}</span>
              </div>
            )}

            <form id="ticket-form" onSubmit={handleTicketSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted">Issue Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input text-sm text-white bg-neutral-900"
                  >
                    <option value="Website Error / Technical Bug" className="bg-neutral-900 text-white">Website Error / Technical Bug</option>
                    <option value="Contradiction / Conflict" className="bg-neutral-900 text-white">Policy Contradiction / Conflict</option>
                    <option value="Information Gap / Missing Data" className="bg-neutral-900 text-white">Information Gap / Missing Data</option>
                    <option value="Account, Login & Verification" className="bg-neutral-900 text-white">Account, Login & Verification</option>
                    <option value="Officer Dispatch / Urgent Escalation" className="bg-neutral-900 text-white">Officer Dispatch / Urgent Escalation</option>
                    <option value="General Query" className="bg-neutral-900 text-white">General Question</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted">Priority Level</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="input text-sm text-white bg-neutral-900"
                  >
                    <option value="Low" className="bg-neutral-900 text-white">Low (Informational)</option>
                    <option value="Medium" className="bg-neutral-900 text-white">Medium (Standard Triage)</option>
                    <option value="High" className="bg-neutral-900 text-white">High (Impacting Verification)</option>
                    <option value="Critical" className="bg-neutral-900 text-white">Critical (Portal Outage / Deadline Imminent)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Subject / Headline</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mismatch in scholarship eligibility cutoff date between Portal & Circular"
                  className="input text-sm text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Detailed Description & Evidence</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe the exact error or discrepancy, including any relevant official URLs or circular numbers..."
                  className="input text-sm py-2.5 text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted">Contact Email for Updates</label>
                <input
                  type="email"
                  value={ticketEmail}
                  readOnly
                  className="input text-sm text-white"
                />
              </div>

              {ticketError && <p className="text-xs text-red-400" role="alert">{ticketError}</p>}

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-muted">
                  Sign in to submit and track a support ticket.
                </div>
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="btn-primary px-6 py-2.5 text-xs flex items-center gap-2"
                >
                  {submittingTicket ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw size={13} className="animate-spin" /> Submitting...
                    </span>
                  ) : (
                    "Create Support Ticket"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* SECTION 3: Live Ticket Tracker */}
          <div className="card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-white" />
                <h4 className="text-sm font-semibold text-white">Your tickets</h4>
              </div>
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-mono text-muted">
                {tickets.length} Registered
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto">
              {loadingTickets ? (
                <div className="text-xs text-muted font-mono py-4 text-center">Loading ticket queue...</div>
              ) : tickets.length === 0 ? (
                <div className="text-xs text-muted py-6 text-center">No active tickets registered.</div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5 space-y-2 hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-white">{t.id}</span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] font-mono uppercase text-white">
                        {t.priority}
                      </span>
                    </div>

                    <h5 className="text-xs font-medium text-white line-clamp-1">{t.subject}</h5>
                    <p className="text-[11px] text-muted line-clamp-2">{t.description}</p>

                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-muted font-mono">
                      <span className="text-white font-medium">{t.status}</span>
                      <span>{t.created_at ? new Date(t.created_at).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Searchable Website FAQ Knowledge Base */}
        <div id="faq-section" className="card p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-2.5">
              <HelpCircle size={18} className="text-white" />
              <div>
                <h3 className="text-base font-semibold text-white">Searchable Knowledge Base & FAQs</h3>
                <p className="text-xs text-muted">Instant step-by-step answers to the most common platform inquiries.</p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQs & guides..."
                className="input text-xs pl-8 pr-3 text-white"
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-muted" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-white/[0.03] transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white">
                        {faq.category}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-white">{faq.q}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-muted shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-muted shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/5 bg-white/[0.01] p-4 text-xs text-muted leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="text-xs text-muted text-center py-6">
                No matching answers found for &ldquo;{faqSearch}&rdquo;. Try asking our AI Assistant above!
              </div>
            )}
          </div>
        </div>

        {/* Quick Footer Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="space-y-0.5 text-center sm:text-left">
            <div className="text-sm font-medium text-white">Need urgent officer intervention?</div>
            <div className="text-xs text-muted">Field inspections and policy directives are dispatched through the Officer Deck.</div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/officer" className="btn-primary text-xs px-4 py-2">
              Officer Control Deck
            </Link>
            <Link href="/profile" className="btn-ghost text-xs px-4 py-2 text-white">
              Your Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
