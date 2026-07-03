import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import GameGrid from "@/components/game/GameGrid";

export const metadata: Metadata = {
  title: "Latency Zero - Jogos Instantâneos",
  description:
    "Plataforma de jogos web de alta performance com acesso instantâneo e suporte offline.",
  openGraph: {
    title: "Latency Zero - Jogos Instantâneos",
    description:
      "Plataforma de jogos web de alta performance com acesso instantâneo e suporte offline.",
    type: "website",
    locale: "pt_BR",
  },
};

const featuredGames = [
  {
    id: "1",
    slug: "cyber-runner",
    title: "Cyber Runner",
    description: "Corra pelas ruas neon de uma metrópole futurista.",
    shortDescription: "Runner cyberpunk de alta velocidade",
    thumbnail: "https://picsum.photos/seed/cyber-runner/400/225",
    coverImage: "https://picsum.photos/seed/cyber-runner/800/450",
    category: {
      id: "1",
      slug: "action",
      name: "Ação",
      description: "",
      icon: "⚡",
      gameCount: 50,
      color: "red",
    },
    tags: ["Cyberpunk", "Runner", "Single Player"],
    rating: 4.8,
    playCount: 125000,
    releaseDate: "2024-01-15",
    developer: "Neon Studios",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/cyber-runner",
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: false,
    isPopular: true,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    slug: "neon-puzzle",
    title: "Neon Puzzle",
    description: "Resolva puzzles brilhantes em um mundo de luz.",
    shortDescription: "Puzzle relaxante com estética neon",
    thumbnail: "https://picsum.photos/seed/neon-puzzle/400/225",
    coverImage: "https://picsum.photos/seed/neon-puzzle/800/450",
    category: {
      id: "2",
      slug: "puzzle",
      name: "Puzzle",
      description: "",
      icon: "🧩",
      gameCount: 30,
      color: "blue",
    },
    tags: ["Puzzle", "Relaxante", "Cores"],
    rating: 4.6,
    playCount: 89000,
    releaseDate: "2024-02-20",
    developer: "Pixel Labs",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/neon-puzzle",
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: true,
    isPopular: false,
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "3",
    slug: "arcade-classics",
    title: "Arcade Classics",
    description: "Reviva os clássicos dos fliperamas.",
    shortDescription: "Coleção de jogos arcade retrô",
    thumbnail: "https://picsum.photos/seed/arcade-classics/400/225",
    coverImage: "https://picsum.photos/seed/arcade-classics/800/450",
    category: {
      id: "3",
      slug: "arcade",
      name: "Arcade",
      description: "",
      icon: "🎮",
      gameCount: 40,
      color: "yellow",
    },
    tags: ["Retrô", "Arcade", "Multiplayer"],
    rating: 4.9,
    playCount: 210000,
    releaseDate: "2023-12-10",
    developer: "Retro Games Inc",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/arcade-classics",
    width: 800,
    height: 600,
    isFeatured: true,
    isNew: false,
    isPopular: true,
    createdAt: "2023-12-10T00:00:00Z",
    updatedAt: "2023-12-10T00:00:00Z",
  },
];

const newGames = [
  {
    id: "4",
    slug: "space-shooter",
    title: "Space Shooter X",
    description: "Batalha espacial intensa com gráficos modernos.",
    shortDescription: "Shoot'em up espacial",
    thumbnail: "https://picsum.photos/seed/space-shooter/400/225",
    coverImage: "https://picsum.photos/seed/space-shooter/800/450",
    category: {
      id: "1",
      slug: "action",
      name: "Ação",
      description: "",
      icon: "⚡",
      gameCount: 50,
      color: "red",
    },
    tags: ["Espaço", "Shooter", "Arcade"],
    rating: 4.5,
    playCount: 45000,
    releaseDate: "2024-03-01",
    developer: "Star Games",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/space-shooter",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: true,
    isPopular: false,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    id: "5",
    slug: "platform-hero",
    title: "Platform Hero",
    description: "Aventura de plataforma desafiadora.",
    shortDescription: "Platformer precision",
    thumbnail: "https://picsum.photos/seed/platform-hero/400/225",
    coverImage: "https://picsum.photos/seed/platform-hero/800/450",
    category: {
      id: "4",
      slug: "platformer",
      name: "Plataforma",
      description: "",
      icon: "🏃",
      gameCount: 25,
      color: "green",
    },
    tags: ["Plataforma", "Precision", "Desafio"],
    rating: 4.7,
    playCount: 32000,
    releaseDate: "2024-03-10",
    developer: "Jump Studios",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/platform-hero",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: true,
    isPopular: false,
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
];

const popularGames = [
  {
    id: "6",
    slug: "battle-arena",
    title: "Battle Arena",
    description: "Combate multiplayer intenso em arenas.",
    shortDescription: "Multiplayer battle arena",
    thumbnail: "https://picsum.photos/seed/battle-arena/400/225",
    coverImage: "https://picsum.photos/seed/battle-arena/800/450",
    category: {
      id: "1",
      slug: "action",
      name: "Ação",
      description: "",
      icon: "⚡",
      gameCount: 50,
      color: "red",
    },
    tags: ["Multiplayer", "Battle", "Competitivo"],
    rating: 4.8,
    playCount: 500000,
    releaseDate: "2023-11-01",
    developer: "Arena Games",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/battle-arena",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: false,
    isPopular: true,
    createdAt: "2023-11-01T00:00:00Z",
    updatedAt: "2023-11-01T00:00:00Z",
  },
  {
    id: "7",
    slug: "racing-fever",
    title: "Racing Fever",
    description: "Corridas de alta velocidade em pistas neon.",
    shortDescription: "Racing futurista",
    thumbnail: "https://picsum.photos/seed/racing-fever/400/225",
    coverImage: "https://picsum.photos/seed/racing-fever/800/450",
    category: {
      id: "5",
      slug: "racing",
      name: "Corrida",
      description: "",
      icon: "🏎️",
      gameCount: 15,
      color: "orange",
    },
    tags: ["Corrida", "Velocidade", "Neon"],
    rating: 4.6,
    playCount: 380000,
    releaseDate: "2023-10-15",
    developer: "Speed Studios",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/racing-fever",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: false,
    isPopular: true,
    createdAt: "2023-10-15T00:00:00Z",
    updatedAt: "2023-10-15T00:00:00Z",
  },
];

const categories = [
  {
    id: "1",
    slug: "action",
    name: "Ação",
    description: "",
    icon: "⚡",
    gameCount: 50,
    color: "red",
  },
  {
    id: "2",
    slug: "puzzle",
    name: "Puzzle",
    description: "",
    icon: "🧩",
    gameCount: 30,
    color: "blue",
  },
  {
    id: "3",
    slug: "arcade",
    name: "Arcade",
    description: "",
    icon: "🎮",
    gameCount: 40,
    color: "yellow",
  },
  {
    id: "4",
    slug: "platformer",
    name: "Plataforma",
    description: "",
    icon: "🏃",
    gameCount: 25,
    color: "green",
  },
  {
    id: "5",
    slug: "racing",
    name: "Corrida",
    description: "",
    icon: "🏎️",
    gameCount: 15,
    color: "orange",
  },
  {
    id: "6",
    slug: "strategy",
    name: "Estratégia",
    description: "",
    icon: "♟️",
    gameCount: 20,
    color: "purple",
  },
  {
    id: "7",
    slug: "rpg",
    name: "RPG",
    description: "",
    icon: "⚔️",
    gameCount: 35,
    color: "pink",
  },
  {
    id: "8",
    slug: "sports",
    name: "Esportes",
    description: "",
    icon: "⚽",
    gameCount: 18,
    color: "teal",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
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
            <a
              href="/games"
              className="px-8 py-4 text-lg font-bold bg-neon-green text-black rounded-lg hover:bg-neon-green/80 transition-colors w-full sm:w-auto"
            >
              Explorar Jogos
            </a>
            <a
              href="/categories"
              className="px-8 py-4 text-lg font-medium bg-gray-800 text-white border border-gray-700 rounded-lg hover:border-neon-green/50 hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              Ver Categorias
            </a>
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

      <section className="py-20 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Em Destaque</h2>
              <p className="text-gray-400 mt-1">
                Nossos jogos mais recomendados
              </p>
            </div>
            <a
              href="/games?sort=featured"
              className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
            >
              Ver todos →
            </a>
          </div>
          <GameGrid games={featuredGames} />
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Novos Jogos</h2>
              <p className="text-gray-400 mt-1">
                Lançamentos recentes na plataforma
              </p>
            </div>
            <a
              href="/games?sort=newest"
              className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
            >
              Ver todos →
            </a>
          </div>
          <GameGrid games={newGames} />
        </div>
      </section>

      <section className="py-20 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Mais Populares</h2>
              <p className="text-gray-400 mt-1">
                Jogos mais jogados pela comunidade
              </p>
            </div>
            <a
              href="/games?sort=popular"
              className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
            >
              Ver todos →
            </a>
          </div>
          <GameGrid games={popularGames} />
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">Categorias</h2>
              <p className="text-gray-400 mt-1">Explore por gênero</p>
            </div>
            <Link
              href="/categories"
              className="text-neon-green hover:text-neon-green/80 font-medium transition-colors"
            >
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-neon-green/50 hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all duration-300 text-center"
              >
                <span className="text-4xl mb-3 block">{category.icon}</span>
                <h3 className="font-bold text-white group-hover:text-neon-green transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {category.gameCount} jogos
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-950 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para Jogar?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Junte-se a milhões de jogadores e descubra sua próxima aventura
            favorita. Sem downloads, sem espera, apenas diversão instantânea.
          </p>
          <a
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
          </a>
        </div>
      </section>
    </div>
  );
}
