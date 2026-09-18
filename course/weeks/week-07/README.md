# Week 7 — Auth (JWT) + Roles

**Milestone:** Register/login with JWT; Customer vs Staff behave differently on bikes/bookings.

Students keep Transfer Sheet role names in the UI; tokens and `role` claims follow the same pattern as Fix-My-Ride (`customer` | `staff`).

---

## Why this week exists

Week 6 apps work but anyone who can hit the API can act as anyone (`owner_id=1`). Week 7 adds **identity** and **authorization**.

```text
Register/Login → JWT access token
  → Authorization: Bearer <token>
  → get_current_user
  → role checks (customer vs staff)
```

Trainer line:

> “Authentication asks who are you. Authorization asks what are you allowed to do. BASE needs both — simply.”

---

## Outcomes by end of Day 5

| Capability | Fix-My-Ride | Student project |
|------------|-------------|-----------------|
| Password hashing | bcrypt via passlib | Same |
| Register | `POST /auth/register` | Same |
| Login | `POST /auth/login` → JWT | Same |
| Protect routes | `Depends(get_current_user)` | Same |
| Customer | Own bikes; create bookings; see own bookings | Primary user |
| Staff | See all bookings; PATCH status | Staff/Admin |
| Frontend | Login screen; store token; send header | Same |
| Demo users | customer@ / staff@ | Their seeds |

**Runnable checkpoint:** `course/increments/week-07/day-05-auth/`

---

## Day map

| Day | Focus | Ending state |
|-----|--------|--------------|
| [Day 1](day-01.md) | Why auth; hash passwords; user model ready | Can hash/verify; users table used |
| [Day 2](day-02.md) | Register + login + JWT issue | Tokens from `/auth/login` |
| [Day 3](day-03.md) | Protect routes; current user | 401 without token |
| [Day 4](day-04.md) | Role rules on bikes/bookings | Customer vs staff differences |
| [Day 5](day-05.md) | React login + token header + checkpoint | Full Week 7 milestone |

---

## Stack this week

- `python-jose` (or equivalent) for JWT  
- `passlib[bcrypt]`  
- `OAuth2PasswordBearer` or manual Bearer header  
- React `localStorage` for token (BASE — acknowledge limits)

**Not this week:** Refresh tokens, OAuth social login, email verify, reset password, RBAC matrices beyond 2 roles.

---

## Security honesty (say once)

> “localStorage JWT is OK for learning BASE. Real production needs more thought (httpOnly cookies, XSS, refresh). We ship learning-grade auth now; enhance later.”

---

## Week 7 checkpoint (trainer)

- [ ] Register creates user with hashed password (not plain text)  
- [ ] Login returns access token  
- [ ] Protected route rejects missing/invalid token (401)  
- [ ] Customer cannot PATCH status (403)  
- [ ] Staff can PATCH status  
- [ ] Customer sees only own bookings (or equivalent Transfer Sheet rule)  
- [ ] React login stores token and calls API with Bearer  

---

## Next week bridge

Week 8 polishes UX, README, GitHub, Enhance Later backlog, and a confident demo — no new architecture.
