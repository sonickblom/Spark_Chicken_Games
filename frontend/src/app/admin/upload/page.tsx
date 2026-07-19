"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useUploadedGames } from "@/hooks/use-uploaded-games";
import { formatSize } from "@/lib/utils";
import { Upload, FileText, X, ArrowUpFromLine } from "lucide-react";

const CATEGORIES = [
  "Ação", "Aventura", "Arcade", "Corrida", "Estratégia",
  "Esporte", "Plataforma", "Puzzle", "RPG", "Simulação",
];

function getFileIcon(name: string) {
  if (name.endsWith(".html")) return <span className="text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded font-medium">HTML</span>;
  if (name.endsWith(".js")) return <span className="text-xs bg-yellow-500/10 text-yellow-400 px-1.5 py-0.5 rounded font-medium">JS</span>;
  if (name.endsWith(".css")) return <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-medium">CSS</span>;
  if (/\.(png|jpg|jpeg|gif|svg|ico|webp)$/.test(name)) return <span className="text-xs bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded font-medium">IMG</span>;
  if (/\.(mp3|wav|ogg)$/.test(name)) return <span className="text-xs bg-pink-500/10 text-pink-400 px-1.5 py-0.5 rounded font-medium">SOM</span>;
  return <span className="text-xs bg-gray-500/10 text-gray-400 px-1.5 py-0.5 rounded font-medium">FILE</span>;
}

export default function AdminUploadPage() {
  const { uploadGame, games } = useUploadedGames();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      }
    },
    [],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Informe o título do jogo");
      return;
    }
    if (files.length === 0) {
      setError("Selecione pelo menos um arquivo HTML");
      return;
    }
    const hasHtml = files.some((f) => f.name.endsWith(".html"));
    if (!hasHtml) {
      setError("O jogo deve conter um arquivo HTML principal");
      return;
    }

    setUploading(true);
    try {
      const game = await uploadGame(title, description, files, category || undefined);
      setSuccess(`Jogo "${game.title}" publicado!`);
      setTitle("");
      setDescription("");
      setCategory("");
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Upload de Jogo
        </h1>
        <p className="text-cyber-text-muted mt-1">
          Publique seu jogo HTML arrastando arquivos ou colando o código
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="space-y-6">
          <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6 space-y-5">
            <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider">
              Informações do Jogo
            </h2>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Título <span className="text-neon-green">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Meu Incrível Jogo"
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva seu jogo..."
                rows={3}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-cyber-dark border border-cyber-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
              >
                <option value="">Sem categoria</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6 space-y-4">
            <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider">
              Arquivos Selecionados
            </h2>

            {files.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between bg-cyber-dark/50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText size={16} className="text-cyber-text-muted shrink-0" />
                      <span className="text-sm text-cyber-text truncate">{file.name}</span>
                      {getFileIcon(file.name)}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-xs text-cyber-text-muted">{formatSize(file.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-cyber-text-muted hover:text-red-400 transition-colors p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-cyber-text-muted">Nenhum arquivo selecionado</p>
            )}
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg px-4 py-3 text-neon-green text-sm">
              {success}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={uploading || files.length === 0 || !title.trim()}
              className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-300 flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </>
              ) : (
                <>
                  <ArrowUpFromLine size={18} />
                  Publicar Jogo
                </>
              )}
            </button>
            <span className="text-sm text-cyber-text-muted">
              {files.length} arquivo{files.length !== 1 ? "s" : ""} ·{" "}
              {formatSize(files.reduce((sum, f) => sum + f.size, 0))}
            </span>
          </div>
        </div>

        {/* Right: Drop Zone */}
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-200
              ${
                dragOver
                  ? "border-neon-green bg-neon-green/5 shadow-[0_0_30px_rgba(0,255,65,0.1)]"
                  : "border-cyber-dark-border hover:border-gray-600 bg-cyber-dark-surface/30"
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".html,.js,.css,.png,.jpg,.jpeg,.gif,.svg,.ico,.json,.wasm,.mp3,.wav,.ogg,.ttf,.woff"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="space-y-3">
              <Upload
                size={48}
                className={dragOver ? "text-neon-green mx-auto" : "text-cyber-text-muted/70 mx-auto"}
              />
              <p className="text-white font-medium">Arraste seus arquivos aqui</p>
              <p className="text-cyber-text-muted text-sm">ou clique para selecionar</p>
              <p className="text-cyber-text-muted/50 text-xs">
                HTML, JS, CSS, imagens, sons...
              </p>
            </div>
          </div>

          {games.length > 0 && (
            <div className="rounded-xl bg-cyber-dark-surface/50 border border-cyber-dark-border p-6">
              <h2 className="text-sm font-mono text-cyber-text-muted uppercase tracking-wider mb-4">
                Últimos Jogos
              </h2>
              <div className="space-y-2">
                {games.slice(0, 5).map((game) => (
                  <div
                    key={game.id}
                    className="flex items-center justify-between bg-cyber-dark/30 rounded-lg px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{game.title}</p>
                      <p className="text-xs text-cyber-text-muted">
                        {game.files.length} arquivo{game.files.length !== 1 ? "s" : ""} · {game.playCount} jogada{game.playCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <a
                      href={game.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/10 transition-colors shrink-0 ml-3"
                    >
                      Jogar
                    </a>
                  </div>
                ))}
              </div>
              {games.length > 5 && (
                <Link
                  href="/admin/games"
                  className="block text-center text-sm text-neon-green hover:underline mt-4"
                >
                  Ver Todos →
                </Link>
              )}
            </div>
          )}
        </div>
      </form>

      <div className="border-t border-cyber-dark-border pt-8">
        <details className="group">
          <summary className="text-sm text-cyber-text-muted cursor-pointer hover:text-cyber-text transition-colors">
            Ou cole o código HTML diretamente
          </summary>
          <div className="mt-4">
            <p className="text-sm text-cyber-text-muted mb-3">
              Cole o HTML completo do seu jogo. Use &lt;style&gt; para CSS e &lt;script&gt; para JS.
            </p>
            <HtmlPasteForm />
          </div>
        </details>
      </div>
    </div>
  );
}

function HtmlPasteForm() {
  const { uploadGame } = useUploadedGames();
  const [htmlCode, setHtmlCode] = useState("");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError("Informe o título do jogo");
      return;
    }
    if (!htmlCode.trim()) {
      setError("Cole o código HTML do jogo");
      return;
    }
    if (!htmlCode.includes("<html") && !htmlCode.includes("<!DOCTYPE")) {
      setError("O código precisa ser um HTML válido");
      return;
    }

    setUploading(true);
    try {
      const blob = new Blob([htmlCode], { type: "text/html" });
      const file = new File([blob], "index.html", { type: "text/html" });
      await uploadGame(title, "", [file]);
      setSuccess(`Jogo "${title}" publicado!`);
      setTitle("");
      setHtmlCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handlePasteSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título do jogo"
        className="w-full px-4 py-3 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent text-sm transition-all"
      />
      <textarea
        value={htmlCode}
        onChange={(e) => setHtmlCode(e.target.value)}
        placeholder="Cole o HTML completo do seu jogo aqui..."
        rows={12}
        className="w-full px-4 py-3 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white font-mono text-sm placeholder:text-cyber-text-muted focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all resize-none"
      />
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-neon-green/10 border border-neon-green/30 rounded-lg px-4 py-3 text-neon-green text-sm">
          {success}
        </div>
      )}
      <button
        type="submit"
        disabled={uploading || !htmlCode.trim() || !title.trim()}
        className="px-6 py-2.5 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        {uploading ? "Publicando..." : "Publicar HTML"}
      </button>
    </form>
  );
}
