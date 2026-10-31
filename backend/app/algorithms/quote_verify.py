import math
from typing import Tuple

def levenshtein_distance(s1: str, s2: str) -> int:
    """Computes exact Levenshtein edit distance between two strings"""
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def normalized_levenshtein_similarity(quote: str, candidate_text: str) -> float:
    """
    sim(a, b) = 1 - Lev(a, b) / max(|a|, |b|)
    """
    q = quote.strip().lower()
    c = candidate_text.strip().lower()
    
    if not q and not c:
        return 1.0
    if not q or not c:
        return 0.0
        
    max_len = max(len(q), len(c))
    lev = levenshtein_distance(q, c)
    return round(1.0 - (lev / max_len), 4)

def find_best_quote_match(quote: str, source_text: str) -> Tuple[float, str]:
    """
    Finds if the quote exists in the source text.
    First checks exact substring match (sim = 1.0).
    If not, uses sliding window over sentences/lines for highest similarity.
    """
    clean_quote = quote.strip()
    clean_source = source_text.strip()
    
    if not clean_quote or not clean_source:
        return 0.0, ""
        
    # Quick exact substring check
    if clean_quote.lower() in clean_source.lower():
        return 1.0, clean_quote
        
    # Sliding window around similar length
    q_len = len(clean_quote)
    lines = [line.strip() for line in clean_source.split('\n') if len(line.strip()) > 10]
    
    best_sim = 0.0
    best_match = ""
    
    for line in lines:
        sim = normalized_levenshtein_similarity(clean_quote, line)
        if sim > best_sim:
            best_sim = sim
            best_match = line
            if best_sim >= 0.95:
                break
                
    return best_sim, best_match

def compute_claim_confidence(
    quote_sim: float,
    regex_agree: bool = True,
    w1: float = 0.5,
    w2: float = 0.3,
    w3: float = 0.2,
    b: float = 0.1
) -> float:
    """
    p = σ(w1 * quote_sim + w2 * regex_agree + b)
    """
    score = w1 * quote_sim + (w2 if regex_agree else 0.0) + b
    p = 1.0 / (1.0 + math.exp(-score))
    return round(float(p), 4)
