"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const HERO_IMAGES = [
  "/hero1.jpg",
  "/hero2.jpg",
  "/hero3.jpg",
  "/hero4.jpg",
  "/hero5.jpg",
];

const HEADLINES = [
  "Redefining Modern Elegance",
  "Crafted for the Contemporary",
  "Where Art Meets Fashion",
  "Timeless. Bold. Premium.",
  "New Season, New Vision",
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 700], [0, 120]);
  const contentY = useTransform(scrollY, [0, 700], [0, -90]);
  const contentOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[560px] flex items-center justify-center overflow-hidden bg-card">
      {/* Background image carousel */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
        {HERO_IMAGES.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === current ? 1 : 0,
              scale: i === current ? 1.06 : 1.02,
            }}
            transition={{
              opacity: { duration: 1.4, ease: "easeInOut" },
              scale: { duration: 7, ease: "linear" },
            }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/60" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-ink/30 via-transparent to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase mb-6 text-accent border border-accent/40 px-4 py-1.5 rounded-full backdrop-blur-sm bg-white/5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          New Season 2026
        </motion.span>

        {/* Animated headline */}
        <div className="overflow-hidden mb-6">
          <AnimatePresence mode="wait">
            <motion.h2
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-5xl md:text-7xl font-serif font-medium tracking-tight leading-tight text-white"
            >
              {HEADLINES[current % HEADLINES.length]}
            </motion.h2>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="text-white/75 mb-10 max-w-lg mx-auto text-lg leading-relaxed"
        >
          Discover the latest collection of premium garments designed for the contemporary lifestyle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/collections"
              className="btn-shimmer group inline-flex items-center gap-3 px-8 py-4 bg-accent text-pure-white font-medium tracking-wide rounded-sm hover:bg-accent-hover transition-colors duration-300"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/30 text-white font-medium tracking-wide rounded-sm hover:bg-white/10 hover:border-white/60 transition-all duration-300"
            >
              Our Story
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Image dots indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 flex gap-2"
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-500 ${
              i === current ? "w-8 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-white/70"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}
