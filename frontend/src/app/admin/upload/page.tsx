"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useUploadedGames } from "@/hooks/use-uploaded-games";

export default function AdminUploadPage() {
  const { uploadGame, games } = useUploadedGames();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
      const game = await uploadGame(title, description, files);
      setSuccess(`Jogo "${game.title}" publicado!`);
      setTitle("");
      setDescription("");
      setFiles([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao publicar");
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Only show uploaded games (not API games)
  const uploadedCount = games.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Upload de Jogo
        </h1>
        <p className="text-gray-400 mt-1">
          Publique seu jogo HTML arrastando os arquivos ou colando o código
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-neon-green">
            {uploadedCount}
          </div>
          <div className="text-sm text-gray-400">Jogos Publicados</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-neon-green">
            {games.reduce((sum, g) => sum + g.playCount, 0)}
          </div>
          <div className="text-sm text-gray-400">Total de Jogadas</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="text-2xl font-bold text-neon-green">
            {games.length > 0
              ? games.reduce((sum, g) => sum + g.size, 0) > 1024 * 1024
                ? `${(games.reduce((sum, g) => sum + g.size, 0) / (1024 * 1024)).toFixed(1)} MB`
                : `${(games.reduce((sum, g) => sum + g.size, 0) / 1024).toFixed(0)} KB`
              : "0 B"}
          </div>
          <div className="text-sm text-gray-400">Armazenamento</div>
        </div>
        <Link
          href="/admin/games"
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-neon-green/50 transition-colors"
        >
          <div className="text-lg font-bold text-neon-green">Gerenciar →</div>
          <div className="text-sm text-gray-400">Ver todos os jogos</div>
        </Link>
      </div>

      {/* Upload form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título do Jogo <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Meu Incrível Jogo"
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white
                       placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green
                       focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descrição
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva seu jogo..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white
                       placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green
                       focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>

        {/* File drop zone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Arquivos do Jogo <span className="text-red-400">*</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
              transition-all duration-200
              ${
                dragOver
                  ? "border-neon-green bg-neon-green/5 shadow-[0_0_30px_rgba(0,255,65,0.1)]"
                  : "border-gray-700 hover:border-gray-600 bg-gray-900/50"
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
              <div className="flex justify-center">
                <svg
                  className={`w-12 h-12 ${dragOver ? "text-neon-green" : "text-gray-600"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-300 font-medium">
                  Arraste seus arquivos aqui
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  ou clique para selecionar (HTML, JS, CSS, imagens, sons...)
                </p>
              </div>
              <p className="text-gray-600 text-xs">
                O arquivo <strong>index.html</strong> será usado como ponto de
                entrada
              </p>
            </div>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Arquivos selecionados ({files.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* File icon */}
                    <svg
                      className="w-5 h-5 text-gray-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                      />
                    </svg>
                    <span className="text-sm text-gray-300 truncate">
                      {file.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {formatSize(file.size)}
                    </span>
                    {file.name.endsWith(".html") && (
                      <span className="text-xs bg-neon-green/10 text-neon-green px-2 py-0.5 rounded-full">
                        HTML
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error & Success messages */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-3 text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={uploading || files.length === 0 || !title.trim()}
            className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg
                       hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
                       transition-all duration-300 flex items-center gap-2"
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
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
                Publicando...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Publicar Jogo
              </>
            )}
          </button>
          <span className="text-sm text-gray-500">
            {files.length} arquivo(s) —{" "}
            {formatSize(files.reduce((sum, f) => sum + f.size, 0))}
          </span>
        </div>
      </form>

      {/* Latest uploaded games preview */}
      {games.length > 0 && (
        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">
              Jogos Publicados Recentemente
            </h2>
            <Link
              href="/admin/games"
              className="text-sm text-neon-green hover:underline"
            >
              Ver Todos →
            </Link>
          </div>

          <div className="grid gap-3">
            {games.slice(0, 5).map((game) => (
              <div
                key={game.id}
                className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-5 py-3 hover:border-gray-700 transition-colors"
              >
                <div className="min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {game.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    /play/{game.slug} · {game.files.length} arquivo(s) ·{" "}
                    {game.playCount} jogada(s)
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-sm text-neon-green border border-neon-green/30 rounded-lg
                               hover:bg-neon-green/10 transition-colors"
                  >
                    Jogar
                  </a>
                  <span className="text-xs text-gray-600">
                    {new Date(game.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HTML paste alternative */}
      <div className="border-t border-gray-800 pt-8">
        <details className="group">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-300 transition-colors">
            Ou cole o código HTML diretamente
          </summary>
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-3">
              Cole o HTML completo do seu jogo abaixo. Use &lt;style&gt; para
              CSS e &lt;script&gt; para JS.
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
      // Create a File from the HTML string
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
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white
                   placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green
                   focus:border-transparent transition-all duration-200"
      />
      <textarea
        value={htmlCode}
        onChange={(e) => setHtmlCode(e.target.value)}
        placeholder="Cole o HTML completo do seu jogo aqui..."
        rows={12}
        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm
                   placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-green
                   focus:border-transparent transition-all duration-200 resize-none"
      />
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-lg px-4 py-3 text-green-400 text-sm">
          {success}
        </div>
      )}
      <button
        type="submit"
        disabled={uploading || !htmlCode.trim() || !title.trim()}
        className="px-6 py-2.5 bg-neon-green text-black font-bold rounded-lg
                   hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-300"
      >
        {uploading ? "Publicando..." : "Publicar HTML"}
      </button>
    </form>
  );
}
