import logging
from typing import Any, Dict, List, Optional

import httpx

from backend.app.config import settings

logger = logging.getLogger(__name__)


class SupabaseRestClient:
    """Small async PostgREST client for server-side Supabase operations."""

    def __init__(self) -> None:
        self.base_url = settings.SUPABASE_URL.rstrip("/")
        self.api_key = settings.SUPABASE_SERVICE_ROLE_KEY

    def _headers(self) -> Dict[str, str]:
        return {
            "apikey": self.api_key,
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    async def insert(self, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.base_url or not self.api_key:
            raise RuntimeError("Supabase database is not configured.")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{self.base_url}/rest/v1/{table}",
                    json=data,
                    headers=self._headers(),
                )
                response.raise_for_status()
                records = response.json()
        except httpx.HTTPError as exc:
            logger.error("Supabase insert into %s failed: %s", table, exc)
            raise RuntimeError(f"Supabase insert into {table} failed.") from exc

        return records[0] if isinstance(records, list) and records else records

    async def select(
        self, table: str, params: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        if not self.base_url or not self.api_key:
            raise RuntimeError("Supabase database is not configured.")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/rest/v1/{table}",
                    params=params,
                    headers=self._headers(),
                )
                response.raise_for_status()
                records = response.json()
        except httpx.HTTPError as exc:
            logger.error("Supabase select from %s failed: %s", table, exc)
            raise RuntimeError(f"Supabase query on {table} failed.") from exc

        if not isinstance(records, list):
            raise RuntimeError(f"Supabase query on {table} returned an invalid response.")
        return records

    async def update(
        self,
        table: str,
        params: Dict[str, Any],
        data: Dict[str, Any],
    ) -> List[Dict[str, Any]]:
        if not self.base_url or not self.api_key:
            raise RuntimeError("Supabase database is not configured.")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.patch(
                    f"{self.base_url}/rest/v1/{table}",
                    params=params,
                    json=data,
                    headers=self._headers(),
                )
                response.raise_for_status()
                records = response.json()
        except httpx.HTTPError as exc:
            logger.error("Supabase update on %s failed: %s", table, exc)
            raise RuntimeError(f"Supabase update on {table} failed.") from exc

        if not isinstance(records, list):
            raise RuntimeError(f"Supabase update on {table} returned an invalid response.")
        return records

    async def delete(self, table: str, params: Dict[str, Any]) -> None:
        if not self.base_url or not self.api_key:
            raise RuntimeError("Supabase database is not configured.")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.delete(
                    f"{self.base_url}/rest/v1/{table}",
                    params=params,
                    headers=self._headers(),
                )
                response.raise_for_status()
        except httpx.HTTPError as exc:
            logger.error("Supabase delete from %s failed: %s", table, exc)
            raise RuntimeError(f"Supabase delete from {table} failed.") from exc

    async def count(self, table: str) -> int:
        if not self.base_url or not self.api_key:
            raise RuntimeError("Supabase database is not configured.")

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(
                    f"{self.base_url}/rest/v1/{table}",
                    params={"select": "id"},
                    headers={
                        **self._headers(),
                        "Prefer": "count=exact",
                        "Range": "0-0",
                    },
                )
                response.raise_for_status()
        except httpx.HTTPError as exc:
            logger.error("Supabase count on %s failed: %s", table, exc)
            raise RuntimeError(f"Supabase count on {table} failed.") from exc

        content_range = response.headers.get("content-range", "")
        try:
            return int(content_range.rsplit("/", 1)[1])
        except (IndexError, ValueError) as exc:
            raise RuntimeError(f"Supabase count on {table} returned an invalid response.") from exc


supabase_db = SupabaseRestClient()


def get_supabase_client() -> Optional[SupabaseRestClient]:
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_ROLE_KEY:
        return supabase_db
    return None
