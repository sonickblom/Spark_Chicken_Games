"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  variant?: "default" | "compact" | "featured";
  className?: string;
}

/** Shimmer skeleton element — renders a dark box with a sweeping highlight. */
function Shimmer({
  className,
  rounded = "rounded-md",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/[0.04]",
        rounded,
        className,
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.04) 40%, rgba(0,255,65,0.07) 50%, rgba(0,255,65,0.04) 60%, transparent 100%)",
        }}
      />
    </div>
  );
}

export function SkeletonCard({
  variant = "default",
  className,
}: SkeletonCardProps) {
  // ─── Compact variant ──────────────────────────────────────────
  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex gap-0 p-[1px] bg-white/[0.02] ring-1 ring-white/[0.06] rounded-xl",
          className,
        )}
      >
        <div className="flex-1 min-w-0 flex gap-4 bg-cyber-dark-surface rounded-[calc(1rem-1px)] p-3">
          <Shimmer className="w-20 h-28 flex-shrink-0 rounded-lg" />

          <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-full" />
              <Shimmer className="h-3 w-1/2" />
              <div className="flex items-center gap-2">
                <Shimmer className="size-3 rounded" />
                <Shimmer className="h-3 w-10" />
                <Shimmer className="h-3 w-14" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-5 w-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Featured variant ─────────────────────────────────────────
  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className={cn(
          "relative aspect-[16/9] rounded-2xl overflow-hidden bg-white/[0.02] ring-1 ring-white/[0.06]",
          className,
        )}
      >
        <Shimmer className="absolute inset-0 !rounded-none" rounded="rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Shimmer className="h-5 w-16 rounded-full" />
            <Shimmer className="h-5 w-20 rounded-full" />
            <Shimmer className="h-5 w-14 rounded-full" />
          </div>
          <Shimmer className="h-8 w-3/4 mb-2" />
          <Shimmer className="h-4 w-full mb-1" />
          <Shimmer className="h-4 w-2/3 mb-4" />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shimmer className="size-4 rounded" />
              <Shimmer className="h-4 w-10" />
              <Shimmer className="h-3 w-16" />
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Shimmer className="h-6 w-24" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── Default variant ──────────────────────────────────────────
  return (
    <div
      className={cn(
        "bg-white/[0.02] ring-1 ring-white/[0.06] p-[1px] rounded-[1.25rem] flex flex-col h-full",
        className,
      )}
    >
      <div className="bg-cyber-dark-surface rounded-[calc(1.25rem-1px)] overflow-hidden flex flex-col h-full">
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Shimmer className="absolute inset-0 !rounded-none" rounded="rounded-none" />
          <div className="absolute top-3 left-3">
            <Shimmer className="h-5 w-14 rounded-full" />
          </div>
          <div className="absolute top-3 right-3">
            <Shimmer className="h-5 w-10 rounded-full" />
          </div>
          <div className="absolute top-3 right-12">
            <Shimmer className="size-9 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Shimmer className="h-5 w-16 rounded-full" />
            <Shimmer className="h-5 w-20 rounded-full" />
            <Shimmer className="h-5 w-14 rounded-full" />
          </div>

          <Shimmer className="h-4 w-3/4" />
          <div className="flex flex-col gap-1.5">
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-4/5" />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Shimmer className="size-3.5 rounded" />
              <Shimmer className="h-3.5 w-10" />
              <Shimmer className="h-3 w-14" />
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <Shimmer className="size-3 rounded" />
              <Shimmer className="h-3 w-10" />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            <Shimmer className="h-5 w-14 rounded-md" />
            <Shimmer className="h-5 w-16 rounded-md" />
            <Shimmer className="h-5 w-12 rounded-md" />
            <Shimmer className="h-5 w-16 rounded-md" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-14" />
            <Shimmer className="h-5 w-20" />
          </div>
          <Shimmer className="h-8 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
