# Day 2 — Business Rules in Python (Status + Need a Bike)

## Learning Objective

By the end of this day, students have pure Python functions that enforce Fix-My-Ride BASE rules: allowed status transitions only, and creating a booking only when the bike id exists. They can demonstrate allow/reject cases in the terminal.

## Continuity

Day 1 practiced Python syntax with bikes as dicts. Week 2 Day 1–2 had the same rules in JavaScript. Today we port the **business logic** so FastAPI can call it later instead of inventing new rules under HTTP pressure.

---

## PART 1 — THEORY

### Trainer script

> “Copy the meaning, not the JavaScript. In Python we still ask: can this status move? Does this bike exist? The API will only be a doorbell — these functions are the house rules.”

### Rules to encode (BASE)

1. **Status path:** `booked → in_progress → completed` only (or Transfer Sheet equivalents).
2. **Booking needs bike:** `bike_id` must exist in the bikes list.
3. **Required field:** `service_type` must be non-empty.
4. **New booking status:** always the first status (`booked`).

### Analogy

Staff training manual: before writing on the board, check the bike is registered and the ticket only moves one column.

### Error style today

Return `None` or raise a simple message with `print` / return a `(ok, value_or_error)` pair. HTTP status codes wait for FastAPI (Day 5). Prefer clear printed errors for beginners.

---

## PART 2 — PRACTICAL

Suggested folder:

```text
scratch/week-03-day-02/
  rules.py
```

Students rename status strings and keys (`item_id`, etc.) per Transfer Sheet.

---

### Step 1 — Seed in-memory data

**Why:** Functions need something to search.

**File:** `rules.py`

**Code:**

```python
bikes = [
    {
        "id": 1,
        "make": "Honda",
        "model": "Activa",
        "registration_number": "TN09AB1234",
    },
    {
        "id": 2,
        "make": "TVS",
        "model": "Jupiter",
        "registration_number": "TN22CD5678",
    },
]

bookings = [
    {
        "id": 1,
        "bike_id": 1,
        "service_type": "General service",
        "status": "booked",
        "notes": "Noise when starting",
    }
]
```

**Explain:** Same shape as Week 2 mock data; snake_case keys are more Pythonic (`registration_number`, `bike_id`).

**Run:** `python3 rules.py` (no output yet — OK).

**Expected result:** No error.

**Check:** Student seed matches their fields.

---

### Step 2 — `can_change_status`

**Why:** Port Week 2 Day 1 rule.

**File:** `rules.py`

**Code:**

```python
def can_change_status(from_status, to_status):
    if from_status == "booked" and to_status == "in_progress":
        return True
    if from_status == "in_progress" and to_status == "completed":
        return True
    return False


print(can_change_status("booked", "in_progress"))  # True
print(can_change_status("booked", "completed"))  # False
```

**Explain:** `True` / `False` capitalized in Python. Two allowed pairs; everything else False.

**Run:** `python3 rules.py`

**Expected result:** `True` then `False`.

**Check:** Student tests `in_progress → completed` and a backwards move.

---

### Step 3 — Find bike by id

**Why:** Shared helper for create booking and validation.

**File:** `rules.py`

**Code:**

```python
def find_bike(bike_id):
    for bike in bikes:
        if bike["id"] == bike_id:
            return bike
    return None


print(find_bike(1))
print(find_bike(99))
```

**Explain:** Loop and compare. Return the dict or `None` if missing. (`None` is like JS `null`.)

**Run:** `python3 rules.py`

**Expected result:** First print shows a dict; second prints `None`.

**Check:** Student explains what `None` means.

---

### Step 4 — `create_booking` with validation

**Why:** Core business rule for BASE.

**File:** `rules.py`

**Code:**

```python
def create_booking(bike_id, service_type, notes=""):
    bike = find_bike(bike_id)
    if bike is None:
        print("Error: bike not found")
        return None

    if service_type is None or service_type.strip() == "":
        print("Error: service_type is required")
        return None

    booking = {
        "id": len(bookings) + 1,
        "bike_id": bike_id,
        "service_type": service_type.strip(),
        "status": "booked",
        "notes": notes or "",
    }
    bookings.append(booking)
    print("Created booking", booking["id"], "for", bike["registration_number"])
    return booking


create_booking(99, "Brake check")
create_booking(1, "")
create_booking(1, "Brake check", "Front pads")
print("Bookings now:", len(bookings))
```

**Explain:** Check bike first, then required field, then append. `strip()` trims spaces so `"   "` is not accepted.

**Run:** `python3 rules.py`

**Expected result:** Two errors, one success; bookings length increases by 1 from seed.

**Check:** Student can create a booking for bike 2.

---

### Step 5 — `update_booking_status`

**Why:** Server will expose this via PATCH later.

**File:** `rules.py`

**Code:**

```python
def find_booking(booking_id):
    for booking in bookings:
        if booking["id"] == booking_id:
            return booking
    return None


def update_booking_status(booking_id, new_status):
    booking = find_booking(booking_id)
    if booking is None:
        print("Error: booking not found")
        return None

    if not can_change_status(booking["status"], new_status):
        print(
            "Error: cannot change from",
            booking["status"],
            "to",
            new_status,
        )
        return None

    booking["status"] = new_status
    print("Booking", booking_id, "→", new_status)
    return booking


# Assume booking id 1 still "booked" from seed (ids may vary if Step 4 added more)
update_booking_status(1, "completed")  # should fail if status is booked
update_booking_status(1, "in_progress")
update_booking_status(1, "completed")
```

**Explain:** Mutating `booking["status"]` changes the dict inside the list — fine for in-memory learning.

**Run:** `python3 rules.py`

**Expected result:** Reject skip; then two successful advances to `completed`.

**Check:** Student diagrams the three attempts.

---

### Step 6 — Optional map style (if time)

**Why:** Matches Week 2 optional `ALLOWED` object.

**File:** `rules.py`

**Code:**

```python
ALLOWED = {
    "booked": ["in_progress"],
    "in_progress": ["completed"],
    "completed": [],
}


def can_change_status(from_status, to_status):
    options = ALLOWED.get(from_status, [])
    return to_status in options
```

**Explain:** `.get` returns default `[]` if key missing. `in` checks list membership.

**Run:** Re-run previous tests.

**Expected result:** Same true/false behavior.

**Check:** Prefer one style and stick with it for FastAPI days.

---

## Student Checkpoint

- [ ] `can_change_status` matches their three statuses
- [ ] `create_booking` rejects unknown bike and empty service type
- [ ] `update_booking_status` rejects illegal transitions
- [ ] Student can run a short demo of fail → fail → success cases
- [ ] Keys use a consistent naming style (snake_case recommended)

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Python basics; rules only existed in JS |
| **Ending state** | Pure Python business rules + in-memory lists ready to wrap with FastAPI |

---

## Do Not Teach Yet

- FastAPI routes, HTTP status codes, Pydantic (Days 3–5)
- Databases
- Thread safety / locks for in-memory data
- pytest (optional only if advanced)

---

## Next Day Bridge

Tomorrow we create a **virtual environment**, install **FastAPI** and **uvicorn**, and ship a tiny app with `GET /health`. The rules file stays closed until Day 4–5 when we attach it to real endpoints.
