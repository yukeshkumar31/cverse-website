# Week 6 Day 5 — Integrated full stack

Run backend (port 8000) and frontend (port 5173) together.

```bash
# terminal 1
cd backend && source .venv/bin/activate && uvicorn app.main:app --reload --port 8000

# terminal 2
cd frontend && npm install && npm run dev
```

Login with customer@demo.com / demo1234 (created on backend startup seed).
