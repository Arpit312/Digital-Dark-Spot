# DarkSpot Atlas 🌐🔍
> **Multi-Agent AI Platform jo batata hai ki aapki jaankari mein kya missing, purana ya contradictory hai — with 100% Quote-Verified Evidence.**

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20(App%20Router)-black.svg?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4%20OLED%20Midnight-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%200.110%2B-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Database%20%26%20Auth-Supabase%20PostgreSQL-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Gemini](https://img.shields.io/badge/LLM-Google%20Gemini%202.5%20Flash-4285F4.svg?logo=google)](https://aistudio.google.com/)
[![Groq](https://img.shields.io/badge/Fallback%20LLM-Groq%20Ultra--Speed-F55036.svg)](https://groq.com/)
[![Status](https://img.shields.io/badge/Status-100%25%20Real%20Data%20Verified-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

---

## 📌 The Problem (The Digital Dark Spot)

Internet par jaankari ki kami nahi hai, **bharosemand, up-to-date aur complete jaankari ki kami hai.**
Ek student, citizen, ya applicant jab koi critical decision leta hai (scholarships, admissions, government welfare schemes, loans):

1. **Scattered Information:** Eligibility ek circular mein hoti hai, accepted documents kisi portal par, aur deadline teesri jagah.
2. **Outdated Guidelines:** Coaching blogs aur search results pichle saal ki expired dates aur superseded guidelines dikhate hain.
3. **Direct Contradictions:** Official notice bolta hai *Tehsildar revenue income certificate mandatory hai*, jabki helpline blog bolta hai *self-affidavit chalega*.
4. **Unknown Unknowns:** User ko pata hi nahi hota ki *renewal condition*, *minimum attendance percentage*, ya *Aadhaar seeding* check karna zaroori tha.

> **The Core Difference:** Standard search engines information dhoondhte hain. LLM chatbots content ko summarize karte hain (aur hallucinate karte hain). **DarkSpot Atlas bataata hai ki information mein kya MISSING, PURANA ya CONFLICTING hai — har finding ke saath exact source quote ka saboot dekar.**

---

## 💎 Brand Identity: L3 Missing Line

DarkSpot Atlas uses the **L3 Missing Line** geometric identity representing text rows where the critical information gap (the Dark Spot) is illuminated:

```
━━━━━━━━━━━━━━━━━━━━  (Top solid guideline)
━━━━━━━      ━━━━━━━  (The Missing Information Gap)
━━━━━━━━━━━━━━━━━━━━  (Bottom verified source)
```

- **Theme:** Midnight OLED Graphite (`#000000`, `#09090B`, `#27272A`, `#FAFAFA`).
- **Typography:** Inter, JetBrains Mono, Noto Sans Devanagari.
- **Animations:** Fluid Framer Motion transitions with Lenis physics smooth-scroll.

---

## 🏗️ End-to-End Architecture

```
                               ┌────────────────────────────────┐
                               │   Next.js 14 Web Frontend      │
                               │  (OLED UI, SSE Live Pipeline)   │
                               └───────────────┬────────────────┘
                                               │
                                  HTTP / SSE   │ (port 8000)
                                               ▼
                               ┌────────────────────────────────┐
                               │       FastAPI Backend API      │
                               │     (Orchestrator Engine)      │
                               └───────────────┬────────────────┘
                                               │
        ┌──────────────────────────────────────┼──────────────────────────────────────┐
        ▼                                      ▼                                      ▼
┌──────────────────┐                 ┌──────────────────┐                   ┌──────────────────┐
│   Source Scout   │                 │ Claim Extractor  │                   │ Supabase Cloud   │
│ • Live Web Search│                 │ • Verbatim Quote │                   │ • PostgreSQL DB  │
│   (Tavily API)   │                 │   Gating (>=90%) │                   │ • JWKS JWT Auth  │
│ • PyMuPDF Parser │                 │ • Deterministic  │                   │ • 14 Live Tables │
│ • Portal Ingest  │                 │   Normalization  │                   │ • Row Level Sec  │
└──────────────────┘                 └────────┬─────────┘                   └──────────────────┘
                                              │
                      ┌───────────────────────┼───────────────────────┐
                      ▼                       ▼                       ▼
            ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
            │ Conflict Detector│    │    Gap Finder    │    │ Freshness Radar  │
            │ (Deterministic)  │    │ (Coverage & DSI) │    │ (Decay & Expiry) │
            └─────────┬────────┘    └─────────┬────────┘    └─────────┬────────┘
                      └───────────────────────┼───────────────────────┘
                                              ▼
                                     ┌──────────────────┐
                                     │ Challenger Agent │ (Adversarial Log-Odds Check)
                                     └────────┬─────────┘
                                              ▼
                                     ┌──────────────────┐
                                     │ Evidence Auditor │ (No quote => Abstain Gate)
                                     └────────┬─────────┘
                                              ▼
                                     ┌──────────────────┐
                                     │   Verify-Next    │ (Priority Scoring + MMR)
                                     │     Planner      │
                                     └────────┬─────────┘
                                              ▼
                                     ┌──────────────────┐
                                     │ Audit Report &   │
                                     │ Action Checklist │
                                     └──────────────────┘
```

---

## 🧮 Mathematical Blueprint (18 Core Engines)

| # | Feature | Mathematical Formulation / Algorithm |
| :--- | :--- | :--- |
| **F1** | **Source Trust Scoring** | $T(s) = 0.40 \cdot D + 0.20 \cdot A + 0.25 \cdot F + 0.15 \cdot Q$ |
| **F2** | **Claim Quote Verification** | $\text{sim}(a, b) = 1 - \frac{\text{Lev}(a, b)}{\max(\|a\|, \|b\|)} \ge 0.90$, Confidence $p = \sigma(w_1 \text{sim} + w_2 \text{agree} + b)$ |
| **F3** | **Deterministic Normalization** | Dates (ISO-8601), ₹ Lakh/Crore to integers, Jaccard document canonicalization |
| **F4** | **Hybrid Retrieval (RRF)** | $RRF(d) = \sum_i \frac{1}{60 + \text{rank}_i(d)}$ fusing BM25 ($k_1=1.5, b=0.75$) + Dense Cosine |
| **F5** | **Gap Score & Coverage** | $G_a = 1 - \max_s [ P(a \mid \text{claim}_s) \cdot T(s) ]$, Overall Coverage $C = \frac{\sum w_a(1-G_a)}{\sum w_a}$ |
| **F6** | **Conflict Detection** | $\|v_1 - v_2\| > 0$, Jaccard $J(A, B) = \frac{\|A \cap B\|}{\|A \cup B\|}$, Severity $\text{Sev} = P_{\text{con}} \cdot w_a \cdot \frac{T_1 + T_2}{2}$ |
| **F7** | **Freshness & Decay** | $F(s, a) = \exp(-\lambda_a \cdot \Delta t), \quad \lambda_a = \frac{\ln(2)}{h_a}$, Hard cycle year & expired check |
| **F8** | **Supersession Graph** | NetworkX DiGraph ($u \to v$), Kahn's topological sort for cycle-free valid document chains |
| **F9** | **Challenger Agent** | Bayesian log-odds update: $\text{logit}(p_{\text{final}}) = \text{logit}(p_{\text{prior}}) + \sum \log LR_i$ |
| **F10**| **Confidence Net & ECE** | PyTorch MLP $8 \to 16 \to 8 \to 1$, $ECE = \sum_m \frac{\|B_m\|}{n} \|\text{acc}(B_m) - \text{conf}(B_m)\|$ |
| **F11**| **Verify-Next Priority** | $P = \text{Impact} \cdot \text{Uncertainty} \cdot \text{Urgency}$, MMR diversity selection ($\lambda=0.7$) |
| **F12**| **Heatmap & DSI** | Matrix $M[a][s] = P(a \mid \text{best claim in } s)$, Dark Spot Index $DSI = 1 - C$ |
| **F13**| **Watchtower Radar** | SimHash Hamming distance ($d_H \le 3$), CUSUM spike detection $S_t = \max(0, S_{t-1} + x_t - \mu - k)$ |
| **F14**| **Confusion Intelligence** | $k$-Anonymity cell suppression ($k \ge 10$), EWMA spike detection $E_t = \alpha x_t + (1-\alpha)E_{t-1}$ |
| **F15**| **Signed Facts & Drift** | Ed25519 dual cryptographic approval, MinHash Jaccard drift alert: $\text{Sev} = w_a \cdot T_{\text{signed}}$ |
| **F16**| **Consistency Auditor** | Consistency Score $CS = 1 - (\#\text{conflicts} / \#\text{comparable pairs})$ |
| **F17**| **Language & Lite Mode** | fastText language identification, lightweight payload $\le 30$ KB with brotli/gzip |
| **F18**| **Evaluation Suite** | Gold-set benchmarks: Precision, Recall, $F_1$, Faithfulness ratio ($=1.0$) |

---

## ⚡ Real Data Verified Demo (NSP Audit)

DarkSpot Atlas comes pre-seeded with real-world audited evidence from the **National Scholarship Portal (scholarships.gov.in)**:
* **Income Conflict:** Official Ministry guideline mandates a Revenue Authority certificate (Tehsildar/SDM), while educational advice portals claim self-affidavits are accepted.
* **Renewal Gap:** Portal omission on exact minimum attendance and GPA percentage required for 2nd year disbursement.
* **Outdated Notice:** FAQ quoting previous 2023-24 financial cycle deadline while home banner references 2026.
* **Action Checklist:** Prioritized verify-next tasks with direct links to official circulars.

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
* **Node.js** (v18.0+ or v20+)
* **Python** (v3.10+)
* **npm** or **pnpm**

---

### Step 1: Clone Repository
```bash
git clone https://github.com/Arpit312/Digital-Dark-Spot.git
cd Digital-Dark-Spot
```

---

### Step 2: Backend Setup (FastAPI)

1. Create a virtual environment and install dependencies:
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r backend/requirements.txt
```

2. Create `.env` file in the project root:
```env
# LLM APIs
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Live Search API
TAVILY_API_KEY=your_tavily_api_key

# Supabase PostgreSQL & Auth
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Server Settings
HOST=0.0.0.0
PORT=8000
```

3. Run the diagnostic connection check:
```bash
python backend/check_connections.py
```

4. Start the backend server:
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend will be live at: **`http://127.0.0.1:8000`** (Interactive docs at `/docs`)

---

### Step 3: Frontend Setup (Next.js 14)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Verify production build:
```bash
npm run build
```

5. Start development server:
```bash
npm run dev
```
Frontend will be live at: **`http://localhost:3000`**

---

## 📡 Core API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Health check & service status |
| `POST` | `/analyze/stream` | Server-Sent Events (SSE) streaming live 8-agent audit progress |
| `POST` | `/analyze` | Standard JSON endpoint returning full Atlas audit payload |
| `GET` | `/analyses/{id}` | Retrieves completed audit report by ID with quote evidence |
| `GET` | `/analyses` | Lists recent audits for the reports dashboard |
| `POST` | `/sources/search?query=...` | Live Tavily search across official portals & educational domains |
| `POST` | `/sources/upload` | Upload circular/guideline PDF with PyMuPDF text chunk extraction |
| `POST` | `/auth/signup` | Registers new user via Supabase Auth |
| `POST` | `/auth/login` | Authenticates user with Supabase Auth and returns JWT token |
| `GET` | `/auth/me` | Validates JWT token and returns authenticated user profile |

---

## 📂 Project Structure

```
Digital-Dark-Spot/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point, CORS, Auth & Analysis routes
│   │   ├── config.py          # Environment settings loader
│   │   ├── auth.py            # Supabase JWKS authentication service
│   │   ├── db.py              # Supabase PostgreSQL native REST client
│   │   ├── agents/            # Multi-agent implementations (Scout, Extractor, Gap, Conflict, Challenger, etc.)
│   │   ├── algorithms/        # Mathematical engines (Trust, Normalize, Freshness, Gap, Conflict, etc.)
│   │   ├── models/            # PyTorch Confidence Net & ML calibrations
│   │   ├── templates/         # Domain schemas (scholarship.json, scheme.json, admission.json)
│   │   └── llm/               # Gemini 2.5 Flash + Groq fallback client
│   ├── tests/                 # End-to-end verification suites
│   ├── requirements.txt       # Python dependencies
│   ├── schema.sql             # Supabase PostgreSQL schema with 14 verified tables
│   ├── run_migration.py       # Automated Supabase database migration runner
│   └── check_connections.py   # Complete system connectivity diagnostic tool
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Landing page with L3 brand watermark & animated ticker
│   │   ├── analyze/page.tsx   # Live multi-agent analysis page (PDF dropzone, Tavily search)
│   │   ├── report/[id]/       # Dynamic report page with evidence drawer & checklist
│   │   ├── reports/page.tsx   # Reports archive dashboard
│   │   ├── login/page.tsx     # Supabase Auth sign-in
│   │   ├── signup/page.tsx    # Supabase Auth registration
│   │   ├── watchtower/        # Change detection radar
│   │   ├── campus/            # College notices auditor
│   │   └── officer/           # Consistency auditor console
│   ├── components/
│   │   ├── Logo.tsx           # L3 Missing Line geometric mark
│   │   ├── Navbar.tsx         # Navigation bar with auth state & Command Palette
│   │   ├── Footer.tsx         # Global footer
│   │   └── ui.tsx             # Design system components
│   ├── lib/
│   │   ├── api.ts             # API client, SSE stream reader, and auth methods
│   │   └── sample.ts          # Real verified NSP audit dataset
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tailwind.config.ts     # OLED Midnight theme configuration
│   └── tsconfig.json          # TypeScript configuration
├── docs/                      # Original Blueprints, UI Design System, and Project Plans
├── .env.example               # Clean environment variables template
├── .gitignore                 # Secrets & environment protection
└── README.md                  # Complete project documentation
```

---

## 🔒 Security & Privacy

* **Zero Leaks:** `.env` and `.env.local` files are strictly gitignored.
* **Row-Level Security:** Supabase tables protected with RLS policies.
* **$k$-Anonymity ($k \ge 10$):** Confusion dashboard suppresses small cohort data to prevent re-identification.
* **Quote Evidence Requirement:** Findings without an exact string match in reviewed sources are dropped by the Evidence Auditor.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
