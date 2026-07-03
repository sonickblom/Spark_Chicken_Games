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
        <div className="relative">
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
                  "w-5 h-5 transition-colors",
                  isFocused || value
                    ? "text-cyber-neon"
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
                  className="p-1 text-cyber-text-muted hover:text-cyber-neon transition-colors"
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
              "input-cyber",
              isFocused && "border-cyber-neon shadow-neon-sm",
            )}
          />
        </div>

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark-card border border-cyber-dark-border rounded-xl shadow-lg overflow-hidden z-50"
              role="listbox"
            >
              <div className="p-2 border-b border-cyber-dark-border">
                <p className="text-xs font-semibold text-cyber-neon uppercase tracking-wider">
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
                    className="w-full px-4 py-3 text-left hover:bg-cyber-dark-surface transition-colors flex items-center gap-3 group"
                    role="option"
                    aria-selected={false}
                  >
                    <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                      <Image
                        src={game.thumbnail}
                        alt=""
                        fill
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-cyber-text truncate group-hover:text-cyber-neon transition-colors">
                        {game.title}
                      </p>
                      <p className="text-xs text-cyber-text-muted truncate">
                        {game.category.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-cyber-neon font-semibold">
                      {game.isFree ? "Gratuito" : "Jogar"}
                    </div>
                  </button>
                ))}
                {suggestions.length > 5 && (
                  <button
                    type="button"
                    onClick={() => onSearch(value)}
                    className="w-full px-4 py-3 text-center text-cyber-neon hover:bg-cyber-dark-surface transition-colors border-t border-cyber-dark-border"
                  >
                    Ver todos os {suggestions.length} resultados para {value}
                    <ChevronDown
                      className="w-4 h-4 ml-2 inline"
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
