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
        if (active) setReady(true);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const authed = async (path: string, body: any) => {
    const response = await api<any>(path, { body });
    const accessToken = response?.access_token || response?.token;
    if (!accessToken) {
      if (path === "/auth/signup" && response?.user) {
        throw new Error("Check your email to confirm your account, then sign in.");
      }
      throw new Error("The authentication service did not return a valid session.");
    }
    await setToken(accessToken);
    const currentUser = response.user || (await api("/me"));
    setUser(currentUser);
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
