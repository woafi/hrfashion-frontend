"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";
import { motion } from "framer-motion";

const MAX_CARDS = 4;

export function Categories() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.products("limit=200"),
    queryFn: () => fetchProducts("limit=200"),
    staleTime: 5 * 60 * 1000,
  });

  const categories = useMemo(() => {
    const byCategory = new Map<string, { count: number; image?: string }>();
    for (const product of data?.products ?? []) {
      if (!product.category) continue;
      const entry = byCategory.get(product.category) ?? { count: 0, image: product.images?.[0] };
      entry.count += 1;
      if (!entry.image) entry.image = product.images?.[0];
      byCategory.set(product.category, entry);
    }
    return [...byCategory.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, MAX_CARDS)
      .map(([name, { count, image }]) => ({
        name,
        count,
        image,
        link: `/collections?category=${encodeURIComponent(name)}`,
      }));
  }, [data]);

  return (
    <section className="py-24 bg-card border-y border-card-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent block mb-2">Explore</span>
          <h2 className="text-3xl font-serif mb-4">Shop by Category</h2>
          <p className="text-muted max-w-xl mx-auto">
            Explore our diverse range of clothing tailored for every occasion and style preference.
          </p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: MAX_CARDS }).map((_, idx) => (
                <div key={idx} className="h-[420px] rounded-sm bg-foreground/10 animate-pulse" />
              ))
            : categories.map((cat) => (
                <StaggerItem key={cat.name}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.015 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="h-[420px]"
                  >
                    <Link
                      href={cat.link}
                      className="group relative h-full overflow-hidden block rounded-sm card-glow border border-card-border"
                    >
                      {cat.image && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out transform-gpu"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent group-hover:from-ink/95 group-hover:via-ink/40 transition-colors duration-500" />
                      
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <span className="text-xs text-white/70 uppercase tracking-widest mb-1">
                          {cat.count} {cat.count === 1 ? "Piece" : "Pieces"}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-white text-2xl font-serif tracking-wide group-hover:text-white transition-colors">
                            {cat.name}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </StaggerItem>
              ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
