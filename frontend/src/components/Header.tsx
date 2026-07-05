"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-data";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Latency Zero - Home"
            >
              <svg
                className="h-8 w-8 text-neon-green"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="font-bold text-xl text-white">Latency Zero</span>
            </Link>

            <nav
              className="hidden md:flex items-center gap-6"
              aria-label="Navegação principal"
            >
              <Link
                href="/games"
                className="text-gray-300 hover:text-neon-green transition-colors font-medium"
              >
                Jogos
              </Link>
              <Link
                href="/categories"
                className="text-gray-300 hover:text-neon-green transition-colors font-medium"
              >
                Categorias
              </Link>
              <Link
                href="/search"
                className="text-gray-300 hover:text-neon-green transition-colors font-medium"
              >
                Buscar
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white hover:text-neon-green transition-colors rounded-lg hover:bg-gray-800"
                >
                  <div className="w-7 h-7 rounded-full bg-neon-green/20 flex items-center justify-center">
                    <span className="text-neon-green font-bold text-xs">
                      {user.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <span className="hidden sm:block">{user.username}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <hr className="my-1 border-gray-700" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-white hover:text-neon-green transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-neon-green text-black rounded-lg hover:bg-neon-green/80 transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
