# Day 3 — Session, create_all, Bikes on PostgreSQL

## Learning Objective

Students create a DB session dependency, ensure tables exist with `create_all`, and migrate **GET /bikes** and **POST /bikes** from in-memory lists to SQLAlchemy queries so bike data survives restart.

## Continuity

| From | Carry forward |
|------|----------------|
| Day 1–2 | Engine, Base, models |
| Week 3 | Pydantic schemas + bike routes in memory |
| Today | Same HTTP shapes; new persistence |

**Opener:** “Same doors (URLs). New warehouse behind the doors.”

## Theory + Trainer Script

### Concept

A **session** is a short-lived workspace: you query or add objects, then **commit** to save, or **rollback** on error. FastAPI gives each request its own session via `Depends(get_db)`.

### Simple Explanation

```text
Request comes in
  → open session
  → read/write rows
  → commit (if write)
  → close session
  → send JSON response
```

### Analogy

Session = borrowing the ledger for one customer visit.  
Commit = putting the pen down and closing the page so the next worker sees your write.  
Forget commit = you wrote in pencil on a scrap and threw it away.

### Why our app needs this

Without sessions and commits, models are only decorations. Persistence requires add + commit + query.

### Small Example

```python
bike = Bike(owner_id=1, make="Honda", model="Activa", registration_number="TN09AB1234")
db.add(bike)
db.commit()
db.refresh(bike)
```

### Important Terms

| Term | Meaning |
|------|---------|
| `SessionLocal` | Factory that makes sessions |
| `get_db` | FastAPI dependency that yields a session |
| `create_all` | Create tables from models if missing |
| `db.query` / `select` | Read rows |
| `commit` | Save changes |
| `refresh` | Reload object (e.g. get new `id`) |

### Trainer Script

**What to say**

> “We migrate bikes only today. Bookings still memory or wait until tomorrow. One entity end-to-end beats two half-broken ones.”

**What to show**

1. POST bike → restart uvicorn → GET bike still there.  
2. Student applause moment — this is the Week 5 “click.”

**Common confusion**

- Forgot `commit` → POST returns 200 but GET empty.  
  **Correction:** Always commit after writes; show the bug live.

- Used memory list and DB together → confusing duplicates.  
  **Correction:** Delete or comment out the list for bikes once DB works.

## Practical — Incremental Steps

### Starting Point

Models importable; Postgres up; optional: one seed user in `users` so `owner_id=1` works.

**Seed user (psql) if needed:**

```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('temp@demo.com', 'not-hashed-yet', 'Temp Owner', 'customer')
ON CONFLICT (email) DO NOTHING;
```

(If tables do not exist yet, Step 2 creates them; then re-run seed.)

---

### Step 1 — SessionLocal + get_db

**Why:** Routes need a clean way to get a session per request.

**File:** `backend/app/database.py`

**Code:**

```python
from sqlalchemy.orm import sessionmaker, Session

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

**Explain:** `yield` lets FastAPI close the session after the response — even if an error occurs.

**Run:** Import `get_db`.

**Expected:** No errors.

**Check:** Students can say when the session closes (after the request).

---

### Step 2 — create_all on startup

**Why:** Student laptops may not have run `schema.sql`; models can create tables for BASE.

**File:** `backend/app/main.py`

**Code:**

```python
from app.database import Base, engine, get_db
from app import models  # important: register models with Base.metadata

Base.metadata.create_all(bind=engine)
```

**Explain:** `create_all` does not upgrade columns if you change models later — fine for course; mention Alembic only as “later tool,” do not teach it.

**Run:** Start uvicorn; then `\dt` in `psql -d fixmyride`.

**Expected:** Tables `users`, `bikes`, `bookings` listed.

**Check:** `/health` still ok.

---

### Step 3 — Pydantic schemas for bikes

**Why:** Keep API JSON clear and validated.

**File:** `backend/app/schemas.py`

**Code:**

```python
from pydantic import BaseModel

class BikeCreate(BaseModel):
    make: str
    model: str
    registration_number: str
    owner_id: int = 1  # temporary until Week 7 auth

class BikeOut(BaseModel):
    id: int
    owner_id: int
    make: str
    model: str
    registration_number: str

    model_config = {"from_attributes": True}
```

**Explain:** `from_attributes` lets FastAPI build `BikeOut` from SQLAlchemy objects. `owner_id` default is a teaching crutch — remove when JWT arrives.

**Run:** Import schemas.

**Expected:** OK.

**Check:** Student renames fields to Transfer Sheet if needed (`title` instead of `make`, etc.).

---

### Step 4 — GET /bikes from DB

**Why:** List must read persisted rows.

**File:** `backend/app/routers/bikes.py` (or routes in `main.py` for small apps)

**Code:**

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Bike
from app.schemas import BikeOut

router = APIRouter(prefix="/bikes", tags=["bikes"])

@router.get("", response_model=list[BikeOut])
def list_bikes(db: Session = Depends(get_db)):
    return db.query(Bike).order_by(Bike.id).all()
```

Include router in `main.py`: `app.include_router(bikes.router)`.

**Explain:** `db.query(Bike).all()` becomes `SELECT * FROM bikes`. Prefer SQLAlchemy 2 `select()` style if you standardized on it:

```python
from sqlalchemy import select
db.scalars(select(Bike).order_by(Bike.id)).all()
```

**Run:** GET http://localhost:8000/bikes

**Expected:** `[]` or existing rows — not memory leftovers.

**Check:** Comment out old memory GET if still present.

---

### Step 5 — POST /bikes to DB

**Why:** Create must persist.

**File:** `backend/app/routers/bikes.py`

**Code:**

```python
from fastapi import status
from app.schemas import BikeCreate

@router.post("", response_model=BikeOut, status_code=status.HTTP_201_CREATED)
def create_bike(payload: BikeCreate, db: Session = Depends(get_db)):
    bike = Bike(
        owner_id=payload.owner_id,
        make=payload.make,
        model=payload.model,
        registration_number=payload.registration_number,
    )
    db.add(bike)
    db.commit()
    db.refresh(bike)
    return bike
```

**Explain:** Order matters: add → commit → refresh → return.

**Run:**

```bash
curl -X POST http://localhost:8000/bikes \
  -H "Content-Type: application/json" \
  -d '{"make":"Honda","model":"Activa","registration_number":"TN09AB1234","owner_id":1}'
```

Then restart uvicorn and GET `/bikes`.

**Expected:** Bike still present after restart.

**Check:** Trainer walks the room: every student demonstrates restart persistence once.

---

### Step 6 — Remove memory bike list (cleanup)

**Why:** Two sources of truth confuse debugging in Week 6.

**File:** `main.py` / old memory module

**Code:** Delete `bikes: list[dict] = []` and memory handlers for bikes.

**Explain:** Bookings may still be memory until Day 4 — that is OK if clearly labeled `# TODO Day 4`.

**Run:** Full GET/POST bikes smoke test again.

**Expected:** Behavior unchanged; code simpler.

**Check:** No references to `bikes.append`.

## Checkpoint

1. What does `commit` do?
2. Why does `get_db` use `yield`?
3. What does `create_all` create? What does it not migrate?
4. Why `refresh` after commit?
5. Demo: restart test — pass/fail?
6. Why is `owner_id=1` temporary?
7. Where did the Python list for bikes go, and why?
8. Student Transfer Sheet: which route paths did you rename?

## Start State / End State

| | Start | End |
|--|-------|-----|
| Bikes | Memory list | PostgreSQL via SQLAlchemy |
| Bookings | Memory or incomplete | Still not DB (or unchanged) |
| Session | None | `get_db` working |
| Restart | Wipes bikes | Bikes survive |

## Do Not Teach Yet

- Booking DB + status service (Day 4)
- Search query params (Day 5)
- Auth-owned bikes only (Week 7)
- React forms posting to API (Week 6)
- Unique violation polish (touch lightly Day 5)

## Next Day Bridge

Tomorrow bookings move to the database with **foreign keys**, and status updates go through a **service layer** that rejects illegal jumps like `booked → completed`.
