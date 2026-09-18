# Day 4 — Role Rules (Customer vs Staff)

## Learning Objective

Students enforce BASE role differences: customers own their bikes/bookings; only customers create bookings; only staff update status; staff can list all bookings.

## Continuity

Day 3 authenticated everyone equally. Today authorization splits the two Transfer Sheet roles.

---

## Theory + Trainer Script

### Trainer script

> “Same endpoint, different eyes. A customer listing bookings should not see the whole shop. Staff must. Status changes are staff work in Fix-My-Ride BASE.”

### Rules matrix (Fix-My-Ride)

| Action | Customer | Staff |
|--------|----------|-------|
| Register/login | ✓ | ✓ |
| CRUD own bikes | ✓ | view as needed / optional |
| Create booking | ✓ | ✗ (403) |
| List bookings | own only | all |
| PATCH status | ✗ | ✓ |

Students map Primary user / Staff labels to these behaviors.

### require_staff helper

```python
def require_staff(user: User = Depends(get_current_user)) -> User:
    if user.role != "staff":
        raise HTTPException(status_code=403, detail="Staff only")
    return user
```

### Analogy

Customer wristband opens personal locker. Staff wristband opens the workshop board.

---

## Practical — Incremental Steps

---

### Step 1 — require_staff

**Why:** Reusable 403.

**File:** `auth.py`

**Code:** Add `require_staff` as above.

**Explain:** 401 = not logged in; 403 = logged in but forbidden.

**Run:** Import.

**Expected:** OK.

**Check:** Quiz status codes.

---

### Step 2 — Scope bike list/create/delete

**Why:** Ownership.

**File:** `routers_bikes.py`

**Code:**

```python
@router.get("")
def list_bikes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Bike)
    if user.role != "staff":
        q = q.filter(Bike.owner_id == user.id)
    return q.order_by(Bike.id).all()


@router.post("", status_code=201)
def create_bike(payload: BikeCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role != "customer":
        raise HTTPException(403, "Only customers register bikes in BASE")
    # owner_id = user.id ...
```

Adjust if Transfer Sheet allows staff to add items — stay consistent with sheet.

**Explain:** Say the rule aloud from the student’s sheet.

**Run:** Login as customer vs staff; compare GET `/bikes`.

**Expected:** Different lists.

**Check:** Customer cannot see another customer’s bike.

---

### Step 3 — Booking create + list scoping

**Why:** Transaction rules.

**File:** `routers_bookings.py`

**Code:**

```python
@router.get("")
def list_bookings(..., user: User = Depends(get_current_user)):
    query = db.query(Booking).options(joinedload(Booking.bike))
    if user.role != "staff":
        query = query.filter(Booking.customer_id == user.id)
    # status / q filters...
    return ...


@router.post("", status_code=201)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role != "customer":
        raise HTTPException(403, "Only customers can create bookings")
    bike = db.get(Bike, payload.bike_id)
    if not bike:
        raise HTTPException(400, "Bike does not exist")
    if bike.owner_id != user.id:
        raise HTTPException(400, "You can only book your own bike")
    # create with customer_id=user.id
```

**Explain:** Own-bike check is a second business rule — keep it.

**Run:** Staff POST booking → 403. Customer books own bike → 201. Customer tries other’s bike → 400.

**Expected:** Matrix holds.

**Check:** Pair: try to break as the other role.

---

### Step 4 — Staff-only status PATCH

**Why:** Workflow ownership.

**File:** `routers_bookings.py`

**Code:**

```python
@router.patch("/{booking_id}/status")
def update_status(
    booking_id: int,
    payload: BookingStatusUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if user.role != "staff":
        raise HTTPException(403, "Only staff can update booking status")
    # existing transition rules...
```

Or `user: User = Depends(require_staff)`.

**Explain:** Transition rules still apply after role check.

**Run:** Customer PATCH → 403. Staff legal PATCH → 200. Staff illegal → 400.

**Expected:** Role + rule both enforced.

**Check:** Order of checks: auth → role → transition.

---

### Step 5 — Seed both demo accounts

**Why:** Friday demos.

**File:** startup seed or register twice

**Code:** Ensure `customer@demo.com` and `staff@demo.com` / `demo1234` exist with hashed passwords (see increment seed/startup).

**Explain:** Document on README for Week 8.

**Run:** Login both; show contrasting booking lists.

**Expected:** Two role stories.

**Check:** Passwords never printed in UI.

---

## Checkpoint

- [ ] 401 vs 403 understood  
- [ ] Customer scoped lists  
- [ ] Staff sees all bookings  
- [ ] Only staff PATCHes status  
- [ ] Only customer creates booking (or sheet-consistent variant)  
- [ ] Own-bike rule on create  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Authenticated but flat permissions |
| **Ending state** | Role-differentiated BASE API |

---

## Do Not Teach Yet

- React login wiring (Day 5)  
- Fine-grained permissions / org trees  
- Refresh tokens  

---

## Next Day Bridge

Tomorrow the React app gains a **login screen**, stores the JWT, sends `Authorization` on every `api()` call, and shows/hides status buttons by role.
