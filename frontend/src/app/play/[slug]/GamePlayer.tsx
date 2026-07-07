"use client";

import { useState, useRef, useEffect } from "react";

interface GamePlayerProps {
  gameUrl: string;
  title: string;
  slug: string;
}

export default function GamePlayer({ gameUrl, title, slug }: GamePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Track play count
  useEffect(() => {
    if (isPlaying && slug) {
      fetch("/api/games/upload/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      }).catch(() => {});
    }
  }, [isPlaying, slug]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
      } catch (err) {
        console.error("Fullscreen error:", err);
      }
    } else {
      await document.exitFullscreen();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black"
      style={{ aspectRatio: "16/9" }}
    >
      {!isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full border-2 border-neon-green/30 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-neon-green ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">
                Clique para começar a jogar
              </p>
            </div>
            <button
              onClick={() => setIsPlaying(true)}
              className="px-8 py-3 bg-neon-green text-black font-bold rounded-lg
                         hover:bg-neon-green/80 hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]
                         transition-all duration-300 text-lg"
            >
              ▶ JOGAR
            </button>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-10">
              <div className="text-center">
                <svg
                  className="animate-spin w-10 h-10 text-neon-green mx-auto mb-3"
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
                <p className="text-gray-500 text-sm">Carregando jogo...</p>
              </div>
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f] z-10">
              <div className="text-center max-w-md px-6">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Erro ao carregar o jogo
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  O jogo pode estar temporariamente indisponível.
                </p>
                <button
                  onClick={() => {
                    setHasError(false);
                    setIsLoading(true);
                    setIsPlaying(false);
                    setTimeout(() => setIsPlaying(true), 100);
                  }}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}
          <iframe
            src={gameUrl}
            title={`Jogar ${title}`}
            allow="fullscreen; autoplay; gamepad; pointer-lock; accelerometer; gyroscope"
            className="w-full h-full border-0"
            style={{ aspectRatio: "16/9" }}
            onLoad={() => {
              setIsLoading(false);
            }}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
          {/* Controls overlay */}
          <div className="absolute bottom-4 right-4 opacity-0 hover:opacity-100 transition-opacity z-20">
            <div className="flex gap-2">
              <button
                onClick={() => setIsPlaying(false)}
                className="px-3 py-1.5 bg-black/60 backdrop-blur text-gray-300 text-sm rounded-lg
                           hover:bg-black/80 transition-colors border border-gray-700/50"
                title="Pausar"
              >
                ⏹
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1.5 bg-black/60 backdrop-blur text-gray-300 text-sm rounded-lg
                           hover:bg-black/80 transition-colors border border-gray-700/50"
                title={isFullscreen ? "Sair tela cheia" : "Tela cheia"}
              >
                {isFullscreen ? "⛶" : "⛶"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
