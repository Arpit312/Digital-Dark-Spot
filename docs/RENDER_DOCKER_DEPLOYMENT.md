# 🚀 DarkSpot Atlas – Render Backend Docker Deployment Guide

Backend ko Render pe Docker container ke through deploy karne ke liye pura setup ready aur test ho chuka hai.

---

## 🛠️ Kya-kya Fix & Ready Kiya Gaya Hai?

1. **Dynamic `$PORT` Binding**:
   - Render dynamically `$PORT` assign karta hai (e.g. `10000`).
   - Pehle Dockerfile me `--port 8000` hardcoded tha, jisse Render pe port mismatch aur timeout crash hota. Ab shell expansion `sh -c "exec uvicorn ... --port ${PORT:-8000} --workers ${WORKERS:-2}"` ke sath configured hai.

2. **Git Build Safety (`.env` Fix)**:
   - Pehle Dockerfile me `COPY .env .env` tha. Kyunki `.env` git repository me ignore hota hai, Render pe `file not found` build fail ho jata tha. Isko safely remove kar diya gaya hai. Secrets Render Dashboard se inject hote hain.

3. **`python-multipart` Dependency**:
   - FastAPI ke `/sources/upload` file-upload endpoint ke liye `python-multipart` required tha. Isko `requirements.txt` me add kar diya gaya hai.

4. **Memory Optimization (Render Free/Starter Tier)**:
   - 4 uvicorn workers Render ke 512MB RAM free tier pe Out-Of-Memory (OOM) crash karte the. Ab default `WORKERS=2` (configurable via env) kar diya gaya hai.

5. **Endpoints & Healthcheck Verified**:
   - `/health` aur root `/` endpoints active hain aur Docker container healthcheck me test pass kar chuke hain.

6. **Blueprint (`render.yaml`)**:
   - `runtime: docker`, `dockerfilePath: ./Dockerfile`, `dockerContext: .` ke sath update kar diya gaya hai.

---

## 📋 Deployment Methods

### Option 1: 1-Click Blueprint (Recommended)
Agar aapka GitHub repo connected hai:
1. [Render Dashboard](https://dashboard.render.com/) me jayein.
2. Click **New +** → **Blueprint**.
3. Apna GitHub repository (`Digital-Dark-Spot`) select karein.
4. Render automatically `render.yaml` detect karega jisme `darkspot-backend` (Docker), `darkspot-frontend`, aur `darkspot-admin` configured hain.
5. Environment Variables prompt me apni keys daalein aur **Apply** click karein.

---

### Option 2: Manual Web Service Setup (Docker)
Agar sirf Backend Web Service alag se banani hai:

1. [Render Dashboard](https://dashboard.render.com/) me jayein.
2. Click **New +** → **Web Service**.
3. Click **Build and deploy from a Git repository** → Next.
4. Repository select karein: `Digital-Dark-Spot`.
5. Configuration settings daalein:
   - **Name**: `darkspot-backend`
   - **Region**: `Frankfurt (EU Central)` ya `Oregon (US West)` (Supabase region ke paas)
   - **Branch**: `main`
   - **Root Directory**: *(empty chhod dein - default `.`)*
   - **Runtime**: **Docker**
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`
   - **Instance Type**: **Free** (ya Starter for 24/7 uptime)

6. **Health Check Path**:
   - `/health`

---

## 🔑 Required Environment Variables

Render Dashboard me **Environment** tab me jaakar ye variables add karein:

| Key | Example / Value | Description |
|---|---|---|
| `PORT` | `8000` | (Render automatically injects, default 8000 fallback) |
| `HOST` | `0.0.0.0` | Listen host |
| `WORKERS` | `2` | Uvicorn worker count (512MB RAM safe) |
| `GEMINI_API_KEY` | `AIzaSy...` | Google Gemini API Key |
| `GROQ_API_KEY` | `gsk_...` | Groq API Key |
| `TAVILY_API_KEY` | `tvly-...` | Tavily Web Search API Key |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase Project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Public / Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase Service Role Key |
| `DATABASE_URL` | `postgresql://postgres:...@db...` | Supabase PostgreSQL Connection String |
| `SUPABASE_JWT_SECRET` | `your-jwt-secret` | Supabase JWT Secret |
| `USE_LOCAL_NLI` | `false` | Render pe false rakhein (lightweight cloud LLM mode) |
| `CORS_ORIGINS` | `https://darkspot-frontend.onrender.com,https://darkspot-admin.onrender.com,http://localhost:3000,http://localhost:3001` | Allowed frontend URLs |

---

## 🧪 Local Docker Verification (Completed)

Local Docker daemon par test kar ke verify kar liya gaya hai:
```bash
# Build test
docker build -t darkspot-backend-test .

# Run test
docker run -d --name darkspot-backend-test -p 8000:8000 -e PORT=8000 darkspot-backend-test

# Health check test
curl http://localhost:8000/health
# Output: {"status":"ok","service":"DarkSpot Atlas API","version":"1.0.0"}

# Root test
curl http://localhost:8000/
# Output: {"status":"online","service":"DarkSpot Atlas API","version":"1.0.0","health":"/health","docs":"/docs"}
```

Container status: **healthy** ✅
Ready for Render deployment! 🚀
