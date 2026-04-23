# Backend

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Run the API:
   - `python manage.py runserver`

## Environment variables

- `AI_SERVICE_BASE_URL` (default: `http://127.0.0.1:8001`)
- `AI_CONNECT_TIMEOUT` (default: `3`)
- `AI_READ_TIMEOUT` (default: `90`)
- `ANALYZE_PARALLEL_WORKERS` (default: `3`)
- `CORS_ALLOW_ALL_ORIGINS` (default: `true`)
