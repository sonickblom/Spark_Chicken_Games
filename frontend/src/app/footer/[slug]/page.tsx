"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";

const ease = [0.32, 0.72, 0, 1] as const;

function fadeUp(
  delay: number,
): {
  initial: { opacity: number; y: number; filter: string };
  animate: { opacity: number; y: number; filter: string };
  transition: { duration: number; delay: number; ease: readonly number[] };
} {
  return {
    initial: { opacity: 0, y: 28, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.7, delay, ease },
  };
}

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function FooterPage() {
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const pageName = slugToName(slug);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cyber-darker">
      <div className="absolute inset-0 animate-grid-move bg-grid-pattern opacity-[0.07]" />
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green/[0.05] blur-3xl" />
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(0,255,65,0.015) 0px, rgba(0,255,65,0.015) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative z-20 mx-auto max-w-xl px-4 text-center">
        <motion.div {...fadeUp(0.1)}>
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-neon-green/30 bg-neon-green/[0.06] shadow-[0_0_30px_rgba(0,255,65,0.15)]">
            <Construction className="h-10 w-10 text-neon-green" />
          </div>
        </motion.div>

        <motion.h1
          {...fadeUp(0.25)}
          className="font-sans text-4xl font-black tracking-tight text-white sm:text-5xl"
        >
          <span
            className="glow-neon text-neon-green"
            style={{
              textShadow:
                "0 0 20px rgba(0,255,65,0.6), 0 0 60px rgba(0,255,65,0.25), 0 0 100px rgba(0,255,65,0.1)",
            }}
          >
            {pageName}
          </span>
        </motion.h1>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-6 font-mono text-sm leading-relaxed text-cyber-text-muted"
        >
          Esta página está em construção. Em breve disponível.
        </motion.p>

        <motion.div {...fadeUp(0.55)} className="mt-10">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-neon-green/[0.06] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-neon-green transition-all duration-500 hover:bg-neon-green/10 hover:shadow-[0_0_20px_rgba(0,255,65,0.25)]"
            style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Voltar para o Início
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
