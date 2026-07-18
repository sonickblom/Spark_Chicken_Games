"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

import { GameGrid } from "@/components/GameGrid";
import { useSearchUploadedGames } from "@/hooks/use-search-uploaded-games";
import { mapUploadedGameToGame } from "@/lib/map-game";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cyber-dark" />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [localQuery, setLocalQuery] = useState(query);
  const [sortMode, setSortMode] = useState<"popular" | "recent" | "none">(localQuery.trim() ? "none" : "popular");

  const { results, loading, allGames } = useSearchUploadedGames(localQuery);

  useEffect(() => {
    setLocalQuery(query);
    if (!query.trim()) setSortMode("popular");
  }, [query]);

  const games = useMemo(() => {
    if (localQuery.trim()) {
      return results.map(mapUploadedGameToGame);
    }
    const sorted = [...allGames];
    if (sortMode === "popular") {
      sorted.sort((a, b) => b.playCount - a.playCount);
    } else if (sortMode === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted.slice(0, 20).map(mapUploadedGameToGame);
  }, [localQuery, results, allGames, sortMode]);

  return (
    <div className="min-h-screen bg-cyber-dark">
      <main className="pt-24 lg:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-mono text-neon-green mb-4">
              {localQuery
                ? `Resultados para: "${localQuery}"`
                : "Explorar Jogos"}
            </h1>
            <p className="text-cyber-text-muted">
              {localQuery
                ? loading
                  ? "Buscando..."
                  : `${games.length} ${games.length === 1 ? "jogo encontrado" : "jogos encontrados"}`
                : `${games.length} jogos disponíveis`}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block space-y-6">
              <div className="sticky top-24 p-6 bg-cyber-dark-card border border-cyber-dark-border rounded-xl">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-neon-green" />
                  Filtros
                </h2>
                <div className="space-y-1">
                  <button
                    onClick={() => { setLocalQuery(""); setSortMode("popular"); }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      sortMode === "popular" && !localQuery
                        ? "text-neon-green bg-neon-green/[0.06]"
                        : "text-cyber-text-muted hover:text-neon-green hover:bg-neon-green/[0.04]"
                    }`}
                  >
                    🔥 Mais Populares
                  </button>
                  <button
                    onClick={() => { setLocalQuery(""); setSortMode("recent"); }}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                      sortMode === "recent" && !localQuery
                        ? "text-neon-green bg-neon-green/[0.06]"
                        : "text-cyber-text-muted hover:text-neon-green hover:bg-neon-green/[0.04]"
                    }`}
                  >
                    🆕 Mais Recentes
                  </button>
                </div>
              </div>
            </aside>
            <div className="lg:col-span-3">
              <GameGrid
                games={games}
                isLoading={loading}
                skeletonCount={8}
                emptyMessage={
                  localQuery
                    ? "Nenhum jogo encontrado para esta busca. Tente outros termos."
                    : "Nenhum jogo disponível no momento."
                }
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
