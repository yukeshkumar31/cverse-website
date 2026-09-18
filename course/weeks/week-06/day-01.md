# Day 1 — fetch GET Bikes, CORS, Loading State

## Learning Objective

Students connect React to the live FastAPI bikes list: enable **CORS**, `fetch` `GET /bikes` in `useEffect`, and show loading / error / data states. Mock array is no longer the source of truth for bikes.

## Continuity

Week 5 API persists bikes in PostgreSQL. Week 2 UI still uses mock data. Today the list reads from the API. Two terminals forever.

---

## Theory + Trainer Script

### Trainer script

> “The browser and the API are different origins — different ports. The browser blocks requests unless the API says ‘I allow localhost:5173.’ That permission is CORS. Then `fetch` pulls JSON, and React puts it on screen.”

### Mental model

```text
React (5173) --GET /bikes--> FastAPI (8000) --> PostgreSQL
             <-- JSON bikes --
```

### Analogy

CORS = guest list at the club door. Vite is a guest; API is the bouncer.

### Important Terms

| Term | Meaning |
|------|---------|
| Origin | scheme + host + port |
| CORS | Cross-Origin Resource Sharing |
| `fetch` | Browser HTTP helper |
| `useEffect` | Run side effect after render |
| Loading state | UI while waiting |

---

## Practical — Incremental Steps

---

### Step 1 — Two terminals check

**Why:** Most “bugs” are “forgot to start the API.”

**File:** none

**Code:**

```bash
# Terminal A
cd backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal B
cd frontend && npm run dev
```

**Explain:** Bookmark both URLs: `http://localhost:8000/docs` and `http://localhost:5173`.

**Run:** Open `/health` and the Vite app.

**Expected:** Both live.

**Check:** Trainer asks room to hold up two fingers = two terminals.

---

### Step 2 — Add CORS middleware

**Why:** Without it, browser console shows CORS error.

**File:** `backend/app/main.py`

**Code:**

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Explain:** Do not use production `*` forever — fine for class with credentials caveats; week BASE allows these two origins.

**Run:** Restart uvicorn if needed.

**Expected:** Middleware loaded; `/health` still OK.

**Check:** Origins match Vite URL exactly (no trailing slash).

---

### Step 3 — API helper module

**Why:** One place for base URL.

**File:** `frontend/src/api.js`

**Code:**

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = data.detail || 'Request failed'
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message))
  }
  return data
}
```

**Explain:** Later weeks add Authorization header here. Today GET only.

**Run:** Save file.

**Expected:** No syntax errors.

**Check:** Student can change `VITE_API_URL` later without rewriting every call.

---

### Step 4 — Load bikes in React

**Why:** Replace mock list.

**File:** `frontend/src/App.jsx` (or `BikesPanel.jsx`)

**Code:**

```jsx
import { useEffect, useState } from 'react'
import { api } from './api.js'

function BikesPanel() {
  const [bikes, setBikes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await api('/bikes')
        if (!cancelled) setBikes(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <p>Loading bikes…</p>
  if (error) return <p style={{ color: 'crimson' }}>Error: {error}</p>

  return (
    <ul>
      {bikes.map((b) => (
        <li key={b.id}>
          {b.make} {b.model} — {b.registration_number}
        </li>
      ))}
    </ul>
  )
}
```

**Explain:** Empty dependency array → load once on mount. Map Transfer Sheet field names.

**Run:** Refresh Vite; watch Network tab for `/bikes`.

**Expected:** Same bikes as `/docs` GET `/bikes`.

**Check:** Stop API → UI shows error (not infinite spinner).

---

### Step 5 — Remove mock bikes array

**Why:** One source of truth.

**File:** old mock data file / App.jsx

**Code:** Delete `const mockBikes = [...]` used for the list.

**Explain:** Keep bookings mock until Day 3 if needed — label clearly.

**Run:** Reload; list still from API.

**Expected:** No references to mock bikes.

**Check:** Network tab proves HTTP call.

---

## Checkpoint

- [ ] CORS configured  
- [ ] `api.js` exists  
- [ ] Bike list from API  
- [ ] Loading + error states visible  
- [ ] Mock bikes removed from list path  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Mock UI + separate DB API |
| **Ending state** | Live bike list; CORS OK |

---

## Do Not Teach Yet

- POST form (Day 2)  
- Bookings wiring (Day 3)  
- Auth headers (Week 7)  

---

## Next Day Bridge

Tomorrow the **Add bike** form POSTs to the API and reloads the list — full create round trip.
