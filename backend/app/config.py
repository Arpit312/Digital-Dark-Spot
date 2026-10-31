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
        self.GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        self.GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

        # Search
        self.TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")

        # Supabase
        self.SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
        self.SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
        self.SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        self.SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
        self.DATABASE_URL: str = os.getenv("DATABASE_URL", "")

        # App options
        self.USE_LOCAL_NLI: bool = os.getenv("USE_LOCAL_NLI", "false").lower() == "true"
        self.PORT: int = int(os.getenv("PORT", "8000"))
        self.HOST: str = os.getenv("HOST", "0.0.0.0")

settings = Settings()
