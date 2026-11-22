# Arvina Crystal — Next.js

The Arvina Crystal online shop: storefront, cart and checkout, a real database
and API, and an admin panel. It starts with 49 crystal
products (8 priced bracelets, the rest "price on request") — set prices and
stock in the admin panel.

## Quick start

The database is Postgres (Neon in production). Put a Postgres connection string
in `.env` as both `DATABASE_URL` and `DIRECT_URL` — a free Neon `dev` branch is
easiest (see `.env.example`). Then:

```bash
npm install
npx prisma migrate deploy   # creates the tables
npm run dev
```

**Deploying:** see [DEPLOY.md](./DEPLOY.md) (Vercel + Neon, or Render).

Open [http://localhost:3000](http://localhost:3000) for the storefront and
[http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel
(sign-in is a one-time code emailed to `ADMIN_LOGIN_EMAIL` — in dev without email configured,
the code is printed in the terminal running `npm run dev`; see TODO.md to enable real email).

## Stack

Next.js 16 (App Router) · TypeScript · Prisma 6 + Postgres (Neon) · `jose` for admin
session JWTs · no CSS framework (styles ported from the original site).
