"use client";

import { useState, useEffect, useCallback } from "react";

export interface UploadedGameData {
  id: string;
  slug: string;
  title: string;
  description: string;
  files: string[];
  mainFile: string;
  createdAt: string;
  updatedAt: string;
  playCount: number;
  size: number;
  url: string;
  embedUrl: string;
}

export function useUploadedGames() {
  const [games, setGames] = useState<UploadedGameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/games/upload");
      if (!res.ok) throw new Error("Erro ao carregar jogos");
      const data = await res.json();
      setGames(data.games || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const uploadGame = async (
    title: string,
    description: string,
    files: FileList | File[]
  ): Promise<UploadedGameData> => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const res = await fetch("/api/games/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Erro ao fazer upload");
    }

    await fetchGames();
    return data.game;
  };

  const deleteGame = async (slug: string): Promise<void> => {
    const res = await fetch("/api/games/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Erro ao remover jogo");
    }

    await fetchGames();
  };

  const getGameBySlug = useCallback(
    (slug: string): UploadedGameData | undefined => {
      return games.find((g) => g.slug === slug);
    },
    [games]
  );

  return {
    games,
    loading,
    error,
    uploadGame,
    deleteGame,
    getGameBySlug,
    refresh: fetchGames,
  };
}
