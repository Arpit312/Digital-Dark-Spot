import os
from pathlib import Path
from dotenv import load_dotenv

# Project root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file from root
env_path = ROOT_DIR / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

class Settings:
    def __init__(self):
        # LLM API Keys
        self.GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
        self.GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()

        # Search
        self.TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "").strip()

        # Supabase Configuration (supports both publishable/secret and legacy anon/service_role keys)
        self.SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip()
        
        # Anon / Publishable key
        anon_key = os.getenv("SUPABASE_ANON_KEY", "").strip()
        pub_key = os.getenv("SUPABASE_PUBLISHABLE_KEY", "").strip()
        self.SUPABASE_ANON_KEY: str = pub_key or anon_key

        # Service role / Secret key
        service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "").strip()
        sec_key = os.getenv("SUPABASE_SECRET_KEY", "").strip()
        self.SUPABASE_SERVICE_ROLE_KEY: str = sec_key or service_key

        self.SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "").strip()
        self.SUPABASE_JWKS_URL: str = os.getenv("SUPABASE_JWKS_URL", "").strip()
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "").strip()

        # App options
        self.USE_LOCAL_NLI: bool = os.getenv("USE_LOCAL_NLI", "false").lower() == "true"
        self.PORT: int = int(os.getenv("PORT", "8000"))
        self.HOST: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()
