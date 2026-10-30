"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { MapPin, Briefcase, Clock, Calendar, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { ApplyModal } from "@/components/modals/ApplyModal";
import { PageMotion } from "@/components/ui/PageMotion";
import type { Job } from "@/lib/api";
import { motion } from "framer-motion";

export function JobDetailsClient({ job }: { job: Job }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleApplyClick = () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setIsApplyModalOpen(true);
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <PageMotion>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 min-h-screen">
        <Link 
          href="/careers" 
          className="group inline-flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors mb-8 uppercase tracking-widest font-semibold"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Careers
        </Link>
        
        <div className="bg-card rounded-2xl border border-card-border p-8 md:p-12 mb-8 card-glow relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent/40 via-accent to-accent/40" />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pb-8 border-b border-card-border">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent mb-2 block">
                {job.department}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif mb-4">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted uppercase tracking-widest">
                <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-card-border">
                  <Briefcase className="w-3.5 h-3.5 text-accent" /> {job.department}
                </span>
                <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-card-border">
                  <MapPin className="w-3.5 h-3.5 text-accent" /> {job.location}
                </span>
                <span className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-full border border-card-border">
                  <Clock className="w-3.5 h-3.5 text-accent" /> {job.type.replace("-", " ")}
                </span>
              </div>
            </div>
            {session?.user?.role === "admin" ? (
              <p className="text-xs text-muted uppercase tracking-widest font-medium border border-card-border px-6 py-4 rounded-sm bg-background">
                Admins cannot apply to jobs
              </p>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleApplyClick}
                className="btn-shimmer px-8 py-4 bg-foreground text-background font-medium uppercase tracking-widest text-sm rounded-sm hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer shadow-lg flex items-center gap-2"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </motion.button>
            )}
          </div>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <h3 className="text-xl font-serif mb-4">About the Role</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-muted mb-10 text-sm">
              {job.description}
            </p>
            
            <h3 className="text-xl font-serif mb-4">Requirements</h3>
            <div className="space-y-3 mb-10">
              {job.requirements.map((req, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background border border-card-border text-sm text-muted"
                >
                  <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{req}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-widest mt-12 pt-8 border-t border-card-border">
            <Calendar className="w-4 h-4 text-accent" /> Posted on {formattedDate}
          </div>
        </div>
      
        <ApplyModal 
          jobId={job._id}
          jobTitle={job.title}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      </div>
    </PageMotion>
  );
}
