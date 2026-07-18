"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchUploadedGames } from "@/hooks/use-search-uploaded-games";

export function HeaderSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { suggestions } = useSearchUploadedGames(query);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsOpen(false);
        setShowDropdown(false);
      }
    },
    [query, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSubmit();
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setShowDropdown(false);
        inputRef.current?.blur();
      }
    },
    [handleSubmit],
  );

  const open = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setShowDropdown(false);
    setQuery("");
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div
        className={cn(
          "flex items-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isOpen
            ? "w-56 bg-cyber-dark-surface/90 border border-white/[0.08] rounded-full px-3 py-1.5"
            : "w-auto",
        )}
      >
        {isOpen ? (
          <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
            <Search className="w-4 h-4 text-neon-green flex-shrink-0" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim()) {
                  setShowDropdown(true);
                } else {
                  setShowDropdown(false);
                }
              }}
              onFocus={() => {
                if (query.trim()) setShowDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar jogos..."
              className="flex-1 bg-transparent border-0 outline-none focus:outline-none focus-visible:outline-none focus:ring-0 text-white text-xs font-mono placeholder:text-cyber-text-muted/50 min-w-0"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={close}
              className="p-0.5 text-cyber-text-muted hover:text-white transition-colors flex-shrink-0"
              aria-label="Fechar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <button
            onClick={open}
            className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-medium tracking-widest uppercase text-cyber-text-muted hover:text-neon-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            aria-label="Abrir busca"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Buscar</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="absolute top-full right-0 mt-2 w-72 backdrop-blur-xl bg-cyber-dark-surface/90 border border-neon-green/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-white/[0.05]">
              <p className="text-[10px] font-mono font-semibold text-neon-green uppercase tracking-widest">
                Sugestões
              </p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {suggestions.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(game.title)}`);
                    close();
                  }}
                  className="w-full px-3 py-2.5 text-left hover:bg-neon-green/[0.04] transition-colors flex items-center gap-3 border-b border-white/[0.03] last:border-b-0"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyber-dark-surface flex items-center justify-center text-sm flex-shrink-0 border border-white/[0.06]">
                    🎮
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-bold text-sm text-white truncate">
                      {game.title}
                    </p>
                    <p className="font-mono text-[10px] text-cyber-text-muted truncate">
                      {game.description.slice(0, 60)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
