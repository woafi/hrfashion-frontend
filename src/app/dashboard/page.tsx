"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, FileText, Heart, Clock, Sparkles } from "lucide-react";
import { fetchMyApplications, fetchWishlist } from "@/lib/api";
import { getToken } from "@/lib/auth-client";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { RecommendationsSection } from "@/components/product/RecommendationsSection";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/ui/PageMotion";

export default function DashboardOverviewPage() {
  const { data: applications, isLoading: isAppsLoading } = useQuery({
    queryKey: QUERY_KEYS.applications(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchMyApplications(token);
    }
  });

  const { data: wishlist, isLoading: isWishlistLoading } = useQuery({
    queryKey: QUERY_KEYS.wishlist(),
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return fetchWishlist(token);
    }
  });

  const pendingApps = applications?.filter(app => app.status === "pending").length || 0;
  const recentApps = applications?.slice(0, 3) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-2 block">
          Welcome back
        </span>
        <h1 className="text-3xl font-serif mb-2">Overview</h1>
        <p className="text-muted text-sm">Monitor your job applications, interviews, and personalized recommendations.</p>
      </div>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StaggerItem>
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="bg-card rounded-xl border border-card-border p-6 card-glow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Total Applications</span>
              <div className="p-2.5 rounded-full bg-accent/10 text-accent">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-serif text-foreground">
              {isAppsLoading ? "..." : (applications?.length || 0)}
            </p>
          </motion.div>
        </StaggerItem>
        
        <StaggerItem>
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="bg-card rounded-xl border border-card-border p-6 card-glow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Pending Review</span>
              <div className="p-2.5 rounded-full bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-serif text-foreground">
              {isAppsLoading ? "..." : pendingApps}
            </p>
          </motion.div>
        </StaggerItem>

        <StaggerItem>
          <motion.div
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="bg-card rounded-xl border border-card-border p-6 card-glow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted">Wishlist Items</span>
              <div className="p-2.5 rounded-full bg-accent/10 text-accent">
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-serif text-foreground">
              {isWishlistLoading ? "..." : (wishlist?.items?.length || 0)}
            </p>
          </motion.div>
        </StaggerItem>
      </StaggerContainer>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-card rounded-xl border border-card-border overflow-hidden card-glow"
      >
        <div className="flex justify-between items-center p-6 border-b border-card-border">
          <h2 className="text-lg font-serif">Recent Applications</h2>
          <Link
            href="/dashboard/applications"
            className="text-xs font-semibold uppercase tracking-widest text-muted hover:text-accent flex items-center gap-1.5 transition-colors group"
          >
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
        
        <div className="divide-y divide-card-border">
          {isAppsLoading ? (
            <div className="p-8 text-center text-muted">Loading...</div>
          ) : recentApps.length === 0 ? (
            <div className="p-8 text-center text-muted text-sm">
              You haven&apos;t submitted any applications yet.
            </div>
          ) : (
            recentApps.map(app => (
              <motion.div
                key={app._id}
                whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
                transition={{ duration: 0.2 }}
                className="p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-foreground">{app.job?.title || "Application"}</h3>
                  <p className="text-xs text-muted mt-1">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest
                    ${app.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
                  `}>
                    {app.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      <RecommendationsSection />
    </div>
  );
}
