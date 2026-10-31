import logging
from typing import List, Dict, Any
from backend.app.algorithms.freshness import compute_freshness

logger = logging.getLogger(__name__)

class FreshnessAgent:
    def __init__(self):
        pass

    def check_freshness(
        self,
        claims: List[Dict[str, Any]],
        sources: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        F7 Freshness & Outdated Detector:
        Applies exponential decay, checks expired deadlines and academic cycles.
        """
        outdated_findings: List[Dict[str, Any]] = []

        # Map sources by sha256 or url for date lookup
        source_map = {s.get("sha256"): s for s in sources}

        for c in claims:
            attr = c.get("attribute", "")
            val_norm = c.get("value_norm", "")
            s_id = c.get("source_id", "")
            src = source_map.get(s_id, {})
            pub_date = src.get("published_at")

            deadline_str = val_norm if "deadline" in attr else None
            quote_text = c.get("quote", "")

            freshness_res = compute_freshness(
                attribute=attr,
                published_date_str=pub_date,
                deadline_date_str=deadline_str,
                text_snippet=quote_text
            )

            if freshness_res["is_outdated"]:
                reasons_str = "; ".join(freshness_res["reasons"])
                outdated_findings.append({
                    "type": "outdated",
                    "attribute": attr,
                    "statement": f"{attr.replace('_', ' ').capitalize()} jaankari purani ya expired lagti hai: {reasons_str}.",
                    "evidence": [{
                        "quote": c.get("quote", ""),
                        "source_url": c.get("source_url", ""),
                        "source_domain": c.get("source_domain", ""),
                        "location": c.get("location", ""),
                        "source_trust": c.get("source_trust", 0.5)
                    }],
                    "confidence": round(1.0 - freshness_res["freshness"], 2),
                    "label": "potential",
                    "severity": 0.8
                })

        return outdated_findings

freshness_agent = FreshnessAgent()
