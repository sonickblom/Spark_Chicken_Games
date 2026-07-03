import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { Game } from "@/types";

interface GameCardProps {
  game: Game;
  priority?: boolean;
}

const GameCard = ({ game, priority = false }: GameCardProps) => {
  return (
    <Link
      href={`/game/${game.slug}`}
      className="group block bg-gray-800 rounded-xl overflow-hidden
           hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all duration-500
           border border-gray-700 hover:border-neon-green/50"
      aria-label={`Jogar ${game.title}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            "group-hover:scale-105",
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {game.isNew && (
          <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-neon-green text-black rounded">
            NOVO
          </span>
        )}
        {game.isFeatured && (
          <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-yellow-500 text-black rounded">
            DESTAQUE
          </span>
        )}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className={cn(
              "w-full py-2 px-4 rounded-lg font-semibold text-sm",
              "bg-neon-green text-black hover:bg-neon-green/80",
              "transition-colors duration-200",
            )}
            onClick={(e) => e.preventDefault()}
          >
            Jogar Agora
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white truncate group-hover:text-neon-green transition-colors">
          {game.title}
        </h3>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {formatNumber(game.rating * 10)}
          </span>
          <span className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {formatNumber(game.playCount)}
          </span>
        </div>
      </div>
    </Link>
  );
};

GameCard.displayName = "GameCard";

export default GameCard;
