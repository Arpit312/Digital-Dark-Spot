-- ==========================================================
-- DarkSpot Atlas - Complete Supabase PostgreSQL Schema
-- Run this in Supabase Dashboard -> SQL Editor -> Run
-- ==========================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles table (Role-Based Access: Citizen, Officer, Admin)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'officer', 'admin')),
    department TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Analyses table (Stores each audit execution)
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    topic_type TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    coverage FLOAT NOT NULL DEFAULT 0.0,
    dsi FLOAT NOT NULL DEFAULT 1.0, -- Dark Spot Index = 1 - coverage
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Sources table (Ingested official pages, blogs, PDFs)
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    url TEXT,
    title TEXT,
    domain TEXT,
    tier FLOAT NOT NULL DEFAULT 0.2,
    text TEXT NOT NULL,
    sha256 TEXT NOT NULL,
    published_at TEXT,
    trust FLOAT NOT NULL DEFAULT 0.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Chunks table (For dense vector retrieval)
CREATE TABLE IF NOT EXISTS public.chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    embedding VECTOR(384),
    position INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Claims table (Structured atomic claims extracted from sources)
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
    attribute TEXT NOT NULL,
    value_raw TEXT NOT NULL,
    value_norm TEXT NOT NULL,
    date TEXT,
    quote TEXT NOT NULL,
    location TEXT,
    confidence FLOAT NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Findings table (Gaps, Conflicts, Outdated info, Unanswered questions)
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('gap', 'conflict', 'outdated', 'unanswered', 'sourced_fact')),
    attribute TEXT NOT NULL,
    statement TEXT NOT NULL,
    evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    confidence FLOAT NOT NULL DEFAULT 0.0,
    label TEXT NOT NULL DEFAULT 'potential' CHECK (label IN ('sourced_fact', 'potential', 'uncertain', 'not_found_in_reviewed_sources')),
    severity FLOAT NOT NULL DEFAULT 0.5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Checklist Items table (Actionable Verify-Next list)
CREATE TABLE IF NOT EXISTS public.checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID REFERENCES public.analyses(id) ON DELETE CASCADE,
    finding_id UUID REFERENCES public.findings(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    link TEXT,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Tracked Sources table (Watchtower change radar)
CREATE TABLE IF NOT EXISTS public.tracked_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    title TEXT,
    last_hash TEXT NOT NULL,
    last_checked TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Alerts table (Watchtower change notifications)
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracked_id UUID REFERENCES public.tracked_sources(id) ON DELETE CASCADE,
    change_summary TEXT NOT NULL,
    before TEXT,
    after TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Signed Facts table (Authoritative Source Registry)
CREATE TABLE IF NOT EXISTS public.signed_facts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme TEXT NOT NULL,
    attribute TEXT NOT NULL,
    value TEXT NOT NULL,
    valid_from DATE,
    valid_to DATE,
    signatures JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Supersession Edges table (Circulars/Orders DAG)
CREATE TABLE IF NOT EXISTS public.supersession_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_doc TEXT NOT NULL,
    to_doc TEXT NOT NULL,
    effective_date DATE,
    quote TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Audit Log table (Immutable append-only log)
CREATE TABLE IF NOT EXISTS public.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Gold Set table (Ground-truth dataset for accuracy evaluation)
CREATE TABLE IF NOT EXISTS public.gold_set (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    findings_labelled JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Query Events table (Confusion Intelligence with k-anonymity)
CREATE TABLE IF NOT EXISTS public.query_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme TEXT NOT NULL,
    step TEXT NOT NULL,
    district TEXT NOT NULL,
    root_cause TEXT NOT NULL CHECK (root_cause IN ('information_gap', 'conflicting_info', 'service_failure')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_sources_analysis ON public.sources(analysis_id);
CREATE INDEX IF NOT EXISTS idx_sources_sha ON public.sources(sha256);
CREATE INDEX IF NOT EXISTS idx_claims_source ON public.claims(source_id);
CREATE INDEX IF NOT EXISTS idx_findings_analysis ON public.findings(analysis_id);
CREATE INDEX IF NOT EXISTS idx_checklist_analysis ON public.checklist_items(analysis_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Allow public read/write access for demo/guest runs, or authenticated user access
CREATE POLICY "Public read analyses" ON public.analyses FOR SELECT USING (true);
CREATE POLICY "Public insert analyses" ON public.analyses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update analyses" ON public.analyses FOR UPDATE USING (true);

CREATE POLICY "Public read sources" ON public.sources FOR SELECT USING (true);
CREATE POLICY "Public insert sources" ON public.sources FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read claims" ON public.claims FOR SELECT USING (true);
CREATE POLICY "Public insert claims" ON public.claims FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read findings" ON public.findings FOR SELECT USING (true);
CREATE POLICY "Public insert findings" ON public.findings FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read checklist" ON public.checklist_items FOR SELECT USING (true);
CREATE POLICY "Public insert checklist" ON public.checklist_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update checklist" ON public.checklist_items FOR UPDATE USING (true);
