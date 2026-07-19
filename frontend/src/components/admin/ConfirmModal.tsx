"use client";

import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />
      <div className="relative bg-cyber-dark-surface border border-white/[0.06] rounded-xl p-6 w-full max-w-md shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-cyber-text-muted hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
        <div className="flex items-start gap-4">
          <div
            className={`p-2 rounded-lg shrink-0 ${
              variant === "danger"
                ? "bg-red-500/10 text-red-400"
                : "bg-neon-green/10 text-neon-green"
            }`}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            <p className="text-sm text-cyber-text-muted">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-cyber-text-muted hover:text-white border border-white/[0.06] rounded-lg hover:bg-cyber-dark-surface/50 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              variant === "danger"
                ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                : "bg-neon-green/10 text-neon-green border border-neon-green/30 hover:bg-neon-green/20"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
