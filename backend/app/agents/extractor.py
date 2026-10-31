import re
import logging
from typing import List, Dict, Any, Optional
from backend.app.algorithms.quote_verify import find_best_quote_match, compute_claim_confidence
from backend.app.algorithms.normalize import normalize_date, normalize_amount, normalize_percentage, normalize_document_set
from backend.app.llm.client import llm_client

logger = logging.getLogger(__name__)

class ClaimExtractionAgent:
    def __init__(self):
        pass

    def chunk_text(self, text: str, chunk_size: int = 1200, overlap: int = 200) -> List[str]:
        """Splits text into chunks with overlap for reliable extraction"""
        if len(text) <= chunk_size:
            return [text]
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunks.append(text[start:end])
            if end >= len(text):
                break
            start += (chunk_size - overlap)
        return chunks

    async def extract_claims_from_source(self, source: Dict[str, Any], topic_attributes: List[str]) -> List[Dict[str, Any]]:
        """
        Extracts structured claims from source text.
        Verifies every quote with Levenshtein sim >= 0.90.
        Drops any unverified or hallucinated claims.
        """
        raw_text = source.get("text", "")
        source_id = source.get("sha256", "")
        source_url = source.get("url", "")
        
        if not raw_text or len(raw_text.strip()) < 50:
            return []
            
        chunks = self.chunk_text(raw_text)
        extracted_claims: List[Dict[str, Any]] = []

        # We inspect up to 3 chunks to balance depth and low latency
        for chunk_idx, chunk in enumerate(chunks[:3]):
            prompt = f"""You are a strict data extraction engine for public policies, scholarships, admissions, and government schemes.
Analyze the following source text chunk and extract atomic facts matching these attributes if mentioned: {', '.join(topic_attributes)}.

Source text:
\"\"\"{chunk}\"\"\"

Return a JSON object with a "claims" array. Each claim must have:
- "attribute": one of [{', '.join(topic_attributes)}]
- "value_raw": the exact value mentioned (e.g. "15 November 2025", "₹1.5 Lakh", "Income Certificate")
- "quote": the verbatim exact sentence or clause from the text that proves this value.
- "location": approximate location (e.g. "Section Eligibility", "Paragraph 1")
"""
            schema = '{"claims": [{"attribute": "string", "value_raw": "string", "quote": "exact sentence from text", "location": "string"}]}'
            
            res = await llm_client.generate_json(prompt, schema_desc=schema)
            if not res or "claims" not in res:
                continue
                
            for item in res.get("claims", []):
                attr = item.get("attribute", "").strip().lower()
                val_raw = item.get("value_raw", "").strip()
                quote = item.get("quote", "").strip()
                loc = item.get("location", f"chunk-{chunk_idx+1}")
                
                if not attr or not val_raw or not quote:
                    continue
                    
                # 1. Quote verification against chunk and full text
                sim, best_match = find_best_quote_match(quote, raw_text)
                if sim < 0.90:
                    logger.info(f"Dropped hallucinated claim quote (sim={sim:.2f} < 0.90): '{quote}'")
                    continue
                    
                # 2. Normalization
                norm_val = val_raw
                if "date" in attr or "deadline" in attr:
                    d_norm = normalize_date(val_raw)
                    norm_val = d_norm["iso"] or val_raw
                elif "amount" in attr or "fee" in attr or "benefit" in attr:
                    a_norm = normalize_amount(val_raw)
                    norm_val = str(a_norm["value"]) if a_norm["value"] is not None else val_raw
                elif "document" in attr:
                    doc_list = [d.strip() for d in val_raw.split(",")]
                    norm_val = ", ".join(normalize_document_set(doc_list))
                    
                conf = compute_claim_confidence(quote_sim=sim, regex_agree=True)
                
                extracted_claims.append({
                    "source_id": source_id,
                    "source_url": source_url,
                    "source_domain": source.get("domain", ""),
                    "source_trust": source.get("trust", 0.5),
                    "attribute": attr,
                    "value_raw": val_raw,
                    "value_norm": norm_val,
                    "quote": best_match if best_match else quote,
                    "location": loc,
                    "confidence": conf
                })

        return extracted_claims

claim_extractor = ClaimExtractionAgent()
