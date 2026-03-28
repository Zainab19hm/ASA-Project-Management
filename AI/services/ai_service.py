import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "meta-llama/llama-3.3-70b-instruct:free"
API_URL = "https://openrouter.ai/api/v1/chat/completions"

def call_model(system_prompt: str, user_input: str, retries: int = 3):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer":"http://localhost:8000",
        "X-Title":"ASA Project"
    }
    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ]
    }
    for attempt in range(retries):
        try:
            response = requests.post(API_URL, json=body, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            choice = data["choices"][0]["message"]
            content = choice.get("content") or choice.get("reasoning_content") or ""
            if not content:
                raise ValueError("Empty response from model")
            return content
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")  # ← add this
            if attempt == retries - 1:
                raise RuntimeError(f"Failed after {retries} attempts: {e}")
            time.sleep(5)
                                                                                                                                                                                                                                                                                                                            