"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleDashed,
  ArrowLeftRight,
  Clock,
  CircleHelp,
  CheckCircle2,
  X,
  Check,
  ExternalLink,
  Loader2,
  FileText,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { getAnalysis, type AnalysisResult, type Finding } from "@/lib/api";

const meta: Record<string, [any, string, string]> = {
  gap: [CircleDashed, "Potential gap", "border-dashed text-amber-400"],
  conflict: [ArrowLeftRight, "Possible conflict", "border-solid text-red-400"],
  outdated: [Clock, "Possibly outdated", "border-dotted text-purple-400"],
  unanswered: [CircleHelp, "Unanswered", "border-solid text-blue-400"],
  sourced_fact: [CheckCircle2, "Verified fact", "border-solid text-emerald-400"]
};

const tabs = ["All", "Gaps", "Conflicts", "Outdated", "Checklist", "Sources"];

export default function ReportPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [sel, setSel] = useState<Finding | null>(null);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const res = await getAnalysis(params.id);
        if (active) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load analysis:", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-5">
        <Loader2 size={36} className="animate-spin text-muted" />
        <p className="mt-4 text-sm text-muted">Retrieving audit evidence & report...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-20 text-center">
        <h2 className="text-2xl font-bold">Report not found</h2>
        <p className="mt-2 text-muted">We could not locate this analysis report.</p>
        <Link href="/analyze" className="btn-primary mt-6 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> New Analysis
        </Link>
      </div>
    );
  }

  const findingsList = data.findings || [];
  const checklistList = data.checklist || [];
  const sourcesList = data.sources || [];

  const list = findingsList.filter((f) => {
    if (tab === "All") return true;
    if (tab === "Gaps") return f.type === "gap" || f.type === "unanswered";
    if (tab === "Conflicts") return f.type === "conflict";
    if (tab === "Outdated") return f.type === "outdated";
    return true;
  });

  const coveragePct = Math.round(
    data.coverage > 1 ? data.coverage : (data.coverage || 0) * 100
  );

  const gapCount =
    data.summary_counts?.gaps ??
    findingsList.filter((f) => f.type === "gap" || f.type === "unanswered").length;

  const conflictCount =
    data.summary_counts?.conflicts ??
    findingsList.filter((f) => f.type === "conflict").length;

  const outdatedCount =
    data.summary_counts?.outdated ??
    findingsList.filter((f) => f.type === "outdated").length;

  const checklistPct = checklistList.length
    ? Math.round((done.length / checklistList.length) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold tracking-widest text-subtle">
          AUDIT REPORT · {data.id.slice(0, 8)}
        </div>
        <Link
          href="/analyze"
          className="text-xs text-muted transition hover:text-fg hover:underline"
        >
          ← New analysis
        </Link>
      </div>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
        {data.question}
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Coverage", `${coveragePct}%`],
          ["Gaps", String(gapCount)],
          ["Conflicts", String(conflictCount)],
          ["Outdated", String(outdatedCount)],
        ].map(([l, v]) => (
          <div key={l} className="card p-5">
            <div className="text-xs text-muted">{l}</div>
            <div className="mt-1 text-2xl font-semibold">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-1 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative px-4 py-3 text-sm ${
              tab === t ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="tab"
                className="absolute inset-x-0 -bottom-px h-px bg-fg"
              />
            )}
          </button>
        ))}
      </div>

      {tab === "Sources" ? (
        <div className="mt-6 space-y-3">
          {sourcesList.length === 0 ? (
            <div className="card p-8 text-center text-sm text-muted">
              No sources listed for this analysis.
            </div>
          ) : (
            sourcesList.map((s, i) => (
              <div
                key={i}
                className="card flex items-center justify-between p-4 text-sm"
              >
                <div>
                  <div className="font-medium">{s.title || s.domain || s.url}</div>
                  <div className="text-xs text-muted">{s.url}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge">Tier {s.tier ?? 1}</span>
                  {s.url && s.url.startsWith("http") && (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-fg"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : tab === "Checklist" ? (
        <div className="mt-6">
          <div className="mb-4 h-1 overflow-hidden rounded bg-line">
            <motion.div
              className="h-1 bg-fg"
              animate={{ width: `${checklistPct}%` }}
            />
          </div>
          {checklistList.length === 0 ? (
            <div className="card p-8 text-center text-sm text-muted">
              No verification checklist items generated.
            </div>
          ) : (
            checklistList.map((c) => {
              const on = done.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() =>
                    setDone(
                      on ? done.filter((x) => x !== c.id) : [...done, c.id]
                    )
                  }
                  className="card mb-2 flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/[0.02]"
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded border ${
                      on ? "border-fg bg-fg text-bg" : "border-line-strong"
                    }`}
                  >
                    {on && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span
                    className={`flex-1 text-sm ${
                      on ? "text-subtle line-through" : ""
                    }`}
                  >
                    {c.text}
                  </span>
                  <span className="badge">{c.p}</span>
                </button>
              );
            })
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {list.length === 0 ? (
            <div className="card p-8 text-center text-sm text-muted">
              No findings of this type detected in reviewed sources.
            </div>
          ) : (
            list.map((f, i) => {
              const metaEntry = meta[f.type] || [
                CircleDashed,
                f.type,
                "border-solid",
              ];
              const [IconComponent, label, borderStyle] = metaEntry;
              const hasEvidence = f.evidence && f.evidence.length > 0;

              return (
                <motion.button
                  key={f.id || i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSel(f)}
                  className={`card flex w-full gap-4 border ${borderStyle} border-line-strong p-5 text-left transition hover:bg-white/[0.03]`}
                >
                  <IconComponent
                    size={18}
                    strokeWidth={1.5}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{f.title}</div>
                    <p className="mt-1 text-sm text-muted">{f.statement}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-subtle">
                      <span className="badge">{label}</span>
                      <span>
                        {hasEvidence
                          ? `${f.evidence.length} quote evidence`
                          : "Not found in sources reviewed"}
                      </span>
                      {f.confidence !== undefined && (
                        <span className="ml-auto font-mono">
                          {Math.round(f.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      )}

      <p className="mt-10 text-xs text-subtle">
        AI findings are audited against verbatim source text. Always verify on official portal notices before high-stakes decisions.
      </p>

      <AnimatePresence>
        {sel && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSel(null)}
            />
            <motion.aside
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-auto border-l border-line bg-surface p-6 shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck size={16} className="text-emerald-400" />
                  Verbatim Source Evidence
                </div>
                <button onClick={() => setSel(null)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              <h3 className="mt-6 text-lg font-medium">{sel.title}</h3>
              <p className="mt-1 text-sm text-muted">{sel.statement}</p>

              {(!sel.evidence || sel.evidence.length === 0) && (
                <div className="card mt-6 p-4 text-sm text-muted">
                  Not found in the sources reviewed. The sources do not specify this requirement. Check the latest official notice.
                </div>
              )}

              {sel.evidence &&
                sel.evidence.map((e, idx) => (
                  <div key={idx} className="mt-5">
                    <div className="rounded-lg border border-line bg-card p-4 font-mono text-[13px] leading-relaxed">
                      &ldquo;{e.quote}&rdquo;
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted">
                      <span>
                        {e.source} {e.tier ? `· Tier ${e.tier}` : ""}{" "}
                        {e.location ? `· ${e.location}` : ""}
                      </span>
                      {e.url && e.url.startsWith("http") && (
                        <a
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-fg"
                        >
                          Open <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
