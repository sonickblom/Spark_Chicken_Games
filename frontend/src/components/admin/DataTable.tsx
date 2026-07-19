"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  hideOn?: "sm" | "md" | "lg";
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  emptyState?: React.ReactNode;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  keyExtractor: (item: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  search,
  pagination,
  emptyState,
  sortKey,
  sortDir,
  onSort,
  keyExtractor,
}: DataTableProps<T>) {
  return (
    <div className="space-y-4">
      {search && (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-muted"
          />
          <input
            type="text"
            value={search.value}
            onChange={(e) => search.onChange(e.target.value)}
            placeholder={search.placeholder || "Buscar..."}
            className="w-full pl-10 pr-4 py-2.5 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
          />
        </div>
      )}

      <div className="rounded-xl bg-cyber-dark-surface/30 border border-cyber-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-cyber-text-muted text-sm">Carregando...</p>
            </div>
          ) : data.length === 0 ? (
            emptyState || (
              <div className="text-center py-16 text-cyber-text-muted">
                Nenhum item encontrado
              </div>
            )
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-dark-border bg-cyber-dark-surface/50">
                  {columns.map((col) => {
                    const hideClass = col.hideOn === "sm" ? "hidden sm:table-cell"
                      : col.hideOn === "md" ? "hidden md:table-cell"
                      : col.hideOn === "lg" ? "hidden lg:table-cell"
                      : "";
                    return (
                      <th
                        key={col.key}
                        className={cn(
                          "text-left px-4 py-3 text-xs font-medium text-cyber-text-muted uppercase tracking-wider",
                          hideClass,
                          col.sortable && "cursor-pointer hover:text-neon-green select-none",
                        )}
                        onClick={() => col.sortable && onSort?.(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.header}
                          {col.sortable && sortKey === col.key && (
                            <span className="text-neon-green">
                              {sortDir === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="hover:bg-cyber-dark-surface/20 transition-colors"
                  >
                    {columns.map((col) => {
                      const hideClass = col.hideOn === "sm" ? "hidden sm:table-cell"
                        : col.hideOn === "md" ? "hidden md:table-cell"
                        : col.hideOn === "lg" ? "hidden lg:table-cell"
                        : "";
                      return (
                        <td key={col.key} className={cn("px-4 py-3", hideClass)}>
                          {col.render(item)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {pagination && !loading && data.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-cyber-text-muted">
            Mostrando {data.length} de {pagination.total}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg text-cyber-text-muted hover:text-white hover:bg-cyber-dark-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 text-sm text-cyber-text">
              {pagination.page} / {pagination.totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-2 rounded-lg text-cyber-text-muted hover:text-white hover:bg-cyber-dark-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
