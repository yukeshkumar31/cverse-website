# Day 1 — Why Auth? Password Hashing

## Learning Objective

Students explain authentication vs authorization, store **hashed** passwords (never plain text), and verify a password against a hash using passlib/bcrypt in the Fix-My-Ride backend.

## Continuity

Week 6 used temporary `owner_id=1` / `customer_id=1`. Today we prepare real user credentials. JWT issuance is Day 2.

---

## Theory + Trainer Script

### Trainer script

> “If we save passwords as plain text and the database leaks, every account is stolen. We store a **hash** — a one-way fingerprint. Login re-hashes the attempt and compares.”

### Auth vs authz

| Word | Question |
|------|----------|
| Authentication | Who are you? |
| Authorization | What may you do? |

### Analogy

Password hash = smoothie. You cannot unsmoothie the fruit. You can check if a new banana-smoothie matches the stored fingerprint recipe result.

### Important Terms

| Term | Meaning |
|------|---------|
| Hash | One-way transform |
| bcrypt | Slow hash designed for passwords |
| Salt | Built into bcrypt; prevents rainbow tables |
| `password_hash` column | What we store in `users` |

---

## Practical — Incremental Steps

---

### Step 1 — Install auth dependencies

**Why:** Libraries for hash + (soon) JWT.

**File:** `backend/requirements.txt`

**Code:**

```text
passlib[bcrypt]
python-jose[cryptography]
```

```bash
pip install 'passlib[bcrypt]' 'python-jose[cryptography]'
pip freeze > requirements.txt   # or hand-maintain
```

**Explain:** Match versions to increment if installs fight — trainer helps.

**Run:** Import test:

```bash
python -c "from passlib.context import CryptContext; print('ok')"
```

**Expected:** `ok`.

**Check:** venv active.

---

### Step 2 — Hash helpers

**Why:** One module for password ops.

**File:** `backend/app/auth.py`

**Code:**

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

**Explain:** Never log plain passwords. Never commit real user passwords.

**Run:**

```bash
python - <<'PY'
from app.auth import hash_password, verify_password
h = hash_password('demo1234')
print(h)
print(verify_password('demo1234', h))
print(verify_password('wrong', h))
PY
```

**Expected:** Long hash; True; False.

**Check:** Hash starts like `$2b$` (bcrypt).

---

### Step 3 — Confirm User model has password_hash

**Why:** Column must exist from Week 4/5.

**File:** `backend/app/models.py`

**Code:** (verify)

```python
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(120), nullable=False)
    role = Column(String(20), nullable=False)  # customer | staff
```

**Explain:** Role values stay two for BASE.

**Run:** App imports models.

**Expected:** No missing column errors (migrate/`create_all` if needed).

**Check:** Student Transfer Sheet roles map to these two strings in DB.

---

### Step 4 — Manually insert a hashed demo user (optional)

**Why:** Prove DB stores hashes.

**File:** script or `psql` after printing a hash

**Code:**

```python
print(hash_password('demo1234'))
```

Then INSERT that string into `password_hash` — or wait for register endpoint Day 2.

**Explain:** Prefer register endpoint tomorrow for consistency.

**Run:** Optional.

**Expected:** Understanding only.

**Check:** Do not leave `demo1234` in plaintext column.

---

### Step 5 — SECRET_KEY config preview

**Why:** JWT needs a secret tomorrow.

**File:** `backend/.env.example`

**Code:**

```text
DATABASE_URL=postgresql+psycopg://localhost:5432/fixmyride
SECRET_KEY=cverse-dev-secret-change-me
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

**Explain:** Dev secret OK for class; change for any real deploy. Never commit `.env`.

**Run:** Copy to `.env` if missing.

**Expected:** Settings readable next day.

**Check:** `.gitignore` includes `.env`.

---

## Checkpoint

- [ ] Can explain hash vs plain text  
- [ ] `hash_password` / `verify_password` work  
- [ ] User model has `password_hash` + `role`  
- [ ] Auth vs authz stated correctly  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Open API, fake user ids |
| **Ending state** | Password helpers ready; config for JWT |

---

## Do Not Teach Yet

- JWT encode/decode (Day 2)  
- Protecting routes (Day 3)  
- React login (Day 5)  

---

## Next Day Bridge

Tomorrow we add **register** and **login** routes that return a **JWT access token**.
