"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Maximize, Minimize, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface GameEmbedProps {
  gameUrl?: string;
  coverImage?: string;
  title: string;
}

export function GameEmbed({ gameUrl, coverImage, title }: GameEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (!gameUrl) {
    return (
      <div className="w-full aspect-video bg-cyber-dark-surface border border-cyber-dark-border rounded-xl flex flex-col items-center justify-center text-cyber-text-muted p-6 text-center">
        <AlertCircle className="w-12 h-12 mb-4 text-cyber-neon opacity-50" />
        <h3 className="text-xl font-bold font-mono text-cyber-text mb-2">Jogo não disponível</h3>
        <p>A versão web deste jogo não está disponível no momento.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
    >
      {!isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center group">
          {coverImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
          )}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10"
          >
            <Button
              size="lg"
              onClick={() => setIsPlaying(true)}
              leftIcon={<Play className="w-8 h-8 fill-current" />}
              className="rounded-full w-24 h-24 p-0 flex items-center justify-center animate-pulse-neon"
              aria-label={`Jogar ${title}`}
            />
          </motion.div>
        </div>
      ) : (
        <>
          <iframe
            src={gameUrl}
            title={`Jogar ${title}`}
            allow="fullscreen; autoplay; gamepad"
            className="w-full h-full border-0"
          />
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="bg-black/50 backdrop-blur border-cyber-dark-border"
              leftIcon={isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            >
              {isFullscreen ? "Sair Tela Cheia" : "Tela Cheia"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
