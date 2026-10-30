"use client";

import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface JobCardProps {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

const TYPE_COLORS: Record<string, string> = {
  "full-time": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "part-time": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  internship: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  contract: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

export function JobCard({
  _id,
  title,
  department,
  location,
  type,
  description,
}: JobCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex flex-col bg-card rounded-sm border border-card-border p-6 card-glow relative overflow-hidden h-full"
    >
      {/* Animated left accent bar */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1 bg-accent origin-top"
        initial={{ scaleY: 0 }}
        whileHover={{ scaleY: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-serif text-xl line-clamp-1 group-hover:text-accent transition-colors duration-200">
          {title}
        </h3>
        <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest rounded-full whitespace-nowrap ${TYPE_COLORS[type] || "bg-background text-muted border border-card-border"}`}>
          {type.replace("-", " ")}
        </span>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted mb-4 uppercase tracking-wide">
        <span className="flex items-center gap-1">
          <Briefcase className="w-3 h-3 text-accent" /> {department}
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-accent" /> {location}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> Active
        </span>
      </div>
      
      <p className="text-sm text-muted mb-8 line-clamp-3 flex-1 leading-relaxed">
        {description}
      </p>
      
      <div className="pt-4 border-t border-card-border mt-auto">
        <Link 
          href={`/careers/${_id}`}
          className="group/link inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground hover:text-accent transition-colors duration-200"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1.5 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
}
