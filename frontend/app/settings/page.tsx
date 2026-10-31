"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Seg, Toggle } from "@/components/ui";
function Row({ t, d, c }: { t: string; d: string; c: React.ReactNode }) { return <div className="flex items-center justify-between gap-6 border-t border-line py-5 first:border-0"><div><div className="text-sm font-medium">{t}</div><div className="text-xs text-muted">{d}</div></div>{c}</div>; }
export default function Settings() {
  const [lang, setLang] = useState("English"), [a, setA] = useState(true), [b, setB] = useState(true), [m, setM] = useState(false);
  return (
    <div>
      <PageHeader eyebrow="SETTINGS" title="Settings" />
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-10">
        <div className="card px-6"><Row t="Language" d="Reports and explanations" c={<Seg id="lang" value={lang} onChange={setLang} options={["English", "हिन्दी"]} />} /></div>
        <div className="card px-6"><Row t="Change alerts" d="Notify me when a tracked source changes" c={<Toggle on={a} onChange={setA} label="Change alerts" />} /><Row t="Deadline reminders" d="Remind me before a verified deadline" c={<Toggle on={b} onChange={setB} label="Deadline reminders" />} /></div>
        <div className="card px-6"><Row t="Reduce motion" d="Turn off animations" c={<Toggle on={m} onChange={setM} label="Reduce motion" />} /></div>
        <div className="card px-6"><Row t="Export my data" d="Download all reports as JSON" c={<button className="btn-ghost">Export</button>} /><Row t="Delete account" d="Remove your account and reports" c={<button className="btn-ghost">Delete</button>} /></div>
      </div>
    </div>
  );
}
