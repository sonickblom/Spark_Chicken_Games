"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Game,
  Category,
  PaginatedResponse,
  GameFilters,
  User,
  Review,
  NewsItem,
} from "@/types";
import { api } from "@/services/api";
import {
  getMockGames,
  getMockGame,
  getMockRelatedGames,
  getMockCategories,
  getMockCategory,
  getMockGamesByCategory,
} from "@/lib/mock-data";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export function useGames(filters: GameFilters = {}) {
  const [data, setData] = useState<PaginatedResponse<Game> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let result: PaginatedResponse<Game>;
      if (USE_MOCK) {
        result = await getMockGames(filters);
      } else {
        result = await api.getGames(filters);
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar jogos");
      if (USE_MOCK) {
        const result = await getMockGames(filters);
        setData(result);
      }
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
      let result: Game | null;
      if (USE_MOCK) {
        result = await getMockGame(slug);
      } else {
        result = await api.getGame(slug);
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar jogo");
      if (USE_MOCK) {
        const result = await getMockGame(slug);
        setData(result);
      }
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
      let result: Game[];
      if (USE_MOCK) {
        result = await getMockRelatedGames(gameId, limit);
      } else {
        result = await api.getRelatedGames(gameId, limit);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar jogos relacionados",
      );
      if (USE_MOCK) {
        const result = await getMockRelatedGames(gameId, limit);
        setData(result);
      }
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
      let result: Category[];
      if (USE_MOCK) {
        result = await getMockCategories();
      } else {
        result = await api.getCategories();
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar categorias",
      );
      if (USE_MOCK) {
        const result = await getMockCategories();
        setData(result);
      }
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
      let result: Category | null;
      if (USE_MOCK) {
        result = await getMockCategory(slug);
      } else {
        result = await api.getCategory(slug);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar categoria",
      );
      if (USE_MOCK) {
        const result = await getMockCategory(slug);
        setData(result);
      }
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
      let result: PaginatedResponse<Game>;
      if (USE_MOCK) {
        result = await getMockGamesByCategory(categorySlug, filters);
      } else {
        result = await api.getGamesByCategory(categorySlug, filters);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar jogos da categoria",
      );
      if (USE_MOCK) {
        const result = await getMockGamesByCategory(categorySlug, filters);
        setData(result);
      }
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
      let result: Game[];
      if (USE_MOCK) {
        const { mockFeaturedGames } = await import("@/lib/mock-data");
        result = mockFeaturedGames.slice(0, limit);
      } else {
        result = await api.getFeaturedGames(limit);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar jogos em destaque",
      );
      if (USE_MOCK) {
        const { mockFeaturedGames } = await import("@/lib/mock-data");
        setData(mockFeaturedGames.slice(0, limit));
      }
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
      let result: Game[];
      if (USE_MOCK) {
        const { mockPopularGames } = await import("@/lib/mock-data");
        result = mockPopularGames.slice(0, limit);
      } else {
        result = await api.getPopularGames(limit);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar jogos populares",
      );
      if (USE_MOCK) {
        const { mockPopularGames } = await import("@/lib/mock-data");
        setData(mockPopularGames.slice(0, limit));
      }
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
      let result: Game[];
      if (USE_MOCK) {
        const { mockNewReleases } = await import("@/lib/mock-data");
        result = mockNewReleases.slice(0, limit);
      } else {
        result = await api.getNewReleases(limit);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar lançamentos",
      );
      if (USE_MOCK) {
        const { mockNewReleases } = await import("@/lib/mock-data");
        setData(mockNewReleases.slice(0, limit));
      }
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
      let result: Game[];
      if (USE_MOCK) {
        const allGames = await getMockGames({ search: query, limit });
        result = allGames.data;
      } else {
        result = (await api.searchGames(query, 1, limit)).games;
      }
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na busca");
      if (USE_MOCK) {
        const allGames = await getMockGames({ search: query, limit });
        setData(allGames.data);
      }
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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string) => {
    if (USE_MOCK) {
      const { mockUser } = await import("@/lib/mock-data");
      localStorage.setItem("auth_token", "mock-token");
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      return { user: mockUser, token: "mock-token" };
    }
    const result = await api.login(email, password);
    localStorage.setItem("auth_token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      if (USE_MOCK) {
        const { mockUser } = await import("@/lib/mock-data");
        const newUser = { ...mockUser, username, email };
        localStorage.setItem("auth_token", "mock-token");
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
        return { user: newUser, token: "mock-token" };
      }
      const result = await api.register({ username, email, password });
      localStorage.setItem("auth_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setUser(result.user);
      return result;
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const checkAuth = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return { user, loading, login, register, logout, isAuthenticated: !!user };
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFavorite = useCallback(
    async (gameId: string) => {
      setLoading(true);
      try {
        let result: { isFavorite: boolean };
        if (USE_MOCK) {
          const newFavorites = favorites.includes(gameId)
            ? favorites.filter((id) => id !== gameId)
            : [...favorites, gameId];
          setFavorites(newFavorites);
          result = { isFavorite: newFavorites.includes(gameId) };
        } else {
          result = await api.toggleFavorite(gameId);
          if (result.isFavorite) {
            setFavorites((prev) => [...prev, gameId]);
          } else {
            setFavorites((prev) => prev.filter((id) => id !== gameId));
          }
        }
        return result;
      } finally {
        setLoading(false);
      }
    },
    [favorites],
  );

  const isFavorite = useCallback(
    (gameId: string) => {
      return favorites.includes(gameId);
    },
    [favorites],
  );

  const fetchFavorites = useCallback(async () => {
    if (USE_MOCK) {
      const { mockUser } = await import("@/lib/mock-data");
      setFavorites(mockUser.favorites);
    } else {
      const games = await api.getFavorites();
      setFavorites(games.map((g) => g.id));
    }
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
    if (USE_MOCK) {
      return;
    }
    await api.addToRecentlyPlayed(gameId);
  }, []);

  const fetchRecentlyPlayed = useCallback(async () => {
    if (USE_MOCK) {
      const { mockUser, mockGames } = await import("@/lib/mock-data");
      const recent = mockUser.recentlyPlayed
        .sort(
          (a, b) =>
            new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime(),
        )
        .slice(0, 10)
        .map((r) => mockGames.find((g) => g.id === r.gameId))
        .filter(Boolean) as Game[];
      setGames(recent);
    } else {
      const recentGames = await api.getRecentlyPlayed();
      setGames(recentGames);
    }
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
      let result: Review[];
      if (USE_MOCK) {
        const { mockReviews } = await import("@/lib/mock-data");
        result = mockReviews.filter((r) => r.gameId === gameId);
      } else {
        result = await api.getReviews(gameId);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar avaliações",
      );
      if (USE_MOCK) {
        const { mockReviews } = await import("@/lib/mock-data");
        setData(mockReviews.filter((r) => r.gameId === gameId));
      }
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const createReview = useCallback(
    async (data: { rating: number; title: string; content: string }) => {
      if (!gameId) throw new Error("Game ID required");
      if (USE_MOCK) {
        const newReview: Review = {
          id: `rev-${Date.now()}`,
          gameId,
          userId: "current-user",
          userName: "Você",
          rating: data.rating,
          title: data.title,
          content: data.content,
          playtime: 0,
          helpful: 0,
          funny: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setData((prev) => [newReview, ...prev]);
        return newReview;
      }
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
      let result: NewsItem[];
      if (USE_MOCK) {
        const { mockNews } = await import("@/lib/mock-data");
        result = mockNews.slice(0, limit);
      } else {
        // Backend doesn't have news endpoint yet; use mock data
        const { mockNews } = await import("@/lib/mock-data");
        result = mockNews.slice(0, limit);
      }
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar notícias",
      );
      if (USE_MOCK) {
        const { mockNews } = await import("@/lib/mock-data");
        setData(mockNews.slice(0, limit));
      }
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return { data, loading, error, refetch: fetchNews };
}
