import fs from "fs";
import path from "path";
import { slugify } from "./utils";

export interface UploadedGame {
  id: string;
  slug: string;
  title: string;
  description: string;
  files: string[];
  mainFile: string;
  createdAt: string;
  updatedAt: string;
  playCount: number;
  size: number;
}

const GAMES_DIR = path.join(process.cwd(), "public", "games");
const METADATA_FILE = path.join(GAMES_DIR, "_games.json");

export function ensureGamesDir(): void {
  if (!fs.existsSync(GAMES_DIR)) {
    fs.mkdirSync(GAMES_DIR, { recursive: true });
  }
}

export function getUploadedGames(): UploadedGame[] {
  ensureGamesDir();
  if (!fs.existsSync(METADATA_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(METADATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveGamesMetadata(games: UploadedGame[]): void {
  ensureGamesDir();
  fs.writeFileSync(METADATA_FILE, JSON.stringify(games, null, 2), "utf-8");
}

export function getUploadedGame(slug: string): UploadedGame | undefined {
  const games = getUploadedGames();
  return games.find((g) => g.slug === slug);
}

export function createGameFromFiles(
  title: string,
  description: string,
  files: { name: string; buffer: Buffer }[]
): UploadedGame {
  ensureGamesDir();

  const slug = slugify(title) || `game-${Date.now()}`;
  const gameDir = path.join(GAMES_DIR, slug);

  // Remove existing if any
  if (fs.existsSync(gameDir)) {
    fs.rmSync(gameDir, { recursive: true });
  }
  fs.mkdirSync(gameDir, { recursive: true });

  const savedFiles: string[] = [];
  let totalSize = 0;

  for (const file of files) {
    // Security: prevent directory traversal
    const safeName = path.basename(file.name);
    const filePath = path.join(gameDir, safeName);

    // Ensure we're still inside the game directory
    if (!filePath.startsWith(gameDir)) {
      continue;
    }

    // Create subdirectories if needed
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, file.buffer);
    savedFiles.push(safeName);
    totalSize += file.buffer.length;
  }

  // Determine main file (index.html or first html file)
  const mainFile =
    savedFiles.find((f) => f.toLowerCase() === "index.html") ||
    savedFiles.find((f) => f.endsWith(".html")) ||
    savedFiles[0] ||
    "index.html";

  const games = getUploadedGames();

  const game: UploadedGame = {
    id: `uploaded-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    slug,
    title,
    description,
    files: savedFiles,
    mainFile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    playCount: 0,
    size: totalSize,
  };

  // Remove old entry with same slug
  const filtered = games.filter((g) => g.slug !== slug);
  filtered.push(game);
  saveGamesMetadata(filtered);

  return game;
}

export function deleteUploadedGame(slug: string): boolean {
  const games = getUploadedGames();
  const index = games.findIndex((g) => g.slug === slug);
  if (index === -1) return false;

  const gameDir = path.join(GAMES_DIR, slug);
  if (fs.existsSync(gameDir)) {
    fs.rmSync(gameDir, { recursive: true });
  }

  games.splice(index, 1);
  saveGamesMetadata(games);
  return true;
}

export function incrementPlayCount(slug: string): void {
  const games = getUploadedGames();
  const game = games.find((g) => g.slug === slug);
  if (game) {
    game.playCount++;
    saveGamesMetadata(games);
  }
}

export function getGameUrl(slug: string): string {
  return `/games/${slug}/index.html`;
}

export function getTotalUploadedGames(): number {
  return getUploadedGames().length;
}

export function getTotalPlayCount(): number {
  return getUploadedGames().reduce((sum, g) => sum + g.playCount, 0);
}

export function getTotalStorageSize(): number {
  return getUploadedGames().reduce((sum, g) => sum + g.size, 0);
}
