import type { Game } from "@/types";
import type { UploadedGameData } from "@/hooks/use-uploaded-games";

export function mapUploadedGameToGame(game: UploadedGameData): Game {
  return {
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
      gameCount: 0,
    },
    tags: ["HTML", "Web"],
    rating: 0,
    playCount: game.playCount,
    releaseDate: game.createdAt,
    developer: "Spark Chicken Games",
    publisher: "Spark Chicken Games",
    iframeUrl: game.embedUrl || game.url || `/play/${game.slug}`,
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: false,
    isPopular: game.playCount > 0,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  };
}
