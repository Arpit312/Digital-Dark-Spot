import math
from typing import Dict, Any, List, Optional

def compute_item_priority(
    attribute_importance: float,
    confidence: float,
    days_to_deadline: Optional[int] = None
) -> float:
    """
    F11 Priority formula:
    P = Impact * Uncertainty * Urgency
    Impact = w_a
    Uncertainty = 1 - confidence
    Urgency = exp(-days_to_deadline / 14) [or 1.0 if no deadline / already expired]
    """
    impact = max(0.1, min(1.0, attribute_importance))
    uncertainty = max(0.1, min(1.0, 1.0 - confidence))
    
    if days_to_deadline is not None and days_to_deadline >= 0:
        urgency = math.exp(-float(days_to_deadline) / 14.0)
    else:
        urgency = 1.0
        
    priority = impact * uncertainty * urgency
    return round(float(priority), 4)

def bucket_priority(score: float) -> str:
    """
    Priority buckets:
    High >= 0.6
    Medium >= 0.3
    Low < 0.3
    """
    if score >= 0.6:
        return "High"
    elif score >= 0.3:
        return "Medium"
    else:
        return "Low"

def jaccard_text_similarity(text1: str, text2: str) -> float:
    """Word-level Jaccard similarity for MMR diversity"""
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 or not words2:
        return 0.0
    return len(words1.intersection(words2)) / len(words1.union(words2))

def mmr_rerank(items: List[Dict[str, Any]], lambda_param: float = 0.7, top_k: int = 10) -> List[Dict[str, Any]]:
    """
    Maximal Marginal Relevance (MMR) for deduplicating action items:
    argmax_i [ λ * P_i - (1-λ) * max_{j in S} sim(i, j) ]
    """
    if not items:
        return []
        
    selected: List[Dict[str, Any]] = []
    candidates = list(items)
    
    while candidates and len(selected) < top_k:
        best_score = -float('inf')
        best_idx = -1
        
        for idx, cand in enumerate(candidates):
            p_i = cand.get("priority_score", 0.5)
            
            if not selected:
                mmr_val = p_i
            else:
                max_sim = max(
                    jaccard_text_similarity(cand.get("action", ""), s.get("action", ""))
                    for s in selected
                )
                mmr_val = (lambda_param * p_i) - ((1.0 - lambda_param) * max_sim)
                
            if mmr_val > best_score:
                best_score = mmr_val
                best_idx = idx
                
        if best_idx >= 0:
            selected.append(candidates.pop(best_idx))
        else:
            break
            
    return selected
