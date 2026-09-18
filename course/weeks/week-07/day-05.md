# Day 5 — React Login + Bearer Token + Week 7 Checkpoint

## Learning Objective

Students add register/login UI, persist JWT + user in `localStorage`, attach `Authorization: Bearer` in `api.js`, gate status buttons by role, and pass the Week 7 checkpoint.

## Continuity

Backend role rules work via curl/`/docs`. Today the full stack respects identity again.

**Increment:** `course/increments/week-07/day-05-auth/`

---

## Theory + Trainer Script

### Trainer script

> “After login we save the token. Every fetch wears it. On logout we throw it away. Staff see Advance buttons; customers do not — and even if they hack the button, API returns 403.”

### Session shape (BASE)

```text
localStorage.token = access_token
localStorage.user = { id, email, full_name, role }
```

Honesty reminder: learning-grade; enhance later for production cookie strategies.

---

## Practical — Incremental Steps

---

### Step 1 — Extend api.js

**Why:** Central auth header.

**File:** `frontend/src/api.js`

**Code:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function getStoredUser() {
  const raw = localStorage.getItem('user')
  return raw ? JSON.parse(raw) : null
}

export function saveSession(token, user) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = localStorage.getItem('token')
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data.detail || 'Request failed'
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }
  return data
}
```

**Explain:** 401 handling can clear session — optional enhancement.

**Run:** Save.

**Expected:** Existing calls send header when token present.

**Check:** Network tab shows Authorization.

---

### Step 2 — Auth screen

**Why:** Obtain token without Swagger.

**File:** `App.jsx`

**Code:** (pattern)

```jsx
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('customer@demo.com')
  const [password, setPassword] = useState('demo1234')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        await api('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role,
          }),
        })
      }
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      saveSession(data.access_token, data.user)
      onAuth(data.user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      {/* inputs for email/password; register fields if mode=register */}
      {error && <p className="error">{error}</p>}
      <button type="submit">{mode === 'login' ? 'Login' : 'Create account'}</button>
    </form>
  )
}
```

**Explain:** After register, auto-login keeps UX simple.

**Run:** Login as customer.

**Expected:** Main app appears; token in Application → Local Storage.

**Check:** Bad password shows error.

---

### Step 3 — Gate the app shell

**Why:** No token → auth screen.

**File:** `App.jsx`

**Code:**

```jsx
const [user, setUser] = useState(getStoredUser())

if (!user) {
  return <AuthScreen onAuth={setUser} />
}

function logout() {
  clearSession()
  setUser(null)
}
```

**Explain:** Refresh keeps session until logout/clear.

**Run:** Refresh page; still logged in.

**Expected:** Persistent session.

**Check:** Logout clears and returns to AuthScreen.

---

### Step 4 — Role-aware status buttons

**Why:** Match staff workflow in UI.

**File:** bookings list

**Code:**

```jsx
{user.role === 'staff' && NEXT_STATUS[booking.status] && (
  <button type="button" onClick={() => advanceStatus(booking)}>
    Mark {NEXT_STATUS[booking.status]}
  </button>
)}
```

**Explain:** Customers still must not PATCH; hide button + rely on API.

**Run:** Login staff → buttons. Login customer → no buttons; create booking works.

**Expected:** Role difference visible in one demo.

**Check:** Transfer Sheet labels in UI copy (“Librarian” etc.) but role string in JWT stays `staff`/`customer` unless you intentionally mirror — recommend keep enum, change labels only.

---

### Step 5 — Week 7 checkpoint demo

**Script:**

1. Register or login customer → add bike → create booking  
2. Logout → login staff → see booking → advance status  
3. Logout → login customer → see updated status; no advance button  
4. Show Network Bearer header  
5. Optional: remove token manually → 401  

Compare to `course/increments/week-07/day-05-auth/` if stuck.

---

## Checkpoint

- [ ] Login/register UI works  
- [ ] Token stored and sent  
- [ ] Customer vs staff UI difference  
- [ ] API still enforces 403  
- [ ] Demo accounts documented  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Auth API only |
| **Ending state** | Full-stack JWT roles; Week 7 milestone |

---

## Do Not Teach Yet

- Refresh tokens / OAuth  
- Email verification  
- Large UX polish (Week 8)  
- New entities  

---

## Next Day Bridge

> “Final week: polish, README, GitHub, Enhance Later backlog, and a calm demo. No new architecture. Base now — enhance later.”
