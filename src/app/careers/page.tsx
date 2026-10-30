"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Sparkles, Filter } from "lucide-react";
import { fetchJobs } from "@/lib/api";
import { JobCard } from "@/components/cards/JobCard";
import { JobCardSkeleton } from "@/components/skeletons/JobCardSkeleton";
import { PageMotion, StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/PageMotion";
import { motion, AnimatePresence } from "framer-motion";

function CareersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", searchParams.toString()],
    queryFn: () => fetchJobs(searchParams),
  });

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <PageMotion>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
        <div className="max-w-2xl mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-accent mb-3 border border-accent/30 px-3 py-1 rounded-full"
          >
            <Sparkles className="w-3 h-3" /> Join Our Team
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Careers at HR Fashion</h1>
          <p className="text-muted leading-relaxed text-sm md:text-base">
            Join our team of designers, engineers, and creatives. We are always looking for passionate individuals to help us shape the future of modern fashion.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 pb-4 border-b border-card-border">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-medium">Open Positions</h2>
            {data && (
              <span className="text-xs bg-accent/10 text-accent font-semibold px-2 py-0.5 rounded-full border border-accent/20">
                {data.total}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted hidden sm:block" />
            <select 
              className="px-4 py-2.5 bg-card border border-card-border rounded-sm text-xs font-medium uppercase tracking-wider focus:outline-none focus:border-accent w-full sm:w-auto cursor-pointer transition-colors"
              value={searchParams.get("department") || ""}
              onChange={(e) => updateParam("department", e.target.value || null)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Retail">Retail</option>
            </select>
          </div>
        </div>

        <div className="mb-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array(4).fill(0).map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : data?.jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 text-muted bg-card rounded-xl border border-card-border"
            >
              No open positions found matching your criteria. Check back soon!
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={searchParams.toString()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data?.jobs.map((job) => (
                    <StaggerItem key={job._id}>
                      <JobCard {...job} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
                
                {data && data.totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={data.page <= 1}
                      onClick={() => updateParam("page", (data.page - 1).toString())}
                      className="p-2.5 border border-card-border rounded-sm disabled:opacity-40 hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <span className="text-xs font-semibold uppercase tracking-widest px-4">
                      Page {data.page} of {data.totalPages}
                    </span>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={data.page >= data.totalPages}
                      onClick={() => updateParam("page", (data.page + 1).toString())}
                      className="p-2.5 border border-card-border rounded-sm disabled:opacity-40 hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageMotion>
  );
}

export default function CareersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 text-center text-muted">Loading careers...</div>}>
      <CareersContent />
    </Suspense>
  );
}
