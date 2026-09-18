# Day 3 — Bookings List + Create from React

## Learning Objective

Students load bookings from the API, render status, and create a booking by choosing a live bike and submitting `service_type` / notes.

## Continuity

Bikes round-trip works. Today the transaction entity joins the full stack. Status buttons tomorrow.

---

## Theory + Trainer Script

### Trainer script

> “Creating a booking without a bike is the same lie as Week 3 — now the UI must offer only real bikes. Use the bikes state to build a `<select>`.”

### Flow

```text
GET /bookings → list
GET /bikes → options for <select>
POST /bookings { bike_id, service_type, notes }
```

### Analogy

Dropdown of plates = picking which vehicle enters the workshop bay.

---

## Practical — Incremental Steps

---

### Step 1 — Load bookings

**Why:** Live transaction list.

**File:** `App.jsx` / `BookingsPanel.jsx`

**Code:**

```jsx
const [bookings, setBookings] = useState([])
const [bLoading, setBLoading] = useState(true)
const [bError, setBError] = useState('')

async function loadBookings() {
  setBLoading(true)
  setBError('')
  try {
    setBookings(await api('/bookings'))
  } catch (err) {
    setBError(err.message)
  } finally {
    setBLoading(false)
  }
}

useEffect(() => {
  loadBookings()
}, [])
```

**Explain:** Mirror bikes loading pattern — consistency helps beginners.

**Run:** Render list of `service_type` + `status`.

**Expected:** Matches `/docs`.

**Check:** Remove mock bookings array.

---

### Step 2 — Create booking form

**Why:** Customer workflow.

**File:** same

**Code:**

```jsx
const [bikeId, setBikeId] = useState('')
const [serviceType, setServiceType] = useState('General service')
const [notes, setNotes] = useState('')

async function addBooking(e) {
  e.preventDefault()
  setBError('')
  try {
    await api('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        bike_id: Number(bikeId),
        service_type: serviceType,
        notes: notes || null,
        // customer_id: 1 // if API still needs temporary default
      }),
    })
    setNotes('')
    await loadBookings()
  } catch (err) {
    setBError(err.message)
  }
}
```

```jsx
<select value={bikeId} onChange={(e) => setBikeId(e.target.value)} required>
  <option value="">Select bike</option>
  {bikes.map((b) => (
    <option key={b.id} value={b.id}>
      {b.registration_number} — {b.make} {b.model}
    </option>
  ))}
</select>
```

**Explain:** `Number(bikeId)` because `<select>` values are strings.

**Run:** Create booking; see status `booked`.

**Expected:** New row; survives refresh.

**Check:** Empty bike selection blocked by `required`.

---

### Step 3 — Prove bad bike still fails (optional)

**Why:** Trust backend.

**File:** temporary test via `/docs` or hacked POST

**Code:** POST `bike_id: 99999` in Swagger.

**Explain:** UI may prevent it; API must still enforce.

**Run:** Expect 400/404.

**Expected:** Error detail.

**Check:** Mention for oral checkpoint.

---

### Step 4 — Show registration if API provides it

**Why:** Readable list.

**File:** list render

**Code:**

```jsx
<li key={booking.id}>
  #{booking.id} {booking.bike_registration || `bike ${booking.bike_id}`} —{' '}
  {booking.service_type} — <strong>{booking.status}</strong>
</li>
```

**Explain:** Falls back to id if Week 5 didn’t add join field.

**Run:** Reload.

**Expected:** Human-readable rows.

**Check:** Student status words appear if renamed server-side.

---

## Checkpoint

- [ ] Bookings list from API  
- [ ] Create booking with bike `<select>`  
- [ ] Mock bookings removed  
- [ ] Errors shown  
- [ ] Data persists  

---

## Start State / End State

| | |
|--|--|
| **Starting state** | Live bikes only |
| **Ending state** | Live bookings list + create |

---

## Do Not Teach Yet

- Status advance buttons (Day 4)  
- Search UI (Day 5)  
- Role-based hide/show (Week 7)  

---

## Next Day Bridge

Tomorrow we add **Advance status** buttons that PATCH the API — and we display the backend error when someone tries an illegal jump.
