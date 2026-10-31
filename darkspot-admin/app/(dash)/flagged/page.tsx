"use client";
import { api, useApi } from "@/lib/api";
import { Data, PageHead, AIReview } from "@/components/ui";
export default function Flagged() {
  const r = useApi<any[]>("/admin/flagged");
  const act = async (id: string, action: string) => { try { await api(`/admin/flagged/${id}`, { method: "PATCH", body: { action } }); r.reload(); } catch (e: any) { alert(e.message); } };
  return (
    <div><PageHead title="Flagged findings" sub="Findings reported by users or caught by the system." />
      <Data r={r} empty="Nothing flagged">{(d: any[]) => <div className="space-y-3">{d.map((x) => <div key={x.id} className="card p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="badge">{x.type}</span>{x.reason && <span className="text-xs text-subtle">{x.reason}</span>}</div><div className="mt-2 font-medium">{x.title}</div><p className="mt-1 text-sm text-muted">{x.statement}</p>{x.evidence?.[0] && <div className="mt-3 rounded-lg border border-line bg-surface p-3 font-mono text-xs text-muted">“{x.evidence[0].quote}”</div>}</div><div className="flex gap-2"><button onClick={() => act(x.id, "confirm")} className="btn-primary">Confirm</button><button onClick={() => act(x.id, "dismiss")} className="btn-ghost">Dismiss</button></div></div><AIReview kind="finding" id={x.id} /></div>)}</div>}</Data></div>
  );
}
