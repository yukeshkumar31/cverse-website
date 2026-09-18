# Week 6 — Full-Stack Integration

**Milestone:** React ↔ FastAPI ↔ PostgreSQL for core flows (bikes, bookings, status, search) — still **without** auth.

Students wire their Week 2 UI to their Week 5 API using Transfer Sheet names.

---

## Why this week exists

Until now the frontend and backend were separate classrooms. Week 6 is the first time a button in React changes a row in PostgreSQL.

```text
USER → React → fetch/HTTP/JSON → FastAPI → SQLAlchemy → PostgreSQL
                ↑_________________ JSON response _________________↓
```

Trainer line:

> “If the network tab and the database agree, you have a real app — not two demos.”

---

## Outcomes by end of Day 5

| Capability | Fix-My-Ride | Student project |
|------------|-------------|-----------------|
| CORS | Backend allows Vite origin | Same |
| GET bikes in UI | `useEffect` + loading | Owned-item list from API |
| POST bike form | Form → API → refresh list | Same pattern |
| Bookings list + create | Live API | Their transaction |
| Status PATCH buttons | Show API errors | Their statuses |
| Search/filter wired | Query params from UI | Same |
| Debug process | Network tab + API docs | Habit formed |

**Runnable checkpoint:** `course/increments/week-06/day-05-integrated/`

---

## Day map

| Day | Focus | Ending state |
|-----|--------|--------------|
| [Day 1](day-01.md) | fetch GET bikes; CORS; loading | Live bike list |
| [Day 2](day-02.md) | POST bike from React form | Create bike round trip |
| [Day 3](day-03.md) | Bookings list + create | Bookings from API |
| [Day 4](day-04.md) | Status PATCH + show errors | Buttons call backend rules |
| [Day 5](day-05.md) | Search + debugging lesson | Week 6 checkpoint |

---

## Stack this week

- React + Vite (JS)
- `fetch` (no axios required)
- FastAPI CORS middleware
- Week 5 PostgreSQL API

**Not this week:** JWT login pages, role gates, Docker, React Query unless already introduced lightly.

---

## Two terminals forever

```text
Terminal A:  uvicorn … :8000
Terminal B:  npm run dev … :5173
```

Trainer: check both are up before blaming code.

---

## Week 6 checkpoint (trainer)

- [ ] Bike list loads from API (not mock array)
- [ ] Add bike form persists (restart API → still there; refresh UI → still there)
- [ ] Bookings list + create work from UI
- [ ] Status button triggers PATCH; illegal action shows error message from API
- [ ] Filter control hits query params (or clearly documented client filter + API — prefer API)
- [ ] Student can narrate the full round trip once

---

## Next week bridge

Week 7 adds **register/login + JWT + customer vs staff**. Until then, temporary `owner_id` / `customer_id` defaults remain acceptable.
