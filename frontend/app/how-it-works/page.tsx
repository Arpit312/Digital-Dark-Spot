"use client";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SpotlightCard from "@/components/SpotlightCard";
const steps = [["Source Scout", "Ranks sources by trust tier: official, institution, news, blog."], ["Extraction", "Turns each source into claims with exact quotes."], ["Normalization", "Dates, amounts and lists become comparable by code."], ["Conflict and Gap", "Compares claims and checks what is expected but missing."], ["Freshness", "Flags expired deadlines and earlier cycles."], ["Challenger", "Tries to refute every finding."], ["Evidence Auditor", "Blocks any finding without a valid quote."], ["Planner", "Ranks what you should verify next."]];
export default function How() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 50%"] });
  return (
    <div>
      <PageHeader eyebrow="HOW IT WORKS" title="Eight agents, audited at every step." />
      <div ref={ref} className="relative mx-auto max-w-3xl px-5 py-16">
        <div className="absolute bottom-16 left-[34px] top-16 w-px bg-line"><motion.div className="h-full w-px origin-top bg-fg" style={{ scaleY: scrollYProgress }} /></div>
        {steps.map(([t, d], i) => <Reveal key={t} className="relative mb-10 pl-14"><span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-line-strong bg-bg font-mono text-xs">{i + 1}</span><h3 className="text-lg font-medium">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></Reveal>)}
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 px-5 pb-20 md:grid-cols-2">
        <SpotlightCard><div className="text-sm font-medium">Trust score</div><code className="mt-4 block font-mono text-sm text-muted">T = 0.40D + 0.20A + 0.25F + 0.15Q</code></SpotlightCard>
        <SpotlightCard><div className="text-sm font-medium">Conflict severity</div><code className="mt-4 block font-mono text-sm text-muted">Sev = P(con) x w(attr) x (T1 + T2) / 2</code></SpotlightCard>
        <SpotlightCard className="md:col-span-2"><div className="text-sm font-medium">Limits</div><p className="mt-2 text-sm text-muted">Only the sources you add are reviewed. Findings are potential gaps. Always confirm on the official source.</p></SpotlightCard>
      </div>
    </div>
  );
}
