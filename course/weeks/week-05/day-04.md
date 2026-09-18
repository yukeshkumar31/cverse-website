# Day 4 — Bookings, Foreign Keys, Status Rules in Service Layer

## Learning Objective

Students persist bookings with foreign keys to bikes (and users), create bookings only when the bike exists, and update status through a service function that allows only `booked → in_progress → completed`.

## Continuity

| From | Carry forward |
|------|----------------|
| Day 3 | Bikes on DB; `get_db` |
| Week 2–3 | Status transition idea in JS/Python memory |
| Today | Same rules, enforced on DB-backed bookings |

**Opener:** “A booking without a bike is a lie. The database can help — our service must speak clearly when someone tries.”

## Theory + Trainer Script

### Concept

**Foreign key** = this row points at a real row elsewhere.  
**Service layer** = plain Python functions that hold business rules so routers stay thin.

### Simple Explanation

Router: receive JSON, call service, return result.  
Service: check bike exists, set status, validate transitions, raise clear errors.  
Model: shape of the row.

### Analogy

Router = front desk.  
Service = workshop rules board (“only move one step”).  
Database = parts inventory (cannot assign a part ID that is not on the shelf).

### Why our app needs this

BASE features: relationship + status workflow + backend business rule. If status rules live only in React, a crafty client can cheat. Backend is the boss.

### Small Example

```python
ALLOWED = {
    "booked": ["in_progress"],
    "in_progress": ["completed"],
    "completed": [],
}
```

### Important Terms

| Term | Meaning |
|------|---------|
| FK | Foreign key |
| 404 | Bike or booking not found |
| 400 | Bad request — rule violated |
| PATCH | Partial update (status) |
| Service function | Rule logic outside the route |

### Trainer Script

**What to say**

> “We will try an illegal jump on purpose and celebrate the error. Errors are part of the product.”

**What to show**

1. Create booking with bad `bike_id` → error.  
2. `booked → completed` → 400 with message.  
3. `booked → in_progress → completed` → success.

**Common confusion**

- Updating status by assigning any string in the router.  
  **Correction:** Always call `transition_status(booking, new_status)`.

- Cascading deletes confusion.  
  **Correction:** Keep BASE simple; do not deep-dive ON DELETE today.

## Practical — Incremental Steps

### Starting Point

Bikes CRUD on DB; at least one bike row; models include `Booking`.

---

### Step 1 — Booking schemas

**Why:** Clear request/response contracts.

**File:** `backend/app/schemas.py`

**Code:**

```python
class BookingCreate(BaseModel):
    bike_id: int
    service_type: str
    notes: str | None = None
    customer_id: int = 1  # temporary until Week 7

class BookingOut(BaseModel):
    id: int
    customer_id: int
    bike_id: int
    service_type: str
    status: str
    notes: str | None

    model_config = {"from_attributes": True}

class BookingStatusUpdate(BaseModel):
    status: str
```

**Explain:** Clients send `status` on PATCH only; create always starts as `booked`.

**Run:** Import schemas.

**Expected:** OK.

**Check:** `service_type` required — empty string should fail validation (add `min_length=1` if you want).

---

### Step 2 — Status service

**Why:** One place for the workflow rule; reusable by PATCH and tests later.

**File:** `backend/app/services/booking_service.py`

**Code:**

```python
from fastapi import HTTPException

ALLOWED_TRANSITIONS = {
    "booked": {"in_progress"},
    "in_progress": {"completed"},
    "completed": set(),
}

def ensure_bike_exists(db, bike_id: int):
    from app.models import Bike
    bike = db.get(Bike, bike_id)
    if not bike:
        raise HTTPException(status_code=404, detail=f"Bike {bike_id} not found")
    return bike

def create_booking(db, *, customer_id: int, bike_id: int, service_type: str, notes: str | None):
    from app.models import Booking
    ensure_bike_exists(db, bike_id)
    if not service_type.strip():
        raise HTTPException(status_code=400, detail="service_type is required")
    booking = Booking(
        customer_id=customer_id,
        bike_id=bike_id,
        service_type=service_type.strip(),
        status="booked",
        notes=notes,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def transition_status(db, booking_id: int, new_status: str):
    from app.models import Booking
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    allowed = ALLOWED_TRANSITIONS.get(booking.status, set())
    if new_status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{booking.status}' to '{new_status}'",
        )
    booking.status = new_status
    db.commit()
    db.refresh(booking)
    return booking
```

**Explain:** Read this aloud. Students should rewrite the same map using **their** three status words from the Transfer Sheet.

**Run:** Import module.

**Expected:** OK.

**Check:** Quiz: from `in_progress`, can I go to `booked`? No.

---

### Step 3 — Booking routes

**Why:** Expose list/create/update over HTTP.

**File:** `backend/app/routers/bookings.py`

**Code:**

```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Booking
from app.schemas import BookingCreate, BookingOut, BookingStatusUpdate
from app.services import booking_service

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.get("", response_model=list[BookingOut])
def list_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).order_by(Booking.id.desc()).all()

@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    return booking_service.create_booking(
        db,
        customer_id=payload.customer_id,
        bike_id=payload.bike_id,
        service_type=payload.service_type,
        notes=payload.notes,
    )

@router.patch("/{booking_id}/status", response_model=BookingOut)
def update_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
):
    return booking_service.transition_status(db, booking_id, payload.status)
```

Register router in `main.py`.

**Explain:** PATCH path makes the intent obvious. Students mirror path names for their transaction entity.

**Run:** Create bike if needed; then:

```bash
curl -X POST http://localhost:8000/bookings \
  -H "Content-Type: application/json" \
  -d '{"bike_id":1,"service_type":"General service","notes":"Brakes noisy"}'
```

**Expected:** JSON with `"status":"booked"`.

**Check:** Restart; GET `/bookings` still shows it.

---

### Step 4 — Prove FK + illegal transition

**Why:** Rules must be visible, not theoretical.

**File:** none (curl / Swagger http://localhost:8000/docs)

**Code:** (commands)

```bash
# Bad bike
curl -X POST http://localhost:8000/bookings \
  -H "Content-Type: application/json" \
  -d '{"bike_id":99999,"service_type":"Oil change"}'
# Expect 404

# Illegal jump
curl -X PATCH http://localhost:8000/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
# Expect 400

# Legal path
curl -X PATCH http://localhost:8000/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
curl -X PATCH http://localhost:8000/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

**Explain:** Staff workflow is the happy path; cheating is blocked.

**Run:** As above.

**Expected:** 404, then 400, then two 200s.

**Check:** Pair students: one tries to break rules; other watches responses.

---

### Step 5 — Remove memory bookings

**Why:** Single source of truth before Week 6.

**File:** old memory booking code

**Code:** Delete list-based booking handlers.

**Explain:** Leave a short comment: `# Bookings now in PostgreSQL via booking_service`.

**Run:** Smoke test list/create/patch.

**Expected:** All DB-backed.

**Check:** No `bookings_memory` references.

## Checkpoint

1. Why must create-booking check that the bike exists?
2. Draw the only allowed status arrows.
3. Why put rules in `booking_service` instead of only in React?
4. What status code for not found vs illegal transition?
5. What is temporary about `customer_id=1`?
6. After restart, do bookings remain?
7. Rename the service function mentally to your Transfer Sheet transaction.
8. Can `completed` move to anything in BASE?

## Start State / End State

| | Start | End |
|--|-------|-----|
| Bookings | Memory or missing | PostgreSQL + FK |
| Status updates | Maybe free-form | Service-enforced path |
| Business rule | Weak / UI-only | Backend 400 on illegal jump |
| Bikes | DB | DB (unchanged) |

## Do Not Teach Yet

- Role-based “only staff can PATCH” (Week 7)
- Search/filter query params (Day 5)
- React status buttons (Week 6)
- Soft deletes, audit logs, notifications

## Next Day Bridge

Tomorrow we add **search/filter** with query parameters, tidy error handling, and freeze a Week 5 checkpoint API ready for React integration.
