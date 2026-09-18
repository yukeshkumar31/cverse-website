# Day 5 — Bookings List, Create Booking, Status Labels + Filter; Week Checkpoint

## Learning Objective

By the end of this day, students have a complete Week 2 mock UI: bikes (from Day 4), bookings list, create-booking form that requires an existing bike, human-readable status labels, and filter-by-status. They can demo the Fix-My-Ride BASE flow on screen with mock data (or their Transfer Sheet equivalent).

## Continuity

Day 4 delivered bikes in state. Day 1–2 delivered status rules and booking shapes. Today we combine them in React. Status changes can be a simple “Advance status” button that uses `canChangeStatus` — still client-side only.

---

## PART 1 — THEORY

### Trainer script — Week milestone

> “When you filter by status, you are practicing a base feature every app needs. The data is still fake. Next week Python will own the same rules. Do not worry that refresh clears data — that proves we still need a backend and database.”

### Status labels (display vs storage)

| Stored value | Label on screen |
|--------------|-----------------|
| `booked` | Booked |
| `in_progress` | In progress |
| `completed` | Completed |

Students map their three Transfer Sheet values to friendly labels the same way.

### Create booking rule (client mock)

- Must choose a `bikeId` that exists in `bikes`
- `serviceType` required
- New booking status = first status (`booked`)

### Filter

- Show All, or one status
- Filter is client-side on the bookings array

---

## PART 2 — PRACTICAL

Continue in the Vite app. Add:

```text
src/
  statusRules.js
  BookingList.jsx
  AddBookingForm.jsx
  mockData.js          (extend with initialBookings)
  App.jsx              (wire everything)
```

---

### Step 1 — Status helpers + labels

**Why:** Reuse Day 1 logic; keep display text in one place.

**File:** `src/statusRules.js`

**Code:**

```javascript
export function canChangeStatus(from, to) {
  if (from === "booked" && to === "in_progress") return true;
  if (from === "in_progress" && to === "completed") return true;
  return false;
}

export function nextStatus(from) {
  if (from === "booked") return "in_progress";
  if (from === "in_progress") return "completed";
  return null;
}

export function statusLabel(status) {
  if (status === "booked") return "Booked";
  if (status === "in_progress") return "In progress";
  if (status === "completed") return "Completed";
  return status;
}
```

**Explain:** Storage strings stay stable for code; labels are for humans. Students swap both sides for Transfer Sheet values.

**Run:** No UI yet.

**Expected result:** Module exports without errors.

**Check:** Student updated strings to their statuses if not on Fix-My-Ride.

---

### Step 2 — Seed bookings in mockData

**Why:** Something to show before the user creates bookings.

**File:** `src/mockData.js` (append)

**Code:**

```javascript
export const initialBikes = [
  {
    id: 1,
    make: "Honda",
    model: "Activa",
    registrationNumber: "TN09AB1234",
  },
  {
    id: 2,
    make: "TVS",
    model: "Jupiter",
    registrationNumber: "TN22CD5678",
  },
];

export const initialBookings = [
  {
    id: 1,
    bikeId: 1,
    serviceType: "General service",
    status: "booked",
    notes: "Noise when starting",
  },
  {
    id: 2,
    bikeId: 2,
    serviceType: "Oil change",
    status: "in_progress",
    notes: "",
  },
];
```

**Explain:** Each booking’s `bikeId` must match a real bike id in `initialBikes`.

**Run:** Save file.

**Expected result:** No runtime change until App imports bookings.

**Check:** Student seed uses their entity field names.

---

### Step 3 — Bookings state in App + helper to show bike reg

**Why:** Bookings need bikes to display a useful line (registration), not only an id.

**File:** `src/App.jsx` (build up)

**Code:**

```javascript
import { useState } from "react";
import AppTitle from "./AppTitle.jsx";
import BikeList from "./BikeList.jsx";
import AddBikeForm from "./AddBikeForm.jsx";
import BookingList from "./BookingList.jsx";
import AddBookingForm from "./AddBookingForm.jsx";
import { initialBikes, initialBookings } from "./mockData.js";
import { canChangeStatus, nextStatus } from "./statusRules.js";

function App() {
  const [bikes, setBikes] = useState(initialBikes);
  const [bookings, setBookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState("all");

  function bikeLabel(bikeId) {
    const bike = bikes.find(function (b) {
      return b.id === bikeId;
    });
    if (!bike) return "Unknown bike";
    return bike.registrationNumber + " (" + bike.make + ")";
  }

  function handleAddBike(newBikeFields) {
    const bike = {
      id: Date.now(),
      make: newBikeFields.make,
      model: newBikeFields.model,
      registrationNumber: newBikeFields.registrationNumber,
    };
    setBikes(function (current) {
      return current.concat(bike);
    });
  }

  // booking handlers added in later steps…

  return (
    <main>
      <AppTitle />
      <BikeList bikes={bikes} />
      <AddBikeForm onAddBike={handleAddBike} />
      {/* BookingList + AddBookingForm next */}
    </main>
  );
}

export default App;
```

**Explain:** `bikeLabel` joins the two entities for display — same relationship idea as SQL JOIN later.

**Run:** Still bikes-only until list component exists.

**Expected result:** App compiles; bikes section unchanged.

**Check:** `bookings` state exists even if unused briefly.

---

### Step 4 — `BookingList` with labels, filter, advance button

**Why:** Core transaction UI + filter base feature.

**File:** `src/BookingList.jsx`

**Code:**

```javascript
import { statusLabel } from "./statusRules.js";

function BookingList(props) {
  const bookings = props.bookings;
  const statusFilter = props.statusFilter;
  const onFilterChange = props.onFilterChange;
  const onAdvanceStatus = props.onAdvanceStatus;
  const bikeLabel = props.bikeLabel;

  const visible =
    statusFilter === "all"
      ? bookings
      : bookings.filter(function (b) {
          return b.status === statusFilter;
        });

  return (
    <section>
      <h2>Bookings</h2>

      <p>
        Filter:{" "}
        <select
          value={statusFilter}
          onChange={function (e) {
            onFilterChange(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="booked">Booked</option>
          <option value="in_progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </p>

      {visible.length === 0 ? (
        <p>No bookings for this filter.</p>
      ) : (
        <ul>
          {visible.map(function (booking) {
            return (
              <li key={booking.id}>
                <strong>{booking.serviceType}</strong> — {bikeLabel(booking.bikeId)} —{" "}
                {statusLabel(booking.status)}
                {booking.status !== "completed" ? (
                  <button
                    type="button"
                    onClick={function () {
                      onAdvanceStatus(booking.id);
                    }}
                  >
                    Advance status
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default BookingList;
```

**Explain:** Filter happens before render. Advance is only shown if not completed. Actual transition logic stays in App (or a shared helper) so the list stays presentational.

**Run:** Wire in next step.

**Expected result:** Component ready.

**Check:** Select options use student status values if renamed.

---

### Step 5 — Create booking form (must pick a bike)

**Why:** Enforce “need a bike” in the UI.

**File:** `src/AddBookingForm.jsx`

**Code:**

```javascript
import { useState } from "react";

function AddBookingForm(props) {
  const bikes = props.bikes;
  const [bikeId, setBikeId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!bikeId) {
      alert("Choose a bike first.");
      return;
    }
    if (!serviceType) {
      alert("Service type is required.");
      return;
    }

    props.onAddBooking({
      bikeId: Number(bikeId),
      serviceType: serviceType,
      notes: notes,
    });

    setBikeId("");
    setServiceType("");
    setNotes("");
  }

  if (bikes.length === 0) {
    return <p>Add a bike before creating a booking.</p>;
  }

  return (
    <section>
      <h2>New booking</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Bike{" "}
            <select
              value={bikeId}
              onChange={function (e) {
                setBikeId(e.target.value);
              }}
            >
              <option value="">Select…</option>
              {bikes.map(function (bike) {
                return (
                  <option key={bike.id} value={bike.id}>
                    {bike.registrationNumber} — {bike.make} {bike.model}
                  </option>
                );
              })}
            </select>
          </label>
        </p>
        <p>
          <label>
            Service type{" "}
            <input
              value={serviceType}
              onChange={function (e) {
                setServiceType(e.target.value);
              }}
            />
          </label>
        </p>
        <p>
          <label>
            Notes{" "}
            <input
              value={notes}
              onChange={function (e) {
                setNotes(e.target.value);
              }}
            />
          </label>
        </p>
        <button type="submit">Create booking</button>
      </form>
    </section>
  );
}

export default AddBookingForm;
```

**Explain:** Dropdown options come from live `bikes` state — if you add a bike above, it appears here. `Number(bikeId)` converts the select string back to a number to match mock ids.

**Run:** After App wiring.

**Expected result:** Form shows bike choices.

**Check:** With zero bikes, message appears instead of form.

---

### Step 6 — Wire handlers in App (create + advance + filter)

**Why:** Complete the Week 2 milestone.

**File:** `src/App.jsx` (complete handlers + JSX)

**Code:**

```javascript
function handleAddBooking(fields) {
  const bikeExists = bikes.some(function (b) {
    return b.id === fields.bikeId;
  });
  if (!bikeExists) {
    alert("That bike does not exist.");
    return;
  }

  const booking = {
    id: Date.now(),
    bikeId: fields.bikeId,
    serviceType: fields.serviceType,
    status: "booked",
    notes: fields.notes || "",
  };

  setBookings(function (current) {
    return current.concat(booking);
  });
}

function handleAdvanceStatus(bookingId) {
  setBookings(function (current) {
    return current.map(function (booking) {
      if (booking.id !== bookingId) return booking;
      const to = nextStatus(booking.status);
      if (!to || !canChangeStatus(booking.status, to)) {
        alert("Cannot advance status from " + booking.status);
        return booking;
      }
      return Object.assign({}, booking, { status: to });
    });
  });
}

function handleFilterChange(value) {
  setStatusFilter(value);
}

// in return:
// <BookingList
//   bookings={bookings}
//   statusFilter={statusFilter}
//   onFilterChange={handleFilterChange}
//   onAdvanceStatus={handleAdvanceStatus}
//   bikeLabel={bikeLabel}
// />
// <AddBookingForm bikes={bikes} onAddBooking={handleAddBooking} />
```

**Explain:** Create checks bike existence. Advance uses Day 1 rules. `Object.assign` copies the booking with a new status (simple immutable-ish update for beginners).

**Run:** Full demo path:

1. Filter to `booked`
2. Advance a booking to in progress
3. Filter to `in_progress`
4. Add a new bike, then create a booking for it
5. Try to reason about refresh → data resets

**Expected result:** Lists update; invalid advances blocked; filter changes visible set.

**Check:** Trainer Week 2 checklist (below) passes.

---

### Step 7 — Week 2 demo script (5 minutes)

**Why:** Student practices explaining, not only clicking.

**File:** none

**Code:** none

**Explain / script for student:**

> “These are my bikes. I can add one. A booking must pick a bike. Status goes booked → in progress → completed. I can filter the list. Data resets on refresh because it is still mock data in the browser.”

**Run:** Pair demo or class share.

**Expected result:** Clear 5-minute walkthrough.

**Check:** Transfer Sheet words used aloud.

---

## Student Checkpoint

- [ ] Bookings list shows service type, bike label, status label
- [ ] Can create a booking only when a bike exists
- [ ] Can filter by status (including All)
- [ ] Advance status follows allowed transitions only
- [ ] Bikes section from Day 4 still works
- [ ] Can explain mock vs future API in one sentence

### Trainer Week 2 checklist

- [ ] `npm run dev` runs
- [ ] Mock bikes + bookings visible
- [ ] Add bike + create booking work
- [ ] Status labels + filter work
- [ ] Status advance respects rules
- [ ] UI uses Transfer Sheet naming where applicable

**Increment:** `course/increments/week-02/day-05-mock-ui/`

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Bikes list + add form in React state |
| **Ending state** | Full mock Fix-My-Ride (or student) UI: bikes + bookings + status labels + filter; Week 2 milestone met |

---

## Do Not Teach Yet

- FastAPI, Python, PostgreSQL
- Real HTTP `fetch` to a backend (Week 6)
- Auth / roles in the UI
- Persisting to `localStorage` (optional only if time; not required)
- Edit/delete booking fields beyond status advance

---

## Next Day Bridge

Week 3 Day 1 starts **Python** from zero: variables, conditions, functions, lists, and dicts — the same mental model as JS, new syntax. We will re-implement status rules and in-memory bikes/bookings on the server with FastAPI by end of Week 3.
