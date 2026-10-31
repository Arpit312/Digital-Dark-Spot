import PageHeader from "@/components/PageHeader";
const stats = [["Analyses today", "128"], ["Pending verifications", "3"], ["Flagged findings", "5"], ["Avg. latency", "11.4 s"]];
const queue = [["Asha R.", "Scholarship Dept.", "asha@dept.gov.in"], ["Vikram S.", "College admin", "vikram@college.edu"]];
const log = ["Fact signed: Scheme X deadline", "Officer approved: Asha R.", "Trust tier changed: coachingsite.com"];
export default function Admin() {
  return (
    <div>
      <PageHeader eyebrow="ADMIN" title="Admin dashboard" />
      <div className="mx-auto max-w-6xl space-y-6 px-5 py-10">
        <div className="grid gap-3 md:grid-cols-4">{stats.map(([l, v]) => <div key={l} className="card p-5"><div className="text-xs text-muted">{l}</div><div className="mt-1 text-2xl font-semibold">{v}</div></div>)}</div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6"><div className="mb-4 text-sm font-medium">Verification queue</div>{queue.map(([n, d, e]) => <div key={e} className="flex items-center justify-between border-t border-line py-3 text-sm"><div><div>{n}</div><div className="text-xs text-muted">{d} · {e}</div></div><div className="flex gap-2"><button className="btn-primary px-3 py-1.5">Approve</button><button className="btn-ghost px-3 py-1.5">Reject</button></div></div>)}</div>
          <div className="card p-6"><div className="mb-4 text-sm font-medium">Audit log</div>{log.map((l, i) => <div key={l} className="flex justify-between border-t border-line py-3 text-sm text-muted"><span>{l}</span><span className="font-mono text-xs text-subtle">{i + 1}h ago</span></div>)}</div>
        </div>
      </div>
    </div>
  );
}
