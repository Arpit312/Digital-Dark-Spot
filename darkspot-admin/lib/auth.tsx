"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api, tok } from "./api";
const C = createContext<any>(null);
export const useAuth = () => useContext(C);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null), [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      const token = tok.get();
      if (token) {
        try {
          const cached = typeof window !== "undefined" ? localStorage.getItem("admin_user") : null;
          if (cached) {
            try { setUser(JSON.parse(cached)); } catch {}
          }
          const u = await api("/me");
          if (u.role === "admin") {
            const adminUser = { ...u, role: "admin", name: u.user_metadata?.full_name || u.name || "Admin Officer" };
            setUser(adminUser);
            localStorage.setItem("admin_user", JSON.stringify(adminUser));
          } else {
            tok.set(null);
            localStorage.removeItem("admin_user");
            setUser(null);
          }
        } catch {
          tok.set(null);
          localStorage.removeItem("admin_user");
          setUser(null);
        }
      }
      setReady(true);
    })();
  }, []);

  const login = async (email: string, password: string, otp?: string) => {
    const r = await api("/auth/login", { body: { email, password, ...(otp ? { otp } : {}) } });
    const accessToken = r.access_token || r.token;
    if (!accessToken) throw new Error("The authentication service did not return a valid session.");
    tok.set(accessToken);
    const u = await api("/me");
    if (u.role !== "admin") {
      tok.set(null);
      localStorage.removeItem("admin_user");
      throw new Error("This account does not have admin access.");
    }
    const adminUser = { ...u, role: "admin", name: u.user_metadata?.full_name || u.name || "Admin Officer" };
    setUser(adminUser);
    localStorage.setItem("admin_user", JSON.stringify(adminUser));
    return adminUser;
  };
  const logout = () => { tok.set(null); localStorage.removeItem("admin_user"); setUser(null); };
  return <C.Provider value={{ user, ready, login, logout }}>{children}</C.Provider>;
}
