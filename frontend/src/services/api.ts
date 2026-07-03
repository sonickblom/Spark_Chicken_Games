import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  Game,
  Category,
  User,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
  GameFilters,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("authToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      },
    );
  }

  async getGames(filters?: GameFilters): Promise<PaginatedResponse<Game>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.category) params.append("category", filters.category);
      if (filters.tag) params.append("tag", filters.tag);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.search) params.append("search", filters.search);
      if (filters.page) params.append("page", String(filters.page));
      if (filters.pageSize) params.append("pageSize", String(filters.pageSize));
    }

    const response = await this.client.get<PaginatedResponse<Game>>(
      `/games?${params.toString()}`,
    );
    return response.data;
  }

  async getGameBySlug(slug: string): Promise<Game> {
    const response = await this.client.get<Game>(`/games/${slug}`);
    return response.data;
  }

  async getFeaturedGames(): Promise<Game[]> {
    const response = await this.client.get<Game[]>("/games/featured");
    return response.data;
  }

  async getNewGames(limit = 10): Promise<Game[]> {
    const response = await this.client.get<Game[]>(`/games/new?limit=${limit}`);
    return response.data;
  }

  async getPopularGames(limit = 10): Promise<Game[]> {
    const response = await this.client.get<Game[]>(
      `/games/popular?limit=${limit}`,
    );
    return response.data;
  }

  async getCategories(): Promise<Category[]> {
    const response = await this.client.get<Category[]>("/categories");
    return response.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await this.client.get<Category>(`/categories/${slug}`);
    return response.data;
  }

  async searchGames(
    query: string,
    page = 1,
    limit = 20,
  ): Promise<SearchResult> {
    const response = await this.client.get<SearchResult>(
      `/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );
    return response.data;
  }

  async getRelatedGames(gameId: string, limit = 6): Promise<Game[]> {
    const response = await this.client.get<Game[]>(
      `/games/${gameId}/related?limit=${limit}`,
    );
    return response.data;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const response = await this.client.post<{ user: User; token: string }>(
      "/auth/login",
      { email, password },
    );
    return response.data;
  }

  async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    const response = await this.client.post<{ user: User; token: string }>(
      "/auth/register",
      { username, email, password },
    );
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>("/auth/me");
    return response.data;
  }

  async getFavorites(): Promise<Game[]> {
    const response = await this.client.get<Game[]>("/user/favorites");
    return response.data;
  }

  async addToFavorites(gameId: string): Promise<void> {
    await this.client.post(`/user/favorites/${gameId}`);
  }

  async removeFromFavorites(gameId: string): Promise<void> {
    await this.client.delete(`/user/favorites/${gameId}`);
  }

  async getHistory(): Promise<GameHistoryItem[]> {
    const response = await this.client.get<GameHistoryItem[]>("/user/history");
    return response.data;
  }

  async addToHistory(gameId: string): Promise<void> {
    await this.client.post(`/user/history/${gameId}`);
  }
}

export const apiService = new ApiService();

export type {
  Game,
  Category,
  User,
  SearchResult,
  ApiResponse,
  PaginatedResponse,
  GameFilters,
};
