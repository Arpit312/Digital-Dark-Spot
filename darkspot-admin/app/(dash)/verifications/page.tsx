"use client";
import { api, useApi } from "@/lib/api";
import { Data, PageHead, AIReview } from "@/components/ui";
export default function Verifications() {
  const r = useApi<any[]>("/admin/verifications");
  const act = async (id: string, a: string) => { try { await api(`/admin/verifications/${id}/${a}`, { method: "POST" }); r.reload(); } catch (e: any) { alert(e.message); } };
  return (
    <div><PageHead title="Verifications" sub="Officer and institution access requests." />
      <Data r={r} empty="No pending requests">{(d: any[]) => <div className="space-y-3">{d.map((x) => <div key={x.id} className="card p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="font-medium">{x.name}</div><div className="mt-1 text-sm text-muted">{[x.dept, x.email].filter(Boolean).join(" · ")}</div>{x.note && <p className="mt-2 text-sm text-muted">{x.note}</p>}</div><div className="flex gap-2"><button onClick={() => act(x.id, "approve")} className="btn-primary">Approve</button><button onClick={() => act(x.id, "reject")} className="btn-ghost">Reject</button></div></div><AIReview kind="verification" id={x.id} /></div>)}</div>}</Data></div>
  );
}
