"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import GameGrid from "@/components/game/GameGrid";
import SearchBar from "@/components/ui/SearchBar";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import type { Game } from "@/types";

const sortOptions: Array<{
  value: "popularity" | "rating" | "newest" | "oldest" | "alphabetical";
  label: string;
}> = [
  { value: "popularity", label: "Mais Populares" },
  { value: "newest", label: "Mais Recentes" },
  { value: "oldest", label: "Mais Antigos" },
  { value: "alphabetical", label: "A-Z" },
];

function mapGame(game: {
  id: string;
  slug: string;
  title: string;
  description: string;
  updatedAt?: string;
  playCount: number;
  createdAt: string;
}): Game {
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
    iframeUrl: `/play/${game.slug}`,
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: false,
    isPopular: game.playCount > 0,
    createdAt: game.createdAt,
    updatedAt: game.updatedAt || game.createdAt,
  };
}

export default function CategoryPage() {
  const { slug } = useParams();
  const resolvedSlug = slug as string;

  const { games, loading } = useUploadedGames();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "popularity" | "rating" | "newest" | "oldest" | "alphabetical"
  >("popularity");

  const categories = useMemo(
    () => [
      {
        id: "all",
        slug: "all",
        name: "Todos os Jogos",
        description: `${games.length} jogos disponíveis`,
        icon: "🎮",
        gameCount: games.length,
      },
      {
        id: "recent",
        slug: "recent",
        name: "Recém Adicionados",
        description: "Jogos adicionados recentemente",
        icon: "🆕",
        gameCount: games.filter(
          (g) =>
            new Date(g.createdAt).getTime() >
            Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).length,
      },
      {
        id: "popular",
        slug: "popular",
        name: "Mais Jogados",
        description: "Jogos com maior número de jogadas",
        icon: "🔥",
        gameCount: games.filter((g) => g.playCount > 0).length,
      },
    ],
    [games],
  );

  const currentCategory = categories.find((c) => c.slug === resolvedSlug);

  const filteredGames = useMemo(() => {
    let result = [...games];

    // Filter by category logic
    if (resolvedSlug === "recent") {
      result = result.filter(
        (g) =>
          new Date(g.createdAt).getTime() >
          Date.now() - 7 * 24 * 60 * 60 * 1000,
      );
    } else if (resolvedSlug === "popular") {
      result = result.filter((g) => g.playCount > 0);
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query),
      );
    }

    // Sort
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
  }, [resolvedSlug, searchQuery, sortBy, games]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <section className="py-16 bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="mb-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors text-sm mb-4"
            >
              ← Voltar para Categorias
            </Link>
            {currentCategory ? (
              <>
                <h1 className="text-4xl font-bold text-white">
                  {currentCategory.name}
                </h1>
                <p className="text-gray-400 mt-2">
                  {currentCategory.description}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-white capitalize">
                  {resolvedSlug}
                </h1>
                <p className="text-gray-400 mt-2">
                  Jogos na categoria {resolvedSlug}
                </p>
              </>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={setSearchQuery}
              placeholder={`Buscar em ${currentCategory?.name || resolvedSlug}...`}
              className="flex-1"
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

          <div className="flex items-center gap-3 text-sm text-gray-500 mt-6">
            <span>{filteredGames.length} resultado(s)</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredGames.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <GameGrid games={filteredGames} />
            </motion.div>
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
              {games.length === 0 ? (
                <>
                  <p className="text-gray-400 text-lg font-medium mb-2">
                    Nenhum jogo disponível
                  </p>
                  <p className="text-gray-600 text-sm">
                    Faça upload de jogos na página de admin
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-400 text-lg font-medium mb-2">
                    {searchQuery
                      ? `Nenhum resultado para "${searchQuery}"`
                      : "Nenhum jogo nesta categoria"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {searchQuery
                      ? "Tente outros termos de busca"
                      : "Tente ver outras categorias"}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
