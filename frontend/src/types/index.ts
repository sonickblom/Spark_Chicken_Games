export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail?: string;
  coverImage: string;
  bannerImage?: string;
  category?: Category;
  genre?: string[];
  tags?: string[];
  rating: number;
  reviewCount?: number;
  playCount?: number;
  releaseDate?: string;
  developer?: string;
  publisher?: string;
  iframeUrl?: string;
  width?: number;
  height?: number;
  price?: number;
  originalPrice?: number;
  discount?: number;
  isFree?: boolean;
  isEarlyAccess?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isNewRelease?: boolean;
  isPopular?: boolean;
  platforms?: string[];
  ageRating?: string;
  languages?: string[];
  website?: string;
  steamUrl?: string;
  epicUrl?: string;
  gogUrl?: string;
  screenshots?: string[];
  systemRequirements?: {
    minimum: Record<string, string>;
    recommended: Record<string, string>;
  };
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
  color?: string;
  isFeatured?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
  bio?: string;
  roleId?: string;
  roleName?: string;
  isActive?: boolean;
  favorites: string[];
  history: GameHistoryItem[];
  achievements?: Achievement[];
  recentlyPlayed: {
    gameId: string;
    lastPlayed: string;
    duration: number;
  }[];
  playtime?: Record<string, number>;
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
  tags?: string[];
  genre?: string[];
  platform?: string[];
  sortBy?:
    | "popularity"
    | "rating"
    | "newest"
    | "oldest"
    | "alphabetical"
    | "price-asc"
    | "price-desc"
    | "discount"
    | "popular";
  search?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
  priceRange?: [number, number];
  rating?: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  items?: T[]; // Keep items optional just in case to avoid breaking other files temporarily
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

export interface Achievement {
  id: string;
  gameId?: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isSecret?: boolean;
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  playtime: number;
  helpful: number;
  funny: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  coverImage?: string;
  tags?: string[];
  author: string;
  publishedAt: string;
  gameId?: string;
}
