import logging
from typing import List, Dict, Any, Optional, Set
from backend.app.algorithms.conflict_math import check_numeric_or_date_conflict, check_jaccard_set_conflict

logger = logging.getLogger(__name__)

class ConflictDetectorAgent:
    def __init__(self):
        pass

    def detect_conflicts(
        self,
        claims: List[Dict[str, Any]],
        template: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """
        F6 Conflict Detector:
        Groups claims by attribute (blocking).
        Uses deterministic code for numbers, dates, amounts, and lists.
        Generates clean, deduplicated conflict findings with both source quotes side-by-side.
        """
        expected_attrs = template.get("attributes", [])
        attr_weights = {a["name"]: a.get("importance", 1.0) for a in expected_attrs}
        
        claims_by_attr: Dict[str, List[Dict[str, Any]]] = {}
        for c in claims:
            attr = c.get("attribute", "").lower()
            if attr not in claims_by_attr:
                claims_by_attr[attr] = []
            claims_by_attr[attr].append(c)

        conflict_findings: List[Dict[str, Any]] = []

        for attr, attr_claims in claims_by_attr.items():
            if len(attr_claims) < 2:
                continue

            w_a = attr_weights.get(attr, 0.8)
            seen_value_pairs: Set[str] = set()
            attr_conflicts: List[Dict[str, Any]] = []

            # Compare pairs across different sources
            for i in range(len(attr_claims)):
                for j in range(i + 1, len(attr_claims)):
                    c1 = attr_claims[i]
                    c2 = attr_claims[j]

                    # Only compare claims originating from different sources
                    if c1.get("source_id") == c2.get("source_id") and c1.get("source_url") == c2.get("source_url"):
                        continue

                    val1 = str(c1.get("value_norm", c1.get("value_raw", ""))).strip()
                    val2 = str(c2.get("value_norm", c2.get("value_raw", ""))).strip()
                    
                    if not val1 or not val2 or val1.lower() == val2.lower():
                        continue

                    # Deduplication key for pair
                    pair_key = tuple(sorted([val1.lower(), val2.lower()]))
                    if pair_key in seen_value_pairs:
                        continue
                    seen_value_pairs.add(pair_key)

                    t1 = c1.get("source_trust", 0.5)
                    t2 = c2.get("source_trust", 0.5)

                    # 1. Document set comparison
                    if "document" in attr:
                        list1 = [d.strip() for d in val1.split(",") if d.strip()]
                        list2 = [d.strip() for d in val2.split(",") if d.strip()]
                        set_res = check_jaccard_set_conflict(list1, list2, attr_weight=w_a, trust1=t1, trust2=t2)
                        
                        if set_res and set_res["is_conflict"] and set_res["symmetric_difference"]:
                            resolution_hint = (
                                f"{c1.get('source_domain', 'Source 1')} preferred (Trust: {t1:.2f})"
                                if t1 > t2 else
                                f"{c2.get('source_domain', 'Source 2')} preferred (Trust: {t2:.2f})"
                                if t2 > t1 else "Both sources have equal trust rating"
                            )
                            
                            attr_conflicts.append({
                                "type": "conflict",
                                "attribute": attr,
                                "statement": f"Required documents list differs between sources. Discrepancy in: {', '.join(set_res['symmetric_difference'])}.",
                                "evidence": [
                                    {
                                        "source_url": c1.get("source_url", ""),
                                        "source_domain": c1.get("source_domain", ""),
                                        "quote": c1.get("quote", ""),
                                        "value": c1.get("value_raw", ""),
                                        "trust": t1
                                    },
                                    {
                                        "source_url": c2.get("source_url", ""),
                                        "source_domain": c2.get("source_domain", ""),
                                        "quote": c2.get("quote", ""),
                                        "value": c2.get("value_raw", ""),
                                        "trust": t2
                                    }
                                ],
                                "confidence": 0.90,
                                "label": "potential",
                                "severity": set_res["severity"],
                                "resolution_hint": resolution_hint
                            })

                    # 2. Deterministic Number / Date comparison
                    else:
                        num_res = check_numeric_or_date_conflict(val1, val2, attr_weight=w_a, trust1=t1, trust2=t2)
                        if num_res and num_res["is_conflict"]:
                            attr_conflicts.append({
                                "type": "conflict",
                                "attribute": attr,
                                "statement": f"Different values reported for {attr.replace('_', ' ')}: '{c1.get('value_raw')}' vs '{c2.get('value_raw')}'.",
                                "evidence": [
                                    {
                                        "source_url": c1.get("source_url", ""),
                                        "source_domain": c1.get("source_domain", ""),
                                        "quote": c1.get("quote", ""),
                                        "value": c1.get("value_raw", ""),
                                        "trust": t1
                                    },
                                    {
                                        "source_url": c2.get("source_url", ""),
                                        "source_domain": c2.get("source_domain", ""),
                                        "quote": c2.get("quote", ""),
                                        "value": c2.get("value_raw", ""),
                                        "trust": t2
                                    }
                                ],
                                "confidence": 0.95,
                                "label": "potential",
                                "severity": num_res["severity"],
                                "resolution_hint": num_res["resolution_hint"]
                            })

            # Sort by severity descending and take top 3 per attribute
            attr_conflicts.sort(key=lambda x: x.get("severity", 0), reverse=True)
            conflict_findings.extend(attr_conflicts[:3])

        return conflict_findings

conflict_detector = ConflictDetectorAgent()
