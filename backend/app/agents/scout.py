import hashlib
import logging
from typing import List, Dict, Any, Optional
import httpx
from urllib.parse import urlparse
from backend.app.algorithms.trust import compute_trust_score, get_domain_tier
from backend.app.config import settings

logger = logging.getLogger(__name__)

class SourceScoutAgent:
    def __init__(self):
        self.tavily_key = settings.TAVILY_API_KEY

    async def ingest_url(self, url: str) -> Dict[str, Any]:
        """Fetches and cleans live webpage content using trafilatura"""
        try:
            async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
                resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"})
                html = resp.text
                
            import trafilatura
            extracted_text = trafilatura.extract(html, include_links=False, include_tables=True)
            text = extracted_text if extracted_text else html[:5000]
            
            sha = hashlib.sha256(text.encode("utf-8")).hexdigest()
            domain = urlparse(url).netloc
            domain_tier = get_domain_tier(domain)
            trust = compute_trust_score(
                domain_or_url=domain,
                total_chars=len(html),
                cleaned_chars=len(text)
            )
            
            return {
                "url": url,
                "title": domain,
                "domain": domain,
                "tier": domain_tier,
                "text": text,
                "sha256": sha,
                "published_at": None,
                "trust": trust
            }
        except Exception as e:
            logger.error(f"Failed to ingest URL {url}: {e}")
            return {
                "url": url,
                "title": url,
                "domain": urlparse(url).netloc if "://" in url else url,
                "tier": 0.2,
                "text": f"Error fetching source: {str(e)}",
                "sha256": hashlib.sha256(url.encode()).hexdigest(),
                "published_at": None,
                "trust": 0.2
            }

    def ingest_pdf_bytes(self, pdf_bytes: bytes, filename: str) -> Dict[str, Any]:
        """Extracts text from PDF bytes using PyMuPDF (fitz)"""
        try:
            import fitz
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            pages_text = []
            for page in doc:
                pages_text.append(page.get_text())
            full_text = "\n".join(pages_text).strip()
            
            sha = hashlib.sha256(full_text.encode("utf-8")).hexdigest()
            trust = compute_trust_score("official-pdf.gov.in", authority_fraction=1.0)
            
            return {
                "url": filename,
                "title": filename,
                "domain": "document",
                "tier": 0.9,
                "text": full_text,
                "sha256": sha,
                "published_at": None,
                "trust": trust
            }
        except Exception as e:
            logger.error(f"Failed to ingest PDF {filename}: {e}")
            return {
                "url": filename,
                "title": filename,
                "domain": "document",
                "tier": 0.5,
                "text": f"Error reading PDF: {e}",
                "sha256": hashlib.sha256(filename.encode()).hexdigest(),
                "published_at": None,
                "trust": 0.5
            }

    async def search_live_sources(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Searches live web using Tavily API for genuine official and educational sources"""
        if not self.tavily_key:
            logger.warning("Tavily API key not found. Skipping live search.")
            return []
            
        try:
            from tavily import TavilyClient
            client = TavilyClient(api_key=self.tavily_key)
            results = client.search(
                query=query,
                search_depth="advanced",
                max_results=max_results,
                include_raw_content=False
            )
            
            sources = []
            for item in results.get("results", []):
                url = item.get("url", "")
                title = item.get("title", "")
                content = item.get("content", "")
                domain = urlparse(url).netloc
                tier = get_domain_tier(domain)
                trust = compute_trust_score(domain, total_chars=len(content)+100, cleaned_chars=len(content))
                
                sources.append({
                    "url": url,
                    "title": title,
                    "domain": domain,
                    "tier": tier,
                    "text": content,
                    "sha256": hashlib.sha256(content.encode("utf-8")).hexdigest(),
                    "published_at": None,
                    "trust": trust
                })
            return sources
        except Exception as e:
            logger.error(f"Tavily search failed: {e}")
            return []

scout_agent = SourceScoutAgent()
