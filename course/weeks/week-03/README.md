# Week 3 — Python + FastAPI (In-Memory)

**Milestone:** Working FastAPI app with in-memory bikes + bookings CRUD and business rules (status transitions; booking requires a bike).

Students keep React mock UI from Week 2 as-is. This week builds the **backend brain** separately. Wiring React → API is Week 6.

---

## Why this week exists

```text
Week 2: rules + data in the browser (mock)
Week 3: same rules + data in Python (in-memory API)
Week 4: same data shape in PostgreSQL (SQL)
Week 5+: connect API to DB, then to React
```

Trainer line:

> “If the rule only lives in React, a clever user can bypass it. This week we put the rule on the server — still without a database. Restarting the API clears data; that is expected until PostgreSQL.”

---

## Outcomes by end of Day 5

| Capability | Endpoint / behavior |
|------------|---------------------|
| Health check | `GET /health` |
| List / create bikes | `GET/POST /bikes` |
| List / create bookings | `GET/POST /bookings` |
| Status update | `PATCH /bookings/{id}/status` |
| Validation | Missing bike → 400; bad transition → 400 |
| Pydantic models | Request/response shapes |

**Runnable checkpoint:** `course/increments/week-03/day-05-memory-api/`

---

## Day map

| Day | Focus | Ending state |
|-----|--------|--------------|
| [Day 1](day-01.md) | Python basics | Scripts with vars, conditions, functions, lists/dicts |
| [Day 2](day-02.md) | Business rules in Python | `can_change_status`, create booking with bike check |
| [Day 3](day-03.md) | venv, FastAPI, uvicorn | `GET /health` returns OK |
| [Day 4](day-04.md) | Bikes CRUD (in-memory) | GET/POST `/bikes` with Pydantic |
| [Day 5](day-05.md) | Bookings + PATCH status | Full in-memory API; week checkpoint |

---

## Stack this week

- Python 3.10+ (or course-standard version)
- `venv`
- FastAPI + Uvicorn
- Pydantic (comes with FastAPI)
- Manual API testing via browser, `curl`, or Swagger UI at `/docs`

**Not this week:** PostgreSQL, SQLAlchemy, React `fetch`, JWT auth.

---

## Transfer Sheet reminder

| Pattern | Fix-My-Ride route flavor | Student may name… |
|---------|--------------------------|-------------------|
| Owned item | `/bikes` | `/books`, `/courses`, … |
| Transaction | `/bookings` | `/loans`, `/orders`, … |
| Statuses | booked / in_progress / completed | Their three labels |

Prefer matching route names to the student domain once FastAPI is introduced — trainers still demo `/bikes` and `/bookings`.

---

## Pacing tips

- Days 1–2: plain `.py` files; no FastAPI until Day 3.
- Day 3: every student must see `/docs` open.
- Days 4–5: use in-memory Python lists; restart = empty (or re-seed).
- Stuck: return to last working `/health` or bikes-only API.

---

## Week 3 checkpoint (trainer)

- [ ] venv + dependencies documented by student
- [ ] `uvicorn` serves the app
- [ ] `/health` works
- [ ] Can POST and GET bikes
- [ ] Can POST booking only with valid bike id
- [ ] PATCH status rejects illegal transitions
- [ ] Student can explain in-memory vs database

---

## Next week bridge

Week 4 designs and creates the **PostgreSQL schema** and practices SQL. The in-memory lists from this week become rows in tables.
