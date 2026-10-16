# Eventura Admin Panel Setup Guide

This guide will help you set up the Eventura admin panel with Cloudflare Pages Functions as the backend and Cloudflare R2 for storage.

## Project Structure

```
eventura-main/
├── backend/                # Cloudflare Workers backend
│   ├── functions/          # Cloudflare Pages Functions (API)
│   │   ├── api/
│   │   │   ├── login.ts    # Admin login endpoint
│   │   │   ├── upload.ts   # Image upload endpoint
│   │   │   ├── delete.ts   # Image deletion endpoint
│   │   │   ├── image.ts    # Image proxy endpoint
│   │   │   ├── manifest/   # Content management endpoints
│   │   │   │   └── [section].ts
│   │   │   └── _lib/
│   │   │       └── auth.ts # JWT authentication utilities
│   ├── wrangler.toml       # Cloudflare configuration
│   └── package.json        # Backend dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Admin panel pages
│   │   │   └── page.tsx    # Public website
│   │   ├── components/     # React components
│   │   └── lib/           # Utilities and data
│   ├── public/            # Static assets
│   ├── next.config.ts     # Next.js configuration
│   └── package.json       # Frontend dependencies
└── package.json           # Root mono-repo scripts
```

## Prerequisites

- Node.js 18+ installed
- Cloudflare account (free tier works)
- Git (for deployment)

---

## Step 1 — Install dependencies

```bash
npm install
```

This installs dependencies for both frontend and backend workspaces.

---

## Step 2 — Log in to Cloudflare

```bash
npx wrangler login
```

A browser window opens. Log in with your Cloudflare account (the same one your `eventura` Pages project is on).

---

## Step 3 — Create the R2 bucket

In the Cloudflare dashboard:
1. Go to **R2 Object Storage** → **Create bucket**
2. Name it exactly: **`eventura-cms`**
3. Region: **Automatic** (or nearest to India)
4. Click **Create bucket**

> The bucket does **not** need to be public. Images are served through the `/api/image` proxy function, not directly from R2.

---

## Step 4 — Set environment secrets

In the Cloudflare dashboard:
1. Go to **Workers & Pages → eventura → Settings → Environment Variables**
2. Click **Add variable** → set **Type = Secret** for both

| Variable name    | Value                              |
|------------------|------------------------------------|
| `ADMIN_PASSWORD` | Your chosen admin login password   |
| `JWT_SECRET`     | A random 32+ character string      |

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> ⚠️ Keep both secrets private. Never commit them to Git.

---

## Step 5 — Add the R2 binding to your Pages project

In the Cloudflare dashboard:
1. **Workers & Pages → eventura → Settings → Functions → R2 bucket bindings**
2. Click **Add binding**
3. Variable name: **`EVENTURA_R2`**
4. R2 bucket: **`eventura-cms`** (select from dropdown)
5. Click **Save**

Repeat for both **Production** and **Preview** environments.

---

## Step 6 — Deploy

```bash
npm run deploy
```

This runs `next build` (produces `out/`) then `wrangler pages deploy out`. It takes about 60 seconds. The terminal shows the deployment URL when done.

---

## Step 7 — Verify the admin panel

1. Open **https://www.e-ventura.com/admin** in your browser
2. Log in with the `ADMIN_PASSWORD` you set in Step 4
3. You should see the dashboard

---

## End-to-end workflow test

1. Go to **Portfolio** in the admin panel
2. Upload a test image from your phone gallery
3. Edit its title and category
4. Click **Publish**
5. Open **https://www.e-ventura.com** in a new tab
6. Scroll to the Portfolio section — your image should appear within ~30 seconds
7. Hard-refresh (`Ctrl+Shift+R`) — image still there (persisted in R2)
8. Go back to admin, click **Save Draft** on a change (do NOT click Publish)
9. Confirm the draft change is NOT visible to public visitors

---

## Local development (optional)

To test the Functions locally:
```bash
npx wrangler pages dev out
```

For local secrets, create a `.dev.vars` file (git-ignored):
```
ADMIN_PASSWORD=localdevpassword
JWT_SECRET=localdevjwtsecretxxxxxxxxxxxxxxxx
```

> **Do not add a real R2 bucket to local dev** — use the `preview_bucket_name` in `wrangler.toml` if you create a dev bucket.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Server misconfigured" on login | `ADMIN_PASSWORD` or `JWT_SECRET` env vars not set in Cloudflare Pages → Settings |
| "Image not found" (404) | `EVENTURA_R2` binding not set, or bucket name mismatch |
| Admin page shows blank | Make sure `npm run build` succeeded before deploying |
| Published image not showing on site | Wait 30–60 seconds (CDN cache TTL). Hard-refresh with Ctrl+Shift+R |
| Upload fails with 413 | Image is over 8 MB. Resize/compress and try again |
| "Unauthorized" on all writes | JWT expired (valid 24h). Log out and log back in |

---

## File locations at a glance

| What | Where |
|---|---|
| Backend API routes | `backend/functions/api/` |
| Admin panel pages | `frontend/src/app/admin/` |
| API client helpers | `frontend/src/lib/admin-api.ts` |
| Cloudflare config | `backend/wrangler.toml` |
| Env var docs | `.env.example` |

## Development commands

| Command | Description |
|---|---|
| `npm run dev` | Start frontend dev server (Next.js) |
| `npm run build` | Build frontend for production |
| `npm run deploy` | Build and deploy to Cloudflare Pages |
| `npm run backend:dev` | Run backend locally with Wrangler |
