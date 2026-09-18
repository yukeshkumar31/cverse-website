# Day 3 — README + Runbook

## Learning Objective

Students write a README that covers what the app does, stack, database setup, backend/frontend run commands, demo accounts, environment variables, and an Enhance Later section — sufficient for another developer to run locally.

## Continuity

UI is clearer. Today documentation becomes part of the product (BASE feature #10 starts here; GitHub push tomorrow).

---

## PART 1 — THEORY

### Trainer script

> “If only you can run it, it barely exists. README is the onboarding UI for developers. Include the boring commands. Link Enhance Later so ambition is recorded, not forgotten.”

### README outline (required sections)

1. Title + one-paragraph problem/solution  
2. Features (BASE only)  
3. Stack  
4. Demo accounts  
5. Setup — Database  
6. Setup — Backend  
7. Setup — Frontend  
8. Environment variables  
9. Project layout  
10. Enhance Later  

Model: `course/reference-app/fix-my-ride/README.md` and Week 7 increment README.

---

## PART 2 — PRACTICAL

---

### Step 1 — Draft features list from BASE checklist

**Why:** Honest scope.

**File:** `README.md` (project root)

**Code:** Bullet the 10 capabilities as implemented with *their* nouns.

**Explain:** Do not list postponed features as done.

**Run:** Peer reads; marks anything untrue.

**Expected result:** Accurate feature list.

**Check:** Auth + roles + status + filter + persist mentioned.

---

### Step 2 — Setup commands

**Why:** Reproducibility.

**File:** README.md

**Code:** (adapt paths)

```markdown
## Setup

### Database
createdb myapp
psql -d myapp -f db/schema.sql

### Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev
```

**Explain:** Note OS differences briefly (Windows activate).

**Run:** Partner follows README on a clean terminal (trust exercise).

**Expected result:** Partner hits at least `/health` using only README.

**Check:** Fix gaps immediately.

---

### Step 3 — .env.example

**Why:** Secrets pattern.

**File:** `backend/.env.example`

**Code:**

```text
DATABASE_URL=postgresql+psycopg://localhost:5432/myapp
SECRET_KEY=change-me-in-real-deploy
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Explain:** Real `.env` gitignored.

**Run:** Confirm `.gitignore` has `.env`.

**Expected result:** Example only in git.

**Check:** No real passwords in README.

---

### Step 4 — Demo accounts + Enhance Later

**Why:** Demo + future map.

**File:** README.md

**Code:**

```markdown
## Demo accounts
| Email | Password | Role |
|-------|----------|------|
| ... | ... | customer |
| ... | ... | staff |

## Enhance Later
1. ...
2. ...
(from Transfer Sheet §9, refined)
```

**Explain:** At least 5 Enhance Later items.

**Run:** Align with Week 1 sheet.

**Expected result:** Ambition preserved on paper.

**Check:** None of these are required for Friday demo.

---

### Step 5 — Optional architecture blurb

**Why:** Narration aid.

**File:** README.md

**Code:**

```text
User → React (Vite) → FastAPI → SQLAlchemy → PostgreSQL
```

**Explain:** Same diagram as course overview.

**Run:** Student explains aloud from README.

**Expected result:** 30-second architecture story.

**Check:** Trainer listens for layer confusion.

---

## Student Checkpoint

- [ ] README has all required sections  
- [ ] Partner could follow setup partially/fully  
- [ ] `.env.example` exists; `.env` ignored  
- [ ] Demo accounts listed  
- [ ] Enhance Later ≥5  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Working app, weak docs |
| **Ending state** | Runnable documented project |

---

## Do Not Teach Yet

- CI/CD pipelines  
- Docker Compose unless already in use  
- GitHub Pages deploy requirements  

---

## Next Day Bridge

Tomorrow we **push to GitHub**, clean the repo (no `node_modules`, no `.venv`, no `.env`), and submit the link.
