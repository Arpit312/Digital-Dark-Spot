import logging
from typing import Any, Dict, Optional

import httpx

from backend.app.config import settings

logger = logging.getLogger(__name__)


class SupabaseAuth:
    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        if not token or not settings.SUPABASE_URL:
            return None

        api_key = settings.SUPABASE_ANON_KEY or settings.SUPABASE_SERVICE_ROLE_KEY
        if not api_key:
            return None

        user_url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user"
        headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {token}",
        }
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(user_url, headers=headers)
        except httpx.HTTPError as exc:
            logger.error("Supabase token verification request failed: %s", exc)
            raise

        if response.status_code in (401, 403):
            return None
        response.raise_for_status()

        user = response.json()
        if not user.get("id"):
            return None
        return {**user, "user_id": user["id"]}


auth_service = SupabaseAuth()
