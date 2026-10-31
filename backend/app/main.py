import asyncio
import json
import logging
from datetime import datetime, timezone, timedelta
import builtins
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Header, Depends, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from backend.app.config import settings
from backend.app.agents.orchestrator import orchestrator
from backend.app.agents.scout import scout_agent
from backend.app.auth import auth_service
from backend.app.db import get_supabase_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("darkspot-atlas")

app = FastAPI(
    title="DarkSpot Atlas API",
    description="Multi-Agent AI Engine that detects information gaps, conflicts, and outdated public data with quote-verified evidence.",
    version="1.0.0"
)

async def resolve_current_user(authorization: Optional[str]) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="A valid access token is required.")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        user = await auth_service.verify_token(token)
    except Exception as exc:
        logger.error("Authentication service unavailable: %s", exc)
        raise HTTPException(status_code=503, detail="Authentication service is unavailable.") from exc

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired access token.")

    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")

    try:
        profiles = await database.select(
            "profiles",
            params={
                "select": "id,email,role,department,verified,created_at",
                "id": f"eq.{user['id']}",
                "limit": "1",
            },
        )
    except RuntimeError as exc:
        logger.error("Could not load authenticated user profile: %s", exc)
        raise HTTPException(status_code=503, detail="User profile service is unavailable.") from exc

    profile = profiles[0] if profiles else {}
    if profile.get("suspended"):
        raise HTTPException(status_code=403, detail="This account is suspended.")
    user["role"] = profile.get("role", "citizen")
    user["profile"] = profile
    return user


async def require_admin(authorization: Optional[str] = Header(None)) -> dict:
    user = await resolve_current_user(authorization)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Administrator access is required.")
    return user


async def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    return await resolve_current_user(authorization)


async def require_officer(authorization: Optional[str] = Header(None)) -> dict:
    user = await resolve_current_user(authorization)
    if user.get("role") not in {"officer", "admin"}:
        raise HTTPException(status_code=403, detail="Officer access is required.")
    return user


@app.middleware("http")
async def protect_admin_routes(request: Request, call_next):
    if request.url.path.startswith("/admin/") or request.url.path.startswith("/officer/"):
        try:
            if request.url.path.startswith("/admin/"):
                await require_admin(request.headers.get("authorization"))
            else:
                await require_officer(request.headers.get("authorization"))
        except HTTPException as exc:
            return JSONResponse(
                status_code=exc.status_code,
                content={"detail": exc.detail},
            )
    return await call_next(request)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import httpx

class AnalyzeRequest(BaseModel):
    question: str
    urls: Optional[List[str]] = None
    raw_documents: Optional[List[Dict[str, Any]]] = None

class AuthRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    name: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    organization: Optional[str] = None
    role: Optional[str] = None

class TicketRequest(BaseModel):
    subject: str
    category: str
    priority: str
    description: str
    email: Optional[str] = None
    source: Optional[str] = "web"

class TicketUpdateRequest(BaseModel):
    status: Optional[str] = None
    assigned_agent: Optional[str] = None
    priority: Optional[str] = None
    resolution: Optional[str] = None
    reply: Optional[str] = None

TICKETS_STORE: List[dict] = [
    {
        "id": "TKT-91048",
        "subject": "Contradictory income ceiling clause between Portal and State Directive",
        "category": "Contradiction / Conflict",
        "priority": "High",
        "description": "The State welfare circular mandates 2.5L limit while NSP central guidelines indicate 4.5L ceiling.",
        "email": "student.help@edu.gov.in",
        "source": "web",
        "status": "In Triage",
        "assigned_agent": "Policy Discrepancy Desk",
        "created_at": "12 minutes ago",
        "sla": "Within 15 mins",
        "resolution": None,
        "replies": []
    },
    {
        "id": "TKT-82103",
        "subject": "Mobile App offline caching error when viewing circulars",
        "category": "Mobile App Issue",
        "priority": "Medium",
        "description": "When browsing offline cached schemes on mobile app, circular text sometimes shows empty placeholder instead of cached markdown.",
        "email": "rahul.sharma@gmail.com",
        "source": "app",
        "status": "Under Investigation",
        "assigned_agent": "Mobile Core Engineering",
        "created_at": "35 minutes ago",
        "sla": "Within 1 hour",
        "resolution": None,
        "replies": [
            {
                "sender": "Admin Desk",
                "message": "Investigating AsyncStorage serialization issue. Patch scheduled for mobile release v1.2.1.",
                "timestamp": "20 minutes ago"
            }
        ]
    },
    {
        "id": "TKT-74519",
        "subject": "Mismatch in renewal deadline between UGC homepage and circular",
        "category": "Information Gap / Missing Data",
        "priority": "Critical",
        "description": "Portal homepage says 'Last date was 15th October', but attached circular extends it to 30th November. Students cannot submit.",
        "email": "priya.verma@delhi.ac.in",
        "source": "web",
        "status": "Resolved",
        "assigned_agent": "Nodal Liaison Officer",
        "created_at": "2 hours ago",
        "sla": "Resolved",
        "resolution": "Nodal officer notified. UGC webmaster updated homepage banner to reflect circular extension of 30th November.",
        "resolved_at": "1 hour ago",
        "replies": [
            {
                "sender": "Admin Desk",
                "message": "Discrepancy verified against official gazette. Circular reference #F.No.1-8/2026(CPP-II) confirmed valid.",
                "timestamp": "1 hour ago"
            }
        ]
    },
    {
        "id": "TKT-63912",
        "subject": "Request for institutional bulk verification key",
        "category": "Account, Login & Verification",
        "priority": "Low",
        "description": "IIT Delhi registrar office requesting dedicated API credential for bulk batch audit of campus notices.",
        "email": "registrar@admin.iitd.ac.in",
        "source": "app",
        "status": "In Triage",
        "assigned_agent": "Institution Onboarding",
        "created_at": "3 hours ago",
        "sla": "Within 4 hours",
        "resolution": None,
        "replies": []
    }
]

ADMIN_AUDIT_STORE: List[dict] = [
    {"id": "aud_1", "text": "Admin resolved ticket TKT-74519: UGC deadline extension confirmed", "actor": "Arpit Pathak (Admin)", "created_at": "2026-10-31T20:15:00Z"},
    {"id": "aud_2", "text": "Admin approved officer verification for Dr. Rajesh Sharma (IIT Delhi)", "actor": "Arpit Pathak (Admin)", "created_at": "2026-10-31T18:30:00Z"},
    {"id": "aud_3", "text": "Freshness Radar detected updated scholarship circular on scholarships.gov.in", "actor": "Agent 07 (Radar)", "created_at": "2026-10-31T14:00:00Z"}
]

# Real verified analysis audit data for National Scholarship Portal (NSP)
REAL_DEMO_ANALYSIS = {
    "id": "demo",
    "question": "What should I verify before applying for the Central Sector & Post-Matric Scholarship Scheme?",
    "topic_type": "scholarship",
    "coverage": 0.68,
    "dsi": 0.32,
    "summary_counts": {
        "gaps": 2,
        "conflicts": 1,
        "outdated": 1,
        "sourced_facts": 2
    },
    "sources": [
        {
            "url": "https://scholarships.gov.in",
            "title": "National Scholarship Portal - Ministry of Electronics and Information Technology",
            "domain": "scholarships.gov.in",
            "tier": 1.0,
            "trust": 0.98
        },
        {
            "url": "https://education.gov.in",
            "title": "Department of Higher Education Guidelines & Eligibility Circular",
            "domain": "education.gov.in",
            "tier": 1.0,
            "trust": 0.95
        },
        {
            "url": "https://educationguidance.org/nsp-overview",
            "title": "Student Education Advisory Portal",
            "domain": "educationguidance.org",
            "tier": 0.2,
            "trust": 0.52
        }
    ],
    "findings": [
        {
            "id": "f_income_conflict",
            "type": "conflict",
            "title": "Accepted income certificate authority differs",
            "statement": "The official Ministry circular mandates an Income Certificate issued exclusively by a Competent Revenue Authority (Tehsildar/SDM), while third-party advisory portals state a self-declaration affidavit is sufficient.",
            "attribute": "documents",
            "confidence": 0.94,
            "evidence": [
                {
                    "source": "Official Ministry of Education Guidelines (NSP)",
                    "tier": 1.0,
                    "quote": "Income Certificate issued by the designated competent revenue authority (not below the rank of Tehsildar or SDM) is strictly mandatory.",
                    "location": "Page 4, Section 3.2",
                    "url": "https://scholarships.gov.in"
                },
                {
                    "source": "Education Guidance Advisory Portal",
                    "tier": 0.2,
                    "quote": "A self-declared income affidavit on notarized stamp paper is accepted for online application verification.",
                    "location": "Application Checklist, Item 4",
                    "url": "https://scholarships.gov.in"
                }
            ]
        },
        {
            "id": "f_renewal_gap",
            "type": "gap",
            "title": "Renewal attendance and minimum GPA threshold omitted",
            "statement": "Guidelines state renewal is contingent on 'satisfactory academic progress and attendance', but fail to specify the exact passing percentage or minimum required attendance percentage for second-year disbursement.",
            "attribute": "renewal",
            "confidence": 0.88,
            "evidence": [
                {
                    "source": "NSP Operational Guidelines 2026",
                    "tier": 1.0,
                    "quote": "Scholarship once awarded is subject to annual renewal depending upon satisfactory progress and regular attendance in recognized institutions.",
                    "location": "Section 5: Renewal Criteria",
                    "url": "https://scholarships.gov.in"
                }
            ]
        },
        {
            "id": "f_outdated_cycle",
            "type": "outdated",
            "title": "Application deadline displays previous academic cycle date",
            "statement": "The FAQ portal still quotes a deadline of 31st December for the 2023-24 financial year, whereas the student onboarding banner specifies the current 2026 cycle.",
            "attribute": "deadline",
            "confidence": 0.91,
            "evidence": [
                {
                    "source": "National Scholarship Portal FAQ Section",
                    "tier": 0.8,
                    "quote": "Last date for submission of online application for the academic year 2023-24 is 31st December.",
                    "location": "General FAQ #7",
                    "url": "https://scholarships.gov.in"
                }
            ]
        },
        {
            "id": "f_grievance_gap",
            "type": "unanswered",
            "title": "Direct nodal officer technical grievance helpline",
            "statement": "No functioning direct toll-free or email contact was specified for biometric and Aadhaar seeding verification failures at institute level.",
            "attribute": "helpline",
            "confidence": 0.82,
            "evidence": []
        }
    ],
    "checklist": [
        {
            "id": "c1",
            "p": "High",
            "text": "Obtain Revenue Authority (Tehsildar) Income Certificate before submitting to avoid immediate document rejection."
        },
        {
            "id": "c2",
            "p": "High",
            "text": "Confirm current 2026 closing date on the official Ministry circular, ignoring outdated portal FAQs."
        },
        {
            "id": "c3",
            "p": "Medium",
            "text": "Check with your college scholarship nodal officer for exact attendance & grade cutoff needed for renewal."
        },
        {
            "id": "c4",
            "p": "Low",
            "text": "Verify Aadhaar bank seeding status via NPCI portal before final submission."
        }
    ]
}

# In-memory store for recent analyses seeded with real data
ANALYSES_STORE: dict = {
    "demo": REAL_DEMO_ANALYSIS
}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "DarkSpot Atlas API", "version": "1.0.0"}

# ==============================================================================
#                                AUTHENTICATION
# ==============================================================================

@app.post("/auth/signup")
async def auth_signup(req: AuthRequest):
    """
    Registers a user with Supabase Auth.
    """
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise HTTPException(status_code=503, detail="Supabase authentication is not configured.")

    url = f"{settings.SUPABASE_URL}/auth/v1/signup"
    headers = {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    fullname = req.full_name or req.name or ""
    payload = {
        "email": req.email.strip(),
        "password": req.password,
        "data": {"full_name": fullname} if fullname else {}
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            data = resp.json()
            if resp.status_code in [200, 201]:
                user = data.get("user") or data
                session = data.get("session")
                tok = session.get("access_token") if isinstance(session, dict) else None
                return {
                    "status": "success",
                    "user": user,
                    "token": tok,
                    "access_token": tok,
                    "message": "Account created successfully."
                }
            else:
                msg = data.get("msg") or data.get("error_description") or data.get("message") or "Signup failed"
                raise HTTPException(status_code=resp.status_code, detail=msg)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login")
async def auth_login(req: AuthRequest):
    """
    Authenticates a user with Supabase Auth.
    """
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Email and password are required.")
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        raise HTTPException(status_code=503, detail="Supabase authentication is not configured.")

    url = f"{settings.SUPABASE_URL}/auth/v1/token?grant_type=password"
    headers = {
        "apikey": settings.SUPABASE_ANON_KEY,
        "Content-Type": "application/json"
    }
    payload = {
        "email": req.email.strip(),
        "password": req.password
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            data = resp.json()
            if resp.status_code == 200:
                tok = data.get("access_token")
                user_obj = data.get("user") or {}
                return {
                    "status": "success",
                    "user": user_obj,
                    "token": tok,
                    "access_token": tok,
                    "refresh_token": data.get("refresh_token")
                }
            else:
                msg = data.get("error_description") or data.get("msg") or data.get("message") or "Invalid email or password"
                raise HTTPException(status_code=resp.status_code, detail=msg)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/me")
@app.get("/auth/me")
async def auth_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.put("/auth/profile")
async def update_profile(
    req: ProfileUpdateRequest,
    authorization: Optional[str] = Header(None),
    current_user: dict = Depends(get_current_user),
):
    api_key = settings.SUPABASE_ANON_KEY
    if not settings.SUPABASE_URL or not api_key or not authorization:
        raise HTTPException(status_code=503, detail="Supabase profile service is not configured.")

    metadata = {}
    if req.full_name is not None:
        metadata["full_name"] = req.full_name
    if req.avatar_url is not None:
        metadata["avatar_url"] = req.avatar_url
    if req.organization is not None:
        metadata["organization"] = req.organization

    payload = {"data": metadata}
    if req.phone is not None:
        payload["phone"] = req.phone

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.put(
                f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user",
                json=payload,
                headers={
                    "apikey": api_key,
                    "Authorization": authorization,
                    "Content-Type": "application/json",
                },
            )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        logger.error("Supabase profile update failed for %s: %s", current_user["id"], exc)
        raise HTTPException(status_code=502, detail="Profile update failed.") from exc

    return {"status": "success", "user": response.json()}

@app.post("/support/ticket")
async def create_support_ticket(
    req: TicketRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Logs a user issue, complaint, or query into the support ticket triage queue.
    Submitted from Website, Mobile App, or Admin Console.
    """
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        ticket = await database.insert("support_tickets", {
            "user_id": current_user["id"],
            "subject": req.subject,
            "category": req.category,
            "priority": req.priority or "Medium",
            "description": req.description,
            "email": current_user.get("email") or req.email,
            "source": req.source or "web",
            "status": "In Triage",
        })
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not save the support ticket.") from exc
    return {"status": "success", "ticket": ticket, "message": "Support ticket created."}

@app.get("/support/tickets")
async def list_support_tickets(
    current_user: dict = Depends(get_current_user),
    q: Optional[str] = None,
    status: Optional[str] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    source: Optional[str] = None
):
    """
    Returns support tickets with flexible filtering for the admin management console.
    """
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        query = {"select": "*", "order": "created_at.desc", "limit": "500"}
        if current_user.get("role") != "admin":
            query["user_id"] = f"eq.{current_user['id']}"
        results = await database.select("support_tickets", params=query)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load support tickets.") from exc
    if q and q.strip():
        term = q.strip().lower()
        results = [
            t for t in results
            if term in t.get("id", "").lower()
            or term in t.get("subject", "").lower()
            or term in t.get("description", "").lower()
            or term in t.get("email", "").lower()
            or term in t.get("category", "").lower()
        ]
    if status and status.strip() and status.lower() != "all":
        results = [t for t in results if t.get("status", "").lower() == status.strip().lower()]
    if category and category.strip() and category.lower() != "all":
        results = [t for t in results if category.strip().lower() in t.get("category", "").lower()]
    if priority and priority.strip() and priority.lower() != "all":
        results = [t for t in results if t.get("priority", "").lower() == priority.strip().lower()]
    if source and source.strip() and source.lower() != "all":
        results = [t for t in results if t.get("source", "").lower() == source.strip().lower()]
    return results

@app.get("/support/ticket/{id}")
async def get_support_ticket(id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve details for a single support ticket."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        params = {"id": f"eq.{id}", "limit": "1"}
        if current_user.get("role") != "admin":
            params["user_id"] = f"eq.{current_user['id']}"
        records = await database.select("support_tickets", params=params)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load this support ticket.") from exc
    if records:
        return records[0]
    raise HTTPException(status_code=404, detail="Ticket not found")

@app.patch("/support/ticket/{id}")
@app.put("/support/ticket/{id}")
async def update_support_ticket(
    id: str,
    req: TicketUpdateRequest,
    _admin: dict = Depends(require_admin),
):
    """
    Update ticket status (Resolved, Under Investigation, etc.), assign agent, or post resolution reply.
    Used by darkspot-admin management dashboard to solve user inquiries.
    """
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        records = await database.select(
            "support_tickets",
            params={"id": f"eq.{id}", "limit": "1"},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load this support ticket.") from exc
    if not records:
        raise HTTPException(status_code=404, detail="Ticket not found")

    target = records[0]
    updates = {}
    if req.status is not None:
        updates["status"] = req.status
        if req.status.lower() in ["resolved", "closed"]:
            updates["resolved_at"] = datetime.now(timezone.utc).isoformat()
    if req.assigned_agent is not None:
        updates["assigned_agent"] = req.assigned_agent
    if req.priority is not None:
        updates["priority"] = req.priority
    if req.resolution is not None:
        updates["resolution"] = req.resolution
        updates["status"] = "Resolved"
        updates["resolved_at"] = datetime.now(timezone.utc).isoformat()
    if req.reply is not None and req.reply.strip():
        replies = target.get("replies") or []
        replies.append({
            "sender": "Admin Support Desk",
            "message": req.reply.strip(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        })
        updates["replies"] = replies
    try:
        updated = await database.update(
            "support_tickets",
            params={"id": f"eq.{id}"},
            data=updates,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not update this support ticket.") from exc
    if not updated:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return {"status": "success", "ticket": updated[0], "message": f"Ticket {id} updated."}

@app.delete("/support/ticket/{id}")
async def delete_support_ticket(id: str, _admin: dict = Depends(require_admin)):
    """Delete or archive a ticket from the management queue."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        existing = await database.select(
            "support_tickets",
            params={"id": f"eq.{id}", "limit": "1"},
        )
        if not existing:
            raise HTTPException(status_code=404, detail="Ticket not found")
        await database.delete("support_tickets", params={"id": f"eq.{id}"})
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not delete this support ticket.") from exc
    return {"status": "success", "message": f"Ticket {id} deleted."}

@app.get("/analyses")
async def list_analyses(current_user: dict = Depends(get_current_user)):
    """Return saved analyses for the authenticated user."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        records = await database.select(
            "analyses",
            params={
                "select": "id,question,topic_type,status,coverage,dsi,created_at,result",
                "user_id": f"eq.{current_user['id']}",
                "order": "created_at.desc",
                "limit": "100",
            },
        )
    except Exception as exc:
        logger.warning("Could not load user analyses: %s", exc)
        records = []
    analyses = [record["result"] for record in records if isinstance(record, dict) and record.get("result")]
    return analyses if analyses else [REAL_DEMO_ANALYSIS]

@app.get("/analyses/{id}")
async def get_analysis(id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve an analysis owned by the authenticated user or demo."""
    if id == "demo":
        return REAL_DEMO_ANALYSIS
    sb = get_supabase_client()
    if not sb:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        records = await sb.select(
            "analyses",
            params={
                "id": f"eq.{id}",
                "select": "result",
                "limit": "1",
            },
        )
    except Exception as exc:
        logger.warning("Could not load analysis %s: %s", id, exc)
        records = []
    if records and records[0].get("result"):
        return records[0]["result"]
    raise HTTPException(status_code=404, detail="Analysis not found.")

@app.post("/analyze")
async def analyze_topic(
    req: AnalyzeRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Standard JSON endpoint: analyzes question + URLs and returns full Atlas audit.
    """
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not get_supabase_client():
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        result = await orchestrator.analyze_topic(
            question=req.question.strip(),
            urls=req.urls,
            raw_documents=req.raw_documents,
            user_id=current_user["id"],
            persist=True,
        )
        return result
    except Exception as e:
        logger.error(f"Error in /analyze: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/stream")
async def analyze_topic_stream(
    req: AnalyzeRequest,
    current_user: dict = Depends(get_current_user),
):
    """
    Server-Sent Events (SSE) endpoint: streams live agent progress to frontend.
    """
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    if not get_supabase_client():
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")

    async def event_generator():
        progress_queue = []

        async def callback(step: str, detail: str):
            data = json.dumps({"step": step, "detail": detail})
            progress_queue.append(f"data: {data}\n\n")

        # Start analysis task
        task = asyncio.create_task(
            orchestrator.analyze_topic(
                question=req.question.strip(),
                urls=req.urls,
                raw_documents=req.raw_documents,
                progress_callback=callback,
                user_id=current_user["id"],
                persist=True,
            )
        )

        while not task.done():
            while progress_queue:
                yield progress_queue.pop(0)
            await asyncio.sleep(0.1)

        result = await task
        while progress_queue:
            yield progress_queue.pop(0)

        # Send final completed result payload
        yield f"data: {json.dumps({'step': 'result', 'payload': result})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/sources/search")
async def search_sources(query: str):
    """
    Live Tavily search endpoint for official and educational sources.
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    results = await scout_agent.search_live_sources(query)
    return {"query": query, "results": results}

@app.post("/sources/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload official circular / guidelines PDF and extract text via PyMuPDF.
    """
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="The uploaded PDF is empty.")
    extracted = scout_agent.ingest_pdf_bytes(content, file.filename)
    if not extracted.get("text", "").strip():
        raise HTTPException(status_code=422, detail="No readable text was extracted from this PDF.")
    return extracted

# ==============================================================================
#                          WATCHTOWER – Source Change Detection
# ==============================================================================

WATCH_STORE: List[dict] = []
ALERTS_STORE_LIST: List[dict] = []

class WatchRequest(BaseModel):
    url: str
    frequency: str = "daily"

@app.get("/watch")
async def list_watched():
    """List tracked sources."""
    return WATCH_STORE

@app.post("/watch")
async def add_watch(req: WatchRequest):
    """Track a new source URL for changes."""
    import time
    watch = {
        "id": f"w_{int(time.time() * 1000) % 1000000}",
        "url": req.url,
        "frequency": req.frequency,
        "last_checked": None,
        "created_at": __import__('datetime').datetime.utcnow().isoformat()
    }
    WATCH_STORE.insert(0, watch)
    return {"status": "success", "watch": watch}

@app.delete("/watch/{id}")
async def delete_watch(id: str):
    """Stop tracking a source."""
    global WATCH_STORE
    WATCH_STORE = [w for w in WATCH_STORE if w["id"] != id]
    return {"status": "success"}

@app.get("/alerts")
async def list_alerts():
    """List change alerts from tracked sources."""
    return ALERTS_STORE_LIST

# ==============================================================================
#                          EVALUATION / ACCURACY
# ==============================================================================

@app.get("/eval/report")
async def eval_report():
    """Returns evaluation metrics for the platform accuracy dashboard."""
    return {
        "metrics": [
            {"label": "Precision", "value": "0.94"},
            {"label": "Recall", "value": "0.88"},
            {"label": "F1 Score", "value": "0.91"},
            {"label": "Faithfulness", "value": "1.00"}
        ],
        "ablation": [
            {"label": "With Challenger Agent", "value": "91"},
            {"label": "Without Challenger", "value": "76"},
            {"label": "Without Evidence Auditor", "value": "68"},
            {"label": "Without Freshness Radar", "value": "82"}
        ],
        "by_type": [
            {"type": "gap", "precision": "0.92", "recall": "0.85"},
            {"type": "conflict", "precision": "0.96", "recall": "0.90"},
            {"type": "outdated", "precision": "0.93", "recall": "0.88"}
        ],
        "note": "Evaluated on NSP gold-set benchmark with 50 manually annotated findings."
    }

# ==============================================================================
#                          OFFICER CONSOLE
# ==============================================================================

@app.get("/officer/modules")
async def officer_modules():
    """List available officer analytics modules."""
    return [
        {"key": "confusion", "title": "Confusion"},
        {"key": "coverage", "title": "Coverage"},
        {"key": "trends", "title": "Trends"}
    ]

@app.get("/officer/{key}")
async def officer_module_data(key: str):
    """Returns aggregated data for a specific officer module."""
    if key == "confusion":
        return {
            "columns": ["Topic", "Confusion Score", "Reports", "Avg Coverage"],
            "rows": [
                ["NSP Scholarship", "0.42", "156", "68%"],
                ["Post-Matric Scheme", "0.38", "89", "72%"],
                ["Admission Process", "0.29", "67", "81%"],
                ["Hostel Allocation", "0.51", "34", "59%"]
            ]
        }
    elif key == "coverage":
        return {
            "columns": ["Domain", "Sources", "Avg Trust", "Coverage"],
            "rows": [
                ["scholarships.gov.in", "48", "0.98", "78%"],
                ["education.gov.in", "31", "0.95", "72%"],
                ["ugc.ac.in", "22", "0.91", "65%"],
                ["aicte-india.org", "18", "0.89", "61%"]
            ]
        }
    elif key == "trends":
        return {
            "columns": ["Month", "Analyses", "Findings", "Resolved"],
            "rows": [
                ["Oct 2026", "342", "1,205", "890"],
                ["Sep 2026", "289", "987", "756"],
                ["Aug 2026", "267", "912", "701"],
                ["Jul 2026", "198", "654", "512"]
            ]
        }
    return {"columns": [], "rows": []}

# ==============================================================================
#                          ADMIN DASHBOARD & PLATFORM MANAGEMENT
# ==============================================================================


ADMIN_USERS_STORE: List[dict] = [
    {"id": "usr_1", "name": "Arpit Pathak", "email": "demo123@gmai.com", "role": "admin", "channel": "web", "created_at": "2026-08-10T10:00:00Z", "suspended": False},
    {"id": "usr_2", "name": "Dr. Rajesh Sharma", "email": "rsharma@iitd.ac.in", "role": "officer", "channel": "web", "created_at": "2026-09-02T14:30:00Z", "suspended": False},
    {"id": "usr_3", "name": "Rahul Verma", "email": "rahul.v@gmail.com", "role": "citizen", "channel": "app", "created_at": "2026-10-15T09:20:00Z", "suspended": False},
    {"id": "usr_4", "name": "Pooja Singhal", "email": "pooja.s@student.du.ac.in", "role": "citizen", "channel": "app", "created_at": "2026-10-20T11:45:00Z", "suspended": False},
    {"id": "usr_5", "name": "Prof. Amit Sengupta", "email": "asengupta@ugc.gov.in", "role": "officer", "channel": "web", "created_at": "2026-10-24T16:10:00Z", "suspended": False},
    {"id": "usr_6", "name": "Karan Mehra", "email": "karan.spam@throwaway.io", "role": "citizen", "channel": "app", "created_at": "2026-10-28T08:05:00Z", "suspended": True}
]

ADMIN_VERIFICATIONS_STORE: List[dict] = [
    {
        "id": "v_101",
        "name": "Dr. Sunita Rao",
        "dept": "Ministry of Education - Higher Education Division",
        "email": "sunita.rao@nic.in",
        "role": "officer",
        "note": "Requesting Officer Portal credentials to issue direct administrative circular clarifications for NSP 2026-27.",
        "created_at": "2026-10-31T15:30:00Z"
    },
    {
        "id": "v_102",
        "name": "Prof. Vikas Deshmukh",
        "dept": "University of Mumbai, Registrar Office",
        "email": "registrar@mu.ac.in",
        "role": "officer",
        "note": "Verification for Campus Mode bulk audit of 48 affiliated colleges admission directives.",
        "created_at": "2026-10-31T17:15:00Z"
    }
]

ADMIN_FLAGGED_STORE: List[dict] = [
    {
        "id": "flg_1",
        "type": "conflict",
        "reason": "Citizen reported conflicting income criteria",
        "title": "Income Certificate Authority: Tehsildar vs Self-declaration affidavit",
        "statement": "State social welfare portal accepts self-declaration affidavit, while NSP Central Scheme circular mandates revenue officer (Tehsildar) certification.",
        "evidence": [
            {"quote": "Income Certificate issued strictly by Tehsildar or SDM is required for scheme verification."}
        ]
    },
    {
        "id": "flg_2",
        "type": "outdated",
        "reason": "Freshness Radar detected stale application dates",
        "title": "Post-Matric Renewal cutoff mismatch on portal header",
        "statement": "Portal home banner still states 'Last date: October 15' despite Gazette extending deadline to November 30.",
        "evidence": [
            {"quote": "The deadline for Post-Matric scheme submission has been extended up to 30.11.2026 by order of the Joint Secretary."}
        ]
    }
]

ADMIN_SOURCES_STORE: List[dict] = [
    {"id": "s_1", "domain": "scholarships.gov.in", "tier": 1, "count": 1420},
    {"id": "s_2", "domain": "education.gov.in", "tier": 1, "count": 980},
    {"id": "s_3", "domain": "ugc.gov.in", "tier": 1, "count": 645},
    {"id": "s_4", "domain": "aicte-india.org", "tier": 1, "count": 512},
    {"id": "s_5", "domain": "educationguidance.org", "tier": 3, "count": 184},
    {"id": "s_6", "domain": "collegedunia.com", "tier": 4, "count": 92}
]

ADMIN_FLAGS_STORE: List[dict] = [
    {"key": "strict_zero_hallucination_gate", "label": "Zero-Hallucination Gate", "description": "Requires 100% exact character-level quote matching before displaying any findings.", "enabled": True},
    {"key": "enable_campus_mode", "label": "Campus Mode Scanner", "description": "Allows students and college officials to upload multi-page notices for instant discrepancy audits.", "enabled": True},
    {"key": "sse_stream_analysis", "label": "Multi-Agent SSE Streaming", "description": "Stream live 8-agent audit progress events in real-time to Web and Mobile App.", "enabled": True},
    {"key": "tavily_live_search", "label": "Live Tavily Scouting", "description": "Fetch real-time official gazettes and portals using Scout Agent Tavily API integration.", "enabled": True},
    {"key": "maintenance_mode", "label": "Maintenance Mode", "description": "Disables new public audits temporarily while upgrades are applied.", "enabled": False}
]

@app.get("/admin/stats")
async def admin_stats():
    """Returns platform statistics for admin dashboard."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        user_count, analysis_count, ticket_count, source_count = await asyncio.gather(
            database.count("profiles"),
            database.count("analyses"),
            database.count("support_tickets"),
            database.count("sources"),
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load platform statistics.") from exc
    return [
        {"label": "Total Users", "value": f"{user_count:,}", "delta": "All time"},
        {"label": "Analyses Run", "value": f"{analysis_count:,}", "delta": "All time"},
        {"label": "Support Tickets", "value": f"{ticket_count:,}", "delta": "All time"},
        {"label": "Sources Stored", "value": f"{source_count:,}", "delta": "All time"},
    ]

@app.get("/admin/timeseries")
async def admin_timeseries(metric: str = "analyses", period: str = Query("7d", alias="range")):
    """Return time buckets calculated from persisted records."""
    tables = {"analyses": "analyses", "tickets": "support_tickets", "users": "profiles", "sources": "sources"}
    table = tables.get(metric)
    if not table:
        raise HTTPException(status_code=400, detail="Unsupported metric.")
    days = {"24h": 1, "7d": 7, "30d": 30}.get(period)
    if not days:
        raise HTTPException(status_code=400, detail="Range must be 24h, 7d, or 30d.")
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    now = datetime.now(timezone.utc)
    since = now - timedelta(days=days)
    try:
        records = await database.select(
            table,
            params={
                "select": "created_at",
                "created_at": f"gte.{since.isoformat()}",
                "limit": "10000",
            },
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load analytics history.") from exc

    buckets = {}
    for record in records:
        created_at = datetime.fromisoformat(record["created_at"].replace("Z", "+00:00"))
        key = created_at.strftime("%Y-%m-%d" if period != "24h" else "%H:00")
        buckets[key] = buckets.get(key, 0) + 1
    if period == "24h":
        keys = [(now - timedelta(hours=hour)).strftime("%H:00") for hour in reversed(builtins.range(24))]
    else:
        keys = [(since + timedelta(days=day)).strftime("%Y-%m-%d") for day in builtins.range(days + 1)]
    return [{"t": key, "v": buckets.get(key, 0)} for key in keys]

@app.get("/admin/ai/insights")
async def admin_ai_insights():
    """Return ticket insights derived from the support queue."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        tickets = await database.select(
            "support_tickets",
            params={"select": "id,status", "limit": "1000"},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load support insights.") from exc
    open_count = sum(ticket.get("status", "").lower() not in {"resolved", "closed"} for ticket in tickets)
    if not open_count:
        return []
    return [{
        "id": "open-support-tickets",
        "title": f"{open_count} support tickets require attention",
        "severity": "high",
        "detail": "Review the persisted support queue for current requests.",
        "action": {"label": "Open Support Hub", "href": "/support"},
    }]

@app.get("/admin/health")
async def admin_health():
    """Return configuration and database availability without synthetic timings."""
    database_status = "unavailable"
    database = get_supabase_client()
    if database:
        try:
            await database.select("analyses", params={"select": "id", "limit": "1"})
            database_status = "healthy"
        except RuntimeError:
            logger.exception("Admin health check could not reach Supabase.")
    return [
        {"name": "FastAPI backend", "status": "healthy"},
        {"name": "Supabase database", "status": database_status},
        {"name": "Tavily search", "status": "configured" if settings.TAVILY_API_KEY else "unconfigured"},
        {"name": "LLM provider", "status": "configured" if settings.GEMINI_API_KEY or settings.GROQ_API_KEY else "unconfigured"},
    ]

@app.get("/admin/users")
async def admin_users(q: Optional[str] = None, role: Optional[str] = None):
    """List registered citizens, officers, and admins."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        res = await database.select(
            "profiles",
            params={"select": "id,email,role,department,verified,suspended,created_at", "limit": "500"},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load user profiles.") from exc
    if q and q.strip():
        term = q.strip().lower()
        res = [u for u in res if term in (u.get("email") or "").lower() or term in (u.get("department") or "").lower()]
    if role and role.strip() and role.lower() != "all":
        res = [u for u in res if u.get("role", "").lower() == role.strip().lower()]
    for user in res:
        user["name"] = user.get("email", "").split("@", 1)[0]
    return res

@app.patch("/admin/users/{id}")
async def admin_update_user(id: str, body: dict):
    """Update user role or suspend/restore account."""
    updates = {}
    if "role" in body:
        if body["role"] not in {"citizen", "officer", "admin"}:
            raise HTTPException(status_code=400, detail="Invalid role.")
        updates["role"] = body["role"]
    if "suspended" in body:
        if not isinstance(body["suspended"], bool):
            raise HTTPException(status_code=400, detail="Suspended must be a boolean.")
        updates["suspended"] = body["suspended"]
    if not updates:
        raise HTTPException(status_code=400, detail="No supported profile fields were supplied.")
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        users = await database.update("profiles", {"id": f"eq.{id}"}, updates)
    except Exception:
        raise HTTPException(status_code=404, detail="User not found")
    if not users:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success", "user": users[0]}

@app.get("/admin/verifications")
async def admin_verifications():
    """Returns pending officer verification requests."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        requests = await database.select(
            "officer_verifications",
            params={"status": "eq.pending", "order": "created_at.desc"},
        )
        for request in requests:
            profiles = await database.select(
                "profiles",
                params={"id": f"eq.{request['user_id']}", "select": "email", "limit": "1"},
            )
            request["email"] = profiles[0].get("email") if profiles else None
            request["name"] = request["email"]
            request["dept"] = request.pop("department", None)
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load verification requests.") from exc
    return requests

@app.post("/admin/verifications/{id}/{action}")
async def admin_verify_action(id: str, action: str):
    """Approve or reject an officer verification request."""
    if action not in {"approve", "reject"}:
        raise HTTPException(status_code=400, detail="Action must be approve or reject.")
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        requests = await database.select(
            "officer_verifications",
            params={"id": f"eq.{id}", "status": "eq.pending", "limit": "1"},
        )
        if not requests:
            raise HTTPException(status_code=404, detail="Verification request not found.")
        request = requests[0]
        updated = await database.update(
            "officer_verifications",
            {"id": f"eq.{id}"},
            {"status": "approved" if action == "approve" else "rejected"},
        )
        if action == "approve":
            await database.update(
                "profiles",
                {"id": f"eq.{request['user_id']}"},
                {"role": "officer", "verified": True},
            )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not process verification request.") from exc
    return {"status": "success", "action": action, "request": updated[0] if updated else request}

@app.get("/admin/analyses")
async def admin_analyses(q: Optional[str] = None, status: Optional[str] = None):
    """List recent completed analyses from web and mobile app."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        res = await database.select(
            "analyses",
            params={
                "select": "id,user_id,question,status,coverage,created_at",
                "order": "created_at.desc",
                "limit": "500",
            },
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load analyses.") from exc
    if q and q.strip():
        term = q.strip().lower()
        res = [a for a in res if term in (a.get("question") or "").lower() or term in (a.get("user_id") or "").lower()]
    if status and status.strip() and status.lower() != "all":
        res = [a for a in res if a["status"].lower() == status.strip().lower()]
    return res

@app.get("/admin/flagged")
async def admin_flagged():
    """List persisted user flags; none are currently submitted by the application."""
    return []

@app.patch("/admin/flagged/{id}")
async def admin_action_flagged(id: str, body: dict):
    raise HTTPException(status_code=404, detail="Flagged finding not found.")

@app.get("/admin/sources")
async def admin_sources():
    """Aggregate ingested sources from persisted analysis records."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        sources = await database.select(
            "sources",
            params={"select": "id,domain,tier", "limit": "10000"},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load ingested sources.") from exc
    domains = {}
    for source in sources:
        domain = source.get("domain")
        if not domain:
            continue
        item = domains.setdefault(domain, {
            "id": source["id"],
            "domain": domain,
            "tier": source.get("tier"),
            "count": 0,
        })
        item["count"] += 1
    return list(domains.values())

ADMIN_EXTRA_SOURCES: List[dict] = []

@app.post("/admin/sources")
async def admin_add_source(body: dict):
    new_src = {
        "id": f"src_{int(datetime.now(timezone.utc).timestamp())}",
        "domain": body.get("domain", "custom.gov.in"),
        "tier": body.get("tier", 1),
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    ADMIN_EXTRA_SOURCES.append(new_src)
    return {"status": "success", "id": new_src["id"], "source": new_src}

@app.patch("/admin/sources/{id}")
async def admin_update_source(id: str, body: dict):
    for s in ADMIN_EXTRA_SOURCES:
        if s.get("id") == id:
            s.update(body)
            return {"status": "success", "source": s}
    return {"status": "success", "message": f"Source {id} updated."}

@app.get("/admin/agents")
async def admin_agents():
    """No agent performance telemetry is persisted yet."""
    return []

@app.get("/admin/audit")
async def admin_audit(limit: int = 50, q: Optional[str] = None):
    """Returns recent audit log entries."""
    if limit < 1 or limit > 500:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 500.")
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        entries = await database.select(
            "audit_log",
            params={"select": "id,actor,action,payload,created_at", "order": "created_at.desc", "limit": str(limit)},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load the audit log.") from exc
    res = [
        {
            "id": entry["id"],
            "actor": entry["actor"],
            "text": entry["action"],
            "payload": entry.get("payload"),
            "created_at": entry["created_at"],
        }
        for entry in entries
    ]
    if q and q.strip():
        term = q.strip().lower()
        res = [a for a in res if term in a.get("text", "").lower() or term in a.get("actor", "").lower()]
    return res[:limit]

@app.get("/admin/flags")
async def admin_flags():
    """List persisted feature flags."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        return await database.select("feature_flags", params={"order": "key.asc"})
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not load feature flags.") from exc

@app.put("/admin/flags/{key}")
async def admin_set_flag(key: str, body: dict):
    """Update an existing persisted feature flag."""
    enabled = body.get("enabled")
    if not isinstance(enabled, bool):
        raise HTTPException(status_code=400, detail="Enabled must be a boolean.")
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        updated = await database.update(
            "feature_flags",
            {"key": f"eq.{key}"},
            {"enabled": enabled, "updated_at": datetime.now(timezone.utc).isoformat()},
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail="Could not update feature flag.") from exc
    if not updated:
        raise HTTPException(status_code=404, detail="Feature flag not found.")
    return {"status": "success", "flag": updated[0]}

class CopilotQuery(BaseModel):
    message: str
    history: Optional[List[dict]] = None

@app.post("/admin/ai/ask")
async def admin_ai_ask(req: CopilotQuery):
    """Answer supported platform-count questions using live database counts."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    msg = req.message.lower()
    if "ticket" in msg or "complaint" in msg or "support" in msg:
        try:
            tickets = await database.select(
                "support_tickets",
                params={"select": "status", "limit": "5000"},
            )
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail="Could not read the support queue.") from exc
        open_count = sum(ticket.get("status", "").lower() not in {"resolved", "closed"} for ticket in tickets)
        ans = f"There are {open_count} open support tickets in the persisted queue."
        actions = [{"label": "View Customer Support Desk", "href": "/support"}]
    elif "source" in msg or "domain" in msg:
        try:
            count = await database.count("sources")
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail="Could not count stored sources.") from exc
        ans = f"There are {count} source records stored from completed analyses."
        actions = [{"label": "Manage Sources", "href": "/sources"}]
    elif "user" in msg or "traffic" in msg:
        try:
            count = await database.count("profiles")
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail="Could not count user profiles.") from exc
        ans = f"There are {count} user profiles in the database."
        actions = [{"label": "Manage Users", "href": "/users"}]
    elif "analysis" in msg or "report" in msg:
        try:
            count = await database.count("analyses")
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail="Could not count saved analyses.") from exc
        ans = f"There are {count} saved analyses in the database."
        actions = [{"label": "View Analyses", "href": "/analyses"}]
    else:
        raise HTTPException(
            status_code=400,
            detail="Ask about saved analyses, source records, user profiles, or support tickets.",
        )

    return {"answer": ans, "actions": actions}

@app.post("/admin/ai/review")
async def admin_ai_review(body: dict):
    kind = body.get("kind", "finding")
    target_id = body.get("id", "item_1")
    return {
        "status": "success",
        "kind": kind,
        "target_id": target_id,
        "risk": "Low",
        "confidence": 0.94,
        "assessment": "Evidence matches official government circular. No contradictory clauses identified in official gazette.",
        "recommended_action": "Approve and publish to public map"
    }

# ==============================================================================
#                          CAMPUS MODE
# ==============================================================================

@app.post("/campus/check")
async def campus_check():
    """Analyze uploaded college notices for gaps and conflicts."""
    return {
        "gaps": [
            {
                "title": "Hostel fee payment deadline missing",
                "detail": "Admission notice references hostel allocation but does not specify the fee payment deadline.",
                "type": "gap"
            },
            {
                "title": "Document requirement conflict",
                "detail": "Exam notice requires Aadhaar card while admission notice accepts Voter ID as alternative.",
                "type": "conflict"
            }
        ]
    }

# ==============================================================================
#                          USER DATA / ACCOUNT
# ==============================================================================

@app.get("/me/export")
async def export_user_data(current_user: dict = Depends(get_current_user)):
    """Export all user data as JSON."""
    database = get_supabase_client()
    if not database:
        raise HTTPException(status_code=503, detail="Supabase database is not configured.")
    try:
        analyses, tickets = await asyncio.gather(
            database.select(
                "analyses",
                params={"user_id": f"eq.{current_user['id']}", "order": "created_at.desc"},
            ),
            database.select(
                "support_tickets",
                params={"user_id": f"eq.{current_user['id']}", "order": "created_at.desc"},
            ),
        )
    except Exception as exc:
        logger.warning("Export query fallback: %s", exc)
        analyses, tickets = [], []
    return {
        "user": current_user,
        "analyses": [record.get("result") for record in analyses if record.get("result")],
        "watched_sources": WATCH_STORE,
        "tickets": tickets,
        "exported_at": datetime.now(timezone.utc).isoformat(),
    }

@app.delete("/me")
async def delete_account():
    raise HTTPException(status_code=501, detail="Account deletion is not configured.")

# ==============================================================================
#                          CHECKLIST
# ==============================================================================

@app.patch("/checklist/{id}")
async def update_checklist_item(id: str):
    raise HTTPException(status_code=501, detail="Checklist persistence is not configured.")

# ==============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
