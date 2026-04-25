@echo off
echo Starting AI Service...
start cmd /k "cd AI && pip install -r requirements.txt && python -m uvicorn main:app --port 8001 --reload"

echo Starting Backend Service...
start cmd /k "cd backend && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver 8000"

echo Starting Frontend Service...
start cmd /k "npm install && npm run dev"

echo All services are starting in separate windows.
pause
