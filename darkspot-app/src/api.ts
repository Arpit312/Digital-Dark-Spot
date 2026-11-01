import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState, useRef } from "react";

export const BASE = (
  process.env.EXPO_PUBLIC_API_URL || "https://darkspot-backend.onrender.com"
).replace(/\/+$/, "");

let token: string | null = null;

export const loadToken = async () => {
  try {
    token = await SecureStore.getItemAsync("token");
  } catch {
    token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  }
  return token;
};

export const setToken = async (t: string | null) => {
  try {
    if (t) await SecureStore.setItemAsync("token", t);
    else await SecureStore.deleteItemAsync("token");
  } catch {
    if (typeof localStorage !== "undefined") {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    }
  }
  token = t;
};

export const getToken = () => token;

export const kv = {
  get: async (k: string) => {
    try {
      return await SecureStore.getItemAsync(k);
    } catch {
      return typeof localStorage !== "undefined" ? localStorage.getItem(k) : null;
    }
  },
  set: async (k: string, v: string) => {
    try {
      await SecureStore.setItemAsync(k, v);
    } catch {
      if (typeof localStorage !== "undefined") {
        try { localStorage.setItem(k, v); } catch {}
      }
    }
  },
};

// In-memory response cache for speed
const cache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 30_000; // 30 seconds

export async function api<T = any>(
  path: string,
  o: { method?: string; body?: any; form?: FormData; noCache?: boolean } = {}
): Promise<T> {
  if (!BASE) {
    throw new Error("Set EXPO_PUBLIC_API_URL to the deployed DarkSpot API URL.");
  }
  const url = (BASE.endsWith("/") ? BASE.slice(0, -1) : BASE) + path;
  const method = o.method ?? (o.body || o.form ? "POST" : "GET");
  const cacheKey = method + ":" + url;

  // Return cached GET responses for speed
  if (method === "GET" && !o.noCache) {
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return cached.data as T;
    }
  }

  const headers: any = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (o.body) headers["Content-Type"] = "application/json";

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  // Increased timeout to 15s for reliability
  const timeoutId = controller ? setTimeout(() => controller.abort(), 15000) : null;

  try {
    const r = await fetch(url, {
      method,
      headers,
      body: o.form ?? (o.body ? JSON.stringify(o.body) : undefined),
      signal: controller?.signal,
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
    const data = r.status === 204 ? (null as T) : await r.json();

    // Cache successful GET responses
    if (method === "GET") {
      cache.set(cacheKey, { data, ts: Date.now() });
    }

    return data as T;
  } catch (err: any) {
    if (timeoutId) clearTimeout(timeoutId);
    throw err;
  }
}

export function clearCache(pathPrefix?: string) {
  if (!pathPrefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(pathPrefix)) cache.delete(key);
  }
}

export function useFetch<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<any>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api<T>(path);
      if (mountedRef.current) setData(result);
    } catch (e) {
      if (mountedRef.current) setError(e);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
