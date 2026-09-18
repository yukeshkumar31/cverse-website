# Day 2 — UX Polish (No New Features)

## Learning Objective

Students improve clarity of the BASE UI: Transfer Sheet labels, empty states, loading/error text, and basic layout hierarchy — without adding entities, roles, or Enhance Later capabilities.

## Continuity

Demo script exists. Today the app looks and reads like *their* product, not a pile of Fix-My-Ride leftovers.

---

## PART 1 — THEORY

### Trainer script

> “Polish is kindness to the next user — including Friday-you under stress. Empty list should say what to do next. Errors should be human. Buttons should use your words: Loan, not Booking — if that is your sheet.”

### Allowed polish

- Rename visible strings to Transfer Sheet  
- Empty states (“No bikes yet — add one”)  
- Consistent spacing / simple CSS  
- Disable illegal buttons already handled  
- Show role + name in header  

### Forbidden today

- Chat, payments, maps, dashboards with charts  
- Third role  
- New API endpoints “while we’re here”  

### Analogy

Polish = cleaning the shop floor before customers arrive — not building a second floor.

---

## PART 2 — PRACTICAL

---

### Step 1 — String pass

**Why:** Domain ownership.

**File:** `App.jsx` / CSS

**Code:** Find/replace user-visible “Bike/Booking” with sheet nouns; keep API paths as implemented (document mapping in README tomorrow if paths stayed English bike words).

**Explain:** Prefer renaming UI first; route renames only if already consistent.

**Run:** Click through both roles.

**Expected result:** UI language matches sheet.

**Check:** Status labels match the three sheet words.

---

### Step 2 — Empty + loading + error

**Why:** Demo resilience.

**File:** list components

**Code:**

```jsx
{loading && <p>Loading…</p>}
{error && <p className="error">{error}</p>}
{!loading && !error && items.length === 0 && (
  <p className="muted">No items yet. Add your first one to begin.</p>
)}
```

**Explain:** Customize message per panel.

**Run:** Filter to empty status; confirm message.

**Expected result:** No blank silent panels.

**Check:** Error from 403 still readable.

---

### Step 3 — Header identity

**Why:** Role clarity in demo.

**File:** shell

**Code:**

```jsx
<header>
  <strong>{appTitle}</strong>
  <span>{user.full_name} ({user.role})</span>
  <button type="button" onClick={logout}>Log out</button>
</header>
```

**Explain:** Staff vs customer obvious on projector.

**Run:** Switch accounts.

**Expected result:** Header updates.

**Check:** Logout works.

---

### Step 4 — Light CSS only

**Why:** Readable projection.

**File:** `index.css`

**Code:** Improve contrast, spacing, form width; avoid purple-glow AI clichés if designing fresh — keep existing design system if any.

**Explain:** 30–40 minutes max.

**Run:** Desktop + narrow window.

**Expected result:** Usable on projector.

**Check:** No broken layout.

---

### Step 5 — Re-time demo

**Why:** Ensure polish didn’t break script.

**File:** DEMO.md

**Code:** Dry run again.

**Explain:** Fix regressions only.

**Run:** Partner timer.

**Expected result:** Still < 4 minutes.

**Check:** Update won’t-fix list.

---

## Student Checkpoint

- [ ] Transfer Sheet words in UI  
- [ ] Empty/loading/error states  
- [ ] Header shows user/role  
- [ ] No new features added  
- [ ] Demo still works  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Stable but rough UI |
| **Ending state** | Clearer BASE UX |

---

## Do Not Teach Yet

- Marketing landing pages  
- Component libraries marathon  
- Accessibility audits beyond basics  

---

## Next Day Bridge

Tomorrow we write a **README** so someone else (or future you) can run the app from zero: stack, setup, demo accounts, Enhance Later.
