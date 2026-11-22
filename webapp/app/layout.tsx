import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { THEME_KEY } from "@/lib/theme";
import { CookieBanner } from "@/components/CookieBanner";
import { Analytics } from "@/components/Analytics";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CardTilt } from "@/components/CardTilt";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE, getSiteUrl, isIndexableSite } from "@/lib/seo";

const defaultTitle = `${SITE_NAME} — ${SITE_TAGLINE}`;
const indexable = isIndexableSite();

// Optional: paste the codes Google Search Console / Bing Webmaster Tools give
// you into .env (see TODO.md) instead of editing code.
const verificationOther: Record<string, string> = {};
if (process.env.BING_SITE_VERIFICATION) verificationOther["msvalidate.01"] = process.env.BING_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: defaultTitle, template: `%s — ${SITE_NAME}` },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Arvina Crystal",
    "crystal bracelets",
    "gemstone jewellery",
    "amethyst bracelet",
    "rose quartz pendant",
    "crystal meanings",
    "crystal points",
    "rudraksha",
  ],
  category: "shopping",
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    title: defaultTitle,
    description: DEFAULT_DESCRIPTION,
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: defaultTitle }],
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: DEFAULT_DESCRIPTION, images: ["/opengraph-image"] },
  robots: indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    : { index: false, follow: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: Object.keys(verificationOther).length ? verificationOther : undefined,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfdfd" },
    { media: "(prefers-color-scheme: dark)", color: "#191933" },
  ],
};

const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {/* Apply a theme the visitor picked; otherwise CSS follows the device setting. */}
        <Script id="theme-init" strategy="beforeInteractive">{THEME_SCRIPT}</Script>
        <Providers>
          <a href="#main-content" className="skip-link">Skip to content</a>
          <CookieBanner />
          <ScrollReveal />
          <CardTilt />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
