# Week 5 Day 5 — FastAPI + SQLAlchemy + PostgreSQL

This checkpoint matches the reference backend (auth included early for simplicity of maintenance).
In class, introduce auth concepts in Week 7 even if code already exists here.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# ensure Postgres DB fixmyride exists
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs
