"use client";
import { motion } from "framer-motion";
import PageHeader from "@/components/PageHeader";
import CountUp from "@/components/CountUp";
const m: [string, number, string][] = [["Precision", 84, "%"], ["Recall", 79, "%"], ["F1", 81, "%"], ["Evidence faithfulness", 100, "%"]];
const abl: [string, number][] = [["Pipeline without Challenger", 71], ["+ Challenger", 78], ["+ Evidence Auditor", 81]];
const rows = [["Gaps", "86", "80"], ["Conflicts", "88", "82"], ["Outdated", "79", "75"]];
export default function Accuracy() {
  return (
    <div>
      <PageHeader eyebrow="ACCURACY" title="Measured, not claimed." sub="Results on our labelled gold set. Numbers below are SAMPLE placeholders until the final evaluation run." />
      <div className="mx-auto max-w-6xl space-y-6 px-5 py-10">
        <div className="grid gap-3 md:grid-cols-4">{m.map(([l, v, s]) => <div key={l} className="card p-6"><div className="text-xs text-muted">{l}</div><div className="mt-2 text-4xl font-semibold tracking-tight"><CountUp to={v} suffix={s} /></div></div>)}</div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6"><div className="mb-5 text-sm font-medium">Ablation (F1)</div>{abl.map(([l, v], i) => <div key={l} className="mb-4"><div className="mb-1.5 flex justify-between text-xs text-muted"><span>{l}</span><span className="font-mono">{v}</span></div><div className="h-2 rounded bg-line"><motion.div className="h-2 rounded bg-fg" initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.15 }} /></div></div>)}</div>
          <div className="card p-6"><div className="mb-5 text-sm font-medium">By finding type</div><table className="w-full text-sm"><thead className="text-left text-xs text-subtle"><tr><th className="pb-3">Type</th><th>Precision</th><th>Recall</th></tr></thead><tbody>{rows.map(([t, p, r]) => <tr key={t} className="border-t border-line"><td className="py-3">{t}</td><td className="font-mono">{p}</td><td className="font-mono">{r}</td></tr>)}</tbody></table></div>
        </div>
      </div>
    </div>
  );
}
