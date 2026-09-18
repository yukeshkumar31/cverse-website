# Week 4 — SQL + PostgreSQL Design

**Milestone:** PostgreSQL database with BASE schema (users, bikes, bookings), seed data, and students who can run SELECT/INSERT plus one **JOIN**.

Students design tables using **Transfer Sheet names**; trainers demo Fix-My-Ride SQL.

---

## Why this week exists

```text
Week 3: FastAPI → Python lists in RAM (forget on restart)
Week 4: Same shapes → PostgreSQL tables (permanent notebook)
Week 5: FastAPI → SQLAlchemy → those tables
```

Trainer line:

> “Your API already spoke JSON about bikes and bookings. This week we teach the database the same story in SQL — keys, foreign keys, and joins.”

---

## Outcomes by end of Day 5

| Capability | Fix-My-Ride | Student project |
|------------|-------------|-----------------|
| Postgres running | local DB `fixmyride` | Their DB name |
| CREATE TABLE | users, bikes, bookings | Renamed tables |
| PK / FK | ids + references | Same pattern |
| CHECK / UNIQUE | role, status, registration | Their constraints |
| Seed | demo rows | A few sample rows |
| JOIN | booking + bike registration | Their transaction + item |
| Schema files | `schema.sql` + `seed.sql` | Same habit |

**Runnable checkpoint:** `course/increments/week-04/day-05-schema/`

---

## Day map

| Day | Focus | Ending state |
|-----|--------|--------------|
| [Day 1](day-01.md) | Why databases; install/connect Postgres | Can connect; create empty DB |
| [Day 2](day-02.md) | Tables, types, PRIMARY KEY | Users + bikes tables drafted |
| [Day 3](day-03.md) | FOREIGN KEY + bookings table | Relationship enforced in SQL |
| [Day 4](day-04.md) | INSERT / SELECT / UPDATE basics | Can CRUD rows by hand |
| [Day 5](day-05.md) | JOIN + schema files + checkpoint | Full Week 4 milestone |

---

## Stack this week

- PostgreSQL 14+ (or course-standard)
- `psql` CLI (GUI optional: pgAdmin / TablePlus)
- Plain `.sql` files — no ORM yet

**Not this week:** SQLAlchemy, FastAPI DB wiring, React, JWT, migrations tools (Alembic).

---

## Transfer Sheet reminder

| Pattern | Fix-My-Ride table | Student may name… |
|---------|-------------------|-------------------|
| User | `users` | often keep `users` |
| Owned item | `bikes` | `books`, `devices`, … |
| Transaction | `bookings` | `loans`, `orders`, … |
| Statuses | booked / in_progress / completed | Their three labels in CHECK |

---

## Pacing tips

- Day 1: connection success > fancy SQL.  
- Days 2–3: draw ER on board before typing CREATE.  
- Day 4: every student INSERTs and SELECTs themselves.  
- Day 5: JOIN is the Friday must-ship; indexes are bonus.  
- Behind: skip GROUP BY / window functions entirely.

---

## Week 4 checkpoint (trainer)

- [ ] Database exists and `psql` connects  
- [ ] Three tables create cleanly from `schema.sql`  
- [ ] FK prevents booking with fake bike id (demo)  
- [ ] Student runs a JOIN returning transaction + owned-item field  
- [ ] `seed.sql` (or manual inserts) produces demo rows  
- [ ] Student can explain PK vs FK in one sentence each  

---

## Next week bridge

Week 5 connects **FastAPI + SQLAlchemy** to this schema so POST `/bikes` writes a real row — restart no longer wipes data.
