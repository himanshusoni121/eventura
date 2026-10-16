# Eventura

A luxury event management website with a headless CMS built on Cloudflare Pages Functions and R2 storage.

## Project Structure

```
eventura-main/
├── backend/                # Cloudflare Workers backend
│   ├── functions/          # API endpoints (login, upload, manifest)
│   ├── wrangler.toml       # Cloudflare configuration
│   └── package.json        # Backend dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/            # Pages and layouts
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities and data
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
└── package.json            # Root mono-repo scripts
```

## Features

- **Headless CMS**: Manage all website content through admin panel
- **Real-time Updates**: Publish changes without redeployment
- **Cloud Storage**: Images stored in Cloudflare R2
- **Secure Auth**: JWT-based authentication with timing-safe password comparison
- **Draft/Publish**: Save drafts before publishing to live site
- **Mobile Responsive**: Fully responsive design with touch-friendly admin

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

This builds the frontend and deploys to Cloudflare Pages with the backend functions.

## Documentation

- [Admin Setup Guide](ADMIN_SETUP.md) - Configure Cloudflare R2 and environment variables
- [Deployment Guide](DEPLOYMENT.md) - Full deployment and content management instructions

## Admin Panel

Access the admin panel at `/admin` after deployment. You'll need to set up:

1. **R2 Bucket**: Create `eventura-cms` bucket in Cloudflare dashboard
2. **Environment Variables**: Set `ADMIN_PASSWORD` and `JWT_SECRET` in Cloudflare Pages settings
3. **R2 Binding**: Bind the bucket to `EVENTURA_R2` in Pages settings

See [ADMIN_SETUP.md](ADMIN_SETUP.md) for detailed instructions.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Cloudflare Pages Functions (Workers)
- **Storage**: Cloudflare R2
- **Auth**: JWT with Web Crypto API
- **Deployment**: Cloudflare Pages

## License

MIT
