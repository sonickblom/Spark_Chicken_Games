import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
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
          </div>
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
