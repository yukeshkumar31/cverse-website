# Day 1 — Python Basics (Variables, Conditions, Functions, Lists, Dicts)

## Learning Objective

By the end of this day, students can write and run small Python programs using variables, `if` conditions, functions, lists, and dictionaries — enough to mirror last week’s JavaScript thinking in Python syntax.

## Continuity

Week 2 built status rules and mock bikes/bookings in JavaScript. Today we learn Python’s “same ideas, different spelling.” No FastAPI yet. Bring Transfer Sheet status labels and entity names.

---

## PART 1 — THEORY

### Trainer script

> “Python will power our API. Before FastAPI, we need to be comfortable writing plain Python the same way we wrote plain JavaScript on Week 2 Day 1. If you know the idea in JS, you can learn the Python words.”

### JS → Python cheat sheet (teach live)

| Idea | JavaScript | Python |
|------|------------|--------|
| Variable | `let x = 1` | `x = 1` |
| String | `"booked"` | `"booked"` |
| Print | `console.log(x)` | `print(x)` |
| Equal | `===` | `==` (we use `==` for beginners here) |
| Function | `function f(a) { return a }` | `def f(a): return a` |
| List / array | `[1, 2]` | `[1, 2]` |
| Object / dict | `{ id: 1 }` | `{"id": 1}` |
| True / False | `true` / `false` | `True` / `False` |
| Block | `{ }` braces | indentation |

### Analogy

Same recipe (status rule), different kitchen language. The meal is still “only move one column forward.”

### Fix-My-Ride tie-in

We will print a bike dict and a short list — same fields as Week 2 mock data.

---

## PART 2 — PRACTICAL

Suggested folder:

```text
scratch/week-03-day-01/
  basics.py
  bike_list.py
```

Check Python:

```bash
python3 --version
```

---

### Step 1 — Variables and print

**Why:** Confirm the toolchain and print habit.

**File:** `basics.py`

**Code:**

```python
status = "booked"
shop_name = "Fix-My-Ride"
print(shop_name)
print("Current status:", status)
```

**Explain:** No `let`/`const`. Strings use quotes. `print` shows output. Students may set `shop_name` to their app name.

**Run:**

```bash
python3 basics.py
```

**Expected result:**

```text
Fix-My-Ride
Current status: booked
```

**Check:** File runs with no traceback.

---

### Step 2 — Conditions

**Why:** Same branching as JS `if`.

**File:** `basics.py` (append)

**Code:**

```python
from_status = "booked"
to_status = "in_progress"

if from_status == "booked" and to_status == "in_progress":
    print("Allowed")
else:
    print("Not allowed")
```

**Explain:** Colon `:` starts a block. The next lines must be indented (4 spaces). `and` is like JS `&&`.

**Run:** `python3 basics.py`

**Expected result:** `Allowed`. Change `to_status` to `"completed"` → `Not allowed`.

**Check:** Student predicts output before running.

---

### Step 3 — Functions with return

**Why:** Prepare for reusable business rules on Day 2.

**File:** `basics.py`

**Code:**

```python
def greet(name):
    return "Hello, " + name

message = greet("Hari")
print(message)


def add(a, b):
    return a + b

print(add(2, 3))
```

**Explain:** `def` defines a function. Indent the body. `return` sends a value back. Call with `greet("Hari")`.

**Run:** `python3 basics.py`

**Expected result:** Greeting line and `5`.

**Check:** Student writes a function `is_booked(status)` that returns `True` when status is `"booked"`.

---

### Step 4 — Lists

**Why:** In-memory bikes will be a Python list (like a JS array).

**File:** `bike_list.py`

**Code:**

```python
registration_numbers = ["TN09AB1234", "TN22CD5678"]
print(len(registration_numbers))
print(registration_numbers[0])

registration_numbers.append("TN01ZZ9999")
print(registration_numbers)
```

**Explain:** `len` is length. Index `0` is first. `append` adds to the end (like `push`).

**Run:** `python3 bike_list.py`

**Expected result:** `2`, first reg number, then list of three.

**Check:** Student can print the last item.

---

### Step 5 — Dictionaries (objects)

**Why:** One bike / one booking is a dict.

**File:** `bike_list.py` (append)

**Code:**

```python
bike = {
    "id": 1,
    "make": "Honda",
    "model": "Activa",
    "registration_number": "TN09AB1234",
}

print(bike["make"])
print(bike["registration_number"])

bikes = [
    bike,
    {
        "id": 2,
        "make": "TVS",
        "model": "Jupiter",
        "registration_number": "TN22CD5678",
    },
]

print("Total bikes:", len(bikes))
print("Second model:", bikes[1]["model"])
```

**Explain:** Dict keys are strings in quotes. Read with `bike["make"]` — like `bike.make` in JS, different spelling. A list of dicts is our in-memory table.

**Run:** `python3 bike_list.py`

**Expected result:** Honda, registration, total 2, Jupiter.

**Check:** Student builds one `booking` dict with `bike_id`, `service_type`, `status`.

---

### Step 6 — Loop over bikes (preview)

**Why:** APIs will return lists; loops help debug.

**File:** `bike_list.py`

**Code:**

```python
for b in bikes:
    print(b["id"], b["registration_number"])
```

**Explain:** `for b in bikes:` visits each dict. Indent the `print`.

**Run:** `python3 bike_list.py`

**Expected result:** Two lines of id + registration.

**Check:** Student loops and prints only `make`.

---

## Student Checkpoint

- [ ] Can run `python3` on a `.py` file
- [ ] Can write `if` / `else` with correct indentation
- [ ] Can define and call a function with `return`
- [ ] Can create a list and a dict
- [ ] Can explain “list of dicts ≈ rows of bikes”

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Week 2 React mock UI exists; little or no Python |
| **Ending state** | Comfortable with Python basics; sample bike list/dict scripts run |

---

## Do Not Teach Yet

- Classes / OOP beyond dicts
- FastAPI, pydantic, uvicorn (Day 3+)
- Virtual environments (Day 3)
- Type hints (optional later; not required today)
- Async Python

---

## Next Day Bridge

Tomorrow we re-implement **status transition rules** and **“booking needs a bike”** in pure Python functions — the same logic as Week 2, ready to drop into FastAPI on Days 4–5.
