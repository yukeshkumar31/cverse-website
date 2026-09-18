# Fix-My-Ride — BASE (Final Reference App)

Working end-of-course base for the C-VERSE teaching pack.

## What this app does

- Register / login (Customer or Staff)
- Customers manage **bikes** and create **bookings**
- Staff update booking status: `booked` → `in_progress` → `completed`
- Search/filter bookings by status
- Data stored in PostgreSQL

## Stack

- Frontend: React + Vite (JavaScript)
- Backend: FastAPI + SQLAlchemy
- Database: PostgreSQL

## Demo accounts (after seed)

| Email | Password | Role |
|-------|----------|------|
| customer@demo.com | demo1234 | customer |
| staff@demo.com | demo1234 | staff |

## Setup

### 1. Database

Create a database named `fixmyride`:

```bash
createdb fixmyride
# or via psql: CREATE DATABASE fixmyride;
```

Load schema + seed (optional if backend creates tables):

```bash
psql -d fixmyride -f db/schema.sql
psql -d fixmyride -f db/seed.sql
```

### 2. Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # edit DATABASE_URL if needed
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Environment

Backend `.env`:

```text
DATABASE_URL=postgresql+psycopg://localhost:5432/fixmyride
SECRET_KEY=cverse-dev-secret-change-me
```

If your Postgres user/password differ:

```text
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@localhost:5432/fixmyride
```

## Project layout

```text
fix-my-ride/
├── frontend/     React app
├── backend/      FastAPI app
└── db/           schema.sql, seed.sql
```

## Enhance Later (not in this base)

Multi-branch, technician assignment, invoices, payments, WhatsApp, GPS, AI — see course/FIX-MY-RIDE.md


## Checkpoint note

Week 7 end-state: JWT auth + customer/staff role behaviour working.
