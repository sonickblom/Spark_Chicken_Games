import { NextRequest, NextResponse } from "next/server";
import {
  createGameFromFiles,
  getUploadedGames,
  deleteUploadedGame,
} from "@/lib/game-storage";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || title.trim().length < 2) {
      return NextResponse.json(
        { error: "Título deve ter pelo menos 2 caracteres" },
        { status: 400 },
      );
    }

    // Collect all uploaded files
    const files: { name: string; buffer: Buffer }[] = [];
    const entries = formData.entries();

    for (const [, value] of entries) {
      if (value && typeof value === "object" && "arrayBuffer" in value) {
        const file = value as File;
        const buffer = Buffer.from(await file.arrayBuffer());
        files.push({ name: file.name, buffer });
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Envie pelo menos um arquivo HTML" },
        { status: 400 },
      );
    }

    // Check if there's an HTML file
    const hasHtml = files.some((f) => f.name.endsWith(".html"));
    if (!hasHtml) {
      return NextResponse.json(
        { error: "O jogo deve conter pelo menos um arquivo HTML" },
        { status: 400 },
      );
    }

    const game = createGameFromFiles(title.trim(), description || "", files);

    return NextResponse.json({
      success: true,
      game: {
        ...game,
        url: `/play/${game.slug}`,
        embedUrl: `/games/${game.slug}/index.html`,
      },
      message: "Jogo publicado com sucesso!",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Erro ao fazer upload do jogo. Tente novamente." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const games = getUploadedGames();

    // Sort by most recent first
    const sorted = games.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return NextResponse.json({
      games: sorted.map((g) => ({
        ...g,
        url: `/play/${g.slug}`,
        embedUrl: `/games/${g.slug}/index.html`,
      })),
    });
  } catch (error) {
    console.error("Error listing games:", error);
    return NextResponse.json(
      { error: "Erro ao listar jogos" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json(
        { error: "Slug não fornecido" },
        { status: 400 },
      );
    }

    const deleted = deleteUploadedGame(slug);
    if (!deleted) {
      return NextResponse.json(
        { error: "Jogo não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, message: "Jogo removido" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Erro ao remover jogo" },
      { status: 500 },
    );
  }
}
