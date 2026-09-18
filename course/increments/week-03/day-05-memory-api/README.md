# Week 3 Day 5 — In-memory FastAPI

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
```

Try http://localhost:8000/docs — create bikes and bookings. Data resets when the server restarts.
