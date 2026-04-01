import os
import time
import requests
from dotenv import load_dotenv

from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

PROXY = os.getenv("HTTP_PROXY")

proxies = {"http": PROXY, "https": PROXY} if PROXY else None

API_KEY = os.getenv("GROQ_API_KEY")
MODEL = "llama-3.3-70b-versatile"
API_URL = "https://api.groq.com/openai/v1/chat/completions"


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

def call_model(system_prompt: str, user_input: str, retries: int = 3):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    }
    """
    proxies = {
        "http": "http://127.0.0.1:8080",
        "https": "http://127.0.0.1:8080"
    }"""
    
    for attempt in range(retries):
        try:
            response = requests.post(
                API_URL, 
                json=body, 
                headers=headers, 
                timeout=30,
                proxies=proxies
            )
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            if not content:
                raise ValueError("Empty response from model")
            return content
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt == retries - 1:
                raise RuntimeError(f"Failed after {retries} attempts: {e}")
            time.sleep(5)