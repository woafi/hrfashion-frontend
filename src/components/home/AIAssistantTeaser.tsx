"use client";

import Link from "next/link";
import { Sparkles, MessageSquare, Zap, Brain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/lib/auth-client";
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/PageMotion";

const FEATURES = [
  { icon: Zap, label: "Real-time product search" },
  { icon: Brain, label: "Personalized recommendations" },
  { icon: Sparkles, label: "Live job & service data" },
];

export function AIAssistantTeaser() {
  const { data: session } = useSession();
  
  return (
    <section className="py-24 bg-card relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="bg-background rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-sm border border-card-border relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-card-border text-xs font-medium uppercase tracking-wider mb-6"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-accent" />
                </motion.span>
                <span>AI Style Assistant</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-3xl md:text-4xl font-serif mb-6 leading-tight"
              >
                Not sure what to wear? <br />
                <span className="text-accent">Let our AI curate your look.</span>
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted mb-8 max-w-lg leading-relaxed"
              >
                Experience personalized styling. Chat with our intelligent assistant to discover pieces that perfectly match your taste, occasion, and body type.
              </motion.p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {FEATURES.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-card-border rounded-full text-xs text-muted"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </motion.div>
                ))}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link 
                  href={session ? "/dashboard/ai-assistant" : "/login?callbackUrl=/dashboard/ai-assistant"} 
                  className="btn-shimmer group inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background text-sm font-medium rounded-sm hover:opacity-90 transition-opacity"
                >
                  <MessageSquare className="w-4 h-4" />
                  Start Styling Session
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </div>
            
            {/* Chat preview */}
            <div className="flex-1 w-full relative">
              <StaggerContainer className="aspect-square max-w-sm mx-auto bg-card rounded-xl relative overflow-hidden border border-card-border p-6 flex flex-col shadow-xl">
                {/* Chat header */}
                <div className="flex items-center gap-2 pb-4 border-b border-card-border mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  </div>
                  <span className="text-xs text-muted ml-2 font-medium">AI Style Assistant</span>
                </div>

                <StaggerItem className="flex gap-3 mb-5">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center text-background"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                  <div className="bg-card rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm">
                    Hello! I&apos;m your personal HR Fashion style assistant. What occasion are we dressing for today?
                  </div>
                </StaggerItem>

                <StaggerItem className="flex gap-3 self-end flex-row-reverse mb-5">
                  <div className="w-8 h-8 rounded-full bg-card border border-card-border flex-shrink-0" />
                  <div className="bg-foreground text-background rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-sm">
                    I need a smart casual outfit for a creative agency interview.
                  </div>
                </StaggerItem>

                <StaggerItem className="flex gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center text-background">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-none px-4 py-3 text-sm shadow-sm">
                    Perfect. I recommend pairing our Linen Blend Blazer with the Pleated Wide Trousers...
                  </div>
                </StaggerItem>

                <StaggerItem className="flex gap-3 mt-auto">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center text-background"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </motion.div>
                  <div className="bg-card rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="w-1.5 h-1.5 rounded-full bg-muted"
                        animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.18, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </StaggerItem>
              </StaggerContainer>
              
              {/* Decorative blurs */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/10 rounded-full mix-blend-multiply filter blur-2xl pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full mix-blend-multiply filter blur-2xl pointer-events-none" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
