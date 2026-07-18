import React from "react";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

const CategoryPill = ({
  category,
  isActive = false,
  onClick,
}: {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-black",
        isActive
          ? "bg-neon-green text-black shadow-[0_0_10px_rgb(0,255,65)]"
          : "bg-cyber-dark-surface border border-cyber-dark-border text-neon-green hover:bg-neon-green/10",
      )}
      aria-pressed={isActive}
    >
      {category.name}
    </button>
  );
};

CategoryPill.displayName = "CategoryPill";

export default CategoryPill;
