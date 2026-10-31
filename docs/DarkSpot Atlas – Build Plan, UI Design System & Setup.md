# DarkSpot Atlas – Build Plan (Step by Step)

*Setup → Backend → AI → Website → App → Testing → Deploy → Submission. Saath mein UI design system, logo aur free keys.*

Deadline: **1 Nov 2026, 5:00 PM** (Unista). Is plan mein sab kuch is time ke hisaab se priority mein hai. Jo cheez late ho, use roadmap mein daal do.

## 1. Ab tak ka output (kya ready hai)

| Cheez | Status |
| --- | --- |
| Project concept, problem statement, solution, agents, features | Done (Project Document) |
| Research links, datasets, tools | Done (Research doc) |
| 18 features ke formulas + Anti-gravity prompts + Master Prompt | Done (AI Engine Blueprint) |
| GitHub description + README opening | Done |
| **Code, UI, logo, deploy, demo video** | **Ab banana hai (ye plan)** |

## 2. Final Decisions (confuse mat ho, ye fix rakho)

| Cheez | Choice | Kyun |
| --- | --- | --- |
| Frontend (website) | **Next.js 14 + TypeScript + Tailwind + shadcn/ui** | Fast, deploy easy, PWA bhi ban jaata hai |
| App | **PWA first** (installable), baad mein optional Android APK (Capacitor) | 1 din mein alag native app possible nahi, PWA ek hi codebase |
| Backend | **Python 3.11 + FastAPI (async)** | AI/ML libraries yahin hain |
| Database | **Supabase** (Postgres + pgvector + Auth + Storage, free) | Ek hi jagah DB, vector search, login, files |
| Auth | **Supabase Auth** (email + Google login) | Free, ready, JWT |
| LLM (agents) | **Gemini API (free tier)** + fallback **Groq** | Free, fast. Claude API paid hai, agar credits hain to use kar sakte ho |
| Embeddings | `paraphrase-multilingual-MiniLM-L12-v2` (sentence-transformers) | Chhota, Hindi support, free hosting par chal jaata hai |
| NLI (contradiction) | `MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7` | Hindi+English, neural net |
| Search (permitted results) | **Tavily** ya **Brave Search API** (free tier) | Sources auto-retrieve |
| Deploy | Frontend **Vercel**, Backend **Hugging Face Spaces (Docker)** ya **Render** | Free |
| Tests | pytest, Vitest, Playwright | Neeche detail |

**Honest warning:** mDeBERTa (\~1 GB) free CPU server par slow ho sakta hai. Plan B: pehle NLI step LLM se karo (JSON verdict: entail/contradict/neutral), aur mDeBERTa ko optional switch rakho (`USE_LOCAL_NLI=true`). Isse demo kabhi nahi rukega.

## 3. Free API Keys aur Tools kahan se laoge

*Free tier ki limits badalti rehti hain, signup ke time ek baar check kar lena.*

| Kya chahiye | Kahan se | Link |
| --- | --- | --- |
| Gemini API key (LLM + embeddings) | Google AI Studio | https://aistudio.google.com |
| Groq API key (fast fallback LLM) | Groq Console | https://console.groq.com |
| OpenRouter (free models, optional) | OpenRouter | https://openrouter.ai |
| Claude API (agar credits hain) | Anthropic Console | https://console.anthropic.com |
| Hugging Face token (models download) | HF Settings | https://huggingface.co/settings/tokens |
| Search API | Tavily | https://tavily.com |
| Search API (alternative) | Brave Search API | https://brave.com/search/api |
| Database + Auth + Storage | Supabase | https://supabase.com |
| Redis cache (optional) | Upstash | https://upstash.com |
| Frontend deploy | Vercel | https://vercel.com |
| Backend deploy | Hugging Face Spaces | https://huggingface.co/spaces |
| Backend deploy (alternative) | Render | https://render.com |
| Code hosting | GitHub | https://github.com |
| Python 3.11 | python.org | https://www.python.org/downloads |
| Node.js 20 LTS | nodejs.org | https://nodejs.org |
| Git | git-scm | https://git-scm.com |
| Docker (deploy ke liye) | Docker Desktop | https://www.docker.com/products/docker-desktop |
| API testing | Bruno / Postman | https://www.usebruno.com |
| Fonts | Google Fonts / Fontsource | https://fonts.google.com |
| Icons | Lucide | https://lucide.dev |
| Design / logo | Figma (free) | https://www.figma.com |
| Screen recording (demo video) | OBS Studio | https://obsproject.com |
| Anti-gravity (AI IDE) | Google Antigravity | https://antigravity.google |

**`.env` file (kabhi GitHub par push mat karna):**

```
GEMINI_API_KEY=
GROQ_API_KEY=
TAVILY_API_KEY=
HF_TOKEN=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_JWT_SECRET=
DATABASE_URL=
USE_LOCAL_NLI=false
```

`.gitignore` mein `.env` zaroor daalo, aur repo mein sirf `.env.example` (khali values) rakho.

## 4. Database Plan (Supabase Postgres)

`CREATE EXTENSION vector;` pehle chalao.

| Table | Important columns | Kaam |
| --- | --- | --- |
| `profiles` | id (auth user), role (citizen / officer / admin), department, verified | Roles |
| `analyses` | id, user\_id, question, topic\_type, status, coverage, dsi, created\_at | Har analysis run |
| `sources` | id, analysis\_id, url, title, domain, tier, text, sha256, published\_at, trust | F1 |
| `chunks` | id, source\_id, text, embedding vector(384), position | F4 retrieval |
| `claims` | id, source\_id, attribute, value\_raw, value\_norm, date, quote, location, confidence | F2–F3 |
| `findings` | id, analysis\_id, type (gap/conflict/outdated/unanswered), attribute, statement, evidence (jsonb), confidence, label, severity | F5–F10 |
| `checklist_items` | id, analysis\_id, finding\_id, action, priority, link, done | F11 |
| `tracked_sources` | id, user\_id, url, last\_hash, last\_checked | F13 |
| `alerts` | id, tracked\_id, change\_summary, before, after, created\_at | F13 |
| `signed_facts` | id, scheme, attribute, value, valid\_from, valid\_to, signatures (jsonb) | F15 |
| `supersession_edges` | id, from\_doc, to\_doc, effective\_date, quote | F8 |
| `audit_log` | id, actor, action, payload, created\_at (append-only) | Security |
| `gold_set` | id, topic, findings\_labelled (jsonb) | F10, F18 |
| `query_events` | id, scheme, step, district, root\_cause, created\_at | F14 (anonymised) |

**Security:** Supabase **Row Level Security (RLS)** on karo: user sirf apni `analyses` dekh sake. Officer tables par `role = 'officer' AND verified = true` policy.

## 5. Authentication Plan

1. Supabase Dashboard → Authentication → Providers: **Email** + **Google** on karo (Google ke liye Google Cloud Console mein OAuth client banao: https://console.cloud.google.com).
2. Frontend: `@supabase/ssr` se login/signup pages. Guest mode bhi rakho (bina login ke 1 analysis), taaki judges turant try kar sakein.
3. Backend: har request mein `Authorization: Bearer <JWT>`; FastAPI mein JWT verify (PyJWT, `SUPABASE_JWT_SECRET`), user id nikalo.
4. Roles: `profiles.role`. Default `citizen`.
5. **Officer demo flow:** admin ek invite link banata hai → officer signup → admin approve karta hai (`verified = true`) → Officer Console khulta hai. Production mein department email/DSC lagega, ye demo mein clearly likho.
6. Rate limiting: `slowapi` (guest: 5 analyses/hour).

## 6. Build Plan (Hour by Hour)

Jitna time bacha hai uske hisaab se hours kam/zyada karo, par **order mat badlo**.

### Phase 0: Setup (1 hour)

- [ ] GitHub repo banao (monorepo: `/backend`, `/frontend`, `/docs`, `/data`)
- [ ] Python venv, Node install, Supabase project, sab API keys, `.env`
- [ ] Anti-gravity mein repo kholo → **Master Prompt** paste karo
- [ ] Supabase mein tables banao (section 4)

### Phase 1: Backend core + AI pipeline (7 hours)

| Step | Feature | Output |
| --- | --- | --- |
| 1 | **F1** ingestion + trust | URL/PDF → clean text + trust score |
| 2 | **F3** normalization (pehle, kyunki deterministic aur easy) | dates/amounts clean |
| 3 | **F2** claim extraction (Gemini JSON mode) | claims with quote verification |
| 4 | **F5** template + gap detector | gap list + coverage |
| 5 | **F6** conflict detector | conflicts with both quotes |
| 6 | **F7** freshness | outdated flags |
| 7 | **F11** verify-next | checklist |
| 8 | Orchestrator: sab agents ko `asyncio.gather` + SSE streaming | `/analyze` endpoint |

**Milestone 1:** terminal/Bruno se ek scholarship ke 5 sources daalo → JSON mein gaps/conflicts/outdated/checklist aaye. **Ye hone ke baad hi frontend shuru karo.**

### Phase 2: Website (7 hours, parallel mein chal sakta hai)

| Step | Page / Component | Notes |
| --- | --- | --- |
| 1 | Design tokens + layout + navbar + theme (section 8) | Pehle ye, baaki sab iske upar |
| 2 | Landing page | Hero, "kaise kaam karta hai", demo button |
| 3 | Analyze page | Question box, source add (URL/PDF/search), live agent progress (SSE) |
| 4 | Results dashboard | Key info, Gap heatmap (F12), Conflicts side-by-side, Outdated, Unanswered |
| 5 | **Evidence viewer** | Finding par click → side panel with quote + source link |
| 6 | Verify-Next checklist | Tick, priority badges, export PDF |
| 7 | Login/Signup + saved reports | Supabase Auth |
| 8 | Accuracy page (F18) | Precision/recall/ECE table |

### Phase 3: Trust layer (3 hours)

- [ ] **F9** Challenger agent (5 votes concurrent)
- [ ] **F10** Evidence auditor + abstain; neural net training script (SAMPLE data se), calibration
- [ ] UI mein labels: *Sourced Fact / Potential Gap / Uncertain / Not found in reviewed sources*

### Phase 4: Extra features (sirf agar time bacha)

| Priority | Feature | Kaise |
| --- | --- | --- |
| 1 | **F4** hybrid retrieval | Jab sources zyada hon ya search se aayen |
| 2 | **F13** Watchtower | Ek scheduler + alerts page |
| 3 | **F8 + F16** supersession + consistency auditor (thin demo) | Officer Console mein ek screen |
| 4 | **F17** Hindi/English toggle | UI strings + LLM output language |
| 5 | **F14, F15** | Sirf roadmap slide + UI mock (clearly "Roadmap" label) |

### Phase 5: App (PWA) (1.5 hours)

- [ ] `next-pwa` ya manifest + service worker; installable on Android/iOS home screen
- [ ] Mobile layouts test (360px width), bottom nav
- [ ] Voice input: browser Web Speech API (free, `hi-IN` + `en-IN`)
- [ ] Lite mode toggle (text-only)
- [ ] Optional: Capacitor se APK (https://capacitorjs.com), sirf agar time bacha

### Phase 6: Testing (2 hours)

| Kya | Tool | Kya test karna |
| --- | --- | --- |
| Formulas (unit) | **pytest** | Trust score, BM25/RRF, Jaccard, freshness decay, MMR, ECE, conformal threshold, k-anonymity |
| Normalization | pytest | "15/11/25", "1.5 lakh", Hindi dates |
| Pipeline (integration) | pytest + saved HTML/PDF fixtures | Offline, same output har baar |
| API | Bruno/Postman collection | `/analyze`, auth, rate limit |
| Frontend components | Vitest + Testing Library | Evidence viewer, checklist |
| End-to-end demo flow | **Playwright** | Question → sources → results → evidence click → checklist |
| AI accuracy | `eval.py` on gold set | Precision, recall, F1, faithfulness (target 1.0) |
| Security | Manual | RLS check, `.env` leak check, officer route guarded |
| Mobile | Chrome DevTools + real phone | PWA install, layout |

GitHub Actions mein sirf `pytest` chalao (chhota CI badge README mein achha lagta hai).

### Phase 7: Deploy (1.5 hours)

1. Backend: `Dockerfile` (python:3.11-slim) → Hugging Face Space (Docker) ya Render. Env variables wahin set karo.
2. Frontend: Vercel par repo connect, `NEXT_PUBLIC_API_URL` set karo.
3. CORS: backend mein sirf apna Vercel domain allow karo.
4. Smoke test: live link par poora demo flow.
5. Free server so jaata hai (cold start), demo se pehle ek baar kholkar "warm" karo.

### Phase 8: Submission assets (2 hours, last mein mat chhodo)

- [ ] **Project description** (Unista field): Problem, solution, how it works, features, uniqueness, tech stack, future scope (Project Document se copy)
- [ ] **GitHub repo** public + README + setup instructions (**mandatory**)
- [ ] Live demo link (optional), **demo video 2–3 min** (OBS)
- [ ] PPT (optional), 6–8 slides
- [ ] Final check: repo access, links open hote hain, `.env` push nahi hua

**Demo video script (3 min):** (1) problem 20s → (2) question daalo + 5 sources add → (3) agents live progress → (4) gap + conflict + outdated dikhao → (5) ek finding par evidence viewer kholo → (6) Verify-Next checklist → (7) abstain example ("not found in reviewed sources") → (8) Accuracy page + roadmap (officer modules).

## 7. Backend Structure

```
backend/
  app/
    main.py            # FastAPI app, CORS, routers
    config.py          # env settings (pydantic-settings)
    auth.py            # JWT verify, role guards
    db.py              # Supabase/SQLAlchemy async
    api/
      analyze.py       # POST /analyze (SSE stream)
      sources.py       # add URL/PDF, search
      findings.py      # GET findings, evidence
      checklist.py     # GET/PATCH checklist
      watch.py         # F13 tracked sources, alerts
      officer.py       # F8/F14/F15/F16 (role guarded)
      eval.py          # F18 metrics
    agents/
      orchestrator.py  scout.py  extractor.py  template.py
      conflict.py  gap.py  freshness.py  challenger.py
      auditor.py  planner.py  explainer.py
    algorithms/
      trust.py  normalize.py  retrieval.py  conflict_math.py
      freshness.py  supersession.py  priority.py  watch.py
      privacy.py  signatures.py  metrics.py
    models/
      confidence_net.py   # PyTorch MLP (F10)
      train_confidence.py
      nli.py  embeddings.py
    templates/ scholarship.json scheme.json admission.json
    llm/ client.py       # Gemini/Groq wrapper, retries, JSON mode
  tests/
  data/ gold_set.jsonl  fixtures/
  Dockerfile  requirements.txt  .env.example
```

**Main endpoints:**

| Endpoint | Kaam |
| --- | --- |
| `POST /analyze` | Question + sources → SSE stream (agent progress) + final result |
| `POST /sources/search` | Tavily se permitted search results |
| `POST /sources/upload` | PDF upload |
| `GET /analyses/{id}` | Saved result |
| `GET /findings/{id}/evidence` | Evidence viewer data |
| `PATCH /checklist/{id}` | Tick/untick |
| `POST /watch` / `GET /alerts` | Watchtower |
| `GET /eval/report` | Accuracy page data |
| `/officer/*` | Role-guarded modules |

**Reliability rules:** LLM calls par timeout + 2 retries + provider fallback (Gemini → Groq). Har agent ka output Pydantic schema se validate. Cache by SHA-256. Ek agent fail ho to baaki results dikhao, pura analysis fail mat karo ("Freshness check unavailable" jaisa message).

## 8. UI Design System (Black / White / Gray, Premium)

**Goal:** serious, calm, "developer-tool" jaisa premium look (Linear, Vercel, Stripe jaisa feel). Koi AI-generated wala look nahi.

### Color tokens

| Token | Dark (default) | Light |
| --- | --- | --- |
| `--bg` | `#0A0A0A` | `#FFFFFF` |
| `--surface` | `#111111` | `#FAFAFA` |
| `--surface-2` (cards, panels) | `#171717` | `#F5F5F5` |
| `--border` | `#262626` | `#E5E5E5` |
| `--border-strong` | `#404040` | `#D4D4D4` |
| `--text` | `#FAFAFA` | `#0A0A0A` |
| `--text-muted` | `#A3A3A3` | `#525252` |
| `--text-subtle` | `#737373` | `#737373` |
| `--primary` (buttons) | `#FAFAFA` text on `#0A0A0A` invert | `#0A0A0A` bg, `#FAFAFA` text |
| `--focus-ring` | `#FAFAFA` at 40% | `#0A0A0A` at 40% |

Tailwind mein ye CSS variables bana lo, aur components sirf variables use karein (hard-coded hex nahi).

**Status ko kaise dikhayein (sirf black/white/gray mein):** colour ke bina bhi alag dikhna chahiye. Har type ka alag **icon + label + border style**:

| Type | Icon (Lucide) | Style |
| --- | --- | --- |
| Potential gap | `circle-dashed` | Dashed border, gray |
| Conflict | `git-compare` | Solid strong border, white/black filled badge |
| Outdated | `clock` | Dotted border |
| Unanswered | `circle-help` | Outline badge |
| Sourced fact | `check` | Plain, no emphasis |

Agar baad mein ek accent chahiye ho (accessibility ke liye), sirf ek **muted** shade use karo, par default design strictly monochrome rakho.

### Typography

- **UI:** Inter (variable) via `next/font`
- **Evidence quotes / numbers / code:** JetBrains Mono
- **Hindi:** Noto Sans Devanagari
- Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48. Weights 400, 500, 600 only. Headings mein `letter-spacing: -0.02em`.
- Line-height 1.5 body, 1.2 headings.

### Spacing, shape, depth

- 4px grid (4, 8, 12, 16, 24, 32, 48, 64)
- Radius: 8px (inputs/buttons), 12px (cards), 999px (badges)
- Depth sirf 1px borders se; shadow almost nahi (dark mode mein bilkul nahi)
- Max content width 1200px, results page par 2-column (list + evidence panel)

### Navbar

- Sticky, **56px** height, `backdrop-blur` + 1px bottom border, bg `--bg` at 80%
- Left: logo mark + wordmark. Center/Left links: *Analyze, Reports, Watchtower, Accuracy, Docs*. Right: search (⌘K), theme toggle, login / avatar menu
- Active link: text full white + 2px underline; baaki muted
- Mobile: hamburger → sheet menu, plus bottom tab bar (App/PWA mode): Analyze, Reports, Alerts, Profile

### Search bar (global)

- **Command palette** (cmdk library: https://cmdk.paco.me), shortcut `⌘K` / `Ctrl+K`
- Groups: *Reports, Sources, Findings, Pages, Actions*, recent searches
- Input 40px height, border 1px, placeholder muted: "Search reports, sources, findings…" and keyboard hints (`↑↓`, `↵`, `esc`) footer mein
- Main analyze question box alag: bada (56px), center mein, suggestions chips neeche ("Scholarship", "Admission", "Govt scheme")

### Background

- Solid `--bg` base
- Hero section par **subtle dot grid** (1px dots, 6% opacity, 24px spacing) + upar ek bahut halka radial fade (gray, 4–6% opacity)
- Optional: 2–3% noise texture (SVG feTurbulence)
- **Mat use karo:** purple/blue gradients, glowing blobs, glassmorphism overload, sparkle ✨ icons, emoji icons, gradient text

### Icons

- Sirf **Lucide** (lucide-react), ek hi set poore app mein, **stroke 1.5**, size 16/20/24
- Emoji kahin nahi. Custom illustrations nahi, empty states mein sirf icon + 1 line text + ek button

### Components (shadcn/ui, par customize karke)

Button (primary/secondary/ghost), Input, Textarea, Badge, Card, Tabs, Sheet (evidence panel), Dialog, Tooltip, Command, Table, Skeleton, Progress, Toast (sonner). Default shadcn theme badal ke upar ke tokens lagao taaki "template" jaisa na lage.

### Motion

- 150–200ms, `ease-out`, sirf opacity/translate (8px)
- Agent progress: steps list mein ek-ek karke check hota hai (no spinner overload)
- `prefers-reduced-motion` respect karo

### Copywriting (AI jaisa na lage)

- Chhote, seedhe sentences. "Reviewed sources mein nahi mila" jaisi precise language
- Loading/empty/error states har page par
- Real numbers aur real source names dikhao (placeholder lorem nahi)

### Key screens

1. **Landing:** headline + question box + 3-step explainer + sample report preview
2. **Analyze:** question, sources list (trust tier badge), agent progress timeline
3. **Results:** top summary strip (Coverage %, Dark Spot Index, #gaps/#conflicts/#outdated), tabs (Gaps / Conflicts / Outdated / Unanswered / Key info), heatmap, right side evidence panel
4. **Checklist:** priority groups, checkbox, official link button
5. **Accuracy:** metrics table + ablation
6. **Officer Console:** thin modules, "Roadmap" label jahan implemented nahi

## 9. Logo

**Concept:** ek ring jisme ek chhota **gap (break)** hai, aur beech mein ek chhota dot. Ring = jaankari ka circle, gap = *dark spot* jo missing hai, dot = jo tum dekhna chahte ho. Simple geometric mark, tech companies (Vercel, Linear style) jaisa.

**Rules:**

- Sirf black ya white (single colour). Gradient nahi
- Minimum size 16px par bhi clear, favicon ban sake
- Wordmark: Inter Semibold, thoda tight tracking, mark ke saath 8px gap
- Clear space = mark ki ring thickness ka 2x

**Starter SVG (isse hi use ya Figma mein refine karo):**

```
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="16" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="78 22.5" transform="rotate(-55 24 24)"/>
  <circle cx="24" cy="24" r="4.5" fill="currentColor"/>
</svg>
```

**Files banani hain:** `logo-mark.svg`, `logo-wordmark.svg` (mark + naam), `favicon.svg`, `apple-touch-icon.png` (180px), `og-image.png` (1200×630, black bg, logo + tagline). Naam final hone ke baad wordmark update karo.

## 10. Features ko kaise add karna hai (Anti-gravity ke saath)

1. Har feature ka prompt **AI Engine Blueprint** se copy karo (Master Prompt pehle ek baar).
2. Ek time par **ek feature**. Jab tests pass ho jayein, tabhi agla.
3. Har feature ke baad: `pytest` chalao, Bruno se endpoint check, git commit (`feat: F6 conflict detector`).
4. Anti-gravity ko kehna: "Write unit tests for the formulas first, then the implementation." Isse formulas exactly sahi rehte hain.
5. Frontend ke liye prompt example:

```
Build the Results page in Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui. Strictly black/white/gray design tokens (CSS variables, dark default + light). Inter + JetBrains Mono. Lucide icons only, stroke 1.5, no emojis, no gradients, no glow. 1px borders, radius 8/12, minimal shadows. Layout: summary strip (Coverage, Dark Spot Index, counts), tabs (Gaps, Conflicts, Outdated, Unanswered, Key info), two-column with a right-side Sheet evidence panel showing quote, source link, trust tier and confidence label. Status types differ by icon + border style (dashed/solid/dotted), not by colour. Fetch from GET /analyses/{id}. Include loading skeletons, empty and error states, and keyboard accessibility.
```

## 11. Risk Control (time bachane ke rules)

- **Pehle end-to-end chalao** (ugly bhi chalega), phir polish. Jo kaam nahi karta wo demo mein mat dikhao.
- Demo ke liye **ek fixed scholarship pack** (5–6 real sources + 1 purana page from Wayback) pehle se cache kar lo. Live internet fail ho to bhi demo chale.
- Free LLM ki rate limit ke liye results cache karo aur demo se pehle ek baar run karke saved result bhi rakho ("Load sample analysis" button).
- Officer modules ko sirf utna dikhao jitna bana ho, baaki "Roadmap" label ke saath.
- Commit har feature ke baad. Last 2 ghante mein koi naya feature nahi, sirf bugs, README, video.
- Neural net aur calibration ko "SAMPLE data par trained, real gold set expanding" honestly bolo.

## 12. Final Submission Checklist

- [ ] Repo public, README complete, `.env.example`, no secrets
- [ ] Live link kaam kar raha hai (aur warm hai)
- [ ] Demo flow bug-free 3 baar chalaya
- [ ] Evidence viewer har finding par chalta hai
- [ ] "Potential gap" labels aur abstain message dikh rahe hain
- [ ] Accuracy page (gold set results) ya clearly-labelled sample metrics
- [ ] Demo video upload, PPT (optional)
- [ ] Unista par project name, description, repo link submit (5:00 PM se kaafi pehle)
