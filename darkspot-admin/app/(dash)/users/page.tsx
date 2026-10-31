"use client";
import { useState } from "react";
import { api, useApi } from "@/lib/api";
import { Data, PageHead, Table, Seg } from "@/components/ui";
export default function Users() {
  const [q, setQ] = useState(""), [role, setRole] = useState("All");
  const r = useApi<any[]>(`/admin/users?q=${encodeURIComponent(q)}&role=${role === "All" ? "" : role.toLowerCase()}`);
  const set = async (id: string, body: any) => { try { await api(`/admin/users/${id}`, { method: "PATCH", body }); r.reload(); } catch (e: any) { alert(e.message); } };
  return (
    <div><PageHead title="Users" sub="People using the app and website." />
      <div className="mb-4 flex flex-wrap gap-3"><input className="input max-w-xs" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} /><Seg id="urole" value={role} onChange={setRole} options={["All", "Citizen", "Officer", "Admin"]} /></div>
      <Data r={r} empty="No users found">{(d: any[]) => <Table rows={d} cols={[
        { h: "User", r: (x) => <div><div>{x.name || "Unnamed"}</div><div className="text-xs text-subtle">{x.email}</div></div> },
        { h: "Role", r: (x) => <select value={x.role} onChange={(e) => set(x.id, { role: e.target.value })} className="input !h-8 !w-28"><option value="citizen">citizen</option><option value="officer">officer</option><option value="admin">admin</option></select> },
        { h: "Joined", r: (x) => <span className="text-muted">{x.created_at ? new Date(x.created_at).toLocaleDateString() : ""}</span> },
        { h: "Status", r: (x) => <button onClick={() => set(x.id, { suspended: !x.suspended })} className="btn-ghost !py-1 text-xs">{x.suspended ? "Restore" : "Suspend"}</button> },
      ]} />}</Data></div>
  );
}
