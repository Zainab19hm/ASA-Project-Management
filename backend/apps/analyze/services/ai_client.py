# backend/apps/analyze/services/ai_client.py
# ADD at top
import asyncio
from concurrent.futures import ThreadPoolExecutor

_executor = ThreadPoolExecutor(max_workers=3)

async def analyze_parallel(scope_text: str) -> dict:
    """Run WBS, Gantt, Risk in parallel threads."""
    loop = asyncio.get_event_loop()
    results = await asyncio.gather(
        loop.run_in_executor(_executor, call_wbs_model, scope_text),
        loop.run_in_executor(_executor, call_gantt_model, scope_text),
        loop.run_in_executor(_executor, call_risk_model, scope_text),
    )
    return {"wbs": results[0], "gantt": results[1], "risk": results[2]}