import logging
from typing import List, Dict, Any
from backend.app.algorithms.gap_math import compute_attribute_gap_score, compute_overall_coverage, compute_dark_spot_index

logger = logging.getLogger(__name__)

class GapFinderAgent:
    def __init__(self):
        pass

    def find_gaps(
        self,
        template: Dict[str, Any],
        claims: List[Dict[str, Any]],
        sources: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        F5 Gap Detection:
        Matches extracted claims against expected attributes in template.
        Computes G_a, Coverage C, and DSI.
        """
        expected_attrs = template.get("attributes", [])
        attr_weights = {a["name"]: a.get("importance", 1.0) for a in expected_attrs}
        
        # Group claims by attribute
        claims_by_attr: Dict[str, List[Dict[str, Any]]] = {}
        for c in claims:
            attr = c.get("attribute", "").lower()
            if attr not in claims_by_attr:
                claims_by_attr[attr] = []
            claims_by_attr[attr].append(c)

        attribute_gap_scores: Dict[str, float] = {}
        findings: List[Dict[str, Any]] = []
        coverage_matrix: Dict[str, Any] = {}

        for attr_item in expected_attrs:
            attr_name = attr_item["name"]
            attr_desc = attr_item.get("description", "")
            w_a = attr_item.get("importance", 1.0)

            found_claims = claims_by_attr.get(attr_name, [])

            if not found_claims:
                # Information is completely absent from all reviewed sources
                gap_score = 1.0
                attribute_gap_scores[attr_name] = gap_score
                findings.append({
                    "type": "gap",
                    "attribute": attr_name,
                    "statement": f"{attr_name.replace('_', ' ').capitalize()} ({attr_desc}) reviewed sources mein nahi mili.",
                    "evidence": [],
                    "confidence": 0.95,
                    "label": "not_found_in_reviewed_sources",
                    "severity": round(w_a, 2)
                })
            else:
                # Find maximum trust-weighted match
                max_score = 0.0
                best_claim = found_claims[0]
                for c in found_claims:
                    # Trust score of the source providing this claim
                    t_s = c.get("source_trust", 0.5)
                    claim_conf = c.get("confidence", 0.8)
                    score = claim_conf * t_s
                    if score > max_score:
                        max_score = score
                        best_claim = c

                gap_score = compute_attribute_gap_score(max_score)
                attribute_gap_scores[attr_name] = gap_score

                if gap_score > 0.60:
                    findings.append({
                        "type": "gap",
                        "attribute": attr_name,
                        "statement": f"{attr_name.replace('_', ' ').capitalize()} ki jaankari adhoori ya low-trust sources se hai.",
                        "evidence": [{
                            "quote": best_claim.get("quote", ""),
                            "source_url": best_claim.get("source_url", ""),
                            "source_trust": best_claim.get("source_trust", 0.5)
                        }],
                        "confidence": round(1.0 - gap_score, 2),
                        "label": "potential",
                        "severity": round(w_a * gap_score, 2)
                    })
                else:
                    # Verified fact covered
                    findings.append({
                        "type": "sourced_fact",
                        "attribute": attr_name,
                        "statement": f"{attr_name.replace('_', ' ').capitalize()}: {best_claim.get('value_raw', '')}",
                        "evidence": [{
                            "quote": best_claim.get("quote", ""),
                            "source_url": best_claim.get("source_url", ""),
                            "location": best_claim.get("location", ""),
                            "source_trust": best_claim.get("source_trust", 0.5)
                        }],
                        "confidence": round(best_claim.get("confidence", 0.9), 2),
                        "label": "sourced_fact",
                        "severity": 0.1
                    })

        coverage = compute_overall_coverage(attribute_gap_scores, attr_weights)
        dsi = compute_dark_spot_index(coverage)

        return {
            "attribute_gaps": attribute_gap_scores,
            "coverage": coverage,
            "dsi": dsi,
            "findings": findings
        }

gap_finder = GapFinderAgent()
