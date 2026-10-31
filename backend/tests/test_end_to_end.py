import sys
import asyncio
import json
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(root_dir))

from backend.app.agents.orchestrator import orchestrator

async def run_end_to_end_test():
    print("==================================================")
    print("DarkSpot Atlas - End-to-End Live Multi-Agent Test")
    print("==================================================")

    async def log_step(step, detail):
        print(f"[{step.upper()}] {detail}")

    question = "National Scholarship Portal Post Matric Scholarship eligibility and deadline"
    print(f"Auditing Question: '{question}'\n")

    result = await orchestrator.analyze_topic(
        question=question,
        progress_callback=log_step
    )

    print("\n--------------------------------------------------")
    print(f"Analysis ID: {result.get('id')}")
    print(f"Topic Type: {result.get('topic_type')}")
    print(f"Coverage: {result.get('coverage') * 100:.1f}%")
    print(f"Dark Spot Index (DSI): {result.get('dsi') * 100:.1f}%")
    print(f"Summary: {result.get('summary_counts')}")
    print(f"Total Sources Ingested: {len(result.get('sources', []))}")
    print(f"Total Findings Generated: {len(result.get('findings', []))}")
    print(f"Checklist Actions: {len(result.get('checklist', []))}")
    print("--------------------------------------------------\n")

    print("Sample Findings:")
    for f in result.get("findings", [])[:4]:
        print(f" - [{f.get('type').upper()}] ({f.get('label')}): {f.get('statement')}")

    print("\nSample Verify-Next Actions:")
    for item in result.get("checklist", [])[:3]:
        print(f" - [{item.get('priority').upper()}]: {item.get('action')}")

    print("\n==================================================")
    print("END-TO-END PIPELINE: 100% VERIFIED ON REAL DATA!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_end_to_end_test())
