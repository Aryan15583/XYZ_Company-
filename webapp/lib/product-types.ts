// What kind of item a product is. Separate from `category` (managed in the
// admin panel), so a shopper can browse by type or by category. Each type has
// its own landing page: /shop?type=<slug>. Edit this list to match what
// XYZ Company sells; products pick their type in the admin panel.
export type ProductTypeInfo = {
  slug: string;
  name: string; // plural, used for headings and the filter
  singular: string;
  description: string;
  /** Strung items: show bead size and the wrist-size picker on the product page. */
  beaded: boolean;
};

export const PRODUCT_TYPES: ProductTypeInfo[] = [
  {
    slug: "products",
    name: "Products",
    singular: "Product",
    description: "The XYZ Company range.",
    beaded: false,
  },
];

const BY_SLUG = new Map(PRODUCT_TYPES.map((t) => [t.slug, t]));

export function getProductType(slug: string | null | undefined): ProductTypeInfo | null {
  return slug ? BY_SLUG.get(slug) ?? null : null;
}

export const PRODUCT_TYPE_SLUGS = PRODUCT_TYPES.map((t) => t.slug) as [string, ...string[]];
