"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Calendar } from "lucide-react";
import { cn, formatNumber, formatPrice, truncate } from "@/lib/utils";
import type { Game } from "@/types";

export interface GameCardProps {
  game: Game;
  variant?: "default" | "compact" | "featured";
  isFavorite?: boolean;
  onToggleFavorite?: (gameId: string) => void;
  priority?: boolean;
}

export function GameCard({
  game,
  variant = "default",
  isFavorite = false,
  onToggleFavorite,
  priority = false,
}: GameCardProps) {
  const genres = (game.genre ?? []).slice(0, 3);
  const platforms = (game.platforms ?? []).slice(0, 4);
  const hasDiscount = game.discount && game.discount > 0;

  // ─── Compact variant ──────────────────────────────────────────
  if (variant === "compact") {
    return (
      <Link
        href={`/game/${game.slug}`}
        className="group flex gap-4 p-[1px] bg-white/[0.02] ring-1 ring-white/[0.06] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-neon-green/30 hover:shadow-[0_0_24px_rgba(0,255,65,0.08)]"
      >
        <div className="flex-1 min-w-0 flex gap-4 bg-cyber-dark-surface rounded-[calc(1rem-1px)] p-3">
          <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-cyber-dark-surface">
            {game.coverImage ? (
              <Image
                src={game.coverImage}
                alt={game.title}
                fill
                className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-105"
                sizes="80px"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-cyber-text-muted text-[10px] font-mono">
                Sem imagem
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-1.5 left-1.5 bg-neon-green text-black text-[10px] font-bold font-sans px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(0,255,65,0.4)]">
                -{game.discount}%
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-sans font-bold text-white text-sm truncate group-hover:text-neon-green transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                {game.title}
              </h3>
              <p className="font-mono text-[11px] text-cyber-text-muted truncate">
                {game.shortDescription}
              </p>
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                <span className="font-mono text-xs text-white">
                  {game.rating.toFixed(1)}
                </span>
                <span className="font-mono text-[10px] text-cyber-text-muted">
                  ({formatNumber(game.reviewCount ?? 0)})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {game.originalPrice && game.originalPrice > (game.price ?? 0) ? (
                  <span className="font-mono text-[11px] text-cyber-text-muted line-through">
                    {formatPrice(game.originalPrice)}
                  </span>
                ) : null}
                <span className="font-sans font-bold text-sm text-neon-green">
                  {game.isFree ? "Gratuito" : formatPrice(game.price ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ─── Featured variant ─────────────────────────────────────────
  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
        className="relative group"
      >
        <Link
          href={`/game/${game.slug}`}
          className="block relative rounded-2xl overflow-hidden aspect-[16/9] bg-white/[0.02] ring-1 ring-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-neon-green/30 hover:shadow-[0_0_40px_rgba(0,255,65,0.12)]"
        >
          {game.bannerImage || game.coverImage ? (
            <Image
              src={game.bannerImage || game.coverImage}
              alt={game.title}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyber-text-muted font-mono text-sm bg-cyber-dark-surface">
              Sem imagem
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                >
                  {genre}
                </span>
              ))}
            </div>

            <h3 className="font-sans font-bold text-2xl lg:text-3xl text-white mb-2 group-hover:text-neon-green transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
              {game.title}
            </h3>

            <p className="font-mono text-xs text-cyber-text-muted mb-4 line-clamp-2 max-w-md">
              {game.shortDescription}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" aria-hidden="true" />
                <span className="font-mono text-sm text-white">
                  {game.rating.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-cyber-text-muted">
                  ({formatNumber(game.reviewCount ?? 0)})
                </span>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                {game.originalPrice && game.originalPrice > (game.price ?? 0) ? (
                  <span className="font-mono text-sm text-cyber-text-muted line-through">
                    {formatPrice(game.originalPrice)}
                  </span>
                ) : null}
                <span className="font-sans font-bold text-xl text-neon-green">
                  {game.isFree ? "Gratuito" : formatPrice(game.price ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </Link>

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-4 right-16 z-10">
            <span className="bg-red-500 text-white text-xs font-bold font-sans px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              -{game.discount}%
            </span>
          </div>
        )}

        {/* New release badge */}
        {game.isNewRelease && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-neon-green text-black text-xs font-bold font-sans px-2.5 py-1 rounded-full shadow-[0_0_12px_rgba(0,255,65,0.4)]">
              Novo
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(game.id);
          }}
          className={cn(
            "absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full",
            "bg-black/60 backdrop-blur-sm border border-white/10",
            "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isFavorite
              ? "shadow-[0_0_12px_rgba(0,255,65,0.3)] border-neon-green/40"
              : "hover:border-white/20",
          )}
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={isFavorite}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isFavorite
                ? "fill-neon-green text-neon-green"
                : "text-cyber-text-muted",
            )}
            aria-hidden="true"
          />
        </button>
      </motion.div>
    );
  }

  // ─── Default variant ──────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      className="bg-white/[0.02] ring-1 ring-white/[0.06] p-[1px] rounded-[1.25rem] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:ring-neon-green/25 hover:shadow-[0_0_30px_rgba(0,255,65,0.08)] flex flex-col h-full"
    >
      <div className="bg-cyber-dark-surface rounded-[calc(1.25rem-1px)] overflow-hidden flex flex-col h-full">
        {/* Cover image */}
        <Link
          href={`/game/${game.slug}`}
          className="block relative aspect-[3/4] overflow-hidden group/img"
        >
          {game.coverImage ? (
            <Image
              src={game.coverImage}
              alt={game.title}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/img:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cyber-text-muted font-mono text-xs bg-cyber-dark-surface">
              Sem imagem
            </div>
          )}

          {/* Discount badge */}
          <AnimatePresence mode="popLayout">
            {hasDiscount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute top-3 left-3 z-10"
              >
                <span className="bg-red-500 text-white text-[11px] font-bold font-sans px-2 py-1 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  -{game.discount}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New release badge */}
          <AnimatePresence mode="popLayout">
            {game.isNewRelease && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute top-3 right-12 z-10"
              >
                <span className="bg-neon-green text-black text-[10px] font-bold font-sans px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,65,0.4)]">
                  Novo
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Free badge */}
          <AnimatePresence mode="popLayout">
            {game.isFree && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                className="absolute bottom-3 left-3 z-10"
              >
                <span className="bg-neon-green/90 text-black text-[10px] font-bold font-sans px-2 py-1 rounded-full shadow-[0_0_10px_rgba(0,255,65,0.3)]">
                  Gratuito
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite?.(game.id);
            }}
            className={cn(
              "absolute top-3 right-3 z-10 size-9 flex items-center justify-center rounded-full",
              "bg-black/60 backdrop-blur-sm border border-white/10",
              "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
              isFavorite
                ? "shadow-[0_0_12px_rgba(0,255,65,0.3)] border-neon-green/40"
                : "hover:border-white/20",
            )}
            aria-label={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
            aria-pressed={isFavorite}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                isFavorite
                  ? "fill-neon-green text-neon-green"
                  : "text-cyber-text-muted",
              )}
              aria-hidden="true"
            />
          </button>
        </Link>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 gap-3">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-1.5">
            {genres.map((genre) => (
              <span
                key={genre}
                className="bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-sans font-bold text-white text-sm line-clamp-1 group-hover:text-neon-green transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
            {game.title}
          </h3>

          {/* Description */}
          <p className="font-mono text-xs text-cyber-text-muted line-clamp-2 flex-1">
            {truncate(game.shortDescription, 100)}
          </p>

          {/* Rating + Date */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" aria-hidden="true" />
              <span className="font-mono text-xs text-white">
                {game.rating.toFixed(1)}
              </span>
              <span className="font-mono text-[10px] text-cyber-text-muted">
                ({formatNumber(game.reviewCount ?? 0)})
              </span>
            </div>
            <div className="flex items-center gap-1 ml-auto text-cyber-text-muted">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              <span className="font-mono text-[10px]">
                {game.releaseDate
                  ? new Date(game.releaseDate).getFullYear()
                  : "—"}
              </span>
            </div>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="bg-white/[0.04] text-cyber-text-muted border border-white/[0.06] rounded-md px-1.5 py-0.5 font-mono text-[10px]"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.05]">
          <div className="flex items-center gap-2">
            {game.originalPrice && game.originalPrice > (game.price ?? 0) ? (
              <span className="font-mono text-xs text-cyber-text-muted line-through">
                {formatPrice(game.originalPrice)}
              </span>
            ) : null}
            <span className="font-sans font-bold text-base text-neon-green">
              {game.isFree ? "Gratuito" : formatPrice(game.price ?? 0)}
            </span>
          </div>
          <Link
            href={`/game/${game.slug}`}
            className="inline-flex items-center justify-center h-8 px-4 text-xs font-medium tracking-wide rounded-full border border-neon-green/50 bg-transparent text-neon-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-neon-green/[0.06] hover:border-neon-green hover:shadow-[0_0_16px_rgba(0,255,65,0.15)] active:scale-[0.98]"
          >
            Ver Detalhes
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
