import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class ChallengerAgent:
    def __init__(self):
        pass

    def challenge_findings(self, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        F9 Challenger Agent:
        Adversarial evaluation to reduce false positives.
        Verifies if conflicts are real rather than cosmetic paraphrasing.
        """
        verified_findings: List[Dict[str, Any]] = []

        for f in findings:
            f_type = f.get("type")
            conf = f.get("confidence", 0.8)

            # Adversarial check for conflicts:
            if f_type == "conflict":
                ev = f.get("evidence", [])
                if len(ev) >= 2:
                    val1 = str(ev[0].get("value", "")).strip().lower()
                    val2 = str(ev[1].get("value", "")).strip().lower()
                    
                    # If values are identical or trivial difference, drop false positive
                    if val1 == val2:
                        logger.info(f"Challenger dropped spurious conflict with identical values: {val1}")
                        continue
                        
            # Confidence threshold gating
            if conf < 0.40:
                logger.info(f"Challenger pruned low-confidence finding (conf={conf}): {f.get('statement')}")
                continue
            elif 0.40 <= conf < 0.70:
                f["label"] = "uncertain"
            elif f["label"] != "not_found_in_reviewed_sources":
                f["label"] = "potential"

            verified_findings.append(f)

        return verified_findings

challenger_agent = ChallengerAgent()
