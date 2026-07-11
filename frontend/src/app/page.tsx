"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronRight,
  Zap,
  Monitor,
  Wifi,
  Trophy,
  Gamepad2,
  Upload,
} from "lucide-react";
import GameGrid from "@/components/game/GameGrid";
import { useUploadedGames } from "@/hooks/use-uploaded-games";

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

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

function revealOnScroll(delay = 0) {
  return {
    initial: { opacity: 0, y: 40, filter: "blur(6px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.7, delay, ease },
  };
}

/* ------------------------------------------------------------------ */
/*  Reusable section header                                             */
/* ------------------------------------------------------------------ */

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  linkHref,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  linkHref?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <motion.div {...revealOnScroll()}>
          <span className="inline-block rounded-full border border-neon-green/30 bg-neon-green/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-green">
            {eyebrow}
          </span>
          <h2 className="mt-4 font-sans text-3xl font-bold text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-2 max-w-lg font-mono text-sm text-cyber-text-muted">
            {subtitle}
          </p>
        </motion.div>

      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-neon-green transition-all duration-500 hover:gap-2.5 hover:text-[#33ff66] sm:inline-flex"
          style={{ transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)" }}
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-white/5 bg-[#0a0a12] py-20 text-center">
      <div className="animate-glitch">
        <Upload className="h-14 w-14 text-neon-green/30" />
      </div>
      <p className="font-sans text-lg font-bold text-white">
        Nenhum jogo publicado
      </p>
      <p className="max-w-xs font-mono text-xs text-cyber-text-muted">
        Faça upload do primeiro jogo na página de administração para começar.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const { games, loading } = useUploadedGames();

  const sortedByDate = [...games].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const sortedByPlays = [...games].sort((a, b) => b.playCount - a.playCount);

  const mapGame = (game: (typeof games)[0]) => ({
    id: game.id,
    slug: game.slug,
    title: game.title,
    description: game.description,
    shortDescription: game.description,
    thumbnail: "",
    coverImage: "",
    category: {
      id: "upload",
      slug: "upload",
      name: "Upload",
      description: "",
      icon: "🎮",
      gameCount: games.length,
    },
    tags: ["HTML", "Web"],
    rating: 0,
    playCount: game.playCount,
    releaseDate: game.createdAt,
    developer: "Spark Chicken Games",
    publisher: "Spark Chicken Games",
    iframeUrl: game.embedUrl || game.url,
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: false,
    isPopular: game.playCount > 0,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  });

  const featuredGames = games.map(mapGame);
  const newGamesList = sortedByDate.slice(0, 6).map(mapGame);
  const popularGamesList = sortedByPlays.slice(0, 6).map(mapGame);

  /* ── Loading ────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030305]">
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-2 border-neon-green/20" />
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-neon-green" />
            <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-b-neon-green/40 [animation-direction:reverse] [animation-duration:1.5s]" />
            <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,255,65,0.25)]" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-neon-green/60">
            Inicializando sistema...
          </span>
        </div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────────────── */

  return (
    <div className="relative min-h-screen bg-[#030305]">
      {/* ================================================================ */}
      {/*  HERO                                                           */}
      {/* ================================================================ */}
      <section className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 animate-grid-move bg-grid-pattern opacity-[0.07]" />

        {/* Radial green glow orb */}
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green/[0.06] blur-3xl" />

        {/* Scanline overlay */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,255,65,0.015) 0px, rgba(0,255,65,0.015) 1px, transparent 1px, transparent 3px)",
          }}
        />

        {/* Content */}
        <div className="relative z-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {/* Eyebrow badge */}
            <motion.div {...fadeUp(0.1)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-neon-green/30 bg-neon-green/[0.06] px-4 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-green shadow-[0_0_20px_rgba(0,255,65,0.1)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-green opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-green" />
                </span>
                Acesso Instantâneo · Offline Ready
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              {...fadeUp(0.25)}
              className="mt-10 font-sans text-6xl font-black leading-[0.9] tracking-tight text-white sm:text-8xl lg:text-[10rem]"
            >
              Latency
              <br />
              <span
                className="glow-neon text-neon-green"
                style={{
                  textShadow:
                    "0 0 20px rgba(0,255,65,0.6), 0 0 60px rgba(0,255,65,0.25), 0 0 100px rgba(0,255,65,0.1)",
                }}
              >
                Zero
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.4)}
              className="mt-8 max-w-2xl font-mono text-sm leading-relaxed text-cyber-text-muted sm:text-base"
              style={{ letterSpacing: "0.04em" }}
            >
              Plataforma de jogos web de alta performance. Jogue
              instantaneamente no navegador com suporte offline e
              sincronização de progresso.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.55)}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
            >
              <Link
                href="/games"
                className="btn-cyber flex items-center gap-2 px-8 py-3.5 text-sm font-bold"
              >
                <Zap className="h-4 w-4" />
                Explorar Jogos
              </Link>
              <Link
                href="/categories"
                className="btn-cyber-outline flex items-center gap-2 px-8 py-3.5 text-sm font-bold"
              >
                Ver Categorias
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              {...fadeUp(0.7)}
              className="mt-16 flex flex-wrap items-center justify-center gap-0"
            >
              {[
                { label: "Zero Instalação", icon: Monitor },
                { label: "Offline First", icon: Wifi },
                { label: "Cross-Platform", icon: Gamepad2 },
                { label: "Gratuito", icon: Trophy },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && (
                    <div className="hidden h-8 w-px bg-white/10 sm:block" />
                  )}
                  <div className="flex items-center gap-2.5 px-5 py-2">
                    <stat.icon className="h-4 w-4 text-neon-green/70" />
                    <span className="font-mono text-xs text-cyber-text-muted">
                      {stat.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030305] to-transparent" />
      </section>

      {/* ================================================================ */}
      {/*  FEATURED / ALL GAMES                                           */}
      {/* ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#030305] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <motion.div {...revealOnScroll()}>
              <span className="inline-block rounded-full border border-neon-green/30 bg-neon-green/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-neon-green">
                System
              </span>
              <h2 className="mt-4 font-sans text-3xl font-bold text-white sm:text-4xl">
                {games.length > 0 ? "Jogos Disponíveis" : "Catálogo"}
              </h2>
              <p className="mt-2 max-w-lg font-mono text-sm text-cyber-text-muted">
                {games.length > 0
                  ? `${games.length} jogo(s) publicado(s) na plataforma`
                  : "Nossos jogos mais recomendados"}
              </p>
            </motion.div>

            {games.length > 0 && (
              <Link
                href="/games"
                className="group hidden shrink-0 items-center gap-1.5 text-sm font-medium text-neon-green transition-all duration-500 hover:gap-2.5 hover:text-[#33ff66] sm:inline-flex"
                style={{
                  transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
                }}
              >
                Ver todos
                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          <div className="mt-10">
            {featuredGames.length > 0 ? (
              <motion.div {...revealOnScroll(0.1)}>
                <GameGrid games={featuredGames} />
              </motion.div>
            ) : (
              <motion.div {...revealOnScroll(0.1)}>
                <EmptyState />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================ */}
      {/*  NEW GAMES                                                      */}
      {/* ================================================================ */}
      {newGamesList.length > 0 && (
        <section className="relative border-t border-white/[0.04] bg-[#020204] py-24">
          {/* Subtle gradient divider */}
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Launches"
              title="Recém Adicionados"
              subtitle="Lançamentos recentes na plataforma"
              linkHref="/games?sort=newest"
              linkLabel="Ver todos"
            />
            <div className="mt-10">
              <motion.div {...revealOnScroll(0.1)}>
                <GameGrid games={newGamesList} />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/*  POPULAR GAMES                                                  */}
      {/* ================================================================ */}
      {popularGamesList.length > 0 && (
        <section className="relative border-t border-white/[0.04] bg-[#030305] py-24">
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Trending"
              title="Mais Jogados"
              subtitle="Jogos mais jogados pela comunidade"
              linkHref="/games?sort=popular"
              linkLabel="Ver todos"
            />
            <div className="mt-10">
              <motion.div {...revealOnScroll(0.1)}>
                <GameGrid games={popularGamesList} />
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================ */}
      {/*  CTA                                                            */}
      {/* ================================================================ */}
      <section className="relative border-t border-white/[0.04] bg-[#020204] py-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-green/[0.05] blur-[120px]" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div {...revealOnScroll()}>
            <h2 className="font-sans text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              Pronto para{" "}
              <span className="glow-neon text-neon-green">Jogar</span>?
            </h2>
          </motion.div>

          <motion.p
            {...revealOnScroll(0.1)}
            className="mx-auto mt-6 max-w-xl font-mono text-sm leading-relaxed text-cyber-text-muted"
          >
            Junte-se a milhões de jogadores e descubra sua próxima aventura
            favorita. Sem downloads, sem espera, apenas diversão instantânea.
          </motion.p>

          <motion.div
            {...revealOnScroll(0.2)}
            className="mt-10 flex justify-center"
          >
            <Link
              href="/games"
              className="group inline-flex items-center gap-0 rounded-full bg-neon-green pl-8 pr-2 py-2 font-bold text-black shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,255,65,0.5)] active:scale-95"
              style={{
                transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
              }}
            >
              Começar Agora
              <span className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/15 transition-colors duration-300 group-hover:bg-black/25">
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            {...revealOnScroll(0.3)}
            className="mt-14 flex flex-wrap items-center justify-center gap-8"
          >
            {[
              { value: "0ms", label: "Setup" },
              { value: "100%", label: "Free" },
              { value: "24/7", label: "Online" },
            ].map((stat, i) => (
              <React.Fragment key={stat.label}>
                {i > 0 && (
                  <div className="hidden h-8 w-px bg-white/10 sm:block" />
                )}
                <div className="flex flex-col items-center gap-1 px-4">
                  <span className="font-sans text-xl font-bold text-white">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyber-text-muted">
                    {stat.label}
                  </span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
