"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6 hover:border-neon-green/30 transition-all duration-300 group",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-cyber-text-muted">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
          {description && (
            <p className="text-xs text-cyber-text-muted">{description}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 mt-2">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend.isPositive
                    ? "text-neon-green bg-neon-green/10"
                    : "text-red-400 bg-red-400/10",
                )}
              >
                <svg
                  className={cn(
                    "w-3 h-3",
                    trend.isPositive ? "" : "rotate-180",
                  )}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-cyber-text-muted">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg bg-neon-green/5 text-neon-green group-hover:bg-neon-green/10 transition-colors">
          {icon}
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl group-hover:bg-neon-green/10 transition-all duration-500" />
    </div>
  );
}
