"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Heart, Trash2, Loader2, ArrowRight, Sparkles, LogIn } from "lucide-react";
import { toast } from "sonner";
import { fetchWishlist, removeFromWishlist } from "@/lib/api";
import { getToken, useSession } from "@/lib/auth-client";
import { ProductCard } from "@/components/cards/ProductCard";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { PageMotion, StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/PageMotion";
import { RecommendationsSection } from "@/components/product/RecommendationsSection";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { motion } from "framer-motion";

export default function WishlistPage() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.wishlist(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) return { items: [] };
      try {
        return await fetchWishlist(token);
      } catch (e) {
        return { items: [] };
      }
    },
    enabled: !!session?.user,
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await removeFromWishlist(productId, token);
    },
    onSuccess: () => {
      toast.success("Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recommendations() });
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  const items = data?.items || [];

  return (
    <PageMotion>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10 pb-6 border-b border-card-border">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-2 block">
                Saved Items
              </span>
              <h1 className="text-4xl font-serif mb-2">My Wishlist</h1>
              <p className="text-muted text-sm">
                Curate your favorite pieces and get AI-powered recommendations.
              </p>
            </div>
            {session?.user && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-widest bg-card px-3 py-1.5 rounded-full border border-card-border">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Content */}
        {isSessionLoading || (session?.user && isLoading) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {Array(4).fill(0).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : !session?.user ? (
          /* Not signed in state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-card-border p-12 md:p-16 text-center max-w-xl mx-auto my-12 card-glow"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6 border border-accent/20"
            >
              <Heart className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-serif mb-3">Sign in to save your favorites</h2>
            <p className="text-muted text-sm leading-relaxed mb-8">
              Create an account or log in to sync your wishlist across all devices and receive tailored styling recommendations from our AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/login?callbackUrl=/wishlist"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-foreground text-background text-xs font-semibold uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity w-full sm:w-auto"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-card-border text-xs font-semibold uppercase tracking-widest rounded-sm hover:border-accent hover:text-accent transition-colors w-full sm:w-auto"
                >
                  Explore Collections <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : items.length === 0 ? (
          /* Empty wishlist state */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-card-border p-12 md:p-16 text-center max-w-xl mx-auto my-12 card-glow"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 rounded-full bg-card border border-card-border flex items-center justify-center mx-auto mb-6 text-muted"
            >
              <Heart className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-serif mb-3">Your wishlist is empty</h2>
            <p className="text-muted text-sm leading-relaxed mb-8">
              Explore our latest fashion collections and click the heart icon on any piece to save it here.
            </p>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/collections"
                className="btn-shimmer inline-flex items-center gap-2 px-8 py-4 bg-accent text-pure-white text-xs font-semibold uppercase tracking-widest rounded-sm hover:bg-accent-hover transition-colors"
              >
                Discover Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {items.map((item) => {
              if (!item.product) return null;
              return (
                <StaggerItem key={item._id}>
                  <div className="relative group">
                    <ProductCard {...item.product} />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeMutation.mutate(item.product!._id)}
                      disabled={removeMutation.isPending}
                      className="absolute top-3 right-3 z-20 p-2.5 bg-background/90 backdrop-blur-md rounded-full text-muted hover:text-red-500 hover:bg-background border border-card-border shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Remove from wishlist"
                    >
                      {removeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* AI Recommendations */}
        <div className="mt-8">
          <RecommendationsSection />
        </div>
      </main>
    </PageMotion>
  );
}

