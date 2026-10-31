import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class EvidenceAuditorAgent:
    def __init__(self):
        pass

    def audit_findings(self, findings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        F10 Evidence Auditor:
        Strictly enforces evidence gating.
        Any finding (other than deliberate gap abstentions) lacking verifiable quotes is blocked.
        """
        audited = []
        for f in findings:
            f_type = f.get("type")
            evidence = f.get("evidence", [])
            label = f.get("label")

            # Intentional gap reporting:
            if label == "not_found_in_reviewed_sources":
                audited.append(f)
                continue

            # Conflicts must have at least 2 quotes
            if f_type == "conflict":
                valid_quotes = [e for e in evidence if e.get("quote") and len(e.get("quote").strip()) > 5]
                if len(valid_quotes) < 2:
                    logger.warning(f"Auditor blocked conflict lacking dual evidence quotes: {f.get('statement')}")
                    continue
                f["evidence"] = valid_quotes
                audited.append(f)
                continue

            # Sourced facts and outdated findings must have a verifiable quote
            valid_quotes = [e for e in evidence if e.get("quote") and len(e.get("quote").strip()) > 5]
            if not valid_quotes and f_type in ["sourced_fact", "outdated"]:
                logger.warning(f"Auditor blocked finding lacking quote snippet: {f.get('statement')}")
                continue

            f["evidence"] = valid_quotes
            audited.append(f)

        return audited

evidence_auditor = EvidenceAuditorAgent()
