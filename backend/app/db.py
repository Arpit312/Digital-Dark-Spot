import logging
from typing import Optional, Dict, Any, List
import httpx
from backend.app.config import settings

logger = logging.getLogger(__name__)

class SupabaseRestClient:
    """
    Direct high-performance REST client for Supabase.
    Zero external C-dependency issues, works seamlessly via HTTP.
    """
    def __init__(self):
        self.base_url = settings.SUPABASE_URL.rstrip('/')
        # Use secret/service role key for reliable database write access
        self.api_key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY

    def _headers(self) -> Dict[str, str]:
        return {
            "apikey": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    async def insert(self, table: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Inserts a record into the specified Supabase table"""
        if not self.base_url or not self.api_key:
            return None
        url = f"{self.base_url}/rest/v1/{table}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, json=data, headers=self._headers())
                if resp.status_code in [200, 201]:
                    res = resp.json()
                    return res[0] if isinstance(res, list) and res else res
                else:
                    logger.warning(f"Supabase insert to {table} returned {resp.status_code}: {resp.text}")
                    return None
        except Exception as e:
            logger.error(f"Supabase insert failed for {table}: {e}")
            return None

    async def select(self, table: str, params: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Queries records from the specified Supabase table"""
        if not self.base_url or not self.api_key:
            return []
        url = f"{self.base_url}/rest/v1/{table}"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(url, params=params, headers=self._headers())
                if resp.status_code == 200:
                    return resp.json()
                else:
                    logger.warning(f"Supabase select from {table} returned {resp.status_code}: {resp.text}")
                    return []
        except Exception as e:
            logger.error(f"Supabase select failed for {table}: {e}")
            return []

supabase_db = SupabaseRestClient()

def get_supabase_client():
    if settings.SUPABASE_URL and (settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY):
        return supabase_db
    return None
