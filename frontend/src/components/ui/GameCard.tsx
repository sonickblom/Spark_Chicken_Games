import React from "react";
import Image from "next/image";
import { formatPlaytime } from "@/lib/utils";
import { Game } from "@/types";

const GameCard = ({ game, onClick }: { game: Game; onClick?: () => void }) => {
  const playTime = formatPlaytime(game.playCount || 0);

  return (
    <div
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative w-full h-48 overflow-hidden bg-cyber-dark-surface">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cyber-text-muted text-sm">
            Sem imagem
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-cyber-green text-cyber-dark text-center">
            {game.rating}
          </div>
          <div className="ml-2 text-sm">{game.title}</div>
        </div>
        <div className="text-sm text-gray-300">{playTime}</div>
      </div>
    </div>
  );
};

GameCard.displayName = "GameCard";

export default GameCard;
