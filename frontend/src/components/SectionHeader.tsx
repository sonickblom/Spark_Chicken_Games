import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.32, 0.72, 0, 1] as const;

function revealOnScroll(delay = 0) {
  return {
    initial: { opacity: 0, y: 40, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.7, delay, ease },
  };
}

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-end justify-between gap-6", className)}>
      <motion.div {...revealOnScroll()}>
        <span className="inline-block rounded-full border border-neon-green/30 bg-neon-green/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-green">
          {eyebrow}
        </span>
        <h2 className="mt-4 font-sans text-3xl font-bold text-white sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-lg font-mono text-sm text-cyber-text-muted">
            {description}
          </p>
        )}
      </motion.div>

      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-neon-green transition-all duration-500 hover:gap-2.5 hover:text-neon-green-dim sm:inline-flex"
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
