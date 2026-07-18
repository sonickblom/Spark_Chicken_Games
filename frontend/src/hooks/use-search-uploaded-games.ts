"use client";

import { useState, useMemo, useEffect } from "react";
import { useUploadedGames } from "./use-uploaded-games";

export function useSearchUploadedGames(query: string, debounceMs = 300) {
  const { games, loading } = useUploadedGames();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return games.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q),
    );
  }, [games, debouncedQuery]);

  const suggestions = useMemo(() => results.slice(0, 5), [results]);

  return {
    results,
    suggestions,
    loading,
    total: results.length,
    allGames: games,
  };
}
