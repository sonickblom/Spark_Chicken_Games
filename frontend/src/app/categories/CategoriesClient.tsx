"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import { formatNumber } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export function CategoriesClient() {
  const { games, loading } = useUploadedGames();

  // Derive a single "category" from uploaded games
  const categories =
    games.length > 0
      ? [
          {
            id: "all",
            slug: "all",
            name: "Todos os Jogos",
            description: `${games.length} jogos HTML disponíveis para jogar instantaneamente`,
            icon: "🎮",
            gameCount: games.length,
            isFeatured: true,
          },
          {
            id: "recent",
            slug: "recent",
            name: "Recém Adicionados",
            description: "Jogos adicionados recentemente à plataforma",
            icon: "🆕",
            gameCount: games.filter(
              (g) =>
                new Date(g.createdAt).getTime() >
                Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).length,
            isFeatured: false,
          },
          {
            id: "popular",
            slug: "popular",
            name: "Mais Jogados",
            description: "Jogos com maior número de jogadas",
            icon: "🔥",
            gameCount: games.filter((g) => g.playCount > 0).length,
            isFeatured: false,
          },
        ]
      : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyber-text-muted">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-darker">
      <section className="relative py-16 lg:py-24">
        <div
          className="absolute inset-0 bg-grid-pattern opacity-20"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Categorias
            </h1>
            <p className="text-lg text-cyber-text-muted max-w-2xl mx-auto">
              {games.length > 0
                ? `Explore nossos ${games.length} jogos disponíveis na plataforma`
                : "Explore nossa biblioteca de jogos organizada por categorias"}
            </p>
          </motion.div>

          {categories.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {categories.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link
                    href={
                      category.slug === "all"
                        ? "/games"
                        : `/games?sort=${category.slug}`
                    }
                    className="group block p-6 bg-cyber-dark-surface border border-cyber-dark-border rounded-xl hover:border-neon-green/50 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)] transition-all duration-500"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl" aria-hidden="true">
                        {category.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white group-hover:text-neon-green transition-colors mb-1">
                          {category.name}
                        </h2>
                        <p className="text-sm text-cyber-text-muted line-clamp-2 mb-3">
                          {category.description}
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-neon-green font-medium">
                            {formatNumber(category.gameCount)} jogos
                          </span>
                          {category.isFeatured && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/30 rounded-full">
                              Destaque
                            </span>
                          )}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-cyber-text-muted/50 group-hover:text-neon-green transition-colors flex-shrink-0 mt-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-cyber-text-muted text-lg mb-2">
                Nenhum jogo disponível
              </p>
              <p className="text-cyber-text-muted/70 text-sm">
                Faça upload de jogos na página de admin para vê-los aqui
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
