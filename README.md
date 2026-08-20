# Cverse Website

Official site for **Cverse** — a coding studio in Namakkal.

**Think. Build. Evolve.** · **Let’s Fun-Code**  
Live domain: [cverse.co.in](https://cverse.co.in)

This repo is a React + Vite + TypeScript landing page: bilingual (English / Tamil), animated, and built as static files you can host on GoDaddy or any static host.

---

## Prerequisites

Install these first:

- [Node.js](https://nodejs.org/) **18 or newer** (LTS recommended)
- npm (comes with Node)
- Git

Check:

```bash
node -v
npm -v
```

---

## 1. Clone and install

```bash
git clone https://github.com/yukeshkumar31/cverse-website.git
cd cverse-website
npm install
```

If your company npm registry blocks packages, install animation libraries from the public registry:

```bash
npm install --registry https://registry.npmjs.org
```

---

## 2. Run locally (development)

```bash
npm run dev
```

Vite prints a local URL, usually:

```
http://localhost:5173
```

Open that in the browser. Edits in `src/` hot-reload.

---

## 3. Production build

```bash
npm run build
```

This runs TypeScript checks, then Vite, and writes a ready-to-host folder:

```
dist/
  index.html
  favicon.svg
  logo.svg
  .htaccess
  robots.txt
  sitemap.xml
  assets/          ← CSS + JS
  images/          ← posters + logo source
```

Preview the production build:

```bash
npm run preview
```

Usually at `http://localhost:4173`.

**Hosting rule:** upload the *contents* of `dist/`, not the `dist` folder itself, and not `src/` or `node_modules`.

---

## 4. Put it on cverse.co.in

### Option A — GoDaddy (cPanel)

1. Run `npm run build` on your machine.
2. GoDaddy → hosting → **cPanel** → **File Manager** → `public_html`.
3. Remove the default parked `index.html` if present.
4. Upload everything inside `dist/`.
5. Visit `https://cverse.co.in`.

If you still see a parked page, attach the domain to the hosting account in GoDaddy DNS and wait for DNS to propagate.

### Option B — GitHub Pages + GoDaddy domain (recommended)

Yes. GitHub hosts the site for free. You keep `cverse.co.in` at GoDaddy and only change DNS.

#### 1. Enable GitHub Pages on the repo

1. Open https://github.com/yukeshkumar31/cverse-website
2. **Settings** → **Pages**
3. Under **Build and deployment** → **Source**, choose **GitHub Actions**
4. Push these files to `main` (workflow + `CNAME`), or merge the PR that adds them
5. **Actions** tab → wait for **Deploy GitHub Pages** to finish green
6. Temporary URL: `https://yukeshkumar31.github.io/cverse-website/`

#### 2. Add custom domain in GitHub

1. Repo → **Settings** → **Pages** → **Custom domain**
2. Enter `cverse.co.in` → **Save**
3. Check **Enforce HTTPS** after DNS is working (may take a few minutes)

`public/CNAME` already contains `cverse.co.in` so builds keep the domain.

#### 3. DNS in GoDaddy

GoDaddy → **My Products** → **Domains** → `cverse.co.in` → **DNS**.

Delete any old A / CNAME / parking records for `@` and `www`, then add:

| Type | Name | Value | TTL |
|------|------|--------|-----|
| A | `@` | `185.199.108.153` | 1 Hour |
| A | `@` | `185.199.109.153` | 1 Hour |
| A | `@` | `185.199.110.153` | 1 Hour |
| A | `@` | `185.199.111.153` | 1 Hour |
| CNAME | `www` | `yukeshkumar31.github.io` | 1 Hour |

Save → wait 5–60 minutes → open `https://cverse.co.in`.

In GitHub **Settings → Pages**, the custom domain should show a green check when DNS is correct.

#### Alternative: Cloudflare Pages / Vercel / Netlify

Same idea: import the GitHub repo (`npm run build`, output `dist`), add `cverse.co.in`, then put that host’s DNS records in GoDaddy.

---

## Project map

```
cverse-website/
├── index.html              SEO, fonts, social tags
├── package.json            Scripts and dependencies
├── vite.config.ts
├── public/                 Copied as-is into dist/
│   ├── favicon.svg
│   ├── logo.svg            Full monitor logo
│   ├── .htaccess           Apache rewrite for GoDaddy
│   └── images/
├── src/
│   ├── App.tsx             Page layout
│   ├── i18n.ts             English + Tamil copy, phone, WhatsApp
│   ├── Language.tsx        Language toggle
│   ├── index.css           Design system and layout
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── LogoMark.tsx    Neon SVG logo + draw animation
│   │   ├── Preloader.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   └── …sections
│   └── hooks/useLenis.ts   Smooth scroll
└── README.md
```

---

## How to change content

| What | Where |
|------|--------|
| Headlines, Tamil text, curriculum | `src/i18n.ts` |
| Phone / WhatsApp / maps | `src/i18n.ts` (`CALL`, `WHATSAPP`, `MAPS`) |
| Colors, spacing, animation CSS | `src/index.css` |
| Logo artwork | `src/components/LogoMark.tsx` and `public/logo.svg` |
| Campaign posters | `public/images/poster-1.png`, `poster-2.png` |

After edits:

```bash
npm run dev          # check locally
npm run build        # before you upload or push
```

---

## npm scripts

| Command | What it does |
|---------|----------------|
| `npm install` | Install dependencies |
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Typecheck + production files in `dist/` |
| `npm run preview` | Serve `dist/` locally |

---

## Stack

- React 18 + TypeScript
- Vite 3
- Framer Motion
- Lenis smooth scroll
- Custom canvas particles, magnetic buttons, neon SVG logo

---

## License

Private project for Cverse. All rights reserved.
