import json
import logging
from pathlib import Path
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "templates"

class TemplateAgent:
    def __init__(self):
        self.templates: Dict[str, Dict[str, Any]] = {}
        self._load_templates()

    def _load_templates(self):
        """Loads topic templates from JSON files"""
        for t_file in ["scholarship.json", "scheme.json", "admission.json"]:
            p = TEMPLATES_DIR / t_file
            if p.exists():
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        t_type = data.get("topic_type", t_file.replace(".json", ""))
                        self.templates[t_type] = data
                except Exception as e:
                    logger.error(f"Error loading template {t_file}: {e}")

    def get_template(self, topic_type: str) -> Dict[str, Any]:
        """Returns the attribute template for the given topic type"""
        t = self.templates.get(topic_type.lower())
        if t:
            return t
            
        # Default / general template
        return {
            "topic_type": "general",
            "attributes": [
                {"name": "deadline", "description": "Last date or timeline", "importance": 1.0, "half_life_days": 30},
                {"name": "eligibility", "description": "Eligibility conditions or requirements", "importance": 0.9, "half_life_days": 365},
                {"name": "documents", "description": "Mandatory documents or proof required", "importance": 0.9, "half_life_days": 365},
                {"name": "process", "description": "Official application or claim process", "importance": 0.8, "half_life_days": 180},
                {"name": "official_link", "description": "Official link or portal URL", "importance": 0.8, "half_life_days": 180},
                {"name": "helpline", "description": "Contact or helpline support", "importance": 0.4, "half_life_days": 730}
            ]
        }

    def infer_topic_type(self, query: str) -> str:
        """Infers topic type from user query string"""
        q = query.lower()
        if any(w in q for w in ["scholarship", "fellowship", "stipend", "wazifa", "chhatravritti"]):
            return "scholarship"
        elif any(w in q for w in ["scheme", "yojana", "subsidy", "kisan", "awas", "pension"]):
            return "scheme"
        elif any(w in q for w in ["admission", "counselling", "cutoff", "entrance", "college", "seat"]):
            return "admission"
        return "scholarship"  # Default primary focus

template_agent = TemplateAgent()
