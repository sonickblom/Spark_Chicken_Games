"use client";

import { useMemo, useState } from "react";
import GameGrid from "@/components/game/GameGrid";
import SearchBar from "@/components/ui/SearchBar";
import CategoryPill from "@/components/ui/CategoryPill";
import { mockCategories, mockGames } from "@/lib/mock-data";
import type { GameFilters } from "@/types";

const sortOptions: Array<{
  value: NonNullable<GameFilters["sortBy"]>;
  label: string;
}> = [
  { value: "popularity", label: "Mais Populares" },
  { value: "rating", label: "Melhor Avaliados" },
  { value: "newest", label: "Mais Recentes" },
  { value: "oldest", label: "Mais Antigos" },
  { value: "alphabetical", label: "A-Z" },
];

export function GamesClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] =
    useState<NonNullable<GameFilters["sortBy"]>>("popularity");

  const filteredGames = useMemo(() => {
    let result = [...mockGames];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.shortDescription.toLowerCase().includes(query) ||
          (game.genre ?? []).some((genre) =>
            genre.toLowerCase().includes(query),
          ) ||
          (game.tags ?? []).some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((game) =>
        (game.genre ?? []).some(
          (genre) => genre.toLowerCase() === selectedCategory.toLowerCase(),
        ),
      );
    }

    switch (sortBy) {
      case "popularity":
      case "popular":
        result.sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.releaseDate ?? b.createdAt).getTime() -
            new Date(a.releaseDate ?? a.createdAt).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.releaseDate ?? a.createdAt).getTime() -
            new Date(b.releaseDate ?? b.createdAt).getTime(),
        );
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

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
                Explore nossa biblioteca completa de jogos
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
                  setSortBy(event.target.value as NonNullable<GameFilters["sortBy"]>)
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

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar por categoria"
          >
            <CategoryPill
              category={{
                id: "all",
                slug: "all",
                name: "Todos",
                description: "",
                icon: "",
                gameCount: mockGames.length,
              }}
              isActive={selectedCategory === "all"}
              onClick={() => setSelectedCategory("all")}
            />
            {mockCategories.map((category) => (
              <CategoryPill
                key={category.id}
                category={category}
                isActive={selectedCategory === category.slug}
                onClick={() => setSelectedCategory(category.slug)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              {filteredGames.length}{" "}
              {filteredGames.length === 1
                ? "jogo encontrado"
                : "jogos encontrados"}
            </p>
          </div>
          <GameGrid
            games={filteredGames}
            emptyMessage="Nenhum jogo encontrado com os filtros atuais"
          />
        </div>
      </section>
    </div>
  );
}
