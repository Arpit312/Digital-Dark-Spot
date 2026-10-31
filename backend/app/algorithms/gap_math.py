from typing import Dict, Any, List, Optional

def compute_attribute_gap_score(
    max_match_prob_times_trust: float
) -> float:
    """
    F5 Gap score formula:
    G_a = 1 - max_s [ P(a | claim_s) * T(s) ]
    """
    g = 1.0 - max_match_prob_times_trust
    return max(0.0, min(1.0, round(float(g), 4)))

def compute_overall_coverage(
    attribute_gap_scores: Dict[str, float],
    attribute_weights: Dict[str, float]
) -> float:
    """
    Coverage Formula:
    C = Σ_a w_a * (1 - G_a) / Σ_a w_a
    """
    total_weight = 0.0
    weighted_sum = 0.0
    
    for attr, G_a in attribute_gap_scores.items():
        w_a = attribute_weights.get(attr, 1.0)
        total_weight += w_a
        weighted_sum += w_a * (1.0 - G_a)
        
    if total_weight <= 0:
        return 0.0
        
    return round(float(weighted_sum / total_weight), 4)

def compute_dark_spot_index(coverage: float) -> float:
    """
    Dark Spot Index: DSI = 1 - C
    """
    return round(max(0.0, min(1.0, 1.0 - coverage)), 4)
