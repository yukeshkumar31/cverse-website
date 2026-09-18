# Base Features — What Every App Must Ship

These 10 capabilities are the **shared curriculum**.  
Every student application must have them working by the end of Week 8.

```text
1. Users can register / login (simple auth)
2. At least 2–3 core entities with CRUD
3. At least one relationship between entities
4. One status / workflow change
5. At least one business rule enforced on the backend
6. Search or filter on one important list
7. Data persists in PostgreSQL
8. React ↔ FastAPI via REST/JSON (full round trip)
9. Basic role difference (max 2 roles)
10. Project on GitHub with a README
```

## Pattern map (teach patterns, not only bike words)

| # | Pattern | Fix-My-Ride example | Other idea example |
|---|---------|---------------------|--------------------|
| 1 | Auth | Register/login as Customer or Staff | Same |
| 2 | Entity A CRUD | Customers / profile | Students, patients |
| 3 | Entity B CRUD | Bikes | Courses, products |
| 4 | Transaction CRUD | Bookings | Enrollments, orders |
| 5 | Relationship | Bike → Customer; Booking → Bike | Order → Product |
| 6 | Status flow | booked → in_progress → completed | pending → active → done |
| 7 | Business rule | Need a bike before booking | Need stock before order |
| 8 | Search/filter | Bookings by status / bike no. | Orders by status |
| 9 | Roles | Customer vs Staff | Student vs Admin |
| 10 | Persist + GitHub | PostgreSQL + repo | Same |

## Minimum data shape (conceptual)

```text
User (email, password_hash, role)
  └── owns → Item (e.g. Bike)
        └── used in → Transaction (e.g. Booking + status)
```

## Do not add artificial features

Only include a feature if it naturally belongs to the student's problem **and** teaches a base skill.  
If the idea is too large: **cut scope**, do not invent fake entities.

## End-of-course checklist (trainer)

- [ ] Register + login works
- [ ] Two roles behave differently
- [ ] CRUD works for core entities
- [ ] Relationship visible in UI and DB
- [ ] Status can change with valid transitions only
- [ ] At least one backend rule returns a clear error
- [ ] Search/filter works
- [ ] Restart app → data still there
- [ ] Student can explain the full data flow
- [ ] Repo on GitHub with README + Enhance Later list
