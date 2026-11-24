import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { serializeProduct } from "@/lib/serialize";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ShopClient } from "@/components/ShopClient";
import { crystalPath, getCrystalGuide } from "@/lib/guides/crystals";
import { RUDRAKSHA_PATH } from "@/lib/guides/rudraksha";
import { getProductType, type ProductTypeInfo } from "@/lib/product-types";
import { absoluteUrl, breadcrumbJsonLd, pageMetadata, productPath, truncate } from "@/lib/seo";

type Props = { searchParams: Promise<{ cat?: string; q?: string; type?: string }> };

const SHOP_DESCRIPTION =
  "Shop natural crystals at Arvina Crystal: bracelets, pendants, rings, crystal points, anklets, Rudraksha, bowls and plates. Ships worldwide.";

// Each product type (/shop?type=pendants), stone (/shop?cat=amethyst) and the two
// combined is its own indexable landing page with its own title and canonical
// URL; unknown/garbage values fall back to the full shop.
async function getCategory(cat: string | undefined) {
  if (!cat) return null;
  return prisma.category.findFirst({ where: { slug: cat, active: true } });
}

function landing(type: ProductTypeInfo | null, category: { slug: string; name: string; description: string | null } | null) {
  const params = new URLSearchParams();
  if (type) params.set("type", type.slug);
  if (category) params.set("cat", category.slug);
  const qs = params.toString();
  const path = qs ? `/shop?${qs}` : "/shop";
  const heading =
    type && category ? `${category.name} ${type.name}`
    : type ? type.name
    : category ? `${category.name} Crystals`
    : "Shop All Products";
  const description =
    type && category ? `Shop ${category.name} ${type.name.toLowerCase()} at Arvina Crystal. ${category.description || ""} Ships worldwide.`
    : type ? `${type.description} Shop ${type.name.toLowerCase()} at Arvina Crystal. Ships worldwide.`
    : category ? `${category.description ? `${category.description} ` : ""}Shop ${category.name} at Arvina Crystal. Ships worldwide.`
    : SHOP_DESCRIPTION;
  return { path, heading, description: truncate(description) };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { cat, q, type } = await searchParams;
  // Internal search-result pages are thin/duplicate content: keep them out of Google.
  if (q?.trim()) {
    return pageMetadata({ title: "Search", description: SHOP_DESCRIPTION, path: "/shop", noindex: true });
  }
  const page = landing(getProductType(type), await getCategory(cat));
  return pageMetadata({ title: page.heading, description: page.description, path: page.path });
}

export default async function ShopPage({ searchParams }: Props) {
  const { cat, q, type } = await searchParams;
  const productType = getProductType(type);
  const [rows, categories, category] = await Promise.all([
    prisma.product.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, select: { slug: true, name: true } }),
    getCategory(cat),
  ]);
  const products = rows.map(serializeProduct);
  const listed = products.filter(
    (p) => (!category || p.category === category.slug) && (!productType || p.productType === productType.slug)
  );

  const { heading, path: pagePath } = landing(productType, category);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: heading,
    url: absoluteUrl(pagePath),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: listed.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(productPath(p.id)),
        name: p.name,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          ...(productType || category ? [{ name: heading, path: pagePath }] : []),
        ])}
      />
      <Header />
      <main id="main-content">
        <nav className="breadcrumb container" aria-label="Breadcrumb">
          <ol role="list">
            <li><Link href="/">Home</Link></li>
            {productType || category ? (
              <>
                <li><Link href="/shop">Shop</Link></li>
                <li aria-current="page">{heading}</li>
              </>
            ) : (
              <li aria-current="page">Shop</li>
            )}
          </ol>
        </nav>

        <section className="shop-hero" aria-labelledby="shop-heading">
          <div className="hero-bg" aria-hidden="true"></div>
          <div className="container shop-hero-inner">
            <p className="eyebrow eyebrow--light">{category ? "Crystal" : "The Collection"}</p>
            <h1 id="shop-heading" className="page-title">{heading}</h1>
            <p className="page-subtitle">{productType ? productType.description : "Natural crystals and gemstone jewellery. Every piece is unique, with natural variations in colour and markings."}</p>
            <div className="shop-hero-meta">
              <span>{listed.length} piece{listed.length === 1 ? "" : "s"}</span>
              <span aria-hidden="true">·</span>
              <span>Ships worldwide</span>
              {(() => {
                const g = category ? getCrystalGuide(category.slug) : null;
                if (g) return <><span aria-hidden="true">·</span><Link href={crystalPath(g.slug)} className="page-guide-link">{g.name} meaning, benefits &amp; care →</Link></>;
                if (productType?.slug === "rudraksha") return <><span aria-hidden="true">·</span><Link href={RUDRAKSHA_PATH} className="page-guide-link">What each Rudraksha mukhi means →</Link></>;
                return <><span aria-hidden="true">·</span><Link href="/guides" className="page-guide-link">Which crystal is right for me? →</Link></>;
              })()}
            </div>
          </div>
        </section>

        <ShopClient initialProducts={products} initialCat={cat} initialQuery={q} initialType={productType?.slug} categories={categories} />
      </main>
      <Footer />
    </>
  );
}
