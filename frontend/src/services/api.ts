import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { Game, Category, PaginatedResponse, GameFilters, User, Review, NewsItem } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('auth_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Games
  async getGames(filters: GameFilters = {}): Promise<PaginatedResponse<Game>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      }
    });
    const response = await this.client.get<PaginatedResponse<Game>>(`/games?${params}`);
    return response.data;
  }

  async getGame(slug: string): Promise<Game> {
    const response = await this.client.get<Game>(`/games/${slug}`);
    return response.data;
  }

  async getFeaturedGames(limit = 6): Promise<Game[]> {
    const response = await this.client.get<Game[]>(`/games/featured?limit=${limit}`);
    return response.data;
  }

  async getPopularGames(limit = 10): Promise<Game[]> {
    const response = await this.client.get<Game[]>(`/games/popular?limit=${limit}`);
    return response.data;
  }

  async getNewReleases(limit = 10): Promise<Game[]> {
    const response = await this.client.get<Game[]>(`/games/new?limit=${limit}`);
    return response.data;
  }

  async getRelatedGames(gameId: string, limit = 6): Promise<Game[]> {
    const response = await this.client.get<Game[]>(`/games/${gameId}/related?limit=${limit}`);
    return response.data;
  }

  async searchGames(query: string, limit = 10): Promise<Game[]> {
    const response = await this.client.get<Game[]>(`/games/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.client.get<Category[]>('/categories');
    return response.data;
  }

  async getCategory(slug: string): Promise<Category> {
    const response = await this.client.get<Category>(`/categories/${slug}`);
    return response.data;
  }

  async getGamesByCategory(categorySlug: string, filters: GameFilters = {}): Promise<PaginatedResponse<Game>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      }
    });
    const response = await this.client.get<PaginatedResponse<Game>>(`/categories/${categorySlug}/games?${params}`);
    return response.data;
  }

  // User
  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/user/me');
    return response.data;
  }

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.client.post<{ user: User; token: string }>('/auth/login', { email, password });
    return response.data;
  }

  async register(data: { username: string; email: string; password: string }): Promise<{ user: User; token: string }> {
    const response = await this.client.post<{ user: User; token: string }>('/auth/register', data);
    return response.data;
  }

  async toggleFavorite(gameId: string): Promise<{ isFavorite: boolean }> {
    const response = await this.client.post<{ isFavorite: boolean }>(`/user/favorites/${gameId}/toggle`);
    return response.data;
  }

  async getFavorites(): Promise<Game[]> {
    const response = await this.client.get<Game[]>('/user/favorites');
    return response.data;
  }

  async getRecentlyPlayed(): Promise<Game[]> {
    const response = await this.client.get<Game[]>('/user/recently-played');
    return response.data;
  }

  async addToRecentlyPlayed(gameId: string): Promise<void> {
    await this.client.post(`/user/recently-played/${gameId}`);
  }

  // Reviews
  async getReviews(gameId: string): Promise<Review[]> {
    const response = await this.client.get<Review[]>(`/games/${gameId}/reviews`);
    return response.data;
  }

  async createReview(gameId: string, data: { rating: number; title: string; content: string }): Promise<Review> {
    const response = await this.client.post<Review>(`/games/${gameId}/reviews`, data);
    return response.data;
  }

  // News
  async getNews(limit = 10): Promise<NewsItem[]> {
    const response = await this.client.get<NewsItem[]>(`/news?limit=${limit}`);
    return response.data;
  }
}

export const api = new ApiClient();
