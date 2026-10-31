"use client";
import { useState } from "react";
import { api, useApi } from "@/lib/api";
import { Data, PageHead, Table } from "@/components/ui";
export default function Sources() {
  const r = useApi<any[]>("/admin/sources"); const [d, setD] = useState(""), [t, setT] = useState("2");
  const save = async (id: string | null, domain: string, tier: number) => { try { await api(id ? `/admin/sources/${id}` : "/admin/sources", { method: id ? "PATCH" : "POST", body: { domain, tier } }); r.reload(); setD(""); } catch (e: any) { alert(e.message); } };
  return (
    <div><PageHead title="Source trust tiers" sub="Tier 1 is most trusted. This feeds the trust score." />
      <div className="mb-4 flex flex-wrap gap-2"><input className="input max-w-xs" placeholder="domain.gov.in" value={d} onChange={(e) => setD(e.target.value)} /><select className="input !w-32" value={t} onChange={(e) => setT(e.target.value)}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Tier {n}</option>)}</select><button className="btn-primary" disabled={!d.trim()} onClick={() => save(null, d.trim(), +t)}>Add domain</button></div>
      <Data r={r} empty="No domains configured">{(rows: any[]) => <Table rows={rows} cols={[
        { h: "Domain", r: (x) => x.domain },
        { h: "Tier", r: (x) => <select value={x.tier} onChange={(e) => save(x.id, x.domain, +e.target.value)} className="input !h-8 !w-28">{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>Tier {n}</option>)}</select> },
        { h: "Seen in", r: (x) => <span className="text-muted">{x.count ?? ""}</span> },
      ]} />}</Data></div>
  );
}
