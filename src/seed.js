// seed.js — one-time (idempotent) seed of starter products and coupons
// (none by default). Safe to re-run: it skips rows that already exist.
//
// Run with:  npm run seed

const db = require('./db');

// The Arvina Crystal catalogue starts empty. Add products and coupons from the
// admin panel, or list starter rows here.
const products = [];

const coupons = [];

const insertProduct = db.prepare(`
  INSERT INTO products
    (id, name, material, description, price_usd, original_price_usd, category, bead_size,
     stock, low_stock_threshold, image_url, images, badge, rating, review_count, active, featured)
  VALUES (@id, @name, @material, @description, @price_usd, @original_price_usd, @category, @bead_size,
          @stock, @low_stock_threshold, @image_url, @images, @badge, @rating, @review_count, @active, @featured)
`);

let productsAdded = 0;
for (const p of products) {
  const exists = db.prepare('SELECT 1 FROM products WHERE id = ?').get(p.id);
  if (exists) continue;
  insertProduct.run({ ...p, images: JSON.stringify(p.images), active: p.active ? 1 : 0, featured: p.featured ? 1 : 0 });
  productsAdded++;
}

const insertCoupon = db.prepare('INSERT INTO coupons (code, discount_percent, description, active) VALUES (?, ?, ?, 1)');
let couponsAdded = 0;
for (const c of coupons) {
  const exists = db.prepare('SELECT 1 FROM coupons WHERE code = ?').get(c.code);
  if (exists) continue;
  insertCoupon.run(c.code, c.discount_percent, c.description);
  couponsAdded++;
}

console.log(`Seed complete — ${productsAdded} product(s) and ${couponsAdded} coupon(s) added.`);
