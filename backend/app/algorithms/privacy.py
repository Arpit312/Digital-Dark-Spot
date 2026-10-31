from typing import Dict, Any, List, Optional

def apply_k_anonymity_suppression(
    data_counts: Dict[str, int],
    k: int = 10
) -> Dict[str, Any]:
    """
    F14 k-Anonymity privacy rule:
    Suppresses (masks) any aggregate cell with count < k (default 10)
    to protect citizen privacy under DPDP compliance.
    """
    sanitized: Dict[str, Any] = {}
    for key, count in data_counts.items():
        if count < k:
            sanitized[key] = "[SUPPRESSED_FOR_PRIVACY]"
        else:
            sanitized[key] = count
    return sanitized

def compute_ewma_spike(
    e_prev: float,
    x_t: float,
    std_dev: float,
    alpha: float = 0.3,
    z_threshold: float = 3.0
) -> Dict[str, Any]:
    """
    F14 EWMA anomaly spike detection formula:
    E_t = α * x_t + (1 - α) * E_{t-1}
    z_t = (x_t - E_{t-1}) / σ
    Alert if z_t > 3.0
    """
    e_t = (alpha * x_t) + ((1.0 - alpha) * e_prev)
    sigma = max(std_dev, 0.001)
    z_score = (x_t - e_prev) / sigma

    is_spike = z_score > z_threshold

    return {
        "ewma": round(float(e_t), 4),
        "z_score": round(float(z_score), 4),
        "is_spike": is_spike
    }
