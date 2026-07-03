export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  bannerImage?: string;
  screenshots: string[];
  trailerUrl?: string;
  genre: string[];
  tags: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  platforms: string[];
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  isFree: boolean;
  isEarlyAccess: boolean;
  isFeatured: boolean;
  isNewRelease: boolean;
  isPopular: boolean;
  systemRequirements?: SystemRequirements;
  languages: string[];
  ageRating: string;
  website?: string;
  steamUrl?: string;
  epicUrl?: string;
  gogUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SystemRequirements {
  minimum: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  recommended: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  image?: string;
  gameCount: number;
  isFeatured: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GameFilters {
  search?: string;
  genre?: string[];
  tags?: string[];
  platform?: string[];
  priceRange?: [number, number];
  rating?: number;
  sortBy?: 'popular' | 'newest' | 'rating' | 'price-asc' | 'price-desc' | 'discount';
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  favorites: string[];
  recentlyPlayed: RecentlyPlayedGame[];
  playtime: Record<string, number>;
  achievements: UserAchievement[];
  createdAt: string;
}

export interface RecentlyPlayedGame {
  gameId: string;
  lastPlayed: string;
  playtime: number;
}

export interface UserAchievement {
  id: string;
  gameId: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  isSecret: boolean;
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
  coverImage: string;
  author: string;
  publishedAt: string;
  tags: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
