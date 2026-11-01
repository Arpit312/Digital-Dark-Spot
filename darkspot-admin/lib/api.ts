"use client";
import { useCallback, useEffect, useState } from "react";
const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const BASE = rawBase.startsWith("http") ? rawBase : `https://${rawBase}`;
export const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:8081";
export const tok = { get: () => (typeof window === "undefined" ? null : localStorage.getItem("admin_token")), set: (t: string | null) => (t ? localStorage.setItem("admin_token", t) : localStorage.removeItem("admin_token")) };
export async function api<T = any>(path: string, o: { method?: string; body?: any } = {}): Promise<T> {

  const h: any = {}; const t = tok.get();
  if (t) h.Authorization = `Bearer ${t}`; if (o.body) h["Content-Type"] = "application/json";
  const r = await fetch(BASE + path, { method: o.method ?? (o.body ? "POST" : "GET"), headers: h, body: o.body ? JSON.stringify(o.body) : undefined });
  if (!r.ok) { let m: any = `Request failed (${r.status})`; try { const j = await r.json(); m = j.detail ?? j.message ?? m; } catch {} throw Object.assign(new Error(typeof m === "string" ? m : "Request failed"), { status: r.status }); }
  return r.status === 204 ? (null as T) : r.json();
}
export function useApi<T = any>(path: string | null, every = 0) {
  const [data, setData] = useState<T | null>(null), [loading, setLoading] = useState(!!path), [error, setError] = useState<any>(null);
  const load = useCallback(async (quiet = false) => { if (!path) return; if (!quiet) setLoading(true); try { setData(await api<T>(path)); setError(null); } catch (e) { setError(e); } finally { setLoading(false); } }, [path]);
  useEffect(() => { load(); if (!every) return; const i = setInterval(() => load(true), every); return () => clearInterval(i); }, [load, every]);
  return { data, loading, error, reload: () => load(true) };
}
