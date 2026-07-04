import type { Game, Category, User, Review, NewsItem, GameFilters, PaginatedResponse } from '@/types';

export const mockCategories: Category[] = [
  {
    id: '1',
    slug: 'acao',
    name: 'Ação',
    description: 'Jogos de ação intensa e combate',
    icon: '🎮',
    gameCount: 156,
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'aventura',
    name: 'Aventura',
    description: 'Explore mundos e vivencie histórias épicas',
    icon: '🗺️',
    gameCount: 134,
    isFeatured: true,
  },
  {
    id: '3',
    slug: 'rpg',
    name: 'RPG',
    description: 'Desenvolva personagens e tome decisões impactantes',
    icon: '⚔️',
    gameCount: 98,
    isFeatured: true,
  },
  {
    id: '4',
    slug: 'estrategia',
    name: 'Estratégia',
    description: 'Planeje, construa e conquiste',
    icon: '🧠',
    gameCount: 87,
    isFeatured: true,
  },
  {
    id: '5',
    slug: 'simulacao',
    name: 'Simulação',
    description: 'Experiências realistas e gerenciamento',
    icon: '🏗️',
    gameCount: 76,
    isFeatured: false,
  },
  {
    id: '6',
    slug: 'puzzle',
    name: 'Puzzle',
    description: 'Desafie sua mente com enigmas',
    icon: '🧩',
    gameCount: 65,
    isFeatured: false,
  },
  {
    id: '7',
    slug: 'esportes',
    name: 'Esportes',
    description: 'Competição atlética virtual',
    icon: '⚽',
    gameCount: 43,
    isFeatured: false,
  },
  {
    id: '8',
    slug: 'corrida',
    name: 'Corrida',
    description: 'Velocidade e adrenalina nas pistas',
    icon: '🏎️',
    gameCount: 38,
    isFeatured: false,
  },
  {
    id: '9',
    slug: 'terror',
    name: 'Terror',
    description: 'Suspense e medo psicológico',
    icon: '👻',
    gameCount: 42,
    isFeatured: true,
  },
  {
    id: '10',
    slug: 'indie',
    name: 'Indie',
    description: 'Jogos independentes criativos',
    icon: '✨',
    gameCount: 234,
    isFeatured: true,
  },
];

const mockGamesData: Game[] = [
  {
    id: '1',
    slug: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    description: 'Cyberpunk 2077 é um RPG de mundo aberto de ação e aventura ambientado em Night City, uma megalópole obcecada por poder, glamour e modificações corporais. Você joga como V, um mercenário fora da lei atrás de um implante único que carrega a chave da imortalidade.',
    shortDescription: 'RPG de mundo aberto em Night City',
    coverImage: 'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    ],
    genre: ['RPG', 'Ação', 'Aventura', 'Ficção Científica'],
    tags: ['Mundo Aberto', 'FPS', 'História Rica', 'Cyberpunk', 'Single Player'],
    developer: 'CD PROJEKT RED',
    publisher: 'CD PROJEKT RED',
    releaseDate: '2020-12-10',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    rating: 4.2,
    reviewCount: 45623,
    price: 199.90,
    originalPrice: 299.90,
    discount: 33,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: true,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-3570K or AMD FX-8310',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 780 3GB or AMD Radeon RX 470',
        storage: '70 GB SSD',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-4790 or AMD Ryzen 3 3200G',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 6GB or AMD Radeon R9 Fury',
        storage: '70 GB SSD',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Polonês', 'Russo', 'Chinês', 'Japonês', 'Coreano'],
    ageRating: '18+',
    website: 'https://www.cyberpunk.net',
    steamUrl: 'https://store.steampowered.com/app/1091500/Cyberpunk_2077/',
    epicUrl: 'https://www.epicgames.com/store/en-US/p/cyberpunk-2077',
    gogUrl: 'https://www.gog.com/game/cyberpunk_2077',
    createdAt: '2020-12-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    slug: 'elden-ring',
    title: 'ELDEN RING',
    description: 'O novo RPG de ação de fantasia. Erga-se, Maculado, e seja guiado pela graça para brandir o poder do Elden Ring e tornar-se um Lorde Elden nas Terras Intermédias.',
    shortDescription: 'RPG de ação de mundo aberto da FromSoftware',
    coverImage: 'https://images.unsplash.com/photo-1612931675003-1f1e0b7b5e0e?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1612931675003-1f1e0b7b5e0e?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1612931675003-1f1e0b7b5e0e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1585314062696-3155f1c7c7d2?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
    ],
    genre: ['RPG', 'Ação', 'Aventura', 'Fantasia'],
    tags: ['Mundo Aberto', 'Soulslike', 'Difícil', 'Exploração', 'Multiplayer'],
    developer: 'FromSoftware',
    publisher: 'Bandai Namco Entertainment',
    releaseDate: '2022-02-25',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    rating: 4.8,
    reviewCount: 125432,
    price: 249.90,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: true,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5-8400 or AMD Ryzen 3 3300X',
        memory: '12 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1060 3GB or AMD Radeon RX 580 4GB',
        storage: '60 GB SSD',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i7-8700K or AMD Ryzen 5 3600X',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1070 8GB or AMD Radeon RX VEGA 56 8GB',
        storage: '60 GB SSD',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Russo', 'Chinês', 'Japonês', 'Coreano'],
    ageRating: '16+',
    website: 'https://en.bandainamcoent.eu/elden-ring/elden-ring',
    steamUrl: 'https://store.steampowered.com/app/1245620/ELDEN_RING/',
    createdAt: '2022-02-25T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '3',
    slug: 'baldurs-gate-3',
    title: 'Baldur\'s Gate 3',
    description: 'Reúna seu grupo e retorne aos Reinos Esquecidos em uma história de comunhão e traição, sacrifício e sobrevivência, poder absoluto e tentação.',
    shortDescription: 'RPG tático baseado em D&D 5e',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    ],
    genre: ['RPG', 'Estratégia', 'Aventura'],
    tags: ['Baseado em Turnos', 'D&D', 'História Rica', 'Coop', 'Escolhas Importam'],
    developer: 'Larian Studios',
    publisher: 'Larian Studios',
    releaseDate: '2023-08-03',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    rating: 4.9,
    reviewCount: 89234,
    price: 299.90,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: true,
    isNewRelease: true,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel i5-4690 / AMD FX 4350',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GTX 780 / AMD Radeon R9 280X',
        storage: '150 GB SSD',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel i7-8700K / AMD Ryzen 5 3600',
        memory: '16 GB RAM',
        graphics: 'NVIDIA GTX 1070 / AMD RX 5700',
        storage: '150 GB SSD',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Polonês', 'Russo', 'Chinês'],
    ageRating: '18+',
    website: 'https://baldursgate3.game',
    steamUrl: 'https://store.steampowered.com/app/1086940/Baldurs_Gate_3/',
    createdAt: '2023-08-03T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
  {
    id: '4',
    slug: 'hades',
    title: 'Hades',
    description: 'Desafie o deus dos mortos enquanto você luta para sair do Submundo no estilo do rogue-like dungeon crawler da Supergiant Games.',
    shortDescription: 'Rogue-like de ação aclamado pela crítica',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b257767e?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b257767e?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1550745165-9bc0b257767e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    ],
    genre: ['Ação', 'Roguelike', 'Indie'],
    tags: ['Roguelike', 'Ação Rápida', 'História', 'Rejogabilidade', 'Indie'],
    developer: 'Supergiant Games',
    publisher: 'Supergiant Games',
    releaseDate: '2020-09-17',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    rating: 4.7,
    reviewCount: 67234,
    price: 119.90,
    originalPrice: 119.90,
    discount: 0,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: true,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 7 SP1 64-bit',
        processor: 'Dual Core 2.4 GHz',
        memory: '4 GB RAM',
        graphics: 'NVIDIA GeForce GTX 950 or AMD Radeon R7 350',
        storage: '15 GB',
      },
      recommended: {
        os: 'Windows 10 64-bit',
        processor: 'Dual Core 3.0 GHz',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GTX 1050 or AMD Radeon RX 560',
        storage: '15 GB',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Russo', 'Chinês', 'Japonês', 'Coreano'],
    ageRating: '12+',
    website: 'https://www.supergiantgames.com/games/hades/',
    steamUrl: 'https://store.steampowered.com/app/1145360/Hades/',
    epicUrl: 'https://www.epicgames.com/store/en-US/p/hades',
    createdAt: '2020-09-17T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '5',
    slug: 'stardew-valley',
    title: 'Stardew Valley',
    description: 'Você herdou a antiga fazenda do seu avô em Stardew Valley. Arme-se com ferramentas de segunda mão e algumas moedas, e comece sua nova vida.',
    shortDescription: 'Simulador de fazenda relaxante',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=1920&h=1080&fit=crop',
    ],
    genre: ['Simulação', 'RPG', 'Indie'],
    tags: ['Relaxante', 'Fazenda', 'Multiplayer', 'Crafting', 'Casamento'],
    developer: 'ConcernedApe',
    publisher: 'ConcernedApe',
    releaseDate: '2016-02-26',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    rating: 4.8,
    reviewCount: 234567,
    price: 49.90,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: false,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 7 64-bit',
        processor: '2 GHz',
        memory: '2 GB RAM',
        graphics: '256 MB VRAM',
        storage: '1 GB',
      },
      recommended: {
        os: 'Windows 10 64-bit',
        processor: '2 GHz',
        memory: '4 GB RAM',
        graphics: '512 MB VRAM',
        storage: '1 GB',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Russo', 'Chinês', 'Japonês', 'Coreano', 'Turco'],
    ageRating: 'Livre',
    website: 'https://www.stardewvalley.net',
    steamUrl: 'https://store.steampowered.com/app/413150/Stardew_Valley/',
    gogUrl: 'https://www.gog.com/game/stardew_valley',
    createdAt: '2016-02-26T00:00:00Z',
    updatedAt: '2024-01-30T00:00:00Z',
  },
  {
    id: '6',
    slug: 'valorant',
    title: 'VALORANT',
    description: 'VALORANT é um FPS tático de 5v5 baseado em personagens, onde agentes com habilidades únicas criam oportunidades para a sua equipe plantar a spike e vencer.',
    shortDescription: 'FPS tático competitivo gratuito',
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=1920&h=1080&fit=crop',
    ],
    genre: ['Ação', 'FPS', 'Esports'],
    tags: ['Gratuito', 'Competitivo', 'Tático', '5v5', 'Agentes'],
    developer: 'Riot Games',
    publisher: 'Riot Games',
    releaseDate: '2020-06-02',
    platforms: ['PC'],
    rating: 4.1,
    reviewCount: 345678,
    price: 0,
    isFree: true,
    isEarlyAccess: false,
    isFeatured: true,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 7/8/10 64-bit',
        processor: 'Intel Core 2 Duo E8400',
        memory: '4 GB RAM',
        graphics: 'Intel HD 4000',
        storage: '20 GB',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel i3-4150',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce GT 730',
        storage: '20 GB',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Russo', 'Chinês', 'Japonês', 'Coreano', 'Polonês', 'Turco'],
    ageRating: '12+',
    website: 'https://playvalorant.com',
    createdAt: '2020-06-02T00:00:00Z',
    updatedAt: '2024-01-28T00:00:00Z',
  },
  {
    id: '7',
    slug: 'minecraft',
    title: 'Minecraft',
    description: 'Explore mundos infinitos e construa de tudo, desde a mais simples das casas até o mais grandioso dos castelos. Jogue no modo criativo com recursos ilimitados ou minere fundo no modo sobrevivência.',
    shortDescription: 'Sandbox criativo mais vendido do mundo',
    coverImage: 'https://images.unsplash.com/photo-1617703249748-8d3e8a6c4b3e?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1617703249748-8d3e8a6c4b3e?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1617703249748-8d3e8a6c4b3e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    ],
    genre: ['Sandbox', 'Aventura', 'Simulação'],
    tags: ['Criativo', 'Sobrevivência', 'Multiplayer', 'Mods', 'Cross-platform'],
    developer: 'Mojang Studios',
    publisher: 'Xbox Game Studios',
    releaseDate: '2011-11-18',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    rating: 4.7,
    reviewCount: 1234567,
    price: 179.90,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: false,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i3-3210 / AMD A8-7600',
        memory: '4 GB RAM',
        graphics: 'Intel HD Graphics 4000 / AMD Radeon R5',
        storage: '1 GB',
      },
      recommended: {
        os: 'Windows 10/11 64-bit',
        processor: 'Intel Core i5-4690 / AMD A10-7800',
        memory: '8 GB RAM',
        graphics: 'NVIDIA GeForce 700 Series / AMD Radeon Rx 200 Series',
        storage: '4 GB SSD',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Italiano', 'Russo', 'Chinês', 'Japonês', 'Coreano'],
    ageRating: 'Livre',
    website: 'https://www.minecraft.net',
    createdAt: '2011-11-18T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '8',
    slug: 'hollow-knight',
    title: 'Hollow Knight',
    description: 'Forje seu caminho em Hallownest! Explore cavernas sinuosas, lute contra criaturas corrompidas e descubra segredos antigos neste clássico metroidvania 2D desenhado à mão.',
    shortDescription: 'Metroidvania atmosférico desenhado à mão',
    coverImage: 'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=600&h=900&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=1920&h=600&fit=crop',
    screenshots: [
      'https://images.unsplash.com/photo-1593642702821-cf226023e3e9?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop',
    ],
    genre: ['Aventura', 'Metroidvania', 'Indie', 'Plataforma'],
    tags: ['Metroidvania', 'Desenhado à Mão', 'Atmosférico', 'Difícil', 'Exploração'],
    developer: 'Team Cherry',
    publisher: 'Team Cherry',
    releaseDate: '2017-02-24',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    rating: 4.8,
    reviewCount: 156789,
    price: 59.90,
    isFree: false,
    isEarlyAccess: false,
    isFeatured: true,
    isNewRelease: false,
    isPopular: true,
    systemRequirements: {
      minimum: {
        os: 'Windows 7 64-bit',
        processor: 'Intel Core 2 Duo E5200',
        memory: '4 GB RAM',
        graphics: 'GeForce 9800GTX+',
        storage: '9 GB',
      },
      recommended: {
        os: 'Windows 10 64-bit',
        processor: 'Intel Core i5',
        memory: '8 GB RAM',
        graphics: 'GeForce GTX 560',
        storage: '9 GB',
      },
    },
    languages: ['Português', 'Inglês', 'Espanhol', 'Francês', 'Alemão', 'Russo', 'Chinês', 'Japonês', 'Coreano'],
    ageRating: '10+',
    website: 'https://teamcherry.com.au/hollowknight',
    steamUrl: 'https://store.steampowered.com/app/367520/Hollow_Knight/',
    gogUrl: 'https://www.gog.com/game/hollow_knight',
    createdAt: '2017-02-24T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

export const mockGames: Game[] = mockGamesData;

export const mockFeaturedGames: Game[] = mockGamesData.filter(g => g.isFeatured).slice(0, 6);
export const mockPopularGames: Game[] = mockGamesData.filter(g => g.isPopular).slice(0, 10);
export const mockNewReleases: Game[] = mockGamesData.filter(g => g.isNewRelease).slice(0, 10);

export const mockUser: User = {
  id: 'user-1',
  username: 'CyberGamer2077',
  email: 'cyber@gamer.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CyberGamer2077',
  bio: 'Amante de RPGs e jogos indie. Sempre em busca da próxima grande aventura.',
  favorites: ['1', '2', '4', '8'],
  history: [],
  recentlyPlayed: [
    { gameId: '1', lastPlayed: '2024-01-28T20:30:00Z', duration: 156 },
    { gameId: '2', lastPlayed: '2024-01-27T18:45:00Z', duration: 89 },
    { gameId: '4', lastPlayed: '2024-01-26T22:15:00Z', duration: 234 },
  ],
  playtime: { '1': 156, '2': 89, '4': 234 },
  achievements: [
    { id: 'ach-1', gameId: '1', name: 'Lenda de Night City', description: 'Complete a história principal', icon: '🏆', unlockedAt: '2024-01-15T00:00:00Z', isSecret: false },
    { id: 'ach-2', gameId: '2', name: 'Lorde Elden', description: 'Torne-se o Lorde Elden', icon: '👑', unlockedAt: '2024-02-20T00:00:00Z', isSecret: true },
  ],
  createdAt: '2023-06-15T00:00:00Z',
};

export const mockReviews: Review[] = [
  {
    id: 'rev-1',
    gameId: '1',
    userId: 'user-2',
    userName: 'NightRunner',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NightRunner',
    rating: 5,
    title: 'Uma obra-prima cyberpunk',
    content: 'Depois de todas as atualizações, Cyberpunk 2077 finalmente entrega a experiência que prometiam. A história é envolvente, os personagens são memoráveis e Night City é viva como nunca.',
    playtime: 120,
    helpful: 234,
    funny: 12,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'rev-2',
    gameId: '1',
    userId: 'user-3',
    userName: 'TechNomad',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechNomad',
    rating: 4,
    title: 'Ótimo, mas exige hardware potente',
    content: 'O jogo é incrível visualmente, mas prepare seu bolso para o hardware. Com uma RTX 3070 roda liso no ultra. História fantástica, side quests melhores que a main quest.',
    playtime: 85,
    helpful: 189,
    funny: 8,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
];

export const mockNews: NewsItem[] = [
  {
    id: 'news-1',
    slug: 'elden-ring-shadow-of-the-erdtree-announced',
    title: 'ELDEN RING: Shadow of the Erdtree Anunciado',
    excerpt: 'A expansão tão aguardada finalmente tem data de lançamento e novo trailer.',
    content: 'A FromSoftware e a Bandai Namco anunciaram oficialmente Shadow of the Erdtree, a grande expansão de ELDEN RING...',
    imageUrl: 'https://images.unsplash.com/photo-1612931675003-1f1e0b7b5e0e?w=1200&h=600&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1612931675003-1f1e0b7b5e0e?w=1200&h=600&fit=crop',
    author: 'Equipe Spark Chicken Games',
    publishedAt: '2024-01-25T00:00:00Z',
    tags: ['ELDEN RING', 'DLC', 'FromSoftware', 'RPG'],
  },
  {
    id: 'news-2',
    slug: 'baldurs-gate-3-patch-5-chega-com-novas-funcionalidades',
    title: 'Baldur\'s Gate 3 Patch 5 Chega com Novas Funcionalidades',
    excerpt: 'Modo honra, novas subclasses e melhorias de performance.',
    content: 'A Larian Studios lançou o Patch 5 para Baldur\'s Gate 3, trazendo o modo Honra, 12 novas subclasses...',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=600&fit=crop',
    author: 'Equipe Spark Chicken Games',
    publishedAt: '2024-01-22T00:00:00Z',
    tags: ['Baldur\'s Gate 3', 'Atualização', 'Larian Studios', 'RPG'],
  },
  {
    id: 'news-3',
    slug: 'steam-deck-oled-disponivel-no-brasil',
    title: 'Steam Deck OLED Disponível no Brasil',
    excerpt: 'A nova versão do handheld da Valve chega com tela OLED e melhor bateria.',
    content: 'A Valve anunciou que o Steam Deck OLED está oficialmente disponível para compra no Brasil...',
    imageUrl: 'https://images.unsplash.com/photo-1617703249748-8d3e8a6c4b3e?w=1200&h=600&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1617703249748-8d3e8a6c4b3e?w=1200&h=600&fit=crop',
    author: 'Equipe Spark Chicken Games',
    publishedAt: '2024-01-20T00:00:00Z',
    tags: ['Steam Deck', 'Hardware', 'Valve', 'Portátil'],
  },
];

export async function getMockGames(filters: GameFilters = {}): Promise<PaginatedResponse<Game>> {
  let filtered = [...mockGamesData];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(g =>
      g.title.toLowerCase().includes(search) ||
      g.description.toLowerCase().includes(search) ||
      (g.genre ?? []).some(gen => gen.toLowerCase().includes(search)) ||
      (g.tags ?? []).some(tag => tag.toLowerCase().includes(search))
    );
  }

  if (filters.genre && filters.genre.length > 0) {
    filtered = filtered.filter(g =>
      filters.genre!.some(gen => (g.genre ?? []).includes(gen))
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(g =>
      filters.tags!.some(tag => (g.tags ?? []).includes(tag))
    );
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(g => (g.price ?? 0) >= min && (g.price ?? 0) <= max);
  }

  if (filters.rating) {
    filtered = filtered.filter(g => g.rating >= filters.rating!);
  }

  switch (filters.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.releaseDate ?? 0).getTime() - new Date(a.releaseDate ?? 0).getTime());
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'price-asc':
      filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      break;
    case 'price-desc':
      filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    case 'discount':
      filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      break;
    case 'popular':
    default:
      filtered.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
      break;
  }

  const page = filters.page || 1;
  const limit = filters.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    page: page,
    pageSize: limit,
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

export async function getMockGame(slug: string): Promise<Game | null> {
  return mockGamesData.find(g => g.slug === slug) || null;
}

export async function getMockRelatedGames(gameId: string, limit = 6): Promise<Game[]> {
  const game = mockGamesData.find(g => g.id === gameId);
  if (!game) return [];

  return mockGamesData
    .filter(g => g.id !== gameId && (g.genre ?? []).some(gen => (game.genre ?? []).includes(gen)))
    .slice(0, limit);
}

export async function getMockCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function getMockCategory(slug: string): Promise<Category | null> {
  return mockCategories.find(c => c.slug === slug) || null;
}

export async function getMockGamesByCategory(categorySlug: string, filters: GameFilters = {}): Promise<PaginatedResponse<Game>> {
  const category = mockCategories.find(c => c.slug === categorySlug);
  if (!category) {
    return { data: [], page: 1, pageSize: 12, total: 0, totalPages: 0 };
  }

  return getMockGames({ ...filters, genre: [category.name] });
}
