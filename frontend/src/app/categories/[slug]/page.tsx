"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GameGrid } from "@/components/GameGrid";
import SearchBar from "@/components/ui/SearchBar";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import { mapUploadedGameToGame } from "@/lib/map-game";

const sortOptions: Array<{
  value: "popularity" | "rating" | "newest" | "oldest" | "alphabetical";
  label: string;
}> = [
  { value: "popularity", label: "Mais Populares" },
  { value: "newest", label: "Mais Recentes" },
  { value: "oldest", label: "Mais Antigos" },
  { value: "alphabetical", label: "A-Z" },
];

const categoryIcons: Record<string, string> = {
  "Ação": "🎯",
  "Aventura": "🗺️",
  "Arcade": "🕹️",
  "Corrida": "🏎️",
  "Estratégia": "🧠",
  "Esporte": "⚽",
  "Plataforma": "🏗️",
  "Puzzle": "🧩",
  "RPG": "⚔️",
  "Simulação": "🌍",
};

const categoryNameMap: Record<string, string> = {
  "acao": "Ação",
  "aventura": "Aventura",
  "arcade": "Arcade",
  "corrida": "Corrida",
  "estrategia": "Estratégia",
  "esporte": "Esporte",
  "plataforma": "Plataforma",
  "puzzle": "Puzzle",
  "rpg": "RPG",
  "simulacao": "Simulação",
  "sem-categoria": "Sem Categoria",
};

export default function CategoryPage() {
  const { slug } = useParams();
  const resolvedSlug = slug as string;

  const { games, loading } = useUploadedGames();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "popularity" | "rating" | "newest" | "oldest" | "alphabetical"
  >("popularity");

  const categoryName = categoryNameMap[resolvedSlug] || resolvedSlug.replace(/-/g, " ");
  const icon = categoryIcons[categoryName] || "🎮";

  const filteredGames = useMemo(() => {
    let result = [...games];

    result = result.filter(
      (g) => (g.category || "Sem Categoria").toLowerCase() === categoryName.toLowerCase(),
    );

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

    return result.map(mapUploadedGameToGame);
  }, [searchQuery, sortBy, games, categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <section className="py-16 bg-cyber-dark border-b border-cyber-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-cyber-text-muted hover:text-neon-green transition-colors text-sm mb-4"
            >
              ← Voltar para Categorias
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-4xl">{icon}</span>
              <div>
                <h1 className="text-4xl font-bold text-white capitalize">
                  {categoryName}
                </h1>
                <p className="text-cyber-text-muted mt-2">
                  {filteredGames.length} {filteredGames.length === 1 ? "jogo" : "jogos"} nesta categoria
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={setSearchQuery}
              placeholder={`Buscar em ${categoryName}...`}
              className="flex-1"
            />
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value as typeof sortBy)
              }
              className="px-4 py-2.5 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green"
              aria-label="Ordenar por"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-sm text-cyber-text-muted mt-6">
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
                className="w-16 h-16 mx-auto text-cyber-text-muted/40 mb-4"
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
                  <p className="text-cyber-text-muted text-lg font-medium mb-2">
                    Nenhum jogo disponível
                  </p>
                  <p className="text-cyber-text-muted/70 text-sm">
                    Faça upload de jogos na página de admin
                  </p>
                </>
              ) : (
                <>
                  <p className="text-cyber-text-muted text-lg font-medium mb-2">
                    {searchQuery
                      ? `Nenhum resultado para "${searchQuery}"`
                      : "Nenhum jogo nesta categoria"}
                  </p>
                  <p className="text-cyber-text-muted/70 text-sm">
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
