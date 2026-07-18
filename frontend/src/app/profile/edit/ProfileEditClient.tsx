"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { useAuthContext } from "@/lib/auth-context";
import { api } from "@/services/api";
import { getInitials, getColorFromString } from "@/lib/utils";

export function ProfileEditClient() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, checkAuth } = useAuthContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-cyber-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-green" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace("/login");
    return null;
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedUser = await api.updateProfile({
        username: username !== user.username ? username : undefined,
        bio: bio !== user.bio ? bio : undefined,
        avatar: avatarPreview || undefined,
      });
      localStorage.setItem("user", JSON.stringify(updatedUser));
      await checkAuth();
      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => router.push("/profile"), 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao atualizar perfil",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarColor = getColorFromString(user.username);

  return (
    <div className="min-h-screen bg-cyber-darker">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-cyber-text-muted hover:text-neon-green transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para o Perfil
        </Link>

        <div className="bg-cyber-dark-surface/30 border border-cyber-dark-border rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <UserIcon className="w-6 h-6 text-neon-green" />
            Editar Perfil
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 ring-2 ring-neon-green/30 cursor-pointer hover:ring-neon-green/60 transition-all"
                style={{ backgroundColor: avatarColor }}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(user.username)
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-sm font-mono text-neon-green border border-neon-green/30 rounded-lg hover:bg-neon-green/[0.06] transition-all"
                >
                  Alterar Avatar
                </button>
                <p className="text-xs text-cyber-text-muted mt-1">
                  PNG, JPG ou GIF. Máx 2MB.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-cyber-text mb-1.5">
                Nome de Usuário
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
                className="w-full px-4 py-2.5 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted/70 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-cyber-text mb-1.5">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Conte um pouco sobre você..."
                className="w-full px-4 py-2.5 bg-cyber-dark-surface border border-cyber-dark-border rounded-lg text-white placeholder:text-cyber-text-muted/70 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all duration-200 text-sm resize-y min-h-[100px]"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-medium text-cyber-text mb-1.5">
                Email
              </label>
              <input
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 bg-cyber-dark-surface/50 border border-cyber-dark-border rounded-lg text-cyber-text-muted text-sm cursor-not-allowed"
              />
              <p className="text-xs text-cyber-text-muted/50 mt-1">
                O email não pode ser alterado.
              </p>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="p-4 rounded-lg bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm">
                {success}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-cyber-dark-border">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </>
                )}
              </button>
              <Link
                href="/profile"
                className="px-6 py-2.5 text-sm font-medium text-cyber-text-muted hover:text-white transition-colors rounded-lg hover:bg-cyber-dark-surface/50"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
