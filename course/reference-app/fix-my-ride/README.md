# Fix-My-Ride — BASE (Final Reference App)

Working end-of-course base for the C-VERSE teaching pack.

**Start here to run and test:** jump to [Quick start (recommended)](#quick-start-recommended).

---

## What this app does

- Register / login (Customer or Staff)
- Customers manage **bikes** and create **bookings**
- Staff update booking status: `booked` → `in_progress` → `completed`
- Search/filter bookings by status
- Data saved in a database (SQLite for quick local test, or PostgreSQL for the course stack)

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite (JavaScript) |
| Backend | FastAPI + SQLAlchemy |
| Database | SQLite (easy local) or PostgreSQL (course default long-term) |

## Demo accounts (created automatically on first backend start)

| Email | Password | Role |
|-------|----------|------|
| customer@demo.com | demo1234 | customer |
| staff@demo.com | demo1234 | staff |

---

## Prerequisites

Install before you start:

1. **Node.js 18+** — [https://nodejs.org](https://nodejs.org) (`node -v`, `npm -v`)
2. **Python 3.10+** — (`python3 --version`)
3. **PostgreSQL** — only if you choose the Postgres option below

---

## Quick start (recommended)

Uses **SQLite** so you can test without installing PostgreSQL.

Open **two terminals**.

### Terminal 1 — Backend

```bash
cd course/reference-app/fix-my-ride/backend

python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env               # skip if .env already exists

uvicorn app.main:app --reload --port 8000
```

Leave this running. You should see something like:

```text
Uvicorn running on http://127.0.0.1:8000
```

**Check backend:** open [http://localhost:8000/health](http://localhost:8000/health)  
Expected: `{"status":"ok","app":"fix-my-ride-base"}`

**API docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### Terminal 2 — Frontend

```bash
cd course/reference-app/fix-my-ride/frontend

# If your company npm registry fails (e.g. 503), use the public registry:
npm install --registry https://registry.npmjs.org

npm run dev
```

Leave this running. Vite prints a URL, usually:

```text
http://localhost:5173
```

**Check frontend:** open [http://localhost:5173](http://localhost:5173)  
You should see the **Login** screen.

---

## How to verify the app is running (test checklist)

Do these in order:

### 1. Health check

- [ ] [http://localhost:8000/health](http://localhost:8000/health) returns JSON with `"status":"ok"`

### 2. Customer flow

1. Open [http://localhost:5173](http://localhost:5173)
2. Login: `customer@demo.com` / `demo1234`
3. Open **Bikes** → confirm demo bike `TN28AB1234` (or add a new bike)
4. Open **Bookings** → create a booking for that bike
5. Confirm the booking shows status **booked**

### 3. Staff flow

1. Logout
2. Login: `staff@demo.com` / `demo1234`
3. Open **Bookings** → see bookings (including the customer’s)
4. Click **Mark in_progress**, then later **Mark completed**
5. Confirm illegal jumps are blocked (staff can only move one step at a time)

### 4. Search / filter

- [ ] Filter bookings by status
- [ ] Search by registration number (e.g. `TN28`)

### 5. Persistence

1. Stop the backend (Ctrl+C) and start it again
2. Login again — bikes and bookings should still be there  
   (SQLite file: `backend/fixmyride.db`)

If all boxes pass, the base app is running correctly.

---

## Environment (`.env`)

File: `backend/.env` (copy from `.env.example`)

### Easy local (default)

```text
DATABASE_URL=sqlite:///./fixmyride.db
SECRET_KEY=cverse-dev-secret-change-me
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

### PostgreSQL (course / production-like)

1. Create DB: `createdb fixmyride` (or `CREATE DATABASE fixmyride;` in `psql`)
2. Set:

```text
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@localhost:5432/fixmyride
SECRET_KEY=cverse-dev-secret-change-me
ACCESS_TOKEN_EXPIRE_MINUTES=480
```

3. Restart backend. Tables are created on startup; demo users are seeded if the DB is empty.

Optional SQL files (not required when using app startup):

```bash
psql -d fixmyride -f db/schema.sql
```

---

## Project layout

```text
fix-my-ride/
├── README.md          ← this file (run / test / deploy)
├── frontend/          React (Vite) — port 5173
├── backend/           FastAPI — port 8000
│   ├── .env.example
│   ├── requirements.txt
│   └── app/
└── db/                schema.sql (Postgres reference)
```

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `Address already in use` on 8000 | Another process is using the port. Stop it, or run `uvicorn ... --port 8001` and set frontend API URL (see below). |
| Frontend loads but API fails | Confirm backend is running. Open Network tab; requests should go to `http://localhost:8000`. |
| CORS / blocked request | Backend must allow `http://localhost:5173` (already set in `app/main.py`). |
| Login fails on first run | Wait for backend startup to finish (it seeds demo users). Check terminal for errors. |
| `ModuleNotFoundError` | Activate `.venv` and run `pip install -r requirements.txt` again. |
| `npm` errors | Use Node 18+. Delete `node_modules` and run `npm install` again. |
| Postgres connection refused | Use SQLite quick start, or start PostgreSQL and fix `DATABASE_URL`. |
| Wrong Python | Prefer `python3 -m venv .venv` (not system Python without venv). |

### Point frontend at a different API port

Create `frontend/.env`:

```text
VITE_API_URL=http://localhost:8001
```

Restart `npm run dev`.

---

## Deploying (overview)

The **C-VERSE course** only requires a running local base + GitHub. Full cloud deploy is optional / enhance-later. Below is a practical path when you are ready.

### A. What you are deploying

You need **three** pieces in production:

1. **Frontend** — static files from `npm run build` (`frontend/dist/`)
2. **Backend** — FastAPI app (`uvicorn` / hosting platform)
3. **Database** — managed PostgreSQL (recommended for production; not SQLite)

### B. Build the frontend

```bash
cd frontend
npm install
npm run build
```

Output folder: `frontend/dist/`

Set the public API URL at build time if needed:

```bash
# example
VITE_API_URL=https://api.yourdomain.com npm run build
```

### C. Run the backend in production (simple)

On a server with Python + Postgres:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `.env` with a strong `SECRET_KEY` and a real `DATABASE_URL` (Postgres).

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

For a long-running process, use a process manager (systemd, Supervisor) or a PaaS.

Update CORS in `app/main.py` to allow your real frontend origin (not only localhost).

### D. Hosting options (pick one later)

| Piece | Easy options |
|-------|----------------|
| Frontend | Netlify, Vercel, Cloudflare Pages, GitHub Pages, GoDaddy static `public_html` |
| Backend | Render, Railway, Fly.io, a VPS (DigitalOcean, etc.) |
| Database | Neon, Supabase, Railway Postgres, any managed Postgres |

**Typical flow:**

```text
Browser
  → Frontend (static host)
  → API calls to Backend URL
  → Backend talks to Postgres
```

### E. GoDaddy note (marketing site vs this app)

`cverse-godaddy-upload.zip` in the repo root is only the **marketing website** static build — not Fix-My-Ride.

Fix-My-Ride needs a **backend + database**. GoDaddy shared hosting alone is usually enough for static HTML, but not ideal for FastAPI/Postgres. Prefer a small PaaS for the API/DB, and optionally host the React `dist/` on GoDaddy or another static host.

### F. Minimum production checklist

- [ ] `SECRET_KEY` is long and private (not the course demo value)
- [ ] `DATABASE_URL` points to Postgres (not SQLite) for real users
- [ ] CORS allows only your frontend domain
- [ ] HTTPS on frontend and API
- [ ] Demo passwords changed or demo seed disabled
- [ ] `.env` is never committed to GitHub

---

## Enhance Later (not in this base)

Multi-branch, technician assignment, invoices, payments, WhatsApp, GPS, AI — see [`../../FIX-MY-RIDE.md`](../../FIX-MY-RIDE.md).
