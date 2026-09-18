# Day 5 — Search UI + Debugging + Week 6 Checkpoint

## Learning Objective

Students wire a status filter (and optional text search) to API query params, practice a repeatable debugging process (Network tab + `/docs` + DB), and pass the Week 6 full-stack checkpoint — still without auth.

## Continuity

Core flows work. Today: BASE search/filter in the UI + habits for when things break.

**Increment:** `course/increments/week-06/day-05-integrated/`

---

## Theory + Trainer Script

### Trainer script

> “When it breaks, do not rewrite the whole app. Ask: Did the browser send the request? What status code returned? Does `/docs` work? Is Postgres up? Layer by layer.”

### Debug ladder

```text
1. Both terminals running?
2. /health OK?
3. /docs Try it out OK?
4. Network tab: URL, method, status, response JSON?
5. CORS error vs 4xx/5xx?
6. SQL/data: row exist in psql?
```

### Filter UX

| Control | Maps to |
|---------|---------|
| Status `<select>` | `?status=booked` |
| Search box | `?q=TN09` (if API supports) |

---

## Practical — Incremental Steps

---

### Step 1 — Status filter control

**Why:** BASE search/filter.

**File:** bookings panel

**Code:**

```jsx
const [statusFilter, setStatusFilter] = useState('')

async function loadBookings() {
  setBLoading(true)
  setBError('')
  try {
    const qs = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''
    setBookings(await api(`/bookings${qs}`))
  } catch (err) {
    setBError(err.message)
  } finally {
    setBLoading(false)
  }
}

useEffect(() => {
  loadBookings()
}, [statusFilter])
```

```jsx
<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
  <option value="">All statuses</option>
  <option value="booked">booked</option>
  <option value="in_progress">in_progress</option>
  <option value="completed">completed</option>
</select>
```

**Explain:** Changing filter re-fetches — server-side filter preferred over only filtering client array.

**Run:** Create mixed statuses; toggle filter.

**Expected:** List matches API filter.

**Check:** Network tab shows query string.

---

### Step 2 — Optional registration search

**Why:** Richer staff search if Day 5 Week 5 added `q`.

**File:** same

**Code:**

```jsx
const [q, setQ] = useState('')

// build qs:
const params = new URLSearchParams()
if (statusFilter) params.set('status', statusFilter)
if (q.trim()) params.set('q', q.trim())
const qs = params.toString() ? `?${params}` : ''
```

Search on button click or debounce lightly — button is fine for class:

```jsx
<button type="button" onClick={loadBookings}>Search</button>
```

**Explain:** If API lacks `q`, skip — status filter alone passes BASE.

**Run:** Search substring of a plate.

**Expected:** Narrowed list.

**Check:** Clear search returns wider list.

---

### Step 3 — Debugging dojo (paired)

**Why:** Habit > heroics.

**File:** none

**Code:** Trainer plants one break per pair (examples):

- Stop uvicorn  
- Wrong API port in `api.js`  
- Typo `/booking` vs `/bookings`  
- CORS origin mismatch  

**Explain:** Students must climb the debug ladder aloud.

**Run:** 15–20 minutes.

**Expected:** Each pair fixes one planted bug + narrates steps.

**Check:** Write ladder on board permanently.

---

### Step 4 — Checkpoint demo script

**Why:** Friday must-ship.

**File:** none

**Demo order:**

1. Show empty filter → bookings  
2. Add bike → appears  
3. Create booking → booked  
4. Advance twice → completed  
5. Filter completed → only done jobs  
6. Restart API → refresh UI → data remains  
7. Narrate full path once  

**Explain:** No auth yet — say so proudly (“Week 7”).

**Run:** Trainer signs checklist.

**Expected:** Week 6 checkpoint green.

**Check:** Compare stuck apps to `course/increments/week-06/day-05-integrated/`.

---

### Step 5 — Commit working point (if using git)

**Why:** Restore point before auth refactors.

**File:** repo

**Code:** Student commit message idea: `feat: wire React to live bikes and bookings API`.

**Explain:** Only if course uses git weekly — do not force accounts today.

**Run:** `git status` clean enough.

**Expected:** Working tree saved.

**Check:** Optional.

---

## Checkpoint

- [ ] Filter by status via query params  
- [ ] Optional q search or trainer waiver  
- [ ] Debug ladder practiced  
- [ ] Full demo narration done  
- [ ] No mock data left for core lists  

**Oral questions:**

1. What is CORS for?  
2. Why filter on the server?  
3. Name the debug ladder steps.  
4. What still uses temporary user ids until Week 7?

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Status PATCH live |
| **Ending state** | Integrated React↔API↔DB; Week 6 milestone |

---

## Do Not Teach Yet

- JWT login UI (Week 7)  
- Password hashing deep dive  
- Deploy / HTTPS  

---

## Next Day Bridge

> “Next week we stop using owner_id=1 forever. **Register, login, JWT, Customer vs Staff.** The same buttons will start failing with 401 until you send a Bearer token — that is progress.”
