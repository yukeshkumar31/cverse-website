# Day 5 — Final Demos + Enhance Later + Course Close

## Learning Objective

Students deliver a live BASE demo from their script, narrate the full application data flow, present an Enhance Later backlog, and leave with a signed sense of completion against the 10 base features.

## Continuity

Repo is live. Today is performance and closure — not feature creep.

**Trainer reference:** `course/reference-app/fix-my-ride/` for comparison demos only.

---

## PART 1 — THEORY / CEREMONY

### Trainer script (opening)

> “You will show a working base — not a fantasy pitch deck.  
> One customer story. One staff story. One sentence about what comes after.  
> If something breaks, narrate the debug ladder. That is also skill.”

### Rubric focus ([assessment-rubric.md](../../instructor/assessment-rubric.md) if used)

- Base features present  
- Rules enforced on backend  
- Two roles differ  
- Persist + full stack  
- README + GitHub  
- Clarity of explanation  

### Enhance Later framing

> “Enhance Later is your roadmap, not your apology. The course succeeded if you can grow from a spine.”

---

## PART 2 — PRACTICAL (DEMO DAY)

---

### Step 1 — Pre-demo warm boot (morning)

**Why:** Avoid cold-start fails.

**File:** none

**Code:** Each student starts Postgres, API, Vite; logs in both roles once; advances one booking to reset a clean demo row if needed.

**Explain:** Seed data ready; script on desk.

**Run:** 15 minutes silent prep.

**Expected result:** Green happy path.

**Check:** Trainer triage only blockers.

---

### Step 2 — Live demos (timed)

**Why:** Assessment + pride.

**File:** DEMO.md

**Code:** Student follows script; trainer times (~3 minutes + 1 minute Q&A).

**Explain:** Projector; zoom Network tab only if asked.

**Run:** Round-robin or stations.

**Expected result:** Most students complete script.

**Check:** Note incomplete base features for remediation list — not public shaming.

---

### Step 3 — Narration prompt (required)

**Why:** Understanding > memorized clicks.

**File:** none

**Ask:**

> “Trace what happens when staff clicks Advance status — from button to database and back.”

**Expected answer shape:**

```text
Click → fetch PATCH + Bearer token → FastAPI route → role check → transition rule
  → SQLAlchemy UPDATE → PostgreSQL → JSON → React reloads list
```

**Check:** Student uses their entity names.

---

### Step 4 — Enhance Later share (30–60 seconds)

**Why:** Honor Week 1 vision.

**File:** README § Enhance Later / Transfer Sheet §9

**Code:** Speak top 3 future features and why they waited.

**Explain:** Tie to “base now, enhance later.”

**Run:** After demo or as closing slide.

**Expected result:** Clear postpone rationale.

**Check:** None sneak into “we almost built it.”

---

### Step 5 — Personal checklist tick

**Why:** Closure against curriculum.

**File:** printed [BASE-FEATURES.md](../../BASE-FEATURES.md)

**Code:** Student self-ticks 1–10; trainer confirms.

**Explain:** Any gap → weekend remediation plan with specific endpoint/UI.

**Run:** Sign course completion form if used.

**Expected result:** Honest ticks.

**Check:** GitHub URL attached.

---

### Step 6 — Course closing circle

**Why:** Reinforce process.

**Trainer final lines:**

> “Problem → scope → entities → UI → API → database → integrate → auth → ship.  
> Fix-My-Ride was the reference. Your app is yours.  
> Keep the spine. Grow the vision after.”

Optional: show trainer Fix-My-Ride reference one last time beside a student app — same shapes, different words.

---

## Student Checkpoint (end of course)

- [ ] Live demo completed  
- [ ] Data-flow narration completed  
- [ ] Enhance Later presented  
- [ ] 10 base features addressed  
- [ ] GitHub + README submitted  
- [ ] Knows how to run app next month  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Documented repo |
| **Ending state** | Demoed, assessed, BASE complete |

---

## Do Not Teach Yet

- Literally anything new — course over  
- If early: help peers, improve README screenshots, write a short “what I learned” note  

---

## Next Day Bridge

> There is no Day 6 in the course.  
> Next step lives on their Enhance Later list — built on the BASE they shipped today.
