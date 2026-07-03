import React from "react";
import Image from "next/image";
import { formatPlaytime } from "@/lib/utils";
import { Game } from "@/types";

const GameCard = ({ game, onClick }: { game: Game; onClick?: () => void }) => {
  const playTime = formatPlaytime(game.playCount);

  return (
    <div
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30" />
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
