"use client";
import { api, useApi } from "@/lib/api";
import { Data, PageHead, Toggle } from "@/components/ui";
export default function SettingsPage() {
  const r = useApi<any[]>("/admin/flags");
  const set = async (key: string, enabled: boolean) => { try { await api(`/admin/flags/${key}`, { method: "PUT", body: { enabled } }); r.reload(); } catch (e: any) { alert(e.message); } };
  return (
    <div><PageHead title="Settings" sub="Feature flags shared by the app and website." />
      <Data r={r} empty="No feature flags configured">{(d: any[]) => <div className="card px-6">{d.map((f) => <div key={f.key} className="flex items-center justify-between gap-6 border-t border-line py-5 first:border-0"><div><div className="text-sm font-medium">{f.label ?? f.key}</div>{f.description && <div className="text-xs text-muted">{f.description}</div>}</div><Toggle on={!!f.enabled} onChange={(v: boolean) => set(f.key, v)} label={f.key} /></div>)}</div>}</Data></div>
  );
}
