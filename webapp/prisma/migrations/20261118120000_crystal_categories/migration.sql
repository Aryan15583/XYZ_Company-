-- Arvina Crystal: jewellery types replace the single generic "products"
-- type, and a starter set of crystal stones is added as categories.
-- ON CONFLICT DO NOTHING never overwrites categories edited in the admin.
ALTER TABLE "products" ALTER COLUMN "product_type" SET DEFAULT 'bracelets';
UPDATE "products" SET "product_type" = 'bracelets' WHERE "product_type" = 'products';

INSERT INTO categories (slug, name, description, sort_order, active, created_at) VALUES
  ('amethyst', 'Amethyst', 'Deep purple quartz associated with calm and clarity.', 0, true, now()),
  ('rose-quartz', 'Rose Quartz', 'Soft pink quartz, the classic stone of love.', 1, true, now()),
  ('clear-quartz', 'Clear Quartz', 'Crystal-clear quartz associated with focus.', 2, true, now()),
  ('citrine', 'Citrine', 'Warm golden quartz associated with abundance.', 3, true, now()),
  ('black-tourmaline', 'Black Tourmaline', 'Grounding, protective black stone.', 4, true, now()),
  ('black-obsidian', 'Black Obsidian', 'Glossy volcanic glass, grounding and clarifying.', 5, true, now()),
  ('lapis-lazuli', 'Lapis Lazuli', 'Deep blue stone of insight and truth.', 6, true, now()),
  ('tiger-eye', 'Tiger Eye', 'Golden-brown banded stone of courage.', 7, true, now()),
  ('moonstone', 'Moonstone', 'Glowing stone associated with new beginnings.', 8, true, now()),
  ('green-aventurine', 'Green Aventurine', 'Shimmering green stone of luck and optimism.', 9, true, now()),
  ('pyrite', 'Pyrite', 'Metallic "fool''s gold" associated with prosperity.', 10, true, now()),
  ('selenite', 'Selenite', 'Luminous white mineral used to cleanse other crystals.', 11, true, now())
ON CONFLICT DO NOTHING;
