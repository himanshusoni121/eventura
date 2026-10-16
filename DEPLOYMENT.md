# Eventura — Site, Content & Deployment Guide

Everything about where the site runs, how to change it, and where to see visitor data.

## 1. Where things live

| Thing | Where |
| --- | --- |
| Live site | https://www.e-ventura.com (https://e-ventura.com redirects to it) |
| Cloudflare URL | https://eventura.pages.dev |
| Code | https://github.com/himanshusoni121/eventura |
| Hosting | Cloudflare Pages, project name `eventura` |
| Domain / DNS | GoDaddy (`www` CNAME → `eventura.pages.dev`, apex forwards to `https://www.e-ventura.com`) |

The site is a **static export** of a Next.js app: `next build` writes plain HTML/CSS/JS into `out/`, and that folder is uploaded to Cloudflare. There is no server or database — the contact and planner forms open WhatsApp with a prefilled message instead of storing data.

## 2. One-time setup on your computer

1. Install **Node.js 22 or newer** — https://nodejs.org (`node -v` must print `v22.x` or higher; Wrangler refuses to run on Node 20).
2. Install **Git** — https://git-scm.com
3. Clone the repo and install dependencies:

```bash
git clone https://github.com/himanshusoni121/eventura.git
cd eventura
npm install
```

4. Log in to Cloudflare once (opens a browser):

```bash
npx wrangler login
```

## 3. Preview the site locally

```bash
npm run dev
```

Open http://localhost:3000. Edits to files are reflected immediately. Press `Ctrl+C` to stop.

## 4. Making changes

### 4.1 Text, phone number, services, portfolio, testimonials, FAQs
Almost all site content is in **`frontend/src/lib/data.ts`**. Edit the values there:

| What you want to change | Variable in `frontend/src/lib/data.ts` |
| --- | --- |
| Business name, tagline, phone, WhatsApp, address, office hours, social links | `siteConfig` |
| Menu items | `navLinks` |
| Service cards | `services` |
| Numbers in the statistics strip | `stats` |
| Portfolio filter buttons | `portfolioCategories` |
| Portfolio / Our Work projects | `portfolioItems` |
| "Why choose us" points | `whyChooseUs` |
| "Our process" steps | `processSteps` |
| Client testimonials | `testimonials` |
| FAQ questions & answers | `faqs` |
| Event types in the planner form | `eventTypes` |

Example — change the phone number:

```ts
export const siteConfig = {
  phone: "8279088558",        // ← change this
  whatsapp: "+918279088558",  // ← and this (WhatsApp button + form submissions)
  ...
};
```

### 4.2 Images
Put image files in **`frontend/public/images/`**, then reference them by path, e.g. `/images/my-photo.jpg`.
Keep files small (under ~500 KB each) so pages load fast; use `.jpg` for photos and `.png` for logos.

### 4.3 Page layout / design
- Sections of the home page: `frontend/src/components/` (`Hero.tsx`, `About.tsx`, `Services.tsx`, `Portfolio.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `Contact.tsx`, `Footer.tsx`, …)
- Our Work page: `frontend/src/app/our-work/page.tsx` + `frontend/src/components/our-work/`
- Planner page: `frontend/src/app/planner/page.tsx` + `frontend/src/components/planner/MultiStepForm.tsx`
- Colours, fonts, global styles: `frontend/src/app/globals.css`
- Page title / SEO description: `frontend/src/app/layout.tsx`

### 4.4 Check before publishing

```bash
npm run build
```

If this fails, the site will not deploy — fix the reported error first.

## 5. Publishing your changes

```bash
npm run deploy
```

This runs the build and uploads `out/` to Cloudflare Pages. It takes about a minute; the live site updates immediately afterwards.

Then save the changes to GitHub:

```bash
git add -A
git commit -m "Update phone number and add new portfolio photos"
git push
```

## 6. Seeing your website's data

### 6.1 Visitor traffic (Cloudflare Web Analytics — free, no cookie banner needed)
1. Go to https://dash.cloudflare.com → **Analytics & Logs** → **Web Analytics**.
2. Click **Add a site**, enter `www.e-ventura.com`, and copy the `<script>` snippet it gives you.
3. Paste that snippet at the end of the `<body>` in `frontend/src/app/layout.tsx`, then run `npm run deploy`.
4. Within a few minutes the dashboard shows page views, visitors, top pages, countries, and referrers.

You can also see request counts and bandwidth without any setup: **Workers & Pages → eventura → Metrics**.

### 6.2 Google Analytics (optional, more detailed)
1. Create a property at https://analytics.google.com and copy the Measurement ID (`G-XXXXXXX`).
2. Add the gtag snippet to `frontend/src/app/layout.tsx`, then `npm run deploy`.

### 6.3 Enquiries from the site
Both the contact form and the 6-step planner send their answers to **WhatsApp on +91 8279088558** — there is no database, so your enquiry history is your WhatsApp chat list. To collect them elsewhere (email, Google Sheet, CRM), the forms need to be pointed at a form service; that is a code change.

### 6.4 Deployment history
https://dash.cloudflare.com → **Workers & Pages → eventura → Deployments**. Every deploy is listed with its own preview URL, and you can **Rollback** to any earlier one if a change breaks something.

## 7. Domain settings

- DNS records: GoDaddy → **My Products → e-ventura.com → DNS**.
  - `CNAME` `www` → `eventura.pages.dev` — this is what points the site at Cloudflare. Do not delete it.
  - Forwarding: `e-ventura.com` → `https://www.e-ventura.com` (301).
- Custom domain on Cloudflare: **Workers & Pages → eventura → Custom domains** (shows `www.e-ventura.com` as *Active*).
- The domain expires **Jul 29, 2027** — turn on auto-renew in GoDaddy so the site does not go offline.

## 8. Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm run deploy` says Node 22 required | Install Node 22+ from nodejs.org and reopen the terminal |
| Deploy asks you to log in | Run `npx wrangler login` |
| Site looks unchanged after deploy | Hard refresh (`Ctrl+Shift+R`), or check the deploy finished in Cloudflare → Deployments |
| Domain does not open on mobile | Stale DNS cache — toggle airplane mode, or open `https://www.e-ventura.com` directly |
| A change broke the site | Cloudflare → Deployments → **Rollback** to the previous deployment |
