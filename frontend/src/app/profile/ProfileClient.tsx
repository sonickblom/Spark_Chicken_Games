"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trophy, Gamepad2, Clock, Edit3 } from "lucide-react";
import { useAuthContext } from "@/lib/auth-context";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import {
  formatDate,
  formatPlaytime,
  getInitials,
  getColorFromString,
  cn,
} from "@/lib/utils";

type Tab = "overview" | "favorites" | "achievements";

const tabs: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: "overview", label: "Visão Geral", icon: Gamepad2 },
  { id: "favorites", label: "Favoritos", icon: Heart },
  { id: "achievements", label: "Conquistas", icon: Trophy },
];

function GameIcon() {
  return (
    <div className="w-12 h-12 rounded-lg bg-cyber-dark-surface flex items-center justify-center text-2xl flex-shrink-0 border border-white/[0.06]">
      🎮
    </div>
  );
}

function resolveGameSlug(
  gameId: string,
  games: { id: string; slug: string; title: string }[],
): { slug: string; title: string } | null {
  const match = games.find((g) => g.id === gameId || g.slug === gameId);
  if (match) return { slug: match.slug, title: match.title };
  return null;
}

export function ProfileClient() {
  const { user, isAuthenticated, loading } = useAuthContext();
  const { games } = useUploadedGames();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const gameMap = useMemo(
    () => new Map(games.map((g) => [g.id, g])),
    [games],
  );

  const favoriteGames = useMemo(
    () =>
      (user?.favorites
        ?.map((favId) => gameMap.get(favId))
        .filter((g): g is NonNullable<typeof g> => g != null) || []),
    [user?.favorites, gameMap],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-cyber-dark-surface flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Acesso Restrito
          </h1>
          <p className="text-cyber-text-muted mb-8">
            Faça login para acessar seu perfil e gerenciar suas informações.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/80 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-6 py-3 bg-cyber-dark-surface text-white font-medium border border-cyber-dark-border rounded-lg hover:bg-cyber-dark-surface/70 transition-colors"
            >
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const avatarColor = getColorFromString(user.username);
  const totalPlaytime = user.playtime
    ? Object.values(user.playtime).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 bg-cyber-dark-surface/30 border border-cyber-dark-border rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 ring-2 ring-neon-green/30 shadow-[0_0_20px_rgba(0,255,65,0.15)]"
              style={{ backgroundColor: avatarColor }}
            >
              {getInitials(user.username)}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-white mb-1">
                {user.username}
              </h1>
              <p className="text-cyber-text-muted mb-1">{user.email}</p>
              {user.bio && (
                <p className="text-cyber-text-muted/80 text-sm max-w-md">
                  {user.bio}
                </p>
              )}
              <p className="text-xs text-cyber-text-muted/50 mt-2">
                Membro desde {formatDate(user.createdAt)}
              </p>
            </div>
            <Link
              href="/profile/edit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono text-neon-green border border-neon-green/30 rounded-full hover:bg-neon-green/[0.06] hover:shadow-[0_0_20px_rgba(0,255,65,0.1)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Editar Perfil
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { value: user.favorites?.length ?? 0, label: "Favoritos", icon: Heart },
            { value: user.recentlyPlayed?.length ?? 0, label: "Jogados", icon: Clock },
            { value: user.achievements?.length ?? 0, label: "Conquistas", icon: Trophy },
            { value: formatPlaytime(totalPlaytime), label: "Total Jogado", icon: Gamepad2 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 bg-cyber-dark-surface border border-cyber-dark-border rounded-xl text-center group hover:border-neon-green/20 transition-all duration-500"
            >
              <stat.icon className="w-5 h-5 text-neon-green/50 mx-auto mb-2 group-hover:text-neon-green transition-colors" />
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-cyber-text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-cyber-dark-surface/50 border border-cyber-dark-border rounded-xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-mono rounded-lg transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                activeTab === tab.id
                  ? "bg-neon-green/[0.1] text-neon-green shadow-[0_0_12px_rgba(0,255,65,0.05)]"
                  : "text-cyber-text-muted hover:text-white hover:bg-white/[0.03]",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recently Played */}
              {user.recentlyPlayed && user.recentlyPlayed.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-neon-green" />
                    Jogados Recentemente
                  </h2>
                  <div className="space-y-3">
                    {user.recentlyPlayed.map((item) => {
                      const resolved = resolveGameSlug(item.gameId, games);
                      return (
                        <div
                          key={item.gameId}
                          className="flex items-center gap-4 p-4 bg-cyber-dark-surface border border-cyber-dark-border rounded-xl hover:border-neon-green/20 transition-all duration-500"
                        >
                          <GameIcon />
                          <div className="flex-1 min-w-0">
                            {resolved ? (
                              <Link
                                href={`/game/${resolved.slug}`}
                                className="text-white font-medium hover:text-neon-green transition-colors"
                              >
                                {resolved.title}
                              </Link>
                            ) : (
                              <span className="text-white font-medium">
                                Jogo #{item.gameId.slice(0, 8)}
                              </span>
                            )}
                            <div className="flex items-center gap-3 text-sm text-cyber-text-muted">
                              <span>{formatPlaytime(item.duration)}</span>
                              <span>{formatDate(item.lastPlayed)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {(!user.recentlyPlayed || user.recentlyPlayed.length === 0) && (
                <div className="text-center py-16 bg-cyber-dark-surface/20 border border-cyber-dark-border rounded-xl">
                  <Gamepad2 className="w-12 h-12 text-cyber-text-muted/30 mx-auto mb-4" />
                  <p className="text-cyber-text-muted text-lg font-medium mb-2">
                    Nenhum jogo jogado ainda
                  </p>
                  <Link
                    href="/games"
                    className="text-neon-green hover:underline text-sm"
                  >
                    Explorar jogos
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {favoriteGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteGames.map((game) => (
                    <Link
                      key={game.id}
                      href={`/game/${game.slug}`}
                      className="flex items-center gap-4 p-4 bg-cyber-dark-surface border border-cyber-dark-border rounded-xl hover:border-neon-green/20 hover:shadow-[0_0_20px_rgba(0,255,65,0.05)] transition-all duration-500 group"
                    >
                      <GameIcon />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium group-hover:text-neon-green transition-colors">
                          {game.title}
                        </p>
                        <p className="text-sm text-cyber-text-muted truncate">
                          {game.description.slice(0, 80)}
                        </p>
                      </div>
                      <Heart className="w-5 h-5 text-neon-green flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-cyber-dark-surface/20 border border-cyber-dark-border rounded-xl">
                  <Heart className="w-12 h-12 text-cyber-text-muted/30 mx-auto mb-4" />
                  <p className="text-cyber-text-muted text-lg font-medium mb-2">
                    Nenhum favorito ainda
                  </p>
                  <Link
                    href="/games"
                    className="text-neon-green hover:underline text-sm"
                  >
                    Explorar jogos
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "achievements" && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {user.achievements && user.achievements.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {user.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-4 bg-cyber-dark-surface border border-cyber-dark-border rounded-xl hover:border-neon-green/20 transition-all duration-500"
                    >
                      <span className="text-2xl" aria-hidden="true">
                        {achievement.icon || "🏆"}
                      </span>
                      <div>
                        <p className="text-white font-medium text-sm">
                          {achievement.name}
                        </p>
                        <p className="text-cyber-text-muted/80 text-xs">
                          {achievement.description}
                        </p>
                        {achievement.unlockedAt && (
                          <p className="text-cyber-text-muted/50 text-xs mt-1">
                            Desbloqueado em {formatDate(achievement.unlockedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-cyber-dark-surface/20 border border-cyber-dark-border rounded-xl">
                  <Trophy className="w-12 h-12 text-cyber-text-muted/30 mx-auto mb-4" />
                  <p className="text-cyber-text-muted text-lg font-medium mb-2">
                    Nenhuma conquista ainda
                  </p>
                  <p className="text-cyber-text-muted/70 text-sm">
                    Jogue para desbloquear conquistas
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
