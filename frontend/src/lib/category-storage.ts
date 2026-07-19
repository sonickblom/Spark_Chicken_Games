// Category storage using local JSON file (similar pattern to game-storage)
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  gameCount: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES_FILE = join(
  process.cwd(),
  "public",
  "uploads",
  "_categories.json",
);

function ensureFile() {
  if (!existsSync(CATEGORIES_FILE)) {
    writeFileSync(CATEGORIES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function readCategories(): CategoryData[] {
  ensureFile();
  try {
    const raw = readFileSync(CATEGORIES_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function writeCategories(categories: CategoryData[]) {
  ensureFile();
  writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
}

export function addCategory(
  name: string,
  slug: string,
  icon: string,
  color: string,
): CategoryData {
  const categories = readCategories();
  const now = new Date().toISOString();
  const newCategory: CategoryData = {
    id: `cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    slug,
    icon,
    color,
    gameCount: 0,
    createdAt: now,
    updatedAt: now,
  };
  categories.push(newCategory);
  writeCategories(categories);
  return newCategory;
}

export function updateCategory(
  id: string,
  updates: Partial<Pick<CategoryData, "name" | "slug" | "icon" | "color">>,
): CategoryData | null {
  const categories = readCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = {
    ...categories[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeCategories(categories);
  return categories[index];
}

export function deleteCategory(id: string): boolean {
  const categories = readCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  writeCategories(filtered);
  return true;
}