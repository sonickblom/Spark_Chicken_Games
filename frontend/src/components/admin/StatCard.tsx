"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sparklineData?: number[];
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  sparklineData,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-5 hover:border-neon-green/30 transition-all duration-300 group",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-neon-green/10 text-neon-green shrink-0">
          {icon}
        </div>
        {sparklineData && <Sparkline data={sparklineData} />}
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs text-cyber-text-muted mt-0.5">{title}</p>
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              trend.isPositive ? "text-neon-green" : "text-red-400",
            )}
          >
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-cyber-text-muted">vs mês anterior</span>
        </div>
      )}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-neon-green/5 rounded-full blur-2xl group-hover:bg-neon-green/10 transition-all duration-500" />
    </div>
  );
}
