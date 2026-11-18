// What kind of item a product is. Separate from `category`, which is the
// stone (Amethyst, Rose Quartz…), so a shopper can browse "all Pendants" or
// "everything in Amethyst". Each type has its own landing page:
// /shop?type=<slug>, and a tile on the home page using `image`.
export type ProductTypeInfo = {
  slug: string;
  name: string; // plural, used for headings and the filter
  singular: string;
  description: string;
  /** Strung items: show bead size and the wrist-size picker on the product page. */
  beaded: boolean;
  /** Tile image for the home page "Shop by Category" section. */
  image: string;
};

export const PRODUCT_TYPES: ProductTypeInfo[] = [
  {
    slug: "bracelets",
    name: "Bracelets",
    singular: "Bracelet",
    description: "Stretch bracelets strung with natural crystal beads.",
    beaded: true,
    image: "/assets/categories/bracelets.webp",
  },
  {
    slug: "pendants",
    name: "Pendants",
    singular: "Pendant",
    description: "Polished crystal pendants to wear close every day.",
    beaded: false,
    image: "/assets/categories/pendants.webp",
  },
  {
    slug: "rings",
    name: "Rings",
    singular: "Ring",
    description: "Natural crystal rings in a range of stones.",
    beaded: false,
    image: "/assets/categories/rings.webp",
  },
  {
    slug: "crystal-towers",
    name: "Towers & Points",
    singular: "Tower",
    description: "Six-sided polished crystal points for your desk, altar or meditation space.",
    beaded: false,
    image: "/assets/categories/crystal-towers.webp",
  },
  {
    slug: "anklets",
    name: "Anklets",
    singular: "Anklet",
    description: "Delicate crystal bead anklets.",
    beaded: true,
    image: "/assets/categories/anklets.webp",
  },
  {
    slug: "rudraksha",
    name: "Rudraksha",
    singular: "Rudraksha",
    description: "Natural Rudraksha beads, traditionally worn for prayer and meditation.",
    beaded: false,
    image: "/assets/categories/rudraksha.webp",
  },
  {
    slug: "bowls-plates",
    name: "Bowls & Plates",
    singular: "Bowl / Plate",
    description: "Crystal bowls and plates for display and for cleansing your stones.",
    beaded: false,
    image: "/assets/categories/bowls-plates.webp",
  },
];

const BY_SLUG = new Map(PRODUCT_TYPES.map((t) => [t.slug, t]));

export function getProductType(slug: string | null | undefined): ProductTypeInfo | null {
  return slug ? BY_SLUG.get(slug) ?? null : null;
}

export const PRODUCT_TYPE_SLUGS = PRODUCT_TYPES.map((t) => t.slug) as [string, ...string[]];
