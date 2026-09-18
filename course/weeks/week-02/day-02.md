# Day 2 — Arrays, Objects + Mock Data Modeling

## Learning Objective

By the end of this day, students can model bikes and bookings as JavaScript objects, store them in arrays, read fields, add items, find a bike by id, and create a booking only when a matching bike exists — all with mock (in-memory) data.

## Continuity

Day 1 produced `canChangeStatus`. Today that rule sits next to **data shapes**: each booking has a `status` field; each booking points at a `bikeId`. Students rename fields to Transfer Sheet language where needed (`courseId`, `orderId`, etc.) but keep the same structure.

---

## PART 1 — THEORY

### Trainer script — Why mock data?

> “We do not have a database yet. We still need something on screen. Mock data means we invent a small list of bikes and bookings in JavaScript. The UI will pretend this list is real. Later we replace the fake list with API responses — without changing the meaning of bike and booking.”

### Analogy

A whiteboard list of today’s bikes and jobs is “mock data” for the shop. Paper is temporary; the columns still match the real process.

### Concepts

| Concept | Plain meaning | Example |
|---------|---------------|---------|
| Object | One thing with named fields | `{ id: 1, make: "Honda" }` |
| Array | An ordered list | `[ bike1, bike2 ]` |
| Property access | Read a field | `bike.make` |
| Push | Add to the end of a list | `bikes.push(newBike)` |
| Find | Search the list | `bikes.find(...)` |
| Relationship | Booking remembers bike id | `bikeId: 1` |

### Fix-My-Ride BASE shapes (keep small)

**Bike**

```text
id, make, model, registrationNumber
```

**Booking**

```text
id, bikeId, serviceType, status, notes
```

Business rule practice today:

1. A booking must reference an existing bike id.
2. New bookings start as `booked` (or student’s first status).
3. Status changes still use Day 1’s `canChangeStatus`.

Trainer script:

> “One booking belongs to one bike. In code that means the booking stores the bike’s id — not a second copy of the whole bike.”

---

## PART 2 — PRACTICAL

Suggested folder:

```text
scratch/week-02-day-02/
  statusRules.js   (copy from Day 1 or paste canChangeStatus)
  mockData.js
```

Students: rename `bikes` → their owned-item array name if it helps; keep structure.

---

### Step 1 — One bike object

**Why:** Practice object syntax before lists.

**File:** `mockData.js`

**Code:**

```javascript
const bike = {
  id: 1,
  make: "Honda",
  model: "Activa",
  registrationNumber: "TN09AB1234",
};

console.log(bike.make, bike.registrationNumber);
```

**Explain:** Curly braces make an object. Commas between fields. Dot notation reads a field.

**Run:** `node mockData.js`

**Expected result:** `Honda TN09AB1234`

**Check:** Student can add a field (e.g. `color`) and print it.

---

### Step 2 — Array of bikes

**Why:** The UI will loop over many bikes.

**File:** `mockData.js`

**Code:**

```javascript
const bikes = [
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

console.log("Bike count:", bikes.length);
console.log("First bike:", bikes[0].make);
```

**Explain:** Square brackets make an array. Index `0` is the first item. `.length` is how many.

**Run:** `node mockData.js`

**Expected result:** count `2`, first make `Honda`.

**Check:** Student can print the second bike’s registration number.

---

### Step 3 — Bookings array linked by bikeId

**Why:** Encode the relationship from the Transfer Sheet.

**File:** `mockData.js` (append)

**Code:**

```javascript
const bookings = [
  {
    id: 1,
    bikeId: 1,
    serviceType: "General service",
    status: "booked",
    notes: "Strange noise when starting",
  },
  {
    id: 2,
    bikeId: 2,
    serviceType: "Oil change",
    status: "in_progress",
    notes: "",
  },
];

console.log(bookings[0].status);
console.log("Booking 1 is for bike id:", bookings[0].bikeId);
```

**Explain:** `bikeId: 1` means “this job is for the Honda Activa.” We do not nest the whole bike object inside the booking for BASE.

**Run:** `node mockData.js`

**Expected result:** `booked` and bike id `1`.

**Check:** Student can say which bike booking 2 uses.

---

### Step 4 — Find a bike; reject booking if missing

**Why:** Practice the business rule “need a bike before booking.”

**File:** `mockData.js`

**Code:**

```javascript
function findBikeById(bikeId) {
  return bikes.find(function (bike) {
    return bike.id === bikeId;
  });
}

function createBooking(bikeId, serviceType, notes) {
  const bike = findBikeById(bikeId);
  if (!bike) {
    console.log("Error: no bike with id", bikeId);
    return null;
  }
  if (!serviceType) {
    console.log("Error: serviceType is required");
    return null;
  }

  const booking = {
    id: bookings.length + 1,
    bikeId: bikeId,
    serviceType: serviceType,
    status: "booked",
    notes: notes || "",
  };

  bookings.push(booking);
  console.log("Created booking", booking.id, "for", bike.registrationNumber);
  return booking;
}

createBooking(99, "Brake check", ""); // should fail
createBooking(1, "Brake check", "Front pads"); // should work
console.log("Total bookings:", bookings.length);
```

**Explain:** `find` returns the matching bike or `undefined`. `!bike` means “missing.” `push` adds to the array. New status always starts at the first step.

**Run:** `node mockData.js`

**Expected result:** Error for id 99; success for bike 1; total bookings increases by 1 (from 2 to 3 if starting from Step 3 seed).

**Check:** Student explains why id 99 failed without looking at the code.

---

### Step 5 — Wire Day 1 status rules to a booking

**Why:** Prove status lives on the object and rules still apply.

**File:** `mockData.js` (include `canChangeStatus` from Day 1)

**Code:**

```javascript
function canChangeStatus(from, to) {
  if (from === "booked" && to === "in_progress") return true;
  if (from === "in_progress" && to === "completed") return true;
  return false;
}

function updateBookingStatus(bookingId, newStatus) {
  const booking = bookings.find(function (b) {
    return b.id === bookingId;
  });
  if (!booking) {
    console.log("Error: booking not found");
    return;
  }
  if (!canChangeStatus(booking.status, newStatus)) {
    console.log("Error: cannot go from", booking.status, "to", newStatus);
    return;
  }
  booking.status = newStatus;
  console.log("Booking", bookingId, "is now", booking.status);
}

updateBookingStatus(1, "completed"); // reject if still booked
updateBookingStatus(1, "in_progress"); // ok
updateBookingStatus(1, "completed"); // ok
```

**Explain:** We find the booking, check the rule, then assign `booking.status = newStatus` only if allowed.

**Run:** `node mockData.js`

**Expected result:** First attempt rejected (if booking 1 still `booked`); then two successful updates ending in `completed`.

**Check:** Student can update their Transfer Sheet statuses the same way.

---

### Step 6 — Filter bookings by status (preview of Day 5 UI)

**Why:** Search/filter is a base feature; practice in JS first.

**File:** `mockData.js`

**Code:**

```javascript
function filterBookingsByStatus(status) {
  return bookings.filter(function (booking) {
    return booking.status === status;
  });
}

console.log(
  "in_progress jobs:",
  filterBookingsByStatus("in_progress").map(function (b) {
    return b.id;
  })
);
```

**Explain:** `filter` keeps items that match. `map` pulls just the ids for a short printout.

**Run:** `node mockData.js`

**Expected result:** Array of booking ids currently in `in_progress` (depends on prior steps).

**Check:** Student filters for `booked` and `completed` too.

---

## Student Checkpoint

- [ ] Can write a bike object and a bookings array
- [ ] Can explain what `bikeId` means
- [ ] `createBooking` fails for unknown bike id
- [ ] `updateBookingStatus` uses `canChangeStatus`
- [ ] Can filter bookings by status in the console
- [ ] Mock field names match Transfer Sheet (or Fix-My-Ride for reference builders)

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Day 1 status functions work in isolation |
| **Ending state** | Mock bikes + bookings arrays; create/find/filter/update helpers in JS; ready to display in React |

---

## Do Not Teach Yet

- React components, JSX, hooks
- `fetch`, APIs, JSON files on a server
- PostgreSQL / SQL
- Immutable patterns / Redux
- Fancy array methods beyond `find`, `filter`, `map`, `push`

---

## Next Day Bridge

Tomorrow we create a **Vite + React** app. The mock objects from today will not appear on screen yet — Day 3 is scaffold and title only — but students should keep `mockData.js` ideas ready to paste into the React project on Day 4.
