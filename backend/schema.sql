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
    suspended BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS suspended BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;
CREATE POLICY "Profiles are viewable by owner" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Profiles are updatable by owner" ON public.profiles;
CREATE POLICY "Profiles are updatable by owner" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE OF email ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 3. Analyses table (Stores each audit execution)
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    topic_type TEXT NOT NULL DEFAULT 'general',
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    coverage FLOAT NOT NULL DEFAULT 0.0,
    dsi FLOAT NOT NULL DEFAULT 1.0, -- Dark Spot Index = 1 - coverage
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    result JSONB
);
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS result JSONB;

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

-- 14. Support tickets submitted from the web and mobile applications
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    description TEXT NOT NULL,
    email TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'web',
    status TEXT NOT NULL DEFAULT 'In Triage',
    assigned_agent TEXT,
    resolution TEXT,
    replies JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON public.support_tickets(user_id);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tickets are viewable by owner" ON public.support_tickets;
CREATE POLICY "Tickets are viewable by owner" ON public.support_tickets
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Tickets are insertable by owner" ON public.support_tickets;
CREATE POLICY "Tickets are insertable by owner" ON public.support_tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.officer_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.feature_flags (
    key TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    enabled BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.source_registry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain TEXT NOT NULL UNIQUE,
    tier SMALLINT NOT NULL CHECK (tier BETWEEN 1 AND 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Gold Set table (Ground-truth dataset for accuracy evaluation)
CREATE TABLE IF NOT EXISTS public.gold_set (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT NOT NULL,
    findings_labelled JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. Query Events table (Confusion Intelligence with k-anonymity)
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
ALTER TABLE public.tracked_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signed_facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supersession_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gold_set ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.officer_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_registry ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read analyses" ON public.analyses;
DROP POLICY IF EXISTS "Public insert analyses" ON public.analyses;
DROP POLICY IF EXISTS "Public update analyses" ON public.analyses;
DROP POLICY IF EXISTS "Public read sources" ON public.sources;
DROP POLICY IF EXISTS "Public insert sources" ON public.sources;
DROP POLICY IF EXISTS "Public read claims" ON public.claims;
DROP POLICY IF EXISTS "Public insert claims" ON public.claims;
DROP POLICY IF EXISTS "Public read findings" ON public.findings;
DROP POLICY IF EXISTS "Public insert findings" ON public.findings;
DROP POLICY IF EXISTS "Public read checklist" ON public.checklist_items;
DROP POLICY IF EXISTS "Public insert checklist" ON public.checklist_items;
DROP POLICY IF EXISTS "Public update checklist" ON public.checklist_items;

DROP POLICY IF EXISTS "Analyses are viewable by owner" ON public.analyses;
CREATE POLICY "Analyses are viewable by owner" ON public.analyses
    FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Sources are viewable by analysis owner" ON public.sources;
CREATE POLICY "Sources are viewable by analysis owner" ON public.sources
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.analyses a WHERE a.id = analysis_id AND a.user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Claims are viewable by analysis owner" ON public.claims;
CREATE POLICY "Claims are viewable by analysis owner" ON public.claims
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sources s
            JOIN public.analyses a ON a.id = s.analysis_id
            WHERE s.id = source_id AND a.user_id = auth.uid()
        )
    );
DROP POLICY IF EXISTS "Findings are viewable by analysis owner" ON public.findings;
CREATE POLICY "Findings are viewable by analysis owner" ON public.findings
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.analyses a WHERE a.id = analysis_id AND a.user_id = auth.uid())
    );
DROP POLICY IF EXISTS "Checklist is viewable by analysis owner" ON public.checklist_items;
CREATE POLICY "Checklist is viewable by analysis owner" ON public.checklist_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.analyses a WHERE a.id = analysis_id AND a.user_id = auth.uid())
    );
