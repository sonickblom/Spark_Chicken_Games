"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function SkeletonCard({
  variant = "default",
  className,
}: SkeletonCardProps) {
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "group flex gap-4 p-2 bg-cyber-dark-card/50 rounded-lg",
          className,
        )}
      >
        <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <div className="skeleton w-full h-full" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-3 w-full mb-1" />
            <div className="skeleton h-3 w-1/2 mb-1" />
            <div className="flex items-center gap-2 mt-2">
              <div className="skeleton h-3 w-3 rounded" />
              <div className="skeleton h-4 w-16" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <div className="skeleton h-4 w-16" />
              <div className="skeleton h-5 w-20 font-semibold" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative group aspect-[16/9] rounded-2xl overflow-hidden",
          className,
        )}
      >
        <div className="skeleton w-full h-full absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/90 via-cyber-dark/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
          </div>
          <div className="skeleton h-8 w-3/4 mb-2" />
          <div className="skeleton h-5 w-full mb-4" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="skeleton h-4 w-4 rounded" />
              <div className="skeleton h-5 w-12" />
              <div className="skeleton h-4 w-20" />
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <div className="skeleton h-6 w-24 font-bold" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "bg-cyber-dark-card border border-cyber-dark-border rounded-xl overflow-hidden flex flex-col h-full",
        className,
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="skeleton w-full h-full" />
        <div className="absolute top-3 left-3">
          <div className="skeleton h-5 w-14 rounded" />
        </div>
        <div className="absolute top-3 right-3">
          <div className="skeleton h-5 w-10 rounded" />
        </div>
        <div className="absolute top-3 right-3">
          <div className="skeleton h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>

        <div className="skeleton h-6 w-3/4 mb-1" />
        <div className="skeleton h-4 w-full mb-3" />
        <div className="skeleton h-4 w-1/2 mb-3" />

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <div className="skeleton h-4 w-4 rounded" />
            <div className="skeleton h-5 w-12" />
            <div className="skeleton h-3 w-20" />
          </div>
          <div className="flex items-center gap-1 ml-auto text-cyber-text-muted text-xs">
            <div className="skeleton h-3 w-3 rounded" />
            <div className="skeleton h-3 w-12" />
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-5 w-16 rounded" />
        </div>
      </div>

      <div className="p-4 border-t border-cyber-dark-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-14" />
          <div className="skeleton h-6 w-20 font-bold" />
        </div>
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}
