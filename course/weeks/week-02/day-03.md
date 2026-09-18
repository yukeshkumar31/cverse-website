# Day 3 — Vite + React Scaffold, First Component, App Title

## Learning Objective

By the end of this day, every student has a running Vite + React (JavaScript) app that displays their project title. They know what folders mean, how to start the dev server, and how to edit a component and see the browser update.

## Continuity

Days 1–2 built logic and mock shapes in Node. Today we create the **frontend home** for that work. We do not load bikes yet — a green, titled shell is the win. Mock data returns on Day 4.

---

## PART 1 — THEORY

### Trainer script — Why React + Vite?

> “Users look at a screen. React helps us build screens from small pieces called components. Vite is the tool that starts a fast development server so when you save a file, the browser updates. We use JavaScript only — no TypeScript in this course.”

### Mental model

```text
Browser
  → loads your React app
  → App component returns what to show
  → Vite watches your files while you develop
```

### Words to introduce (keep few)

| Word | Meaning |
|------|---------|
| Component | A function that returns UI |
| JSX | HTML-like syntax inside JavaScript |
| `npm` | Installs packages and runs scripts |
| Dev server | Local website while coding (`npm run dev`) |
| Hot reload | Save file → browser updates |

### Trainer script — Transfer Sheet

> “The title on screen should be YOUR app name from Week 1 — not only Fix-My-Ride. Fix-My-Ride is the trainer demo.”

### Analogy

Scaffolding is the empty shop building with a signboard. Shelves (lists) and forms arrive tomorrow.

---

## PART 2 — PRACTICAL

Use the official Vite React JavaScript template. Trainer demos Fix-My-Ride; students use their project folder name.

Suggested location:

```text
~/projects/fix-my-ride-frontend/     # trainer
~/projects/<student-app>-frontend/  # student
```

---

### Step 1 — Create the Vite React app

**Why:** Generate a known-good starter instead of hand-writing config.

**File:** (created by tool)

**Code / commands:**

```bash
npm create vite@latest fix-my-ride-frontend -- --template react
cd fix-my-ride-frontend
npm install
```

Student variant: replace `fix-my-ride-frontend` with their short app name (no spaces).

**Explain:** `create vite` scaffolds the project. `--template react` chooses React with JavaScript. `npm install` downloads dependencies listed in `package.json`.

**Run:** Commands above (needs network).

**Expected result:** Folder with `package.json`, `src/App.jsx`, `src/main.jsx`, no error at end of install.

**Check:** `ls` shows `node_modules` and `src`.

---

### Step 2 — Start the dev server

**Why:** Prove the app runs before editing.

**File:** none

**Code / commands:**

```bash
npm run dev
```

**Explain:** Vite prints a local URL (often `http://localhost:5173`). Leave this terminal running while coding.

**Run:** Open the URL in the browser.

**Expected result:** Default Vite + React starter page (logos, counter, etc.).

**Check:** Trainer walks the room — every laptop shows the starter page.

---

### Step 3 — Meet the entry files

**Why:** Students must know where to edit.

**File:** Read only — `src/main.jsx`, `src/App.jsx`

**Code:** (typical shape — versions may differ slightly)

```javascript
// src/main.jsx — starts React and mounts App
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

**Explain:** `main.jsx` finds the `#root` div in `index.html` and renders `<App />`. Almost all student work for Weeks 2 and 6 lives under `src/`.

**Run:** No run — discussion + point at files.

**Expected result:** Students can point to `App.jsx` as “the main screen.”

**Check:** Ask: “Which file do we change to change the title?” → `App.jsx` (for now).

---

### Step 4 — Replace starter UI with project title

**Why:** Own the app; remove noise.

**File:** `src/App.jsx`

**Code:**

```javascript
function App() {
  return (
    <main>
      <h1>Fix-My-Ride</h1>
      <p>Bike service bookings — base version</p>
    </main>
  );
}

export default App;
```

Student example:

```javascript
function App() {
  return (
    <main>
      <h1>Campus Book Share</h1>
      <p>Track borrowed books — base version</p>
    </main>
  );
}

export default App;
```

**Explain:** A component is a function named with a Capital letter. It `return`s JSX. `<h1>` is the visible title. `export default App` lets `main.jsx` import it.

**Run:** Save file; browser hot-reloads (dev server still running).

**Expected result:** Page shows project title and one short subtitle. Default Vite logos/counter are gone.

**Check:** Title matches Transfer Sheet / approved project name.

---

### Step 5 — Tiny style so it is readable (optional but recommended)

**Why:** Readable ≠ polished design system.

**File:** `src/index.css` (replace contents)

**Code:**

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  background: #f3efe6;
  color: #1a1a1a;
}

main {
  max-width: 720px;
  margin: 2rem auto;
  padding: 1.5rem;
}

h1 {
  margin-bottom: 0.25rem;
}
```

**Explain:** Simple page background and readable type. Do not spend the hour on CSS.

**Run:** Save; view in browser.

**Expected result:** Title centered-ish on a warm page background.

**Check:** Still no bike list — title only is success for Day 3.

---

### Step 6 — First child component (title only)

**Why:** Practice components before lists.

**File:** `src/AppTitle.jsx` (new) + update `src/App.jsx`

**Code:**

```javascript
// src/AppTitle.jsx
function AppTitle() {
  return (
    <header>
      <h1>Fix-My-Ride</h1>
      <p>Bike service bookings — base version</p>
    </header>
  );
}

export default AppTitle;
```

```javascript
// src/App.jsx
import AppTitle from "./AppTitle.jsx";

function App() {
  return (
    <main>
      <AppTitle />
    </main>
  );
}

export default App;
```

**Explain:** `<AppTitle />` is using a component like a custom HTML tag. Import path must match the file name.

**Run:** Save both files; refresh if needed.

**Expected result:** Same visible title as Step 4, now from a child component.

**Check:** Student can change text inside `AppTitle.jsx` and see it update.

---

## Student Checkpoint

- [ ] Project created with Vite React **JavaScript** template (not TS)
- [ ] `npm run dev` works
- [ ] Browser shows **their** app title
- [ ] Can edit `App.jsx` / `AppTitle.jsx` and see hot reload
- [ ] Can explain in one sentence: “App is a component that returns what I see”

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Mock JS logic exists outside React; no frontend project required yet |
| **Ending state** | Vite React app runs; title component shows approved project name |

**Increment reference:** `course/increments/week-02/day-03-react-shell/`

---

## Do Not Teach Yet

- `useState`, forms, lists (Day 4)
- Props drilling beyond a single child (light props OK Day 4)
- React Router, Redux, UI libraries
- Calling FastAPI / `fetch`
- TypeScript

---

## Next Day Bridge

Tomorrow we put Day 2’s **mock bikes** on the screen with `.map`, introduce **props** and **useState**, and build an **add bike** form that updates local state only.
