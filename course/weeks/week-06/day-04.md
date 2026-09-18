# Day 4 — Status PATCH Buttons + API Errors in UI

## Learning Objective

Students advance booking status with `PATCH /bookings/{id}/status`, only offer the next legal status in the UI, and still show API errors if a bad transition is attempted.

## Continuity

Bookings create/list work. Today the staff workflow becomes visible. Backend remains the boss.

---

## Theory + Trainer Script

### Trainer script

> “Buttons are suggestions. The API is the law. Even if the UI only shows the next step, we keep error handling — because another client could cheat, and because bugs happen.”

### Next-status map (mirror backend)

```javascript
const NEXT_STATUS = {
  booked: 'in_progress',
  in_progress: 'completed',
}
```

Students rename keys/values to Transfer Sheet labels.

### Analogy

UI button = suggested next column on the kanban. API = manager who rejects illegal moves.

---

## Practical — Incremental Steps

---

### Step 1 — Advance handler

**Why:** Call PATCH.

**File:** `BookingsPanel` / `App.jsx`

**Code:**

```jsx
async function advanceStatus(booking) {
  const next = NEXT_STATUS[booking.status]
  if (!next) return
  setBError('')
  try {
    await api(`/bookings/${booking.id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: next }),
    })
    await loadBookings()
  } catch (err) {
    setBError(err.message)
  }
}
```

**Explain:** Read `next` from map — do not hardcode completed everywhere.

**Run:** Click on a `booked` row.

**Expected:** Becomes `in_progress`.

**Check:** Second click → `completed`; third → no button.

---

### Step 2 — Conditional button

**Why:** Don’t offer illegal UI actions.

**File:** list item render

**Code:**

```jsx
{NEXT_STATUS[booking.status] && (
  <button type="button" onClick={() => advanceStatus(booking)}>
    Mark {NEXT_STATUS[booking.status]}
  </button>
)}
```

**Explain:** Completed jobs show no advance button.

**Run:** Walk full path on one booking.

**Expected:** booked → in_progress → completed.

**Check:** Labels use student words.

---

### Step 3 — Force an illegal call (learning)

**Why:** Prove error surfacing.

**File:** temporary button or `/docs`

**Code:** From Swagger, PATCH a `booked` booking to `completed`.

**Explain:** UI may hide this; API returns 400; paste detail into UI error area if testing from a debug button:

```jsx
// debug-only:
await api(`/bookings/${id}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'completed' }),
})
```

**Run:** See crimson error text.

**Expected:** Message like “Cannot change status from 'booked' to 'completed'”.

**Check:** Remove debug button before Friday demo.

---

### Step 4 — Disable while patching (optional)

**Why:** Avoid double PATCH.

**File:** same

**Code:** Track `updatingId` state; disable the button for that row.

**Explain:** Optional polish.

**Run:** Click once.

**Expected:** Single transition.

**Check:** Skip if timeboxed.

---

## Checkpoint

- [ ] PATCH from UI works for legal path  
- [ ] No advance button on completed  
- [ ] API error can appear in UI  
- [ ] List reloads after success  
- [ ] Student can narrate: button → fetch → service rule → DB → JSON → UI  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Create/list bookings |
| **Ending state** | Status workflow live end-to-end |

---

## Do Not Teach Yet

- Staff-only gating (Week 7)  
- Search box wiring (Day 5)  
- Optimistic UI without reload  

---

## Next Day Bridge

Tomorrow we wire **search/filter** to `?status=` (and optional `q=`), practice Network-tab debugging, and freeze the Week 6 integrated checkpoint.
