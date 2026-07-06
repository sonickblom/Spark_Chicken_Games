"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { cn, formatNumber } from "@/lib/utils";
import type { Game } from "@/types";

// ─── Mock games data ────────────────────────────────────────────────────────

const mockGames: (Partial<Game> & { status: string })[] = [
  {
    id: "1",
    title: "Cyber Quest",
    slug: "cyber-quest",
    shortDescription: "Aventura cyberpunk em mundo aberto",
    coverImage: "",
    category: { id: "1", name: "Ação", slug: "acao", description: "", icon: "", gameCount: 28 },
    rating: 4.8,
    playCount: 12450,
    isFree: false,
    price: 29.90,
    discount: 20,
    status: "published",
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-07-04T14:30:00Z",
  },
  {
    id: "2",
    title: "Space Warriors",
    slug: "space-warriors",
    shortDescription: "Batalhas espaciais multiplayer",
    coverImage: "",
    category: { id: "2", name: "Arcade", slug: "arcade", description: "", icon: "", gameCount: 22 },
    rating: 4.6,
    playCount: 9870,
    isFree: true,
    price: 0,
    status: "published",
    createdAt: "2025-06-20T08:00:00Z",
    updatedAt: "2025-07-03T12:00:00Z",
  },
  {
    id: "3",
    title: "Pixel Racer",
    slug: "pixel-racer",
    shortDescription: "Corrida retrô pixel art",
    coverImage: "",
    category: { id: "3", name: "Corrida", slug: "corrida", description: "", icon: "", gameCount: 16 },
    rating: 4.7,
    playCount: 7650,
    isFree: true,
    price: 0,
    status: "published",
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-07-01T10:00:00Z",
  },
  {
    id: "4",
    title: "Dungeon Crawler X",
    slug: "dungeon-crawler-x",
    shortDescription: "RPG de masmorras com elementos roguelike",
    coverImage: "",
    category: { id: "4", name: "RPG", slug: "rpg", description: "", icon: "", gameCount: 19 },
    rating: 4.5,
    playCount: 6540,
    isFree: false,
    price: 19.90,
    status: "published",
    createdAt: "2025-06-28T14:30:00Z",
    updatedAt: "2025-07-02T09:00:00Z",
  },
  {
    id: "5",
    title: "Zombie Shooter",
    slug: "zombie-shooter",
    shortDescription: "Sobrevivência contra zumbis",
    coverImage: "",
    category: { id: "5", name: "Tiro", slug: "tiro", description: "", icon: "", gameCount: 12 },
    rating: 4.3,
    playCount: 5430,
    isFree: false,
    price: 14.90,
    discount: 30,
    status: "published",
    createdAt: "2025-06-20T16:45:00Z",
    updatedAt: "2025-06-29T11:30:00Z",
  },
  {
    id: "6",
    title: "Puzzle Masters",
    slug: "puzzle-masters",
    shortDescription: "Coleção de quebra-cabeças desafiadores",
    coverImage: "",
    category: { id: "6", name: "Puzzle", slug: "puzzle", description: "", icon: "", gameCount: 14 },
    rating: 0,
    playCount: 0,
    isFree: true,
    price: 0,
    status: "draft",
    createdAt: "2025-06-25T09:15:00Z",
    updatedAt: "2025-06-25T09:15:00Z",
  },
  {
    id: "7",
    title: "Farm Simulator",
    slug: "farm-simulator",
    shortDescription: "Simulador de fazenda relaxante",
    coverImage: "",
    category: { id: "7", name: "Simulação", slug: "simulacao", description: "", icon: "", gameCount: 10 },
    rating: 4.2,
    playCount: 3210,
    isFree: true,
    price: 0,
    status: "published",
    createdAt: "2025-06-18T11:00:00Z",
    updatedAt: "2025-06-28T15:00:00Z",
  },
  {
    id: "8",
    title: "Battle Arena",
    slug: "battle-arena",
    shortDescription: "Jogo de luta 2D competitivo",
    coverImage: "",
    category: { id: "1", name: "Ação", slug: "acao", description: "", icon: "", gameCount: 28 },
    rating: 0,
    playCount: 0,
    isFree: false,
    price: 24.90,
    status: "draft",
    createdAt: "2025-06-22T13:00:00Z",
    updatedAt: "2025-06-22T13:00:00Z",
  },
  {
    id: "9",
    title: "Chess Pro",
    slug: "chess-pro",
    shortDescription: "Xadrez online com IA avançada",
    coverImage: "",
    category: { id: "8", name: "Estratégia", slug: "estrategia", description: "", icon: "", gameCount: 8 },
    rating: 4.9,
    playCount: 2100,
    isFree: true,
    price: 0,
    status: "published",
    createdAt: "2025-06-10T16:00:00Z",
    updatedAt: "2025-06-25T10:00:00Z",
  },
  {
    id: "10",
    title: "Rhythm Beats",
    slug: "rhythm-beats",
    shortDescription: "Jogo musical com batidas eletrônicas",
    coverImage: "",
    category: { id: "2", name: "Arcade", slug: "arcade", description: "", icon: "", gameCount: 22 },
    rating: 4.4,
    playCount: 4300,
    isFree: false,
    price: 9.90,
    discount: 15,
    status: "published",
    createdAt: "2025-06-05T12:00:00Z",
    updatedAt: "2025-06-24T14:00:00Z",
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminGames() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Map<string, string>();
    mockGames.forEach((g) => {
      if (g.category?.name && g.category?.slug) {
        cats.set(g.category.slug, g.category.name);
      }
    });
    return Array.from(cats.entries()).map(([slug, name]) => ({ slug, name }));
  }, []);

  // Filtered games
  const filteredGames = useMemo(() => {
    return mockGames.filter((game) => {
      const matchesSearch =
        !searchQuery ||
        game.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || game.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || game.category?.slug === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${title}"?`)) {
      console.log("Delete game:", id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Jogos</h1>
          <p className="text-gray-400 mt-1">
            Gerencie todos os jogos da plataforma
          </p>
        </div>
        <Link
          href="/admin/games/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Jogo
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Buscar jogos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm"
        >
          <option value="all">Todos os status</option>
          <option value="published">Publicado</option>
          <option value="draft">Rascunho</option>
        </select>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm"
        >
          <option value="all">Todas as categorias</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-gray-400">
          Total: <strong className="text-white">{mockGames.length}</strong>
        </span>
        <span className="text-gray-400">
          Publicados:{" "}
          <strong className="text-neon-green">
            {mockGames.filter((g) => g.status === "published").length}
          </strong>
        </span>
        <span className="text-gray-400">
          Rascunhos:{" "}
          <strong className="text-yellow-400">
            {mockGames.filter((g) => g.status === "draft").length}
          </strong>
        </span>
      </div>

      {/* Games table */}
      <div className="rounded-xl bg-gray-900/30 border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jogo
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Categoria
                </th>
                <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Preço
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Avaliação
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Jogadas
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredGames.map((game) => (
                <tr
                  key={game.id}
                  className="hover:bg-gray-800/20 transition-colors group"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail placeholder */}
                      <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                        {game.coverImage ? (
                          <img
                            src={game.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/games/${game.id}/edit`}
                          className="text-sm font-medium text-white hover:text-neon-green transition-colors"
                        >
                          {game.title}
                        </Link>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">
                          {game.shortDescription}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-gray-400">
                      {game.category?.name}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium",
                        game.status === "published"
                          ? "bg-neon-green/10 text-neon-green"
                          : "bg-yellow-500/10 text-yellow-400",
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          game.status === "published"
                            ? "bg-neon-green"
                            : "bg-yellow-400",
                        )}
                      />
                      {game.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-right">
                    <span className="text-sm text-gray-300">
                      {game.isFree ? (
                        <span className="text-neon-green font-medium">Grátis</span>
                      ) : (
                        <>
                          {game.discount && game.discount > 0 ? (
                            <>
                              <span className="text-gray-500 line-through mr-1">
                                R$ {(game.price ?? 0).toFixed(2)}
                              </span>
                              <span className="text-white font-medium">
                                R${" "}
                                {(
                                  (game.price ?? 0) *
                                  (1 - (game.discount ?? 0) / 100)
                                ).toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-white font-medium">
                              R$ {(game.price ?? 0).toFixed(2)}
                            </span>
                          )}
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-right">
                    {game.rating && game.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm text-yellow-400">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {game.rating}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-right">
                    <span className="text-sm text-gray-300">
                      {(game.playCount ?? 0) > 0
                        ? formatNumber(game.playCount ?? 0)
                        : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/games/${game.id}/edit`}
                        className="p-2 rounded-lg text-gray-500 hover:text-neon-green hover:bg-gray-800 transition-all"
                        title="Editar"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(game.id!, game.title!)}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition-all"
                        title="Excluir"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M3 7h18"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
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
            <p className="text-gray-400 text-lg font-medium">
              Nenhum jogo encontrado
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Tente alterar os filtros ou criar um novo jogo
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Mostrando {filteredGames.length} de {mockGames.length} jogos
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-400 bg-gray-900 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50" disabled>
            Anterior
          </button>
          <button className="px-3 py-1.5 text-sm text-neon-green bg-gray-900 border border-neon-green/30 rounded-lg">
            1
          </button>
          <button className="px-3 py-1.5 text-sm text-gray-400 bg-gray-900 border border-gray-700 rounded-lg hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50" disabled>
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
