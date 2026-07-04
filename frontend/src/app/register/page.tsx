"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-data";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await register(username, email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-neon/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 py-12"
      >
        <Link href="/" className="flex items-center justify-center mb-8 gap-2">
          <div className="w-10 h-10 bg-cyber-neon rounded-lg flex items-center justify-center text-cyber-dark font-bold text-xl">
            L
          </div>
          <span className="text-2xl font-bold font-mono text-cyber-text">
            Latency<span className="text-cyber-neon">Zero</span>
          </span>
        </Link>

        <div className="bg-cyber-dark-card border border-cyber-dark-border rounded-2xl p-8 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyber-text mb-2">Criar Nova Conta</h1>
            <p className="text-cyber-text-muted">Junte-se à revolução dos jogos online</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-cyber-text-muted font-medium">Nome de Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-text-muted">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-cyber-dark-surface border border-cyber-dark-border text-cyber-text rounded-lg pl-10 px-4 py-2.5 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-colors"
                  placeholder="Seu nick gamer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-cyber-text-muted font-medium">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-text-muted">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cyber-dark-surface border border-cyber-dark-border text-cyber-text rounded-lg pl-10 px-4 py-2.5 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-cyber-text-muted font-medium">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-cyber-dark-surface border border-cyber-dark-border text-cyber-text rounded-lg pl-10 px-4 py-2.5 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-cyber-text-muted font-medium">Confirmar Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-text-muted">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-cyber-dark-surface border border-cyber-dark-border text-cyber-text rounded-lg pl-10 px-4 py-2.5 focus:border-cyber-neon focus:ring-1 focus:ring-cyber-neon transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              leftIcon={<UserPlus className="w-5 h-5" />}
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Conta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-cyber-text-muted text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-cyber-neon hover:underline font-medium inline-flex items-center gap-1">
              Fazer login <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
