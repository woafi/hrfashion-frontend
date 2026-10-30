"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useSession, getToken } from "@/lib/auth-client";
import { Star, Heart, Ruler, Truck, Loader2, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWishlist, addToWishlist, removeFromWishlist } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ProductReviews } from "@/components/product/ProductReviews";
import type { Product } from "@/lib/api";
import { PageMotion } from "@/components/ui/PageMotion";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.96,
  }),
};

function ImageCarousel({ images, title }: { images: string[]; title: string }) {
  const [[activeImage, direction], setSlide] = useState([0, 0]);
  const dragStart = useRef<number | null>(null);

  const paginate = (newDir: number) => {
    setSlide(([cur]) => {
      const next = (cur + newDir + images.length) % images.length;
      return [next, newDir];
    });
  };

  const jumpTo = (idx: number) => {
    setSlide(([cur]) => [idx, idx > cur ? 1 : -1]);
  };

  const onDragStart = (e: React.TouchEvent) => {
    dragStart.current = e.touches[0].clientX;
  };
  const onDragEnd = (e: React.TouchEvent) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) paginate(delta > 0 ? 1 : -1);
    dragStart.current = null;
  };

  if (!images.length) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail strip */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[700px] md:w-20 flex-shrink-0 pb-1 md:pb-0">
        {images.map((img, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => jumpTo(idx)}
            className={`relative aspect-[3/4] w-16 md:w-full flex-shrink-0 rounded-sm overflow-hidden border-2 transition-all duration-300 ${
              activeImage === idx
                ? "border-accent ring-2 ring-accent/30"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="w-full h-full object-cover" />
          </motion.button>
        ))}
      </div>

      {/* Main carousel */}
      <div
        className="flex-1 aspect-[3/4] md:aspect-auto md:h-[700px] bg-card border border-card-border rounded-sm overflow-hidden relative select-none card-glow"
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeImage}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[activeImage]}
              alt={title}
              className="w-full h-full object-cover object-center"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/85 backdrop-blur-md rounded-full border border-card-border hover:bg-background transition-colors shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 bg-background/85 backdrop-blur-md rounded-full border border-card-border hover:bg-background transition-colors shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpTo(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    activeImage === idx
                      ? "w-6 h-1.5 bg-accent"
                      : "w-1.5 h-1.5 bg-foreground/30 hover:bg-foreground/60"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ProductDetailsClient({ product }: { product: Product }) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const { data: wishlistData } = useQuery({
    queryKey: QUERY_KEYS.wishlist(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) return { items: [] };
      return fetchWishlist(token);
    },
    enabled: !!session,
  });

  const isInWishlist = wishlistData?.items.some((item) => item.productId === product._id) ?? false;

  const wishlistMutation = useMutation({
    mutationFn: async (action: "add" | "remove") => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return action === "add"
        ? addToWishlist(product._id, token)
        : removeFromWishlist(product._id, token);
    },
    onSuccess: (_, action) => {
      toast.success(action === "add" ? "Added to wishlist" : "Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wishlist() });
    },
    onError: () => toast.error("Failed to update wishlist"),
  });

  const handleWishlist = () => {
    if (!session) {
      toast.error("Please login to manage your wishlist");
      return;
    }
    wishlistMutation.mutate(isInWishlist ? "remove" : "add");
  };

  const handleAddToBag = () => {
    if (product.sizes?.length && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    toast.success("Added to shopping bag!");
  };

  return (
    <PageMotion>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted mb-8">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-accent transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.category}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Gallery */}
          <ImageCarousel images={product.images} title={product.title} />

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-2 block">
                  {product.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-serif">{product.title}</h1>
              </div>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlist}
                disabled={wishlistMutation.isPending}
                className={`p-3 border rounded-full transition-colors flex-shrink-0 cursor-pointer ${
                  isInWishlist
                    ? "border-accent bg-accent text-pure-white"
                    : "border-card-border hover:border-accent hover:text-accent bg-card"
                }`}
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {wishlistMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
                )}
              </motion.button>
            </div>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-card-border">
              <span className="text-2xl font-serif font-medium text-accent">${product.price}</span>
              <div className="flex items-center gap-1.5 text-muted bg-card px-2.5 py-1 rounded-full border border-card-border">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
              </div>
              {product.featured && (
                <span className="text-[10px] font-semibold uppercase tracking-widest bg-accent/10 text-accent px-2.5 py-1 rounded-full border border-accent/20">
                  Featured
                </span>
              )}
            </div>

            <p className="text-muted mb-8 leading-relaxed whitespace-pre-wrap text-sm">
              {product.fullDescription || product.shortDescription}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs uppercase tracking-widest font-medium mb-3">
                  <span>Color</span>
                  <span className="text-muted">{selectedColor || "Select a color"}</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-xs font-medium uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
                        selectedColor === color
                          ? "border-accent bg-accent text-pure-white shadow-sm"
                          : "border-card-border bg-card hover:border-accent/50 text-foreground"
                      }`}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-10">
                <div className="flex justify-between text-xs uppercase tracking-widest font-medium mb-3">
                  <span>Size</span>
                  <button className="text-muted hover:text-accent flex items-center gap-1 transition-colors">
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 border text-xs font-medium uppercase tracking-wider rounded-sm transition-all duration-200 cursor-pointer ${
                        selectedSize === size
                          ? "border-accent bg-accent text-pure-white shadow-sm"
                          : "border-card-border bg-card hover:border-accent/50 text-foreground"
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToBag}
              className="btn-shimmer w-full py-4 bg-foreground text-background font-medium uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity mb-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </motion.button>

            <motion.div
              whileHover={{ y: -2 }}
              className="flex items-center justify-center gap-2.5 text-xs text-muted py-4 border-t border-card-border mt-4"
            >
              <Truck className="w-4 h-4 text-accent" />
              Free shipping on orders over $200 &bull; 30-day hassle-free returns
            </motion.div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-24 pt-16 border-t border-card-border">
          <ProductReviews productId={product._id} />
        </div>
      </div>
    </PageMotion>
  );
}
