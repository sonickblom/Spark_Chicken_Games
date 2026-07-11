"use client";

import React, { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  variant?: "default" | "glass" | "elevated";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = "default",
      hover = false,
      padding = "md",
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: cn(
        // Outer shell
        "bg-white/[0.02] ring-1 ring-white/[0.06] p-[1px] rounded-[1.25rem]",
      ),
      glass: cn(
        "rounded-[1.25rem] backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]",
      ),
      elevated: cn(
        // Outer shell with green glow
        "bg-white/[0.02] ring-1 ring-white/[0.06] p-[1px] rounded-[1.25rem]",
        "shadow-[0_0_40px_rgba(0,255,65,0.06),0_4px_24px_rgba(0,0,0,0.4)]",
      ),
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    const hoverStyles = hover
      ? cn(
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          "hover:ring-neon-green/30 hover:shadow-[0_0_30px_rgba(0,255,65,0.1)]",
        )
      : "";

    // Double-bezel: outer shell wraps inner core
    if (variant === "default" || variant === "elevated") {
      return (
        <div
          ref={ref}
          className={cn(variants[variant], hoverStyles)}
          {...props}
        >
          <div
            className={cn(
              "bg-[#0a0a12] rounded-[calc(1.25rem-1px)]",
              "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
              paddings[padding],
            )}
          >
            {children}
          </div>
        </div>
      );
    }

    // Glass variant is a single layer
    return (
      <div
        ref={ref}
        className={cn(variants[variant], paddings[padding], hoverStyles)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// ── Card sub-components ──

export type CardHeaderProps = React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mb-5", className)} {...props}>
      {children}
    </div>
  ),
);

CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.PropsWithChildren<HTMLAttributes<HTMLHeadingElement>> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = "h3", children, ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "font-sans text-xl font-bold tracking-wide text-cyber-text",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  ),
);

CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = React.PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>;

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-1.5 font-mono text-sm text-cyber-text-muted",
      className,
    )}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

export type CardContentProps = React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  ),
);

CardContent.displayName = "CardContent";

export type CardFooterProps = React.PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-5 flex items-center gap-2 border-t border-white/[0.05] pt-5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);

CardFooter.displayName = "CardFooter";
