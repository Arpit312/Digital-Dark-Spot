from typing import List, Dict, Any, Optional

def compute_consistency_score(
    num_conflicts: int,
    num_comparable_pairs: int
) -> float:
    """
    F16 Policy Consistency Score formula:
    CS = 1 - (#conflicts / #comparable_pairs)
    """
    if num_comparable_pairs <= 0:
        return 1.0

    ratio = num_conflicts / num_comparable_pairs
    cs = max(0.0, min(1.0, 1.0 - ratio))
    return round(float(cs), 4)

def check_faq_staleness(
    faq_source_doc: str,
    superseded_docs: List[str]
) -> Dict[str, Any]:
    """
    Flags FAQ/portal claim whose source circular has been superseded by a newer order.
    """
    is_stale = faq_source_doc in superseded_docs
    return {
        "is_stale": is_stale,
        "reason": f"Source document '{faq_source_doc}' has been superseded by a newer official notification." if is_stale else "Source document is active."
    }

def audit_draft_against_corpus(
    draft_claims: List[Dict[str, Any]],
    active_corpus_claims: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Draft mode: compares draft claims with current non-superseded active claims
    and reports contradictions before the policy is published.
    """
    contradictions = []

    for d_claim in draft_claims:
        attr = d_claim.get("attribute", "").lower()
        d_val = str(d_claim.get("value_norm", d_claim.get("value_raw", ""))).strip().lower()

        for c_claim in active_corpus_claims:
            c_attr = c_claim.get("attribute", "").lower()
            if attr == c_attr:
                c_val = str(c_claim.get("value_norm", c_claim.get("value_raw", ""))).strip().lower()
                if d_val and c_val and d_val != c_val:
                    contradictions.append({
                        "attribute": attr,
                        "draft_value": d_claim.get("value_raw"),
                        "corpus_value": c_claim.get("value_raw"),
                        "corpus_source": c_claim.get("source_url", "Official Circular"),
                        "warning": f"Draft value contradicts existing active policy for {attr}."
                    })

    return contradictions
