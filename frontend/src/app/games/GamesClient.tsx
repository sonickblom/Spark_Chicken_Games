"use client";

import { useMemo, useState } from "react";
import GameGrid from "@/components/game/GameGrid";
import SearchBar from "@/components/ui/SearchBar";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import type { UploadedGameData } from "@/hooks/use-uploaded-games";

const sortOptions: Array<{
  value: "popularity" | "rating" | "newest" | "oldest" | "alphabetical";
  label: string;
}> = [
  { value: "popularity", label: "Mais Populares" },
  { value: "newest", label: "Mais Recentes" },
  { value: "oldest", label: "Mais Antigos" },
  { value: "alphabetical", label: "A-Z" },
];

function mapGame(game: UploadedGameData) {
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
    iframeUrl: game.embedUrl || game.url,
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: false,
    isPopular: game.playCount > 0,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt,
  };
}

export function GamesClient() {
  const { games, loading } = useUploadedGames();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "popularity" | "rating" | "newest" | "oldest" | "alphabetical"
  >("popularity");

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query),
      );
    }

    switch (sortBy) {
      case "popularity":
        result.sort((a, b) => b.playCount - a.playCount);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        );
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result.map(mapGame);
  }, [searchQuery, sortBy, games]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando jogos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <section className="py-16 bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Catálogo de Jogos
              </h1>
              <p className="text-gray-400 mt-2">
                {games.length > 0
                  ? `${games.length} jogo(s) disponíveis`
                  : "Explore nossa biblioteca completa de jogos"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={setSearchQuery}
                placeholder="Buscar jogos..."
                className="flex-1 lg:w-80"
              />
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as typeof sortBy)
                }
                className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
                aria-label="Ordenar por"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <span>{filteredGames.length} resultado(s)</span>
          </div>

          {filteredGames.length > 0 ? (
            <GameGrid games={filteredGames} />
          ) : (
            <div className="text-center py-20">
              <svg
                className="w-16 h-16 mx-auto text-gray-700 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-gray-400 text-lg font-medium mb-2">
                {searchQuery
                  ? `Nenhum resultado para "${searchQuery}"`
                  : "Nenhum jogo disponível"}
              </p>
              <p className="text-gray-600 text-sm">
                {searchQuery
                  ? "Tente outros termos de busca"
                  : "Faça upload de jogos na página de admin"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
