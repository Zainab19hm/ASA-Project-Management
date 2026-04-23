import json
import re
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.ai_service import call_model, WBS_PROMPT, GANTT_PROMPT, RISK_PROMPT, QA_PROMPT

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScopeInput(BaseModel):
    scope_text: str

class QAInput(BaseModel):
    question: str

def clean_text(text: str) -> str:
    text = text.replace('\n', ' ').replace('\r', ' ')
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

@app.post("/wbs")
async def generate_wbs(input: ScopeInput):
    try:
        result = call_model(WBS_PROMPT, clean_text(input.scope_text))
        data = json.loads(result)
        with open("wbs_output.json", "w") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/gantt")
async def generate_gantt(input: ScopeInput):
    try:
        result = call_model(GANTT_PROMPT, clean_text(input.scope_text))
        data = json.loads(result)
        with open("gantt_output.json", "w") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/risk")
async def generate_risk(input: ScopeInput):
    try:
        result = call_model(RISK_PROMPT, clean_text(input.scope_text))
        data = json.loads(result)
        with open("risk_output.json", "w") as f:
            json.dump(data, f, indent=2)
        return data
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.post("/qa")
async def answer_question(input: QAInput):
    try:
        result = call_model(QA_PROMPT, clean_text(input.question))
        return {"answer": result}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))