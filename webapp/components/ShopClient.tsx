"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { ProductDTO } from "@/lib/types";
import { isPriced } from "@/lib/pricing";
import { PRODUCT_TYPES, getProductType } from "@/lib/product-types";
import { Icon } from "./Icon";
import { stoneColor } from "@/lib/stone-colors";
import { getSmoothScroll } from "@/lib/smooth-scroll";

const SIZE_OPTIONS = ["6mm", "8mm", "10mm"];
const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "0-20", label: "Under $20" },
  { value: "20-30", label: "$20 – $30" },
  { value: "30-50", label: "$30 – $50" },
  { value: "50+", label: "Over $50" },
];

type SortValue = "featured" | "price-low" | "price-high" | "rating";

export function ShopClient({
  initialProducts,
  initialCat,
  initialQuery,
  initialType,
  categories,
}: {
  initialProducts: ProductDTO[];
  initialCat?: string;
  initialQuery?: string;
  initialType?: string;
  categories: { slug: string; name: string }[];
}) {
  const [productType, setProductType] = useState<string>(getProductType(initialType) ? initialType! : "all");
  const [crystal, setCrystal] = useState<string>(
    initialCat && categories.some((c) => c.slug === initialCat) ? initialCat : "all"
  );
  const [price, setPrice] = useState<string>("all");
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortValue>("featured");
  const [query, setQuery] = useState((initialQuery || "").slice(0, 80));
  // Phones/tablets: the filters open as a slide-up panel.
  const [filtersOpen, setFiltersOpen] = useState(false);
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFiltersOpen(false); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    getSmoothScroll()?.stop();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; getSmoothScroll()?.start(); };
  }, [filtersOpen]);

  function toggleSize(size: string) {
    setSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]));
  }

  function resetFilters() {
    setProductType("all");
    setCrystal("all");
    setPrice("all");
    setSizes([]);
    setInStockOnly(false);
    setSort("featured");
    setQuery("");
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const categoryNames = new Map(categories.map((c) => [c.slug, c.name.toLowerCase()]));
    let list = initialProducts.filter((p) => {
      if (needle) {
        const haystack = [p.name, p.material, p.description, p.beadSize, categoryNames.get(p.category || "")]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!needle.split(/ +/).every((word) => haystack.includes(word))) return false;
      }
      if (productType !== "all" && p.productType !== productType) return false;
      if (crystal !== "all" && p.category !== crystal) return false;
      if (price !== "all" && !isPriced(p)) return false;
      if (price === "0-20" && !(p.priceUsd < 20)) return false;
      if (price === "20-30" && !(p.priceUsd >= 20 && p.priceUsd < 30)) return false;
      if (price === "30-50" && !(p.priceUsd >= 30 && p.priceUsd < 50)) return false;
      if (price === "50+" && !(p.priceUsd >= 50)) return false;
      if (sizes.length && !sizes.includes(p.beadSize || "")) return false;
      if (inStockOnly && p.stock === 0) return false;
      return true;
    });

    list = [...list];
    // Price-on-request items always sort after priced ones.
    const priceKey = (p: ProductDTO, dir: 1 | -1) => (isPriced(p) ? p.priceUsd * dir : Number.POSITIVE_INFINITY);
    if (sort === "price-low") list.sort((a, b) => priceKey(a, 1) - priceKey(b, 1));
    else if (sort === "price-high") list.sort((a, b) => priceKey(a, -1) - priceKey(b, -1));
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [initialProducts, categories, query, productType, crystal, price, sizes, inStockOnly, sort]);

  // Only offer product types and stones that actually have products.
  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of initialProducts) counts.set(p.productType, (counts.get(p.productType) || 0) + 1);
    return counts;
  }, [initialProducts]);
  const availableTypes = PRODUCT_TYPES.filter((t) => typeCounts.has(t.slug));
  const stonesInType = useMemo(() => {
    const set = new Set(initialProducts.filter((p) => productType === "all" || p.productType === productType).map((p) => p.category));
    return categories.filter((c) => set.has(c.slug));
  }, [initialProducts, categories, productType]);
  const selectedType = getProductType(productType);
  const showSizes = !selectedType || selectedType.beaded;

  function chooseType(slug: string) {
    setProductType(slug);
    // Keep the stone filter only if that stone exists in the new type.
    if (crystal !== "all" && !initialProducts.some((p) => (slug === "all" || p.productType === slug) && p.category === crystal)) {
      setCrystal("all");
    }
    if (slug !== "all" && !getProductType(slug)?.beaded) setSizes([]);
  }

  // Filters currently narrowing the list, shown as removable chips.
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (productType !== "all") activeFilters.push({ key: "type", label: selectedType?.name || productType, clear: () => chooseType("all") });
  if (crystal !== "all") activeFilters.push({ key: "stone", label: categories.find((c) => c.slug === crystal)?.name || crystal, clear: () => setCrystal("all") });
  if (price !== "all") activeFilters.push({ key: "price", label: PRICE_OPTIONS.find((o) => o.value === price)?.label || price, clear: () => setPrice("all") });
  for (const size of sizes) activeFilters.push({ key: `size-${size}`, label: `${size} beads`, clear: () => toggleSize(size) });
  if (inStockOnly) activeFilters.push({ key: "stock", label: "In stock", clear: () => setInStockOnly(false) });
  if (query.trim()) activeFilters.push({ key: "q", label: `“${query.trim()}”`, clear: () => setQuery("") });

  return (
    <div className="container shop-layout">
      {filtersOpen && <div className="shop-filters-backdrop" onClick={() => setFiltersOpen(false)} aria-hidden="true" />}
      <aside id="shop-filters" data-lenis-prevent className={`shop-sidebar ${filtersOpen ? "is-open" : ""}`} aria-label="Filter and sort products">
        <div className="filter-section">
          <div className="filter-head">
            <h2 className="filter-title">Filter By</h2>
            <button type="button" className="filter-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
              <Icon name="close" size={20} />
            </button>
          </div>

          <fieldset className="filter-group">
            <legend className="filter-label">Product Type</legend>
            <label className="filter-option">
              <input type="radio" name="ptype" checked={productType === "all"} onChange={() => chooseType("all")} />
              All Products
            </label>
            {availableTypes.map((t) => (
              <label className="filter-option" key={t.slug}>
                <input type="radio" name="ptype" checked={productType === t.slug} onChange={() => chooseType(t.slug)} />
                {t.name} <span className="filter-count">({typeCounts.get(t.slug)})</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="filter-group">
            <legend className="filter-label">Stone</legend>
            <div className="filter-scroll">
              <label className="filter-option">
                <input type="radio" name="crystal" checked={crystal === "all"} onChange={() => setCrystal("all")} />
                All Stones
              </label>
              {stonesInType.map((c) => (
                <label className="filter-option" key={c.slug}>
                  <input type="radio" name="crystal" checked={crystal === c.slug} onChange={() => setCrystal(c.slug)} />
                  <span className="stone-dot" style={{ "--gem": stoneColor(c.slug) } as React.CSSProperties} aria-hidden="true" />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="filter-group">
            <legend className="filter-label">Price Range</legend>
            {PRICE_OPTIONS.map((opt) => (
              <label className="filter-option" key={opt.value}>
                <input type="radio" name="price" checked={price === opt.value} onChange={() => setPrice(opt.value)} />
                {opt.label}
              </label>
            ))}
          </fieldset>

          {showSizes && (
          <fieldset className="filter-group">
            <legend className="filter-label">Bead Size</legend>
            {SIZE_OPTIONS.map((size) => (
              <label className="filter-option" key={size}>
                <input type="checkbox" checked={sizes.includes(size)} onChange={() => toggleSize(size)} />
                {size}
              </label>
            ))}
          </fieldset>
          )}

          <fieldset className="filter-group">
            <legend className="filter-label">Availability</legend>
            <label className="filter-option">
              <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} />
              In Stock Only
            </label>
          </fieldset>

          <div className="filter-actions">
            <button className="btn btn-outline btn-sm filter-reset" onClick={resetFilters}>
              Reset Filters
            </button>
            <button type="button" className="btn btn-primary btn-sm filter-apply" onClick={() => setFiltersOpen(false)}>
              Show {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </aside>

      <div className="shop-main">
        <div className="shop-search" role="search">
          <label htmlFor="shop-search-input" className="sr-only">Search products</label>
          <input
            id="shop-search-input"
            type="search"
            className="form-input"
            placeholder="Search products…"
            value={query}
            maxLength={80}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <nav className="type-pills" aria-label="Product types">
          <button type="button" className={`type-pill ${productType === "all" ? "is-active" : ""}`} onClick={() => chooseType("all")} aria-pressed={productType === "all"}>
            All
          </button>
          {availableTypes.map((t) => (
            <button
              type="button"
              key={t.slug}
              className={`type-pill ${productType === t.slug ? "is-active" : ""}`}
              onClick={() => chooseType(t.slug)}
              aria-pressed={productType === t.slug}
            >
              {t.name}
            </button>
          ))}
        </nav>

        <div className="shop-toolbar" role="toolbar" aria-label="Sort and view options">
          <button
            type="button"
            className="btn btn-outline btn-sm filter-open"
            onClick={() => setFiltersOpen(true)}
            aria-expanded={filtersOpen}
            aria-controls="shop-filters"
          >
            <Icon name="filter" size={16} /> Filters{activeFilters.length > 0 && <span className="filter-open-count">{activeFilters.length}</span>}
          </button>
          <p className="results-count" aria-live="polite">
            Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="sort-group">
            <label htmlFor="sort-select" className="sort-label">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortValue)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {activeFilters.length > 0 && (
          <div className="active-filters" aria-label="Active filters">
            {activeFilters.map((f) => (
              <button type="button" key={f.key} className="active-filter" onClick={f.clear} aria-label={`Remove filter ${f.label}`}>
                {f.key === "stone" && <span className="stone-dot" style={{ "--gem": stoneColor(crystal) } as React.CSSProperties} aria-hidden="true" />}
                {f.label} <Icon name="close" size={14} />
              </button>
            ))}
            <button type="button" className="active-filter-clear" onClick={resetFilters}>Clear all</button>
          </div>
        )}

        <div className="product-grid" role="list" aria-label="Products">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="cart-empty">
            <div className="cart-empty-icon"><Icon name="gem" size={40} /></div>
            <h2>No products match{query.trim() ? ` “${query.trim()}”` : " your filters"}</h2>
            <p>Try a different search, or adjust or reset your filters.</p>
            <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
