import hashlib
from typing import List, Dict, Any, Tuple

def compute_simhash(text: str, hashbits: int = 64) -> int:
    """
    Computes 64-bit SimHash fingerprint for near-duplicate text detection.
    """
    words = text.lower().split()
    if not words:
        return 0

    v = [0] * hashbits
    for word in words:
        # 64-bit hash of token
        h = int(hashlib.md5(word.encode('utf-8')).hexdigest()[:16], 16)
        for i in range(hashbits):
            bitmask = 1 << i
            if h & bitmask:
                v[i] += 1
            else:
                v[i] -= 1

    fingerprint = 0
    for i in range(hashbits):
        if v[i] > 0:
            fingerprint |= (1 << i)

    return fingerprint

def simhash_hamming_distance(hash1: int, hash2: int) -> int:
    """
    Computes Hamming distance (number of differing bits) between two SimHashes.
    d_H <= 3: minor formatting edit
    d_H > 3: meaningful content change
    """
    diff = hash1 ^ hash2
    return bin(diff).count('1')

def compute_cusum_step(
    s_prev: float,
    x_t: float,
    mu: float = 1.0,
    k: float = 0.5,
    threshold_h: float = 5.0
) -> Tuple[float, bool]:
    """
    F13 CUSUM Algorithm for sequential change frequency spike detection:
    S_t = max(0, S_{t-1} + x_t - mu - k)
    Alert triggered if S_t > h.
    """
    s_t = max(0.0, s_prev + x_t - mu - k)
    alert = s_t > threshold_h
    return round(float(s_t), 4), alert
