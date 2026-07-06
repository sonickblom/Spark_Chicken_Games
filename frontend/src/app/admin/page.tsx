"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { cn, formatNumber } from "@/lib/utils";
import type { Game, Category } from "@/types";

// ─── Mock data for the dashboard ────────────────────────────────────────────

const stats = [
  {
    title: "Total de Jogos",
    value: 156,
    description: "23 jogos publicados este mês",
    trend: { value: 12, isPositive: true },
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
    title: "Usuários Ativos",
    value: "2.4K",
    description: "Média dos últimos 30 dias",
    trend: { value: 8, isPositive: true },
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
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
    ),
  },
  {
    title: "Total de Jogadas",
    value: "47.8K",
    description: "+4.200 nas últimas 24h",
    trend: { value: 23, isPositive: true },
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
    title: "Avaliação Média",
    value: "4.6",
    description: "Baseado em 1.2K avaliações",
    trend: { value: 2, isPositive: true },
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
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
];

// Dados de atividade recente
interface Activity {
  id: string;
  type: "publish" | "update" | "review" | "user";
  message: string;
  time: string;
}

const recentActivity: Activity[] = [
  {
    id: "1",
    type: "publish",
    message: "Novo jogo publicado: Pixel Racer",
    time: "há 5 min",
  },
  {
    id: "2",
    type: "update",
    message: "Cyber Quest foi atualizado para v2.1",
    time: "há 23 min",
  },
  {
    id: "3",
    type: "review",
    message: "João Silva avaliou Space Warriors com 5 estrelas",
    time: "há 1h",
  },
  {
    id: "4",
    type: "user",
    message: "Novo usuário registrado: Maria Santos",
    time: "há 2h",
  },
  {
    id: "5",
    type: "publish",
    message: "Novo jogo publicado: Dungeon Crawler X",
    time: "há 3h",
  },
  {
    id: "6",
    type: "review",
    message: "Pedro Alves avaliou Farm Simulator com 4 estrelas",
    time: "há 5h",
  },
  {
    id: "7",
    type: "update",
    message: "Zombie Shooter recebeu novo mapa",
    time: "há 6h",
  },
  {
    id: "8",
    type: "publish",
    message: "Novo jogo publicado: Puzzle Masters",
    time: "há 8h",
  },
];

const activityIcons: Record<Activity["type"], React.ReactNode> = {
  publish: (
    <div className="p-1.5 rounded-full bg-neon-green/10 text-neon-green">
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </div>
  ),
  update: (
    <div className="p-1.5 rounded-full bg-blue-500/10 text-blue-400">
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
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </div>
  ),
  review: (
    <div className="p-1.5 rounded-full bg-yellow-500/10 text-yellow-400">
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
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </div>
  ),
  user: (
    <div className="p-1.5 rounded-full bg-purple-500/10 text-purple-400">
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    </div>
  ),
};

// Top jogos mock
const topGames = [
  {
    rank: 1,
    title: "Cyber Quest",
    category: "Ação",
    plays: 12450,
    rating: 4.8,
  },
  {
    rank: 2,
    title: "Space Warriors",
    category: "Arcade",
    plays: 9870,
    rating: 4.6,
  },
  {
    rank: 3,
    title: "Pixel Racer",
    category: "Corrida",
    plays: 7650,
    rating: 4.7,
  },
  {
    rank: 4,
    title: "Dungeon Crawler X",
    category: "RPG",
    plays: 6540,
    rating: 4.5,
  },
  {
    rank: 5,
    title: "Zombie Shooter",
    category: "Tiro",
    plays: 5430,
    rating: 4.3,
  },
];

// Jogos por categoria (para gráfico de barras)
const gamesByCategory = [
  { name: "Ação", count: 28, color: "bg-neon-green" },
  { name: "Arcade", count: 22, color: "bg-blue-500" },
  { name: "RPG", count: 19, color: "bg-purple-500" },
  { name: "Corrida", count: 16, color: "bg-yellow-500" },
  { name: "Puzzle", count: 14, color: "bg-pink-500" },
  { name: "Tiro", count: 12, color: "bg-red-500" },
  { name: "Esporte", count: 10, color: "bg-green-500" },
  { name: "Estratégia", count: 8, color: "bg-orange-500" },
];

// Jogos recentes (para tabela)
const recentGames: (Partial<Game> & { status?: string })[] = [
  {
    id: "1",
    title: "Pixel Racer",
    coverImage: "",
    category: {
      id: "1",
      name: "Corrida",
      slug: "corrida",
      description: "",
      icon: "",
      gameCount: 16,
    },
    price: 0,
    isFree: true,
    rating: 4.7,
    playCount: 7650,
    createdAt: "2025-07-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Dungeon Crawler X",
    coverImage: "",
    category: {
      id: "2",
      name: "RPG",
      slug: "rpg",
      description: "",
      icon: "",
      gameCount: 19,
    },
    price: 19.9,
    isFree: false,
    rating: 4.5,
    playCount: 6540,
    createdAt: "2025-06-28T14:30:00Z",
  },
  {
    id: "3",
    title: "Puzzle Masters",
    coverImage: "",
    category: {
      id: "3",
      name: "Puzzle",
      slug: "puzzle",
      description: "",
      icon: "",
      gameCount: 14,
    },
    price: 0,
    isFree: true,
    rating: 0,
    playCount: 0,
    createdAt: "2025-06-25T09:15:00Z",
  },
  {
    id: "4",
    title: "Zombie Shooter",
    coverImage: "",
    category: {
      id: "4",
      name: "Tiro",
      slug: "tiro",
      description: "",
      icon: "",
      gameCount: 12,
    },
    price: 14.9,
    discount: 30,
    isFree: false,
    rating: 4.3,
    playCount: 5430,
    createdAt: "2025-06-20T16:45:00Z",
  },
  {
    id: "5",
    title: "Farm Simulator",
    coverImage: "",
    category: {
      id: "5",
      name: "Simulação",
      slug: "simulacao",
      description: "",
      icon: "",
      gameCount: 10,
    },
    price: 0,
    isFree: true,
    rating: 4.2,
    playCount: 3210,
    createdAt: "2025-06-18T11:00:00Z",
  },
];

// Simple sparkline SVG
function Sparkline({
  data,
  color = "#00ff41",
}: {
  data: number[];
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = points.join(" ");

  return (
    <svg width={w} height={h} className="w-full h-10" viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polyline}
      />
    </svg>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {greeting}, Admin 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Aqui está o resumo da sua plataforma
          </p>
        </div>
        <Link
          href="/admin/games/new"
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
          Novo Jogo
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jogos por Categoria */}
        <div className="lg:col-span-2 rounded-xl bg-gray-900/30 border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Jogos por Categoria
          </h2>
          <div className="space-y-4">
            {gamesByCategory.map((cat) => {
              const maxCount = Math.max(...gamesByCategory.map((c) => c.count));
              const percentage = (cat.count / maxCount) * 100;
              return (
                <div key={cat.name} className="flex items-center gap-4">
                  <span className="text-sm text-gray-300 w-24 shrink-0">
                    {cat.name}
                  </span>
                  <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        cat.color,
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">
                    {cat.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Atividade Recente */}
        <div className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Atividade Recente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                {activityIcons[activity.type]}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 leading-snug">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Jogos */}
        <div className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Jogos Mais Populares
            </h2>
            <Link
              href="/admin/games"
              className="text-sm text-neon-green hover:text-neon-green/80 transition-colors"
            >
              Ver todos
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left pb-3 font-medium">#</th>
                  <th className="text-left pb-3 font-medium">Jogo</th>
                  <th className="text-left pb-3 font-medium">Categoria</th>
                  <th className="text-right pb-3 font-medium">Jogadas</th>
                  <th className="text-right pb-3 font-medium">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {topGames.map((game) => (
                  <tr
                    key={game.rank}
                    className="text-sm hover:bg-gray-800/30 transition-colors"
                  >
                    <td className="py-3 text-gray-400">{game.rank}</td>
                    <td className="py-3 font-medium text-white">
                      {game.title}
                    </td>
                    <td className="py-3 text-gray-400">{game.category}</td>
                    <td className="py-3 text-right text-gray-300">
                      {formatNumber(game.plays)}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center gap-1 text-yellow-400">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {game.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Jogos Recentes */}
        <div className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Jogos Recentes</h2>
            <Link
              href="/admin/games"
              className="text-sm text-neon-green hover:text-neon-green/80 transition-colors"
            >
              Gerenciar
            </Link>
          </div>
          <div className="space-y-4">
            {recentGames.map((game) => (
              <div
                key={game.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800/30 transition-colors group"
              >
                {/* Thumb placeholder */}
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {game.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {game.category?.name} •{" "}
                    {game.isFree ? "Grátis" : `R$ ${game.price?.toFixed(2)}`}
                  </p>
                </div>
                <div className="text-xs text-gray-500 shrink-0">
                  {new Date(game.createdAt!).toLocaleDateString("pt-BR")}
                </div>
                <Link
                  href={`/admin/games/${game.id}/edit`}
                  className="p-2 rounded-lg text-gray-500 hover:text-neon-green hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
