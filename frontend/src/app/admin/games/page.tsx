"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatNumber, formatSize } from "@/lib/utils";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import { DataTable, Column } from "@/components/admin/DataTable";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { UploadedGameData } from "@/hooks/use-uploaded-games";
import { Play, Trash2, Upload, Gamepad2 } from "lucide-react";

export default function AdminGames() {
  const { games, loading, deleteGame } = useUploadedGames();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<UploadedGameData | null>(null);

  const perPage = 10;

  const filteredGames = useMemo(() => {
    let result = [...games];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.title?.toLowerCase().includes(q) ||
          g.slug?.toLowerCase().includes(q) ||
          g.description?.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortKey) {
        case "title":
          aVal = a.title || "";
          bVal = b.title || "";
          break;
        case "slug":
          aVal = a.slug || "";
          bVal = b.slug || "";
          break;
        case "category":
          aVal = a.category || "";
          bVal = b.category || "";
          break;
        case "playCount":
          aVal = a.playCount || 0;
          bVal = b.playCount || 0;
          break;
        case "createdAt":
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
      }
      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return result;
  }, [searchQuery, games, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredGames.length / perPage));
  const paginatedGames = filteredGames.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGame(deleteTarget.slug);
    } catch {
      // error handled by hook
    }
    setDeleteTarget(null);
  };

  const columns: Column<UploadedGameData>[] = [
    {
      key: "title",
      header: "Título",
      sortable: true,
      render: (game) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyber-dark-surface flex items-center justify-center shrink-0">
            <Gamepad2 size={16} className="text-cyber-text-muted/70" />
          </div>
          <div>
            <Link
              href={`/play/${game.slug}`}
              className="text-sm font-medium text-white hover:text-neon-green transition-colors block"
            >
              {game.title}
            </Link>
            <p className="text-xs text-cyber-text-muted font-mono">/{game.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      hideOn: "md",
      sortable: true,
      render: (game) => (
        <span className="text-xs font-mono text-cyber-text-muted">/{game.slug}</span>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      sortable: true,
      hideOn: "md",
      render: (game) =>
        game.category ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neon-green/10 text-neon-green border border-neon-green/20">
            {game.category}
          </span>
        ) : (
          <span className="text-cyber-text-muted text-xs">—</span>
        ),
    },
    {
      key: "playCount",
      header: "Jogadas",
      sortable: true,
      hideOn: "lg",
      render: (game) => (
        <span className="text-sm font-mono text-cyber-text">
          {game.playCount > 0 ? formatNumber(game.playCount) : "—"}
        </span>
      ),
    },
    {
      key: "size",
      header: "Tamanho",
      hideOn: "lg",
      render: (game) => (
        <span className="text-sm text-cyber-text-muted">{formatSize(game.size)}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Criado em",
      sortable: true,
      hideOn: "lg",
      render: (game) => (
        <span className="text-sm text-cyber-text-muted">
          {new Date(game.createdAt).toLocaleDateString("pt-BR")}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Ações",
      render: (game) => (
        <div className="flex items-center justify-end gap-1">
          <a
            href={`/play/${game.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-cyber-text-muted hover:text-neon-green hover:bg-cyber-dark-surface transition-all"
            title="Jogar"
          >
            <Play size={14} />
          </a>
          <button
            onClick={() => setDeleteTarget(game)}
            className="p-2 rounded-lg text-cyber-text-muted hover:text-red-400 hover:bg-cyber-dark-surface transition-all"
            title="Excluir"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Jogos</h1>
          <p className="text-cyber-text-muted mt-1">
            {games.length} jogo{games.length !== 1 ? "s" : ""} na plataforma
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
        >
          <Upload size={16} />
          Novo Upload
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={paginatedGames}
        loading={loading}
        search={{
          value: searchQuery,
          onChange: (v) => {
            setSearchQuery(v);
            setPage(1);
          },
          placeholder: "Buscar jogos por título, slug...",
        }}
        pagination={{
          page,
          totalPages,
          total: filteredGames.length,
          onPageChange: setPage,
        }}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={handleSort}
        keyExtractor={(g) => g.id}
        emptyState={
          <div className="text-center py-16">
            <Gamepad2 size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-cyber-text-muted text-lg font-medium">
              {games.length === 0
                ? "Nenhum jogo publicado ainda"
                : "Nenhum jogo encontrado"}
            </p>
            <p className="text-cyber-text-muted/70 text-sm mt-1">
              {games.length === 0
                ? "Faça upload do primeiro jogo"
                : "Tente alterar os filtros"}
            </p>
            {games.length === 0 && (
              <Link
                href="/admin/upload"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 transition-all"
              >
                <Upload size={16} />
                Fazer Upload
              </Link>
            )}
          </div>
        }
      />

      <ConfirmModal
        open={!!deleteTarget}
        title="Excluir Jogo"
        message={`Tem certeza que deseja excluir "${deleteTarget?.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
