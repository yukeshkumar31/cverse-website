# Day 4 — GET/POST Bikes with Pydantic (In-Memory)

## Learning Objective

By the end of this day, students expose an in-memory bikes collection through FastAPI: list bikes with `GET /bikes` and create a bike with `POST /bikes`, using Pydantic models for request validation.

## Continuity

Day 3 proved the server runs. Day 2 modeled bike dicts. Today those dicts live behind HTTP. Bookings wait until Day 5 so students master one resource end-to-end first.

---

## PART 1 — THEORY

### Trainer script

> “GET means read. POST means create. Pydantic describes the shape of the JSON we accept. If the client forgets `make`, FastAPI can reject the request before our logic runs.”

### REST-ish mapping (BASE, keep simple)

| Action | Method + path |
|--------|----------------|
| List bikes | `GET /bikes` |
| Create bike | `POST /bikes` |

Optional if time: `GET /bikes/{bike_id}` — nice but not required for the day.

### In-memory storage

```python
bikes = []  # list of dicts; lost on restart
```

Trainer line:

> “Restart clears bikes. That pain is intentional — Week 4–5 fix it with PostgreSQL.”

### Pydantic role

- `BikeCreate`: fields the client sends (no id)
- `Bike`: fields we return (includes id)

### Transfer Sheet

Rename model/route to owned item (`Book`, `/books`) if it helps the student — structure stays identical.

---

## PART 2 — PRACTICAL

Continue in `fix-my-ride-api/` (or student API folder). Keep `/health`.

---

### Step 1 — Add in-memory list + id counter

**Why:** Simple storage without a database.

**File:** `main.py`

**Code:**

```python
from fastapi import FastAPI

app = FastAPI(title="Fix-My-Ride API", version="0.2.0")

bikes = []
next_bike_id = 1


@app.get("/health")
def health():
    return {"status": "ok"}
```

**Explain:** Module-level list is shared across requests while the process runs. `next_bike_id` hands out ids.

**Run:** Restart/reload uvicorn if needed.

**Expected result:** `/health` still works; `/bikes` not yet.

**Check:** App starts without import errors.

---

### Step 2 — Pydantic models

**Why:** Declare JSON shape.

**File:** `main.py`

**Code:**

```python
from fastapi import FastAPI
from pydantic import BaseModel, Field


class BikeCreate(BaseModel):
    make: str = Field(min_length=1)
    model: str = Field(min_length=1)
    registration_number: str = Field(min_length=1)


class Bike(BikeCreate):
    id: int
```

**Explain:** `BikeCreate` is the POST body. `Bike` extends it with `id` for responses. `Field(min_length=1)` rejects empty strings.

**Run:** Save; ensure reload OK.

**Expected result:** No syntax/import errors.

**Check:** Student fields match Transfer Sheet (still 2–4 fields).

---

### Step 3 — `GET /bikes`

**Why:** Read the collection.

**File:** `main.py`

**Code:**

```python
@app.get("/bikes", response_model=list[Bike])
def list_bikes():
    return bikes
```

**Explain:** Returning the list serializes to JSON array. `response_model` documents the shape in `/docs`.

**Run:** With uvicorn up:

```bash
curl http://127.0.0.1:8000/bikes
```

**Expected result:** `[]` initially.

**Check:** Swagger GET `/bikes` also returns empty list.

---

### Step 4 — `POST /bikes`

**Why:** Create owned items.

**File:** `main.py`

**Code:**

```python
@app.post("/bikes", response_model=Bike, status_code=201)
def create_bike(payload: BikeCreate):
    global next_bike_id
    bike = {
        "id": next_bike_id,
        "make": payload.make,
        "model": payload.model,
        "registration_number": payload.registration_number,
    }
    next_bike_id += 1
    bikes.append(bike)
    return bike
```

**Explain:** FastAPI parses JSON into `BikeCreate`. We build a dict with a new id, append, return. `201` means created. `global` lets us update the counter variable.

**Run:** Via `/docs` Try it out, or:

```bash
curl -X POST http://127.0.0.1:8000/bikes \
  -H "Content-Type: application/json" \
  -d '{"make":"Honda","model":"Activa","registration_number":"TN09AB1234"}'
```

**Expected result:** JSON with `"id": 1` and the fields; then `GET /bikes` shows one item.

**Check:** Second POST gets `id: 2`.

---

### Step 5 — See validation errors

**Why:** Trust the framework for empty fields.

**File:** none (use existing POST)

**Code / commands:**

```bash
curl -X POST http://127.0.0.1:8000/bikes \
  -H "Content-Type: application/json" \
  -d '{"make":"","model":"Activa","registration_number":"TN09AB1234"}'
```

**Explain:** Pydantic should reject empty `make` with **422 Unprocessable Entity** and a detail message.

**Run:** curl or Swagger with empty make.

**Expected result:** 422 response, bike list unchanged.

**Check:** Student can read the error JSON enough to say “validation failed.”

---

### Step 6 — Optional seed on startup

**Why:** Easier demos without posting every restart.

**File:** `main.py`

**Code:**

```python
def seed_bikes():
    global next_bike_id
    if bikes:
        return
    bikes.append(
        {
            "id": 1,
            "make": "Honda",
            "model": "Activa",
            "registration_number": "TN09AB1234",
        }
    )
    bikes.append(
        {
            "id": 2,
            "make": "TVS",
            "model": "Jupiter",
            "registration_number": "TN22CD5678",
        }
    )
    next_bike_id = 3


seed_bikes()
```

**Explain:** Call once at import time. Only seeds if empty so POST-created data in the same process is not wiped by a double call — simple enough for class.

**Run:** Restart uvicorn; GET `/bikes`.

**Expected result:** Two bikes without POSTing.

**Check:** Student understands restart without seed → empty again if they skip seed.

---

### Step 7 — Optional `GET /bikes/{bike_id}`

**Why:** Path parameters practice.

**File:** `main.py`

**Code:**

```python
from fastapi import FastAPI, HTTPException

@app.get("/bikes/{bike_id}", response_model=Bike)
def get_bike(bike_id: int):
    for bike in bikes:
        if bike["id"] == bike_id:
            return bike
    raise HTTPException(status_code=404, detail="Bike not found")
```

**Explain:** `{bike_id}` in the path becomes the function argument. `HTTPException` sends a proper error status.

**Run:** `GET /bikes/1` and `GET /bikes/999`.

**Expected result:** 200 with bike; 404 for missing.

**Check:** Nice-to-have; do not block Day 5 if skipped.

---

## Student Checkpoint

- [ ] `GET /bikes` returns a JSON array
- [ ] `POST /bikes` creates a bike with an id
- [ ] Empty required field → 422
- [ ] `/health` still works
- [ ] Student can demo create + list in `/docs`
- [ ] Restart behavior explained (data loss unless seeded)

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | `/health` only |
| **Ending state** | In-memory bikes API with Pydantic validation |

---

## Do Not Teach Yet

- Bookings routes and status PATCH (Day 5)
- SQLAlchemy / PostgreSQL
- CORS for React
- Authentication
- Pagination, sorting beyond basics

---

## Next Day Bridge

Tomorrow we add **bookings CRUD-style endpoints**, enforce **bike must exist**, and **PATCH status** with Day 2 rules — completing the Week 3 milestone.
