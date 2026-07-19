"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Film } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  gameCount: number;
  createdAt?: string;
}

const ICONS = [
  "🎮", "🎲", "🕹️", "🎯", "⚔️", "🛡️", "🏹", "🚀", "🪐", "👾",
  "🤖", "👻", "🧟", "🧙", "🏰", "🌍", "🌌", "⚡", "🔥", "💎",
  "🏆", "🎪", "🎨", "📦", "🔮",
];

const COLORS = [
  { label: "Neon Green", value: "rgba(0, 255, 65, 0.5)" },
  { label: "Cyan", value: "rgba(0, 200, 255, 0.5)" },
  { label: "Pink", value: "rgba(255, 0, 150, 0.5)" },
  { label: "Purple", value: "rgba(150, 0, 255, 0.5)" },
  { label: "Red", value: "rgba(255, 50, 50, 0.5)" },
  { label: "Orange", value: "rgba(255, 150, 0, 0.5)" },
  { label: "Yellow", value: "rgba(255, 220, 0, 0.5)" },
  { label: "Blue", value: "rgba(50, 100, 255, 0.5)" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formIcon, setFormIcon] = useState("📁");
  const [formColor, setFormColor] = useState(COLORS[0].value);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Erro ao carregar categorias");
      const data = await res.json();
      setCategories(data.categories || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormIcon("📁");
    setFormColor(COLORS[0].value);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormIcon(cat.icon || "📁");
    setFormColor(cat.color || COLORS[0].value);
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormName(name);
    if (!editingCategory) {
      setFormSlug(slugify(name));
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    try {
      const body = {
        name: formName.trim(),
        slug: formSlug || slugify(formName),
        icon: formIcon,
        color: formColor,
        ...(editingCategory ? { id: editingCategory.id } : {}),
      };

      const res = await fetch("/api/categories", {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Erro ao salvar");
      }

      setModalOpen(false);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTarget.id }),
      });
      if (!res.ok) throw new Error("Erro ao excluir");
      setDeleteTarget(null);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Categorias</h1>
          <p className="text-cyber-text-muted mt-1">
            {categories.length} categoría{categories.length !== 1 ? "s" : ""} na plataforma
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-all duration-300"
        >
          <Plus size={16} />
          Nova Categoria
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Fechar</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-cyber-text-muted text-sm">Carregando...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16">
          <Film size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-cyber-text-muted text-lg font-medium">
            Nenhuma categoria ainda
          </p>
          <p className="text-cyber-text-muted/70 text-sm mt-1">
            Crie a primeira categoria para organizar seus jogos
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-neon-green text-black font-semibold rounded-lg hover:bg-neon-green/80 transition-all"
          >
            <Plus size={16} />
            Criar Categoria
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-5 hover:border-neon-green/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: cat.color || "rgba(0,255,65,0.1)" }}
                >
                  {cat.icon || "📁"}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 rounded-lg text-cyber-text-muted hover:text-neon-green hover:bg-cyber-dark-surface transition-all"
                    title="Editar"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-2 rounded-lg text-cyber-text-muted hover:text-red-400 hover:bg-cyber-dark-surface transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-semibold text-white mb-0.5">{cat.name}</h3>
              <p className="text-xs font-mono text-cyber-text-muted mb-3">/{cat.slug}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-cyber-text-muted">
                  {cat.gameCount} jogo{cat.gameCount !== 1 ? "s" : ""}
                </span>
                <span
                  className="w-3 h-3 rounded-full border border-white/[0.06]"
                  style={{ backgroundColor: cat.color || "rgba(0,255,65,0.5)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className="relative bg-cyber-dark-surface border border-white/[0.06] rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-cyber-text-muted hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-semibold text-white mb-6">
              {editingCategory ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Nome</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Ação"
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Slug</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(slugify(e.target.value))}
                  placeholder="acao"
                  className="w-full px-4 py-3 bg-cyber-dark border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm font-mono transition-all"
                />
                <p className="text-xs text-cyber-text-muted mt-1">Auto-gerado a partir do nome</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Ícone</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormIcon(icon)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-all ${
                        formIcon === icon
                          ? "bg-neon-green/20 border border-neon-green/50"
                          : "bg-cyber-dark border border-cyber-dark-border hover:border-gray-600"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Cor</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormColor(color.value)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        formColor === color.value
                          ? "bg-neon-green/20 border border-neon-green/50 text-white"
                          : "bg-cyber-dark border border-cyber-dark-border text-cyber-text-muted hover:border-gray-600"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/[0.06]"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-cyber-text-muted hover:text-white border border-white/[0.06] rounded-lg hover:bg-cyber-dark-surface/50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="px-6 py-2 text-sm font-bold bg-neon-green text-black rounded-lg hover:bg-neon-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editingCategory ? "Salvar Alterações" : "Criar Categoria"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Os jogos categorizados não serão removidos, apenas ficarão sem categoria.`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
