"use client";

import React from "react";
import Link from "next/link";
import GameGrid from "@/components/game/GameGrid";
import { useUploadedGames } from "@/hooks/use-uploaded-games";

export default function HomePage() {
  const { games, loading } = useUploadedGames();

  const sortedByDate = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const sortedByPlays = [...games].sort((a, b) => b.playCount - a.playCount);

  const mapGame = (game: (typeof games)[0]) => ({
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
      gameCount: games.length,
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
  });

  const featuredGames = games.map(mapGame);
  const newGamesList = sortedByDate.slice(0, 6).map(mapGame);
  const popularGamesList = sortedByPlays.slice(0, 6).map(mapGame);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section - KEEP AS IS */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-green/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
            </span>
            Acesso Instantâneo • Sem Downloads • Offline Ready
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Latency<span className="text-neon-green"> Zero</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            A plataforma de jogos web de alta performance. Jogue
            instantaneamente no navegador, com suporte robusto para execução
            offline e sincronização de progresso.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/games"
              className="px-8 py-4 text-lg font-bold bg-neon-green text-black rounded-lg hover:bg-neon-green/80 transition-colors w-full sm:w-auto"
            >
              Explorar Jogos
            </Link>
            <Link
              href="/categories"
              className="px-8 py-4 text-lg font-medium bg-gray-800 text-white border border-gray-700 rounded-lg hover:border-neon-green/50 hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Ver Categorias
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-neon-green"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Zero Instalação</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-neon-green"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Offline First</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-neon-green"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Cross-Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-neon-green"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Gratuito</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-20 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {games.length > 0 ? "Jogos Disponíveis" : "Em Destaque"}
              </h2>
              <p className="text-gray-400 mt-1">
                {games.length > 0
                  ? `${games.length} jogo(s) publicado(s) na plataforma`
                  : "Nossos jogos mais recomendados"}
              </p>
            </div>
            {games.length > 0 && (
              <Link
                href="/games"
                className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
              >
                Ver todos →
              </Link>
            )}
          </div>
          {featuredGames.length > 0 ? (
            <GameGrid games={featuredGames} />
          ) : (
            <div className="text-center py-16 bg-gray-900/30 rounded-xl border border-gray-800">
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-gray-400 text-lg mb-2">
                Nenhum jogo publicado ainda
              </p>
              <p className="text-gray-600 text-sm">
                Faça upload do primeiro jogo na página de admin
              </p>
            </div>
          )}
        </div>
      </section>

      {/* New Games Section */}
      {newGamesList.length > 0 && (
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Recém Adicionados
                </h2>
                <p className="text-gray-400 mt-1">
                  Lançamentos recentes na plataforma
                </p>
              </div>
              <Link
                href="/games?sort=newest"
                className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <GameGrid games={newGamesList} />
          </div>
        </section>
      )}

      {/* Popular Games Section */}
      {popularGamesList.length > 0 && (
        <section className="py-20 bg-gray-950 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white">Mais Jogados</h2>
                <p className="text-gray-400 mt-1">
                  Jogos mais jogados pela comunidade
                </p>
              </div>
              <Link
                href="/games?sort=popular"
                className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
              >
                Ver todos →
              </Link>
            </div>
            <GameGrid games={popularGamesList} />
          </div>
        </section>
      )}

      {/* CTA Section - KEEP AS IS */}
      <section className="py-20 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Jogar?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhões de jogadores e descubra sua próxima aventura
            favorita. Sem downloads, sem espera, apenas diversão instantânea.
          </p>
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold bg-neon-green text-black rounded-lg hover:bg-neon-green/80 transition-colors"
          >
            Começar Agora
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
