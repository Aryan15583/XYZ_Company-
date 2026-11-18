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
    "About Arcana Crystals — who we are, what we sell and how we look after our customers.",
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
            <h1 id="about-hero-heading" className="page-title">About Arcana Crystals</h1>
            <p className="page-subtitle" style={{ marginInline: "auto" }}>
              Arcana Crystals makes it simple to shop quality products online, with secure checkout and friendly support.
            </p>
          </div>
        </section>

        <section className="section about-story" aria-labelledby="story-heading">
          <div className="container about-story-inner about-story-inner--single">
            <div className="about-story-text">
              <h2 id="story-heading" className="section-title">Who We Are</h2>
              {/* TODO: replace this placeholder with Arcana Crystals's own story. */}
              <p>
                Arcana Crystals is an online shop focused on quality products and a smooth buying experience. Every
                order is checked and packed with care, and our team is here to help before and after you buy.
              </p>
              <p>
                Have a question about a product or an order? <Link href="/contact">Get in touch</Link> and we&apos;ll
                get back to you as soon as we can.
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
                <div className="value-icon"><Icon name="check" size={26} /></div>
                <h3>Quality</h3>
                <p>We only list products we would be happy to buy ourselves, and check every order before it ships.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="leaf" size={26} /></div>
                <h3>Responsible Business</h3>
                <p>We work with suppliers who share our standards for fair and responsible practices.</p>
              </div>
              <div className="value-card" role="listitem">
                <div className="value-icon"><Icon name="search" size={26} /></div>
                <h3>Transparency</h3>
                <p>Clear prices, honest product descriptions and no hidden fees.</p>
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
            <p>Browse the full Arcana Crystals range.</p>
            <div className="hero-cta-group" style={{ justifyContent: "center" }}>
              <Link href="/shop" className="btn btn-primary btn-lg">Shop the Collection</Link>
              <Link href="/contact" className="btn btn-outline btn-lg">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
