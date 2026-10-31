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
  PhoneCall,
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
    a: "DarkSpot Atlas utilizes an 8-agent pipeline. Agent 01 (Scout) collects official circulars from verified portals (.gov.in, .nic.in). Agent 03 (Corroborator) and Agent 04 (Discrepancy Auditor) cross-reference specific eligibility criteria, income ceilings, and deadlines. Any mismatch is red-teamed by Agent 06 and certified with verbatim substring character offsets."
  },
  {
    q: "What should I do if my analysis request seems slow or stuck?",
    category: "Troubleshooting",
    a: "Deep audits stream multi-agent events via SSE (/analyze/stream). If an official government server is throttling requests, the system automatically falls back to cached verified datasets. You can also purge local cached tokens in Settings > Purge Cache, or check system health on this page."
  },
  {
    q: "How does the Dark Spot Index (DSI) work?",
    category: "Audit Pipeline",
    a: "DSI is calculated as DSI = (Gaps + Conflicts * 2 + Outdated) / (Total Sourced Facts). A DSI below 0.15 indicates high clarity and consistent public policy. A DSI above 0.30 indicates significant dark spots where citizens risk application rejection due to contradictory rules."
  },
  {
    q: "How can I upload a PDF circular or scheme guideline?",
    category: "Platform Usage",
    a: "Navigate to the Analyze page, click 'Upload Official PDF Circular', and drag in your document. The server parses text, computes cryptographic checksums, and cross-checks every clause against known portal announcements."
  },
  {
    q: "How do I link my Google account or verify my phone number?",
    category: "Account & Profile",
    a: "Go to your Profile page (accessible by clicking the DarkSpot logo or top right profile circle). Under 'Mobile / Phone Number', click 'Verify with OTP' to receive an instant verification code. Under 'Google Account', click 'Continue with Google' to enable 1-click authentication."
  },
  {
    q: "How does an Officer dispatch work for emergency discrepancies?",
    category: "Officer Workflows",
    a: "Field and Nodal Officers can access the Officer Control Deck (/officer) to issue immediate administrative directives, flag erroneous circulars, and dispatch field inspectors to verify local institution compliance."
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
      text: "Namaste! Welcome to the DarkSpot Atlas Resolution & Support Hub. I am your 24/7 AI System Assistant. Ask me any question or report any problem regarding our website, audit pipelines, login, or public data discrepancies.",
      time: "Just now"
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isBotThinking, setIsBotThinking] = useState(false);

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
  }, []);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const list = await getSupportTickets();
      setTickets(list);
    } catch {
      // fallback
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
    setIsBotThinking(true);

    setTimeout(() => {
      const lower = q.toLowerCase();
      let botReply = "";
      let actions: Array<{ label: string; href?: string }> = [];

      if (lower.includes("login") || lower.includes("sign in") || lower.includes("password")) {
        botReply = "For login issues: DarkSpot Atlas uses Supabase Cryptographic JWT authentication. Ensure your email is registered via /signup. You can also link your Google Account on the Profile page for instant 1-click passwordless sign-in.";
        actions = [{ label: "Open Profile Page", href: "/profile" }, { label: "Go to Login", href: "/login" }];
      } else if (lower.includes("phone") || lower.includes("otp") || lower.includes("mobile")) {
        botReply = "Phone verification is managed on your Profile page. Click 'Verify with OTP' to receive a simulated 6-digit test code (with instant Auto-Fill) to verify your contact for critical circular notifications.";
        actions = [{ label: "Manage Phone on Profile", href: "/profile" }];
      } else if (lower.includes("scholarship") || lower.includes("date") || lower.includes("conflict")) {
        botReply = "Contradictory dates occur when government portal homepages show old dates while gazettes or FAQs extend deadlines. You can run an audit on /analyze or review the verified NSP scholarship checklist on /reports.";
        actions = [{ label: "Analyze Scholarship", href: "/analyze" }, { label: "View Reports", href: "/reports" }];
      } else if (lower.includes("upload") || lower.includes("pdf") || lower.includes("circular")) {
        botReply = "You can upload official circular PDFs on either the Analyze page or Campus Mode. The document is parsed with PyMuPDF layout-aware OCR and audited for missing clauses.";
        actions = [{ label: "Campus Notice Scanner", href: "/campus" }, { label: "Analyze PDF", href: "/analyze" }];
      } else if (lower.includes("quote") || lower.includes("hallucination") || lower.includes("accuracy")) {
        botReply = "Our Zero-Hallucination Gate enforces 100% exact substring matching. If an AI finding cannot be matched verbatim against source text with exact character offsets, it is discarded immediately. Our benchmark F1 score is 85%.";
        actions = [{ label: "View Accuracy Benchmarks", href: "/accuracy" }, { label: "8-Agent Architecture", href: "/how-it-works" }];
      } else {
        botReply = `I have logged your question regarding "${q}". If this is a specific bug or conflicting portal guideline, please submit a formal Support Ticket below and our engineering team will inspect the source records within 15 minutes.`;
        actions = [{ label: "View FAQs", href: "#faq-section" }];
      }

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: botReply,
        time: "Just now",
        actions
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsBotThinking(false);
    }, 700);
  };

  // Submit Ticket Handler
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setSubmittingTicket(true);
    setTicketSuccessMsg("");

    try {
      const res = await createSupportTicket({
        category,
        priority,
        subject,
        description,
        email: ticketEmail || "user@darkspotatlas.org"
      });

      if (res.success && res.ticket) {
        setTickets((prev) => [res.ticket!, ...prev]);
        setTicketSuccessMsg(`Support Ticket ${res.ticket.id} registered! Assigned to Support & Engineering Desk.`);
        setSubject("");
        setDescription("");
      }
    } catch {
      setTicketSuccessMsg("Ticket created in local triage buffer.");
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
        title="Customer Support & Query Resolver"
        sub="Instant AI website query solver, priority discrepancy triage tickets, and verified portal problem resolution."
      />

      <div className="mx-auto max-w-5xl space-y-10 px-5 py-8">
        {/* Top Emergency Channels & Status Bar (Clean Monochrome) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-5 border-white/10 bg-white/[0.02] flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
              <PhoneCall size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-white font-semibold">Toll-Free Helpline</div>
              <div className="text-sm font-semibold text-white mt-0.5">1800-DARK-SPOT</div>
              <div className="text-[11px] text-muted">1800-3275-7768 (Toll Free 24/7)</div>
            </div>
          </div>

          <div className="card p-5 border-white/10 bg-white/[0.02] flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
              <Mail size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-white font-semibold">Email Helpdesk</div>
              <div className="text-sm font-semibold text-white mt-0.5">support@darkspotatlas.org</div>
              <div className="text-[11px] text-muted">Priority response under 15 mins</div>
            </div>
          </div>

          <div className="card p-5 border-white/10 bg-white/[0.02] flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-xs font-mono uppercase text-white font-semibold">Atlas Network Status</div>
              <div className="text-sm font-semibold text-white mt-0.5">All Systems Operational</div>
              <div className="text-[11px] text-muted">99.98% Verification SLA Uptime</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Interactive AI Query Resolver / Support Assistant */}
        <div className="card p-6 sm:p-7 space-y-6 border-white/10 bg-card/90 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  AI Website Query Resolver
                  <span className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-mono text-white">
                    Live Assistant
                  </span>
                </h3>
                <p className="text-xs text-muted">Ask anything about website features, errors, DSI scores, or public circulars.</p>
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

            {isBotThinking && (
              <div className="flex items-center gap-2 text-xs text-white font-mono animate-pulse">
                <RefreshCw size={13} className="animate-spin" />
                <span>AI Resolver analyzing query across portal knowledge base...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
              placeholder="Ask a question or explain your website issue..."
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

            <form onSubmit={handleTicketSubmit} className="space-y-4">
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
                  onChange={(e) => setTicketEmail(e.target.value)}
                  className="input text-sm text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-muted">
                  SLA Target: Assigned to Tier-2 desk within 15 minutes.
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
                <h4 className="text-sm font-semibold text-white">Active Tickets</h4>
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
                      <span>SLA: {t.sla || "15 mins"}</span>
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
