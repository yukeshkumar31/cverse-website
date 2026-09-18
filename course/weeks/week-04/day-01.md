# Day 1 — Why Databases? Install & Connect PostgreSQL

## Learning Objective

Students explain why in-memory lists are not enough, install/confirm PostgreSQL, create a course database, and connect with `psql` (or an approved GUI).

## Continuity

Week 3 ended with a working memory API that **forgets** on restart. Today we open the permanent notebook. No CREATE TABLE depth yet — connection and mental model first.

---

## PART 1 — THEORY

### Trainer script

> “RAM is a whiteboard. Wipe the board (restart) and the shop forgets every bike. A database is a filing cabinet. PostgreSQL is the cabinet we use in this course.”

### Mental model

```text
Week 3:  FastAPI  →  Python list
Week 4:  (human)  →  SQL        →  PostgreSQL files on disk
Week 5:  FastAPI  →  SQLAlchemy →  PostgreSQL
```

### Analogy

| | Whiteboard (memory) | Filing cabinet (DB) |
|--|---------------------|---------------------|
| Speed | Fast | Fast enough |
| Restart | Empty | Still there |
| Multi-user truth | Easy to lose | Shared source of truth |
| Course use | Practice rules | Real BASE persistence |

### Why PostgreSQL (keep short)

- Free, industry-common, excellent for relational BASE apps  
- Speaks SQL — the skill transfers  
- Matches course stack: FastAPI + SQLAlchemy + Postgres  

Do **not** debate Mongo vs Postgres today.

### Important Terms

| Term | Meaning |
|------|---------|
| Database server | Postgres process running on the machine |
| Database | Named container inside the server (`fixmyride`) |
| Table | Grid of rows/columns (entity) |
| Row | One record (one bike) |
| SQL | Language to talk to relational DBs |
| `psql` | Terminal client for Postgres |

---

## PART 2 — PRACTICAL

### Step 1 — Confirm Postgres is installed

**Why:** No SQL without a server.

**File:** none

**Code / commands:**

```bash
psql --version
# or
postgres --version
```

**Explain:** If missing, follow course install notes (Homebrew / Postgres.app / Windows installer). Trainer helps OS-specific pain offline.

**Run:** Version command.

**Expected result:** A version number prints.

**Check:** Trainer sees version on student screen.

---

### Step 2 — Start service (if needed)

**Why:** Installed ≠ running.

**File:** none

**Commands (examples — adjust to OS):**

```bash
# macOS Homebrew example
brew services start postgresql@14
# or open Postgres.app
```

**Explain:** The server must be listening before `psql` works.

**Run:** Start service; retry `psql`.

**Expected result:** Can enter `psql` or connection attempt changes from “connection refused.”

**Check:** No endless install rabbit holes — pair stuck students.

---

### Step 3 — Create the course database

**Why:** Isolate Fix-My-Ride / student data.

**File:** none

**Code:**

```bash
createdb fixmyride
# Student alternative:
# createdb myappname
```

Or inside `psql`:

```sql
CREATE DATABASE fixmyride;
```

**Explain:** One database per project is enough for BASE.

**Run:** Create DB.

**Expected result:** `createdb` exits 0; `\l` lists `fixmyride`.

**Check:** Student uses Transfer Sheet project name if preferred — write it on the sheet.

---

### Step 4 — Connect and explore meta-commands

**Why:** Comfort in the client.

**File:** none

**Code:**

```bash
psql -d fixmyride
```

Inside psql:

```text
\conninfo
\l
\dt
\q
```

**Explain:** `\dt` lists tables (empty today). `\q` quits. SQL statements end with `;`.

**Run:** As above.

**Expected result:** Connected; `\dt` says no relations yet.

**Check:** Every student enters and leaves `psql` once.

---

### Step 5 — Tiny smoke SQL

**Why:** Prove SQL runs before schema design.

**File:** none (interactive)

**Code:**

```sql
SELECT version();
SELECT current_database();
SELECT NOW();
```

**Explain:** `SELECT` asks for data. Even without tables we can select expressions.

**Run:** Each statement with `;`.

**Expected result:** Version string, `fixmyride`, timestamp.

**Check:** Student not afraid of the prompt.

---

### Step 6 — Link to Week 3 pain (discussion)

**Why:** Motivation glue.

**File:** none

**Code:** none

**Explain / ask:**

> “Name one bike you POSTed last week. Is it still in the API after restart? Where *should* it live after today?”

**Expected result:** Class says “in PostgreSQL tables we’ll create tomorrow.”

**Check:** Transfer Sheet entity names spoken aloud.

---

## Student Checkpoint

- [ ] Can explain whiteboard vs filing cabinet  
- [ ] Postgres running  
- [ ] Database created  
- [ ] `psql -d …` works  
- [ ] Ran `SELECT NOW();`  
- [ ] Knows `\dt` and `\q`  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Memory API only; no DB |
| **Ending state** | Empty Postgres DB ready for tables |

---

## Do Not Teach Yet

- CREATE TABLE details (Day 2)  
- Foreign keys (Day 3)  
- JOINs (Day 5)  
- SQLAlchemy  

---

## Next Day Bridge

Tomorrow we design **tables and types** for users and bikes — primary keys and NOT NULL — matching your Transfer Sheet fields.
