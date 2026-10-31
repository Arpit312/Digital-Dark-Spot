"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  FileSearch,
  ArrowLeftRight,
  CircleDashed,
  Clock,
  ShieldAlert,
  ShieldCheck,
  ListChecks,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  BrainCircuit
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";

interface DetailedAgent {
  id: string;
  number: string;
  name: string;
  phase: string;
  model: string;
  summary: string;
  formula: string;
  formulaName: string;
  inputs: string[];
  outputs: string[];
  hallucinationGuard: string;
  icon: any;
}

const AGENTS: DetailedAgent[] = [
  {
    id: "scout",
    number: "01",
    name: "Source Scout",
    phase: "Phase 1: Ingestion & Perception",
    model: "Tavily Live API + PyMuPDF Ingestion",
    summary: "Discovers and ingests primary public sources, including official .gov.in circulars, university portal guidelines, PDFs, and citizen charters. Ranks each domain by its intrinsic Trust Tier.",
    formulaName: "Domain Trust Scoring",
    formula: "T(s) = 0.40 · DomainTier + 0.20 · Authoritativeness + 0.25 · Freshness + 0.15 · Quality",
    inputs: ["User question or policy topic", "Provided portal URLs or uploaded PDF guidelines"],
    outputs: ["Normalized text chunks with SHA-256 hashes", "Categorized domain trust coefficient (0.0 – 1.0)"],
    hallucinationGuard: "Restricts retrieval to verified public domains and extracts raw bytes via PyMuPDF without LLM summarization tampering.",
    icon: Globe
  },
  {
    id: "extractor",
    number: "02",
    name: "Claim Extractor",
    phase: "Phase 1: Ingestion & Perception",
    model: "Google Gemini 2.5 Flash",
    summary: "Decomposes unstructured guidelines into structured atomic claims across expected domain attributes (eligibility, income limits, deadlines, renewal, documents).",
    formulaName: "Levenshtein Quote Gating",
    formula: "sim(quote, source_text) = 1 - (Levenshtein(a, b) / max(|a|, |b|)) ≥ 0.90",
    inputs: ["Raw ingested source text chunks", "Expected attribute template (Scholarship, Admission, Scheme)"],
    outputs: ["Atomic claims tagged with verbatim substring quote, page number, and source SHA-256"],
    hallucinationGuard: "Quote Gate: If the extracted quote does not match an exact substring in the source text (≥90% similarity), the claim is discarded.",
    icon: FileSearch
  },
  {
    id: "conflict",
    number: "03",
    name: "Conflict Detector",
    phase: "Phase 2: Mathematical Audit",
    model: "Deterministic Python AST + Logic Engine",
    summary: "Compares claims across sources for the same attribute using code-driven arithmetic. Converts dates to ISO-8601 and financial figures into uniform integers (₹ Lakh to numeric).",
    formulaName: "Conflict Severity Index",
    formula: "Severity = P(conflict) · Weight(attribute) · ((Trust_1 + Trust_2) / 2)",
    inputs: ["Normalized claims from multiple sources for identical attributes"],
    outputs: ["Documented conflicts with conflicting verbatim quotes and severity scores"],
    hallucinationGuard: "Pure deterministic algorithm: zero LLM interpretation is used to determine whether 15 November differs from 30 November.",
    icon: ArrowLeftRight
  },
  {
    id: "gap",
    number: "04",
    name: "Gap Finder",
    phase: "Phase 2: Mathematical Audit",
    model: "DSI (Dark Spot Index) Algorithmic Matrix",
    summary: "Identifies what crucial information is missing. Cross-references mandatory policy requirements (such as hostel fee refund or renewal attendance) against reviewed pages.",
    formulaName: "Dark Spot Index & Coverage",
    formula: "Gap_a = 1 - max_s [ P(a | claim_s) · T(s) ],   DSI = 1 - (Σ w_a(1 - Gap_a) / Σ w_a)",
    inputs: ["Expected topic template schema", "Set of extracted valid claims"],
    outputs: ["Gaps catalogued as 'Not Found in Reviewed Sources'", "Coverage percentage"],
    hallucinationGuard: "Abstain Protocol: Rather than hallucinating an answer, the agent explicitly flags missing requirements as 'unanswered in sources'.",
    icon: CircleDashed
  },
  {
    id: "freshness",
    number: "05",
    name: "Freshness Radar",
    phase: "Phase 2: Mathematical Audit",
    model: "Exponential Decay Engine + Cycle Parser",
    summary: "Detects outdated circulars by checking publication dates, academic cycle references (e.g., 2023-24 vs 2026), and temporal expiry half-lives.",
    formulaName: "Exponential Temporal Decay",
    formula: "F(s, a) = exp(-λ_a · Δt),   where λ_a = ln(2) / HalfLife_a",
    inputs: ["Publication timestamps", "Cycle years found in headings and text"],
    outputs: ["Staleness ratings and superseded notice alerts"],
    hallucinationGuard: "Detects prior academic year markers and hard-flags superseded circulars without guessing.",
    icon: Clock
  },
  {
    id: "challenger",
    number: "06",
    name: "Challenger Agent",
    phase: "Phase 3: Adversarial Verification",
    model: "Bayesian Red-Team Agent",
    summary: "Acts as a devil's advocate. For every potential gap or conflict found by previous agents, the Challenger tries to disprove it by searching for counter-evidence.",
    formulaName: "Bayesian Log-Odds Update",
    formula: "logit(P_final) = logit(P_prior) + Σ log(LikelihoodRatio_i)",
    inputs: ["Candidate gap and conflict findings", "All ingested document chunks"],
    outputs: ["Challenged findings filtered or verified with adjusted confidence"],
    hallucinationGuard: "Eliminates false positives by actively seeking counter-arguments before user presentation.",
    icon: ShieldAlert
  },
  {
    id: "auditor",
    number: "07",
    name: "Evidence Auditor",
    phase: "Phase 3: Adversarial Verification",
    model: "Zero-Hallucination Gatekeeper",
    summary: "The final safety firewall. Verifies every claim against raw unparsed documents. If a finding contains any text not backed by an exact verbatim quote, it is deleted.",
    formulaName: "Faithfulness Verification Ratio",
    formula: "Faithfulness = Count(Verbatim Verified Claims) / Total Admitted Claims = 1.0 (100%)",
    inputs: ["Candidate findings from Challenger Agent", "Raw source byte arrays"],
    outputs: ["Quote-audited final finding records"],
    hallucinationGuard: "Non-negotiable rule: 0 quotes = 0 admission. If evidence cannot be highlighted in the source PDF, the finding is suppressed.",
    icon: ShieldCheck
  },
  {
    id: "planner",
    number: "08",
    name: "Verify-Next Planner",
    phase: "Phase 4: Decision & Synthesis",
    model: "MMR (Maximal Marginal Relevance) Diversity Algorithm",
    summary: "Translates technical audit findings into a student-friendly, actionable checklist. Ranks items by risk severity, uncertainty, and upcoming deadlines with direct official links.",
    formulaName: "Verify-Next Priority Matrix",
    formula: "Priority = Impact · Uncertainty · Urgency,   MMR(d) = λ·Sim(d, Q) - (1-λ)·max Sim(d, d_j)",
    inputs: ["Audited findings", "Source metadata"],
    outputs: ["Actionable, checkbox-style verification checklist (High, Medium, Low)"],
    hallucinationGuard: "Provides official portal links for every item, directing the student directly to the authority.",
    icon: ListChecks
  }
];

export default function HowItWorks() {
  const [selectedPhase, setSelectedPhase] = useState<string>("All");

  const filteredAgents =
    selectedPhase === "All"
      ? AGENTS
      : AGENTS.filter((a) => a.phase.includes(selectedPhase));

  return (
    <div>
      <PageHeader
        eyebrow="MULTI-AGENT ARCHITECTURE"
        title="Eight agents. Audited at every single step."
        sub="How DarkSpot Atlas replaces AI guesswork with a 4-phase multi-agent pipeline governed by deterministic math and strict quote gating."
      />

      <div className="mx-auto max-w-7xl px-5 py-12">
        {/* Phase Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-12">
          {["All", "Phase 1", "Phase 2", "Phase 3", "Phase 4"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPhase(p)}
              className={`rounded-full px-5 py-2 text-xs font-medium transition ${
                selectedPhase === p
                  ? "bg-white text-black font-semibold shadow-md"
                  : "border border-line bg-surface text-muted hover:border-white/30 hover:text-fg"
              }`}
            >
              {p === "All"
                ? "All 8 Agents"
                : p === "Phase 1"
                ? "Phase 1: Ingestion & Perception"
                : p === "Phase 2"
                ? "Phase 2: Math Audit"
                : p === "Phase 3"
                ? "Phase 3: Adversarial Red-Team"
                : "Phase 4: Strategy"}
            </button>
          ))}
        </div>

        {/* Agents Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={agent.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="card flex flex-col justify-between p-7 border border-line hover:border-white/20 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-white/[0.04] text-white">
                        <Icon size={18} strokeWidth={1.5} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-subtle">
                            AGENT {agent.number}
                          </span>
                          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-400 border border-white/5">
                            {agent.model}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight text-fg mt-0.5">
                          {agent.name}
                        </h3>
                      </div>
                    </div>
                    <span className="badge text-[11px] shrink-0 font-medium">{agent.phase.split(":")[0]}</span>
                  </div>

                  <p className="mt-4 text-sm text-muted leading-relaxed">
                    {agent.summary}
                  </p>

                  {/* Math Formula Card */}
                  <div className="mt-5 rounded-xl border border-line-strong bg-surface p-4 font-mono text-xs">
                    <div className="text-[11px] text-subtle mb-1.5 uppercase tracking-wider font-semibold">
                      Mathematical Engine · {agent.formulaName}
                    </div>
                    <div className="text-zinc-200 overflow-x-auto py-1">
                      {agent.formula}
                    </div>
                  </div>

                  {/* Inputs / Outputs */}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-lg border border-line p-3 bg-surface/50">
                      <div className="text-subtle font-medium mb-1">Inputs</div>
                      <ul className="space-y-1 text-muted">
                        {agent.inputs.map((inp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-zinc-500">•</span>
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-lg border border-line p-3 bg-surface/50">
                      <div className="text-subtle font-medium mb-1">Verified Outputs</div>
                      <ul className="space-y-1 text-muted">
                        {agent.outputs.map((out, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-white">•</span>
                            <span>{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Hallucination Gate */}
                <div className="mt-6 border-t border-line pt-4 flex items-start gap-2.5 text-xs text-subtle">
                  <ShieldCheck size={16} className="text-white shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-300">Zero-Hallucination Gate:</strong>{" "}
                    {agent.hallucinationGuard}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Architectural Principles Section */}
        <div className="mt-20 border-t border-line pt-16">
          <Reveal>
            <h2 className="text-2xl font-bold tracking-tight md:text-4xl text-center">
              The 3 Non-Negotiable Engineering Pillars
            </h2>
            <p className="mt-3 text-center text-sm text-muted max-w-xl mx-auto">
              How DarkSpot Atlas protects students and applicants against LLM hallucinations.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <SpotlightCard>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-white/5 mb-5 text-fg">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="text-lg font-semibold">100% Verbatim Quote Proof</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Every admitted finding is mathematically tethered to an exact substring in the source document. If a finding cannot be quoted, it is permanently discarded.
              </p>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-white/5 mb-5 text-fg">
                <BrainCircuit size={20} />
              </div>
              <h3 className="text-lg font-semibold">Deterministic Math</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Dates, ₹ limits, deadlines, and percentages are compared using deterministic Python code. AI is never trusted to perform date subtraction or numeric logic.
              </p>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-white/5 mb-5 text-fg">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-lg font-semibold">Adversarial Challenger</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                A second independent AI agent actively attempts to disprove every gap and conflict found, ensuring that only rock-solid findings reach your report.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}
