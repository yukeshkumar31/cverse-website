# Day 5 — Bookings + Status PATCH + Rules Checkpoint

## Learning Objective

By the end of this day, students expose in-memory **bookings** through FastAPI: list/create bookings, reject bookings for missing bikes, and **PATCH** status using the Week 2/Day 2 transition rules. Week 3 milestone: full in-memory API.

## Continuity

Day 4 delivered `GET/POST /bikes` with Pydantic. Day 2 wrote `can_change_status` (or equivalent) in plain Python. Today those rules guard HTTP. Data still dies on restart — that pain motivates Week 4 PostgreSQL.

**Increment target:** `course/increments/week-03/day-05-memory-api/`

---

## PART 1 — THEORY

### Trainer script

> “A booking is a job ticket that points at a bike. If the bike id is fake, we refuse. If someone tries booked → completed, we refuse. The API is the shop rules board — not the React screen.”

### Endpoints for today

| Action | Method + path |
|--------|----------------|
| List bookings | `GET /bookings` (optional `?status=`) |
| Create booking | `POST /bookings` |
| Update status | `PATCH /bookings/{id}/status` |

### Rules (BASE)

```text
1. bike_id must exist in bikes list
2. new booking status always starts as "booked"
3. Allowed transitions only:
     booked → in_progress
     in_progress → completed
```

### Analogy

POST booking = hanging a new ticket on the board under Waiting.  
PATCH status = moving the ticket one column right.  
Skipping a column = manager tears up the illegal move.

### Transfer Sheet

Rename `/bookings`, field names, and status strings to the student’s transaction — keep the three-endpoint shape.

---

## PART 2 — PRACTICAL

Continue in the Day 3–4 API project. Keep `/health` and bikes routes.

---

### Step 1 — Bookings list + id counter + ALLOWED map

**Why:** Same in-memory pattern as bikes; centralise transition map.

**File:** `main.py`

**Code:**

```python
ALLOWED = {
    "booked": ["in_progress"],
    "in_progress": ["completed"],
    "completed": [],
}

bookings = []
next_booking_id = 1
```

**Explain:** Students replace the three keys/values with Transfer Sheet labels but keep “only one forward step.”

**Run:** Save; ensure reload OK.

**Expected result:** App still serves `/bikes` and `/health`.

**Check:** Quiz: from `booked`, is `completed` allowed? No.

---

### Step 2 — Pydantic models for bookings

**Why:** Validate create and status bodies.

**File:** `main.py`

**Code:**

```python
from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    bike_id: int
    service_type: str = Field(min_length=1)
    notes: str | None = None


class Booking(BaseModel):
    id: int
    bike_id: int
    service_type: str
    status: str
    notes: str | None = None


class StatusUpdate(BaseModel):
    status: str
```

**Explain:** Clients never send `status` on create — server sets `booked`. PATCH sends only the new status.

**Run:** Save.

**Expected result:** No import errors.

**Check:** `service_type` empty string → will 422 on POST.

---

### Step 3 — `GET /bookings` (+ optional filter)

**Why:** Staff/customer will list tickets; filter previews Week 5 search.

**File:** `main.py`

**Code:**

```python
@app.get("/bookings", response_model=list[Booking])
def list_bookings(status: str | None = None):
    if status:
        return [b for b in bookings if b["status"] == status]
    return bookings
```

**Explain:** Query param `?status=booked` filters without a new route.

**Run:**

```bash
curl "http://127.0.0.1:8000/bookings"
curl "http://127.0.0.1:8000/bookings?status=booked"
```

**Expected result:** `[]` initially.

**Check:** Swagger shows optional `status` parameter.

---

### Step 4 — `POST /bookings` with bike-exists rule

**Why:** Enforce relationship: transaction requires owned item.

**File:** `main.py`

**Code:**

```python
from fastapi import FastAPI, HTTPException


@app.post("/bookings", response_model=Booking, status_code=201)
def create_booking(payload: BookingCreate):
    global next_booking_id
    if not any(b["id"] == payload.bike_id for b in bikes):
        raise HTTPException(status_code=400, detail="Bike does not exist")
    booking = {
        "id": next_booking_id,
        "bike_id": payload.bike_id,
        "service_type": payload.service_type,
        "status": "booked",
        "notes": payload.notes,
    }
    next_booking_id += 1
    bookings.append(booking)
    return booking
```

**Explain:** Scan bikes for id; 400 if missing. Always start `booked`.

**Run:** First ensure a bike exists (POST `/bikes` or seed). Then:

```bash
curl -X POST http://127.0.0.1:8000/bookings \
  -H "Content-Type: application/json" \
  -d '{"bike_id":1,"service_type":"General service","notes":"Brake noise"}'
```

**Expected result:** 201 with `"status":"booked"`.

**Check:** POST with `"bike_id":99999` → 400 and message.

---

### Step 5 — `PATCH /bookings/{booking_id}/status`

**Why:** Staff workflow; backend owns the rule.

**File:** `main.py`

**Code:**

```python
@app.patch("/bookings/{booking_id}/status", response_model=Booking)
def update_status(booking_id: int, payload: StatusUpdate):
    booking = next((b for b in bookings if b["id"] == booking_id), None)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    current = booking["status"]
    if payload.status not in ALLOWED.get(current, []):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{current}' to '{payload.status}'",
        )
    booking["status"] = payload.status
    return booking
```

**Explain:** Find booking → check allow list → mutate → return. Same logic as Day 2 function, now on the server.

**Run — illegal then legal:**

```bash
# Illegal jump
curl -X PATCH http://127.0.0.1:8000/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
# Expect 400

# Legal path
curl -X PATCH http://127.0.0.1:8000/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'

curl -X PATCH http://127.0.0.1:8000/bookings/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

**Expected result:** 400, then two 200s ending at `completed`.

**Check:** Pair demo: one student tries to cheat; other reads error detail.

---

### Step 6 — Optional seed bookings (demo speed)

**Why:** Restart still wipes data; seed makes Friday demos faster.

**File:** `main.py` (after bikes seed)

**Code:**

```python
def seed_bookings():
    global next_booking_id
    if bookings or not bikes:
        return
    bookings.append(
        {
            "id": 1,
            "bike_id": bikes[0]["id"],
            "service_type": "General service",
            "status": "booked",
            "notes": "Strange noise when braking",
        }
    )
    next_booking_id = 2


seed_bookings()
```

**Explain:** Only seed if empty and a bike exists.

**Run:** Restart uvicorn; GET `/bookings`.

**Expected result:** One booked row.

**Check:** Student can explain: seed ≠ database.

---

### Step 7 — Week 3 checkpoint script (trainer)

Walk each student through `/docs`:

1. POST bike → POST booking → illegal PATCH → legal PATCHes  
2. Ask: “Where does the rule live?” Answer: server `ALLOWED` / function — not only React  
3. Ask: “What happens on restart?” Answer: gone (unless seed)

Compare to increment folder if stuck: `course/increments/week-03/day-05-memory-api/main.py`.

---

## Student Checkpoint

- [ ] `GET /bookings` works  
- [ ] `POST /bookings` creates with `status: booked`  
- [ ] Missing bike → 400  
- [ ] Illegal status → 400 with clear detail  
- [ ] Legal path booked → in_progress → completed works  
- [ ] Optional `?status=` filter works  
- [ ] Student can explain in-memory vs database  

**Questions:**

1. Why start every new booking as `booked`?  
2. Why 400 for missing bike instead of silently creating?  
3. Who should own status rules — React or API — and why?  
4. What will Week 4 change about data loss on restart?

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | In-memory bikes API |
| **Ending state** | In-memory bikes + bookings + status rules; Week 3 milestone |

---

## Do Not Teach Yet

- PostgreSQL / SQLAlchemy (Weeks 4–5)  
- CORS deep dive for React (Week 6 — optional allow `*` only if needed for early experiments)  
- JWT / roles (Week 7)  
- Soft deletes, pagination, file uploads  

---

## Next Day Bridge

> “Next week we stop trusting RAM. We design **PostgreSQL tables** for users, bikes, and bookings — primary keys, foreign keys, and a JOIN so a booking can show a registration number. Your API shapes stay; storage becomes real.”
