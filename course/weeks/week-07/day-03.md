# Day 3 — Protect Routes with get_current_user

## Learning Objective

Students decode JWTs, implement `get_current_user`, require `Authorization: Bearer` on bikes/bookings routes, and prove that missing/invalid tokens return **401**.

## Continuity

Login issues tokens. Today tokens become mandatory for core APIs. Role-specific 403 rules deepen tomorrow.

---

## Theory + Trainer Script

### Trainer script

> “A token in your notes is useless until the API checks it. `Depends(get_current_user)` runs before your route body. No valid user → request dies with 401.”

### Flow

```text
Request header: Authorization: Bearer eyJ...
  → OAuth2PasswordBearer extracts token
  → jwt.decode with SECRET_KEY
  → load User by sub
  → inject user into route
```

### Analogy

Bouncer checks wristband signature and expiry before you enter the workshop floor.

---

## Practical — Incremental Steps

---

### Step 1 — get_current_user

**Why:** Shared dependency.

**File:** `backend/app/auth.py`

**Code:**

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_error
    except JWTError as exc:
        raise credentials_error from exc

    user = db.get(User, int(user_id))
    if user is None:
        raise credentials_error
    return user
```

**Explain:** Note: `tokenUrl` helps Swagger authorize; if login is JSON-body not form, Swagger auth UX may need a tweak — curl still works. Keep BASE simple.

**Run:** Import successfully.

**Expected:** No errors.

**Check:** Expired/garbage token path raises 401.

---

### Step 2 — Require user on GET/POST bikes

**Why:** Stop anonymous creates.

**File:** `routers_bikes.py`

**Code:**

```python
from app.auth import get_current_user
from app.models import User

@router.get("", response_model=list[BikeOut])
def list_bikes(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    # temporary: return all or filter tomorrow
    return db.query(Bike).order_by(Bike.id).all()


@router.post("", response_model=BikeOut, status_code=201)
def create_bike(
    payload: BikeCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    bike = Bike(
        owner_id=user.id,  # no more owner_id=1 from client
        make=payload.make,
        model=payload.model,
        registration_number=payload.registration_number,
    )
    db.add(bike)
    db.commit()
    db.refresh(bike)
    return bike
```

Remove `owner_id` from client schema if present.

**Explain:** Identity comes from token, not JSON body trust.

**Run:** GET `/bikes` without token → 401. With Bearer → 200.

**Expected:** Swagger lock icon / curl `-H "Authorization: Bearer …"`.

**Check:** Create bike; `owner_id` equals logged-in user id.

---

### Step 3 — Protect bookings the same way

**Why:** Consistent API.

**File:** `routers_bookings.py`

**Code:** Add `user: User = Depends(get_current_user)` to list/create/patch. For create:

```python
booking = Booking(
    customer_id=user.id,
    bike_id=payload.bike_id,
    service_type=payload.service_type,
    notes=payload.notes,
    status="booked",
)
```

**Explain:** Drop client-supplied `customer_id`.

**Run:** Unauthed POST → 401; authed → 201.

**Expected:** Bookings tied to token user.

**Check:** Week 6 React will break until Day 5 — expected; use `/docs` today.

---

### Step 4 — Curl cheat sheet

**Why:** Muscle memory.

**File:** student notes

**Code:**

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@demo.com","password":"demo1234"}' | jq -r .access_token)

curl http://localhost:8000/bikes -H "Authorization: Bearer $TOKEN"
```

**Explain:** Without `jq`, copy token manually from login JSON.

**Run:** Commands.

**Expected:** 200 list.

**Check:** Typo in Bearer → 401.

---

## Checkpoint

- [ ] `get_current_user` implemented  
- [ ] Bikes/bookings require token  
- [ ] 401 without token  
- [ ] `owner_id` / `customer_id` from user, not body  
- [ ] Can demo with curl or `/docs`  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Public CRUD |
| **Ending state** | Authenticated CRUD (roles still coarse) |

---

## Do Not Teach Yet

- Staff-only PATCH (Day 4)  
- Customer-only booking visibility (Day 4)  
- React Bearer header (Day 5)  

---

## Next Day Bridge

Tomorrow we add **authorization**: customers manage own bikes and bookings; only staff update status; staff see all bookings.
