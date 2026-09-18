# Day 4 — INSERT, SELECT, UPDATE (Hands-on SQL)

## Learning Objective

Students confidently insert, query, update, and (carefully) delete rows; filter with `WHERE`; and update a booking status along the legal path using SQL.

## Continuity

Schema exists. Today is “hands on the filing cabinet” — fluent `psql` before JOINs tomorrow.

---

## PART 1 — THEORY

### Trainer script

> “CRUD is not only an API word. In SQL: INSERT create, SELECT read, UPDATE update, DELETE delete. We will move a booking from booked to in_progress with UPDATE — the same story your PATCH will do next week through FastAPI.”

### Core clauses

```sql
INSERT INTO ... VALUES (...);
SELECT columns FROM table WHERE condition;
UPDATE table SET col = val WHERE id = ...;
DELETE FROM table WHERE id = ...;
```

### Analogy

SELECT = pull a folder. WHERE = which folder. UPDATE = rewrite a line on the form.

### Safety line

> “Always WHERE on UPDATE/DELETE in class. UPDATE without WHERE updates everyone — disaster.”

---

## PART 2 — PRACTICAL

Use Fix-My-Ride names; students rename tables/columns as needed.

---

### Step 1 — Seed a second bike + booking

**Why:** Lists need more than one row.

**File:** working toward `seed.sql`

**Code:**

```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('staff@demo.com', 'not-hashed-yet', 'Demo Staff', 'staff')
ON CONFLICT (email) DO NOTHING;

INSERT INTO bikes (owner_id, make, model, registration_number)
VALUES (1, 'TVS', 'Jupiter', 'TN22CD5678')
ON CONFLICT (registration_number) DO NOTHING;

INSERT INTO bookings (customer_id, bike_id, service_type, notes)
VALUES (1, 2, 'Oil change', NULL);
```

**Explain:** `ON CONFLICT DO NOTHING` keeps re-runs safe when UNIQUE hits.

**Run:** Execute; `SELECT count(*) FROM bikes;`

**Expected result:** ≥2 bikes; ≥2 bookings if prior day data kept.

**Check:** Fix id mismatches if seed order differs.

---

### Step 2 — SELECT with WHERE

**Why:** Search/filter skill (BASE feature).

**File:** none

**Code:**

```sql
SELECT id, make, model, registration_number
FROM bikes
WHERE owner_id = 1;

SELECT id, service_type, status
FROM bookings
WHERE status = 'booked';
```

**Explain:** Filter early — don’t dump whole tables in production habits.

**Run:** Both queries.

**Expected result:** Matching rows only.

**Check:** Student writes WHERE for their status label.

---

### Step 3 — UPDATE status (legal path)

**Why:** Mirror staff workflow in SQL.

**File:** none

**Code:**

```sql
UPDATE bookings
SET status = 'in_progress', updated_at = NOW()
WHERE id = 1 AND status = 'booked';

SELECT id, status FROM bookings WHERE id = 1;
```

**Explain:** Including `AND status = 'booked'` avoids accidental double jumps in manual practice.

**Run:** Update + select.

**Expected result:** Status `in_progress`.

**Check:** Then update to `completed` similarly.

---

### Step 4 — Try illegal status via UPDATE

**Why:** See CHECK still watching.

**File:** none

**Code:**

```sql
-- Reset a row to booked first if needed, then:
UPDATE bookings SET status = 'completed' WHERE id = 2 AND status = 'booked';
-- CHECK allows the *value* completed — so this may SUCCEED in SQL!
```

**Explain (critical teaching moment):**

> “CHECK only allows the three words. It does **not** enforce transition order. That rule lives in application code (Week 3 memory API / Week 5 service). Database + app share responsibility.”

Optional demo: skip ahead illegally in SQL to show why backend rules still matter.

**Run:** Discuss outcome.

**Expected result:** Students can articulate CHECK vs transition map.

**Check:** Write on board: “DB: allowed values. App: allowed moves.”

---

### Step 5 — DELETE carefully

**Why:** Know the danger; prefer not to delete bookings in BASE demos.

**File:** none

**Code:**

```sql
DELETE FROM bikes WHERE id = 999;  -- no-op if missing

-- Try delete bike that has bookings (if ON DELETE RESTRICT):
-- DELETE FROM bikes WHERE id = 1;
-- Expect error if bookings reference it
```

**Explain:** RESTRICT protects history.

**Run:** Attempt; read error.

**Expected result:** Error if children exist.

**Check:** Do not mass-delete class DBs.

---

### Step 6 — Start `seed.sql` file

**Why:** Reproducible Friday demos.

**File:** `db/seed.sql`

**Code:** Copy successful INSERTs into a file; comment password note:

```sql
-- Demo seeds for class. Prefer creating real password hashes via Week 7 register API later.
```

**Explain:** Schema vs seed separation is professional habit.

**Run:** `psql -d fixmyride -f db/seed.sql` on a fresh DB after schema.

**Expected result:** Rows appear from file.

**Check:** File lives in project folder, not only chat history.

---

## Student Checkpoint

- [ ] Wrote INSERT / SELECT / UPDATE with WHERE  
- [ ] Filtered bookings by status  
- [ ] Explained CHECK vs transition rules  
- [ ] Has a growing `seed.sql`  
- [ ] Did not run WHERE-less UPDATE  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Tables exist; shaky SQL fluency |
| **Ending state** | Comfortable row-level SQL; seed file started |

---

## Do Not Teach Yet

- Multi-table JOIN (Day 5)  
- Transactions (`BEGIN/COMMIT`) beyond mention  
- Window functions  

---

## Next Day Bridge

Tomorrow we **JOIN** bookings to bikes so one query shows service status beside registration number — then freeze `schema.sql` + `seed.sql` as the Week 4 checkpoint.
