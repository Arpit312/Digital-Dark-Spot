import asyncio
import json
import logging
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from backend.app.config import settings
from backend.app.agents.orchestrator import orchestrator
from backend.app.agents.scout import scout_agent

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("darkspot-atlas")

app = FastAPI(
    title="DarkSpot Atlas API",
    description="Multi-Agent AI Engine that detects information gaps, conflicts, and outdated public data with quote-verified evidence.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and preview
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    question: str
    urls: Optional[List[str]] = None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "DarkSpot Atlas API", "version": "1.0.0"}

@app.post("/analyze")
async def analyze_topic(req: AnalyzeRequest):
    """
    Standard JSON endpoint: analyzes question + URLs and returns full Atlas audit.
    """
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    try:
        result = await orchestrator.analyze_topic(
            question=req.question.strip(),
            urls=req.urls
        )
        return result
    except Exception as e:
        logger.error(f"Error in /analyze: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze/stream")
async def analyze_topic_stream(req: AnalyzeRequest):
    """
    Server-Sent Events (SSE) endpoint: streams live agent progress to frontend.
    """
    if not req.question or not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    async def event_generator():
        progress_queue = []

        async def callback(step: str, detail: str):
            data = json.dumps({"step": step, "detail": detail})
            progress_queue.append(f"data: {data}\n\n")

        # Start analysis task
        task = asyncio.create_task(
            orchestrator.analyze_topic(
                question=req.question.strip(),
                urls=req.urls,
                progress_callback=callback
            )
        )

        while not task.done():
            while progress_queue:
                yield progress_queue.pop(0)
            await asyncio.sleep(0.1)

        result = await task
        while progress_queue:
            yield progress_queue.pop(0)

        # Send final completed result payload
        yield f"data: {json.dumps({'step': 'result', 'payload': result})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@app.post("/sources/search")
async def search_sources(query: str):
    """
    Live Tavily search endpoint for official and educational sources.
    """
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    results = await scout_agent.search_live_sources(query)
    return {"query": query, "results": results}

@app.post("/sources/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload official circular / guidelines PDF and extract text via PyMuPDF.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    content = await file.read()
    extracted = scout_agent.ingest_pdf_bytes(content, file.filename)
    return extracted

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
