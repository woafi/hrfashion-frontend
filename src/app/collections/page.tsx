"use client";

import { useState, Suspense, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { fetchProducts } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { PageMotion, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";
import { AnimatePresence, motion } from "framer-motion";

const ACTIVE_FILTER_KEYS = ["search", "category", "minPrice", "maxPrice", "sort"];

function CollectionsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const hasActiveFilters = ACTIVE_FILTER_KEYS.some((k) => searchParams.has(k) && searchParams.get(k) !== "");

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.products(searchParams.toString()),
    queryFn: () => fetchProducts(searchParams),
  });

  // The category filter is driven by the catalog itself, so a click can only ever
  // request a category that products are actually stored under.
  const { data: catalog } = useQuery({
    queryKey: QUERY_KEYS.products("limit=200"),
    queryFn: () => fetchProducts("limit=200"),
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(
    () => Array.from(new Set((catalog?.products ?? []).map((p) => p.category).filter(Boolean))).sort(),
    [catalog]
  );

  const isNewArrivals = !searchParams.has("category") && searchParams.get("sort") === "newest";

  const selectCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    if (params.get("sort") === "newest") params.delete("sort");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const selectNewArrivals = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.set("sort", "newest");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetFilters = () => {
    router.push("/collections");
  };

  return (
    <PageMotion>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif mb-2">Collections</h1>
            <p className="text-muted">Explore our curated selection of premium garments.</p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover hover:-translate-y-0.5 transition-[transform,color,border-color] font-medium uppercase tracking-widest border border-accent/30 hover:border-accent px-4 py-2 rounded-sm animate-in fade-in zoom-in-95 duration-300"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-card-border">
          <div className="relative w-full md:w-auto flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search collections..."
              className="w-full pl-10 pr-4 py-2 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-accent/60 transition-colors"
              defaultValue={searchParams.get("search") || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParam("search", e.currentTarget.value || null);
                }
              }}
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-card-border rounded-sm text-sm hover:border-accent/50 hover:-translate-y-0.5 transition-[transform,border-color] duration-200 md:hidden"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <select
              className="px-4 py-2 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-accent/60 ml-auto transition-colors cursor-pointer"
              value={searchParams.get("sort") || ""}
              onChange={(e) => updateParam("sort", e.target.value || null)}
            >
              <option value="">Sort: Newest</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`md:w-56 flex-shrink-0 ${isFiltersOpen ? "block animate-in fade-in slide-in-from-top-2 duration-300" : "hidden md:block"}`}>
            <div className="space-y-8 sticky top-24">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-muted">Category</h3>
                <div className="space-y-2">
                  {[
                    { label: "All", value: null, active: !searchParams.has("category") && !isNewArrivals },
                    ...categories.map((cat) => ({ label: cat, value: cat, active: searchParams.get("category") === cat })),
                  ].map((cat) => (
                    <button
                      key={cat.label}
                      className={`relative block text-sm text-left w-full pl-3 py-0.5 transition-[color,transform] duration-200 hover:translate-x-0.5 ${
                        cat.active
                          ? "text-accent font-semibold"
                          : "text-muted hover:text-foreground"
                      }`}
                      onClick={() => selectCategory(cat.value)}
                    >
                      {cat.active && (
                        <motion.span
                          layoutId="category-indicator"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                        />
                      )}
                      {cat.label}
                    </button>
                  ))}
                  <button
                    className={`relative block text-sm text-left w-full pl-3 py-0.5 transition-[color,transform] duration-200 hover:translate-x-0.5 ${
                      isNewArrivals ? "text-accent font-semibold" : "text-muted hover:text-foreground"
                    }`}
                    onClick={selectNewArrivals}
                  >
                    {isNewArrivals && (
                      <motion.span
                        layoutId="category-indicator"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                      />
                    )}
                    New Arrivals
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest mb-4 text-muted">Price Range</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-accent/60"
                    value={searchParams.get("minPrice") || ""}
                    onChange={(e) => updateParam("minPrice", e.target.value || null)}
                  />
                  <span className="text-muted">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-card border border-card-border rounded-sm text-sm focus:outline-none focus:border-accent/60"
                    value={searchParams.get("maxPrice") || ""}
                    onChange={(e) => updateParam("maxPrice", e.target.value || null)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : data?.products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="text-center py-24 text-muted"
              >
                No products found matching your criteria.
              </motion.div>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={searchParams.toString()}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data?.products.map((product) => (
                    <StaggerItem key={product._id}>
                      <ProductCard {...product} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-2">
                    <button
                      disabled={data.page <= 1}
                      onClick={() => updateParam("page", (data.page - 1).toString())}
                      className="p-2 border border-card-border rounded-sm disabled:opacity-40 hover:border-accent/50 hover:-translate-y-0.5 transition-[transform,border-color] duration-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium px-4">
                      Page {data.page} of {data.totalPages}
                    </span>
                    <button
                      disabled={data.page >= data.totalPages}
                      onClick={() => updateParam("page", (data.page + 1).toString())}
                      className="p-2 border border-card-border rounded-sm disabled:opacity-40 hover:border-accent/50 hover:-translate-y-0.5 transition-[transform,border-color] duration-200"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </PageMotion>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-muted">Loading collections...</div>}>
      <CollectionsContent />
    </Suspense>
  );
}
