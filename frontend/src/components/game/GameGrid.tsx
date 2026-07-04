import React from 'react';
import { Game } from '@/types';
import GameCard from './GameCard';
import Skeleton from '@/components/ui/Skeleton';

import { cn } from "@/lib/utils";

interface GameGridProps {
  games: Game[];
  className?: string;
  isLoading?: boolean;
  skeletonCount?: number;
  emptyMessage?: string;
}

const GameGrid = ({
  games,
  className = '',
  isLoading = false,
  skeletonCount = 12,
  emptyMessage = 'Nenhum jogo encontrado',
}: GameGridProps) => {
  if (isLoading) {
    return (
      <div className={cn('grid gap-6', className)}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" className="aspect-video" />
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg className="mx-auto h-12 w-12 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid gap-6',
        'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
        className
      )}
      role="list"
      aria-label="Lista de jogos"
    >
      {games.map((game, index) => (
        <GameCard key={game.id} game={game} priority={index < 4} />
      ))}
    </div>
  );
};

GameGrid.displayName = 'GameGrid';

export default GameGrid;
