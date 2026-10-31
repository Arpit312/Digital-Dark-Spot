import math
from typing import List, Dict, Any, Tuple

def compute_bm25_score(
    query_tokens: List[str],
    doc_tokens: List[str],
    avg_doc_len: float,
    doc_freqs: Dict[str, int],
    total_docs: int,
    k1: float = 1.5,
    b: float = 0.75
) -> float:
    """
    F4 BM25 Formula:
    BM25(q, d) = Σ_t IDF(t) * [ f(t, d) * (k1 + 1) ] / [ f(t, d) + k1 * (1 - b + b * |d| / avgdl) ]
    IDF(t) = ln( (N - n_t + 0.5) / (n_t + 0.5) + 1 )
    """
    if not doc_tokens or not query_tokens:
        return 0.0

    doc_len = len(doc_tokens)
    tf_map: Dict[str, int] = {}
    for token in doc_tokens:
        tf_map[token] = tf_map.get(token, 0) + 1

    score = 0.0
    for term in query_tokens:
        if term not in tf_map:
            continue

        f_td = tf_map[term]
        n_t = doc_freqs.get(term, 1)

        # IDF calculation
        idf = math.log(((total_docs - n_t + 0.5) / (n_t + 0.5)) + 1.0)
        
        # Term score
        numerator = f_td * (k1 + 1.0)
        denominator = f_td + k1 * (1.0 - b + b * (doc_len / (avg_doc_len or 1.0)))
        score += idf * (numerator / denominator)

    return round(float(score), 4)

def compute_cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Computes cosine similarity between two dense embedding vectors"""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return round(float(dot / (norm_a * norm_b)), 4)

def reciprocal_rank_fusion(
    ranked_lists: List[List[str]],
    k: int = 60
) -> List[Tuple[str, float]]:
    """
    F4 Reciprocal Rank Fusion (RRF):
    RRF(d) = Σ_i 1 / (k + rank_i(d))
    where rank_i(d) is 1-indexed.
    """
    rrf_scores: Dict[str, float] = {}

    for ranked_list in ranked_lists:
        for rank, doc_id in enumerate(ranked_list, start=1):
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank))

    # Sort descending by fused score
    sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
    return [(doc_id, round(score, 6)) for doc_id, score in sorted_docs]
