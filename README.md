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

## 🔑 System Access & Demo Credentials

DarkSpot Atlas provides unified role-based authentication across all platforms. Use the verified pre-configured credentials below:

| Portal | URL / App | Role | Email | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Admin Management Console** | `http://localhost:3001` | `admin` | `admin@darkspotatlas.org` | `admin123` |
| **Citizen Web Portal** | `http://localhost:3000` | `citizen` | `demo123@gmai.com` | `demo123` |
| **Mobile App (iOS / Android)** | `darkspot-app` (Expo) | `citizen` / `admin` | Quick Demo Buttons on Sign-in | Auto-filled |

> **Note:** All three applications connect to the same FastAPI backend (`http://127.0.0.1:8000`) and live Supabase PostgreSQL database. Changes made in the Admin Console (verifications, support ticket resolution, feature flags) update in real-time across the website and mobile app.

---

## 🏗️ End-to-End Multi-Client Architecture

```
 ┌────────────────────────┐  ┌─────────────────────────┐  ┌────────────────────────┐
 │   Next.js 14 Web       │  │  React Native / Expo    │  │  Next.js 15 Admin      │
 │   Citizen Portal       │  │  Mobile App (iOS/Android)│ │  Management Console    │
 │   (:3000)              │  │  (:8081 / Expo Go)      │  │  (:3001)               │
 └───────────┬────────────┘  └────────────┬────────────┘  └───────────┬────────────┘
             │                            │                           │
             └──────────────────────┐     │     ┌─────────────────────┘
                                    ▼     ▼     ▼
                        ┌───────────────────────────────┐
                        │      FastAPI Backend API      │
                        │    (Port 8000 / Uvicorn)      │
                        └───────────────┬───────────────┘
                                        │
         ┌──────────────────────────────┼──────────────────────────────┐
         ▼                              ▼                              ▼
 ┌──────────────────┐         ┌──────────────────┐           ┌──────────────────┐
 │   Source Scout   │         │ Claim Extractor  │           │ Supabase Cloud   │
 │ • Live Web Search│         │ • Verbatim Quote │           │ • PostgreSQL DB  │
 │   (Tavily API)   │         │   Gating (>=90%) │           │ • JWKS JWT Auth  │
 │ • PyMuPDF Parser │         │ • Deterministic  │           │ • 18 Live Tables │
 │ • Portal Ingest  │         │   Normalization  │           │ • Row Level Sec  │
 └──────────────────┘         └────────┬─────────┘           └──────────────────┘
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

### Step 4: Admin Management Console Setup (Next.js 15)

1. Navigate to the admin directory:
```bash
cd darkspot-admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (`darkspot-admin/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

4. Start development server:
```bash
npm run dev
```
Admin Console will be live at: **`http://localhost:3001`**  
Sign in with: `admin@darkspotatlas.org` / `admin123`

---

### Step 5: Mobile App Setup (React Native / Expo)

1. Navigate to the mobile app directory:
```bash
cd darkspot-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure your local network API URL in `darkspot-app/.env`:
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
```
*(For physical devices, replace `localhost` with your machine's Wi-Fi IP address, e.g. `http://192.168.1.15:8000`)*

4. Start Expo development server:
```bash
npm start
```
* Scan the displayed QR code with the **Expo Go** app on your iPhone or Android device, or press `a` for Android Emulator / `w` for Web preview.
* Quick 1-tap **Demo Citizen** and **Admin Account** buttons are available on the sign-in screen.

---

### Step 6: Docker Full-Stack Deployment (Production Ready)

With Docker installed on your machine, deploy the entire DarkSpot Atlas ecosystem (Backend + Citizen Web + Admin Console) with a single command:

1. **Verify your `.env` file** exists in the project root with your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=8000
```

2. **Build and launch the complete stack:**
```bash
docker compose up -d --build
```

3. **Check container health & logs:**
```bash
docker compose ps
docker compose logs -f backend
```

4. **Access your live services:**
- **FastAPI Backend:** `http://localhost:8000` (Docs: `http://localhost:8000/docs`)
- **Citizen Web Portal:** `http://localhost:3000`
- **Admin Management Console:** `http://localhost:3001`

5. **Stop the stack when needed:**
```bash
docker compose down
```

---

## 📡 Core API Endpoints

### Citizen & Analysis APIs
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
| `GET` | `/me` | Returns current authenticated user profile |
| `POST` | `/support/ticket` | Creates user support ticket tagged with source (`web` or `app`) |
| `GET` | `/support/tickets` | Lists user's submitted support triage tickets |

### Admin & Management APIs (Admin Auth Required)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/stats` | Aggregated real KPI metrics (Total Users, Analyses, Tickets, Sources) |
| `GET` | `/admin/timeseries?range=7d` | Audit activity trends over time |
| `GET` | `/admin/health` | Multi-service health monitoring (Supabase, LLM, Tavily) |
| `GET` | `/admin/users` | List registered user profiles with search and role filters |
| `PATCH`| `/admin/users/{id}` | Update user roles (`admin`, `citizen`, `officer`) or suspend access |
| `GET` | `/admin/verifications` | Officer verification request queue |
| `POST` | `/admin/verifications/{id}/approve` | Approve institutional officer status |
| `GET` | `/admin/sources` | Trust-scored domain whitelist & authority tiers |
| `GET` | `/admin/agents` | Live telemetry for all 8 analysis agents (runs, latency, error rate) |
| `GET` | `/admin/flags` | Live system feature toggles (Campus mode, Live search, SSE) |

---

## 📂 Project Structure

```
Digital-Dark-Spot/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point, CORS, Auth, Admin & Analysis routes
│   │   ├── config.py          # Environment settings loader
│   │   ├── auth.py            # Supabase JWKS authentication service
│   │   ├── db.py              # Supabase PostgreSQL native REST client
│   │   ├── agents/            # Multi-agent implementations (Scout, Extractor, Gap, Conflict, Challenger, etc.)
│   │   ├── algorithms/        # Mathematical engines (Trust, Normalize, Freshness, Gap, Conflict, etc.)
│   │   ├── models/            # PyTorch Confidence Net & ML calibrations
│   │   ├── templates/         # Domain schemas (scholarship.json, scheme.json, admission.json)
│   │   └── llm/               # Gemini 2.5 Flash + Groq fallback client
│   ├── tests/                 # End-to-end verification suites (verify_backend.py: 49/53 passed)
│   ├── requirements.txt       # Python dependencies
│   ├── schema.sql             # Supabase PostgreSQL schema with 18 verified tables
│   ├── run_migration.py       # Automated Supabase database migration runner
│   └── check_connections.py   # Complete system connectivity diagnostic tool
├── frontend/                  # Next.js 14 Citizen Web Portal (Port 3000)
│   ├── app/                   # App Router pages (analyze, report, watchtower, campus, officer)
│   ├── components/            # OLED Midnight design system & L3 Logo
│   ├── lib/                   # API client, SSE stream reader, and auth methods
│   ├── Dockerfile             # Production container definition
│   └── package.json           # Dependencies & build scripts
├── darkspot-admin/            # Next.js 15 Admin Management Console (Port 3001)
│   ├── app/                   # Admin pages (KPIs, Support queue, Users, Verifications, AI review)
│   ├── components/            # Smooth telemetry charts, Command palette (Ctrl+K), AI Copilot (Ctrl+J)
│   ├── lib/                   # Admin API client with zero-flicker localStorage cache
│   ├── Dockerfile             # Production container definition
│   └── package.json           # Dependencies & build scripts
├── darkspot-app/              # React Native / Expo Mobile App (iOS & Android)
│   ├── App.tsx                # Bottom tab & stack navigator
│   ├── src/
│   │   ├── screens/           # 16 Native screens (Home, Analyze, Report, Reports, Watchtower, Campus, Support, etc.)
│   │   ├── api.ts             # Resilient API client with SecureStore + fallback caching
│   │   ├── auth.tsx           # Mobile authentication provider
│   │   ├── theme.ts           # Midnight OLED mobile color tokens
│   │   └── ui.tsx             # Polished native UI primitives
│   ├── app.json               # Expo project configuration
│   └── package.json           # React Native dependencies
├── Dockerfile                 # Multi-stage production Dockerfile for FastAPI backend
├── docker-compose.yml         # Full-stack Docker Compose orchestrator
├── .env.example               # Clean environment variables template
├── .gitignore                 # Strict secrets and environment protection
└── README.md                  # Comprehensive platform documentation
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
