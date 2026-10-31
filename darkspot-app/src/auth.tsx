import React, { createContext, useContext, useEffect, useState } from "react";
import { api, loadToken, setToken, kv } from "./api";
const Ctx = createContext<any>(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null), [ready, setReady] = useState(false), [seen, setSeen] = useState(true);
  useEffect(() => { (async () => {
    setSeen((await kv.get("seen")) === "1");
    try { if (await loadToken()) setUser(await api("/me")); } catch { await setToken(null); }
    setReady(true);
  })(); }, []);
  const authed = async (path: string, body: any) => { const r = await api(path, { body }); await setToken(r.token); setUser(r.user ?? (await api("/me"))); };
  return <Ctx.Provider value={{ user, ready, seen, markSeen: async () => { await kv.set("seen", "1"); setSeen(true); }, login: (email: string, password: string) => authed("/auth/login", { email, password }), signup: (name: string, email: string, password: string) => authed("/auth/signup", { name, email, password }), logout: async () => { await setToken(null); setUser(null); } }}>{children}</Ctx.Provider>;
}
