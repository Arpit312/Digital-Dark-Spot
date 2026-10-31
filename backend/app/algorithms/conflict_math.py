from typing import Dict, Any, List, Set, Tuple, Optional

def check_numeric_or_date_conflict(
    val1: Any,
    val2: Any,
    attr_weight: float = 1.0,
    trust1: float = 0.5,
    trust2: float = 0.5
) -> Optional[Dict[str, Any]]:
    """
    Deterministic conflict check for numbers, dates, amounts.
    Conflict if val1 != val2.
    Severity = P_con * w_a * (T1 + T2) / 2 where P_con = 1.0
    """
    if val1 is None or val2 is None:
        return None
        
    if val1 != val2:
        severity = round(1.0 * attr_weight * ((trust1 + trust2) / 2.0), 3)
        return {
            "is_conflict": True,
            "type": "deterministic_mismatch",
            "val1": val1,
            "val2": val2,
            "severity": severity,
            "resolution_hint": "Source 1 preferred" if trust1 > trust2 else "Source 2 preferred" if trust2 > trust1 else "Both sources have equal trust"
        }
    return None

def check_jaccard_set_conflict(
    set_a: List[str],
    set_b: List[str],
    attr_weight: float = 0.9,
    trust1: float = 0.5,
    trust2: float = 0.5
) -> Optional[Dict[str, Any]]:
    """
    Jaccard set comparison for document lists:
    J(A, B) = |A ∩ B| / |A ∪ B|
    Conflict if J < 1.0, reporting symmetric difference.
    """
    s_a = set(set_a)
    s_b = set(set_b)
    
    if not s_a or not s_b:
        return None
        
    intersection = s_a.intersection(s_b)
    union = s_a.union(s_b)
    
    if not union:
        return None
        
    jaccard = len(intersection) / len(union)
    
    if jaccard < 1.0:
        sym_diff = s_a.symmetric_difference(s_b)
        severity = round((1.0 - jaccard) * attr_weight * ((trust1 + trust2) / 2.0), 3)
        return {
            "is_conflict": True,
            "jaccard_similarity": round(jaccard, 3),
            "only_in_source_1": sorted(list(s_a - s_b)),
            "only_in_source_2": sorted(list(s_b - s_a)),
            "symmetric_difference": sorted(list(sym_diff)),
            "severity": severity
        }
    return None

def compute_conflict_severity(
    p_contradiction: float,
    attr_weight: float,
    trust1: float,
    trust2: float
) -> float:
    """
    Severity = P_con * w_a * (T1 + T2) / 2
    """
    return round(float(p_contradiction * attr_weight * ((trust1 + trust2) / 2.0)), 4)
