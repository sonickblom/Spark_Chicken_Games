"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BarChartProps {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
}

export function BarChart({ data, height = 180, className }: BarChartProps) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value)) || 1;
  const barWidth = Math.max(20, Math.min(40, 320 / data.length));

  return (
    <div className={cn("flex items-end gap-2", className)} style={{ height }}>
      {data.map((item, i) => {
        const barHeight = (item.value / maxValue) * (height - 24);
        return (
          <div
            key={i}
            className="flex flex-col items-center flex-1 group relative"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-cyber-dark-surface border border-white/[0.06] rounded px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {item.value}
            </div>
            <div
              className="w-full rounded-t-sm bg-neon-green/30 hover:bg-neon-green/50 transition-colors cursor-pointer"
              style={{ height: barHeight, maxWidth: barWidth }}
            />
            <span className="text-[10px] text-cyber-text-muted mt-1 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
