import { notFound } from "next/navigation";
import Link from "next/link";
import { getUploadedGame, getGameUrl } from "@/lib/game-storage";
import GamePlayer from "./GamePlayer";
import AdminLink from "./AdminLink";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const game = getUploadedGame(slug);
  if (!game) return { title: "Jogo não encontrado | Latency Zero" };

  return {
    title: `${game.title} | Latency Zero`,
    description: game.description || `Jogue ${game.title} online grátis`,
  };
}

export default async function PlayGamePage({ params }: PageProps) {
  const { slug } = await params;
  const game = getUploadedGame(slug);

  if (!game) {
    notFound();
  }

  const gameUrl = getGameUrl(slug);

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-dark-border">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-neon-green font-bold text-lg hover:opacity-80 transition-opacity"
            >
              ← Latency Zero
            </Link>
            <span className="text-cyber-text-muted/60 hidden sm:inline">/</span>
            <span className="text-white font-medium truncate hidden sm:block">
              {game.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <AdminLink />
            <Link
              href="/games"
              className="px-3 py-1.5 text-sm border border-cyber-dark-border text-cyber-text rounded-lg hover:border-neon-green/50 transition-colors"
            >
              Explorar Jogos
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Game title (mobile) */}
        <h1 className="text-xl font-bold text-white sm:hidden mb-4">
          {game.title}
        </h1>

        {/* Game area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game iframe */}
          <div className="flex-1 min-w-0">
            <div className="bg-cyber-darker rounded-xl overflow-hidden border border-cyber-dark-border">
              <GamePlayer
                gameUrl={gameUrl}
                title={game.title}
                slug={game.slug}
              />
            </div>

            {/* Game info */}
            <div className="mt-6 bg-cyber-dark-surface/50 border border-cyber-dark-border rounded-xl p-5">
              <h2 className="text-lg font-bold text-white mb-2">
                {game.title}
              </h2>
              {game.description && (
                <p className="text-cyber-text-muted text-sm mb-4">{game.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-cyber-text-muted">
                <span>📁 {game.files.length} arquivo(s)</span>
                <span>🎮 {game.playCount} jogada(s)</span>
                <span>
                  📅{" "}
                  {new Date(game.createdAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {game.files.map((file) => (
                  <span
                    key={file}
                    className="text-xs bg-cyber-dark-surface text-cyber-text-muted px-2 py-1 rounded-full"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-cyber-dark-surface/50 border border-cyber-dark-border rounded-xl p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-cyber-text uppercase tracking-wider mb-4">
                Informações
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyber-text-muted">Slug</span>
                  <code className="text-neon-green">{game.slug}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-muted">Tamanho</span>
                  <span className="text-cyber-text">
                    {game.size > 1024 * 1024
                      ? `${(game.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${(game.size / 1024).toFixed(0)} KB`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-muted">Publicado</span>
                  <span className="text-cyber-text">
                    {new Date(game.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-muted">Arquivos</span>
                  <span className="text-cyber-text">{game.files.length}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2.5 bg-cyber-dark-surface text-cyber-text rounded-lg
                             hover:bg-cyber-dark-surface/70 transition-colors text-sm"
                >
                  Abrir em nova aba
                </a>
                <Link
                  href={`/admin/games`}
                  className="block w-full text-center px-4 py-2.5 border border-cyber-dark-border text-cyber-text-muted rounded-lg
                             hover:border-neon-green/50 transition-colors text-sm"
                >
                  Voltar ao Admin
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
