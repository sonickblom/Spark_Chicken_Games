"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { Game } from "@/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: Game[];
  onSelectSuggestion?: (game: Game) => void;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Buscar jogos, desenvolvedores, tags...",
  suggestions = [],
  onSelectSuggestion,
  className,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (suggestions.length > 0) setShowSuggestions(true);
  }, [suggestions.length]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 200);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch(value);
        setShowSuggestions(false);
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        inputRef.current?.blur();
      }
    },
    [onSearch, value],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(value);
      setShowSuggestions(false);
    },
    [onSearch, value],
  );

  const clearSearch = useCallback(() => {
    onChange("");
    onSearch("");
    inputRef.current?.focus();
  }, [onChange, onSearch]);

  return (
    <div ref={wrapperRef} className={cn("relative w-full max-w-xl", className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Double-bezel input wrapper */}
        <div
          className={cn(
            "bg-white/[0.02] ring-1 p-[1px] rounded-xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
            isFocused
              ? "ring-neon-green/40 shadow-[0_0_24px_rgba(0,255,65,0.1)]"
              : "ring-white/[0.06]",
          )}
        >
          <div className="relative bg-cyber-dark-surface rounded-[calc(0.75rem-1px)]">
            <label htmlFor="search" className="sr-only">
              Buscar jogos
            </label>
            <Input
              ref={inputRef}
              id="search"
              type="search"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                if (e.target.value.trim() && suggestions.length > 0) {
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              leftIcon={
                <Search
                  className={cn(
                    "w-5 h-5 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isFocused || value
                      ? "text-neon-green"
                      : "text-cyber-text-muted",
                  )}
                  aria-hidden="true"
                />
              }
              rightIcon={
                value ? (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-1 text-cyber-text-muted hover:text-neon-green transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-auto"
                    aria-label="Limpar busca"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                ) : (
                  <Filter
                    className="w-5 h-5 text-cyber-text-muted"
                    aria-hidden="true"
                  />
                )
              }
              className={cn(
                "bg-transparent border-0 focus:ring-0 focus:outline-none focus-visible:ring-0",
                isFocused && "shadow-none",
              )}
            />
          </div>
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="absolute top-full left-0 right-0 mt-2 backdrop-blur-xl bg-cyber-dark-surface/80 border border-neon-green/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(0,255,65,0.05)] overflow-hidden z-50"
              role="listbox"
            >
              <div className="px-4 py-2.5 border-b border-white/[0.05]">
                <p className="text-[10px] font-mono font-semibold text-neon-green uppercase tracking-widest">
                  Sugestões
                </p>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {suggestions.slice(0, 5).map((game) => (
                  <button
                    key={game.id}
                    type="button"
                    onClick={() => {
                      onSelectSuggestion?.(game);
                      onChange(game.title);
                      onSearch(game.title);
                      setShowSuggestions(false);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-neon-green/[0.04] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex items-center gap-3 group/item border-b border-white/[0.03] last:border-b-0"
                    role="option"
                    aria-selected={false}
                  >
                    <div className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-cyber-dark-surface ring-1 ring-white/[0.06]">
                      {game.thumbnail ? (
                        <Image
                          src={game.thumbnail}
                          alt=""
                          fill
                          className="object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-cyber-text-muted font-mono text-[8px]">
                          Sem imagem
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-sm text-white truncate group-hover/item:text-neon-green transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                        {game.title}
                      </p>
                      <p className="font-mono text-[11px] text-cyber-text-muted truncate">
                        {game.category?.name || "Sem Categoria"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 font-sans font-bold text-xs text-neon-green">
                      {game.isFree ? "Gratuito" : "Jogar"}
                    </div>
                  </button>
                ))}

                {suggestions.length > 5 && (
                  <button
                    type="button"
                    onClick={() => onSearch(value)}
                    className="w-full px-4 py-3 text-center font-mono text-xs text-neon-green hover:bg-neon-green/[0.04] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] border-t border-white/[0.05]"
                  >
                    Ver todos os {suggestions.length} resultados para{" "}
                    <span className="font-bold">{value}</span>
                    <ChevronDown
                      className="w-4 h-4 ml-1.5 inline"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
