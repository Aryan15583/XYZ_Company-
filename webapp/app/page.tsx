import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JsonLd } from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/seo";
import { getSocialLinks } from "@/lib/social";
import { getStoreRating } from "@/lib/ratings";
import { starString } from "@/lib/stars";
import { PRODUCT_TYPES } from "@/lib/product-types";
import { CRYSTAL_GUIDES, crystalPath } from "@/lib/guides/crystals";
import { getStoneImages } from "@/lib/guides/data";
import { thumbnailFor } from "@/lib/product-thumbs";

const FEATURED_GUIDES = ["amethyst", "rose-quartz", "citrine", "tiger-eye", "lapis-lazuli", "black-obsidian"]
  .map((slug) => CRYSTAL_GUIDES.find((c) => c.slug === slug))
  .filter((c) => c !== undefined);
import { Icon } from "@/components/Icon";

const profileLinks = getSocialLinks().filter((s) => s.label !== "WhatsApp").map((s) => s.href);

export const metadata: Metadata = { alternates: { canonical: "/" } };

// Featured products, prices and stock badges come from the database, so a
// build-time snapshot would ignore every admin edit until the next deploy.
export const revalidate = 60;

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${getSiteUrl()}/#organization`,
      name: SITE_NAME,
      url: getSiteUrl(),
      logo: { "@type": "ImageObject", url: absoluteUrl("/assets/brand/icon-512.png"), width: 512, height: 512 },
      image: absoluteUrl("/assets/brand/icon-512.png"),
      description: DEFAULT_DESCRIPTION,
      ...(profileLinks.length ? { sameAs: profileLinks } : {}),
    },
    {
      "@type": "WebSite",
      "@id": `${getSiteUrl()}/#website`,
      url: getSiteUrl(),
      name: SITE_NAME,
      publisher: { "@id": `${getSiteUrl()}/#organization` },
    },
  ],
};

export default async function HomePage() {
  const [featured, storeRating, testimonials, typeRows, stoneImages] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    getStoreRating(),
    // Real, moderator-approved 4–5 star reviews — never invented quotes.
    prisma.review.findMany({
      where: { status: "approved", rating: { gte: 4 }, product: { active: true } },
      orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
      take: 3,
      include: { product: { select: { name: true } } },
    }),
    // Product counts per type for the "Shop by Category" tiles.
    prisma.product.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: { productType: true },
    }),
    getStoneImages(),
  ]);
  // Every type gets a tile with its own category photo, even before it has products.
  const typeTiles = PRODUCT_TYPES.map((t) => ({ ...t, count: typeRows.filter((r) => r.productType === t.slug).length }));
  const products = featured.map(serializeProduct);

  return (
    <>
      <JsonLd data={siteJsonLd} />
      <Header />
      <main id="main-content">
        <section className="hero hero--split" aria-labelledby="hero-heading">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="container hero-split">
            <div className="hero-content">
              <p className="eyebrow eyebrow--light">Natural crystals · Gemstone jewellery</p>
              <h1 id="hero-heading" className="hero-title">
                Carry a Little Magic.
                <br />
                <span className="accent">Wear Your Stone.</span>
              </h1>
              <p className="hero-subtitle">
                Natural crystals and gemstone jewellery, from calming Amethyst to grounding Black Obsidian, chosen by hand and delivered to your door.
              </p>
              <div className="hero-cta-group">
                <Link href="/shop" className="btn btn-primary btn-lg">
                  Shop the Collection <Icon name="arrowRight" size={18} />
                </Link>
                <Link href="/guides" className="btn btn-outline btn-outline--light btn-lg">
                  Find Your Crystal
                </Link>
              </div>
              <ul className="hero-trust" aria-label="Why shop with us">
                <li><Icon name="gem" size={16} /> Natural stones</li>
                <li><Icon name="globe" size={16} /> Ships worldwide</li>
                <li><Icon name="returns" size={16} /> 14-day returns</li>
              </ul>
            </div>
            <div className="hero-visual" aria-hidden="true">
              <div className="hero-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="hero-photo" src="/assets/products/hero-still-life.jpg" alt="Amethyst and clear quartz points beside an amethyst bead bracelet and loose crystal beads" width={1200} height={1350} fetchPriority="high" />
              </div>
            </div>
          </div>
        </section>

        <section className="trust-bar" aria-label="Shopping with Arcana Crystals">
          <div className="container trust-bar-inner">
            <div className="trust-item"><Icon name="lock" /><span>Secure checkout</span></div>
            <div className="trust-item"><Icon name="card" /><span>UPI, cards &amp; cash on delivery</span></div>
            <div className="trust-item"><Icon name="truck" /><span>Tracked worldwide shipping</span></div>
            <div className="trust-item"><Icon name="returns" /><span>14-day returns</span></div>
            {storeRating && (
              <div className="trust-item"><Icon name="star" /><span>{storeRating.rating.toFixed(1)}/5 from customers</span></div>
            )}
          </div>
        </section>

        {typeTiles.length > 0 && (
        <section data-reveal className="section shop-categories" aria-labelledby="categories-heading">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">The Collection</p>
              <h2 id="categories-heading" className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Natural crystals, crafted into pieces to wear and keep close</p>
            </div>
            <div className="category-tiles" role="list">
              {typeTiles.map((t) => (
                <Link key={t.slug} href={`/shop?type=${t.slug}`} className="category-tile" role="listitem">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.image} alt="" loading="lazy" decoding="async" width={300} height={300} />
                  <span className="category-tile-body">
                    <span className="category-tile-name">{t.name}</span>
                    <span className="category-tile-count">
                      {t.count > 0 ? `${t.count} item${t.count === 1 ? "" : "s"}` : "Explore"} <Icon name="arrowRight" size={14} />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        )}

        {products.length > 0 && (
          <section data-reveal className="section featured-products" aria-labelledby="featured-heading">
            <div className="container">
              <div className="section-header">
                <p className="eyebrow">Curated</p>
              <h2 id="featured-heading" className="section-title">Featured Pieces</h2>
                <p className="section-subtitle">Every piece is natural, so colour and markings vary slightly, making each one unique</p>
              </div>
              <div className="product-grid" role="list" aria-label="Featured products">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="section-cta">
                <Link href="/shop" className="btn btn-outline btn-lg" aria-label="View all products in the shop">
                  View All Products
                </Link>
              </div>
            </div>
          </section>
        )}


        <section data-reveal className="section guide-cleanse" aria-labelledby="find-crystal-heading">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Crystal guides</p>
              <h2 id="find-crystal-heading" className="section-title">Find the Crystal That&apos;s Right for You</h2>
              <p className="section-subtitle">What each stone is traditionally known for, who it suits, and how to care for it.</p>
            </div>
            <ul className="guide-crystal-grid" role="list">
              {FEATURED_GUIDES.map((c) => {
                const img = stoneImages[c.slug];
                return (
                  <li key={c.slug}>
                    <Link href={crystalPath(c.slug)} className="guide-crystal-tile">
                      <span className="guide-crystal-tile-img">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={thumbnailFor(img) ?? img} alt="" loading="lazy" decoding="async" width={300} height={300} />
                        ) : (
                          <Icon name="gem" size={40} />
                        )}
                      </span>
                      <span className="guide-crystal-tile-body">
                        <strong>{c.name}</strong>
                        <span>{c.tagline}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="section-cta">
              <Link href="/guides" className="btn btn-outline btn-lg">All Crystal Guides</Link>
            </div>
          </div>
        </section>

        <section data-reveal className="section why-us" aria-labelledby="why-heading">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Our promise</p>
              <h2 id="why-heading" className="section-title">Why Choose Arcana Crystals</h2>
            </div>
            <div className="features-grid" role="list">
              <div className="feature-card" role="listitem">
                <span className="feature-icon"><Icon name="gem" size={26} /></span>
                <h3>Genuine Natural Stones</h3>
                <p>Every piece is made with real crystals, never dyed glass or plastic, and natural variations are part of its character.</p>
              </div>
              <div className="feature-card" role="listitem">
                <span className="feature-icon"><Icon name="globe" size={26} /></span>
                <h3>Ships Worldwide</h3>
                <p>Carefully packed and tracked, so your crystals arrive safely wherever you are.</p>
              </div>
              <div className="feature-card" role="listitem">
                <span className="feature-icon"><Icon name="returns" size={26} /></span>
                <h3>14-Day Return Policy</h3>
                <p>Not the right stone for you? Return non-customised pieces within 14 days of delivery.</p>
              </div>
              <div className="feature-card" role="listitem">
                <span className="feature-icon"><Icon name="lock" size={26} /></span>
                <h3>Secure Payments</h3>
                <p>We never store your card data on our servers. Cash on delivery and bank transfer also available.</p>
              </div>
            </div>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section data-reveal className="section testimonials" aria-labelledby="testimonials-heading">
            <div className="container">
              <div className="section-header">
                <p className="eyebrow">Kind words</p>
                <h2 id="testimonials-heading" className="section-title">What Our Customers Say</h2>
              </div>
              <div className="testimonial-grid" role="list">
                {testimonials.map((t) => (
                  <blockquote className="testimonial-card" role="listitem" key={t.id}>
                    <p>&ldquo;{t.comment}&rdquo;</p>
                    <footer>
                      <cite>— {t.authorName}, on {t.product.name}</cite>
                      <div className="testimonial-stars" aria-label={`${t.rating} stars`}>{starString(t.rating)}</div>
                    </footer>
                  </blockquote>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
