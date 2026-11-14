// Idempotent local-development seed. The XYZ Company catalogue starts empty:
// add categories, products and coupons from the admin panel (/admin).
// Add starter rows to the arrays below if you want a fresh dev database to
// come pre-filled. Safe to re-run: existing rows are skipped, never overwritten.
//
// Run with: npm run seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories: { slug: string; name: string; description?: string }[] = [];
const coupons: { code: string; discountPercent: number; description?: string }[] = [];

async function main() {
  let categoriesAdded = 0;
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    if (await prisma.category.findUnique({ where: { slug: c.slug } })) continue;
    await prisma.category.create({ data: { ...c, sortOrder: i } });
    categoriesAdded++;
  }

  let couponsAdded = 0;
  for (const c of coupons) {
    if (await prisma.coupon.findUnique({ where: { code: c.code } })) continue;
    await prisma.coupon.create({ data: c });
    couponsAdded++;
  }

  console.log(`Seed complete — ${categoriesAdded} categor${categoriesAdded === 1 ? "y" : "ies"}, ${couponsAdded} coupon(s) added.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
