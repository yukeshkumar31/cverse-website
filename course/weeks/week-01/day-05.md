# Day 5 — Qualify + Transfer Sheet Sign-off

## Learning Objective

By the end of today, every student has a completed **Transfer Sheet** and a trainer decision: **APPROVED** / **APPROVED WITH MODIFICATIONS** / **REDESIGN REQUIRED** / **NOT SUITABLE**. The cohort is ready for Week 2 mock UI using their own words.

## Continuity

Days 1–4 built the thinking chain: application model → problem → scoped solution → entities/relationships/actions. Today we **freeze the BASE blueprint on paper**. No code until Monday.

---

## Materials

- Printed [TRANSFER-SHEET.md](../../TRANSFER-SHEET.md) (one per student — double-sided OK)
- Trainer copy of [QUALIFICATION.md](../../QUALIFICATION.md)
- [BASE-FEATURES.md](../../BASE-FEATURES.md) checklist poster
- Day 3 scope sort + Day 4 entity cards
- Sticky notes for last-minute Enhance Later moves
- Stamp or signature block for §10

---

## PART 1 — THEORY (~45–50 minutes)

### Concept

**Qualification** is not “is this a billion-dollar startup?”  
It is: “Can this idea teach the 10 base features as a working BASE in 8 weeks?”

```text
Idea + Day 4 drafts
  → Fill Transfer Sheet §§1–9
  → Trainer checklist (QUALIFICATION)
  → Decision + modifications
  → Signed sheet → Week 2
```

---

### Simple Explanation

The Transfer Sheet is a **translation dictionary**:

| Course pattern | Fix-My-Ride word | Your word |
|----------------|------------------|-----------|
| Owned item | Bike | e.g. Book / Course / Device |
| Transaction | Booking | e.g. Loan / Enrollment / Ticket |
| Statuses (3) | booked / in_progress / completed | your three labels |

Trainers teach Fix-My-Ride on the projector. Students type and label **their** names. Same steps every week.

---

### Analogy

Airline ticket vs vacation brochure.

- Transfer Sheet = ticket (what you will actually fly in 8 weeks)  
- Enhance Later list = brochure of future trips  
Both are valuable. Only the ticket gets you on the plane Monday.

---

### Why our app needs this

Without sign-off:

- Week 2 students invent new entities mid-UI  
- Week 5 schema fights Week 2 screens  
- Week 8 demos cannot be compared fairly  

With sign-off:

- Modifications are written once  
- “Enhance Later” protects ambition  
- Trainer can say “not on your sheet” when scope creeps  

---

### Decision meanings (say aloud)

| Decision | Meaning | Typical next step |
|----------|---------|-------------------|
| APPROVED | BASE clear | Start Week 2 as written |
| APPROVED WITH MODIFICATIONS | Keep idea; cut/rename | Note changes on §10; student updates sheet |
| REDESIGN REQUIRED | Problem OK; structure wrong | Rebuild entities/roles over weekend or Mon AM |
| NOT SUITABLE | Cannot teach Tier-1 BASE even after cutting | Switch to alternate problem card with trainer |

**Default stance:** APPROVED WITH MODIFICATIONS — not rejection.

Trainer promise line:

> “We are not rejecting your idea. We are choosing which part you will finish in eight weeks so you leave with a working base — not half of everything.”

---

### Qualification checklist (trainer — project on screen)

From [QUALIFICATION.md](../../QUALIFICATION.md), tick mentally while reviewing:

1. Real-world problem  
2. Identifiable users (max 2 roles for course)  
3. Clear digital solution  
4. ~2–3 core entities (+ users)  
5. At least one meaningful relationship  
6. Natural CRUD on owned item  
7. Transaction + status (exactly 3)  
8. ≥1 backend-worthy business rule  
9. Search/filter need  
10. Persist + full data-flow opportunity  
11. Beginner-feasible as BASE after cuts  

---

### Small Example — Approve with modifications

**Student idea:** “Hospital app with doctors, nurses, pharmacy, insurance, AI triage, patient app, billing…”

**Decision:** APPROVED WITH MODIFICATIONS  

**Modifications written on sheet:**

- Roles: Patient + Desk Staff only (postpone doctor portal)  
- Owned item: Patient visit card / token  
- Transaction: Queue ticket with status waiting → in_consult → done  
- Postpone: pharmacy, insurance, AI, multi-ward  

Same 10 base features; hospital words; bike-shop shapes.

---

### Important Terms

| Term | Plain meaning |
|------|----------------|
| Transfer Sheet | Official map from idea → BASE curriculum patterns |
| Qualification | Fitness check for 8-week learning |
| Modification | Keep idea; change scope/structure notes |
| Redesign | Rebuild the BASE structure before coding |
| Sign-off | Trainer signature; freeze for Week 2 start |

---

### Trainer Script

#### What to say (opening)

> “Today is paperwork that saves you. Boring? A little. Expensive to skip? Extremely.  
> Fill every section. Empty lines become confused code in Week 5.  
> I will walk the room. Most of you will hear: approved with modifications.”

#### What to show

1. Blank Transfer Sheet projected; fill **Fix-My-Ride** live in 8 minutes as the model answer.  
2. Point to §9 Enhance Later — “This list is your pride, not your failure.”  
3. Show §8 BASE checklist — every box must be plannable, not already built.

#### Clinic rules (for afternoon)

- 5–7 minutes per student max for decision talk  
- Write modifications in §10 **before** signing  
- If REDESIGN: schedule concrete rewrite task (entities only), not vague “think more”

#### Common confusion

| Confusion | Correction |
|-----------|------------|
| “I need 5 roles because real hospital…” | Max 2 for BASE; others → Enhance Later |
| Statuses: 6 pipeline stages | Collapse to 3 for BASE |
| Want payments in BASE | Postpone gateway; optional “paid” as status only if it *is* the workflow — prefer service-style 3-step |
| Sheet blank “because I’ll decide in code” | No — freeze nouns now |

#### Closing theory line

> “When you leave today, you should explain your base app in one minute with zero library names. That is the Week 1 success check.”

---

## PART 2 — PRACTICAL (~70 minutes)

### Starting Point

Entity cards, relationship sentence, scope lists, problem/solution paragraphs.  
Goal: completed Transfer Sheet + trainer decision.

---

### Activity A — Solo fill §§1–9 (25 minutes)

Silent fill. Trainer walks and stamps incomplete sections with sticky: “Need relationship sentence” / “Only 2 statuses — add third or collapse.”

**Hard rules while filling:**

- §2: max 2 roles  
- §3: exactly 3 status labels  
- §4: few fields (not novels)  
- §8: tick only what you *plan* for 8 weeks  
- §9: at least 3 Enhance Later items (ambition preserved)

---

### Activity B — Peer Transfer review (10 minutes)

Partner reads aloud §§3–5 only. Asks:

1. “Can I draw your entities from this?”  
2. “Is there a transaction with status?”  
3. “What is one illegal action your rule will block?”

Fix gaps before trainer queue.

---

### Activity C — Trainer sign-off clinic (30–35 minutes)

Queue students. For each:

1. Skim problem (10 sec)  
2. Check pattern map §3 (30 sec)  
3. Check relationship + rule (30 sec)  
4. Speak decision + write §10 notes  
5. Sign  

**Batch tip:** Call “anyone whose owned item is still named Bike but shouldn’t be” first — rename early.

**If behind time:** Sign APPROVED WITH MODIFICATIONS with a short note (“truncate fields on entity X; postpone chat”) and require student update over weekend.

---

### Activity D — One-minute pitch (optional if time)

Student stands and says:

> “Problem: … Users: … Base: create/list X, create Y, status A→B→C. Enhance later: …”

No React/Python/Postgres words allowed. Class applauds the cut, not the fantasy feature list.

---

## Student Checkpoint

1. What four trainer decisions exist?  
2. What is the default / preferred decision when the idea is good but large?  
3. How many status values for BASE?  
4. How many roles for BASE?  
5. What belongs in §9?  
6. True/false: Sign-off means you may not improve the idea after the course.  
7. Name two things that trigger REDESIGN REQUIRED.  
8. Why map to Fix-My-Ride patterns?  
9. Quote (approx) the non-rejection promise line.  
10. What is Monday’s first coding theme (Week 2)?

**Suggested answers:** 1 APPROVED / WITH MODIFICATIONS / REDESIGN / NOT SUITABLE · 2 WITH MODIFICATIONS · 3 Exactly 3 · 4 Max 2 · 5 Postponed features · 6 False — Enhance Later is after course · 7 No real transaction; outside scope even after cuts; etc. · 8 Shared curriculum steps · 9 Choosing which part to finish… · 10 JS rules + React mock UI…

---

## Must Understand / Must Build

### Must Understand

- Qualification ≠ commercial pitch  
- Transfer Sheet as rename map  
- Decision categories + modifications writing  
- Freeze BASE for coding weeks  

### Must Build

- Completed Transfer Sheet §§1–9  
- Trainer §10 decision + notes + signature  
- Updated entity/status/role names matching modifications  

---

## Do Not Teach Yet

- Vite/React setup  
- JavaScript syntax beyond mentioning “next week we code the status rule”  
- Database design  
- Auth implementation  

---

## Trainer Watch-outs

- Signing empty sheets “to be nice” — creates Week 4 pain  
- Letting payments/SMS/AI stay in §8  
- Different difficulty standards for friends vs quiet students — use the same checklist  
- NOT SUITABLE without offering an alternate seed problem  

---

## Application State — End of Day / End of Week 1

| Item | State |
|------|--------|
| Transfer Sheet | Signed (or redesign plan dated) |
| BASE vs Enhance Later | Frozen on paper |
| Entities / relationship / rules | Named |
| Code | Still none (correct) |
| Ready for Week 2? | Yes if APPROVED or APPROVED WITH MODIFICATIONS |

---

## Week 1 Success Check

Ask the room:

> “Can you explain your base app in one minute without saying any library name?”

If yes → Week 1 succeeded.  
If they only talk about React/Python → re-anchor on problem and entities before Week 2.

---

## Next Day Bridge (Week 2 Day 1)

> “Monday we open the editor. First code: your **status transition rule** in pure JavaScript — the same A→B→C you wrote on the Transfer Sheet.  
> Bring your signed sheet. Fix-My-Ride demo uses booked → in_progress → completed; you use *your* three words.  
> Still no backend. Still no database. Visible rules first.”
