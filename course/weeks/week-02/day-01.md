# Day 1 — JavaScript Fundamentals + Status Transition Rules

## Learning Objective

By the end of this day, students can write small JavaScript programs using variables, conditions, and functions — and implement the Fix-My-Ride (or Transfer Sheet) status rules in pure JS so invalid jumps are rejected.

## Continuity

Week 1 ended with an approved Transfer Sheet: entities, one status flow of exactly three steps, and at least one business rule. Today we turn that status flow into **code** before any UI framework. Students keep their own status labels; trainers demo with `booked → in_progress → completed`.

---

## PART 1 — THEORY

### Trainer script — Why JavaScript first?

> “Your blueprint says a booking cannot jump from booked to completed. A screen button is not enough — we need a clear rule in code. JavaScript is the language of the browser. We learn just enough JS to write that rule, then we will reuse the same idea in React, then again in Python.”

### Analogy

Think of a service ticket on a wall board with three columns: Waiting → Being serviced → Done. A staff member may only move a ticket one column to the right. Jumping columns breaks the shop process. Our function is that rule.

### Concepts (teach only these)

| Concept | Plain meaning | Fix-My-Ride example |
|---------|---------------|---------------------|
| Variable | A named box that holds a value | `let status = "booked"` |
| String | Text in quotes | `"in_progress"` |
| Boolean | true / false | `canTransition` |
| Condition | If this, then that | `if (from === "booked")` |
| Function | A reusable recipe | `canChangeStatus(from, to)` |
| Return | Send an answer back | `return true` or `return false` |

### Status rules (BASE)

```text
Allowed:
  booked      → in_progress
  in_progress → completed

Not allowed:
  booked      → completed   (skip)
  completed   → anything    (finished)
  in_progress → booked      (backwards)
  same → same               (no-op; treat as invalid or ignore — we reject)
```

Trainer script:

> “Write the rule once. Call it many times. Later the backend will own this rule for real. Today we practice the logic in the console.”

### Transfer Sheet

Students replace the three strings with their own status values. The **shape of the rule** stays the same: only forward, one step at a time.

---

## PART 2 — PRACTICAL

Work in a scratch folder or Node REPL. Prefer a single file so students can save and re-run.

Suggested folder (trainer Fix-My-Ride demo):

```text
scratch/week-02-day-01/
  statusRules.js
```

Students: same file name is fine; change string values to Transfer Sheet labels.

---

### Step 1 — Variables for one booking

**Why:** Name the current status so we can talk about it in code.

**File:** `statusRules.js`

**Code:**

```javascript
let bookingStatus = "booked";
console.log("Current status:", bookingStatus);
```

**Explain:** `let` creates a variable we can change later. Strings use double quotes. `console.log` prints so we can see results.

**Run:**

```bash
node statusRules.js
```

**Expected result:**

```text
Current status: booked
```

**Check:** Student sees their first status label printed (or `booked` for Fix-My-Ride).

---

### Step 2 — A condition that checks one transition

**Why:** Practice `if` before wrapping logic in a function.

**File:** `statusRules.js` (append / replace)

**Code:**

```javascript
let from = "booked";
let to = "in_progress";

if (from === "booked" && to === "in_progress") {
  console.log("Allowed");
} else {
  console.log("Not allowed");
}
```

**Explain:** `===` means “exactly equal.” `&&` means both must be true. Change `to` to `"completed"` and re-run — should print Not allowed.

**Run:** `node statusRules.js`

**Expected result:** `Allowed` for booked → in_progress; `Not allowed` for booked → completed.

**Check:** Student can flip `to` and predict the message before running.

---

### Step 3 — Function that returns true/false

**Why:** The rule must be reusable from React buttons later and from tests today.

**File:** `statusRules.js`

**Code:**

```javascript
function canChangeStatus(from, to) {
  if (from === "booked" && to === "in_progress") {
    return true;
  }
  if (from === "in_progress" && to === "completed") {
    return true;
  }
  return false;
}

console.log("booked → in_progress:", canChangeStatus("booked", "in_progress"));
console.log("booked → completed:", canChangeStatus("booked", "completed"));
console.log("in_progress → completed:", canChangeStatus("in_progress", "completed"));
console.log("completed → booked:", canChangeStatus("completed", "booked"));
```

**Explain:** Parameters `from` and `to` are inputs. `return true` means yes. If nothing matched, `return false`. Order matters: check allowed pairs first, then deny everything else.

**Run:** `node statusRules.js`

**Expected result:**

```text
booked → in_progress: true
booked → completed: false
in_progress → completed: true
completed → booked: false
```

**Check:** All four lines match. Student using Transfer Sheet swaps the three status strings consistently in the function and in the console.log calls.

---

### Step 4 — Optional clearer structure (allowed map)

**Why:** Shows another readable way; still pure JS. Use if students finish early.

**File:** `statusRules.js`

**Code:**

```javascript
const ALLOWED = {
  booked: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
};

function canChangeStatus(from, to) {
  const nextOptions = ALLOWED[from];
  if (!nextOptions) {
    return false;
  }
  return nextOptions.includes(to);
}

function nextStatus(from) {
  const options = ALLOWED[from] || [];
  return options[0] || null;
}

console.log(canChangeStatus("booked", "in_progress")); // true
console.log(nextStatus("booked")); // "in_progress"
console.log(nextStatus("completed")); // null
```

**Explain:** An object maps each status to an array of allowed next statuses. `includes` checks membership. `nextStatus` helps UI later (“what is the only next step?”).

**Run:** `node statusRules.js`

**Expected result:** `true`, then `in_progress`, then `null`.

**Check:** Student can explain why `completed` has an empty list.

---

### Step 5 — Apply transition only when allowed

**Why:** Separate “asking if allowed” from “changing the value.”

**File:** `statusRules.js`

**Code:**

```javascript
function applyStatusChange(current, to) {
  if (!canChangeStatus(current, to)) {
    console.log("Rejected:", current, "→", to);
    return current;
  }
  console.log("Updated:", current, "→", to);
  return to;
}

let status = "booked";
status = applyStatusChange(status, "completed"); // rejected
status = applyStatusChange(status, "in_progress"); // ok
status = applyStatusChange(status, "completed"); // ok
console.log("Final:", status);
```

**Explain:** Invalid change leaves status unchanged. Valid change returns the new status. This mirrors what the backend will do later with HTTP errors.

**Run:** `node statusRules.js`

**Expected result:** One Rejected line, two Updated lines, Final: `completed`.

**Check:** Student narrates the three attempts in order.

---

## Student Checkpoint

- [ ] Can create a variable and print it with `console.log`
- [ ] Can write an `if` / `else` that compares strings
- [ ] Has a working `canChangeStatus(from, to)` for their three statuses
- [ ] Can show at least one allowed and one rejected transition
- [ ] Transfer Sheet status labels are used (or Fix-My-Ride if building the reference)

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Transfer Sheet with 3 status labels; no JS project required |
| **Ending state** | `statusRules.js` (or equivalent) with working transition functions; student can run `node` and show true/false cases |

---

## Do Not Teach Yet

- Arrays of many bookings (Day 2)
- React, JSX, Vite (Day 3+)
- HTTP, FastAPI, databases
- TypeScript, classes, modules beyond a single file
- CSS / UI design

---

## Next Day Bridge

Tomorrow we model **bikes and bookings as objects inside arrays** — mock data that looks like what the UI will show. The status strings from today become a field on each booking object.
