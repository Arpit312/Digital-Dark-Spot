import json
import hashlib
from typing import Dict, Any, List, Set, Optional

def get_canonical_json(data: Dict[str, Any]) -> str:
    """Returns deterministic, sorted canonical JSON string for cryptographic signing"""
    return json.dumps(data, sort_keys=True, separators=(',', ':'))

def verify_dual_approval(signatures: List[Dict[str, str]]) -> bool:
    """
    F15 Dual-Approval rule:
    Requires at least 2 distinct authorized officer signatures to activate signed fact.
    """
    if len(signatures) < 2:
        return False

    signers = set()
    for sig in signatures:
        officer = sig.get("officer_id")
        signature_hash = sig.get("signature")
        if officer and signature_hash:
            signers.add(officer)

    return len(signers) >= 2

def compute_minhash_jaccard(
    shingles_a: Set[str],
    shingles_b: Set[str],
    num_hashes: int = 64
) -> float:
    """
    MinHash Jaccard estimation:
    Ĵ(A, B) = (1/m) * Σ [ h_i(A) == h_i(B) ]
    """
    if not shingles_a or not shingles_b:
        return 0.0

    matches = 0
    for seed in range(num_hashes):
        # Hash each set with seed
        min_a = min(int(hashlib.sha256(f"{seed}:{w}".encode('utf-8')).hexdigest()[:8], 16) for w in shingles_a)
        min_b = min(int(hashlib.sha256(f"{seed}:{w}".encode('utf-8')).hexdigest()[:8], 16) for w in shingles_b)
        if min_a == min_b:
            matches += 1

    return round(float(matches / num_hashes), 4)

def check_drift_alert(
    page_value: str,
    signed_value: str,
    attr_weight: float = 1.0,
    trust_signed: float = 1.0
) -> Optional[Dict[str, Any]]:
    """
    F15 Drift Watch:
    Raises alert when third-party page value differs from authoritative signed fact.
    Severity = w_a * T_signed
    """
    if not page_value or not signed_value:
        return None

    if page_value.strip().lower() != signed_value.strip().lower():
        severity = round(attr_weight * trust_signed, 3)
        return {
            "drift_detected": True,
            "signed_fact": signed_value,
            "third_party_value": page_value,
            "severity": severity,
            "action": "Issue formal correction request to third-party publisher"
        }

    return None
