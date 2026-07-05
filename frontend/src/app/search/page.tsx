"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameGrid } from "@/components/GameGrid";
import { useSearchGames } from "@/hooks/use-data";

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
  const { data: games, loading, search } = useSearchGames(query, 20);

  useEffect(() => {
    search();
  }, [query, search]);

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />
      <main className="pt-24 lg:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-mono text-cyber-neon mb-4">
              {query ? `Resultados para: "${query}"` : "Buscar Jogos"}
            </h1>
            <p className="text-cyber-text-muted">
              {loading
                ? "Buscando..."
                : `${games.length} ${games.length === 1 ? "jogo encontrado" : "jogos encontrados"}`}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="hidden lg:block space-y-6">
              <div className="sticky top-24 p-6 bg-cyber-dark-card border border-cyber-dark-border rounded-xl">
                <h2 className="text-lg font-bold text-cyber-text mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-cyber-neon" />
                  Filtros
                </h2>
                <p className="text-sm text-cyber-text-muted mb-4">
                  Os filtros laterais serão implementados aqui na próxima fase
                  para refinar a busca por categoria, preço e plataforma.
                </p>
              </div>
            </aside>
            <div className="lg:col-span-3">
              <GameGrid
                games={games}
                isLoading={loading}
                skeletonCount={8}
                emptyMessage={
                  query
                    ? "Nenhum jogo encontrado para esta busca."
                    : "Digite algo na barra de busca para encontrar jogos."
                }
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
