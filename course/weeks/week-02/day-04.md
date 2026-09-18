# Day 4 — Lists, Props, State: Mock Bikes + Add Bike Form

## Learning Objective

By the end of this day, students display a list of mock bikes in React, pass data with props, hold the list in `useState`, and add a new bike through a simple form so the list updates without a page refresh.

## Continuity

Day 3 left a titled shell. Day 2 defined bike objects. Today those objects become visible UI. Bookings wait until Day 5 so today’s focus stays on **one entity CRUD-create + list**.

---

## PART 1 — THEORY

### Trainer script

> “A list on screen is a loop over an array. State is the live array React remembers. When we add a bike, we do not edit the HTML by hand — we update state, and React redraws the list.”

### Concepts

| Concept | Plain meaning |
|---------|---------------|
| `.map` | Turn each array item into JSX |
| `key` | Stable id React uses for list items |
| Props | Inputs passed into a child component |
| `useState` | Remember a value that can change; changing it re-renders |
| Controlled input | Input value lives in state |

### Analogy

The bike list is a clipboard. `useState` is the clipboard itself. Adding a bike is writing a new line on the clipboard — everyone looking at it sees the new line.

### Transfer Sheet

| Fix-My-Ride | Student UI labels |
|-------------|-------------------|
| Bikes | Their owned-item plural name |
| Make / Model / Registration | Their fields (keep 2–4 fields) |

---

## PART 2 — PRACTICAL

Continue in the Day 3 Vite project.

Suggested files by end of day:

```text
src/
  App.jsx
  AppTitle.jsx
  mockData.js
  BikeList.jsx
  AddBikeForm.jsx
  statusRules.js   (optional; used Day 5)
```

---

### Step 1 — Add mock bikes module

**Why:** Keep sample data in one place (same idea as Day 2).

**File:** `src/mockData.js`

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
```

**Explain:** `export` lets other files import this array. We will copy it into state so we can change it later without mutating the module constantly.

**Run:** No browser change yet until imported.

**Expected result:** File saves cleanly; no syntax errors in the terminal.

**Check:** Student renamed fields if Transfer Sheet differs (e.g. `title`, `author` for books).

---

### Step 2 — Render the list with `.map` inside App

**Why:** See bikes before splitting components.

**File:** `src/App.jsx`

**Code:**

```javascript
import AppTitle from "./AppTitle.jsx";
import { initialBikes } from "./mockData.js";

function App() {
  return (
    <main>
      <AppTitle />
      <h2>Bikes</h2>
      <ul>
        {initialBikes.map(function (bike) {
          return (
            <li key={bike.id}>
              {bike.make} {bike.model} — {bike.registrationNumber}
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default App;
```

**Explain:** Curly braces `{}` embed JS inside JSX. `.map` returns one `<li>` per bike. `key={bike.id}` helps React track items — use the real id, not the array index when you have ids.

**Run:** Dev server; view page.

**Expected result:** Two bikes listed under “Bikes.”

**Check:** Student sees their mock rows with their labels.

---

### Step 3 — Extract `BikeList` with props

**Why:** Practice props; keep App cleaner.

**File:** `src/BikeList.jsx` + update `App.jsx`

**Code:**

```javascript
// src/BikeList.jsx
function BikeList(props) {
  const bikes = props.bikes;

  if (bikes.length === 0) {
    return <p>No bikes yet. Add one below.</p>;
  }

  return (
    <section>
      <h2>Bikes</h2>
      <ul>
        {bikes.map(function (bike) {
          return (
            <li key={bike.id}>
              {bike.make} {bike.model} — {bike.registrationNumber}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default BikeList;
```

```javascript
// src/App.jsx (relevant parts)
import BikeList from "./BikeList.jsx";
import { initialBikes } from "./mockData.js";

function App() {
  return (
    <main>
      <AppTitle />
      <BikeList bikes={initialBikes} />
    </main>
  );
}
```

**Explain:** `bikes={initialBikes}` passes the array in. Inside the child, `props.bikes` receives it. Empty state message prepares for a real empty list later.

**Run:** Browser should look the same as Step 2.

**Expected result:** Same two bikes; code now split.

**Check:** Ask student to temporarily pass `bikes={[]}` and see the empty message, then restore.

---

### Step 4 — Lift bikes into `useState`

**Why:** Static imports cannot grow when the user adds a bike. State can.

**File:** `src/App.jsx`

**Code:**

```javascript
import { useState } from "react";
import AppTitle from "./AppTitle.jsx";
import BikeList from "./BikeList.jsx";
import { initialBikes } from "./mockData.js";

function App() {
  const [bikes, setBikes] = useState(initialBikes);

  return (
    <main>
      <AppTitle />
      <BikeList bikes={bikes} />
    </main>
  );
}

export default App;
```

**Explain:** `useState(initialBikes)` returns the current list and a setter. We pass `bikes` (state) into `BikeList`. Tomorrow and later, `setBikes` will update the list.

**Run:** Page still shows two bikes.

**Expected result:** No visual change; foundation for the form.

**Check:** Student can say: “`bikes` is state; `setBikes` changes it.”

---

### Step 5 — Add bike form (controlled inputs)

**Why:** Create is a base CRUD skill; local-only is enough this week.

**File:** `src/AddBikeForm.jsx`

**Code:**

```javascript
import { useState } from "react";

function AddBikeForm(props) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!make || !model || !registrationNumber) {
      alert("Please fill make, model, and registration number.");
      return;
    }

    props.onAddBike({
      make: make,
      model: model,
      registrationNumber: registrationNumber,
    });

    setMake("");
    setModel("");
    setRegistrationNumber("");
  }

  return (
    <section>
      <h2>Add bike</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Make{" "}
            <input
              value={make}
              onChange={function (e) {
                setMake(e.target.value);
              }}
            />
          </label>
        </p>
        <p>
          <label>
            Model{" "}
            <input
              value={model}
              onChange={function (e) {
                setModel(e.target.value);
              }}
            />
          </label>
        </p>
        <p>
          <label>
            Registration{" "}
            <input
              value={registrationNumber}
              onChange={function (e) {
                setRegistrationNumber(e.target.value);
              }}
            />
          </label>
        </p>
        <button type="submit">Save bike</button>
      </form>
    </section>
  );
}

export default AddBikeForm;
```

**Explain:** Each input’s `value` comes from state; `onChange` updates state. `preventDefault` stops a full page reload. The form does not know the full list — it calls `props.onAddBike` with the new fields.

**Run:** Not wired yet — next step.

**Expected result:** File created; unused until imported.

**Check:** Student uses their field labels in the form.

---

### Step 6 — Wire form to App state

**Why:** Completing create → list refresh.

**File:** `src/App.jsx`

**Code:**

```javascript
import { useState } from "react";
import AppTitle from "./AppTitle.jsx";
import BikeList from "./BikeList.jsx";
import AddBikeForm from "./AddBikeForm.jsx";
import { initialBikes } from "./mockData.js";

function App() {
  const [bikes, setBikes] = useState(initialBikes);

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

  return (
    <main>
      <AppTitle />
      <BikeList bikes={bikes} />
      <AddBikeForm onAddBike={handleAddBike} />
    </main>
  );
}

export default App;
```

**Explain:** `Date.now()` gives a quick unique id for mock data (good enough until the database assigns ids). `concat` returns a new array — clear for beginners. After submit, the list should show the new bike.

**Run:** Fill the form; click Save bike.

**Expected result:** New row appears; form fields clear; refresh of the browser **resets** to mock seed (expected — no database yet).

**Check:** Student successfully adds at least one bike. Trainer notes: refresh loss is normal this week.

---

## Student Checkpoint

- [ ] Bike list renders from state
- [ ] `BikeList` receives `bikes` via props
- [ ] Add form validates required fields
- [ ] Submitting adds a bike to the list
- [ ] UI labels match Transfer Sheet names
- [ ] Student can explain why refresh clears new bikes

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Titled React shell; mock data only in Day 2 scratch |
| **Ending state** | Mock bikes list + working add-bike form in local React state |

---

## Do Not Teach Yet

- Bookings UI / status filter (Day 5)
- Edit/delete bike (can be Enhance Later or later week)
- `fetch` / FastAPI
- Global state libraries
- CSS frameworks

---

## Next Day Bridge

Tomorrow we add **mock bookings**: list, create-booking form (must pick an existing bike), status labels, and a **filter by status**. That completes the Week 2 milestone.
