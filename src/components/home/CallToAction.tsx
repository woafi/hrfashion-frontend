"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/PageMotion";

export function CallToAction() {
  return (
    <section className="py-28 bg-ink text-bone relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          aria-hidden
          animate={{ opacity: [0.06, 0.18, 0.06], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"
        />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.04, 0.12, 0.04], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-1/2 -right-1/4 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/30 via-transparent to-transparent"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/20"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-bone/20 text-xs font-medium uppercase tracking-wider mb-8 text-bone/70"
          >
            <Sparkles className="w-3 h-3" />
            We&apos;re Hiring
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-serif mb-6 leading-tight">
            Join The Team
          </h2>
          <p className="text-bone/60 mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
            We are always looking for creative, passionate individuals to shape the future of HR Fashion. Discover your next career move with us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/careers"
                className="btn-shimmer group inline-flex items-center gap-2 px-8 py-4 bg-accent text-pure-white font-medium uppercase tracking-widest text-sm rounded-sm hover:bg-accent-hover transition-colors duration-300"
              >
                View Openings
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-bone/30 text-bone font-medium uppercase tracking-widest text-sm rounded-sm hover:bg-bone/10 hover:border-bone/60 transition-all duration-300"
              >
                Shop Collection
              </Link>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
