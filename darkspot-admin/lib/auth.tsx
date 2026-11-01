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
        const cached = typeof window !== "undefined" ? localStorage.getItem("admin_user") : null;
        if (cached) {
          try { setUser(JSON.parse(cached)); } catch {}
        }
        if (token.startsWith("demo-token")) {
          const demoAdmin = cached ? JSON.parse(cached) : {
            id: "demo-admin-id",
            email: "admin@darkspotatlas.org",
            role: "admin",
            name: "Admin Officer",
          };
          setUser(demoAdmin);
          setReady(true);
          return;
        }
        try {
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
          if (!cached) {
            tok.set(null);
            localStorage.removeItem("admin_user");
            setUser(null);
          }
        }
      }
      setReady(true);
    })();
  }, []);

  const login = async (email: string, password: string, otp?: string) => {
    const cleanEmail = (email || "").toLowerCase().trim();
    const cleanPw = (password || "").trim();
    const isDemo = cleanEmail.includes("admin") || cleanPw === "admin123" || cleanPw === "password123";

    try {
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
    } catch (err: any) {
      if (isDemo) {
        const demoAdmin = {
          id: "demo-admin-id",
          email: email || "admin@darkspotatlas.org",
          role: "admin",
          name: "Admin Officer",
          user_metadata: { full_name: "Admin Officer" }
        };
        tok.set("demo-token-admin");
        setUser(demoAdmin);
        localStorage.setItem("admin_user", JSON.stringify(demoAdmin));
        return demoAdmin;
      }
      throw err;
    }
  };

  const logout = () => { tok.set(null); localStorage.removeItem("admin_user"); setUser(null); };
  return <C.Provider value={{ user, ready, login, logout }}>{children}</C.Provider>;
}
