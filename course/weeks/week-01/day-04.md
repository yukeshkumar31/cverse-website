# Day 4 — Entities, Relationships, Actions

## Learning Objective

By the end of today, students can name the **things** in their BASE world: entities (with a few fields), one clear **relationship**, and the **actions** users take. They map Fix-My-Ride patterns (Customer/Staff, Bike, Booking, status flow) onto their Transfer Sheet words — still without code.

## Continuity

Day 3 produced a scoped solution: BASE stickies vs Enhance Later, size label, solution paragraph. Those stickies become today’s nouns and verbs. Tomorrow we qualify and sign the Transfer Sheet.

---

## Materials

- Day 3 BASE sticky set (required)
- Printed [FIX-MY-RIDE.md](../../FIX-MY-RIDE.md) entity table (trainer poster OK)
- Blank entity cards (Entity | Fields | Who creates | Who updates)
- Relationship sentence worksheet
- [TRANSFER-SHEET.md](../../TRANSFER-SHEET.md) §§3–6 for early drafts (sign-off is Day 5)
- [BASE-FEATURES.md](../../BASE-FEATURES.md) pattern map

---

## PART 1 — THEORY (~1 hour)

### Concept

An **entity** is a thing the app remembers as a row of data.  
A **relationship** says how two entities connect.  
An **action** is what a role is allowed to do to an entity (create, list, update status…).

```text
Day 3 BASE stickies
  → Nouns = entities
  → “Belongs to / has many” = relationships
  → Verbs = actions
  → Ready for Transfer Sheet (Day 5)
```

---

### Simple Explanation

In a bike shop notebook you do not write “everything about the shop” on one page. You have:

- People (who is asking for service)
- Bikes (what they own)
- Bookings (service jobs with a status)

Same idea for every student project: **people + owned item + transaction**.

---

### Analogy

| Pattern | Fix-My-Ride | Library idea | Tuition idea |
|---------|-------------|--------------|--------------|
| Primary user | Customer | Member | Parent / Student |
| Staff role | Staff | Librarian | Admin |
| Owned item | Bike | Book | Fee period / Student record |
| Transaction | Booking | Loan | Payment status record |
| Status (3) | booked → in_progress → completed | borrowed → overdue → returned | due → partial → paid |

Trainer line:

> “Different shops. Same shapes. We teach shapes.”

---

### Why our app needs this

Without named entities:

- Week 2 invents random screens  
- Week 4 invents random tables  
- Week 8 cannot explain the data flow  

With entities:

- Same 10 base features map cleanly  
- Transfer Sheet stays honest  
- Coding days rename fields — they do not redesign architecture mid-course  

---

### Fix-My-Ride BASE demo (live on board)

Draw this and leave it up all day:

```text
users (Customer | Staff)
   │
   ├── owns many → bikes
   │                 │
   └── creates ──────┴──→ bookings
                          status: booked → in_progress → completed
```

**Entities & fields (BASE — keep few):**

| Entity | Fields |
|--------|--------|
| User | email, password, full_name, role |
| Bike | make, model, registration_number, owner (user) |
| Booking | bike, customer, service_type, status, notes |

**Relationship sentence (model for students):**

> “Each booking belongs to one bike and one customer. Each bike belongs to one customer. A customer can have many bikes and many bookings.”

**Actions by role:**

| Role | Actions (BASE) |
|------|----------------|
| Customer | Register/login; manage own bikes; create booking; view/search own bookings |
| Staff | Login; see all bookings; update status; search bookings |

**Business rule examples:**

1. Cannot create a booking without an existing bike.  
2. Status may only move `booked → in_progress → completed` (no skip).  

---

### Important Terms

| Term | Plain meaning |
|------|----------------|
| Entity | A named thing we store (table / object type) |
| Field / attribute | One fact about an entity (make, status) |
| Relationship | How two entities link (belongs to, has many) |
| Primary user | The “customer-like” role who owns items |
| Owned item | Thing the primary user manages (Bike pattern) |
| Transaction | Process record with status (Booking pattern) |
| Action | Create / list / update / change status |
| Cardinality (simple) | One-to-many: one customer → many bikes |

---

### Trainer Script

#### What to say (opening — 5 minutes)

> “Yesterday you cut scope. Today we name the furniture in the room.  
> If you cannot name the things, you cannot build the app.  
> I will show Fix-My-Ride once. Then you draft *your* nouns — not Hari’s bike shop.”

#### What to show (20 minutes)

1. Walk Customer → Bike → Booking story in three sentences.  
2. Point to status arrows; ask “Can booked jump to completed?” Expect **no**.  
3. Count entities: users + bikes + bookings = three. Say “BASE aims for about this many — not fifteen tables.”  
4. Show Enhance Later list from Fix-My-Ride: payments, SMS, AI — “Those are not entities for Week 1–8.”

#### What to ask (15 minutes)

Pick one volunteer’s BASE stickies (permission):

1. “Which sticky is a *person*?”  
2. “Which sticky is a *thing they own*?”  
3. “Which sticky is a *job / request / order* that changes status?”  
4. “Say the relationship in one sentence.”  
5. “If you have five entities, which two can wait until Enhance Later?”

#### Expected answers

Students should land on the pattern map even if words differ. Push toward **exactly 3 statuses** and **max 2 roles**.

#### Common confusion

| Confusion | What to do |
|-----------|------------|
| Listing screens as entities (“Dashboard”, “Login page”) | “Those are screens. Entities are *data nouns*.” |
| Separate tables for every tiny field | Merge into User / Item / Transaction |
| Many-to-many early (tags, multi-tech assignment) | Postpone; keep one FK path |
| Status as its own entity table | For BASE, status is a **field** with 3 allowed values |
| Copying “Bike” when their domain is books | Celebrate rename — punish only pattern drift |

#### Correction lines

> “Login is an action on User — not a separate entity called Login.”

> “If it does not need a row in a database, it is probably not an entity for BASE.”

> “One relationship sentence beats a fancy diagram you cannot explain.”

#### Closing theory line

> “This afternoon: entity cards, one relationship sentence, action list by role. Bring them tomorrow for Transfer Sheet sign-off.”

---

## PART 2 — PRACTICAL (~1 hour)

### Starting Point

Each student has Day 3 BASE stickies + solution paragraph.  
Goal: draft entities/relationships/actions ready to paste into Transfer Sheet §§3–6 tomorrow.

---

### Activity A — Sticky → noun hunt (10 minutes)

Sort BASE stickies into three piles:

1. **People / roles**  
2. **Things owned or managed**  
3. **Process / job / order (with status)**  

Anything left: move to Enhance Later or merge into a field (e.g. “phone” → User field).

---

### Activity B — Entity cards (20 minutes)

Fill **2–3 cards** (plus User if not already counted):

```text
ENTITY: ________________
Fields (3–6 max): ________________
Who creates it? ________________
Who updates it? ________________
CRUD this week-plan: Create / List / Update / Delete? (circle)
```

**Fix-My-Ride reference card (trainer):**

```text
ENTITY: Bike
Fields: make, model, registration_number, owner_id
Who creates: Customer
Who updates: Customer (own bikes)
CRUD: Create, List, Update, Delete (optional delete)
```

```text
ENTITY: Booking
Fields: bike_id, customer_id, service_type, status, notes
Who creates: Customer
Who updates status: Staff
CRUD: Create, List, Update status (not free-form edit of history)
```

Students must not invent a fourth core entity unless trainer agrees it replaces one of the three patterns.

---

### Activity C — Relationship sentence (10 minutes)

Write **exactly one** sentence in this template:

> “Each ________ belongs to one ________. Each ________ can have many ________.”

Example (Fix-My-Ride):  
“Each booking belongs to one bike and one customer. Each customer can have many bikes and many bookings.”

Peer check: partner should be able to draw the arrows from the sentence alone.

---

### Activity D — Actions by role (10 minutes)

Two columns: Primary user | Staff/Admin.

List **verbs only** (register, add bike, create booking, mark in_progress…).  
Cross out verbs that need Enhance Later (pay invoice, send WhatsApp…).

---

### Activity E — Rules draft (10 minutes)

Write at least **one** rule that the backend will enforce later:

- “Cannot create X without existing Y”  
- “Status may only move A → B → C”  

Say the illegal example out loud: “booked → completed must fail.”

---

## Student Checkpoint (5–10 questions)

1. What is an entity in plain words?  
2. Name Fix-My-Ride’s three core data nouns (besides listing every field).  
3. What is the BASE status path for Fix-My-Ride?  
4. Give one invalid status jump.  
5. What is the difference between an entity and a screen?  
6. How many roles should BASE keep?  
7. Write a relationship sentence for Fix-My-Ride (or your project).  
8. Who updates booking status in Fix-My-Ride BASE?  
9. Why is “payment gateway” not an entity for Week 1?  
10. What will you paste into the Transfer Sheet tomorrow?

**Suggested answers:** 1 Thing we store · 2 User, Bike, Booking · 3 booked→in_progress→completed · 4 booked→completed · 5 Data vs UI · 6 Max 2 · 7 Booking belongs to bike+customer… · 8 Staff · 9 Enhance Later / external service · 10 Entities, relationship, rules, renamed patterns…

---

## Must Understand / Must Build

### Must Understand

- Entity / field / relationship / action  
- Owned-item + transaction patterns  
- Status as a field with 3 values (BASE)  
- Same shapes, different words  

### Must Build

- 2–3 entity cards with few fields  
- One relationship sentence  
- Action list for 2 roles  
- ≥1 business rule draft  

---

## Do Not Teach Yet

- ER diagram notation (crow’s foot deep dive)  
- Normalisation theory beyond “don’t duplicate needlessly”  
- SQL types, PKs/FKs formal syntax (Week 4)  
- Transfer Sheet formal sign-off (Day 5)  
- Any coding  

---

## Trainer Watch-outs

- Students smuggling Enhance Later entities back in  
- “God” entity with 20 fields — force cut to 3–6  
- No transaction entity (only a static list) — too small; add status workflow  
- Relationship sentence that says nothing (“everything is related”)  

---

## Application State — End of Day

| Item | State |
|------|--------|
| Problem / solution / scope | From Day 3 |
| Entities | Drafted on cards |
| Relationship | One sentence |
| Actions + rules | Drafted |
| Transfer Sheet | Not signed yet |
| Code | None |

---

## Next Day Bridge

> “Tomorrow we **qualify** the project and fill the Transfer Sheet end to end.  
> Bring entity cards, relationship sentence, BASE vs Enhance Later lists, and Day 3 solution paragraph.  
> Default trainer decision is **APPROVED WITH MODIFICATIONS** — we keep your idea and cut complexity, we do not shame ambition.”
