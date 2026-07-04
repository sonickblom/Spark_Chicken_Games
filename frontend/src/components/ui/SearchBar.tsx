import React from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Buscar jogos...",
  className = "",
}: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <label htmlFor="search" className="sr-only">
        Buscar jogos
      </label>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          id="search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-lg",
            "bg-gray-900 border border-gray-700 text-white",
            "placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent",
            "transition-all duration-200",
          )}
          autoComplete="off"
        />
      </div>
    </form>
  );
};

SearchBar.displayName = "SearchBar";

export default SearchBar;
