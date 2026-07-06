"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { cn, slugify } from "@/lib/utils";
import type { Game } from "@/types";

interface GameFormProps {
  initialData?: Partial<Game>;
  isEditing?: boolean;
}

const defaultFormState = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  thumbnail: "",
  bannerImage: "",
  iframeUrl: "",
  rating: 0,
  price: 0,
  discount: 0,
  isFree: true,
  isFeatured: false,
  isNewRelease: true,
  isPopular: false,
  isEarlyAccess: false,
  developer: "",
  publisher: "",
  website: "",
  steamUrl: "",
  epicUrl: "",
  gogUrl: "",
  genre: "",
  tags: "",
  platforms: "",
  languages: "",
  ageRating: "",
  releaseDate: "",
  videoUrl: "",
  screenshots: "",
};

export function GameForm({ initialData, isEditing }: GameFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(() => ({
    ...defaultFormState,
    ...initialData,
    genre: initialData?.genre?.join(", ") || "",
    tags: initialData?.tags?.join(", ") || "",
    platforms: initialData?.platforms?.join(", ") || "",
    languages: initialData?.languages?.join(", ") || "",
    screenshots: initialData?.screenshots?.join("\n") || "",
    releaseDate: initialData?.releaseDate
      ? new Date(initialData.releaseDate).toISOString().split("T")[0]
      : "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      // Auto-generate slug from title
      ...(name === "title" && !isEditing ? { slug: slugify(value) } : {}),
    }));

    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) newErrors.title = "O título é obrigatório";
    if (!form.slug.trim()) newErrors.slug = "O slug é obrigatório";
    if (!form.shortDescription.trim())
      newErrors.shortDescription = "A descrição curta é obrigatória";
    if (!form.description.trim())
      newErrors.description = "A descrição completa é obrigatória";
    if (!form.coverImage.trim())
      newErrors.coverImage = "A URL da capa é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Process arrays
      const processedData = {
        ...form,
        genre: form.genre
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        tags: form.tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        platforms: form.platforms
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        languages: form.languages
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        screenshots: form.screenshots
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        price: form.isFree ? 0 : Number(form.price),
        discount: Number(form.discount),
        rating: Number(form.rating),
        createdAt: isEditing
          ? initialData?.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(
        isEditing ? "Jogo atualizado com sucesso!" : "Jogo criado com sucesso!",
        processedData,
      );

      router.push("/admin/games");
      router.refresh();
    } catch {
      setErrors({
        submit: "Erro ao salvar o jogo. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all duration-200 text-sm";

  const labelClass = "block text-sm font-medium text-gray-300 mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <section className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-neon-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Informações Básicas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>Título do Jogo *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Cyber Quest"
              className={cn(
                inputClass,
                errors.title && "border-red-400 ring-1 ring-red-400/50",
              )}
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>Slug *</label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="cyber-quest"
              className={cn(
                inputClass,
                errors.slug && "border-red-400 ring-1 ring-red-400/50",
              )}
            />
            {errors.slug && <p className={errorClass}>{errors.slug}</p>}
          </div>

          <div>
            <label className={labelClass}>Desenvolvedor</label>
            <input
              name="developer"
              value={form.developer}
              onChange={handleChange}
              placeholder="Nome do desenvolvedor"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Descrição Curta *</label>
            <input
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Uma descrição breve para cards e listagens"
              className={cn(
                inputClass,
                errors.shortDescription &&
                  "border-red-400 ring-1 ring-red-400/50",
              )}
            />
            {errors.shortDescription && (
              <p className={errorClass}>{errors.shortDescription}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Descrição Completa *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Descrição detalhada do jogo..."
              className={cn(
                inputClass,
                "resize-y min-h-[120px]",
                errors.description && "border-red-400 ring-1 ring-red-400/50",
              )}
            />
            {errors.description && (
              <p className={errorClass}>{errors.description}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Editora / Publisher</label>
            <input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="Nome da editora"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Data de Lançamento</label>
            <input
              type="date"
              name="releaseDate"
              value={form.releaseDate}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Gêneros (separados por vírgula)
            </label>
            <input
              name="genre"
              value={form.genre}
              onChange={handleChange}
              placeholder="Ação, Aventura, RPG"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tags (separadas por vírgula)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="multiplayer, coop, pixel-art"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Plataformas (separadas por vírgula)
            </label>
            <input
              name="platforms"
              value={form.platforms}
              onChange={handleChange}
              placeholder="Web, Windows, Mac"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Idiomas (separados por vírgula)
            </label>
            <input
              name="languages"
              value={form.languages}
              onChange={handleChange}
              placeholder="Português, Inglês, Espanhol"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Classificação Etária</label>
            <select
              name="ageRating"
              value={form.ageRating}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Selecione</option>
              <option value="Livre">Livre</option>
              <option value="10+">10+</option>
              <option value="12+">12+</option>
              <option value="14+">14+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>
        </div>
      </section>

      {/* Media */}
      <section className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-neon-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Mídia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className={labelClass}>URL da Capa *</label>
            <input
              name="coverImage"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem-capa.jpg"
              className={cn(
                inputClass,
                errors.coverImage && "border-red-400 ring-1 ring-red-400/50",
              )}
            />
            {errors.coverImage && (
              <p className={errorClass}>{errors.coverImage}</p>
            )}
            {form.coverImage && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-700 max-w-sm">
                <img
                  src={form.coverImage}
                  alt="Preview da capa"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>URL da Miniatura (Thumbnail)</label>
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://exemplo.com/thumb.jpg"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>URL do Banner</label>
            <input
              name="bannerImage"
              value={form.bannerImage}
              onChange={handleChange}
              placeholder="https://exemplo.com/banner.jpg"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>URL do Jogo (iframe)</label>
            <input
              name="videoUrl"
              value={form.videoUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/jogar"
              className={inputClass}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              URLs de Screenshots (uma por linha)
            </label>
            <textarea
              name="screenshots"
              value={form.screenshots}
              onChange={handleChange}
              rows={3}
              placeholder="https://exemplo.com/screenshot1.jpg&#10;https://exemplo.com/screenshot2.jpg"
              className={cn(inputClass, "resize-y min-h-[80px]")}
            />
          </div>
        </div>
      </section>

      {/* Pricing & Status */}
      <section className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-neon-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Preço e Status
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700 cursor-pointer hover:border-neon-green/30 transition-colors">
              <input
                type="checkbox"
                name="isFree"
                checked={form.isFree}
                onChange={(e) => {
                  setForm((prev) => ({
                    ...prev,
                    isFree: e.target.checked,
                    ...(e.target.checked ? { price: 0 } : {}),
                  }));
                }}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-neon-green focus:ring-neon-green"
              />
              <div>
                <span className="text-sm font-medium text-white">
                  Jogo Gratuito
                </span>
                <p className="text-xs text-gray-500">Disponível sem custo</p>
              </div>
            </label>
          </div>

          <div>
            <label className={labelClass}>Preço (R$)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              disabled={form.isFree}
              min={0}
              step="0.01"
              className={cn(
                inputClass,
                form.isFree && "opacity-50 cursor-not-allowed",
              )}
            />
          </div>

          <div>
            <label className={labelClass}>Desconto (%)</label>
            <input
              type="number"
              name="discount"
              value={form.discount}
              onChange={handleChange}
              min={0}
              max={100}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            {
              name: "isFeatured",
              label: "Destaque",
              desc: "Mostrar na página inicial",
            },
            {
              name: "isNewRelease",
              label: "Novo Lançamento",
              desc: "Marcar como novo",
            },
            {
              name: "isPopular",
              label: "Popular",
              desc: "Destacar como popular",
            },
            {
              name: "isEarlyAccess",
              label: "Acesso Antecipado",
              desc: "Jogo em desenvolvimento",
            },
          ].map((field) => (
            <label
              key={field.name}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700 cursor-pointer hover:border-neon-green/30 transition-colors"
            >
              <input
                type="checkbox"
                name={field.name}
                checked={
                  (form as Record<string, unknown>)[field.name] as boolean
                }
                onChange={handleChange}
                className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800 text-neon-green focus:ring-neon-green"
              />
              <div>
                <span className="text-sm font-medium text-white">
                  {field.label}
                </span>
                <p className="text-xs text-gray-500">{field.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Links */}
      <section className="rounded-xl bg-gray-900/30 border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-neon-green"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          Links
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Website</label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://meujogo.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Steam</label>
            <input
              name="steamUrl"
              value={form.steamUrl}
              onChange={handleChange}
              placeholder="https://store.steampowered.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Epic Games</label>
            <input
              name="epicUrl"
              value={form.epicUrl}
              onChange={handleChange}
              placeholder="https://store.epicgames.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>GOG</label>
            <input
              name="gogUrl"
              value={form.gogUrl}
              onChange={handleChange}
              placeholder="https://www.gog.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Error / Submit */}
      {errors.submit && (
        <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
          {errors.submit}
        </div>
      )}

      <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
        <Button type="submit" disabled={isSubmitting} className="min-w-[180px]">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Salvando...
            </span>
          ) : isEditing ? (
            "Atualizar Jogo"
          ) : (
            "Publicar Jogo"
          )}
        </Button>

        <button
          type="button"
          onClick={() => router.push("/admin/games")}
          className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
