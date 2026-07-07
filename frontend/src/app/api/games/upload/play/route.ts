import { NextRequest, NextResponse } from "next/server";
import { incrementPlayCount } from "@/lib/game-storage";

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: "Slug não fornecido" }, { status: 400 });
    }

    incrementPlayCount(slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Play count error:", error);
    return NextResponse.json(
      { error: "Erro ao registrar jogada" },
      { status: 500 }
    );
  }
}
