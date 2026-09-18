# Day 2 — POST Bike from React Form

## Learning Objective

Students submit the add-bike form with `fetch` POST, handle API validation errors in the UI, and refresh the list so new bikes appear from PostgreSQL.

## Continuity

Day 1: live GET list. Today: create round trip. Bookings still wait until Day 3.

---

## Theory + Trainer Script

### Trainer script

> “A form is not finished when React state updates. Finished means the database has a row and a refresh still shows it. POST, then GET again — or optimistically append only after 201.”

### Flow

```text
User submits form
  → POST /bikes JSON
  → 201 + bike object
  → clear inputs
  → reload list (GET)
```

### Analogy

Form = order slip. API = kitchen. List = plate that comes back. Don’t invent the plate in the dining room only.

---

## Practical — Incremental Steps

---

### Step 1 — Controlled inputs (if not already)

**Why:** Know what we send.

**File:** `App.jsx` / `BikesPanel.jsx`

**Code:**

```jsx
const [make, setMake] = useState('')
const [model, setModel] = useState('')
const [reg, setReg] = useState('')
```

**Explain:** Bind `value` + `onChange` on each input.

**Run:** Type in UI; React DevTools optional.

**Expected:** State tracks fields.

**Check:** Field names match API schema (`registration_number`).

---

### Step 2 — POST handler

**Why:** Persist create.

**File:** same

**Code:**

```jsx
async function addBike(e) {
  e.preventDefault()
  setError('')
  try {
    await api('/bikes', {
      method: 'POST',
      body: JSON.stringify({
        make,
        model,
        registration_number: reg,
        // owner_id: 1  // only if Week 5 API still requires it
      }),
    })
    setMake('')
    setModel('')
    setReg('')
    const data = await api('/bikes')
    setBikes(data)
  } catch (err) {
    setError(err.message)
  }
}
```

Wire: `<form onSubmit={addBike}>`.

**Explain:** `e.preventDefault()` stops full page reload. Prefer reload list over trusting only local push.

**Run:** Submit a unique registration.

**Expected:** New row in list; row visible in `/docs` and after browser refresh.

**Check:** Restart uvicorn; refresh UI — bike remains.

---

### Step 3 — Show duplicate / validation errors

**Why:** Unique registration may 400.

**File:** same

**Code:** Ensure `error` renders above the form:

```jsx
{error && <p className="error">{error}</p>}
```

**Explain:** Duplicate plate should surface API `detail`, not a blank failure.

**Run:** POST same registration twice.

**Expected:** Error message; list unchanged for second attempt.

**Check:** Student reads Network tab status code.

---

### Step 4 — Disable button while saving (optional)

**Why:** Prevent double-submit.

**File:** same

**Code:**

```jsx
const [saving, setSaving] = useState(false)
// set saving true/false around await in addBike
<button type="submit" disabled={saving}>
  {saving ? 'Saving…' : 'Add bike'}
</button>
```

**Explain:** Small UX win; skip if behind.

**Run:** Click once; watch disabled state.

**Expected:** No duplicate POSTs from double-click.

**Check:** Optional.

---

## Checkpoint

- [ ] Form POSTs to API  
- [ ] List refreshes after create  
- [ ] Persistence across API restart proven  
- [ ] Error from API visible in UI  
- [ ] Transfer Sheet labels on form  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | GET bikes live |
| **Ending state** | Create bike round trip live |

---

## Do Not Teach Yet

- Bookings UI wiring (Day 3)  
- Status PATCH (Day 4)  
- Auth  

---

## Next Day Bridge

Tomorrow we wire **bookings list + create** the same way — pick a bike id from the live bikes list.
