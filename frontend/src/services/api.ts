import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";
import type {
  Game,
  Category,
  User,
  SearchResult,
  GameFilters,
  PaginatedResponse,
  Review,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://spark-chicken-gamesbackend-production.up.railway.app/api/v1";

/**
 * Backend response wrapper shape:
 * {
 *   success: boolean,
 *   data: ...,
 *   meta?: { page, page_size, total_items, total_pages },
 *   error?: { code, message, details },
 *   timestamp: string,
 *   request_id: string
 * }
 */
interface ApiResponseWrapper<T> {
  success: boolean;
  data: T;
  meta?: BackendMeta;
  error?: { code: string; message: string; details?: unknown };
}

interface BackendMeta {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Convert snake_case string to camelCase */
function toCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/** Deeply convert object keys from snake_case to camelCase */
function camelize<T>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T;
  if (Array.isArray(obj)) return obj.map(camelize) as unknown as T;
  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[toCamel(key)] = camelize(value);
    }
    return result as T;
  }
  return obj as T;
}

/** Normalize a backend Game/User/etc object or array to camelCase frontend types */
function transform<T>(raw: unknown): T {
  return camelize<T>(raw);
}

/** Unwrap the backend response wrapper and return `response.data.data` */
function unwrap<T>(res: AxiosResponse<ApiResponseWrapper<T>>): T {
  if (!res.data.success) {
    const err = res.data.error;
    throw new Error(err?.message || "Unknown API error");
  }
  return res.data.data;
}

/** Unwrap and transform (camelCase) the response data */
function unwrapAndTransform<T>(
  res: AxiosResponse<ApiResponseWrapper<unknown>>,
): T {
  return transform<T>(unwrap(res as AxiosResponse<ApiResponseWrapper<T>>));
}

/** Extract single paginated entity from a `{ entity: ... }` wrapper */
function extractEntity<T>(
  res: AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
  key: string,
): T {
  const data = unwrap(
    res as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
  );
  return transform<T>(data[key]);
}

/** Extract array of entities from a `{ entities: [...] }` wrapper */
function extractList<T>(
  res: AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
  key: string,
): T[] {
  const data = unwrap(
    res as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
  );
  return transform<T[]>((data[key] as unknown[]) || []);
}

/** Convert backend paginated response to frontend PaginatedResponse format */
function toPaginated<T>(
  res: AxiosResponse<ApiResponseWrapper<T[]>>,
): PaginatedResponse<T> {
  const data = unwrap<T[]>(res as AxiosResponse<ApiResponseWrapper<T[]>>);
  const meta = (res.data as ApiResponseWrapper<T[]>).meta || {
    page: 1,
    page_size: data.length,
    total_items: data.length,
    total_pages: 1,
  };

  return {
    data: transform<T[]>(data) as T[],
    items: transform<T[]>(data) as T[],
    page: meta.page,
    pageSize: meta.page_size,
    total: meta.total_items,
    totalPages: meta.total_pages,
  };
}

// ─── API Service ─────────────────────────────────────────────────────────────

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: { "Content-Type": "application/json" },
    });

    this.client.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  // ── Games ─────────────────────────────────────────────────────────────

  async getGames(filters?: GameFilters): Promise<PaginatedResponse<Game>> {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.pageSize)
        params.append("page_size", String(filters.pageSize));
      if (filters.sortBy) params.append("sort_by", filters.sortBy);
      if (filters.category) params.append("category_id", filters.category);
    }
    const res = await this.client.get(`/games?${params.toString()}`);
    return toPaginated<Game>(res);
  }

  async getGame(idOrSlug: string): Promise<Game> {
    // Try slug first, fall back to ID
    try {
      const res = await this.client.get(`/games/slug/${idOrSlug}`);
      return extractEntity<Game>(res, "game");
    } catch {
      const res = await this.client.get(`/games/${idOrSlug}`);
      return extractEntity<Game>(res, "game");
    }
  }

  async getFeaturedGames(limit = 10): Promise<Game[]> {
    const res = await this.client.get(`/games/featured?limit=${limit}`);
    return extractList<Game>(res, "games");
  }

  async getNewReleases(limit = 10): Promise<Game[]> {
    const res = await this.client.get(`/games/new?limit=${limit}`);
    return extractList<Game>(res, "games");
  }

  async getPopularGames(limit = 10): Promise<Game[]> {
    const res = await this.client.get(`/games/popular?limit=${limit}`);
    return extractList<Game>(res, "games");
  }

  async getRelatedGames(gameId: string, limit = 6): Promise<Game[]> {
    const res = await this.client.get(
      `/games/${gameId}/recommendations/similar?limit=${limit}`,
    );
    return extractList<Game>(res, "similar");
  }

  async searchGames(
    query: string,
    page = 1,
    limit = 20,
  ): Promise<SearchResult> {
    const res = await this.client.get(
      `/games?search=${encodeURIComponent(query)}&page=${page}&page_size=${limit}`,
    );
    const paginated = toPaginated<Game>(res);
    return {
      games: paginated.data,
      total: paginated.total,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
    };
  }

  // ── Categories ────────────────────────────────────────────────────────

  async getCategories(): Promise<Category[]> {
    const res = await this.client.get("/categories");
    return unwrapAndTransform<Category[]>(res);
  }

  async getCategory(slug: string): Promise<Category> {
    const res = await this.client.get(`/categories/slug/${slug}`);
    return extractEntity<Category>(res, "category");
  }

  async getGamesByCategory(
    categorySlug: string,
    filters?: GameFilters,
  ): Promise<PaginatedResponse<Game>> {
    // First get the category to find its ID
    const cat = await this.getCategory(categorySlug);
    const params = new URLSearchParams();
    if (filters) {
      if (filters.page) params.append("page", String(filters.page));
      if (filters.pageSize)
        params.append("page_size", String(filters.pageSize));
      if (filters.sortBy) params.append("sort_by", filters.sortBy);
    }
    params.append("category_id", cat.id);
    const res = await this.client.get(`/games?${params.toString()}`);
    return toPaginated<Game>(res);
  }

  // ── Auth ──────────────────────────────────────────────────────────────

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const res = await this.client.post("/auth/login", { email, password });
    const data = unwrap(
      res as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
    ) as Record<string, unknown>;
    const user = transform<User>(data.user as Record<string, unknown>);
    const tokens = data.tokens as Record<string, unknown>;
    const token = (tokens?.access_token as string) || "";
    return { user, token };
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    // Backend requires 'name' field, so reuse username as name
    const res = await this.client.post("/auth/register", {
      name: data.username,
      ...data,
    });
    const responseData = unwrap(
      res as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
    ) as Record<string, unknown>;
    const user = transform<User>(responseData.user as Record<string, unknown>);
    const tokens = responseData.tokens as Record<string, unknown>;
    const token = (tokens?.access_token as string) || "";
    return { user, token };
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      if (refreshToken) {
        await this.client.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch {
      // ignore logout errors
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  }

  async getCurrentUser(): Promise<User> {
    const res = await this.client.get("/auth/me");
    return extractEntity<User>(res, "user");
  }

  async updateProfile(data: { username?: string; bio?: string; avatar_url?: string }): Promise<User> {
    const res = await this.client.patch("/users/me", data);
    return extractEntity<User>(res, "user");
  }

  // ── Favorites ─────────────────────────────────────────────────────────

  async getFavorites(): Promise<Game[]> {
    const res = await this.client.get("/favorites");
    return unwrapAndTransform<Game[]>(res);
  }

  async addToFavorites(gameId: string): Promise<void> {
    await this.client.post("/favorites", { game_id: gameId });
  }

  async removeFromFavorites(gameId: string): Promise<void> {
    await this.client.delete(`/favorites/${gameId}`);
  }

  async toggleFavorite(gameId: string): Promise<{ isFavorite: boolean }> {
    // Check current state
    try {
      const checkRes = await this.client.get(`/favorites/check/${gameId}`);
      const checkData = unwrap(
        checkRes as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
      ) as Record<string, unknown>;
      const isCurrentlyFavorite = checkData.is_favorite as boolean;
      if (isCurrentlyFavorite) {
        await this.removeFromFavorites(gameId);
        return { isFavorite: false };
      } else {
        await this.addToFavorites(gameId);
        return { isFavorite: true };
      }
    } catch {
      // fallback: try to add, if fails try remove
      try {
        await this.addToFavorites(gameId);
        return { isFavorite: true };
      } catch {
        await this.removeFromFavorites(gameId);
        return { isFavorite: false };
      }
    }
  }

  // ── History ───────────────────────────────────────────────────────────

  async getHistory(): Promise<
    {
      gameId: string;
      gameTitle: string;
      gameThumbnail: string;
      playedAt: string;
      duration: number;
    }[]
  > {
    const res = await this.client.get("/history");
    const rawList = unwrapAndTransform<Record<string, unknown>[]>(res);
    return rawList.map((entry) => {
      const game = entry.game as Record<string, unknown> | undefined;
      return {
        gameId: ((entry.gameId as string) ||
          (game?.id as string) ||
          "") as string,
        gameTitle: ((game?.title as string) || "") as string,
        gameThumbnail: ((game?.thumbnailUrl as string) || "") as string,
        playedAt: (entry.playedAt as string) || "",
        duration: (entry.durationSeconds as number) || 0,
      };
    });
  }

  async addToHistory(gameId: string): Promise<void> {
    await this.client.post("/history", {
      game_id: gameId,
      duration_seconds: 0,
    });
  }

  async addToRecentlyPlayed(gameId: string): Promise<void> {
    // Use history as the recent record
    await this.addToHistory(gameId);
  }

  async getRecentlyPlayed(): Promise<Game[]> {
    // Get recent history and fetch the actual games
    const res = await this.client.get("/history");
    const rawList = unwrapAndTransform<Record<string, unknown>[]>(res);
    const gameIds = rawList
      .slice(0, 10)
      .map(
        (entry) =>
          (entry.gameId ||
            (entry.game as Record<string, unknown>)?.id) as string,
      )
      .filter(Boolean);

    const results = await Promise.allSettled(
      gameIds.slice(0, 5).map((id) => this.getGame(id)),
    );
    return results
      .filter((r) => r.status === "fulfilled")
      .map((r) => (r as PromiseFulfilledResult<Game>).value);
  }

  // ── Reviews ───────────────────────────────────────────────────────────

  async getReviews(gameId: string): Promise<Review[]> {
    const res = await this.client.get(`/games/${gameId}/reviews`);
    return unwrapAndTransform<Review[]>(res);
  }

  async createReview(
    gameId: string,
    data: { rating: number; title: string; content: string },
  ): Promise<Review> {
    // Backend only accepts rating and comment, so combine title + content
    const res = await this.client.post(`/games/${gameId}/reviews`, {
      rating: data.rating,
      comment: `${data.title}\n\n${data.content}`,
    });
    return extractEntity<Review>(res, "review");
  }

  // ── User Management (Admin) ──────────────────────────────────────────

  async listUsers(
    page = 1,
    pageSize = 50,
  ): Promise<{ users: User[]; total: number }> {
    const res = await this.client.get(
      `/admin/users?page=${page}&page_size=${pageSize}`,
    );
    const data = unwrap(
      res as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
    ) as Record<string, unknown>;
    const users = transform<User[]>(
      (data.users as Record<string, unknown>[]) || [],
    );
    const pagination = data.pagination as Record<string, unknown>;
    return {
      users,
      total: (pagination?.total_items as number) || users.length,
    };
  }

  async updateUserRole(userId: string, roleId: string): Promise<void> {
    await this.client.patch(`/admin/users/${userId}/role`, {
      role_id: roleId,
    });
  }

  // ── News ──────────────────────────────────────────────────────────────

  async getNews(_limit = 10): Promise<unknown[]> {
    void _limit;
    // Backend doesn't have a news endpoint yet; return empty array
    return [];
  }

  // ── Roles ────────────────────────────────────────────────────────────

  async getRoles(): Promise<{ id: string; name: string }[]> {
    const res = await this.client.get("/roles");
    const data = unwrap(
      res as AxiosResponse<ApiResponseWrapper<Record<string, unknown>>>,
    ) as Record<string, unknown>;
    return (data.roles as { id: string; name: string }[]) || [];
  }
}

export const api = new ApiService();
