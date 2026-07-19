"use client";

import React, { useId } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({ data, width = 80, height = 32, className }: SparklineProps) {
  const id = useId();

  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      <polyline
        points={points.join(" ")}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-neon-green"
      />
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff41" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#00ff41" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points.join(" ")} ${width},${height}`}
        fill={`url(#spark-${id})`}
      />
    </svg>
  );
}
