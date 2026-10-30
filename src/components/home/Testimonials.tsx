"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ui/PageMotion";

const testimonials = [
  {
    quote: "The attention to detail and fabric quality is simply unmatched. HR Fashion has redefined my wardrobe.",
    author: "Sarah Jenkins",
    role: "Creative Director",
    rating: 5,
  },
  {
    quote: "Minimalist, elegant, and perfectly tailored. Their pieces always make me feel confident.",
    author: "Michael Chen",
    role: "Architect",
    rating: 5,
  },
  {
    quote: "I love the editorial aesthetic. Every collection feels curated and timeless.",
    author: "Elena Rossi",
    role: "Fashion Blogger",
    rating: 5,
  },
];

export function Testimonials() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > active ? 1 : -1);
    setActive(next);
  };

  const prev = () => go((active - 1 + testimonials.length) % testimonials.length);
  const next = () => go((active + 1) % testimonials.length);

  return (
    <section className="py-24 bg-foreground text-background relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <h2 className="text-xs tracking-widest uppercase mb-16 opacity-60 text-center">
            What Our Clients Say
          </h2>
        </ScrollReveal>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid grid-cols-3 gap-10">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="flex flex-col items-center text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center mb-6"
              >
                <Quote className="w-4 h-4 opacity-60" />
              </motion.div>
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current opacity-80" />
                ))}
              </div>
              <p className="text-base font-serif italic mb-6 leading-relaxed opacity-90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-auto">
                <p className="font-medium text-sm">{t.author}</p>
                <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden min-h-[260px] flex items-center">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={active}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex flex-col items-center text-center w-full px-4"
              >
                <Quote className="w-6 h-6 opacity-40 mb-5" />
                <div className="flex gap-0.5 mb-4">
                  {[...Array(testimonials[active].rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current opacity-80" />
                  ))}
                </div>
                <p className="text-lg font-serif italic mb-6 leading-relaxed opacity-90">
                  &ldquo;{testimonials[active].quote}&rdquo;
                </p>
                <p className="font-medium text-sm">{testimonials[active].author}</p>
                <p className="text-xs opacity-50 mt-1 uppercase tracking-wider">{testimonials[active].role}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <motion.button whileTap={{ scale: 0.9 }} onClick={prev} className="p-2 rounded-full border border-background/20 hover:bg-background/10 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`rounded-full transition-all duration-300 ${i === active ? "w-6 h-1.5 bg-background" : "w-1.5 h-1.5 bg-background/30"}`}
                />
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={next} className="p-2 rounded-full border border-background/20 hover:bg-background/10 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
