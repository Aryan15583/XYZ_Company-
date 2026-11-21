import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { pageMetadata } from "@/lib/seo";
import { getStoreRating } from "@/lib/ratings";
import { Icon } from "@/components/Icon";

// The average-rating stat comes from approved reviews in the database.
export const revalidate = 60;

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "About Arcana Crystals: natural crystals and gemstone jewellery, chosen by hand, described honestly and delivered with care.",
  path: "/about",
});

export default async function AboutPage() {
  const storeRating = await getStoreRating();
  return (
    <>
      <Header />
      <main id="main-content">
        <nav className="breadcrumb container" aria-label="Breadcrumb">
          <ol role="list">
            <li><Link href="/">Home</Link></li>
            <li aria-current="page">About</li>
          </ol>
        </nav>

        <section className="page-hero" aria-labelledby="about-hero-heading">
          <div className="container">
            <p className="eyebrow">Our Story</p>
            <h1 id="about-hero-heading" className="page-title">Crystals, Chosen with Care</h1>
            <p className="page-subtitle" style={{ marginInline: "auto" }}>
              Arcana Crystals brings you natural crystals and gemstone jewellery, from everyday bracelets to sacred Rudraksha, chosen by hand and described honestly.
            </p>
          </div>
        </section>

        <section className="section about-story" aria-labelledby="story-heading">
          <div className="container about-story-inner">
            <div className="about-story-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/products/about-workbench.jpg" alt="An amethyst and rose quartz bracelet surrounded by loose crystal beads" width={600} height={600} loading="lazy" />
            </div>
            <div className="about-story-text">
              <h2 id="story-heading" className="section-title">Why Arcana</h2>
              {/* Edit this story to tell your own: how you started and what crystals mean to you. */}
              <p>
                <em>Arcana</em> means &ldquo;hidden things&rdquo;, and that is what drew us to crystals: the quiet
                beauty of stones formed over millions of years, and the meaning people have found in them for just as
                long.
              </p>
              <p>
                We bring that beauty into everyday life with bracelets, pendants, rings, crystal points and Rudraksha,
                each made with genuine natural stones. No two pieces are exactly alike, and we think that&apos;s the
                point.
              </p>
              <p>
                Not sure where to start? Our <Link href="/guides">crystal guides</Link> explain what each stone is
                known for, or <Link href="/contact">ask us</Link> and we&apos;ll help you choose.
              </p>
              <div className="about-stats" aria-label="Arcana Crystals by the numbers">
                {storeRating && (
                  <div className="stat-item"><span className="stat-num">{storeRating.rating.toFixed(1)}★</span><span className="stat-label">Average Rating</span></div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="section our-values" aria-labelledby="values-heading">
          <div className="container">
            <h2 id="values-heading" className="section-title text-center">What We Stand For</h2>
            <div className="values-grid" role="list">
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="gem" size={26} /></div>
                <h3>Genuine Stones</h3>
                <p>Every piece uses real, natural crystal. Colour and markings vary from stone to stone, and we celebrate that rather than hide it.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="leaf" size={26} /></div>
                <h3>Responsible Sourcing</h3>
                <p>We work with suppliers who share our standards for fair labour and responsible mining.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="search" size={26} /></div>
                <h3>Transparency</h3>
                <p>Crystal meanings are shared as tradition, never as medical claims. Clear prices, honest descriptions and no hidden fees.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="globe" size={26} /></div>
                <h3>Accessibility</h3>
                <p>Shop in your preferred currency and pay the way that suits you.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="lock" size={26} /></div>
                <h3>Privacy &amp; Security</h3>
                <p>We handle your personal data with the highest care, complying with GDPR, CCPA, and international standards.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="accessibility" size={26} /></div>
                <h3>Inclusivity</h3>
                <p>Our website is built to WCAG 2.1 AA accessibility standards — everyone can shop and explore with ease.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section certifications" aria-labelledby="cert-heading">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Peace of mind</p>
              <h2 id="cert-heading" className="section-title">Our Commitments</h2>
            </div>
            <div className="cert-grid" role="list">
              <div className="cert-item" role="listitem"><span className="cert-icon"><Icon name="lock" size={26} /></span><h3>SSL / TLS Encrypted</h3><p>All communication between your browser and our servers is encrypted via HTTPS.</p></div>
              <div className="cert-item" role="listitem"><span className="cert-icon"><Icon name="card" size={26} /></span><h3>Card Data Never Stored</h3><p>We don&apos;t collect raw card numbers on this site. Pay by Cash on Delivery, Bank Transfer, or PayPal.</p></div>
              <div className="cert-item" role="listitem"><span className="cert-icon"><Icon name="shield" size={26} /></span><h3>GDPR Compliant</h3><p>We meet European Union data protection standards. Cookie consent, data access rights, and full transparency.</p></div>
              <div className="cert-item" role="listitem"><span className="cert-icon"><Icon name="shield" size={26} /></span><h3>CCPA Compliant</h3><p>California residents can request, delete, or opt out of data sale at any time.</p></div>
              <div className="cert-item" role="listitem"><span className="cert-icon"><Icon name="accessibility" size={26} /></span><h3>WCAG 2.1 AA</h3><p>Designed to meet Web Content Accessibility Guidelines 2.1 Level AA.</p></div>
              <div className="cert-item" role="listitem"><span className="cert-icon"><Icon name="returns" size={26} /></span><h3>EU Distance Selling</h3><p>14-day return window on non-customised products, in compliance with EU consumer law.</p></div>
            </div>
          </div>
        </section>

        <section className="section about-cta" aria-labelledby="about-cta-heading">
          <div className="container text-center">
            <h2 id="about-cta-heading" className="section-title">Ready to Explore?</h2>
            <p>Browse our crystals and gemstone jewellery, or read what each stone is known for.</p>
            <div className="hero-cta-group" style={{ justifyContent: "center" }}>
              <Link href="/shop" className="btn btn-primary btn-lg">Shop the Collection</Link>
              <Link href="/guides" className="btn btn-outline btn-lg">Crystal Guides</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
