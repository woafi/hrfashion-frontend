"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CountUp } from "@/components/ui/PageMotion";

const STATS = [
  { label: "Years of Craftsmanship", value: 15, suffix: "+", icon: "🏆" },
  { label: "Unique Collections", value: 50, suffix: "+", icon: "✨" },
  { label: "Happy Customers", value: 100, suffix: "k+", icon: "❤️" },
  { label: "Countries Served", value: 30, suffix: "+", icon: "🌍" },
];

export function Statistics() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-24 border-y border-card-border relative overflow-hidden" ref={ref}>
      {/* Animated background blob */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={false}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-accent blur-3xl"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 text-center">
          {STATS.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              whileHover={{ scale: 1.04 }}
              className="group cursor-default"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3 + idx * 0.3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                className="text-3xl mb-3"
              >
                {stat.icon}
              </motion.div>
              <div className="text-4xl md:text-5xl font-serif mb-3 text-foreground">
                <CountUp value={stat.value} suffix={stat.suffix} duration={1.3 + idx * 0.1} />
              </div>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={inView ? { scaleX: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.4 + idx * 0.12, ease: "easeOut" }}
                className="h-px w-10 bg-accent mx-auto mb-3 origin-center"
              />
              <div className="text-sm tracking-widest uppercase text-muted group-hover:text-foreground transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
