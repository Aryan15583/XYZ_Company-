// Optional small WebP copies of built-in product photos. Put a 640px WebP at
// /assets/products/thumbs/<name>.webp for /assets/products/<name>.jpg and add
// <name> to this list; cards and tiles will use the smaller file. Uploaded
// images (/api/images/…) and anything not listed just use the original.
const THUMBS = new Set<string>([]);

export function thumbnailFor(src: string | null | undefined): string | null {
  const m = src?.match(/^\/assets\/products\/([\w-]+)\.jpg$/);
  return m && THUMBS.has(m[1]) ? `/assets/products/thumbs/${m[1]}.webp` : null;
}
