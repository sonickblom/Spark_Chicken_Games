"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUploadedGames } from "@/hooks/use-uploaded-games";

export default function EditGamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  const { games, loading } = useUploadedGames();

  useEffect(() => {
    if (!loading) {
      const game = games.find((g) => g.id === gameId);
      if (!game) {
        router.replace("/admin/games");
      } else {
        // Redirect to upload page with edit capability
        // Since uploaded games are simple HTML files, editing is done via re-upload
        router.replace("/admin/upload");
      }
    }
  }, [loading, games, gameId, router]);

  return (
    <div className="max-w-4xl mx-auto text-center py-20">
      <p className="text-gray-500">Redirecionando...</p>
    </div>
  );
}
