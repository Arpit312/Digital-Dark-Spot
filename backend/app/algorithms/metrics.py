from typing import List, Dict, Any, Tuple

def compute_classification_metrics(tp: int, fp: int, fn: int) -> Dict[str, float]:
    """
    Computes Precision, Recall, and F1 Score:
    Precision = TP / (TP + FP)
    Recall = TP / (TP + FN)
    F1 = 2 * P * R / (P + R)
    """
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    f1 = (2.0 * precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0

    return {
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1": round(float(f1), 4)
    }

def compute_evidence_faithfulness(findings: List[Dict[str, Any]]) -> float:
    """
    F18 Evidence Faithfulness Formula:
    Faith = (# findings with valid evidence quote) / (# findings)
    Target = 1.0
    """
    if not findings:
        return 1.0

    valid_count = 0
    for f in findings:
        # Deliberate gap abstentions have valid empty or gap quotes
        if f.get("label") == "not_found_in_reviewed_sources":
            valid_count += 1
            continue

        evidence = f.get("evidence", [])
        if evidence and any(e.get("quote") and len(e.get("quote").strip()) > 5 for e in evidence):
            valid_count += 1

    return round(float(valid_count / len(findings)), 4)

def compute_ablation_comparison(
    baseline_metrics: Dict[str, float],
    ablated_metrics: Dict[str, float]
) -> Dict[str, Any]:
    """
    Computes ablation delta proving value of Challenger and Auditor agents.
    """
    f1_gain = baseline_metrics.get("f1", 0.0) - ablated_metrics.get("f1", 0.0)
    precision_gain = baseline_metrics.get("precision", 0.0) - ablated_metrics.get("precision", 0.0)

    return {
        "with_challenger_and_auditor": baseline_metrics,
        "without_challenger_and_auditor": ablated_metrics,
        "f1_improvement": round(float(f1_gain), 4),
        "precision_improvement": round(float(precision_gain), 4)
    }
