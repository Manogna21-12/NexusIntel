import os
import sys
import logging

# Reconfigure stdout/stderr on Windows to prevent Unicode charmap crash when printing emojis
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
if hasattr(sys.stderr, 'reconfigure'):
    try:
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List

from backend.agents.vision_auditor import VisionAuditor
from backend.agents.code_archeologist import CodeArcheologist
from backend.agents.synthesis_engine import SynthesisEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("nexusintel.server")

app = FastAPI(
    title="NexusIntel API",
    description="Multimodal Shadow Product Reverse Engineering Agent Backend",
    version="1.0.0"
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify front-end origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    competitor_name: str
    video_url: Optional[str] = None
    repo_url: Optional[str] = None
    bundle_url: Optional[str] = None
    api_key: Optional[str] = None

class LogMessage(BaseModel):
    agent: str
    message: str

class AnalysisResponse(BaseModel):
    competitor: str
    logs: List[dict]
    conflicts: List[dict]
    timeline: List[dict]
    overall_integrity: float
    generated_at: str

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "NexusIntel Backend"}

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_competitor(payload: AnalysisRequest):
    """
    Triggers the 3-agent reverse-engineering flow:
    Agent 1 (Vision Auditor) -> Agent 2 (Code Diff Archeologist) -> Agent 3 (Synthesis Engine).
    Logs are collected dynamically and returned alongside the resolved strategic timeline.
    """
    execution_logs = []
    
    def log_tracker(agent_name: str, message: str):
        import datetime
        execution_logs.append({
            "agent": agent_name,
            "message": message,
            "timestamp": datetime.datetime.now().strftime("%H:%M:%S")
        })
        # Format print to stdout, handling possible Windows encoding issues
        try:
            print(f"[{agent_name}] {message}")
        except Exception:
            try:
                clean_msg = message.encode('ascii', errors='replace').decode('ascii')
                print(f"[{agent_name}] {clean_msg}")
            except Exception:
                pass

    try:
        competitor = payload.competitor_name
        video_url = payload.video_url
        repo_url = payload.repo_url
        bundle_url = payload.bundle_url
        api_key = payload.api_key

        log_tracker("Orchestrator", f"Spinning up audit sequence for target competitor: '{competitor}'")

        # Step 1: Agent 1 - Vision Auditor
        vision_auditor = VisionAuditor(api_key=api_key)
        vision_results = vision_auditor.analyze(
            video_url=video_url, 
            competitor_name=competitor, 
            log_callback=log_tracker
        )

        # Step 2: Agent 2 - Code Archeologist
        code_archeologist = CodeArcheologist(api_key=api_key)
        code_results = code_archeologist.analyze(
            repo_url=repo_url,
            bundle_url=bundle_url,
            competitor_name=competitor,
            log_callback=log_tracker
        )

        # Step 3: Agent 3 - Synthesis Engine
        synthesis_engine = SynthesisEngine(api_key=api_key)
        synthesis_results = synthesis_engine.synthesize(
            vision_data=vision_results,
            code_data=code_results,
            log_callback=log_tracker
        )

        log_tracker("Orchestrator", "Synthesis complete. Assembling final intelligence report.")

        return AnalysisResponse(
            competitor=synthesis_results["competitor"],
            logs=execution_logs,
            conflicts=synthesis_results["conflicts"],
            timeline=synthesis_results["timeline"],
            overall_integrity=synthesis_results["overall_integrity"],
            generated_at=synthesis_results["generated_at"]
        )

    except Exception as e:
        logger.error(f"Error during agent execution: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal agent error: {str(e)}")

@app.get("/api/presets")
def get_presets():
    """Returns list of demo competitor presets."""
    return [
        {
            "id": "taskflow",
            "name": "TaskFlow Inc.",
            "video_url": "https://youtube.com/watch?v=tf_demo_2026",
            "repo_url": "https://github.com/taskflow-org/app-frontend",
            "bundle_url": "https://taskflow.com/assets/index-b873a.js",
            "description": "Analyze TaskFlow's unannounced collaborative AI Canvas features leaked in their video demo and package dependencies."
        },
        {
            "id": "supadb",
            "name": "SupaDB Platform",
            "video_url": "https://youtube.com/watch?v=supadb_v2_launch",
            "repo_url": "https://github.com/supadb/supadb-js",
            "bundle_url": "https://console.supadb.com/assets/auth-d3912.js",
            "description": "Examine SupaDB's secret passkey biometric SDK integration and local ONNX vector embedding database features."
        }
    ]
