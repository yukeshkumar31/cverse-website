# Day 4 — GitHub + Project Hygiene

## Learning Objective

Students publish their BASE app to GitHub with a clean tree (dependencies and secrets excluded), a solid README, and a shareable repo URL for assessment.

## Continuity

README written. Today the project leaves the laptop.

---

## PART 1 — THEORY

### Trainer script

> “GitHub is not a dumpster. Commit source and docs. Ignore secrets and generated folders. Your README is the homepage of the repo.”

### Must ignore

```text
node_modules/
.venv/
__pycache__/
.env
.DS_Store
dist/
*.pyc
```

### Analogy

Repo = shipping a recipe book. Don’t ship your entire kitchen (venv) or your house keys (`.env`).

---

## PART 2 — PRACTICAL

---

### Step 1 — Verify .gitignore

**Why:** Prevent secret leaks.

**File:** `.gitignore`

**Code:** Ensure entries above exist; add OS junk as needed.

**Explain:** If `.env` was committed earlier, rotate SECRET_KEY and remove from history with trainer help — at minimum delete from future commits and warn.

**Run:** `git status` should not list `.env` or `node_modules`.

**Expected result:** Clean untracked noise.

**Check:** Trainer spot-checks.

---

### Step 2 — Final commit locally

**Why:** Freeze demo code.

**File:** repo

**Code:**

```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
Ship BASE app for C-VERSE Week 8 demo.

EOF
)"
```

Only if git is in use; follow course commit rules / user preferences.

**Explain:** Message describes why: ship BASE.

**Run:** Commit succeeds.

**Expected result:** Clean working tree or only intentional leftovers.

**Check:** No Cursor co-author trailers if that is a course rule for the student machine.

---

### Step 3 — Create GitHub repo + push

**Why:** BASE feature #10.

**File:** remote

**Code:**

```bash
# example using gh
gh repo create my-cverse-app --private --source=. --remote=origin --push
```

Or create via github.com UI and:

```bash
git remote add origin git@github.com:USER/REPO.git
git push -u origin HEAD
```

**Explain:** Private vs public per school policy.

**Run:** Open repo in browser; confirm README renders.

**Expected result:** URL works.

**Check:** Submit URL on course form.

---

### Step 4 — Clone test (pair)

**Why:** Prove completeness.

**File:** none

**Code:** Partner clones into a temp folder; follows README until backend `/health` (DB may need create).

**Explain:** Note missing steps back into README.

**Run:** 20–30 minutes.

**Expected result:** Health OK or documented blocker (Postgres install).

**Check:** Update README if clone failed for doc reasons.

---

### Step 5 — Tag demo version (optional)

**Why:** Freeze Friday bits.

**File:** git tag

**Code:**

```bash
git tag -a v0.1-base -m "C-VERSE BASE demo"
git push origin v0.1-base
```

**Explain:** Optional.

**Run:** If time.

**Expected result:** Tag visible.

**Check:** Skip if unfamiliar.

---

## Student Checkpoint

- [ ] Secrets not in repo  
- [ ] GitHub URL submitted  
- [ ] README visible on GitHub  
- [ ] Clone/run attempt done  
- [ ] Demo script still aligned with pushed code  

---

## Starting State / Ending State

| | |
|--|--|
| **Starting state** | Local documented app |
| **Ending state** | GitHub-hosted BASE |

---

## Do Not Teach Yet

- GitHub Actions CI  
- Force-push workflows  
- Monorepo tooling  

---

## Next Day Bridge

Tomorrow is **demo day**: run the script, narrate the architecture, show Enhance Later, celebrate. No coding unless a blocker appears.
