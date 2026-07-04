"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Star, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
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

  if (variant === "compact") {
    return (
      <Link
        href={`/game/${game.slug}`}
        className="group flex gap-4 p-2 bg-cyber-dark-card/50 rounded-lg hover:bg-cyber-dark-card transition-all duration-300"
      >
        <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={game.coverImage}
            alt={game.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="96px"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-cyber-dark text-xs font-bold px-1.5 py-0.5 rounded">
              -{game.discount}%
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-cyber-text group-hover:text-cyber-neon transition-colors truncate">
              {game.title}
            </h3>
            <p className="text-xs text-cyber-text-muted mt-1 truncate">
              {game.shortDescription}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-3 h-3 text-yellow-400" aria-hidden="true" />
              <span className="text-sm text-cyber-text">
                {game.rating.toFixed(1)}
              </span>
              <span className="text-xs text-cyber-text-muted">
                ({formatNumber(game.reviewCount)})
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              {game.originalPrice && game.originalPrice > (game.price ?? 0) ? (
                <span className="text-xs text-cyber-text-muted line-through">
                  {formatPrice(game.originalPrice)}
                </span>
              ) : null}
              <span className="font-semibold text-cyber-neon">
                {game.isFree ? "Gratuito" : formatPrice(game.price ?? 0)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative group"
      >
        <Link
          href={`/game/${game.slug}`}
          className="block relative rounded-2xl overflow-hidden aspect-[16/9]"
        >
          <Image
            src={game.bannerImage || game.coverImage}
            alt={game.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark/90 via-cyber-dark/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-cyber-dark-surface/80 backdrop-blur text-xs text-cyber-neon border border-cyber-neon/30 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-cyber-text mb-2 group-hover:text-cyber-neon transition-colors">
              {game.title}
            </h3>
            <p className="text-cyber-text-muted text-sm lg:text-base mb-4 line-clamp-2 max-w-md">
              {game.shortDescription}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
                <span className="font-medium text-cyber-text">
                  {game.rating.toFixed(1)}
                </span>
                <span className="text-cyber-text-muted text-sm">
                  ({formatNumber(game.reviewCount ?? 0)})
                </span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                {game.originalPrice && game.originalPrice > (game.price ?? 0) ? (
                  <span className="text-sm text-cyber-text-muted line-through">
                    {formatPrice(game.originalPrice)}
                  </span>
                ) : null}
                <span className="text-xl font-bold text-cyber-neon">
                  {game.isFree ? "Gratuito" : formatPrice(game.price ?? 0)}
                </span>
              </div>
            </div>
          </div>
        </Link>
        {hasDiscount && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-red-500 text-cyber-dark text-sm font-bold px-3 py-1 rounded-full animate-pulse-neon">
              -{game.discount}%
            </span>
          </div>
        )}
        {game.isNewRelease && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-cyber-neon text-cyber-dark text-sm font-bold px-3 py-1 rounded-full">
              Novo
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(game.id);
          }}
          className="absolute top-4 right-4 z-10 p-2 bg-cyber-dark/80 backdrop-blur rounded-full hover:bg-cyber-dark-surface transition-colors"
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={isFavorite}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-cyber-text-muted",
            )}
            aria-hidden="true"
          />
        </button>
      </motion.div>
    );
  }

  return (
    <Card
      hover
      variant="default"
      padding="none"
      className="overflow-hidden flex flex-col h-full"
    >
      <Link
        href={`/game/${game.slug}`}
        className="block relative aspect-[3/4] overflow-hidden"
      >
        <Image
          src={game.coverImage}
          alt={game.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
        />
        <AnimatePresence mode="popLayout">
          {hasDiscount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-3 left-3 z-10"
            >
              <span className="bg-red-500 text-cyber-dark text-sm font-bold px-2 py-1 rounded">
                -{game.discount}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {game.isNewRelease && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-3 right-3 z-10"
            >
              <span className="bg-cyber-neon text-cyber-dark text-xs font-bold px-2 py-1 rounded">
                Novo
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="popLayout">
          {game.isFree && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-3 left-3 z-10"
            >
              <span className="bg-green-500 text-cyber-dark text-xs font-bold px-2 py-1 rounded">
                Gratuito
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(game.id);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-cyber-dark/80 backdrop-blur rounded-full hover:bg-cyber-dark-surface transition-colors"
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={isFavorite}
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-300",
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-cyber-text-muted",
            )}
            aria-hidden="true"
          />
        </button>
      </Link>

      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {genres.map((genre) => (
            <span
              key={genre}
              className="px-2 py-0.5 bg-cyber-dark-surface text-xs text-cyber-neon border border-cyber-neon/30 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>

        <h3 className="font-bold text-cyber-text mb-1 line-clamp-1 group-hover:text-cyber-neon transition-colors">
          {game.title}
        </h3>
        <p className="text-cyber-text-muted text-sm line-clamp-2 flex-1 mb-3">
          {truncate(game.shortDescription, 100)}
        </p>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" aria-hidden="true" />
            <span className="font-medium text-cyber-text">
              {game.rating.toFixed(1)}
            </span>
            <span className="text-cyber-text-muted text-xs">
              ({formatNumber(game.reviewCount ?? 0)})
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto text-cyber-text-muted text-xs">
            <Calendar className="w-3 h-3" aria-hidden="true" />
            <span>{game.releaseDate ? new Date(game.releaseDate).getFullYear() : '—'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {platforms.map((platform) => (
            <span
              key={platform}
              className="px-1.5 py-0.5 bg-cyber-dark-surface text-xs text-cyber-text-muted border border-cyber-dark-border rounded"
            >
              {platform}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {game.originalPrice && game.originalPrice > (game.price ?? 0) ? (
            <span className="text-sm text-cyber-text-muted line-through">
              {formatPrice(game.originalPrice)}
            </span>
          ) : null}
          <span className="font-bold text-lg text-cyber-neon">
            {game.isFree ? "Gratuito" : formatPrice(game.price ?? 0)}
          </span>
        </div>
        <Button variant="outline" size="sm">
          <Link href={`/game/${game.slug}`}>Ver Detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

