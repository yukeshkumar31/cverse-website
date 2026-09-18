# Day 3 — FastAPI Setup: venv, /health, Uvicorn

## Learning Objective

By the end of this day, students can create a Python virtual environment, install FastAPI and Uvicorn, run a minimal API, and verify `GET /health` in the browser and Swagger UI (`/docs`).

## Continuity

Day 2 finished business rules in plain Python. Today we build the **empty shop with the lights on** — a running API process. Routes for bikes/bookings arrive Days 4–5. Keep Day 2 `rules.py` nearby for copying later.

---

## PART 1 — THEORY

### Trainer script

> “FastAPI is a Python framework for building HTTP APIs. Uvicorn is the server that runs your FastAPI app. A virtual environment (`venv`) keeps this project’s packages separate from the rest of your computer.”

### Mental model

```text
Client (browser /docs or curl)
    → HTTP request
    → Uvicorn
    → FastAPI route function
    → JSON response
```

### Why `/health` first?

Prove the server runs before adding business complexity. Ops and beginners both love a green health check.

### Analogy

venv = a labeled toolbox for this project only. `/health` = “Is the shop open?” sign.

### Words

| Term | Meaning |
|------|---------|
| Virtual environment | Isolated package folder per project |
| Dependency | Library you install (`fastapi`) |
| Route | URL path + function |
| JSON | Data format APIs speak |
| Swagger `/docs` | Auto page to try endpoints |

---

## PART 2 — PRACTICAL

Suggested project:

```text
fix-my-ride-api/          # or student-api name
  .venv/
  main.py
  requirements.txt
```

---

### Step 1 — Create project folder + venv

**Why:** Isolation and repeatable installs.

**File:** folder + venv

**Code / commands:**

```bash
mkdir fix-my-ride-api
cd fix-my-ride-api
python3 -m venv .venv
source .venv/bin/activate
```

Windows (if needed): `.venv\Scripts\activate`

**Explain:** While activated, the prompt often shows `(.venv)`. Use `deactivate` later to leave.

**Run:** Commands above.

**Expected result:** `.venv` directory exists; prompt shows venv active.

**Check:** `which python` points inside `.venv` (macOS/Linux).

---

### Step 2 — Install FastAPI and Uvicorn

**Why:** Framework + server.

**File:** will create `requirements.txt` next

**Code / commands:**

```bash
pip install fastapi uvicorn
```

**Explain:** `pip` installs into the active venv. Uvicorn package provides the `uvicorn` command.

**Run:** Install command.

**Expected result:** Successfully installed messages; no error.

**Check:** `python -c "import fastapi; print(fastapi.__version__)"`

---

### Step 3 — Freeze requirements

**Why:** Classmates / future you can reinstall the same stack.

**File:** `requirements.txt`

**Code / commands:**

```bash
pip freeze > requirements.txt
```

Or minimal hand-written file:

```text
fastapi
uvicorn
```

**Explain:** `pip freeze` lists exact versions. Minimal file is fine for class; freeze is more reproducible.

**Run:** Create the file; open it and glance.

**Expected result:** File lists fastapi, uvicorn, and related packages if freeze was used.

**Check:** File is in the project root (not only inside `.venv`).

---

### Step 4 — Minimal FastAPI app with `/health`

**Why:** First runnable API.

**File:** `main.py`

**Code:**

```python
from fastapi import FastAPI

app = FastAPI(title="Fix-My-Ride API", version="0.1.0")


@app.get("/health")
def health():
    return {"status": "ok"}
```

Student title: their app name.

**Explain:** `app` is the FastAPI application. `@app.get("/health")` means “when someone GET-requests `/health`, run this function.” Returning a dict becomes JSON automatically.

**Run:** (next step with uvicorn)

**Expected result:** File saved.

**Check:** Student changed `title=` to their project name.

---

### Step 5 — Run Uvicorn

**Why:** Serve the app.

**File:** none

**Code / commands:**

```bash
uvicorn main:app --reload
```

**Explain:** `main` is the file `main.py`. `app` is the variable. `--reload` restarts when you save (good for learning).

**Run:** Leave terminal open. Note the URL (often `http://127.0.0.1:8000`).

**Expected result:** Uvicorn startup logs; “Application startup complete.”

**Check:** No traceback; port free (if busy, try `--port 8001`).

---

### Step 6 — Verify in browser and `/docs`

**Why:** See JSON and discover Swagger.

**File:** none

**Code / commands:**

- Open `http://127.0.0.1:8000/health`
- Open `http://127.0.0.1:8000/docs`
- Optional curl:

```bash
curl http://127.0.0.1:8000/health
```

**Explain:** `/docs` is interactive documentation generated from your routes. Click GET `/health` → Try it out → Execute.

**Run:** As above.

**Expected result:** `{"status":"ok"}` and Swagger shows Health endpoint.

**Check:** Every student screenshots or shows trainer `/health` JSON.

---

### Step 7 — Add a tiny root message (optional)

**Why:** Friendly landing if someone hits `/`.

**File:** `main.py`

**Code:**

```python
@app.get("/")
def root():
    return {
        "message": "Fix-My-Ride API (in-memory week)",
        "health": "/health",
        "docs": "/docs",
    }
```

**Explain:** Helps beginners who open the base URL.

**Run:** Save; reload thanks to `--reload`; visit `/`.

**Expected result:** JSON with links/hints.

**Check:** Still no bikes routes — that is tomorrow.

---

## Student Checkpoint

- [ ] venv created and activated
- [ ] `fastapi` and `uvicorn` installed
- [ ] `requirements.txt` exists
- [ ] `uvicorn main:app --reload` runs
- [ ] `/health` returns `{"status":"ok"}`
- [ ] Student opened `/docs`

**Increment:** `course/increments/week-03/day-03-fastapi-health/`

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Business rules in plain `.py`; no HTTP server |
| **Ending state** | FastAPI project with venv; `/health` live; ready for bikes routes |

---

## Do Not Teach Yet

- Pydantic models for bikes (Day 4)
- POST bodies, path params for bookings (Days 4–5)
- CORS (needed when React talks to API — Week 6)
- Database connections
- Authentication

---

## Next Day Bridge

Tomorrow we add **in-memory bikes**: Pydantic models, `GET /bikes`, `POST /bikes`. Day 2’s list-of-dicts idea becomes the API’s storage.
