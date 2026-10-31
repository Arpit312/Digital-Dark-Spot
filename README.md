# DarkSpot Atlas 🌐🔍
> *Multi-Agent AI Platform jo batata hai ki aapki jaankari mein kya missing, purana ya contradictory hai*

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E.svg)](https://supabase.com/)
[![PyTorch](https://img.shields.io/badge/ML-PyTorch%20Neural%20Net-EE4C2C.svg)](https://pytorch.org/)
[![Status](https://img.shields.io/badge/Status-100%25%20Real%20Data%20Verified-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-black.svg)](LICENSE)

---

## 📌 Problem Statement (The Digital Dark Spot)
Internet par jaankari ki kami nahi hai, **bharosemand aur complete jaankari ki kami hai.**
Ek student, kisaan, job-seeker ya citizen jab koi zaroori decision leta hai (scholarship, admission, sarkari yojana, loan), to usse 5–10 websites, PDFs, notices aur blogs dekhne padte hain:
1. **Scattered Info:** Eligibility ek portal par, documents list dusri jagah, deadline teesri jagah.
2. **Outdated Info:** Coaching portals aur purane PDFs mein pichle saal ki deadline ya expired rules chalte rehte hain.
3. **Conflicting Info:** Ek source kehta hai *income certificate* chahiye, dusra bolta hai *affidavit* chalega.
4. **Unknown Unknowns:** User ko pata hi nahi hota ki renewal condition, last date extension ya official circular check karna tha.

> **Core Difference:** Baaki tools info laane (search) ya summarize karne par kaam karte hain. **DarkSpot Atlas "kya missing, purana ya contradictory hai" dhoondhta hai — with 100% verified evidence quotes.**

---

## 💡 Solution Overview & Core Rules
* **100% Real Data Only:** System queries live official web portals, PDFs, and search feeds (Tavily API). Koi synthetic/fake response nahi.
* **Zero Hallucination (Abstain Mode):** Direct verbatim quote verification ($\text{sim} \ge 0.90$). Jo information nahi mili, system guess nahi karta, seedha bolta hai: *"Reviewed sources mein nahi mila."*
* **Deterministic Code for Math:** Dates, deadlines, ₹ amounts, and eligibility numbers are evaluated by exact deterministic algorithms, never left to LLM guesswork.
* **Two-Layer Adversarial Validation:** Har finding Challenger Agent aur Evidence Auditor se verify hone ke baad hi Atlas mein enter hoti hai.

---

## 🏗️ Multi-Agent Architecture

```
User Question / Policy Topic
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
│(Quote-Verified)  │                               │
└────────┬─────────┘                               │
         ├────────────────────┬────────────────────┤
         ▼                    ▼                    ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ Conflict Detector│ │    Gap Finder    │ │ Freshness Radar  │
│ (Deterministic)  │ │ (Coverage & DSI) │ │ (Decay & Expiry) │
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

## 🧮 Complete 18-Feature Mathematical Blueprint

| # | Feature | Exact Mathematical Formula / Algorithm |
| :--- | :--- | :--- |
| **F1** | **Source Trust Scoring** | $T(s) = 0.40 \cdot D + 0.20 \cdot A + 0.25 \cdot F + 0.15 \cdot Q$ |
| **F2** | **Claim Extraction & Quote Gate** | $\text{sim}(a, b) = 1 - \frac{\text{Lev}(a, b)}{\max(\|a\|, \|b\|)} \ge 0.90$, Confidence $p = \sigma(w_1 \text{sim} + w_2 \text{agree} + b)$ |
| **F3** | **Deterministic Normalization** | Dates (ISO-8601), ₹ Lakh/Crore to int, Jaccard document sets canonicalization |
| **F4** | **Hybrid Retrieval (RRF)** | $RRF(d) = \sum_i \frac{1}{60 + \text{rank}_i(d)}$ fusing BM25 ($k_1=1.5, b=0.75$) + Dense Cosine |
| **F5** | **Gap Score & Coverage** | $G_a = 1 - \max_s [ P(a \mid \text{claim}_s) \cdot T(s) ]$, Overall Coverage $C = \frac{\sum w_a(1-G_a)}{\sum w_a}$ |
| **F6** | **Conflict Detection** | $\|v_1 - v_2\| > 0$, Jaccard $J(A, B) = \frac{\|A \cap B\|}{\|A \cup B\|}$, Severity $\text{Sev} = P_{\text{con}} \cdot w_a \cdot \frac{T_1 + T_2}{2}$ |
| **F7** | **Freshness & Decay** | $F(s, a) = \exp(-\lambda_a \cdot \Delta t), \quad \lambda_a = \frac{\ln(2)}{h_a}$, Hard cycle year & expired check |
| **F8** | **Supersession Graph** | NetworkX DiGraph ($u \to v$), Kahn's topological sort for cycle-free valid document chains |
| **F9** | **Challenger Agent** | Bayesian log-odds update: $\text{logit}(p_{\text{final}}) = \text{logit}(p_{\text{prior}}) + \sum \log LR_i$ |
| **F10**| **Confidence Net & ECE** | PyTorch MLP $8 \to 16 \to 8 \to 1$, $ECE = \sum_m \frac{\|B_m\|}{n} \|\text{acc}(B_m) - \text{conf}(B_m)\|$, Conformal $\alpha=0.1$ |
| **F11**| **Verify-Next Priority** | $P = \text{Impact} \cdot \text{Uncertainty} \cdot \text{Urgency}$, MMR diversity selection ($\lambda=0.7$) |
| **F12**| **Heatmap & DSI** | Matrix $M[a][s] = P(a \mid \text{best claim in } s)$, Dark Spot Index $DSI = 1 - C$, Source Completeness |
| **F13**| **Watchtower Radar** | SimHash Hamming distance ($d_H \le 3$), CUSUM spike detection $S_t = \max(0, S_{t-1} + x_t - \mu - k)$ |
| **F14**| **Confusion & Privacy** | $k$-Anonymity cell suppression ($k \ge 10$), EWMA spike detection $E_t = \alpha x_t + (1-\alpha)E_{t-1}$ |
| **F15**| **Signed Facts & Drift** | Ed25519 dual cryptographic approval, MinHash Jaccard drift alert: $\text{Sev} = w_a \cdot T_{\text{signed}}$ |
| **F16**| **Consistency Auditor** | Consistency Score $CS = 1 - (\#\text{conflicts} / \#\text{comparable pairs})$, draft contradiction audit |
| **F17**| **Language & Lite Mode** | fastText language identification, lightweight payload $\le 30$ KB with brotli/gzip |
| **F18**| **Evaluation Suite** | Gold-set benchmarks: Precision, Recall, $F_1$, Faithfulness ratio ($=1.0$), Ablation report |

---

## 📂 Repository Structure

```
Digital-Dark-Spot/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point & CORS
│   │   ├── config.py          # Environment settings loader
│   │   ├── auth.py            # Supabase JWKS authentication service
│   │   ├── db.py              # Supabase PostgreSQL native REST client
│   │   ├── api/               # API routes
│   │   ├── agents/            # Multi-agent implementations (Scout, Extractor, Gap, Conflict, etc.)
│   │   ├── algorithms/        # Mathematical engines (Trust, Normalize, Freshness, Gap, Conflict, etc.)
│   │   ├── models/            # PyTorch Confidence Net & ML calibrations
│   │   ├── templates/         # Topic schemas (scholarship.json, scheme.json, admission.json)
│   │   └── llm/               # Gemini 2.5 Flash + Groq fallback client
│   ├── tests/                 # Unit tests & End-to-end verification suites
│   ├── requirements.txt       # Python dependencies
│   ├── schema.sql             # Supabase PostgreSQL schema with 14 verified tables
│   ├── run_migration.py       # Automated Supabase database migration runner
│   └── check_connections.py   # Complete system connectivity diagnostic tool
├── docs/                      # Original Blueprints, UI Design System, and Project Plans
├── .env.example               # Clean environment variables template
├── .gitignore                 # Secrets & environment protection
└── README.md                  # Project documentation
```

---

## 🚀 Live Health Status & Verification

All 6 core services verified and live:
* **Supabase PostgreSQL:** Connected (`aws-0-eu-west-1.pooler.supabase.com:5432`) - 14 public tables active.
* **Supabase REST API:** HTTP 200 Authenticated.
* **Supabase JWKS:** Endpoint reachable with public verification keys.
* **Tavily Live Search API:** Real-time web retrieval operational.
* **Google Gemini 2.5 Flash:** Live structured quote extraction active.
* **Groq Fallback (`openai/gpt-oss-120b`):** High-speed LLM fallback active.
