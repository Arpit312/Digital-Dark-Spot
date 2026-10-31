import logging
from typing import Optional
from backend.app.config import settings

logger = logging.getLogger(__name__)

supabase_client = None

def get_supabase_client():
    global supabase_client
    if supabase_client is not None:
        return supabase_client

    if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
        try:
            from supabase import create_client, Client
            supabase_client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
            logger.info("Connected to Supabase client successfully.")
            return supabase_client
        except Exception as e:
            logger.warning(f"Could not initialize Supabase client: {e}")
            return None
    else:
        logger.info("Supabase URL or Key not set. Running in decoupled mode.")
        return None
