"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PieChartProps {
  data: { label: string; value: number; color?: string }[];
  size?: number;
  className?: string;
}

const COLORS = [
  "rgba(0, 255, 65, 0.9)",
  "rgba(0, 255, 65, 0.7)",
  "rgba(0, 255, 65, 0.5)",
  "rgba(0, 255, 65, 0.35)",
  "rgba(0, 255, 65, 0.25)",
  "rgba(0, 255, 65, 0.15)",
];

export function PieChart({ data, size = 160, className }: PieChartProps) {

  if (data.length === 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size / 2 - 4;
  const center = size / 2;

  let cumAngle = -90;
  const slices = data.map((item, i) => {
    const angle = (item.value / total) * 360;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      path: `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: item.color || COLORS[i % COLORS.length],
      label: item.label,
      value: item.value,
    };
  });

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {slices.map((slice, i) => (
          <g key={i} className="group cursor-pointer">
            <path
              d={slice.path}
              fill={slice.color}
              stroke="#030305"
              strokeWidth="1"
              className="transition-all duration-200 group-hover:opacity-80"
            />
          </g>
        ))}
      </svg>
      <div className="space-y-1.5">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color || COLORS[i % COLORS.length] }}
            />
            <span className="text-cyber-text-muted">{item.label}</span>
            <span className="text-white font-medium ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
