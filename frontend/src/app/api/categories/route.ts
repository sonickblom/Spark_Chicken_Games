import { NextRequest, NextResponse } from "next/server";
import {
  readCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/category-storage";

export async function GET() {
  try {
    const categories = readCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error listing categories:", error);
    return NextResponse.json({ error: "Erro ao listar categorias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, icon, color } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Nome deve ter pelo menos 2 caracteres" }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Slug é obrigatório" }, { status: 400 });
    }

    const categories = readCategories();
    const exists = categories.some((c) => c.slug === slug);
    if (exists) {
      return NextResponse.json({ error: "Já existe uma categoria com esse slug" }, { status: 409 });
    }

    const category = addCategory(name.trim(), slug, icon || "📁", color || "rgba(0, 255, 65, 0.5)");
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Erro ao criar categoria" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug, icon, color } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const updated = updateCategory(id, { name, slug, icon, color });
    if (!updated) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ category: updated });
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Erro ao atualizar categoria" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
    }

    const deleted = deleteCategory(id);
    if (!deleted) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Categoria removida" });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Erro ao remover categoria" }, { status: 500 });
  }
}