export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  coverImage: string;
  category: Category;
  tags: string[];
  rating: number;
  playCount: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  iframeUrl: string;
  width: number;
  height: number;
  isFeatured: boolean;
  isNew: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  gameCount: number;
  color: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  favorites: string[];
  history: GameHistoryItem[];
  createdAt: string;
}

export interface GameHistoryItem {
  gameId: string;
  gameTitle: string;
  gameThumbnail: string;
  playedAt: string;
  duration: number;
}

export interface SearchResult {
  games: Game[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GameFilters {
  category?: string;
  tag?: string;
  genre?: string[];
  platform?: string[];
  sortBy?: "popularity" | "rating" | "newest" | "oldest" | "alphabetical";
  search?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  priceRange?: [number, number];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export interface GameEmbedProps {
  game: Game;
  width?: number;
  height?: number;
  allowFullscreen?: boolean;
}

export interface SkeletonProps {
  className?: string;
  animation?: "pulse" | "wave";
}
