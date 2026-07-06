"use client";

import React from "react";
import { useParams, notFound } from "next/navigation";
import { GameForm } from "@/components/admin/GameForm";
import type { Game } from "@/types";

// ─── Mock data for editing ──────────────────────────────────────────────────

const mockGames: Partial<Game>[] = [
  {
    id: "1",
    title: "Cyber Quest",
    slug: "cyber-quest",
    shortDescription: "Aventura cyberpunk em mundo aberto",
    description:
      "Mergulhe em um futuro distópico onde a tecnologia reina. Cyber Quest é um jogo de aventura em mundo aberto com elementos RPG, onde suas escolhas moldam a narrativa. Explore uma cidade cyberpunk vibrante, complete missões, melhore seu personagem e desvende segredos sombrios.",
    coverImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400",
    thumbnail: "",
    bannerImage: "",
    iframeUrl: "https://example.com/cyber-quest",
    rating: 4.8,
    price: 29.90,
    discount: 20,
    isFree: false,
    isFeatured: true,
    isNewRelease: false,
    isPopular: true,
    isEarlyAccess: false,
    developer: "Spark Chicken Games",
    publisher: "Spark Chicken Games",
    website: "https://cyberquest.example.com",
    steamUrl: "https://store.steampowered.com/app/cyber-quest",
    epicUrl: "",
    gogUrl: "",
    genre: ["Ação", "Aventura", "RPG"],
    tags: ["cyberpunk", "mundo-aberto", "futurista", "single-player"],
    platforms: ["Web", "Windows", "Mac"],
    languages: ["Português", "Inglês", "Espanhol"],
    ageRating: "16+",
    releaseDate: "2025-06-15T10:00:00Z",
    screenshots: [
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
    ],
    createdAt: "2025-06-15T10:00:00Z",
    updatedAt: "2025-07-04T14:30:00Z",
  },
  {
    id: "2",
    title: "Space Warriors",
    slug: "space-warriors",
    shortDescription: "Batalhas espaciais multiplayer",
    description:
      "Prepare sua nave e entre em batalhas épicas no espaço! Space Warriors é um jogo multiplayer de combate espacial com gráficos impressionantes e jogabilidade viciante. Forme alianças, customize sua nave e domine a galáxia.",
    coverImage: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400",
    thumbnail: "",
    bannerImage: "",
    iframeUrl: "",
    rating: 4.6,
    price: 0,
    discount: 0,
    isFree: true,
    isFeatured: false,
    isNewRelease: false,
    isPopular: true,
    isEarlyAccess: false,
    developer: "StarForge Games",
    publisher: "StarForge Games",
    website: "",
    steamUrl: "",
    epicUrl: "",
    gogUrl: "",
    genre: ["Arcade", "Ação"],
    tags: ["multiplayer", "espaço", "naves"],
    platforms: ["Web"],
    languages: ["Português", "Inglês"],
    ageRating: "Livre",
    releaseDate: "2025-06-20T08:00:00Z",
    screenshots: [],
    createdAt: "2025-06-20T08:00:00Z",
    updatedAt: "2025-07-03T12:00:00Z",
  },
  {
    id: "3",
    title: "Pixel Racer",
    slug: "pixel-racer",
    shortDescription: "Corrida retrô pixel art",
    description:
      "Reviva a era de ouro dos jogos de corrida com Pixel Racer! Corra em pistas cheias de obstáculos, colete power-ups e compita contra o relógio. Com gráficos pixel art encantadores e trilha sonora chip-tune, este jogo é uma carta de amor aos clássicos.",
    coverImage: "https://images.unsplash.com/photo-1553481187-be93c21490a9?w=400",
    thumbnail: "",
    bannerImage: "",
    iframeUrl: "",
    rating: 4.7,
    price: 0,
    discount: 0,
    isFree: true,
    isFeatured: true,
    isNewRelease: true,
    isPopular: false,
    isEarlyAccess: false,
    developer: "PixelPushers Studio",
    publisher: "PixelPushers Studio",
    website: "",
    steamUrl: "",
    epicUrl: "",
    gogUrl: "",
    genre: ["Corrida", "Arcade"],
    tags: ["pixel-art", "retro", "corrida", "casual"],
    platforms: ["Web", "Windows"],
    languages: ["Português", "Inglês"],
    ageRating: "Livre",
    releaseDate: "2025-07-01T10:00:00Z",
    screenshots: [],
    createdAt: "2025-07-01T10:00:00Z",
    updatedAt: "2025-07-01T10:00:00Z",
  },
];

// ─── Page ───────────────────────────────────────────────────────────────────

export default function EditGamePage() {
  const params = useParams();
  const gameId = params.id as string;

  const game = mockGames.find((g) => g.id === gameId);

  if (!game) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Editar Jogo
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
            ID: {game.id}
          </span>
        </div>
        <p className="text-gray-400 mt-1">
          Editando: <strong className="text-white">{game.title}</strong>
        </p>
      </div>

      <GameForm initialData={game} isEditing />
    </div>
  );
}
