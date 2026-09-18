# Day 2 — SQLAlchemy Models (User, Bike, Booking)

## Learning Objective

Students map PostgreSQL tables to SQLAlchemy model classes for `User` (optional stub for Week 7), `Bike`, and `Booking`, including foreign keys and status fields — without wiring sessions or replacing endpoints yet.

## Continuity

| From | Carry forward |
|------|----------------|
| Day 1 | Working `engine` + `/health` |
| Week 4 | `schema.sql` knowledge of columns and FKs |
| Today | Python classes that describe the same tables |

**Trainer opener:** Show `db/schema.sql` and say “Yesterday we opened the cupboard. Today we label the shelves in Python.”

## Theory + Trainer Script

### Concept

A **model** is a Python class that represents one database table. SQLAlchemy uses it to generate SQL for you. You think in objects; Postgres still stores rows.

### Simple Explanation

```text
class Bike  ↔  table bikes
bike.make   ↔  column make
```

Foreign keys become attributes that point to related rows (we keep FKs simple: store `owner_id` / `bike_id` integers first; relationship() helpers are optional if time allows).

### Analogy

Model = blank form template.  
Row = one filled form.  
Table = the filing cabinet drawer of all forms of that type.

### Why our app needs this

Without models, every route would paste raw SQL strings. Models keep Fix-My-Ride (and student apps) readable and consistent with the BASE schema.

### Small Example

```python
class Bike(Base):
    __tablename__ = "bikes"
    id = Column(Integer, primary_key=True)
    make = Column(String(80), nullable=False)
```

### Important Terms

| Term | Meaning |
|------|---------|
| `Base` | Parent class for all models |
| `__tablename__` | Exact table name in Postgres |
| `Column` | Field definition |
| `ForeignKey` | Link to another table’s primary key |
| `nullable=False` | Required field |
| Stub User | Model exists so Week 7 auth has a home; limited use this week |

### Trainer Script

**What to say**

> “We will create three models. User is a stub — we need the table shape, but login comes in Week 7. Bike and Booking are today’s stars.”

**What to show**

Side-by-side: `schema.sql` CREATE TABLE vs model class.

**What to ask**

- “If Booking has `bike_id`, can we create a booking for a bike that does not exist?”  
  Expected: Database / FK should prevent it (we enforce clearly on Day 4).

**Common confusion**

- Students invent different column names than Week 4 schema.  
  **Correction:** Match schema. Drift breaks `create_all` and seed scripts.

- Putting business rules inside the model class.  
  **Correction:** Models describe data. Status transition rules live in a service (Day 4).

## Practical — Incremental Steps

### Starting Point

Day 1 complete: `app/database.py` with `engine`. Schema from Week 4 available.

---

### Step 1 — Extend database.py with Base

**Why:** All models must share one declarative base tied to this project’s metadata.

**File:** `backend/app/database.py`

**Code:**

```python
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing. Copy .env.example to .env")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

class Base(DeclarativeBase):
    pass
```

**Explain:** SQLAlchemy 2 style uses `DeclarativeBase`. Older tutorials use `declarative_base()` — either works if the whole class is consistent; pick one for the cohort.

**Run:** Import check: `python -c "from app.database import Base; print(Base)"`

**Expected:** Prints the Base class.

**Check:** `/health` still works after the change.

---

### Step 2 — User model (stub)

**Why:** Bookings and bikes will eventually belong to users; Week 7 needs this table. This week we may use a fixed `owner_id` / skip user CRUD.

**File:** `backend/app/models.py`

**Code:**

```python
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False)  # customer | staff
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
```

**Explain:** Store `password_hash`, never a plain password column name that tempts students to save raw passwords. Hashing is Week 7 — today the column is just a string placeholder if they insert seed rows manually.

**Run:** `python -c "from app.models import User; print(User.__tablename__)"`

**Expected:** `users`

**Check:** Students list Transfer Sheet: do they need the same four fields? Yes for BASE.

---

### Step 3 — Bike model

**Why:** Owned item is the first real entity students already know from the UI.

**File:** `backend/app/models.py` (append)

**Code:**

```python
from sqlalchemy import ForeignKey, String, DateTime, func, Integer
from sqlalchemy.orm import Mapped, mapped_column
# User already imported Base above

class Bike(Base):
    __tablename__ = "bikes"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    make: Mapped[str] = mapped_column(String(80), nullable=False)
    model: Mapped[str] = mapped_column(String(80), nullable=False)
    registration_number: Mapped[str] = mapped_column(String(40), unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
```

**Explain:** `owner_id` is the relationship to User. Until auth exists, Day 3 may use a seed user id `1` or temporarily relax this — prefer creating one seed user in SQL so FK stays honest.

**Run:** Import `Bike`.

**Expected:** No import errors.

**Check:** Compare columns to Transfer Sheet “owned item” fields; rename labels in student apps (`course_code` instead of `registration_number`, etc.) but keep types simple.

---

### Step 4 — Booking model

**Why:** Transaction entity with status workflow field.

**File:** `backend/app/models.py` (append)

**Code:**

```python
class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    bike_id: Mapped[int] = mapped_column(ForeignKey("bikes.id"), nullable=False)
    service_type: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="booked")
    notes: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
```

**Explain:** Allowed statuses are `booked`, `in_progress`, `completed`. Database CHECK helps; **service-layer rules** on Day 4 still required so API returns friendly errors.

**Run:** `python -c "from app.models import User, Bike, Booking; print('models ok')"`

**Expected:** `models ok`

**Check:** Student can draw: User 1—N Bike; User 1—N Booking; Bike 1—N Booking.

---

### Step 5 — Import models in app package

**Why:** `create_all` tomorrow only creates tables for models that were imported.

**File:** `backend/app/models.py` already complete; add `backend/app/__init__.py` note or import in a future `main.py`.

**Code:** (comment in `main.py` for tomorrow)

```python
# Day 3 will do:
# from app import models  # noqa: F401
# from app.database import Base, engine
# Base.metadata.create_all(bind=engine)
```

**Explain:** Preview only — do not require create_all today unless the class is ahead.

**Run:** Restart uvicorn; existing memory routes still work.

**Expected:** App starts; models importable.

**Check:** No circular import errors (`database` ← `models` ← not back into `database`).

## Checkpoint

1. What is a SQLAlchemy model in one sentence?
2. Why does `Bike` need `owner_id`?
3. Why is User a “stub” this week?
4. Name the three booking statuses for Fix-My-Ride BASE.
5. Where should “cannot jump booked → completed” live — model or service? Why?
6. What happens if `__tablename__` does not match the real table name?
7. True/False: Creating model classes inserts rows automatically.
8. Map your Transfer Sheet owned-item fields to column names you will use.

## Start State / End State

| | Start | End |
|--|-------|-----|
| Models | None | `User`, `Bike`, `Booking` classes |
| Tables | Maybe from Week 4 SQL | Models ready; create_all optional/tomorrow |
| API CRUD | Still memory | Still memory |
| Health | Works | Still works |

## Do Not Teach Yet

- `SessionLocal`, `get_db`, migrating routes (Day 3)
- Status transition service (Day 4)
- Query-parameter search (Day 5)
- Alembic, relationship() deep dive, cascades beyond what schema has
- Auth register/login

## Next Day Bridge

Tomorrow we open a **session**, call `create_all`, and move **GET/POST bikes** from the Python list into PostgreSQL. Restart will finally keep bike rows.
