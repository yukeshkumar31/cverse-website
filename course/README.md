# C-VERSE 8-Week Base App Course

**Think. Build. Evolve.**

This folder is the full teaching pack for the C-VERSE Full-Stack Application Development program.

Students learn the **base features most apps need**, practice them on the **Fix-My-Ride** reference app, and build the **same base** on their own approved idea. By Week 8 they ship a working base app — then enhance later.

## Quick start for trainers

1. Read [OVERVIEW.md](OVERVIEW.md) — philosophy and promise.
2. Read [BASE-FEATURES.md](BASE-FEATURES.md) — what every student must ship.
3. Read [FIX-MY-RIDE.md](FIX-MY-RIDE.md) — BASE vs POSTPONE scope.
4. Use [QUALIFICATION.md](QUALIFICATION.md) + [TRANSFER-SHEET.md](TRANSFER-SHEET.md) in Week 1.
5. Teach from `weeks/week-XX/day-YY.md`.
6. Demo code from `increments/` (runnable checkpoints) and `reference-app/fix-my-ride/` (final base).

## Folder map

```text
course/
├── README.md                 ← you are here
├── OVERVIEW.md
├── BASE-FEATURES.md
├── QUALIFICATION.md
├── TRANSFER-SHEET.md
├── FIX-MY-RIDE.md
├── weeks/                    ← day-by-day trainer + student scripts
├── instructor/               ← pacing, demos, rubric
├── reference-app/fix-my-ride/  ← final working BASE app
└── increments/               ← day checkpoints (runnable)
```

## Stack (course)

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript, React, Vite |
| Backend | Python, FastAPI |
| Database | SQL, PostgreSQL, SQLAlchemy |
| Other | Git, GitHub |
| Auth (Week 7) | Register/login, password hashing, JWT, 2 roles |

**Do not teach TypeScript** in this course unless a project is later redefined.

## Weekly milestones

| Week | Outcome |
|------|---------|
| 1 | Qualified blueprint + Transfer Sheet |
| 2 | React UI with mock data |
| 3 | FastAPI with in-memory data |
| 4 | PostgreSQL schema + SQL practice |
| 5 | FastAPI + SQLAlchemy + PostgreSQL |
| 6 | Full-stack integration |
| 7 | Basic auth + roles |
| 8 | Polish, GitHub, enhance-later backlog |

## Run the final Fix-My-Ride base

See [reference-app/fix-my-ride/README.md](reference-app/fix-my-ride/README.md).

## Promise to students

> In 8 weeks you will turn your idea into a simple working base app with the features almost every app needs — then you will know how to grow it yourself.
