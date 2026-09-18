# Week 3 Day 3 — FastAPI health

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/health → `{"status":"ok"}`
