import sys
import asyncio
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.config import settings
from backend.app.agents.scout import scout_agent
from backend.app.llm.client import llm_client

async def test_live_connections():
    print("==================================================")
    print("Testing Live API Keys (100% Real Data Test)")
    print("==================================================")
    
    # 1. Test Tavily
    print("[1/2] Testing Tavily Live Search API...")
    try:
        tavily_results = await scout_agent.search_live_sources("National Scholarship Portal eligibility deadline 2026", max_results=2)
        print(f"      -> Tavily Status: SUCCESS ({len(tavily_results)} live web sources fetched!)")
        for idx, s in enumerate(tavily_results):
            print(f"         Source {idx+1}: {s.get('domain')} (Trust: {s.get('trust')})")
    except Exception as e:
        print(f"      -> Tavily Error: {e}")

    # 2. Test LLM (Gemini / Groq fallback)
    print("[2/2] Testing LLM Generation...")
    try:
        llm_out = await llm_client.generate_json(
            "Extract attribute value: The scholarship deadline is 15th November 2026.",
            schema_desc='{"deadline": "string", "verified": true}'
        )
        print(f"      -> LLM Status: SUCCESS! Output: {llm_out}")
    except Exception as e:
        print(f"      -> LLM Error: {e}")

    print("==================================================")

if __name__ == "__main__":
    asyncio.run(test_live_connections())
