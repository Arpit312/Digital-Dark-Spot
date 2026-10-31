"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { ArrowRight, CircleDashed, ArrowLeftRight, Clock } from "lucide-react";
import WordReveal from "@/components/WordReveal";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import SpotlightCard from "@/components/SpotlightCard";
import CountUp from "@/components/CountUp";
const steps = [["Add sources", "Paste URLs, upload PDFs or search permitted sources."], ["Extract claims", "Every source is split into claims with exact quotes."], ["Compare", "Numbers and dates are checked by code, wording by an NLI model."], ["Challenge", "A second agent tries to disprove each finding."], ["Verify next", "You get a prioritized checklist with official links."]];
const agents = ["Source Scout", "Extraction", "Conflict Detector", "Gap Finder", "Freshness", "Challenger", "Evidence Auditor", "Planner"];
const faq = [["Is this a chatbot?", "No. It audits sources for gaps, conflicts and outdated details, with evidence for every finding."], ["Can it be wrong?", "Yes. Findings are labelled as potential gaps. Always confirm on the official source."], ["What if nothing is found?", "It says not found in the sources reviewed instead of guessing."]];
const problems = [[CircleDashed, "Missing", "The renewal rule is nowhere in the pages you read."], [ArrowLeftRight, "Conflicting", "Two sources list different documents."], [Clock, "Outdated", "A page still shows last year's deadline."]] as const;
export default function Home() {
  const sticky = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sticky, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(steps.length - 1, Math.floor(v * steps.length))));
  const { scrollYProgress: tp } = useScroll({ target: track, offset: ["start end", "end start"] });
  const x = useTransform(tp, [0, 1], ["12%", "-45%"]);
  const { scrollY } = useScroll();
  const rot = useTransform(scrollY, [0, 1000], [0, 90]);
  return (
    <div>
      <section className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-5 text-center">
        <motion.svg style={{ rotate: rot }} className="pointer-events-none absolute -z-0 opacity-[0.04]" width="640" height="640" viewBox="0 0 28 28" fill="none">
          <rect x="3.5" y="5.5" width="21" height="3.2" rx="1.6" fill="#fff" />
          <rect x="3.5" y="12.4" width="7.2" height="3.2" rx="1.6" fill="#fff" />
          <rect x="17.3" y="12.4" width="7.2" height="3.2" rx="1.6" fill="#fff" />
          <rect x="3.5" y="19.3" width="21" height="3.2" rx="1.6" fill="#fff" />
        </motion.svg>
        <div className="relative z-10 max-w-3xl">
          <Reveal y={10}><span className="badge mb-6">Digital Dark Spot</span></Reveal>
          <WordReveal text="Find what your sources forgot to tell you." className="h-display" />
          <Reveal delay={0.4}><p className="mx-auto mt-6 max-w-xl text-lg text-muted">Add the pages and PDFs you rely on. Get the gaps, conflicts and outdated details, each with its evidence, and a checklist of what to verify next.</p></Reveal>
          <Reveal delay={0.55}>
            <form action="/analyze" className="mx-auto mt-9 flex max-w-xl gap-2">
              <input name="q" className="input h-12" placeholder="What should I verify before applying for this scholarship?" />
              <button className="btn-primary h-12 px-5">Analyze <ArrowRight size={16} /></button>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2">{["Scholarship", "Admission", "Government scheme", "Loan"].map((c) => <Link key={c} href={`/analyze?topic=${c}`} className="badge hover:border-white/40 hover:text-fg">{c}</Link>)}</div>
          </Reveal>
        </div>
      </section>
      <section className="border-y border-line py-6"><Marquee items={["Official PDFs", "Circulars", "FAQs", "Citizen charters", "Notices", "Portals", "News", "Blogs"]} /></section>
      <section className="mx-auto max-w-6xl px-5 py-28">
        <Reveal><h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Search finds. Summaries shorten.<br /><span className="text-muted">Nobody tells you what is missing.</span></h2></Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">{problems.map(([I, t, d], i) => <Reveal key={t} delay={i * 0.1}><SpotlightCard><I size={22} strokeWidth={1.5} /><h3 className="mt-6 text-lg font-medium">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></SpotlightCard></Reveal>)}</div>
      </section>
      <section ref={sticky} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 md:grid-cols-2">
            <div className="space-y-2">
              <div className="mb-6 text-sm text-subtle">How it works</div>
              {steps.map(([t], i) => <div key={t} className={`flex items-center gap-4 transition-all duration-500 ${i === active ? "opacity-100" : "opacity-30"}`}><span className="font-mono text-xs text-muted">0{i + 1}</span><span className="text-3xl font-semibold tracking-tight md:text-4xl">{t}</span></div>)}
            </div>
            <div className="card relative flex min-h-[260px] items-center p-8">
              <motion.div key={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="font-mono text-xs text-subtle">STEP 0{active + 1}</div>
                <p className="mt-3 text-2xl font-medium leading-snug">{steps[active][1]}</p>
              </motion.div>
              <div className="absolute inset-x-0 bottom-0 h-px bg-line"><motion.div className="h-px origin-left bg-fg" style={{ scaleX: scrollYProgress }} /></div>
            </div>
          </div>
        </div>
      </section>
      <section ref={track} className="overflow-hidden py-24">
        <div className="mx-auto mb-10 max-w-6xl px-5"><Reveal><h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Eight agents. One audited answer.</h2></Reveal></div>
        <motion.div style={{ x }} className="flex w-max gap-4 px-5">{agents.map((a, i) => <SpotlightCard key={a} className="w-64"><div className="font-mono text-xs text-subtle">AGENT {String(i + 1).padStart(2, "0")}</div><div className="mt-10 text-xl font-medium">{a}</div></SpotlightCard>)}</motion.div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-20 md:grid-cols-3">
        {[[8, "", "AI agents in the pipeline"], [4, "", "finding types, each with a label"], [100, "%", "of findings carry an evidence quote (by design)"]].map(([n, s, l]) => <Reveal key={String(l)}><div className="card p-8"><div className="text-5xl font-semibold tracking-tight"><CountUp to={n as number} suffix={s as string} /></div><p className="mt-3 text-sm text-muted">{l}</p></div></Reveal>)}
      </section>
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="mb-8 text-3xl font-semibold tracking-tight">Questions</h2>
        {faq.map(([q, a]) => <details key={q} className="group border-b border-line py-5"><summary className="flex cursor-pointer list-none items-center justify-between text-left font-medium">{q}<span className="text-muted transition group-open:rotate-45">+</span></summary><p className="mt-3 text-sm text-muted">{a}</p></details>)}
      </section>
      <section className="relative overflow-hidden border-t border-line py-28 text-center"><div className="dot-grid absolute inset-0 opacity-60" /><Reveal className="relative"><h2 className="h-display text-4xl md:text-6xl">Light up the dark spots.</h2><Link href="/analyze" className="btn-primary mt-8 px-6 py-3">Start an analysis <ArrowRight size={16} /></Link></Reveal></section>
    </div>
  );
}
