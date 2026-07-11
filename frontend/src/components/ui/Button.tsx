"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      leftIcon,
      rightIcon,
      fullWidth,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      "group inline-flex items-center justify-center gap-2 whitespace-nowrap",
      "rounded-full font-medium tracking-wide",
      "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
      "active:scale-[0.98]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]",
      "disabled:pointer-events-none disabled:opacity-40",
    );

    const variants = {
      default: cn(
        "bg-[#00FF41] text-black font-bold",
        "shadow-[0_0_20px_rgba(0,255,65,0.25)]",
        "hover:bg-[#00e63b] hover:shadow-[0_0_30px_rgba(0,255,65,0.45)]",
      ),
      destructive: cn(
        "bg-red-500 text-white",
        "shadow-[0_0_16px_rgba(239,68,68,0.2)]",
        "hover:bg-red-600 hover:shadow-[0_0_24px_rgba(239,68,68,0.4)]",
      ),
      outline: cn(
        "border border-neon-green/50 bg-transparent text-neon-green",
        "hover:bg-neon-green/[0.06] hover:border-neon-green hover:shadow-[0_0_20px_rgba(0,255,65,0.15)]",
      ),
      secondary: cn(
        "border border-neon-green/20 bg-white/[0.04] text-neon-green",
        "hover:bg-neon-green/[0.06] hover:border-neon-green/40 hover:shadow-[0_0_16px_rgba(0,255,65,0.1)]",
      ),
      ghost: cn(
        "bg-transparent text-cyber-text-muted",
        "hover:bg-neon-green/[0.06] hover:text-neon-green",
      ),
      link: cn(
        "bg-transparent text-neon-green p-0 h-auto",
        "underline-offset-4 hover:underline",
      ),
    };

    const sizes = {
      default: "h-10 px-6 py-2 text-sm",
      sm: "h-9 px-4 py-1.5 text-xs",
      lg: "h-12 px-8 py-2.5 text-sm",
      xl: "h-14 px-10 py-3 text-base",
      icon: "size-10 p-0",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className,
        )}
        ref={ref}
        {...props}
      >
        {leftIcon && (
          <span
            className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        {props.children}
        {rightIcon && (
          <span
            className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
