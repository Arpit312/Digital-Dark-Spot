import asyncio
import logging
import uuid
from typing import List, Dict, Any, Optional, AsyncGenerator
from backend.app.agents.template import template_agent
from backend.app.agents.scout import scout_agent
from backend.app.agents.extractor import claim_extractor
from backend.app.agents.gap import gap_finder
from backend.app.agents.conflict import conflict_detector
from backend.app.agents.freshness import freshness_agent
from backend.app.agents.challenger import challenger_agent
from backend.app.agents.auditor import evidence_auditor
from backend.app.agents.planner import planner_agent
from backend.app.db import get_supabase_client

logger = logging.getLogger(__name__)

class OrchestratorAgent:
    def __init__(self):
        pass

    async def analyze_topic(
        self,
        question: str,
        urls: Optional[List[str]] = None,
        raw_documents: Optional[List[Dict[str, Any]]] = None,
        progress_callback = None
    ) -> Dict[str, Any]:
        """
        Runs the complete multi-agent pipeline:
        1. Topic & Template Inference
        2. Source Ingestion (URLs / Tavily search / Uploaded documents)
        3. Parallel Claim Extraction with Levenshtein quote gating
        4. Parallel Gaps, Conflicts, Outdated Auditing
        5. Challenger Adversarial Review
        6. Evidence Auditor Gating
        7. Verify-Next Prioritization & MMR Deduplication
        8. Coverage Heatmap Matrix
        """
        async def report_progress(step: str, detail: str):
            if progress_callback:
                await progress_callback(step, detail)

        await report_progress("query_understanding", f"Analyzing question intent: '{question}'")

        # 1. Topic Template
        topic_type = template_agent.infer_topic_type(question)
        template = template_agent.get_template(topic_type)
        topic_attributes = [a["name"] for a in template.get("attributes", [])]

        await report_progress("source_scouting", "Collecting real live sources from official portals and web...")

        # 2. Source Ingestion
        sources: List[Dict[str, Any]] = []

        # If user passed specific URLs, ingest them
        if urls:
            for u in urls:
                if u.strip():
                    src = await scout_agent.ingest_url(u.strip())
                    sources.append(src)

        # If user passed uploaded documents (e.g. PDFs)
        if raw_documents:
            sources.extend(raw_documents)

        # If no sources or fewer than 3, run live Tavily search for real data
        if len(sources) < 2:
            search_query = f"{question} official guidelines portal eligibility deadline"
            searched = await scout_agent.search_live_sources(search_query, max_results=4)
            sources.extend(searched)

        if not sources:
            # Fallback placeholder if offline
            sources.append({
                "url": "https://scholarships.gov.in",
                "title": "National Scholarship Portal",
                "domain": "scholarships.gov.in",
                "tier": 1.0,
                "text": "National Scholarship Portal application guidelines. Deadlines for post-matric and pre-matric scholarships.",
                "sha256": "default_nsp_sha",
                "published_at": None,
                "trust": 0.95
            })

        await report_progress("claim_extraction", f"Extracting verified claims from {len(sources)} sources with quote verification...")

        # 3. Parallel Claim Extraction
        tasks = [
            claim_extractor.extract_claims_from_source(src, topic_attributes)
            for src in sources
        ]
        results = await asyncio.gather(*tasks)
        all_claims: List[Dict[str, Any]] = []
        for c_list in results:
            all_claims.extend(c_list)

        await report_progress("auditing", f"Auditing {len(all_claims)} extracted claims for gaps, conflicts, and staleness...")

        # 4. Gap, Conflict, and Freshness Detection
        gap_res = gap_finder.find_gaps(template, all_claims, sources)
        conflicts = conflict_detector.detect_conflicts(all_claims, template)
        outdated = freshness_agent.check_freshness(all_claims, sources)

        raw_findings = gap_res["findings"] + conflicts + outdated

        await report_progress("adversarial_challenge", "Challenger Agent running adversarial verification on candidate findings...")

        # 5. Challenger Agent
        challenged_findings = challenger_agent.challenge_findings(raw_findings)

        await report_progress("evidence_audit", "Evidence Auditor validating verbatim source quotes and applying abstain gates...")

        # 6. Evidence Auditor
        final_findings = evidence_auditor.audit_findings(challenged_findings)

        # 7. Verify-Next Planner
        checklist = planner_agent.generate_checklist(final_findings, template, sources)

        # 8. Build Heatmap Matrix (F12)
        heatmap_matrix = []
        for attr in template.get("attributes", []):
            attr_name = attr["name"]
            row = {"attribute": attr_name, "sources": []}
            for s in sources:
                has_claim = any(c.get("attribute") == attr_name and c.get("source_id") == s.get("sha256") for c in all_claims)
                row["sources"].append({
                    "source_domain": s.get("domain", ""),
                    "covered": has_claim,
                    "trust": s.get("trust", 0.5)
                })
            heatmap_matrix.append(row)

        analysis_id = str(uuid.uuid4())
        summary_counts = {
            "gaps": len([f for f in final_findings if f.get("type") == "gap" or f.get("label") == "not_found_in_reviewed_sources"]),
            "conflicts": len([f for f in final_findings if f.get("type") == "conflict"]),
            "outdated": len([f for f in final_findings if f.get("type") == "outdated"]),
            "sourced_facts": len([f for f in final_findings if f.get("type") == "sourced_fact"])
        }

        analysis_payload = {
            "id": analysis_id,
            "question": question,
            "topic_type": topic_type,
            "coverage": gap_res["coverage"],
            "dsi": gap_res["dsi"],
            "summary_counts": summary_counts,
            "sources": [
                {
                    "url": s.get("url"),
                    "title": s.get("title"),
                    "domain": s.get("domain"),
                    "tier": s.get("tier"),
                    "trust": s.get("trust")
                }
                for s in sources
            ],
            "findings": final_findings,
            "checklist": checklist,
            "heatmap": heatmap_matrix
        }

        # Optional Supabase persistence
        sb = get_supabase_client()
        if sb:
            try:
                await sb.insert("analyses", {
                    "id": analysis_id,
                    "question": question,
                    "topic_type": topic_type,
                    "coverage": gap_res["coverage"],
                    "dsi": gap_res["dsi"],
                    "status": "completed"
                })
            except Exception as e:
                logger.warning(f"Could not persist analysis to Supabase: {e}")

        await report_progress("completed", "Analysis complete. Atlas generated.")

        return analysis_payload

orchestrator = OrchestratorAgent()
