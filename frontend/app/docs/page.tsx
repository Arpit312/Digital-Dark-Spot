"use client";

import { useState } from "react";
import {
  BookOpen,
  Code2,
  Cpu,
  Layers,
  ShieldAlert,
  Sparkles,
  Terminal,
  CheckCircle2,
  Copy,
  Check
} from "lucide-react";
import PageHeader from "@/components/PageHeader";

const navSections = [
  { id: "overview", label: "1. Overview & Problem" },
  { id: "agents", label: "2. Multi-Agent Pipeline" },
  { id: "math", label: "3. Mathematical Engines" },
  { id: "labels", label: "4. Verification Taxonomy" },
  { id: "api", label: "5. REST & SSE API Reference" },
  { id: "deployment", label: "6. Campus & Enterprise" }
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="TECHNICAL DOCUMENTATION"
        title="DarkSpot Atlas System Documentation"
        sub="Complete technical specifications for the multi-agent consensus pipeline, mathematical verification formulas, zero-hallucination guardrails, and programmatic REST & SSE streaming APIs."
      />

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Sticky Nav Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 rounded-2xl border border-line bg-card/60 p-4 backdrop-blur-md">
              <div className="text-xs font-mono uppercase tracking-wider text-muted mb-3 flex items-center gap-1.5">
                <BookOpen size={13} />
                Documentation Index
              </div>
              <nav className="space-y-1">
                {navSections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition ${
                      activeSection === s.id
                        ? "bg-white text-black font-semibold"
                        : "text-muted hover:text-fg hover:bg-white/5"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Docs Content */}
          <div className="lg:col-span-9 space-y-10">
            {/* Section 1: Overview */}
            {(activeSection === "overview" || activeSection === "all") && (
              <div id="overview" className="card p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="badge">Section 1</span>
                  <span className="text-xs font-mono text-muted">Core Foundation</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">The Digital Dark Spot Phenomenon</h2>
                <p className="text-sm text-muted leading-relaxed">
                  A <strong>Digital Dark Spot</strong> is the dangerous gap between what public or institutional websites state, what superseded PDFs contradict, and what is critically missing. Citizens and students frequently lose scholarships, miss deadlines, or forfeit rights not because information isn&apos;t published, but because contradictory versions exist simultaneously across un-synchronized portals.
                </p>
                <div className="rounded-xl border border-line bg-card/80 p-4 space-y-2">
                  <h4 className="text-xs font-semibold text-fg uppercase tracking-wider font-mono">Core System Tenets</h4>
                  <ul className="text-xs text-muted space-y-2 list-disc list-inside">
                    <li><strong className="text-fg">Zero-Hallucination Guarantee:</strong> An LLM is never permitted to summarize or state a fact unless the claim can be matched verbatim against indexed source documents with a 100% exact quote character offset.</li>
                    <li><strong className="text-fg">Deterministic Math over Probabilistic Text:</strong> Numeric values, currency thresholds, and calendar dates are extracted into structured tuples and verified by discrete mathematical algorithms, bypassing language model arithmetic errors.</li>
                    <li><strong className="text-fg">Bayesian Adversarial Stress-Testing:</strong> Every identified gap is interrogated by an adversarial red-team agent attempting to locate counter-evidence before it is presented to the user.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Section 2: Multi-Agent Pipeline */}
            {(activeSection === "agents" || activeSection === "all") && (
              <div id="agents" className="card p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="badge">Section 2</span>
                  <span className="text-xs font-mono text-muted">Multi-Agent System</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">The 8-Agent Verification Architecture</h2>
                <p className="text-sm text-muted leading-relaxed">
                  DarkSpot Atlas decomposes the audit workflow across 8 specialized agents working in 4 sequential pipeline phases:
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-line bg-card/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-white">Phase 1: Ingestion</span>
                      <span className="badge text-[10px]">Agent 01 & 02</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold">Tavily Ingestion & PyMuPDF Parser</div>
                    <p className="mt-1 text-xs text-muted">
                      Extracts verified official government domains (.gov.in, .nic.in, .edu) and performs layout-aware PDF OCR on tabular circulars.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-card/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-blue-400">Phase 1: Extraction</span>
                      <span className="badge text-[10px]">Agent 03</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold">Gemini 2.5 Flash Entity Extractor</div>
                    <p className="mt-1 text-xs text-muted">
                      Parses structured tuples (Subject, Numeric Metric, Temporal Condition, Beneficiary Criterion) with strict temperature=0.0.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-card/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-400">Phase 2: Math Audit</span>
                      <span className="badge text-[10px]">Agent 04 & 05</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold">Deterministic Math & Temporal Decay</div>
                    <p className="mt-1 text-xs text-muted">
                      Applies discrete arithmetic comparison to currency/dates and weights sources using half-life exponential decay ($\lambda_a$).
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-card/50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-400">Phase 3 & 4: Adversarial & Gate</span>
                      <span className="badge text-[10px]">Agent 06, 07 & 08</span>
                    </div>
                    <div className="mt-2 text-sm font-semibold">Bayesian Red-Team & Zero-Hallucination Gate</div>
                    <p className="mt-1 text-xs text-muted">
                      Attempts to falsify potential gaps using log-odds, enforces substring character parity, and diversifies outputs via MMR.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Mathematical Formulations */}
            {(activeSection === "math" || activeSection === "all") && (
              <div id="math" className="card p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="badge">Section 3</span>
                  <span className="text-xs font-mono text-muted">Formulas & Theorems</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Mathematical Engines & Scoring Rules</h2>

                <div className="space-y-4">
                  <div className="rounded-xl border border-line bg-card/60 p-5">
                    <h4 className="text-sm font-semibold">1. Contradiction Severity Index (S_conflict)</h4>
                    <div className="my-2 rounded-lg bg-black/50 p-3 font-mono text-xs text-amber-300">
                      S_conflict = w_t * |T_1 - T_2| + w_v * |V_1 - V_2| / max(V_1, V_2) + w_e * (1 - Sim(C_1, C_2))
                    </div>
                    <p className="text-xs text-muted">
                      Evaluates calendar discrepancies ($|T_1 - T_2|$ in days), financial deviations, and condition overlap ($Sim \ge 0.90$).
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-card/60 p-5">
                    <h4 className="text-sm font-semibold">2. Temporal Authority Decay ($\lambda_a$)</h4>
                    <div className="my-2 rounded-lg bg-black/50 p-3 font-mono text-xs text-white">
                      Weight(t) = exp(-lambda_a * (CurrentDate - PublishedDate) / HalfLifeDays)
                    </div>
                    <p className="text-xs text-muted">
                      Penalizes superseded gazettes. A 2024 FAQ carries 0.18 relative authority when a 2026 amendment is published.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-card/60 p-5">
                    <h4 className="text-sm font-semibold">3. Zero-Hallucination Exact Substring Gate</h4>
                    <div className="my-2 rounded-lg bg-black/50 p-3 font-mono text-xs text-blue-300">
                      Assert: RawDocumentContent.slice(startOffset, endOffset) === QuoteString
                    </div>
                    <p className="text-xs text-muted">
                      If the character-level slice does not evaluate to true, the model finding is automatically rejected and dropped from the report.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Verification Taxonomy */}
            {(activeSection === "labels" || activeSection === "all") && (
              <div id="labels" className="card p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="badge">Section 4</span>
                  <span className="text-xs font-mono text-muted">Verification Labels</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Finding Classification Taxonomy</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <span className="badge border-white/20 text-white mt-0.5">Verified Fact</span>
                    <p className="text-xs text-muted">
                      A clear, undisputed rule or cutoff confirmed by canonical government sources with zero contradictory records.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <span className="badge border-amber-500/40 text-amber-400 mt-0.5">Potential Gap</span>
                    <p className="text-xs text-muted">
                      An unanswered critical prerequisite (e.g. income certificate validity period, fee refund mechanism) absent from all reviewed text.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
                    <span className="badge border-red-500/40 text-red-400 mt-0.5">Possible Conflict</span>
                    <p className="text-xs text-muted">
                      Two or more official sources provide irreconcilable dates, amounts, or eligibility criteria for the exact same target entity.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                    <span className="badge border-purple-500/40 text-purple-400 mt-0.5">Possibly Outdated</span>
                    <p className="text-xs text-muted">
                      The document date exceeds the validity horizon (e.g., guidelines from a prior financial cycle un-updated on the current portal).
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: REST & SSE API */}
            {(activeSection === "api" || activeSection === "all") && (
              <div id="api" className="card p-8 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="badge">Section 5</span>
                  <span className="text-xs font-mono text-muted">Developer Integration</span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Programmatic REST & SSE API</h2>

                {/* POST /api/analyze */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-xs font-bold text-white">POST</span>
                      <span className="font-mono text-xs text-fg">/api/analyze</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `curl -X POST http://localhost:8000/api/analyze \\\n  -H "Content-Type: application/json" \\\n  -d '{"question":"What is the deadline for NSP scholarship 2026?","sources":["https://scholarships.gov.in"]}'`,
                          "curl1"
                        )
                      }
                      className="text-xs text-muted hover:text-fg flex items-center gap-1"
                    >
                      {copiedCode === "curl1" ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                      <span>Copy cURL</span>
                    </button>
                  </div>
                  <pre className="rounded-xl border border-line bg-black/60 p-4 font-mono text-xs text-muted overflow-x-auto">
{`// SSE Event Stream from /api/analyze:
data: {"event": "phase", "phase": "Ingestion", "message": "Querying Tavily API for canonical gov domains..."}
data: {"event": "agent_active", "agent_id": "math_audit", "engine": "Deterministic Math"}
data: {"event": "quote_evidence", "finding_id": "f1", "quote": "Application window closes 31 Oct 2026", "match": 1.0}
data: {"event": "done", "analysis_id": "nsp_audit_2026_01"}`}
                  </pre>
                </div>

                {/* GET /api/analysis/{id} */}
                <div className="space-y-3 pt-4 border-t border-line">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-blue-500/20 px-2 py-0.5 font-mono text-xs font-bold text-blue-400">GET</span>
                      <span className="font-mono text-xs text-fg">/api/analysis/&#123;id&#125;</span>
                    </div>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `curl -X GET http://localhost:8000/api/analysis/nsp_audit_2026_01`,
                          "curl2"
                        )
                      }
                      className="text-xs text-muted hover:text-fg flex items-center gap-1"
                    >
                      {copiedCode === "curl2" ? <Check size={12} className="text-white" /> : <Copy size={12} />}
                      <span>Copy cURL</span>
                    </button>
                  </div>
                  <pre className="rounded-xl border border-line bg-black/60 p-4 font-mono text-xs text-muted overflow-x-auto">
{`{
  "id": "nsp_audit_2026_01",
  "question": "What is the deadline for NSP scholarship 2026?",
  "coverage": 0.85,
  "sources": [{"title": "National Scholarship Portal", "url": "scholarships.gov.in", "trust": "A"}],
  "findings": [
    {
      "id": "f_01",
      "type": "conflict",
      "claim": "Deadline differs between homepage and PDF guidelines",
      "quotes": ["31 Oct 2026", "15 Nov 2026"],
      "confidence": 0.98
    }
  ],
  "checklist": ["Verify with college nodal officer before 31 Oct"]
}`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
