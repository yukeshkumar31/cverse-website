# Day 1 — Bug Bash + Demo Script

## Learning Objective

Students find and fix **blocking** bugs in their BASE app, write a timed **demo script** (customer path + staff path), and freeze a “will not fix this week” list.

## Continuity

Week 7 auth works. Week 8 does not add features — it makes the existing story reliable.

---

## PART 1 — THEORY

### Trainer script

> “A demo fails for boring reasons: wrong terminal, expired token, empty DB, CORS, typo in status string. Today we hunt blockers and write the path we will walk on Friday — so nerves do not improvise.”

### Severity triage

| Severity | Meaning | Week 8 action |
|----------|---------|---------------|
| Blocker | Demo cannot proceed | Fix today/tomorrow |
| Major | Confusing but workaround | Fix if time |
| Polish | Ugly | Day 2 |
| Enhance | New capability | Backlog only |

### Demo script skeleton (Fix-My-Ride)

```text
1. Login customer@demo.com
2. Show bikes / add bike if needed
3. Create booking (status booked)
4. Logout
5. Login staff@demo.com
6. Filter/search bookings
7. Advance booked → in_progress → completed
8. Logout; login customer; show completed history
9. One sentence: Enhance Later item we did NOT build
```

Students rewrite with their nouns.

---

## PART 2 — PRACTICAL

---

### Step 1 — Fresh machine checklist

**Why:** Catch env issues early.

**File:** student checklist sheet

**Code:** Walk:

1. Postgres up; DB exists  
2. `.env` present; not committed  
3. `uvicorn` + `npm run dev`  
4. `/health` OK  
5. Login both roles  

**Explain:** If any step fails, it is today’s bug.

**Run:** Pair verification.

**Expected result:** Green path or named blocker.

**Check:** Trainer board of blockers.

---

### Step 2 — Bug bash (45 minutes)

**Why:** Stabilize.

**File:** app code only as needed

**Code:** Fix blockers only — auth 401 loops, status map typos, missing CORS, create booking without bikes, staff 403 on status.

**Explain:** No new pages. No payments.

**Run:** Re-test after each fix.

**Expected result:** Happy path works twice in a row.

**Check:** Second run without trainer help.

---

### Step 3 — Write demo script (timed)

**Why:** Friday calm.

**File:** `DEMO.md` or paper

**Code:** 8–12 numbered steps; include exact demo emails; note sample registration number.

**Explain:** Keep under 3 minutes speaking time.

**Run:** Partner times a dry run.

**Expected result:** Script exists; dry run < 4 minutes.

**Check:** Script uses Transfer Sheet words.

---

### Step 4 — Won’t-fix list

**Why:** Stop thrash.

**File:** bottom of DEMO.md

**Code:** Bullet 3–5 known polish issues deferred.

**Explain:** Honesty > pretend perfection.

**Run:** Trainer initials.

**Expected result:** Scope frozen.

**Check:** No Enhance Later items disguised as “bugs.”

---

## Student Checkpoint

- [ ] Happy path twice  
- [ ] Demo script written  
- [ ] Blockers cleared or escalated  
- [ ] Won’t-fix list short  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Feature-complete-ish Week 7 app |
| **Ending state** | Stable demo path + script |

---

## Do Not Teach Yet

- README polish (Day 3)  
- GitHub publish (Day 4)  
- New endpoints  

---

## Next Day Bridge

Tomorrow we polish **UX only**: labels, empty states, error text, light layout — still no new features.
