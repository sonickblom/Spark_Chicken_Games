"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Game,
  Category,
  PaginatedResponse,
  GameFilters,
  Review,
  NewsItem,
} from "@/types";
import { api } from "@/services/api";

export function useGames(filters: GameFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<Game> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getGames(filters);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar jogos");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { data, loading, error, refetch: fetchGames };
}

export function useGame(slug: string) {
  const [data, setData] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGame = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getGame(slug);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar jogo");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  return { data, loading, error, refetch: fetchGame };
}

export function useRelatedGames(gameId: string, limit = 6) {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRelated = useCallback(async () => {
    if (!gameId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getRelatedGames(gameId, limit);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar jogos relacionados",
      );
    } finally {
      setLoading(false);
    }
  }, [gameId, limit]);

  useEffect(() => {
    fetchRelated();
  }, [fetchRelated]);

  return { data, loading, error, refetch: fetchRelated };
}

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getCategories();
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar categorias",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, loading, error, refetch: fetchCategories };
}

export function useCategory(slug: string) {
  const [data, setData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getCategory(slug);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar categoria",
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { data, loading, error, refetch: fetchCategory };
}

export function useGamesByCategory(
  categorySlug: string,
  filters: GameFilters = {},
) {
  const [data, setData] = useState<PaginatedResponse<Game> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    if (!categorySlug) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getGamesByCategory(categorySlug, filters);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar jogos da categoria",
      );
    } finally {
      setLoading(false);
    }
  }, [categorySlug, filters]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { data, loading, error, refetch: fetchGames };
}

export function useFeaturedGames(limit = 6) {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getFeaturedGames(limit);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar jogos em destaque",
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { data, loading, error, refetch: fetchFeatured };
}

export function usePopularGames(limit = 10) {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPopular = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getPopularGames(limit);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar jogos populares",
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopular();
  }, [fetchPopular]);

  return { data, loading, error, refetch: fetchPopular };
}

export function useNewReleases(limit = 10) {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNew = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getNewReleases(limit);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar lançamentos",
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNew();
  }, [fetchNew]);

  return { data, loading, error, refetch: fetchNew };
}

export function useSearchGames(query: string, limit = 10) {
  const [data, setData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!query.trim()) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = (await api.searchGames(query, 1, limit)).games;
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na busca");
    } finally {
      setLoading(false);
    }
  }, [query, limit]);

  useEffect(() => {
    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  return { data, loading, error, search };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = useCallback(
    async (gameId: string) => {
      setLoading(true);
      try {
        const result = await api.toggleFavorite(gameId);
        if (result.isFavorite) {
          setFavorites((prev) => [...prev, gameId]);
        } else {
          setFavorites((prev) => prev.filter((id) => id !== gameId));
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const isFavorite = useCallback(
    (gameId: string) => {
      return favorites.includes(gameId);
    },
    [favorites],
  );

  const fetchFavorites = useCallback(async () => {
    const games = await api.getFavorites();
    setFavorites(games.map((g) => g.id));
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
}

export function useRecentlyPlayed() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const addToRecentlyPlayed = useCallback(async (gameId: string) => {
    await api.addToRecentlyPlayed(gameId);
  }, []);

  const fetchRecentlyPlayed = useCallback(async () => {
    const recentGames = await api.getRecentlyPlayed();
    setGames(recentGames);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRecentlyPlayed();
  }, [fetchRecentlyPlayed]);

  return { games, loading, addToRecentlyPlayed, refetch: fetchRecentlyPlayed };
}

export function useReviews(gameId: string) {
  const [data, setData] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!gameId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await api.getReviews(gameId);
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar avaliações",
      );
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const createReview = useCallback(
    async (data: { rating: number; title: string; content: string }) => {
      if (!gameId) throw new Error("Game ID required");
      const review = await api.createReview(
        gameId,
        data as Parameters<typeof api.createReview>[1],
      );
      setData((prev) => [review, ...prev]);
      return review;
    },
    [gameId],
  );

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { data, loading, error, createReview, refetch: fetchReviews };
}

export function useNews(limit = 10) {
  const [data, setData] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = (await api.getNews(limit)) as NewsItem[];
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar notícias",
      );
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { data, loading, error, refetch: fetchNews };
}
