"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { formatNumber } from "@/lib/utils";
import { useUploadedGames } from "@/hooks/use-uploaded-games";

export default function AdminDashboard() {
  const { games } = useUploadedGames();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  const totalPlayCount = games.reduce((sum, g) => sum + g.playCount, 0);
  const sortedByPlays = [...games].sort((a, b) => b.playCount - a.playCount);
  const sortedByDate = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const stats = [
    {
      title: "Total de Jogos",
      value: games.length,
      description: `${games.length} jogo(s) publicado(s)`,
      trend: null as { value: number; isPositive: boolean } | null,
      icon: (
        <svg
          className="w-6 h-6"
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Total de Jogadas",
      value: formatNumber(totalPlayCount),
      description: "Jogadas acumuladas",
      trend: null,
      icon: (
        <svg
          className="w-6 h-6"
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Jogos Publicados",
      value: games.length,
      description: "Disponíveis para jogar",
      trend: null,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      title: "Armazenamento",
      value:
        games.length > 0
          ? `${(games.reduce((sum, g) => sum + g.size, 0) / (1024 * 1024)).toFixed(1)} MB`
          : "0 B",
      description: "Espaço utilizado",
      trend: null,
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting}, Admin 👋
          </h1>
          <p className="text-cyber-text-muted mt-1">
            Aqui está o resumo da sua plataforma
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={String(stat.value)}
            description={stat.description}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jogos Mais Populares */}
        <div className="lg:col-span-2 rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Jogos Mais Populares
          </h2>
          {sortedByPlays.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-cyber-text-muted uppercase tracking-wider">
                    <th className="text-left pb-3 font-medium">#</th>
                    <th className="text-left pb-3 font-medium">Jogo</th>
                    <th className="text-right pb-3 font-medium">Jogadas</th>
                    <th className="text-right pb-3 font-medium">Tamanho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {sortedByPlays.slice(0, 10).map((game, index) => (
                    <tr
                      key={game.id}
                      className="text-sm hover:bg-cyber-dark-surface/30 transition-colors"
                    >
                      <td className="py-3 text-cyber-text-muted">{index + 1}</td>
                      <td className="py-3 font-medium text-white">
                        <Link
                          href={`/play/${game.slug}`}
                          className="hover:text-neon-green transition-colors"
                        >
                          {game.title}
                        </Link>
                      </td>
                      <td className="py-3 text-right text-cyber-text">
                        {formatNumber(game.playCount)}
                      </td>
                      <td className="py-3 text-right text-cyber-text-muted">
                        {game.size < 1024
                          ? `${game.size} B`
                          : game.size < 1024 * 1024
                            ? `${(game.size / 1024).toFixed(0)} KB`
                            : `${(game.size / (1024 * 1024)).toFixed(1)} MB`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-cyber-text-muted">
              <svg
                className="w-12 h-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Nenhum jogo publicado ainda</p>
              <Link
                href="/admin/upload"
                className="text-neon-green hover:underline text-sm mt-2 inline-block"
              >
                Fazer upload do primeiro jogo
              </Link>
            </div>
          )}
        </div>

        {/* Atividade Recente */}
        <div className="rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Jogos Recentes
          </h2>
          <div className="space-y-4">
            {sortedByDate.length > 0 ? (
              sortedByDate.slice(0, 8).map((game) => (
                <Link
                  key={game.id}
                  href={`/play/${game.slug}`}
                  className="flex items-start gap-3 group"
                >
                  <div className="p-1.5 rounded-full bg-neon-green/10 text-neon-green shrink-0 mt-0.5">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-snug group-hover:text-neon-green transition-colors">
                      {game.title}
                    </p>
                    <p className="text-xs text-cyber-text-muted mt-0.5">
                      {new Date(game.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-cyber-text-muted">
                <p>Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Uploaded Games Section */}
      <UploadedGamesSection />
    </div>
  );
}

function UploadedGamesSection() {
  const { games, loading } = useUploadedGames();

  if (loading) {
    return (
      <div className="rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border p-6 text-center text-cyber-text-muted">
        Carregando...
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border p-6">
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-700"
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
          <h3 className="text-lg font-medium text-cyber-text-muted mb-2">
            Nenhum jogo publicado
          </h3>
          <p className="text-sm text-cyber-text-muted/70 mb-6">
            Faça upload do seu primeiro jogo HTML agora mesmo!
          </p>
          <Link
            href="/admin/upload"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Fazer Upload
          </Link>
        </div>
      </div>
    );
  }

  const totalPlayCount = games.reduce((sum, g) => sum + g.playCount, 0);
  const totalSize = games.reduce((sum, g) => sum + g.size, 0);
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-white">
            📦 Jogos Enviados (Upload)
          </h2>
          <p className="text-sm text-cyber-text-muted mt-1">
            Jogos HTML publicados via upload rápido
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-medium rounded-lg hover:bg-neon-green/20 transition-all"
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
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          Novo Upload
        </Link>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-cyber-dark-surface/50 rounded-lg p-3">
          <div className="text-xl font-bold text-neon-green">
            {games.length}
          </div>
          <div className="text-xs text-cyber-text-muted">Jogos</div>
        </div>
        <div className="bg-cyber-dark-surface/50 rounded-lg p-3">
          <div className="text-xl font-bold text-neon-green">
            {totalPlayCount}
          </div>
          <div className="text-xs text-cyber-text-muted">Jogadas</div>
        </div>
        <div className="bg-cyber-dark-surface/50 rounded-lg p-3">
          <div className="text-xl font-bold text-neon-green">
            {formatSize(totalSize)}
          </div>
          <div className="text-xs text-cyber-text-muted">Armazenamento</div>
        </div>
        <div className="bg-cyber-dark-surface/50 rounded-lg p-3">
          <div className="text-xl font-bold text-neon-green">
            {games.reduce((sum, g) => sum + g.files.length, 0)}
          </div>
          <div className="text-xs text-cyber-text-muted">Arquivos</div>
        </div>
      </div>

      {/* Games list */}
      <div className="space-y-2">
        {games.slice(0, 5).map((game) => (
          <div
            key={game.id}
            className="flex items-center justify-between bg-cyber-dark-surface/30 rounded-lg px-4 py-3 hover:bg-cyber-dark-surface/50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">
                {game.title}
              </p>
              <p className="text-xs text-cyber-text-muted truncate">
                /play/{game.slug} · {game.playCount} jogada(s) ·{" "}
                {new Date(game.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              <a
                href={`/play/${game.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 text-xs text-neon-green border border-neon-green/30 rounded-md hover:bg-neon-green/10 transition-colors"
              >
                Jogar
              </a>
              <span className="text-xs text-cyber-text-muted/70">
                {formatSize(game.size)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {games.length > 5 && (
        <p className="block text-center text-sm text-cyber-text-muted mt-4">
          + {games.length - 5} jogo(s) - todos listados em Jogos Enviados
        </p>
      )}
    </div>
  );
}
