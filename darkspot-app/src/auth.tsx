import React, { createContext, useContext, useEffect, useState } from "react";
import { api, loadToken, setToken, kv } from "./api";
const Ctx = createContext<any>(null);
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    let active = true;

    // Safety timeout: Never leave user on spinning circle for more than 800ms!
    const timer = setTimeout(() => {
      if (active) setReady(true);
    }, 800);

    (async () => {
      try {
        const isSeen = await kv.get("seen");
        if (active) setSeen(isSeen === "1");
        const tok = await loadToken();
        if (tok && active) {
          try {
            const me = await api("/me");
            if (active) setUser(me);
          } catch {
            await setToken(null);
          }
        }
      } catch (err) {
        console.warn("Auth initialization error:", err);
      } finally {
        if (active) {
          clearTimeout(timer);
          setReady(true);
        }
      }
    })();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  const authed = async (path: string, body: any) => {
    const r = await api(path, { body });
    await setToken(r.token);
    setUser(r.user ?? (await api("/me")));
  };

  return (
    <Ctx.Provider
      value={{
        user,
        ready,
        seen,
        markSeen: async () => {
          await kv.set("seen", "1");
          setSeen(true);
        },
        login: (email: string, password: string) => authed("/auth/login", { email, password }),
        signup: (name: string, email: string, password: string) =>
          authed("/auth/signup", { name, email, password }),
        logout: async () => {
          await setToken(null);
          setUser(null);
        }
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
