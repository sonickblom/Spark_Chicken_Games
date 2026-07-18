"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { ChevronDown, LogOut, User, Shield } from "lucide-react";
import { HeaderSearchBar } from "@/components/HeaderSearchBar";

interface HeaderProps {
  className?: string;
}

const navLinks = [
  { label: "Jogos", href: "/games" },
  { label: "Categorias", href: "/categories" },
] as const;

const Header = ({ className = "" }: HeaderProps) => {
  const { user, isAuthenticated, logout } = useAuthContext();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl",
          className,
        )}
      >
        {/* ── Fluid Island pill ── */}
        <nav
          aria-label="Navegação principal"
          className={cn(
            "relative mx-auto w-full rounded-full",
            "bg-cyber-dark-surface/80 backdrop-blur-xl",
            "border border-white/[0.06]",
            "shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_1px_rgba(0,255,65,0.08)]",
          )}
        >
          {/* Scanline overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-full"
          >
            <div className="absolute inset-0 animate-scanline bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,65,0.015)_2px,rgba(0,255,65,0.015)_4px)]" />
          </div>

          <div className="relative z-20 flex items-center justify-between px-5 py-3">
            {/* ── Logo ── */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label="Latency Zero - Home"
            >
              <div className="relative">
                <svg
                  className="h-7 w-7 text-neon-green drop-shadow-[0_0_6px_rgba(0,255,65,0.5)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:drop-shadow-[0_0_12px_rgba(0,255,65,0.8)]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="font-sans text-base font-bold tracking-wider text-white transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-neon-green">
                LATENCY ZERO
              </span>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "relative px-3.5 py-1.5 font-mono text-xs font-medium tracking-widest uppercase",
                      "text-cyber-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      "hover:text-neon-green",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-darker rounded",
                    )}
                  >
                    <span className="relative z-10">{link.label}</span>
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-px scale-x-0 bg-neon-green shadow-[0_0_8px_rgba(0,255,65,0.6)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100 hover:scale-x-100" />
                  </Link>
                );
              })}
            </div>

            {/* ── Desktop search ── */}
            <div className="hidden md:block">
              <HeaderSearchBar />
            </div>

            {/* ── Desktop auth section ── */}
            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated && user ? (
                <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                className={cn(
                  "flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5",
                  "font-mono text-xs tracking-wide text-cyber-text",
                  "border border-white/[0.06] bg-white/[0.03]",
                  "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  "hover:border-neon-green/30 hover:text-neon-green",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-darker",
                )}
              >
                    <div className="flex size-6 items-center justify-center rounded-full bg-neon-green/15">
                      <span className="text-[10px] font-bold text-neon-green">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <span className="max-w-[5rem] truncate">
                      {user.username}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-3 transition-transform duration-300",
                        dropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {dropdownOpen && (
                    <div
                      className={cn(
                        "absolute right-0 mt-3 w-52 origin-top-right",
                        "rounded-2xl border border-white/[0.08] bg-cyber-dark-surface/95 backdrop-blur-xl",
                        "shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_1px_rgba(0,255,65,0.1)]",
                        "py-2",
                      )}
                    >
                      <Link
                        href="/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 font-mono text-xs text-cyber-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.04] hover:text-neon-green"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User className="size-3.5" />
                        Meu Perfil
                      </Link>
                      <Link
                        href="/profile/edit"
                        className="flex items-center gap-2.5 px-4 py-2.5 font-mono text-xs text-cyber-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/[0.04] hover:text-neon-green"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Editar Perfil
                      </Link>
                      {user.username === "Samuteg" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 font-mono text-xs text-neon-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-neon-green/[0.06]"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield className="size-3.5" />
                          Admin
                        </Link>
                      )}
                      <div className="mx-4 my-1 h-px bg-white/[0.06]" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 font-mono text-xs text-red-400 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-500/[0.06]"
                      >
                        <LogOut className="size-3.5" />
                        Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={cn(
                      "rounded-full px-4 py-2 font-mono text-xs font-medium tracking-wider uppercase",
                      "text-cyber-text-muted transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      "hover:text-neon-green",
                    )}
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className={cn(
                      "rounded-full px-5 py-2 font-mono text-xs font-bold tracking-wider uppercase",
                      "bg-neon-green text-black",
                      "shadow-[0_0_20px_rgba(0,255,65,0.3)]",
                      "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      "hover:bg-neon-green-dim hover:shadow-[0_0_30px_rgba(0,255,65,0.5)]",
                      "active:scale-[0.98]",
                    )}
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="relative z-50 flex size-9 items-center justify-center rounded-full md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-darker"
            >
              <div className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "block h-px w-5 bg-neon-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    mobileOpen && "translate-y-[3.5px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-5 bg-neon-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    mobileOpen && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-5 bg-neon-green transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    mobileOpen && "-translate-y-[3.5px] -rotate-45",
                  )}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile full-screen overlay ── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          "bg-cyber-dark/95 backdrop-blur-2xl",
          "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={!mobileOpen}
      >
        <div className="flex h-full flex-col items-center justify-center gap-2">
          {/* Mobile nav links with staggered reveal */}
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "font-mono text-2xl font-bold tracking-[0.2em] uppercase text-cyber-text-muted",
                  "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  "hover:text-neon-green",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green rounded",
                  mobileOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: mobileOpen ? `${150 + i * 80}ms` : "0ms" }}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Divider */}
          <div
            className={cn(
              "my-4 h-px w-24 bg-gradient-to-r from-transparent via-neon-green/40 to-transparent",
              "transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
              mobileOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
            )}
            style={{ transitionDelay: mobileOpen ? "350ms" : "0ms" }}
          />

          {/* Mobile auth buttons */}
          {isAuthenticated && user ? (
            <div
              className={cn(
                "flex flex-col items-center gap-4",
                "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                mobileOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: mobileOpen ? "420ms" : "0ms" }}
            >
              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm text-cyber-text-muted transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-neon-green"
              >
                Perfil
              </Link>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  logout();
                }}
                className="rounded-full bg-red-500/10 px-6 py-2.5 font-mono text-sm font-medium text-red-400 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-red-500/20"
              >
                Sair
              </button>
            </div>
          ) : (
            <div
              className={cn(
                "flex flex-col items-center gap-4",
                "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                mobileOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0",
              )}
              style={{ transitionDelay: mobileOpen ? "420ms" : "0ms" }}
            >
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="font-mono text-sm text-cyber-text-muted transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:text-neon-green"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-full px-8 py-3 font-mono text-sm font-bold tracking-wider uppercase",
                  "bg-neon-green text-black",
                  "shadow-[0_0_30px_rgba(0,255,65,0.3)]",
                  "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  "hover:shadow-[0_0_40px_rgba(0,255,65,0.5)]",
                  "active:scale-[0.98]",
                )}
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Header.displayName = "Header";

export default Header;
