import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
export const BASE = process.env.EXPO_PUBLIC_API_URL ?? "";
let token: string | null = null;
export const loadToken = async () => (token = await SecureStore.getItemAsync("token"));
export const setToken = async (t: string | null) => { token = t; if (t) await SecureStore.setItemAsync("token", t); else await SecureStore.deleteItemAsync("token"); };
export const kv = { get: (k: string) => SecureStore.getItemAsync(k), set: (k: string, v: string) => SecureStore.setItemAsync(k, v) };
export async function api<T = any>(path: string, o: { method?: string; body?: any; form?: FormData } = {}): Promise<T> {
  if (!BASE) throw new Error("API URL not set. Add EXPO_PUBLIC_API_URL to your .env file.");
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (o.body) headers["Content-Type"] = "application/json";
  const r = await fetch(BASE + path, { method: o.method ?? (o.body || o.form ? "POST" : "GET"), headers, body: o.form ?? (o.body ? JSON.stringify(o.body) : undefined) });
  if (!r.ok) { let m: any = "Request failed (" + r.status + ")"; try { const j = await r.json(); m = j.detail ?? j.message ?? m; } catch {} const e: any = new Error(typeof m === "string" ? m : "Request failed"); e.status = r.status; throw e; }
  return r.status === 204 ? (null as T) : r.json();
}
export function useFetch<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null), [loading, setLoading] = useState(!!path), [error, setError] = useState<any>(null);
  const load = useCallback(async () => { if (!path) return; setLoading(true); setError(null); try { setData(await api<T>(path)); } catch (e) { setError(e); } finally { setLoading(false); } }, [path]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}
