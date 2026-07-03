"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, Grid, List, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GameGrid } from "@/components/GameGrid";
import { Button } from "@/components/ui/Button";
import {
  mockCategories,
  getMockGamesByCategory,
  getMockCategory,
} from "@/lib/mock-data";
import { cn, formatNumber } from "@/lib/utils";
import type { Game, Category, GameFilters, PaginatedResponse } from "@/types";

const sortOptions = [
  { value: "popular", label: "Mais Populares" },
  { value: "newest", label: "Mais Recentes" },
  { value: "rating", label: "Melhor Avaliados" },
  { value: "price-asc", label: "Preço: Menor ao Maior" },
  { value: "price-desc", label: "Preço: Maior ao Menor" },
  { value: "discount", label: "Maior Desconto" },
];

const platforms = ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getMockCategory(slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: `${category.name} | Spark Chicken Games`,
    description: `Explore jogos da categoria ${category.name}. ${category.gameCount} jogos disponíveis.`,
    openGraph: {
      title: `${category.name} | Spark Chicken Games`,
      description: `Explore jogos da categoria ${category.name}`,
      type: "website",
    },
  };
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slug } = params;

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginatedResponse<Game>["meta"] | null>(
    null,
  );
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<GameFilters>({
    genre: [],
    platform: searchParams.getAll("platform"),
    sortBy: (searchParams.get("sort") as GameFilters["sortBy"]) || "popular",
    page: parseInt(searchParams.get("page") || "1"),
    limit: 20,
  });

  // Load categories and current category
  useEffect(() => {
    Promise.all([mockCategories, getMockCategory(slug)]).then(([cats, cat]) => {
      setCategories(cats);
      setCategory(cat || null);
      setCategoriesLoading(false);
    });
  }, [slug]);

  // Load games
  const loadGames = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getMockGamesByCategory(slug, filters);
      setGames(result.data);
      setMeta(result.meta);
    } catch (error) {
      console.error("Erro ao carregar jogos:", error);
    } finally {
      setLoading(false);
    }
  }, [slug, filters]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const updateFilters = useCallback(
    (newFilters: Partial<GameFilters>) => {
      const updated = { ...filters, ...newFilters, page: 1 };
      setFilters(updated);

      const params = new URLSearchParams();
      Object.entries(updated).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.set(key, String(value));
          }
        }
      });
      router.push(`/categories/${slug}?${params.toString()}`, {
        scroll: false,
      });
    },
    [filters, router, slug],
  );

  const clearFilters = useCallback(() => {
    const cleared: GameFilters = { sortBy: "popular", page: 1, limit: 20 };
    setFilters(cleared);
    router.push(`/categories/${slug}`, { scroll: false });
  }, [router, slug]);

  const hasActiveFilters =
    (filters.genre?.length ?? 0) > 0 ||
    (filters.platform?.length ?? 0) > 0 ||
    (filters.priceRange && filters.priceRange[1] < 500);

  if (!category) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center">
        <Header />
        <main className="pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-4 text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold font-mono text-cyber-neon neon-text-sm">
                Categoria não encontrada
              </h1>
              <p className="text-cyber-text-muted">
                A categoria solicitada não existe ou foi removida.
              </p>
              <Link href="/categories">
                <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Voltar às Categorias
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />

      <main id="main-content" className="pt-16 lg:pt-20">
        {/* Category Header */}
        <section className="relative py-12 lg:py-16">
          <div
            className="absolute inset-0 bg-grid-pattern opacity-30"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 text-cyber-text-muted hover:text-cyber-neon transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Todas as Categorias
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl" aria-hidden="true">
                  {category.icon}
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-cyber-neon neon-text-sm">
                  {category.name}
                </h1>
              </div>
              <p className="text-lg text-cyber-text-muted max-w-2xl">
                {category.description}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-cyber-text-muted">
                <span>{formatNumber(category.gameCount)} jogos</span>
                <span className="px-2 py-1 bg-cyber-dark-surface border border-cyber-dark-border rounded">
                  Ordenar por: {filters.sortBy}
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filters */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="sticky top-24 space-y-6">
                  <Button
                    variant="outline"
                    fullWidth
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                    leftIcon={<Filter className="w-4 h-4" />}
                  >
                    Filtros{" "}
                    {hasActiveFilters && (
                      <span className="ml-2 px-1.5 py-0.5 bg-cyber-neon text-cyber-dark text-xs rounded">
                        {(filters.genre?.length ?? 0) +
                          (filters.platform?.length ?? 0)}
                      </span>
                    )}
                  </Button>

                  <AnimatePresence>
                    {showFilters ||
                      (!showFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="hidden lg:block space-y-6"
                        >
                          {/* Categories */}
                          <div>
                            <h3 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded bg-cyber-neon/10 flex items-center justify-center text-cyber-neon text-sm">
                                🎮
                              </span>
                              Sub-gêneros
                            </h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {categories
                                .filter((c) => c.slug !== slug)
                                .map((cat) => (
                                  <label
                                    key={cat.id}
                                    className="flex items-center gap-2 cursor-pointer group"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        filters.genre?.includes(cat.name) ||
                                        false
                                      }
                                      onChange={(e) => {
                                        const current = filters.genre || [];
                                        if (e.target.checked) {
                                          updateFilters({
                                            genre: [...current, cat.name],
                                          });
                                        } else {
                                          updateFilters({
                                            genre: current.filter(
                                              (g) => g !== cat.name,
                                            ),
                                          });
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-cyber-dark-border bg-cyber-dark-surface text-cyber-neon focus:ring-cyber-neon focus:ring-2"
                                    />
                                    <span className="text-sm text-cyber-text group-hover:text-cyber-neon transition-colors">
                                      {cat.name}
                                    </span>
                                    <span className="ml-auto text-xs text-cyber-text-muted">
                                      {formatNumber(cat.gameCount)}
                                    </span>
                                  </label>
                                ))}
                            </div>
                          </div>

                          {/* Platforms */}
                          <div>
                            <h3 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded bg-cyber-neon/10 flex items-center justify-center text-cyber-neon text-sm">
                                🖥️
                              </span>
                              Plataformas
                            </h3>
                            <div className="space-y-2">
                              {platforms.map((platform) => (
                                <label
                                  key={platform}
                                  className="flex items-center gap-2 cursor-pointer group"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      filters.platform?.includes(platform) ||
                                      false
                                    }
                                    onChange={(e) => {
                                      const current = filters.platform || [];
                                      if (e.target.checked) {
                                        updateFilters({
                                          platform: [...current, platform],
                                        });
                                      } else {
                                        updateFilters({
                                          platform: current.filter(
                                            (p) => p !== platform,
                                          ),
                                        });
                                      }
                                    }}
                                    className="w-4 h-4 rounded border-cyber-dark-border bg-cyber-dark-surface text-cyber-neon focus:ring-cyber-neon focus:ring-2"
                                  />
                                  <span className="text-sm text-cyber-text group-hover:text-cyber-neon transition-colors">
                                    {platform}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Price Range */}
                          <div>
                            <h3 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded bg-cyber-neon/10 flex items-center justify-center text-cyber-neon text-sm">
                                💰
                              </span>
                              Preço
                            </h3>
                            <div className="space-y-2">
                              {[
                                { label: "Gratuito", range: [0, 0] },
                                { label: "Até R$ 50", range: [0, 50] },
                                { label: "R$ 50 - R$ 100", range: [50, 100] },
                                { label: "R$ 100 - R$ 200", range: [100, 200] },
                                { label: "Acima de R$ 200", range: [200, 500] },
                              ].map((option) => (
                                <label
                                  key={option.label}
                                  className="flex items-center gap-2 cursor-pointer group"
                                >
                                  <input
                                    type="radio"
                                    name="price"
                                    checked={
                                      filters.priceRange?.[0] ===
                                        option.range[0] &&
                                      filters.priceRange?.[1] ===
                                        option.range[1]
                                    }
                                    onChange={() =>
                                      updateFilters({
                                        priceRange: option.range,
                                      })
                                    }
                                    className="w-4 h-4 rounded border-cyber-dark-border bg-cyber-dark-surface text-cyber-neon focus:ring-cyber-neon focus:ring-2"
                                  />
                                  <span className="text-sm text-cyber-text group-hover:text-cyber-neon transition-colors">
                                    {option.label}
                                  </span>
                                </label>
                              ))}
                              <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                  type="radio"
                                  name="price"
                                  checked={
                                    !filters.priceRange ||
                                    (filters.priceRange[0] === 0 &&
                                      filters.priceRange[1] === 500)
                                  }
                                  onChange={() =>
                                    updateFilters({ priceRange: undefined })
                                  }
                                  className="w-4 h-4 rounded border-cyber-dark-border bg-cyber-dark-surface text-cyber-neon focus:ring-cyber-neon focus:ring-2"
                                />
                                <span className="text-sm text-cyber-text group-hover:text-cyber-neon transition-colors">
                                  Todos os preços
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* Sort */}
                          <div>
                            <h3 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                              <span className="w-6 h-6 rounded bg-cyber-neon/10 flex items-center justify-center text-cyber-neon text-sm">
                                ↕️
                              </span>
                              Ordenar
                            </h3>
                            <select
                              value={filters.sortBy || "popular"}
                              onChange={(e) =>
                                updateFilters({
                                  sortBy: e.target
                                    .value as GameFilters["sortBy"],
                                })
                              }
                              className="input-cyber w-full text-sm"
                            >
                              {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Clear Filters */}
                          {hasActiveFilters && (
                            <Button
                              variant="ghost"
                              fullWidth
                              onClick={clearFilters}
                              leftIcon={<X className="w-4 h-4" />}
                            >
                              Limpar Filtros
                            </Button>
                          )}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1 min-w-0">
                {/* Results Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-cyber-text-muted">
                      {meta
                        ? `Mostrando ${(meta.page - 1) * meta.limit + 1}–${Math.min(meta.page * meta.limit, meta.total)} de ${formatNumber(meta.total)} jogos`
                        : "Carregando..."}
                    </span>
                    {hasActiveFilters && (
                      <span className="px-2 py-1 bg-cyber-neon/10 text-cyber-neon text-xs rounded-full">
                        Filtros ativos
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                      <select
                        value={filters.sortBy || "popular"}
                        onChange={(e) =>
                          updateFilters({
                            sortBy: e.target.value as GameFilters["sortBy"],
                          })
                        }
                        className="input-cyber w-auto min-w-[180px] text-sm"
                      >
                        {sortOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-1 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg p-1">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={cn(
                          "p-2 rounded transition-colors",
                          viewMode === "grid"
                            ? "bg-cyber-neon text-cyber-dark"
                            : "text-cyber-text-muted hover:text-cyber-text",
                        )}
                        aria-label="Visualização em grade"
                        aria-pressed={viewMode === "grid"}
                      >
                        <Grid className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "p-2 rounded transition-colors",
                          viewMode === "list"
                            ? "bg-cyber-neon text-cyber-dark"
                            : "text-cyber-text-muted hover:text-cyber-text",
                        )}
                        aria-label="Visualização em lista"
                        aria-pressed={viewMode === "list"}
                      >
                        <List className="w-5 h-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Game Grid */}
                <GameGrid
                  games={games}
                  variant={viewMode === "list" ? "compact" : "default"}
                  isLoading={loading}
                  skeletonCount={8}
                  emptyMessage={`Nenhum jogo encontrado em ${category.name}`}
                />

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ page: meta.page - 1 })}
                      disabled={meta.page === 1}
                      leftIcon={<ChevronDown className="w-4 h-4 rotate-180" />}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, meta.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (meta.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (meta.page <= 3) {
                            pageNum = i + 1;
                          } else if (meta.page >= meta.totalPages - 2) {
                            pageNum = meta.totalPages - 4 + i;
                          } else {
                            pageNum = meta.page - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                meta.page === pageNum ? "primary" : "ghost"
                              }
                              size="sm"
                              onClick={() => updateFilters({ page: pageNum })}
                              className="w-10 h-10"
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateFilters({ page: meta.page + 1 })}
                      disabled={meta.page === meta.totalPages}
                      rightIcon={<ChevronDown className="w-4 h-4" />}
                    >
                      Próxima
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
