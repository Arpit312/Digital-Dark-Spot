import math
import re
from datetime import datetime, date
from typing import Optional, Dict, Any

HALF_LIVES = {
    "deadline": 30,
    "documents": 365,
    "eligibility": 365,
    "amount": 365,
    "apply_link": 180,
    "renewal": 365,
    "selection_process": 365,
    "helpline": 730,
    "default": 365
}

def get_current_academic_cycle() -> int:
    """Returns current academic start year, e.g. 2026 for 2026-27"""
    today = date.today()
    return today.year if today.month >= 6 else today.year - 1

def compute_freshness(
    attribute: str,
    published_date_str: Optional[str] = None,
    deadline_date_str: Optional[str] = None,
    text_snippet: str = "",
    reference_date: Optional[date] = None
) -> Dict[str, Any]:
    """
    F7 Freshness Formula:
    F = exp(-lambda_a * delta_days) where lambda_a = ln(2) / half_life_a
    Flags:
    - F < 0.40 => outdated
    - deadline < today => expired_deadline
    - Cycle regex earlier than current cycle => earlier_cycle
    - Undated => F = 0.5, date_unknown
    """
    ref_date = reference_date or date.today()
    h_a = HALF_LIVES.get(attribute.lower(), HALF_LIVES["default"])
    lam = math.log(2.0) / h_a

    is_outdated = False
    reasons = []
    
    # 1. Hard check: Deadline expiration
    if deadline_date_str:
        try:
            d_date = datetime.strptime(deadline_date_str, "%Y-%m-%d").date()
            if d_date < ref_date:
                is_outdated = True
                reasons.append(f"Deadline ({deadline_date_str}) is in the past compared to reference date ({ref_date})")
        except Exception:
            pass

    # 2. Hard check: Academic cycle in text snippet
    cycle_match = re.search(r'\b(20\d\d)[-–/](\d\d|\d{4})\b', text_snippet)
    if cycle_match:
        cycle_start = int(cycle_match.group(1))
        curr_cycle = get_current_academic_cycle()
        if cycle_start < curr_cycle:
            is_outdated = True
            reasons.append(f"Source refers to earlier cycle ({cycle_match.group(0)}) than current ({curr_cycle})")

    # 3. Time decay formula F = exp(-lambda * delta_days)
    if published_date_str:
        try:
            p_date = datetime.strptime(published_date_str, "%Y-%m-%d").date()
            delta_days = max(0, (ref_date - p_date).days)
            F = math.exp(-lam * delta_days)
            if F < 0.40:
                is_outdated = True
                reasons.append(f"Content age ({delta_days} days) exceeds freshness threshold (decay={F:.2f} < 0.40)")
        except Exception:
            F = 0.5
            reasons.append("Invalid publish date format; defaulted freshness to 0.5")
    else:
        # Undated source rule: never assume fresh
        F = 0.5
        reasons.append("Publish date unknown; assigned default freshness 0.5")

    return {
        "freshness": round(float(F), 4),
        "is_outdated": is_outdated,
        "reasons": reasons
    }
