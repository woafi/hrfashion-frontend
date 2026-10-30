"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { fetchRecommendations } from "@/lib/api";
import { getToken, useSession } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

export function RecommendationsSection() {
  const { data: session, isPending: isSessionLoading } = useSession();

  const { data, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.recommendations(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchRecommendations(token);
    },
    enabled: !!session?.user,
  });

  if (isSessionLoading) return null;
  if (!session?.user) return null;

  return (
    <div className="py-12 border-t border-card-border">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-serif">Recommended For You</h2>
        <motion.span
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold uppercase tracking-widest border border-accent/20"
        >
          <Sparkles className="w-3.5 h-3.5" /> Powered by AI
        </motion.span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError || !data ? (
        <div className="p-8 text-center text-muted bg-card rounded-xl border border-card-border text-sm">
          Failed to load recommendations. Please try again later.
        </div>
      ) : data.reason === "empty_wishlist" ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center flex flex-col items-center bg-card border border-card-border rounded-xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 text-accent"
          >
            <Sparkles className="w-8 h-8" />
          </motion.div>
          <p className="text-muted mb-6 text-sm max-w-md">
            Add items to your wishlist to get AI-tailored personalized suggestions!
          </p>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/collections"
              className="btn-shimmer flex items-center gap-2 px-6 py-3 bg-accent text-pure-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-accent-hover transition-colors"
            >
              Explore Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      ) : data.recommendations.length > 0 ? (
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.recommendations.map((rec) => (
            <StaggerItem key={rec.product._id} className="flex flex-col h-full">
              <div className="flex-1">
                <ProductCard {...rec.product} />
              </div>
              <p className="mt-3 text-xs italic text-muted text-center px-2 line-clamp-2">
                &ldquo;{rec.reason}&rdquo;
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="p-8 text-center text-muted bg-card border border-card-border rounded-xl text-sm">
          No new recommendations found at this time. Check back later!
        </div>
      )}
    </div>
  );
}
