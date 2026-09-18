# Week 5 — FastAPI + PostgreSQL + SQLAlchemy

**Milestone:** Backend persists in PostgreSQL (bikes + bookings + status rules + search).

Students apply the same patterns to **their Transfer Sheet names**. Fix-My-Ride is the trainer reference only.

---

## Why this week exists

Week 3 had FastAPI with **in-memory lists**. Week 4 practiced **SQL + PostgreSQL schema**.  
Week 5 joins them: the API no longer forgets data when the server restarts.

```text
Before (Week 3):  React? → FastAPI → Python list in RAM
After (Week 5):   (React later) → FastAPI → SQLAlchemy → PostgreSQL
```

Trainer line:

> “Memory was practice. PostgreSQL is the real notebook. Today we teach the backend to read and write that notebook through SQLAlchemy.”

---

## Outcomes by end of Day 5

| Capability | Fix-My-Ride | Student project |
|------------|-------------|-----------------|
| DB connection | `DATABASE_URL` + engine | Same pattern, their DB name |
| Models | `User` (stub), `Bike`, `Booking` | Their entities |
| Session + tables | `get_db`, `create_all` | Same |
| Bikes CRUD via DB | GET/POST `/bikes` | Their owned-item routes |
| Bookings + FK | Create booking with `bike_id` | Their transaction + FK |
| Status rules | Service layer rejects invalid jumps | Their 3 statuses |
| Search/filter | Query params on bookings | Their filter field |
| Errors | Clear HTTP errors | Same |

**Runnable checkpoint:** `course/increments/week-05/day-05-db-api/`

---

## Day map

| Day | Focus | Ending state |
|-----|--------|--------------|
| [Day 1](day-01.md) | Why DB connection; replace memory mentally | Engine + `/health` that pings DB |
| [Day 2](day-02.md) | SQLAlchemy models | `User`, `Bike`, `Booking` models defined |
| [Day 3](day-03.md) | Session, create tables, bikes on DB | GET/POST bikes persist |
| [Day 4](day-04.md) | Bookings + FK + status service | Bookings + valid status updates |
| [Day 5](day-05.md) | Search, errors, checkpoint | Full Week 5 milestone |

---

## Stack this week

- FastAPI (from Week 3)
- PostgreSQL (from Week 4)
- SQLAlchemy 2.x
- `psycopg` (or compatible driver)
- Pydantic schemas for request/response

**Not this week:** React `fetch`, CORS polish, JWT auth, Docker, migrations tools beyond `create_all`.

---

## Transfer Sheet reminder

| Pattern | Fix-My-Ride | Student writes… |
|---------|-------------|-----------------|
| Owned item | Bike | ________________ |
| Transaction | Booking | ________________ |
| Statuses | booked / in_progress / completed | ___ / ___ / ___ |

---

## Pacing tips

- Day 1: connection success matters more than fancy models.
- Day 2: models only — do not rush endpoints.
- Day 3: one entity (bikes) end-to-end before bookings.
- Day 4: keep status rules in a **service function**, not scattered in routers.
- Day 5: filter + error messages; then freeze for Week 6 UI wiring.

---

## Week 5 checkpoint (trainer)

- [ ] PostgreSQL database exists and accepts connections
- [ ] Restarting uvicorn does **not** wipe bikes/bookings
- [ ] GET/POST bikes work against the DB
- [ ] Creating a booking requires a real `bike_id`
- [ ] Invalid status jump returns an error (not silent success)
- [ ] Filter by `status` query param works
- [ ] Student can point to: route → service → model → table

---

## Next week bridge

Week 6 connects the **React mock UI** to this live API (CORS, loading, forms, PATCH status, search). Auth waits until Week 7.
