import json
import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from services.ai_service import call_model

app = FastAPI()

# ─── Prompts ────────────────────────────────────────────────

WBS_PROMPT = """
You are an expert Software Project Manager.
Analyze the given project scope and return ONLY valid JSON representing a Work Breakdown Structure.
No explanation, no markdown, no code blocks.
Use this exact structure:
{
  "project_title": "string",
  "phases": [
    {
      "phase_id": 1,
      "phase_name": "string",
      "tasks": [
        {
          "task_id": "1.1",
          "task_name": "string",
          "description": "string",
          "effort_days": number,
          "role": "string"
        }
      ]
    }
  ]
}
"""

GANTT_PROMPT = """
You are an expert Software Project Manager.
Analyze the given project scope and return ONLY valid JSON for a Gantt chart.
No explanation, no markdown, no code blocks.
Use this exact structure:
{
  "project_title": "string",
  "total_duration_days": number,
  "tasks": [
    {
      "id": 1,
      "name": "string",
      "role": "string",
      "start_day": number,
      "duration_days": number,
      "dependencies": [],
      "is_milestone": false,
      "description": "string"
    }
  ]
}
"""

RISK_PROMPT = """
You are an expert Software Project Manager.
Analyze the given project scope and return ONLY valid JSON representing a Risk Log.
No explanation, no markdown, no code blocks.
Use this exact structure:
{
  "project_title": "string",
  "risks": [
    {
      "risk_id": 1,
      "title": "string",
      "category": "string",
      "probability": "Low | Medium | High",
      "impact": "Low | Medium | High",
      "mitigation": "string"
    }
  ]
}
"""

QA_PROMPT = """
You are a domain-specific assistant specialized ONLY in Software Project Management.
You answer questions about: methodologies, contracts, governance, quality, Agile, Scrum, risk, WBS, Gantt charts, and project planning.
If the question is outside this domain, politely reply: "I can only answer questions related to Software Project Management."
Be concise and professional.
"""

# ─── Input Model ────────────────────────────────────────────

class ScopeInput(BaseModel):
    scope_text: str

class QAInput(BaseModel):
    question: str

# ─── Endpoints ──────────────────────────────────────────────

@app.post("/wbs")
async def generate_wbs(input: ScopeInput):
    try:
        result = call_model(WBS_PROMPT, input.scope_text)
        data = json.loads(result)
        with open("wbs_output.json", "w") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/gantt")
async def generate_gantt(input: ScopeInput):
    try:
        result = call_model(GANTT_PROMPT, input.scope_text)
        data = json.loads(result)
        with open("gantt_output.json", "w") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/risk")
async def generate_risk(input: ScopeInput):
    try:
        result = call_model(RISK_PROMPT, input.scope_text)
        data = json.loads(result)
        with open("risk_output.json", "w") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/qa")
async def answer_question(input: QAInput):
    try:
        result = call_model(QA_PROMPT, input.question)
        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))