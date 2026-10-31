# DarkSpot Atlas 🌐🔍
> *Multi-Agent AI Platform jo batata hai ki aapki jaankari mein kya missing, purana ya contradictory hai*

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20Postgres-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

---

## 📌 Problem Statement (The Digital Dark Spot)
Internet par jaankari ki kami nahi hai, **bharosemand aur complete jaankari ki kami hai.**
Ek student, kisaan, job-seeker ya citizen jab koi zaroori decision leta hai (scholarship, admission, sarkari yojana, loan), to usse 5–10 websites, PDFs, notices aur blogs dekhne padte hain:
1. **Scattered Info:** Eligibility ek portal par, documents list dusri jagah, deadline teesri jagah.
2. **Outdated Info:** Coaching portals aur purane PDFs mein pichle saal ki deadline ya rules chalte rehte hain.
3. **Conflicting Info:** Ek source kehta hai *income certificate* chahiye, dusra bolta hai *affidavit* chalega.
4. **Unknown Unknowns:** User ko pata hi nahi hota ki renewal condition, last date extension ya official circular check karna tha.

> **Mool Fark:** Baaki tools info laane (search) ya summarize karne par kaam karte hain. **DarkSpot Atlas "kya missing, purana ya contradictory hai" dhoondhta hai.**

---

## 💡 Solution Overview
**DarkSpot Atlas** ek web-based, multi-agent AI audit engine hai jo ek topic ke multiple sources (official portals, PDFs, notices, guidelines) ko ek saath inspect karta hai:
* **Gaps:** Expected attributes ke mutabiq kya missing hai.
* **Conflicts:** Do sources kahan aapas mein lad rahe hain (side-by-side evidence quotes).
* **Outdated:** Kaunsa circular purana ho chuka hai (temporal decay + cycle year).
* **Verify-Next Checklist:** Priority ke saath user ko kya pehle verify karna chahiye.
* **Abstain Mode:** Jahan source mein info nahi hai, system guess nahi karta, seedha bolta hai: *"Reviewed sources mein nahi mila."*

---

## 🏗️ Multi-Agent Architecture

```
User Question / Topic
         │
         ▼
┌──────────────────┐
│   Orchestrator   │
└────────┬─────────┘
         ├─────────────────────────────────────────┐
         ▼                                         ▼
┌──────────────────┐                      ┌──────────────────┐
│   Source Scout   │                      │  Template Agent  │
│(Live URL/PDF/Web)│                      │(Expected Schema) │
└────────┬─────────┘                      └────────┬─────────┘
         ▼                                         │
┌──────────────────┐                               │
│ Claim Extractor  │                               │
│ (Quote Verified) │                               │
└────────┬─────────┘                               │
         ├────────────────────┬────────────────────┤
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Conflict Detector│ │    Gap Finder    │ │ Freshness Radar  │
│ (Math + NLI)     │ │ (Coverage & DSI) │ │ (Decay & Expiry) │
└────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
         └────────────────────┼────────────────────┘
                              ▼
                     ┌──────────────────┐
                     │ Challenger Agent │ (Adversarial Check)
                     └────────┬─────────┘
                              ▼
                     ┌──────────────────┐
                     │ Evidence Auditor │ (No quote => Block)
                     └────────┬─────────┘
                              ▼
                     ┌──────────────────┐
                     │   Verify-Next    │ (Priority + MMR)
                     │     Planner      │
                     └────────┬─────────┘
                              ▼
                     ┌──────────────────┐
                     │ Results & Atlas  │
                     └──────────────────┘
```

---

## 🧮 Mathematical Foundations & Core Formulas

1. **Source Trust Scoring ($F1$):**
   $$T(s) = 0.40 \cdot D + 0.20 \cdot A + 0.25 \cdot F + 0.15 \cdot Q$$
   * $D$: Domain tier (.gov/.nic = 1.0, .edu = 0.8, news = 0.6, blog = 0.3, other = 0.2)
   * $A$: Authority (source citation fraction)
   * $F$: Freshness index
   * $Q$: Content quality ratio ($1 - \text{boilerplate}$)

2. **Quote Verification ($F2$):**
   $$\text{sim}(a, b) = 1 - \frac{\text{Lev}(a, b)}{\max(|a|, |b|)}$$
   * Any extracted claim with $\text{sim} < 0.90$ is immediately dropped to prevent hallucinations.

3. **Freshness & Temporal Decay ($F7$):**
   $$F(s, a) = \exp(-\lambda_a \cdot \Delta t), \quad \lambda_a = \frac{\ln(2)}{h_a}$$
   * Half-lives: Deadline = 30 days, Documents = 365 days, Eligibility = 365 days.
   * If $F < 0.40 \implies \text{Outdated Warning}$.

4. **Gap Score & Dark Spot Index ($F5$ & $F12$):**
   $$G_a = 1 - \max_s [ P(a \mid \text{claim}_s) \cdot T(s) ]$$
   $$\text{Coverage } C = \frac{\sum_a w_a \cdot (1 - G_a)}{\sum_a w_a}, \quad \text{Dark Spot Index (DSI)} = 1 - C$$

5. **Verify-Next Priority & Diversity ($F11$):**
   $$\text{Priority } P_i = \text{Impact}_i \cdot \text{Uncertainty}_i \cdot \text{Urgency}_i$$
   $$\text{MMR Selection: } \operatorname{argmax}_i [ \lambda \cdot P_i - (1-\lambda) \cdot \max_{j \in S} \operatorname{sim}(i, j) ]$$

---

## 📂 Repository Structure

```
Digital-Dark-Spot/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point & CORS
│   │   ├── config.py          # Environment settings loader
│   │   ├── db.py              # Supabase Postgres connection
│   │   ├── api/               # REST & SSE endpoints
│   │   ├── agents/            # Multi-agent implementations (Scout, Extractor, etc.)
│   │   ├── algorithms/        # Mathematical engines (Trust, Normalize, Freshness, Gap, Conflict)
│   │   ├── templates/         # Schema templates (scholarship.json, scheme.json, admission.json)
│   │   └── llm/               # Gemini + Groq fallback LLM client
│   ├── tests/                 # Formula and pipeline unit tests
│   ├── requirements.txt       # Python dependencies
│   └── schema.sql             # Supabase PostgreSQL schema with RLS
├── docs/                      # Blueprints, research links, and build plans
├── .env.example               # Template for environment variables
├── .gitignore                 # Secrets protection
└── README.md                  # Project documentation
```

---

## 🚀 Quickstart & Setup Guide

### 1. Clone the repository
```bash
git clone https://github.com/Arpit312/Digital-Dark-Spot.git
cd Digital-Dark-Spot
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your API credentials:
```bash
cp .env.example .env
```
Required credentials:
* `GEMINI_API_KEY`: Google AI Studio
* `GROQ_API_KEY`: Groq Console (Fast fallback)
* `TAVILY_API_KEY`: Tavily Search
* `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Supabase Project

### 3. Database Setup (Supabase)
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Copy and run the entire script from [`backend/schema.sql`](backend/schema.sql).
3. This creates all tables, vector extensions, and RLS policies.

### 4. Install Dependencies & Run Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

---

## 🛡️ Reliability & Trust Rules
* **No hallucinated claims:** Evidence quote verification against original text with Levenshtein threshold.
* **Deterministic comparison:** Numbers, dates, and amounts are never compared by an LLM.
* **Cold-start & offline resilience:** Ingested sources are hashed via SHA-256 for rapid lookup.
* **Strictly Real Data:** Live sources fetched via Tavily and direct official portals.
