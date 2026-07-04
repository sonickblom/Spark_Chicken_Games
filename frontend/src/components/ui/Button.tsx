import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
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
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-cyber-green text-cyber-dark hover:bg-cyber-green/90",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline:
        "border border-cyber-green bg-transparent hover:bg-cyber-green/10 text-cyber-green",
      secondary:
        "bg-cyber-dark/50 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green/10",
      ghost: "hover:bg-cyber-green/10 hover:text-cyber-green",
      link: "text-cyber-green underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      xl: "h-12 rounded-md px-10 text-base",
      icon: "h-10 w-10",
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className,
    );

    return (
      <button className={classes} ref={ref} {...props}>
        {leftIcon && (
          <span className="mr-2" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {props.children}
        {rightIcon && (
          <span className="ml-2" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
