# Expense Tracker — Student BASE App

C-VERSE student project applying the same **10 base features** as Fix-My-Ride, with expense-domain names.

See [TRANSFER-SHEET.md](TRANSFER-SHEET.md) for the pattern mapping.

## What this app does (BASE)

- Register / login (**Member** or **Admin**)
- Admin manages **categories**
- Members create **expenses** (must pick a category; amount > 0)
- Admin advances status: `recorded` → `reviewed` → `closed`
- Search/filter expenses by status and category name
- Data saved in SQLite (quick local) or PostgreSQL

## Demo accounts (seeded on first backend start)

| Email | Password | Role |
|-------|----------|------|
| member@demo.com | demo1234 | member |
| admin@demo.com | demo1234 | admin |

---

## Quick start

### Terminal 1 — Backend (port 8000)

```bash
cd course/student-projects/expense-tracker/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Check: http://localhost:8000/health → `"status":"ok"`  
Docs: http://localhost:8000/docs

### Terminal 2 — Frontend (port 5173)

```bash
cd course/student-projects/expense-tracker/frontend
npm install --registry https://registry.npmjs.org
npm run dev
```

Open: http://localhost:5173

---

## Verify checklist

1. Health OK  
2. Login as member → add expense under Food (or create category as admin first)  
3. Login as admin → Mark reviewed → Mark closed  
4. Filter by status / search category  
5. Restart backend → data still there (`backend/expense_tracker.db`)

---

## Enhance Later (do not build in BASE)

Budgets, receipt uploads, bank sync, multi-currency, charts, shared households, mobile app.

## Stack

React + Vite (JS) · FastAPI · SQLAlchemy · SQLite or PostgreSQL · JWT auth
