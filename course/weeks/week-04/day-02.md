# Day 2 — Tables, Types, PRIMARY KEY (Users + Bikes)

## Learning Objective

Students design and create the **users** and **bikes** tables with appropriate column types, `NOT NULL`, `UNIQUE`, and `PRIMARY KEY` / `SERIAL` ids.

## Continuity

Day 1: connected empty database. Today: first two entity tables from the Transfer Sheet. Bookings + FK tomorrow.

---

## PART 1 — THEORY

### Trainer script

> “A table is an entity. A column is a field. A row is one real bike or one real user. The primary key is the permanent nickname the database uses so other tables can point here.”

### Fix-My-Ride draft (board)

```text
users
  id              SERIAL PRIMARY KEY
  email           VARCHAR UNIQUE NOT NULL
  password_hash   VARCHAR NOT NULL
  full_name       VARCHAR NOT NULL
  role            VARCHAR NOT NULL   -- customer | staff
  created_at      TIMESTAMPTZ DEFAULT NOW()

bikes
  id                    SERIAL PRIMARY KEY
  owner_id              INTEGER NOT NULL   -- FK tomorrow
  make                  VARCHAR NOT NULL
  model                 VARCHAR NOT NULL
  registration_number   VARCHAR UNIQUE NOT NULL
  created_at            TIMESTAMPTZ DEFAULT NOW()
```

### Types (teach only these)

| SQL type | Use |
|----------|-----|
| `SERIAL` | Auto-increment integer id |
| `INTEGER` | Whole numbers / FK ids |
| `VARCHAR(n)` | Short text |
| `TEXT` | Long notes (later) |
| `TIMESTAMPTZ` | Timestamps with time zone |

### Analogy

PRIMARY KEY = employee ID badge number. Names can collide; badge numbers should not.

### Important Terms

| Term | Meaning |
|------|---------|
| PRIMARY KEY | Unique row identity |
| UNIQUE | No two rows share this value |
| NOT NULL | Required field |
| DEFAULT | Value if omitted |

---

## PART 2 — PRACTICAL

Work in `psql -d fixmyride` or write `schema.sql` as you go.

---

### Step 1 — Draw before typing

**Why:** Prevent random columns.

**File:** paper / board

**Code:** Student copies Transfer Sheet §4 into table sketches.

**Explain:** Max ~6 columns per BASE table.

**Run:** Trainer approves sketches quickly.

**Expected result:** users + owned-item table named.

**Check:** Status field is **not** on bikes — it belongs on bookings (tomorrow).

---

### Step 2 — CREATE users

**Why:** Auth entity (hash only — no JWT yet).

**File:** `db/schema.sql` (start file)

**Code:**

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Explain:** `CHECK` limits roles to BASE two. `password_hash` stores a hash later — today a placeholder string is fine for inserts.

**Run:**

```bash
psql -d fixmyride -c "\i db/schema.sql"
# or paste into psql
```

**Expected result:** `CREATE TABLE`.

**Check:** `\d users` shows columns.

---

### Step 3 — CREATE bikes (FK deferred)

**Why:** Owned item table; reference owner as integer today, formal FK tomorrow if preferred — **recommended:** add REFERENCES now if users exists.

**File:** `db/schema.sql`

**Code:**

```sql
CREATE TABLE IF NOT EXISTS bikes (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  registration_number VARCHAR(40) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Explain:** `REFERENCES users(id)` is a foreign key — preview of Day 3. Registration unique like a real plate.

**Run:** Execute; `\d bikes`.

**Expected result:** Table created; FK visible in `\d`.

**Check:** Student renamed `make/model` if Transfer Sheet differs (`title`, `author`, …).

---

### Step 4 — Prove UNIQUE

**Why:** Constraints are features.

**File:** none (interactive)

**Code:**

```sql
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('customer@demo.com', 'not-hashed-yet', 'Demo Customer', 'customer');

INSERT INTO users (email, password_hash, full_name, role)
VALUES ('customer@demo.com', 'x', 'Dup', 'customer');
-- Expect ERROR unique violation
```

**Explain:** Second insert must fail — celebrate the error.

**Run:** Both inserts.

**Expected result:** First OK; second error.

**Check:** `\dt` still shows two tables.

---

### Step 5 — Insert one bike

**Why:** End day with a visible owned item.

**File:** optional notes

**Code:**

```sql
INSERT INTO bikes (owner_id, make, model, registration_number)
VALUES (1, 'Honda', 'Activa', 'TN09AB1234');

SELECT * FROM bikes;
```

**Explain:** `owner_id` must match an existing user id.

**Run:** Insert + select.

**Expected result:** One bike row with generated `id`.

**Check:** Fake `owner_id` 999 → FK error if REFERENCES present.

---

## Student Checkpoint

- [ ] Can explain PRIMARY KEY  
- [ ] `users` and owned-item tables exist  
- [ ] UNIQUE demo done  
- [ ] At least one user + one item row  
- [ ] Fields match Transfer Sheet (renamed OK)  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Empty DB |
| **Ending state** | users + bikes tables + sample rows |

---

## Do Not Teach Yet

- Bookings table details beyond mentioning tomorrow  
- JOIN queries  
- Indexes deep dive  
- ORM  

---

## Next Day Bridge

Tomorrow we add **bookings** with foreign keys to users and bikes, plus a CHECK on the three statuses.
