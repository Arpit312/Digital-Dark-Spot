import logging
import httpx
from typing import Optional, Dict, Any
from backend.app.config import settings

logger = logging.getLogger(__name__)

class SupabaseAuth:
    def __init__(self):
        self.jwks_url = settings.SUPABASE_JWKS_URL or f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        self._jwks_cache = None

    async def get_jwks(self) -> Optional[Dict[str, Any]]:
        """Fetches and caches Supabase JWKS public keys"""
        if self._jwks_cache:
            return self._jwks_cache
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(self.jwks_url)
                if resp.status_code == 200:
                    self._jwks_cache = resp.json()
                    return self._jwks_cache
                else:
                    logger.warning(f"Could not fetch JWKS: {resp.status_code}")
                    return None
        except Exception as e:
            logger.error(f"Error fetching JWKS from {self.jwks_url}: {e}")
            return None

    async def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Verifies a user's Bearer JWT token against Supabase JWKS.
        Returns user payload (sub, email, role) if valid, None otherwise.
        """
        if not token:
            return None
        try:
            # We can also verify against Supabase /auth/v1/user endpoint directly
            user_url = f"{settings.SUPABASE_URL}/auth/v1/user"
            headers = {
                "apikey": settings.SUPABASE_ANON_KEY or settings.SUPABASE_SERVICE_ROLE_KEY,
                "Authorization": f"Bearer {token}"
            }
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(user_url, headers=headers)
                if resp.status_code == 200:
                    user_data = resp.json()
                    return {
                        "user_id": user_data.get("id"),
                        "email": user_data.get("email"),
                        "role": user_data.get("role", "authenticated")
                    }
                else:
                    return None
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return None

auth_service = SupabaseAuth()
