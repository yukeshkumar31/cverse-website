# Week 2 — JavaScript + React (Mock Data)

**Milestone:** Working React frontend with mock bikes + bookings (status display, simple filter).

Students mirror the same screens using **their Transfer Sheet names** (owned item + transaction), not only Fix-My-Ride words.

---

## Why this week exists

Week 1 produced a qualified blueprint. Before talking to servers or databases, students need:

1. Enough **JavaScript** to model status rules and mock data.
2. A **React + Vite** app they can run and change every day.
3. Visible **lists, forms, and filters** so the problem feels real on screen.

Trainer line:

> “This week the data lives in memory in the browser. Next week we move the same rules to Python. Later we connect them. Today we make the shop floor visible.”

---

## Outcomes by end of Day 5

| Capability | Fix-My-Ride | Student project |
|------------|-------------|-----------------|
| Pure JS status rules | `booked → in_progress → completed` | Their 3 status labels |
| Mock bikes | Array of bike objects | Their owned-item objects |
| Mock bookings | Array with `bikeId` + status | Their transaction objects |
| React app | Vite scaffold, title, components | Same structure, renamed UI copy |
| Add bike (local state) | Form → list updates | Same pattern |
| Create booking (mock) | Pick bike + service type | Same pattern |
| Status labels + filter | Filter bookings by status | Same pattern |

**Runnable checkpoint:** `course/increments/week-02/day-05-mock-ui/`

---

## Day map

| Day | Focus | Ending state |
|-----|--------|--------------|
| [Day 1](day-01.md) | JS fundamentals + status transition rules | Pure JS functions that allow/reject transitions |
| [Day 2](day-02.md) | Arrays/objects + mock data model | `bikes.js` / `bookings.js` (or one mock file) |
| [Day 3](day-03.md) | Vite + React scaffold | App runs; shows project title |
| [Day 4](day-04.md) | Lists, props, state — bikes | Bike list + add-bike form |
| [Day 5](day-05.md) | Bookings + filter + checkpoint | Full mock UI week milestone |

---

## Stack this week

- JavaScript (no TypeScript)
- Node + npm
- Vite + React (JavaScript template)
- Browser DevTools console (Days 1–2)

**Not this week:** FastAPI, PostgreSQL, fetch to a real API, auth, routing libraries beyond what Vite gives.

---

## Transfer Sheet reminder

Every demo uses Fix-My-Ride. Every student exercise uses **their** words:

| Pattern | Fix-My-Ride | Student writes… |
|---------|-------------|-----------------|
| Owned item | Bike | ________________ |
| Transaction | Booking | ________________ |
| Statuses | booked / in_progress / completed | ___ / ___ / ___ |

---

## Pacing tips

- Days 1–2: console + small `.js` files — do not rush into React.
- Day 3: leave with a green Vite app even if ugly.
- Days 4–5: prefer working forms over polished CSS.
- Stuck students: reset to last increment; do not invent new features.

---

## Week 2 checkpoint (trainer)

- [ ] Student can explain `booked → in_progress → completed` (or their labels) in plain language
- [ ] Mock bikes and bookings exist as JS data
- [ ] `npm run dev` shows the app
- [ ] Can add a bike and see it in the list
- [ ] Can create a booking linked to a bike
- [ ] Can filter bookings by status
- [ ] Transfer Sheet names appear in UI labels (not only “Bike” if their word differs)

---

## Next week bridge

Week 3 rebuilds the **same business rules** in Python and exposes them through FastAPI with in-memory lists. The React mock UI stays; live API wiring comes later (Week 6).
