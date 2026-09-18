# Day 5 — Search, Errors, Week 5 Checkpoint

## Learning Objective

Students add **search/filter** query parameters on bookings (status and optional registration search), return clear HTTP errors, smoke-test persistence across restart, and freeze the Week 5 DB-backed API checkpoint.

## Continuity

Day 4 put bookings + FK + status service on PostgreSQL. Today polishes the BASE “search/filter” feature and hardens error messages so Week 6 React can display them.

**Increment:** `course/increments/week-05/day-05-db-api/`

---

## Theory + Trainer Script

### Trainer script

> “Staff do not want every booking forever on one screen. Filter by status. Optionally search by registration. Query parameters are how GET asks for a subset — `GET /bookings?status=booked`.”

### Mental model

```text
GET /bookings?status=in_progress&q=TN09
  → FastAPI reads query params
  → SQLAlchemy builds filtered SELECT
  → JSON list back to client
```

### Error clarity

| Situation | Status | Detail idea |
|-----------|--------|-------------|
| Bike missing on create | 404 or 400 | “Bike not found” |
| Illegal status jump | 400 | “Cannot change status from … to …” |
| Booking id missing | 404 | “Booking not found” |
| Empty service_type | 422 / 400 | Validation message |

Trainer line:

> “A clear error is a feature. Silent wrong success is a bug.”

### Analogy

Query params = telling the clerk “only show Waiting tickets for plates containing TN09.”

---

## Practical — Incremental Steps

Starting point: Day 4 routes + `booking_service` (or equivalent `rules.py`).

---

### Step 1 — Add query params to list bookings

**Why:** BASE search/filter capability.

**File:** `backend/app/routers_bookings.py` (or `routers/bookings.py`)

**Code:**

```python
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Bike, Booking
from app.schemas import BookingOut

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("", response_model=list[BookingOut])
def list_bookings(
    status_filter: str | None = Query(default=None, alias="status"),
    q: str | None = Query(default=None, description="Search registration number"),
    db: Session = Depends(get_db),
):
    query = db.query(Booking)
    if status_filter:
        query = query.filter(Booking.status == status_filter)
    if q:
        query = query.join(Bike).filter(Bike.registration_number.ilike(f"%{q}%"))
    return query.order_by(Booking.id.desc()).all()
```

**Explain:** `alias="status"` keeps the URL friendly (`?status=`) while avoiding clash with the `status` module name. `ilike` = case-insensitive partial match (Postgres).

**Run:**

```bash
curl "http://localhost:8000/bookings?status=booked"
curl "http://localhost:8000/bookings?q=TN"
```

**Expected:** Filtered JSON arrays.

**Check:** No filter → all bookings (or reasonable default).

---

### Step 2 — Include registration on output (optional join field)

**Why:** UI will show plate without a second request.

**File:** `schemas.py` + router helper

**Code:**

```python
class BookingOut(BaseModel):
    id: int
    customer_id: int
    bike_id: int
    service_type: str
    status: str
    notes: str | None
    bike_registration: str | None = None

    model_config = {"from_attributes": True}
```

```python
from sqlalchemy.orm import joinedload

def to_out(booking: Booking) -> BookingOut:
    return BookingOut(
        id=booking.id,
        customer_id=booking.customer_id,
        bike_id=booking.bike_id,
        service_type=booking.service_type,
        status=booking.status,
        notes=booking.notes,
        bike_registration=booking.bike.registration_number if booking.bike else None,
    )

@router.get("", response_model=list[BookingOut])
def list_bookings(...):
    query = db.query(Booking).options(joinedload(Booking.bike))
    # ... filters ...
    return [to_out(b) for b in query.order_by(Booking.id.desc()).all()]
```

Ensure model relationship: `Booking.bike = relationship("Bike")`.

**Explain:** This is the ORM cousin of Week 4 SQL JOIN.

**Run:** GET `/bookings` and look for `bike_registration`.

**Expected:** Field present.

**Check:** Skip if behind — status filter alone satisfies BASE search.

---

### Step 3 — Tidy create/patch error paths

**Why:** React Week 6 will `catch` and show `detail`.

**File:** service / router

**Code:** Confirm messages like:

```python
raise HTTPException(status_code=404, detail=f"Bike {bike_id} not found")
raise HTTPException(
    status_code=400,
    detail=f"Cannot change status from '{booking.status}' to '{new_status}'",
)
```

**Explain:** Prefer string `detail` for simple frontends.

**Run:** Replay illegal PATCH; read JSON.

**Expected:** Predictable `{"detail":"..."}`.

**Check:** Student can find message in `/docs` response.

---

### Step 4 — Restart persistence drill

**Why:** Week 5 milestone proof.

**File:** none

**Code / commands:**

1. POST a new bike with unique registration  
2. POST a booking  
3. Stop uvicorn  
4. Start uvicorn  
5. GET `/bikes` and `/bookings`  

**Explain:** If data vanished, they are still on memory lists — hunt leftovers.

**Run:** Full drill per student.

**Expected:** Rows survive.

**Check:** Trainer initials checkpoint sheet.

---

### Step 5 — Compare to increment (stuck students)

**Why:** Reset point.

**File:** `course/increments/week-05/day-05-db-api/`

**Code:** Open README; run that backend against their DB.

**Explain:** Increment is the known-good shape — rename to Transfer Sheet after it runs.

**Run:** Health + bikes + bookings smoke.

**Expected:** Green path.

**Check:** Do not copy auth complexity if increment includes early stubs — Week 7 owns JWT.

---

### Step 6 — Week 5 oral checklist

1. Point to: route → service/rules → model → table  
2. Show `DATABASE_URL` in `.env` (no commit of secrets)  
3. Demo filter `?status=`  
4. Demo illegal status → 400  
5. Demo restart persistence  

---

## Checkpoint

- [ ] `GET /bookings?status=…` filters  
- [ ] Optional `q=` registration search works or explicitly deferred with trainer note  
- [ ] Error `detail` strings are human-readable  
- [ ] Restart does not wipe data  
- [ ] Create booking still requires real bike  
- [ ] Status service still rejects illegal jumps  

**Questions:**

1. What is a query parameter?  
2. Why filter on the server, not only in React?  
3. What does `ilike` buy you?  
4. Where should `DATABASE_URL` never go?

---

## Start State / End State

| | Start | End |
|--|-------|-----|
| Bookings API | CRUD + status | + search/filter |
| Errors | Basic | Clear details |
| Milestone | Almost | Week 5 complete |
| React | Mock / separate | Ready to wire (Week 6) |

---

## Do Not Teach Yet

- CORS + React fetch (Week 6 Day 1)  
- JWT Bearer tokens (Week 7)  
- Role-scoped lists (Week 7)  
- Alembic migrations  

---

## Next Day Bridge

> “Next week we open **two terminals**: Vite and Uvicorn. React will `fetch` these endpoints. First battle: CORS. First victory: bike list from PostgreSQL on screen — not a mock array.”
