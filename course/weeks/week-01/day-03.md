# Day 3 — Problem → Solution → Scope

## Learning Objective

By the end of today, students can turn a problem into a **digital solution idea**, then **size it** for an 8-week course using:

- Too small / Appropriate / Too large / Outside course scope  
- **One-level-above** rule  
- **BASE now** vs **Enhance Later**

They leave with a **scoped solution paragraph** and two lists: BASE features vs Enhance Later — still no code.

---

## Materials

- Day 2 Observation Card #1 (required)
- “Scope Sorting” sheet (BASE | Enhance Later | Remove)
- Sticky notes (two colours: BASE / LATER)
- Printed mini reminder of [BASE-FEATURES.md](../../BASE-FEATURES.md) 10 capabilities (trainer poster OK)
- Fix-My-Ride BASE vs POSTPONE summary ([FIX-MY-RIDE.md](../../FIX-MY-RIDE.md))
- [QUALIFICATION.md](../../QUALIFICATION.md) “One-level-above” section for trainer reference

---

## PART 1 — THEORY (~1 hour)

### Concept

A **solution** answers: “How could a digital system reduce this pain?”  
**Scope** answers: “Which *part* of that solution will we finish in eight weeks?”

C-VERSE success is a **working base**, not a complete product vision.

```text
Problem (Day 2)
  → Solution idea (what digital help looks like)
  → Scope cut (BASE vs Enhance Later)
  → Ready for entities (Day 4)
```

---

### Simple Explanation

You want to travel from Chennai to Delhi.

- **Vision:** Comfortable trip, food, movies, hotel, sightseeing.  
- **Base trip for a beginner budget:** Valid train ticket + seat + arrive alive.  
- **Enhance later:** Hotel upgrades, tours, camera gear.

Students’ full ideas are the “sightseeing vacation”.  
This course ships the “ticket and arrival” — then they know how to grow.

Trainer line (say often):

> “We are not rejecting your idea. We are choosing which part you will finish in eight weeks so you leave with a working base — not half of everything.”

---

### Analogy

| Size | Example | Course fit |
|------|---------|------------|
| Too small | Only a static “About us” page for a shop | Not enough learning (no real process, CRUD, rules) |
| Appropriate | Track service bookings with status | Fits base features |
| Too large | Full multi-branch ERP + payments + SMS + AI | Cut / postpone |
| Outside scope | Hardware robot + mobile OS + ML research | Not this course even after cutting |

**One-level-above rule:**  
The project should stretch the student *slightly* — harder than a toy, easier than a company product.

If it feels trivial → grow one real workflow.  
If it feels terrifying → postpone features, keep the core workflow.

---

### Why our app needs this

Without scope:

- Week 2 UI tries to show 20 screens  
- Week 5 database has 15 tables  
- Week 8 demo is a graveyard of half-buttons  

With scope:

- Same **10 base features** every student practices  
- Personal words via Transfer Sheet  
- Pride at the end: “It works — and I know what to add next”

Fix-My-Ride reference cut:

| BASE | Enhance Later (examples) |
|------|---------------------------|
| Customer + Staff roles | Multi-branch org |
| Bikes + Bookings | Payments, SMS, AI diagnosis |
| Status: booked → in_progress → completed | GPS tracking, inventory |

Students mirror this *pattern of cutting*, not the bike domain.

---

### Small Example

**Problem (tuition fees):** Parents and admin argue about who paid.

**Solution (full vision):** Auto UPI reconciliation, WhatsApp receipts, analytics dashboard, multi-centre franchise reports, AI reminders…

**BASE for course:**

- Admin + Parent (or Student) roles  
- Student/fee-period records (owned item pattern)  
- Payment-status transaction with 3 statuses (e.g. due → partial → paid)  
- One rule: cannot mark paid without amount  
- Search by student name / status  

**Enhance Later:** UPI gateway, WhatsApp, franchise reports, AI.

---

### Important Terms

| Term | Plain meaning |
|------|----------------|
| Solution idea | How a digital system helps the problem |
| Scope | What is in / out for a time box (here: 8 weeks) |
| BASE | Must-build set for the course |
| Enhance Later | Valuable features postponed after Week 8 |
| Remove | Not needed for learning or problem |
| Modify | Same goal, simpler version |
| Too small | Not enough real process to teach base skills |
| Too large | Cannot finish honestly in 8 weeks |
| One-level-above | Slight stretch — not toy, not enterprise |
| MVP (plain talk) | Smallest useful working version — our BASE |

---

### Trainer Script

#### What to say (opening — 5 minutes)

> “Yesterday you wrote problems. Today we respect those problems by *not* trying to solve all of them at once.  
> Ambition is good. Unscoped ambition fails.  
> We will learn four labels: too small, appropriate, too large, outside course scope.  
> And we will practise the sentence you will hear until Week 8: **Base now, enhance later.**”

Board:

```text
KEEP · MODIFY · REMOVE · POSTPONE
```

#### What to show (15 minutes)

1. Show Fix-My-Ride **POSTPONE** list (payments, SMS, AI, GPS…).  
2. Show Fix-My-Ride **BASE** workflow in 4 arrows:

```text
Customer books (with existing bike)
  → Staff sees list
  → Status moves forward
  → History searchable
```

3. Point to [BASE-FEATURES.md](../../BASE-FEATURES.md) poster: “Every approved project must be able to learn these 10 — not 40 random features.”

#### What to ask (15 minutes)

Use one volunteer’s Day 2 problem (with permission):

1. “What would ‘fully solved forever’ include?” (capture wishlist on board)  
2. “Which of these are needed to prove the *core process* works digitally?”  
3. “Which are impressive but can wait?”  
4. “If we remove everything except X, is the project now *too small*?”  
5. “Does this sit one level above a beginner — or five levels above?”

#### Expected answers

Students should start sorting into BASE vs LATER with trainer coaching.  
Expect emotional attachment to fancy features — validate, then postpone.

#### Common confusion

| Confusion | What to do |
|-----------|------------|
| “Postpone means my idea is bad” | Rehearse non-rejection script |
| Keeping payments + SMS in BASE “because real apps have them” | “Real apps also had year 1 without them. Learn the spine first.” |
| Too-small: only login screen | “Add one owned item + one transaction + status.” |
| Turning course into mobile+ML+IoT | Mark Outside / Redesign |
| Different BASE for every student with unequal difficulty | Map all to same 10 base features |

#### Correction lines

> “Postpone is a compliment to your vision — it means there is a future.”

> “If a feature does not teach a base skill and is not required for the core process, it does not enter the eight weeks.”

> “Login alone is not a product. A tracked workflow with memory is.”

> “We judge fitness for learning, not commercial greatness.”

#### Live sorting demo (10 minutes)

Take “hospital app” shouted features from class. Sort publicly:

- Token status board → maybe BASE  
- Full EMR + insurance + pharmacy inventory → LATER / too large  
- Robot surgery → Outside  

Land the feeling: sorting is normal professional work.

#### Closing theory line

> “This afternoon you will cut your own idea. Be brave. A small working base beats a giant slide deck.”

---

## PART 2 — PRACTICAL (~1 hour)

### Starting Point

Each student has Observation Card #1 problem statement.  
Goal: produce Solution + Scope artifacts for Day 4 entities.

---

### Activity A — Solution in one paragraph (10 minutes)

Write **5–7 sentences**:

1. Who uses the digital system? (rough roles OK)  
2. What can they do in the first useful version?  
3. What status or progress becomes visible that was invisible before?  
4. What is explicitly *not* included yet?

Ban: framework names.

---

### Activity B — Feature brain dump (10 minutes)

Alone: write **12–20 feature ideas** on sticky notes (fast, messy).  
Include wild ideas — we will cut.

---

### Activity C — Scope Sorting (25 minutes)

On desk: three zones — **BASE** / **ENHANCE LATER** / **REMOVE**.

Rules for BASE stickies (trainer posts):

1. Supports the core process from the problem  
2. Helps learn at least one of the 10 base features  
3. Can be taught with max **2 roles**  
4. Can work with about **2–3 core entities** (+ users)  
5. Needs **one** status flow with **exactly 3** states for BASE  
6. No payments gateway / SMS provider / AI model required  

Students sort. Trainer circulates with stamp phrases: Keep / Modify / Postpone / Remove.

**Modify examples to offer:**

- “Live GPS tracking” → “Staff updates status manually”  
- “Many roles (manager, accountant, tech…)” → “Two roles only”  
- “Chat system” → “Notes field on transaction”  

---

### Activity D — Size label (10 minutes)

Student circles one:

- Too small  
- Appropriate  
- Too large (needs more postponing)  
- Outside course scope  

If **too small**: add one missing piece (usually transaction + status).  
If **too large**: move 3 more stickies to Enhance Later.  
If **outside**: switch to Card #2 seed with trainer help.

Write **one-level-above self-check**:

> “This will stretch me because __________, but I can finish because __________.”

---

### Activity E — Peer scope review (5 minutes)

Partner asks:

> “If you only finish BASE stickies, can you demo a full story: create → update status → search history?”

If no → BASE is incomplete; pull one sticky back from LATER or add a missing core.

---

## Student Checkpoint (5–10 questions)

1. What is the difference between solution and scope?  
2. Name the four size labels.  
3. What does “Enhance Later” mean?  
4. True or false: Postponing features means the idea was rejected.  
5. Give one example of modifying a feature to fit BASE.  
6. How many roles should BASE aim for in this course?  
7. How many status steps do we keep for BASE?  
8. What is the one-level-above rule in one sentence?  
9. Why can “login only” be too small?  
10. Quote the trainer promise line about not rejecting ideas (approximate OK).

**Suggested answers:** 1 Solution=how digital helps; Scope=what fits 8 weeks · 2 too small/appropriate/too large/outside · 3 After course · 4 False · 5 GPS→manual status · 6 Max 2 · 7 Exactly 3 · 8 Slight stretch · 9 No real workflow/entities · 10 Choosing which part to finish…

---

## Must Understand / Must Build

### Must Understand

- Problem → Solution → Scope sequence  
- BASE vs Enhance Later  
- Keep / Modify / Remove / Postpone  
- Size labels + one-level-above  
- Same 10 base features for every student project  

### Must Build

- Solution paragraph (no tech stack)  
- Sorted stickies (BASE / LATER / REMOVE)  
- Size label + self-check sentence  
- Revised problem statement if scope changed the story  

---

## Do Not Teach Yet

- Formal entity lists / ER (Day 4)  
- Transfer Sheet fill (Day 5 — draft fields OK if early finishers peek)  
- API design, DB normalisation  
- Auth implementation details  
- Coding of any kind  

---

## Trainer Watch-outs

- Students hiding huge features inside vague BASE words (“manage everything”) — force concrete stickies  
- Equalising ambition unfairly — different domains OK if same base patterns  
- Approving payments in BASE “just this once” — breaks pacing Weeks 6–8  
- Letting too-small projects slide — they will be bored by Week 4  
- Emotional shutdown after cutting — celebrate the Enhance Later list as a roadmap  

---

## Application State — End of Day

| Item | State |
|------|--------|
| Problem | Stable |
| Solution | Paragraph written |
| Scope | BASE vs Enhance Later sorted |
| Size | Labelled; adjusted if needed |
| Entities | Tomorrow |
| Transfer Sheet | Not signed |
| Code | None |

---

## Next Day Bridge

> “Tomorrow we name the **things** in your base world: entities, relationships, and actions.  
> I will demo Fix-My-Ride BASE: Customer/Staff, Bike, Booking, and status flow.  
> Then you draft the same *shapes* with *your* words.  
> Bring today’s BASE sticky set — those stickies become tomorrow’s nouns and verbs.”
