"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart } from "@/components/admin/BarChart";
import { PieChart } from "@/components/admin/PieChart";
import { formatNumber, formatRelativeTime } from "@/lib/utils";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import { Gamepad2, Play, HardDrive, Users, Clock } from "lucide-react";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

function generateLast14DaysData(games: { createdAt: string }[]) {
  const days: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayStr = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const count = games.filter((g) => {
      const gd = new Date(g.createdAt);
      return gd.toDateString() === d.toDateString();
    }).length;
    days.push({ label: dayStr, value: count });
  }
  return days;
}

function generateCategoryData(games: { category?: string }[]) {
  const map: Record<string, number> = {};
  for (const g of games) {
    const cat = g.category || "Sem categoria";
    map[cat] = (map[cat] || 0) + 1;
  }
  return Object.entries(map)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDashboard() {
  const { games } = useUploadedGames();
  const [greeting, setGreeting] = useState("");

  useEffect(() => setGreeting(getGreeting()), []);

  const totalPlayCount = games.reduce((sum, g) => sum + g.playCount, 0);
  const totalSize = games.reduce((sum, g) => sum + g.size, 0);
  const sortedByPlays = [...games].sort((a, b) => b.playCount - a.playCount);
  const sortedByDate = [...games].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const sparklineGames = games.length > 0 ? generateLast14DaysData(games).map(d => d.value) : [];
  const sparklinePlays = games.length > 0 ? generateLast14DaysData(games).map(() => Math.floor(Math.random() * 10) + 1) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {greeting}, Samuteg
        </h1>
        <p className="text-cyber-text-muted mt-1">
          {games.length} jogo{games.length !== 1 ? "s" : ""} · {totalPlayCount} jogada{totalPlayCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Jogos"
          value={games.length}
          icon={<Gamepad2 size={20} />}
          sparklineData={sparklineGames}
        />
        <StatCard
          title="Jogadas"
          value={formatNumber(totalPlayCount)}
          icon={<Play size={20} />}
          sparklineData={sparklinePlays}
        />
        <StatCard
          title="Armazenamento"
          value={games.length > 0 ? formatSize(totalSize) : "0 B"}
          icon={<HardDrive size={20} />}
        />
        <StatCard
          title="Jogadores"
          value={games.length > 0 ? "—" : "—"}
          icon={<Users size={20} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6">
          <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider mb-4">
            Jogadas por Dia
          </h2>
          {games.length > 0 ? (
            <BarChart data={generateLast14DaysData(games)} />
          ) : (
            <p className="text-cyber-text-muted text-sm">Sem dados</p>
          )}
        </div>
        <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6">
          <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider mb-4">
            Jogos por Categoria
          </h2>
          {games.length > 0 ? (
            <PieChart data={generateCategoryData(games)} />
          ) : (
            <p className="text-cyber-text-muted text-sm">Sem dados</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6">
          <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider mb-4">
            Mais Populares
          </h2>
          {sortedByPlays.length > 0 ? (
            <div className="space-y-2">
              {sortedByPlays.slice(0, 5).map((game, i) => (
                <div key={game.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono text-cyber-text-muted w-5 shrink-0">
                      {i + 1}.
                    </span>
                    <Link
                      href={`/play/${game.slug}`}
                      className="text-sm text-white hover:text-neon-green truncate transition-colors"
                    >
                      {game.title}
                    </Link>
                  </div>
                  <span className="text-sm font-mono text-neon-green ml-4 shrink-0">
                    {formatNumber(game.playCount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-cyber-text-muted text-sm">Nenhum jogo ainda</p>
          )}
        </div>

        <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6">
          <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider mb-4">
            Atividade Recente
          </h2>
          {sortedByDate.length > 0 ? (
            <div className="space-y-3">
              {sortedByDate.slice(0, 5).map((game) => (
                <div key={game.id} className="flex items-center gap-3 group">
                  <div className="p-1.5 rounded-full bg-neon-green/10 text-neon-green shrink-0">
                    <Clock size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/play/${game.slug}`}
                      className="text-sm text-white hover:text-neon-green truncate block transition-colors"
                    >
                      {game.title}
                    </Link>
                    <p className="text-xs text-cyber-text-muted">
                      Upload · {formatRelativeTime(game.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-cyber-text-muted text-sm">Nenhuma atividade</p>
          )}
        </div>
      </div>
    </div>
  );
}
