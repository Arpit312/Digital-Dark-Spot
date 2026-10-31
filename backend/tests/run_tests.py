import sys
import os
from pathlib import Path

# Add project root to sys.path
root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from backend.tests.test_formulas import (
    test_f1_trust_score,
    test_f3_normalization_amounts,
    test_f3_normalization_dates,
    test_f3_normalization_documents,
    test_f7_freshness_decay_and_expiry,
    test_f6_conflict_math,
    test_f5_gap_and_dark_spot_index,
    test_f11_priority_and_mmr,
    test_f2_quote_verification
)

def run_all_tests():
    tests = [
        ("F1 Trust Score Formula", test_f1_trust_score),
        ("F3 Amount Normalization", test_f3_normalization_amounts),
        ("F3 Date Normalization", test_f3_normalization_dates),
        ("F3 Document Set Normalization", test_f3_normalization_documents),
        ("F7 Freshness Decay & Expiry", test_f7_freshness_decay_and_expiry),
        ("F6 Conflict Detection Math", test_f6_conflict_math),
        ("F5 Gap & Dark Spot Index Math", test_f5_gap_and_dark_spot_index),
        ("F11 Priority Scoring & MMR Rerank", test_f11_priority_and_mmr),
        ("F2 Quote Verification", test_f2_quote_verification),
    ]

    print("==================================================")
    print("DarkSpot Atlas - Formula & Algorithm Unit Tests")
    print("==================================================")
    
    passed = 0
    failed = 0
    
    for name, func in tests:
        try:
            func()
            print(f"[PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"[FAIL] {name}: {e}")
            failed += 1

    print("==================================================")
    print(f"Total: {len(tests)} | Passed: {passed} | Failed: {failed}")
    print("==================================================")
    
    if failed > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == "__main__":
    run_all_tests()
