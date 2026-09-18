# Day 1 — Database Connection (Replace Memory Mentally)

## Learning Objective

By the end of today, students can explain why in-memory lists are temporary, configure a PostgreSQL connection string for FastAPI, create a SQLAlchemy engine, and prove the backend can talk to the database with a health check — without yet migrating CRUD.

## Continuity

| From | Carry forward |
|------|----------------|
| Week 3 | FastAPI app with in-memory `bikes` / `bookings` lists |
| Week 4 | PostgreSQL installed; `fixmyride` (or student DB) + schema practiced |
| Today | Wire FastAPI → PostgreSQL; keep memory routes running until Day 3 |

**Start of class check:** Ask “What happens to bikes if you restart uvicorn today?” Expected: “They disappear.” Write that answer on the board — it is today’s problem.

## Theory + Trainer Script

### Concept

A **connection** is a living phone line between your backend process and PostgreSQL.  
**SQLAlchemy’s engine** manages that line. Your routes will later borrow a **session** (Day 3) to run queries.

### Simple Explanation

- **RAM list** = sticky notes on your desk. Close the shop (restart) → notes gone.
- **PostgreSQL** = the shop ledger in the cupboard. Close the shop → ledger stays.
- Week 5 teaches the backend to open the cupboard and write in the ledger.

### Analogy (Tamil-friendly option)

Think of a tea stall:

- Memory list = orders shouted and remembered by one worker.
- Database = the order book under the counter.
- Connection string = the address of that book (which cupboard, which shop).

### Why our app needs this

Fix-My-Ride (and every student app) must survive restart. Customers do not re-enter bikes every morning. Persistence is a **base feature**, not an enhancement.

### Small Example

```text
DATABASE_URL = postgresql+psycopg://localhost:5432/fixmyride
         ↑ driver          ↑ host     ↑ port  ↑ database name
```

### Important Terms

| Term | Plain meaning |
|------|----------------|
| `DATABASE_URL` | Address + how to connect |
| Engine | SQLAlchemy’s connection manager |
| Session | One “conversation” with the DB (Day 3) |
| `psycopg` | Python driver that speaks Postgres |
| Health check | Tiny endpoint that proves “DB is reachable” |

### Trainer Script

**What to say**

> “In Week 3 our bikes lived in a Python list. That was correct for learning APIs. It is wrong for a real shop. Today we do not rewrite all CRUD yet. We only prove we can open the ledger.”

**What to show**

1. Terminal: restart uvicorn → memory data gone (if still on memory routes).
2. `.env.example` → `.env` with `DATABASE_URL`.
3. `create_engine(...)` and a `/health` that runs `SELECT 1`.

**What to ask**

- “Where should the password live — in GitHub or in `.env`?”  
  Expected: `.env`, never commit secrets.
- “Is React talking to Postgres today?”  
  Expected: No. Only backend ↔ DB.

**Common confusion**

- Students try to `import psycopg` and write raw SQL everywhere.  
  **Correction:** Today engine + health only. Models tomorrow. Raw SQL was Week 4 practice; SQLAlchemy is the course path for the app.

- Wrong database name / auth fails.  
  **Correction:** Read the error aloud. Fix URL. Do not skip to models while connection is red.

## Practical — Incremental Steps

### Starting Point

- Week 3 FastAPI project folder exists (`backend/` with `app/main.py`).
- PostgreSQL running; database created (`fixmyride` for reference).
- Students rename DB/entities per Transfer Sheet when they code their own app.

---

### Step 1 — Add dependencies

**Why:** SQLAlchemy and the Postgres driver are not in the standard library.

**File:** `backend/requirements.txt`

**Code:**

```text
fastapi==0.115.6
uvicorn[standard]==0.34.0
sqlalchemy==2.0.36
psycopg[binary]==3.2.3
pydantic==2.10.3
pydantic-settings==2.6.1
python-dotenv==1.0.1
```

**Explain:** Pin versions so the whole class installs the same stack. `psycopg[binary]` avoids compile pain on student laptops.

**Run:**

```bash
cd backend
source .venv/bin/activate   # create venv first if needed
pip install -r requirements.txt
```

**Expected:** Packages install without error.

**Check:** `python -c "import sqlalchemy, psycopg; print('ok')"`

---

### Step 2 — Environment file

**Why:** Connection details differ per machine; secrets must not live in source code.

**File:** `backend/.env` (and `.env.example` without real passwords)

**Code:**

```text
DATABASE_URL=postgresql+psycopg://localhost:5432/fixmyride
```

If Postgres needs user/password:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOURPASSWORD@localhost:5432/fixmyride
```

**Explain:** `postgresql+psycopg://` tells SQLAlchemy which driver to use. Students use their own DB name if preferred (e.g. `myshop`).

**Run:** Confirm Postgres: `psql -d fixmyride -c 'SELECT 1;'`

**Expected:** `1` returned.

**Check:** `.env` is listed in `.gitignore`.

---

### Step 3 — Database module (engine only)

**Why:** Keep connection setup in one place; routes should not hardcode URLs.

**File:** `backend/app/database.py`

**Code:**

```python
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing. Copy .env.example to .env")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
```

**Explain:** `pool_pre_ping=True` checks that a borrowed connection is still alive — helpful when laptops sleep. We intentionally do **not** create Session yet if you want a slower pace; if students are ready, you may add `SessionLocal` stub comments for Day 3.

**Run:** `python -c "from app.database import engine; print(engine.url)"` from `backend/`

**Expected:** Prints a URL (password may be hidden).

**Check:** No `RuntimeError` about missing `DATABASE_URL`.

---

### Step 4 — Health check that hits Postgres

**Why:** Prove the phone line works before building models.

**File:** `backend/app/main.py` (additions)

**Code:**

```python
from fastapi import FastAPI, HTTPException
from sqlalchemy import text
from app.database import engine

app = FastAPI(title="Fix-My-Ride API")

@app.get("/health")
def health():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ok", "database": "reachable"}
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"database unreachable: {exc}")
```

Keep existing memory routes for now so the app stays familiar.

**Explain:** `text("SELECT 1")` is the smallest possible query. If this fails, CRUD will also fail — fix connection first.

**Run:**

```bash
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/health

**Expected:** `{"status":"ok","database":"reachable"}`

**Check:** Stop Postgres briefly (trainer demo) → health returns 503. Start again → 200. Students see why health matters.

---

### Step 5 — Mental replacement board

**Why:** Students must know what will change later so they do not panic on Day 3.

**File:** none (whiteboard / notebook)

**Code:** none

**Explain / activity:** Draw:

```text
GET /bikes  →  bikes_list (RAM)     →  will become Bike model + session
POST /bikes →  bikes_list.append    →  will become session.add + commit
```

**Run:** Each student writes one sentence: “After Week 5, restarting the API will keep my _____.”

**Expected:** Named entity (bikes / courses / etc.).

**Check:** Trainer spot-checks notebooks.

## Checkpoint

1. Why is an in-memory list unsafe for a shop that reopens tomorrow?
2. What does `DATABASE_URL` contain in plain words?
3. What is an **engine**?
4. Does `/health` create bikes? Why or why not?
5. Where must passwords **not** be stored?
6. True/False: React connects directly to PostgreSQL in this course.
7. What command proves Postgres itself works before FastAPI?
8. If `/health` is 503, what do you fix first — models or connection?

## Start State / End State

| | Start | End |
|--|-------|-----|
| Data home | Python lists (primary) | Lists still used for CRUD; DB reachable |
| Config | No / incomplete `.env` | `DATABASE_URL` loaded |
| Proof | Restart wipes data | `/health` returns database reachable |
| Models | None or Week 4 SQL only | Still no SQLAlchemy models (Day 2) |

## Do Not Teach Yet

- SQLAlchemy `declarative_base` / mapped classes (Day 2)
- `Session`, `Depends(get_db)` (Day 3)
- Migrating GET/POST to DB (Day 3)
- Bookings FK, status service (Day 4)
- CORS, React fetch (Week 6)
- JWT / password hashing (Week 7)
- Alembic migrations, Docker

## Next Day Bridge

Tomorrow we translate Week 4 tables into **SQLAlchemy models**: `User` (stub), `Bike`, `Booking`. The connection you built today is what those models will use.
