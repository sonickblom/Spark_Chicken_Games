"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import AdminGuard from "@/components/admin/AdminGuard";
import {
  LayoutDashboard,
  Gamepad2,
  Upload,
  Tags,
  Users,
  ArrowLeft,
  Menu,
  X,
  Layers,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { href: "/admin/games", label: "Jogos", icon: <Gamepad2 size={20} /> },
  { href: "/admin/upload", label: "Upload", icon: <Upload size={20} /> },
  { href: "/admin/categories", label: "Categorias", icon: <Tags size={20} /> },
  { href: "/admin/users", label: "Usuários", icon: <Users size={20} /> },
];

function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1.5 text-sm text-cyber-text-muted">
      <Link href="/admin" className="hover:text-cyber-text transition-colors">
        Admin
      </Link>
      {segments.slice(1).map((segment, index) => {
        const href = "/" + segments.slice(0, index + 2).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === segments.length - 2;
        return (
          <React.Fragment key={href}>
            <span className="text-cyber-text-muted/40">/</span>
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-cyber-text transition-colors">
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

function ServerStatus() {
  const [status] = useState<"online" | "offline">("online");
  return (
    <div className="flex items-center gap-2 text-xs text-cyber-text-muted">
      <span
        className={cn(
          "w-2 h-2 rounded-full animate-pulse",
          status === "online" ? "bg-neon-green" : "bg-red-500",
        )}
      />
      <span className="hidden sm:inline">
        {status === "online" ? "Online" : "Offline"}
      </span>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-cyber-darker">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={cn(
            "fixed top-0 left-0 z-50 h-full w-64 bg-cyber-dark-surface/80 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:translate-x-0 lg:static lg:z-auto",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Layers size={22} className="text-neon-green" />
                <div className="absolute inset-0 bg-neon-green/20 blur-sm group-hover:blur-md transition-all" />
              </div>
              <span className="font-[family-name:var(--font-orbitron)] text-sm font-bold tracking-wider text-white">
                ADMIN
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-cyber-text-muted hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-xs uppercase tracking-wider transition-all duration-200 group"
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-neon-green rounded-full shadow-[0_0_6px_rgba(0,255,65,0.6)]" />
                  )}
                  <span
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-neon-green"
                        : "text-cyber-text-muted group-hover:text-white",
                    )}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-neon-green font-semibold"
                        : "text-cyber-text-muted group-hover:text-white",
                    )}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_6px_rgba(0,255,65,0.6)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-white/[0.06]">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono text-xs uppercase tracking-wider text-cyber-text-muted hover:text-white hover:bg-cyber-dark-surface/50 transition-all duration-200"
            >
              <ArrowLeft size={16} />
              Voltar ao Site
            </Link>
          </div>
        </aside>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 bg-cyber-darker/80 backdrop-blur-md border-b border-white/[0.06]">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-cyber-text-muted hover:text-white transition-colors"
              >
                <Menu size={20} />
              </button>

              <div className="hidden lg:flex items-center flex-1">
                <Breadcrumbs />
              </div>

              <div className="flex items-center gap-3 ml-auto lg:ml-0">
                <ServerStatus />
                <Link
                  href="/admin/upload"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neon-green text-black text-xs font-bold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_12px_rgba(0,255,65,0.25)] transition-all duration-300"
                >
                  <Upload size={14} />
                  Upload Rápido
                </Link>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
