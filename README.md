# Arvina Crystal

Online shop for Arvina Crystal. The structure is copied from the Arise Numero
site and repurposed as a products-only store (no bookings or numerology).

- **`webapp/`** — the real site: Next.js + Postgres, with shop, cart, checkout
  (Cashfree / PayPal / bank transfer / COD), order tracking, reviews,
  wishlist, newsletter and an admin panel. Start with
  [webapp/README.md](webapp/README.md) and [webapp/DEPLOY.md](webapp/DEPLOY.md).
- **Root `*.html`, `main.js`, `styles.css`** — the older static version,
  published to GitHub Pages by `.github/workflows/static.yml`.
- **`src/`** — the older Express + SQLite backend for the static version
  (see [SETUP.md](SETUP.md)).

The database starts with 49 crystal products and 20 stone categories (loaded
by a migration). The 8 bracelets are priced; the rest show "price on request"
until you set a price and stock in the admin panel (`/admin`).

## Still to fill in

- Admin login email is `info.arvinacrystal@gmail.com` (`ADMIN_LOGIN_EMAIL`). Its Gmail
  App Password goes in `SMTP_PASS` so login codes can be emailed.
- Business address and phone on the contact, terms, privacy and returns
  pages (the Mumbai address is carried over from the original site). The
  customer email everywhere is `info.arvinacrystal@gmail.com`.
- Site URL `NEXT_PUBLIC_SITE_URL` (placeholder `example.com`).
- Product types in `webapp/lib/product-types.ts` (one generic "Products"
  type for now).
