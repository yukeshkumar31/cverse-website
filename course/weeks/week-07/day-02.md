# Day 2 — Register, Login, Issue JWT

## Learning Objective

Students implement `POST /auth/register` and `POST /auth/login`, create JWT access tokens containing user id + role, and obtain a token from `/docs` or curl.

## Continuity

Day 1 hashing works. Today identity becomes an HTTP feature. Protecting other routes is Day 3.

---

## Theory + Trainer Script

### Trainer script

> “Login checks email+password. If valid, we hand out a signed **token** — like a wristband. Later requests show the wristband. The server verifies the signature with SECRET_KEY; it does not re-check the password every time.”

### JWT (BASE-simple)

```text
Header.Payload.Signature
Payload includes: sub (user id), role, exp
```

### Endpoints

| Method | Path | Result |
|--------|------|--------|
| POST | `/auth/register` | Create user (hashed password) |
| POST | `/auth/login` | `{ access_token, token_type, user }` |

### Analogy

Register = get a locker. Login = get a wristband for the night. Wristband expires (`exp`).

---

## Practical — Incremental Steps

---

### Step 1 — Settings for JWT

**Why:** Central secret + expiry.

**File:** `backend/app/config.py`

**Code:**

```python
from pydantic_settings import BaseSettings  # or your existing settings style

class Settings(BaseSettings):
    database_url: str
    secret_key: str = "cverse-dev-secret-change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"

settings = Settings()
```

Adapt to whatever Week 5 already used for `DATABASE_URL`.

**Explain:** HS256 is fine for course BASE.

**Run:** Import settings.

**Expected:** Secret loads from env.

**Check:** Not hardcoding production secrets in git.

---

### Step 2 — create_access_token

**Why:** Issue wristbands.

**File:** `backend/app/auth.py`

**Code:**

```python
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.config import settings


def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload = {"sub": str(user_id), "role": role, "exp": expire}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)
```

**Explain:** `sub` is commonly a string subject id.

**Run:** Call from a scratch print once.

**Expected:** Long dotted token string.

**Check:** Three segments separated by `.`.

---

### Step 3 — Auth schemas

**Why:** Validate bodies.

**File:** `backend/app/schemas.py`

**Code:**

```python
class UserRegister(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "customer"  # customer | staff


class UserLogin(BaseModel):
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    model_config = {"from_attributes": True}


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
```

**Explain:** Limit role to customer/staff in route logic.

**Run:** Import.

**Expected:** OK.

**Check:** Reject unknown roles on register.

---

### Step 4 — Register route

**Why:** Create accounts safely.

**File:** `backend/app/routers_auth.py`

**Code:**

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.auth import hash_password
from app.database import get_db
from app.models import User
from app.schemas import UserRegister, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    if payload.role not in ("customer", "staff"):
        raise HTTPException(400, "role must be customer or staff")
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(
        email=payload.email.lower().strip(),
        password_hash=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
```

Include router in `main.py`.

**Explain:** Store lowercased email for simpler login.

**Run:**

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@demo.com","password":"demo1234","full_name":"Demo Customer","role":"customer"}'
```

**Expected:** 201 user JSON; DB `password_hash` is not `demo1234`.

**Check:** Duplicate email → 400.

---

### Step 5 — Login route

**Why:** Issue token.

**File:** `routers_auth.py`

**Code:**

```python
from app.auth import verify_password, create_access_token
from app.schemas import UserLogin, TokenOut


@router.post("/login", response_model=TokenOut)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user.id, user.role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }
```

**Explain:** Same vague error for bad email or password (don’t leak which).

**Run:**

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@demo.com","password":"demo1234"}'
```

**Expected:** JSON with `access_token`.

**Check:** Wrong password → 401.

---

## Checkpoint

- [ ] Register hashes passwords  
- [ ] Login returns JWT  
- [ ] Invalid login 401  
- [ ] Auth router mounted  
- [ ] Can paste token for tomorrow  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Hash helpers only |
| **Ending state** | Register/login + JWT issuance |

---

## Do Not Teach Yet

- `get_current_user` dependency (Day 3)  
- Role 403 rules (Day 4)  
- React storage (Day 5)  

---

## Next Day Bridge

Tomorrow every important route asks for the Bearer token and loads the **current user** from the database.
