"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { useUploadedGames } from "@/hooks/use-uploaded-games";

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminGames() {
  const { games, loading, deleteGame } = useUploadedGames();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch =
        !searchQuery ||
        game.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery, games]);

  const handleDelete = (id: string, slug: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir "${title}"?`)) {
      deleteGame(slug);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Jogos</h1>
          <p className="text-cyber-text-muted mt-1">
            Gerencie todos os jogos da plataforma
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Upload
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-text-muted"
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
            className="w-full pl-10 pr-4 py-2.5 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
          />
        </div>
      </div>

      {/* Stats summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="text-cyber-text-muted">
          Total: <strong className="text-white">{games.length}</strong>
        </span>
      </div>

      {/* Games table */}
      <div className="rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-cyber-text-muted">Carregando jogos...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-dark-border bg-cyber-dark-surface/50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-cyber-text-muted uppercase tracking-wider">
                    Jogo
                  </th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-cyber-text-muted uppercase tracking-wider hidden md:table-cell">
                    Criado em
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-cyber-text-muted uppercase tracking-wider hidden lg:table-cell">
                    Jogadas
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-cyber-text-muted uppercase tracking-wider hidden lg:table-cell">
                    Tamanho
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-cyber-text-muted uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredGames.map((game) => (
                  <tr
                    key={game.id}
                    className="hover:bg-cyber-dark-surface/20 transition-colors group"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyber-dark-surface flex items-center justify-center shrink-0 overflow-hidden">
                          <svg
                            className="w-5 h-5 text-cyber-text-muted/70"
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
                        </div>
                        <div>
                          <Link
                            href={`/play/${game.slug}`}
                            className="text-sm font-medium text-white hover:text-neon-green transition-colors"
                          >
                            {game.title}
                          </Link>
                          <p className="text-xs text-cyber-text-muted truncate max-w-[200px]">
                            /play/{game.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell text-center">
                      <span className="text-sm text-cyber-text-muted">
                        {new Date(game.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-right">
                      <span className="text-sm text-cyber-text">
                        {game.playCount > 0
                          ? formatNumber(game.playCount)
                          : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 hidden lg:table-cell text-right">
                      <span className="text-sm text-cyber-text-muted">
                        {game.size < 1024
                          ? `${game.size} B`
                          : game.size < 1024 * 1024
                            ? `${(game.size / 1024).toFixed(0)} KB`
                            : `${(game.size / (1024 * 1024)).toFixed(1)} MB`}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`/play/${game.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-cyber-text-muted hover:text-neon-green hover:bg-cyber-dark-surface transition-all"
                          title="Jogar"
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
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                          </svg>
                        </a>
                        <button
                          onClick={() =>
                            handleDelete(game.id, game.slug, game.title)
                          }
                          className="p-2 rounded-lg text-cyber-text-muted hover:text-red-400 hover:bg-cyber-dark-surface transition-all"
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
          )}
        </div>

        {/* Empty state */}
        {!loading && filteredGames.length === 0 && (
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
            <p className="text-cyber-text-muted text-lg font-medium">
              {games.length === 0
                ? "Nenhum jogo publicado ainda"
                : "Nenhum jogo encontrado"}
            </p>
            <p className="text-cyber-text-muted/70 text-sm mt-1">
              {games.length === 0
                ? "Faça upload do primeiro jogo HTML agora mesmo!"
                : "Tente alterar os filtros da busca"}
            </p>
            {games.length === 0 && (
              <Link
                href="/admin/upload"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Fazer Upload
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination info */}
      {!loading && filteredGames.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-cyber-text-muted">
            Mostrando {filteredGames.length} de {games.length} jogos
          </p>
        </div>
      )}
    </div>
  );
}
