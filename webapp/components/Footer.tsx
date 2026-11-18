import Link from "next/link";
import { PRODUCT_TYPES } from "@/lib/product-types";
import { CookieSettingsLink } from "./CookieSettingsLink";
import { NewsletterForm } from "./NewsletterForm";
import { getSocialLinks } from "@/lib/social";

export function Footer({ minimal = false }: { minimal?: boolean }) {
  const year = new Date().getFullYear();

  if (minimal) {
    return (
      <footer className="site-footer site-footer--minimal" role="contentinfo">
        <div className="container">
          <p className="footer-legal-links">
            &copy; {year} Arcana Crystals. All rights reserved. &nbsp;|&nbsp;{" "}
            <Link href="/privacy">Privacy Policy</Link> &nbsp;|&nbsp; <Link href="/terms">Terms of Service</Link>{" "}
            &nbsp;|&nbsp; <Link href="/returns">Returns Policy</Link>
          </p>
        </div>
      </footer>
    );
  }

  const socials = getSocialLinks();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <div className="footer-brand">
          <Link href="/" className="logo" aria-label="Arcana Crystals Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/logo-badge-160.png" alt="" className="logo-badge" width={52} height={52} />
            <span className="logo-text">Arcana Crystals</span>
          </Link>
          <p>Quality products, delivered to your door.</p>
          {socials.length > 0 && (
            <div className="footer-socials" aria-label="Social media links">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Arcana Crystals on ${s.label}`}>
                  {s.label}
                </a>
              ))}
            </div>
          )}
          <NewsletterForm />
        </div>
        <nav className="footer-nav" aria-label="Shop navigation">
          <h4>Shop</h4>
          <ul role="list">
            <li><Link href="/shop">All Products</Link></li>
            {PRODUCT_TYPES.slice(0, 4).map((t) => (
              <li key={t.slug}><Link href={`/shop?type=${t.slug}`}>{t.name}</Link></li>
            ))}
            <li><Link href="/wishlist">Wishlist</Link></li>
            <li><Link href="/cart">Cart</Link></li>
          </ul>
        </nav>
        <nav className="footer-nav" aria-label="Legal and help navigation">
          <h4>Help &amp; Legal</h4>
          <ul role="list">
            <li><Link href="/track-order">Track Your Order</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/returns">Returns &amp; Shipping</Link></li>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
            <li><CookieSettingsLink /></li>
          </ul>
        </nav>
      </div>

      <div className="footer-disclaimer">
        <div className="container">
          <p className="footer-legal-links">
            &copy; {year} Arcana Crystals. All rights reserved. &nbsp;|&nbsp; <Link href="/privacy">Privacy Policy</Link>{" "}
            &nbsp;|&nbsp; <Link href="/terms">Terms of Service</Link> &nbsp;|&nbsp;{" "}
            <Link href="/returns">Returns Policy</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
