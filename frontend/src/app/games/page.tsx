"use client";

import React from "react";
import { Metadata } from "next";
import GameGrid from "@/components/game/GameGrid";
import SearchBar from "@/components/ui/SearchBar";
import CategoryPill from "@/components/ui/CategoryPill";
import { Game, Category, GameFilters } from "@/types";

export const metadata: Metadata = {
  title: "Catálogo de Jogos - Latency Zero",
  description:
    "Explore nossa biblioteca completa de jogos. Filtre por categoria, popularidade e mais.",
  openGraph: {
    title: "Catálogo de Jogos - Latency Zero",
    description: "Explore nossa biblioteca completa de jogos.",
    type: "website",
    locale: "pt_BR",
  },
};

const mockGames: Game[] = [
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
    thumbnail: "https://picsum.photosumsum.photos/seed/arcade-classics/400/225",
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
  {
    id: "8",
    slug: "strategy-master",
    title: "Strategy Master",
    description: "Conquiste impérios em turnos.",
    shortDescription: "Estratégia 4X profunda",
    thumbnail: "https://picsum.photos/seed/strategy-master/400/225",
    coverImage: "https://picsum.photos/seed/strategy-master/800/450",
    category: {
      id: "6",
      slug: "strategy",
      name: "Estratégia",
      description: "",
      icon: "♟️",
      gameCount: 20,
      color: "purple",
    },
    tags: ["Estratégia", "Turnos", "4X"],
    rating: 4.5,
    playCount: 67000,
    releaseDate: "2024-01-20",
    developer: "Tactic Studios",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/strategy-master",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: false,
    isPopular: false,
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
  {
    id: "9",
    slug: "rpg-legacy",
    title: "RPG Legacy",
    description: "Épica jornada em mundo fantástico.",
    shortDescription: "RPG de mundo aberto",
    thumbnail: "https://picsum.photos/seed/rpg-legacy/400/225",
    coverImage: "https://picsum.photos/seed/rpg-legacy/800/450",
    category: {
      id: "7",
      slug: "rpg",
      name: "RPG",
      description: "",
      icon: "⚔️",
      gameCount: 35,
      color: "pink",
    },
    tags: ["RPG", "Mundo Aberto", "Fantasia"],
    rating: 4.7,
    playCount: 156000,
    releaseDate: "2023-09-01",
    developer: "Fantasy Games",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/rpg-legacy",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: false,
    isPopular: true,
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "10",
    slug: "soccer-pro",
    title: "Soccer Pro 2024",
    description: "Simulador de futebol realista.",
    shortDescription: "Esportes - Futebol",
    thumbnail: "https://picsum.photos/seed/soccer-pro/400/225",
    coverImage: "https://picsum.photos/seed/soccer-pro/800/450",
    category: {
      id: "8",
      slug: "sports",
      name: "Esportes",
      description: "",
      icon: "⚽",
      gameCount: 18,
      color: "teal",
    },
    tags: ["Futebol", "Simulação", "Multiplayer"],
    rating: 4.4,
    playCount: 89000,
    releaseDate: "2024-02-01",
    developer: "Sport Studios",
    publisher: "Latency Zero",
    iframeUrl: "https://example.com/soccer-pro",
    width: 800,
    height: 600,
    isFeatured: false,
    isNew: true,
    isPopular: false,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
];

const mockCategories: Category[] = [
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

const sortOptions = [
  { value: "popularity", label: "Mais Populares" },
  { value: "rating", label: "Melhor Avaliados" },
  { value: "newest", label: "Mais Recentes" },
  { value: "oldest", label: "Mais Antigos" },
  { value: "alphabetical", label: "A-Z" },
];

const GamesPage = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [isLoading] = React.useState(false);
  const [sortBy, setSortBy] =
    React.useState<GameFilters["sortBy"]>("popularity");

  const filteredGames = React.useMemo(() => {
    let result = [...mockGames];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.shortDescription.toLowerCase().includes(query) ||
          game.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((game) => game.category?.slug === selectedCategory);
    }

    switch (sortBy) {
      case "popularity":
        result.sort((a, b) => (b.playCount ?? 0) - (a.playCount ?? 0));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate ?? 0).getTime(),
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.releaseDate ?? 0).getTime() -
            new Date(b.releaseDate ?? 0).getTime(),
        );
        break;
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="min-h-screen bg-black">
      <section className="py-16 bg-gray-950 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">
                Catálogo de Jogos
              </h1>
              <p className="text-gray-400 mt-2">
                Explore nossa biblioteca completa de jogos
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={handleSearch}
                placeholder="Buscar jogos..."
                className="flex-1 max-w-md"
              />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as GameFilters["sortBy"])
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
                color: "",
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
            isLoading={isLoading}
            emptyMessage="Nenhum jogo encontrado com os filtros atuais"
          />
        </div>
      </section>
    </div>
  );
};

export default GamesPage;
