import { UploadCloud } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
const gaps = ["Hostel fee refund rule not stated", "Exam date differs between notice and website", "Scholarship last date missing"];
export default function Campus() {
  return (
    <div>
      <PageHeader eyebrow="CAMPUS MODE" title="Check college notices before students do." sub="Upload admission, exam, scholarship or hostel notices to find gaps and conflicts." />
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 md:grid-cols-2">
        <Reveal><div className="card flex h-full min-h-64 flex-col items-center justify-center border-dashed p-8 text-center"><UploadCloud size={26} strokeWidth={1.5} className="text-muted" /><p className="mt-4 text-sm text-muted">Drop notices (PDF) here</p><button className="btn-ghost mt-5">Choose files</button></div></Reveal>
        <Reveal delay={0.1}><div className="card p-6"><div className="mb-4 text-sm font-medium">Sample gap check</div>{gaps.map((g) => <div key={g} className="border-t border-line py-3 text-sm text-muted">{g}</div>)}</div></Reveal>
        <Reveal className="md:col-span-2"><div className="card p-6"><div className="mb-1 flex items-center gap-2 text-sm font-medium">Confusion dashboard <span className="badge">Roadmap</span></div><p className="text-xs text-subtle">Aggregated and anonymised only. Small groups are hidden.</p><div className="mt-5 grid grid-cols-12 gap-1.5">{Array.from({ length: 48 }).map((_, i) => <div key={i} className="aspect-square rounded bg-white" style={{ opacity: 0.05 + ((i * 37) % 10) / 14 }} />)}</div></div></Reveal>
      </div>
    </div>
  );
}
