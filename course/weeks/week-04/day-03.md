# Day 3 — FOREIGN KEY + Bookings Table

## Learning Objective

Students create the **bookings** table with foreign keys to `users` and `bikes`, enforce status with `CHECK`, and prove that a booking cannot reference a missing bike.

## Continuity

Day 2 created users + bikes. Today the transaction entity lands — the heart of the status workflow.

---

## PART 1 — THEORY

### Trainer script

> “A foreign key is a promise: this number points at a real row over there. A booking with bike_id 999 when no bike 999 exists is a lie — Postgres should refuse the lie.”

### ER (BASE)

```text
users (1) ──< bikes
users (1) ──< bookings
bikes (1) ──< bookings
```

### Status field

```text
status VARCHAR CHECK (status IN ('booked', 'in_progress', 'completed'))
DEFAULT 'booked'
```

Students substitute their three labels inside `CHECK`.

### Analogy

FK = hotel key card encoded to a real room number. Inventing room 999 fails at the door.

### ON DELETE (keep light)

| Choice | Meaning for BASE |
|--------|------------------|
| `ON DELETE CASCADE` | Delete user → their bikes go too (OK for demo) |
| `ON DELETE RESTRICT` | Cannot delete bike that still has bookings (safer for jobs) |

Use RESTRICT on `bookings.bike_id` for Fix-My-Ride BASE.

---

## PART 2 — PRACTICAL

---

### Step 1 — Draft bookings columns

**Why:** Match Transfer Sheet transaction.

**File:** paper

**Code:** List fields: customer_id, bike_id, service_type, status, notes, timestamps.

**Explain:** Do not add payment columns.

**Run:** Trainer glance.

**Expected result:** ~6–8 columns max.

**Check:** Status is on bookings, not bikes.

---

### Step 2 — CREATE bookings

**Why:** Persist transactions.

**File:** `db/schema.sql`

**Code:**

```sql
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
```

**Explain:** Read each REFERENCES aloud. DEFAULT starts every job as booked.

**Run:** `\i` schema or paste.

**Expected result:** `\d bookings` shows FKs.

**Check:** Student CHECK matches their three status words.

---

### Step 3 — Valid INSERT

**Why:** Happy path.

**File:** none

**Code:**

```sql
INSERT INTO bookings (customer_id, bike_id, service_type, notes)
VALUES (1, 1, 'General service', 'Brake noise');

SELECT * FROM bookings;
```

**Explain:** Omitting status uses DEFAULT `booked`.

**Run:** Insert + select.

**Expected result:** One row, status booked.

**Check:** ids match existing user/bike.

---

### Step 4 — Invalid bike_id

**Why:** See FK protect integrity.

**File:** none

**Code:**

```sql
INSERT INTO bookings (customer_id, bike_id, service_type)
VALUES (1, 99999, 'Oil change');
-- Expect foreign key violation
```

**Explain:** This is the SQL version of Week 3’s HTTP 400 “Bike does not exist.”

**Run:** Command.

**Expected result:** ERROR; table unchanged.

**Check:** Celebrate — “the database has a business rule too.”

---

### Step 5 — Invalid status

**Why:** CHECK constraint demo.

**File:** none

**Code:**

```sql
INSERT INTO bookings (customer_id, bike_id, service_type, status)
VALUES (1, 1, 'X', 'teleported');
-- Expect check violation
```

**Explain:** DB blocks unknown status labels. Transition *order* is still app logic (Week 5 service) — CHECK only allows the three values.

**Run:** Insert.

**Expected result:** ERROR.

**Check:** Students can say: CHECK ≠ full transition graph.

---

### Step 6 — Helpful indexes (optional)

**Why:** Search by status later.

**File:** `schema.sql`

**Code:**

```sql
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bikes_owner ON bikes(owner_id);
```

**Explain:** Index = sticky tabs on the filing cabinet. Optional if behind.

**Run:** Create indexes; `\di`.

**Expected result:** Indexes listed.

**Check:** Do not require query plans today.

---

## Student Checkpoint

- [ ] `bookings` table exists with FKs  
- [ ] Valid booking inserted  
- [ ] Fake bike_id rejected  
- [ ] Bad status rejected  
- [ ] Can explain FK in one sentence  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | users + bikes |
| **Ending state** | Full BASE table set with relationships |

---

## Do Not Teach Yet

- JOIN syntax (Day 5)  
- UPDATE status workflows in SQL depth (touch Day 4)  
- ORM  

---

## Next Day Bridge

Tomorrow we practice **INSERT / SELECT / UPDATE / DELETE** by hand so SQL feels like a tool, not magic — then Friday we JOIN.
