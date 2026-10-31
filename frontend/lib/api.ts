export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type Finding = {
  id: string;
  type: "gap" | "conflict" | "outdated" | "unanswered" | "sourced_fact";
  title: string;
  statement: string;
  attribute: string;
  confidence: number;
  evidence: {
    source: string;
    tier: number;
    quote: string;
    location: string;
    url: string;
  }[];
};

export type ChecklistItem = {
  id: string;
  p: string;
  text: string;
};

export function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("darkspot_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type AnalysisResult = {
  id: string;
  question: string;
  topic_type?: string;
  coverage: number;
  dsi?: number;
  summary_counts?: {
    gaps: number;
    conflicts: number;
    outdated: number;
    sourced_facts: number;
  };
  sources?: Array<{
    url: string;
    title: string;
    domain: string;
    tier: number;
    trust: number;
  }>;
  findings: Finding[];
  checklist: ChecklistItem[];
  heatmap?: Array<{
    attribute: string;
    sources: Array<{
      source_domain: string;
      covered: boolean;
      trust: number;
    }>;
  }>;
};

export interface StreamEvent {
  step: string;
  detail?: string;
  agent?: string;
  status?: string;
  id?: string;
  payload?: AnalysisResult;
}

export type AuthUser = {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  phone_verified?: boolean;
  avatar_url?: string;
  role?: string;
  organization?: string;
  google_connected?: boolean;
  google_email?: string;
  created_at?: string;
  bio?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    organization?: string;
    role?: string;
    google_connected?: boolean;
    google_email?: string;
  };
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  priority: string;
  description: string;
  email: string;
  status: string;
  assigned_agent: string;
  created_at: string;
  sla: string;
};

// ==============================================================================
//                            AUTHENTICATION & PROFILE
// ==============================================================================

export async function authSignup(
  email: string,
  password: string,
  fullName?: string
): Promise<{ success: boolean; error?: string; user?: any; requiresEmailConfirmation?: boolean }> {
  try {
    const res = await fetch(`${API}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Signup failed." };
    }
    if (typeof window !== "undefined" && data.user && data.access_token) {
      const u = {
        ...data.user,
        full_name: fullName || data.user.user_metadata?.full_name || email.split("@")[0],
      };
      localStorage.setItem("darkspot_user", JSON.stringify(u));
      if (data.access_token) {
        localStorage.setItem("darkspot_token", data.access_token);
      }
      window.dispatchEvent(new Event("darkspot_user_change"));
    }
    return data.access_token
      ? { success: true, user: data.user }
      : { success: true, user: data.user, requiresEmailConfirmation: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error. Please try again." };
  }
}

export async function authLogin(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: any }> {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Invalid email or password." };
    }
    if (typeof window !== "undefined" && data.user) {
      localStorage.setItem("darkspot_user", JSON.stringify(data.user));
      if (data.access_token) {
        localStorage.setItem("darkspot_token", data.access_token);
      }
      window.dispatchEvent(new Event("darkspot_user_change"));
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error. Please try again." };
  }
}

export function authLogout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("darkspot_user");
    localStorage.removeItem("darkspot_token");
    window.dispatchEvent(new Event("darkspot_user_change"));
    window.location.href = "/login";
  }
}

export function getAuthUser(): AuthUser | null {
  if (typeof window !== "undefined") {
    try {
      const u = localStorage.getItem("darkspot_user");
      if (u) return JSON.parse(u);
    } catch {
      return null;
    }
  }
  return null;
}

export function ensureActiveUser(): AuthUser | null {
  return getAuthUser();
}

export async function updateUserProfile(data: Partial<AuthUser>): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const current = getAuthUser();
    const token = typeof window !== "undefined" ? localStorage.getItem("darkspot_token") : null;
    if (!current || !token) throw new Error("Sign in to update your profile.");

    const response = await fetch(`${API}/auth/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        full_name: data.full_name,
        phone: data.phone,
        avatar_url: data.avatar_url,
        organization: data.organization,
      }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || "Profile update failed.");

    const updated: AuthUser = {
      ...current,
      ...data,
      ...result.user,
      user_metadata: { ...(current.user_metadata || {}), ...(result.user?.user_metadata || {}) },
    };
    localStorage.setItem("darkspot_user", JSON.stringify(updated));
    window.dispatchEvent(new Event("darkspot_user_change"));
    return { success: true, user: updated };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile." };
  }
}

// ==============================================================================
//                            CUSTOMER SUPPORT & TICKETS
// ==============================================================================

export async function createSupportTicket(body: {
  subject: string;
  category: string;
  priority: string;
  description: string;
  email?: string;
}): Promise<{ success: boolean; ticket?: SupportTicket; error?: string }> {
  try {
    const res = await fetch(`${API}/support/ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.detail || "Could not create support ticket." };
    return { success: true, ticket: data.ticket };
  } catch (err: any) {
    return { success: false, error: err.message || "Could not connect to the support service." };
  }
}

export async function getSupportTickets(): Promise<SupportTicket[]> {
  const res = await fetch(`${API}/support/tickets`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Could not load support tickets.");
  return data;
}

// ==============================================================================
//                         ANALYSIS & PIPELINE
// ==============================================================================

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/health`, { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getAnalysis(id: string): Promise<AnalysisResult> {
  const response = await fetch(`${API}/analyses/${id}`, {
    cache: "no-store",
    headers: authHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Could not load this report.");
  return data;
}

export async function searchSources(query: string): Promise<Array<{ title?: string; url: string }>> {
  const res = await fetch(`${API}/sources/search?query=${encodeURIComponent(query)}`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Could not search live sources.");
  return data.results;
}

export async function uploadPdf(file: File): Promise<{
  url: string;
  title: string;
  domain: string;
  tier: number;
  text: string;
  sha256: string;
  published_at: string | null;
  trust: number;
}> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API}/sources/upload`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || `Upload failed: ${res.statusText}`);
  if (!data.text?.trim()) throw new Error("No readable text was extracted from this PDF.");
  return data;
}

// Connects to SSE /analyze/stream with fallback to /analyze
export async function streamAnalyze(
  body: {
    question: string;
    urls?: string[];
    sources?: string[];
    raw_documents?: Array<Record<string, unknown>>;
  },
  onEvent: (e: StreamEvent) => void
): Promise<AnalysisResult> {
  const urls = body.urls || body.sources || [];
  const payload = {
    question: body.question,
    urls: urls.filter((s) => s.startsWith("http://") || s.startsWith("https://")),
    raw_documents: body.raw_documents || [],
  };

  try {
    const r = await fetch(`${API}/analyze/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    });

    if (!r.ok || !r.body) {
      throw new Error(`SSE stream failed with status ${r.status}`);
    }

    const rd = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let finalResult: AnalysisResult | null = null;

    for (;;) {
      const { done, value } = await rd.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const parts = buf.split("\n\n");
      buf = parts.pop() || "";

      for (const p of parts) {
        const line = p.trim();
        if (!line.startsWith("data:")) continue;
        try {
          const raw = line.replace(/^data:\s*/, "");
          const data = JSON.parse(raw);

          if (data.step === "result" && data.payload) {
            finalResult = data.payload;
            onEvent({
              step: "result",
              status: "complete",
              id: finalResult?.id,
              payload: finalResult || undefined
            });
          } else {
            onEvent({
              step: data.step,
              detail: data.detail,
              agent: data.step,
              status: "running"
            });
          }
        } catch {}
      }
    }

    if (!finalResult) throw new Error("The analysis stream ended without a result.");
    return finalResult;
  } catch (err) {
    console.warn("Streaming analysis failed; retrying with the standard analysis endpoint:", err);
    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const result: AnalysisResult = await res.json();
        if (typeof window !== "undefined") {
          sessionStorage.setItem(`darkspot_analysis_${result.id}`, JSON.stringify(result));
        }
        onEvent({
          step: "result",
          status: "complete",
          id: result.id,
          payload: result
        });
        return result;
      }
      const data = await res.json();
      throw new Error(data.detail || "Analysis request failed.");
    } catch (fallbackErr) {
      console.error("Backend request failed:", fallbackErr);
      throw fallbackErr;
    }
  }
}
