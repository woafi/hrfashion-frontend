"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { ScrollReveal } from "@/components/ui/PageMotion";

export function Newsletter() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-b border-card-border">
      <ScrollReveal>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-card-border rounded-2xl p-10 md:p-14 relative overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl mb-4 inline-block"
            >
              ✉️
            </motion.div>
            <h2 className="text-3xl font-serif mb-3">Join The Club</h2>
            <p className="text-muted mb-10 max-w-md mx-auto">
              Subscribe to receive early access to new collections, exclusive events, and editorial content.
            </p>

            <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-3" onSubmit={handleSubmit}>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-focus-ring flex-1 px-4 py-3 bg-background border border-card-border rounded-sm text-sm"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="btn-shimmer px-8 py-3 bg-accent text-pure-white text-sm font-medium uppercase tracking-widest rounded-sm hover:bg-accent-hover transition-colors duration-300 whitespace-nowrap flex items-center justify-center gap-2 min-w-[130px]"
              >
                {sent ? (
                  <motion.span
                    key="sent"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" /> Subscribed!
                  </motion.span>
                ) : (
                  <motion.span key="default" className="flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" /> Subscribe
                  </motion.span>
                )}
              </motion.button>
            </form>

            <p className="text-xs text-muted mt-4">No spam. Unsubscribe at any time.</p>
          </div>
        </motion.div>
      </ScrollReveal>
    </section>
  );
}
