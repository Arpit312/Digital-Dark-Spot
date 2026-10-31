import logging
from typing import List, Dict, Any, Optional
from backend.app.algorithms.priority import compute_item_priority, bucket_priority, mmr_rerank

logger = logging.getLogger(__name__)

class VerifyNextPlannerAgent:
    def __init__(self):
        pass

    def generate_checklist(
        self,
        findings: List[Dict[str, Any]],
        template: Dict[str, Any],
        sources: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        F11 Verify-Next Planner:
        Converts verified findings (gaps, conflicts, outdated) into a prioritized,
        actionable checklist using risk math and MMR deduplication.
        """
        expected_attrs = template.get("attributes", [])
        attr_weights = {a["name"]: a.get("importance", 1.0) for a in expected_attrs}

        # Find official portal link from sources if available
        official_link = ""
        for s in sources:
            if s.get("tier", 0) >= 0.8:
                official_link = s.get("url", "")
                break
        if not official_link and sources:
            official_link = sources[0].get("url", "")

        candidate_items: List[Dict[str, Any]] = []

        for f in findings:
            f_type = f.get("type")
            attr = f.get("attribute", "")
            w_a = attr_weights.get(attr, 0.8)
            conf = f.get("confidence", 0.5)

            action_text = ""
            if f_type == "conflict":
                action_text = f"Confirm correct {attr.replace('_', ' ')}: multiple sources report contradicting information."
            elif f_type == "outdated":
                action_text = f"Check latest official notification for {attr.replace('_', ' ')} (current sources appear expired or from earlier cycle)."
            elif f_type == "gap" or f.get("label") == "not_found_in_reviewed_sources":
                action_text = f"Search official portal for {attr.replace('_', ' ')} (completely missing from reviewed sources)."
            else:
                continue

            p_score = compute_item_priority(
                attribute_importance=w_a,
                confidence=conf,
                days_to_deadline=None
            )

            candidate_items.append({
                "action": action_text,
                "finding_attribute": attr,
                "priority_score": p_score,
                "priority": bucket_priority(p_score),
                "link": official_link,
                "done": False,
                "finding_statement": f.get("statement", "")
            })

        # Apply MMR deduplication to prevent repetitive checklist items
        final_checklist = mmr_rerank(candidate_items, lambda_param=0.7, top_k=8)

        # Ensure priority is assigned cleanly
        for item in final_checklist:
            item["priority"] = bucket_priority(item.get("priority_score", 0.5))

        return final_checklist

planner_agent = VerifyNextPlannerAgent()
