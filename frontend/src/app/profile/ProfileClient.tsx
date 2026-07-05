"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-data";
import {
  formatDate,
  formatPlaytime,
  getInitials,
  getColorFromString,
} from "@/lib/utils";

export function ProfileClient() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
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
          <p className="text-gray-400 mb-8">
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
              className="px-6 py-3 bg-gray-800 text-white font-medium border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
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
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Profile Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
              style={{ backgroundColor: avatarColor }}
            >
              {getInitials(user.username)}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white mb-1">
                {user.username}
              </h1>
              <p className="text-gray-400 mb-1">{user.email}</p>
              {user.bio && (
                <p className="text-gray-500 text-sm max-w-md">{user.bio}</p>
              )}
              <p className="text-xs text-gray-600 mt-2">
                Membro desde {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-2xl font-bold text-neon-green">
              {user.favorites?.length ?? 0}
            </p>
            <p className="text-sm text-gray-400">Favoritos</p>
          </div>
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-2xl font-bold text-white">
              {user.recentlyPlayed?.length ?? 0}
            </p>
            <p className="text-sm text-gray-400">Jogados</p>
          </div>
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-2xl font-bold text-white">
              {user.achievements?.length ?? 0}
            </p>
            <p className="text-sm text-gray-400">Conquistas</p>
          </div>
          <div className="p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
            <p className="text-2xl font-bold text-white">
              {formatPlaytime(totalPlaytime)}
            </p>
            <p className="text-sm text-gray-400">Total Jogado</p>
          </div>
        </div>

        {/* Recently Played */}
        {user.recentlyPlayed && user.recentlyPlayed.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-white mb-4">
              Jogados Recentemente
            </h2>
            <div className="space-y-3">
              {user.recentlyPlayed.map((item) => (
                <div
                  key={item.gameId}
                  className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-2xl flex-shrink-0">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/game/${item.gameId}`}
                      className="text-white font-medium hover:text-neon-green transition-colors"
                    >
                      Jogo #{item.gameId}
                    </Link>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{formatPlaytime(item.duration)}</span>
                      <span>{formatDate(item.lastPlayed)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements */}
        {user.achievements && user.achievements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Conquistas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {user.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-4 bg-gray-900 border border-gray-800 rounded-xl"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {achievement.icon || "🏆"}
                  </span>
                  <div>
                    <p className="text-white font-medium text-sm">
                      {achievement.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {achievement.description}
                    </p>
                    {achievement.unlockedAt && (
                      <p className="text-gray-600 text-xs mt-1">
                        Desbloqueado em {formatDate(achievement.unlockedAt)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
