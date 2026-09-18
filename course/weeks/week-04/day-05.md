# Day 5 — JOIN + Schema Checkpoint

## Learning Objective

Students write an **INNER JOIN** connecting bookings to bikes (and optionally users), save final `schema.sql` / `seed.sql`, and pass the Week 4 checkpoint.

## Continuity

Tables + CRUD-by-hand exist. Today answers: “Show me booking status **with** registration number in one result.”

**Increment:** `course/increments/week-04/day-05-schema/`

---

## PART 1 — THEORY

### Trainer script

> “A booking row stores bike_id 1. Humans want TN09AB1234. JOIN is how SQL follows the arrow from booking to bike and brings columns together.”

### Picture

```text
bookings.bike_id  ──matches──►  bikes.id
     │                              │
 status, service_type         registration_number, make
```

### INNER JOIN template

```sql
SELECT ...
FROM bookings b
JOIN bikes bk ON bk.id = b.bike_id;
```

### Analogy

JOIN = stapling the job ticket to the bike ownership card so you read both at once.

### Why aliases `b` / `bk`

Shorter SQL; disambiguate `id` columns from two tables.

---

## PART 2 — PRACTICAL

---

### Step 1 — JOIN booking + bike

**Why:** Core Friday skill.

**File:** student notes / `queries.sql` optional

**Code:**

```sql
SELECT
  b.id AS booking_id,
  b.status,
  b.service_type,
  bk.registration_number,
  bk.make,
  bk.model
FROM bookings b
JOIN bikes bk ON bk.id = b.bike_id
ORDER BY b.id;
```

**Explain:** `ON` condition is the relationship sentence from Week 1 in SQL form.

**Run:** In `psql`.

**Expected result:** One result row per booking with registration visible.

**Check:** Every student screenshots or shows trainer.

---

### Step 2 — Filter joined results

**Why:** Search pattern preview.

**File:** none

**Code:**

```sql
SELECT b.id, b.status, bk.registration_number
FROM bookings b
JOIN bikes bk ON bk.id = b.bike_id
WHERE b.status = 'booked';
```

**Explain:** WHERE after JOIN filters the combined rows.

**Run:** Query.

**Expected result:** Only booked jobs.

**Check:** Swap in student status label.

---

### Step 3 — Optional triple JOIN (users)

**Why:** Staff view “who + what bike.”

**File:** none

**Code:**

```sql
SELECT
  b.id,
  u.full_name AS customer,
  bk.registration_number,
  b.status,
  b.service_type
FROM bookings b
JOIN users u ON u.id = b.customer_id
JOIN bikes bk ON bk.id = b.bike_id;
```

**Explain:** Two JOINs follow two FKs.

**Run:** If time.

**Expected result:** Readable service desk list.

**Check:** Nice-to-have; do not block checkpoint.

---

### Step 4 — Freeze `schema.sql`

**Why:** Reproducible database.

**File:** `db/schema.sql`

**Code:** Align with increment (students rename as needed):

```sql
-- Fix-My-Ride BASE schema (adapt names to Transfer Sheet)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bikes (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  registration_number VARCHAR(40) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bike_id INTEGER NOT NULL REFERENCES bikes(id) ON DELETE RESTRICT,
  service_type VARCHAR(120) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'booked'
    CHECK (status IN ('booked', 'in_progress', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bikes_owner ON bikes(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
```

**Explain:** Compare to `course/increments/week-04/day-05-schema/schema.sql`.

**Run:** On a throwaway DB:

```bash
dropdb fixmyride_test 2>/dev/null
createdb fixmyride_test
psql -d fixmyride_test -f db/schema.sql
psql -d fixmyride_test -c '\dt'
```

**Expected result:** Three tables on fresh DB.

**Check:** Schema file is the source of truth.

---

### Step 5 — Freeze `seed.sql` + JOIN smoke

**Why:** Demo data + prove JOIN after reload.

**File:** `db/seed.sql`

**Code:** Minimal seeds (password hashes optional — Week 7 will do real hashing):

```sql
INSERT INTO users (email, password_hash, full_name, role) VALUES
('customer@demo.com', 'not-hashed-yet', 'Demo Customer', 'customer'),
('staff@demo.com', 'not-hashed-yet', 'Demo Staff', 'staff')
ON CONFLICT (email) DO NOTHING;

INSERT INTO bikes (owner_id, make, model, registration_number)
SELECT id, 'Honda', 'Activa', 'TN28AB1234' FROM users WHERE email = 'customer@demo.com'
ON CONFLICT (registration_number) DO NOTHING;

INSERT INTO bookings (customer_id, bike_id, service_type, status, notes)
SELECT u.id, bk.id, 'General service', 'booked', 'Strange noise when braking'
FROM users u
JOIN bikes bk ON bk.owner_id = u.id
WHERE u.email = 'customer@demo.com'
  AND bk.registration_number = 'TN28AB1234'
  AND NOT EXISTS (SELECT 1 FROM bookings LIMIT 1);
```

**Run:**

```bash
psql -d fixmyride_test -f db/seed.sql
psql -d fixmyride_test -c "SELECT b.id, b.status, bk.registration_number FROM bookings b JOIN bikes bk ON bk.id = b.bike_id;"
```

**Expected result:** Joined demo row prints.

**Check:** Week 4 checkpoint complete.

---

### Step 6 — Oral checkpoint (trainer)

Ask each student:

1. PK vs FK?  
2. Why JOIN?  
3. Does CHECK enforce booked→completed illegal jump?  
4. Show `schema.sql` path in their repo/folder.

---

## Student Checkpoint

- [ ] JOIN query works  
- [ ] Filtered JOIN optional  
- [ ] `schema.sql` recreates tables on empty DB  
- [ ] `seed.sql` loads demo rows  
- [ ] Transfer Sheet names reflected (or documented mapping)  

**Increment reference:** `course/increments/week-04/day-05-schema/`

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Tables + row SQL |
| **Ending state** | Schema+seed files; JOIN skill; Week 4 milestone |

---

## Do Not Teach Yet

- SQLAlchemy models (Week 5 Day 2)  
- Connection strings in FastAPI (Week 5 Day 1)  
- Auth password hashing (Week 7)  

---

## Next Day Bridge

> “Next week the API stops using Python lists. We connect FastAPI to this PostgreSQL schema with SQLAlchemy — POST bike becomes INSERT; restart keeps your data.”
