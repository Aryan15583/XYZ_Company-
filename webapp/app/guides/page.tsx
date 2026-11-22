import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { CRYSTAL_GUIDES, crystalPath } from "@/lib/guides/crystals";
import { RUDRAKSHA_PATH } from "@/lib/guides/rudraksha";
import { getStoneImages } from "@/lib/guides/data";
import { thumbnailFor } from "@/lib/product-thumbs";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Crystal Guides",
  description:
    "Free guides to crystal meanings, benefits and care, and Rudraksha mukhi meanings, from Arvina Crystal.",
  path: "/guides",
});

export default async function GuidesPage() {
  const images = await getStoneImages();
  return (
    <>
      <Header />
      <main id="main-content">
        <nav className="breadcrumb container" aria-label="Breadcrumb">
          <ol role="list">
            <li><Link href="/">Home</Link></li>
            <li aria-current="page">Guides</li>
          </ol>
        </nav>

        <div className="page-header container guides-header">
          <p className="eyebrow">Learn</p>
          <h1 className="page-title">Crystal Guides</h1>
          <p className="page-subtitle">
            What each crystal is known for, how to wear and care for it, and how to choose the right Rudraksha.
          </p>
        </div>


        <section className="section guide-cleanse" id="crystals" aria-labelledby="crystal-hub-heading">
          <div className="container">
            <div className="section-header">
              <p className="eyebrow">Crystals</p>
              <h2 id="crystal-hub-heading" className="section-title">Crystal meanings</h2>
              <p className="section-subtitle">The traditional meaning, benefits and care of every stone we carry.</p>
            </div>
            <ul className="guide-crystal-grid" role="list">
              {CRYSTAL_GUIDES.map((c) => {
                const img = images[c.slug];
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
          </div>
        </section>

        <section className="section" aria-labelledby="rud-hub-heading">
          <div className="container guide-band-light">
            <div>
              <p className="eyebrow">Sacred beads</p>
              <h2 id="rud-hub-heading" className="section-title">Rudraksha guide</h2>
              <p>The meaning of every mukhi from 1 to 14, with its ruling deity and planet, plus how to wear and care for your Rudraksha.</p>
            </div>
            <Link href={RUDRAKSHA_PATH} className="btn btn-primary btn-lg">Read the Rudraksha Guide</Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
