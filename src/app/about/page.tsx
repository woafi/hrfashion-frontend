"use client";

import { useQuery } from "@tanstack/react-query";
import { Accordion } from "radix-ui";
import { ChevronDown, Sparkles } from "lucide-react";
import { fetchTeam, type TeamMember } from "@/lib/api";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { PageMotion, ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";
import { motion } from "framer-motion";

// ---- Team Card ----
function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex flex-col bg-card border border-card-border rounded-sm overflow-hidden card-glow"
    >
      <div className="aspect-[4/5] overflow-hidden bg-background relative">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-108 transition-all duration-700 ease-out transform-gpu"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-1">{member.designation}</p>
        <h3 className="font-serif text-lg text-foreground mb-3 group-hover:text-accent transition-colors duration-200">
          {member.name}
        </h3>
        <p className="text-sm text-muted leading-relaxed">{member.description}</p>
      </div>
    </motion.div>
  );
}

// ---- Skeleton ----
function TeamSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card border border-card-border rounded-sm overflow-hidden animate-pulse">
          <div className="aspect-[4/5] bg-card" />
          <div className="p-5 space-y-3">
            <div className="h-3 bg-foreground/10 rounded w-1/3" />
            <div className="h-5 bg-foreground/10 rounded w-2/3" />
            <div className="h-3 bg-foreground/10 rounded w-full" />
            <div className="h-3 bg-foreground/10 rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- FAQ Data ----
const FAQ_ITEMS = [
  {
    q: "Do you offer private label manufacturing?",
    a: "Yes. HR Fashion specialises in private label garment production. We work closely with brands of all sizes to produce custom collections — from design consultation and fabric sourcing through to final delivery — under your own label.",
  },
  {
    q: "What is your minimum order quantity?",
    a: "Our standard MOQ is 300 pieces per style, per colour. For premium bespoke ranges we can accommodate smaller runs — please contact our production team to discuss your specific requirements.",
  },
  {
    q: "How can I apply for a job?",
    a: "Visit our Careers page to browse all open positions. Select any role that suits your background and click \"Apply Now\" to fill in the application form. Our HR team reviews every submission and responds within 7 working days.",
  },
  {
    q: "Do you export internationally?",
    a: "Yes. We export to markets across Europe, North America, the Middle East, and Asia-Pacific. All shipments comply with international trade regulations and we handle end-to-end logistics documentation.",
  },
  {
    q: "How do I track my application status?",
    a: "Log in to your user dashboard and navigate to the Applications section. You will see real-time status updates — Pending, Accepted, or Rejected — for every position you have applied to.",
  },
  {
    q: "What sustainability practices do you follow?",
    a: "Sustainability is central to our production model. We use GOTS-certified organic fabrics where possible, operate zero-discharge dyeing facilities, partner with local artisans to reduce supply chain emissions, and aim for zero-landfill packaging by 2026.",
  },
];

export default function AboutPage() {
  const { data: team = [], isLoading: teamLoading } = useQuery({
    queryKey: QUERY_KEYS.team(),
    queryFn: fetchTeam,
  });

  return (
    <PageMotion>
      <main className="bg-background text-foreground min-h-screen">
        {/* ---- HERO ---- */}
        <section className="relative h-[65vh] min-h-[460px] flex items-end overflow-hidden">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=2400&q=85"
            alt="HR Fashion garment manufacturing atelier"
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-ink/60 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-accent mb-4 border border-accent/30 px-3 py-1 rounded-full"
            >
              <Sparkles className="w-3 h-3" />
              Established Dhaka, 2018
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl font-serif leading-none"
            >
              About HR Fashion
            </motion.h1>
          </div>
        </section>

        {/* ---- OUR VISION ---- */}
        <ScrollReveal>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4 block">Our Vision</span>
                <h2 className="text-4xl md:text-5xl font-serif mb-8 leading-snug">
                  Craftsmanship for a Conscious World
                </h2>
                <div className="space-y-5 text-muted leading-relaxed">
                  <p>
                    HR Fashion was founded on a single conviction: that garment manufacturing can be both
                    exceptional in quality and responsible in practice. From our atelier in Dhaka we produce
                    collections that meet global export standards — without compromise on the hands that make them.
                  </p>
                  <p>
                    We invest in local textile talent, partnering with skilled artisans whose craft elevates every
                    seam and stitch. Our vertically integrated production process — from organic fabric sourcing to
                    final quality inspection — ensures that every piece leaving our facility is built to endure.
                  </p>
                  <p>
                    Sustainable production is not an add-on for us; it is the framework. We operate
                    closed-loop dyeing facilities, source GOTS-certified materials, and hold ourselves to the
                    environmental benchmarks demanded by the world&apos;s leading retail partners.
                  </p>
                </div>
              </div>

              {/* Images grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Large image */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="aspect-[3/4] rounded-sm overflow-hidden row-span-2 border border-card-border"
                >
                  <img
                    src="https://images.unsplash.com/photo-1533758488827-1ed0f9b03899?auto=format&fit=crop&w=900&q=85"
                    alt="Textile craftsmanship"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </motion.div>

                {/* Top right */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="aspect-[3/2] rounded-sm overflow-hidden border border-card-border"
                >
                  <img
                    src="https://baronboutique.com/wp-content/uploads/2025/10/fashion-designer-working-atelier-studio-sketching-fabric.jpg"
                    alt="Fashion design atelier"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </motion.div>

                {/* Bottom right */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="aspect-[3/2] rounded-sm overflow-hidden border border-card-border"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560797001-bfcf85c33a3a?auto=format&fit=crop&w=900&q=85"
                    alt="Garment stitching process"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </motion.div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-card-border" />
        </div>

        {/* ---- THE DREAM TEAM ---- */}
        <ScrollReveal>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mb-12">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4 block">The Dream Team</span>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <h2 className="text-4xl md:text-5xl font-serif max-w-xl leading-snug">
                  The People Behind the Label
                </h2>
                <p className="text-muted text-sm max-w-sm leading-relaxed">
                  Every collection is a collaboration. Meet the creative and operational minds who
                  bring HR Fashion&apos;s vision to life, season after season.
                </p>
              </div>
            </div>

            {teamLoading ? (
              <TeamSkeleton />
            ) : team.length === 0 ? (
              <div className="py-24 text-center border border-card-border rounded-sm">
                <p className="text-muted uppercase tracking-widest text-sm">Team profiles coming soon.</p>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map((member) => (
                  <StaggerItem key={member._id}>
                    <TeamMemberCard member={member} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </section>
        </ScrollReveal>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-card-border" />
        </div>

        {/* ---- FAQ ---- */}
        <ScrollReveal>
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="mb-12 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-4 block">Got Questions?</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-snug">Frequently Asked Questions</h2>
            </div>

            <Accordion.Root type="single" collapsible className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <Accordion.Item
                  key={idx}
                  value={`item-${idx}`}
                  className="border border-card-border rounded-xl bg-card overflow-hidden data-[state=open]:border-accent/40 card-glow transition-all duration-300"
                >
                  <Accordion.Header>
                    <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left font-medium text-sm group hover:text-accent transition-colors">
                      <span className="tracking-wide">{item.q}</span>
                      <ChevronDown className="w-4 h-4 text-muted flex-shrink-0 ml-4 transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-accent" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 overflow-hidden text-sm data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
                    <p className="px-6 pb-6 text-muted leading-relaxed border-t border-card-border/50 pt-4">{item.a}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </section>
        </ScrollReveal>
      </main>
    </PageMotion>
  );
}
