"use client";

import { GameCard, GameCardProps } from "./GameCard";
import { SkeletonCard } from "./SkeletonCard";
import { cn } from "@/lib/utils";
import type { Game } from "@/types";

interface GameGridProps {
  games: Game[];
  variant?: GameCardProps["variant"];
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
  className?: string;
}

export function GameGrid({
  games,
  variant = "default",
  isLoading = false,
  skeletonCount = 8,
  emptyMessage = "Nenhum jogo encontrado",
  className,
}: GameGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid gap-6",
          variant === "compact"
            ? "grid-cols-1"
            : variant === "featured"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
          className
        )}
        role="list"
        aria-label="Carregando jogos"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <SkeletonCard key={i} variant={variant} />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className={cn("text-center py-16", className)}>
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyber-dark-card border border-cyber-dark-border mb-4">
          <svg className="w-8 h-8 text-cyber-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-cyber-text mb-2">{emptyMessage}</h3>
        <p className="text-cyber-text-muted">
          Tente ajustar seus filtros ou buscar por outro termo.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        variant === "compact"
          ? "grid-cols-1"
          : variant === "featured"
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
        className
      )}
      role="list"
      aria-label="Lista de jogos"
    >
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          variant={variant}
          priority={variant === "featured" && index < 2}
        />
      ))}
    </div>
  );
}
