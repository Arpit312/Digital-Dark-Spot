import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";
export const BASE = process.env.EXPO_PUBLIC_API_URL || "http://10.130.44.120:8000";
let token: string | null = null;
export const loadToken = async () => {
  try {
    token = await SecureStore.getItemAsync("token");
    return token;
  } catch {
    token = null;
    return null;
  }
};
export const setToken = async (t: string | null) => {
  token = t;
  try {
    if (t) await SecureStore.setItemAsync("token", t);
    else await SecureStore.deleteItemAsync("token");
  } catch {}
};
export const kv = {
  get: async (k: string) => {
    try {
      return await SecureStore.getItemAsync(k);
    } catch {
      return null;
    }
  },
  set: async (k: string, v: string) => {
    try {
      await SecureStore.setItemAsync(k, v);
    } catch {}
  }
};
export async function api<T = any>(path: string, o: { method?: string; body?: any; form?: FormData } = {}): Promise<T> {
  const url = (BASE.endsWith("/") ? BASE.slice(0, -1) : BASE) + path;
  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (o.body) headers["Content-Type"] = "application/json";

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

  try {
    const r = await fetch(url, {
      method: o.method ?? (o.body || o.form ? "POST" : "GET"),
      headers,
      body: o.form ?? (o.body ? JSON.stringify(o.body) : undefined),
      signal: controller?.signal
    });
    if (timeoutId) clearTimeout(timeoutId);
    if (!r.ok) {
      let m: any = "Request failed (" + r.status + ")";
      try {
        const j = await r.json();
        m = j.detail ?? j.message ?? m;
      } catch {}
      const e: any = new Error(typeof m === "string" ? m : "Request failed");
      e.status = r.status;
      throw e;
    }
    return r.status === 204 ? (null as T) : r.json();
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);
    throw err;
  }
}
export function useFetch<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null), [loading, setLoading] = useState(!!path), [error, setError] = useState<any>(null);
  const load = useCallback(async () => { if (!path) return; setLoading(true); setError(null); try { setData(await api<T>(path)); } catch (e) { setError(e); } finally { setLoading(false); } }, [path]);
  useEffect(() => { load(); }, [load]);
  return { data, loading, error, reload: load };
}
