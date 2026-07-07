import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getUploadedGame, getGameUrl } from "@/lib/game-storage";
import GamePlayer from "@/app/play/[slug]/GamePlayer";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getUploadedGame(slug);

  if (!game) {
    return { title: "Jogo não encontrado | Latency Zero" };
  }

  return {
    title: `${game.title} | Latency Zero`,
    description: game.description || `Jogue ${game.title} online grátis`,
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getUploadedGame(slug);
  const gameUrl = getGameUrl(slug);

  if (!game) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-neon-green font-bold text-lg hover:opacity-80 transition-opacity"
            >
              ← Latency Zero
            </Link>
            <span className="text-gray-600 hidden sm:inline">/</span>
            <span className="text-white font-medium truncate hidden sm:block">
              {game.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/games"
              className="px-3 py-1.5 text-sm border border-gray-700 text-gray-300 rounded-lg hover:border-neon-green/50 transition-colors"
            >
              Explorar Jogos
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Game area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Game iframe */}
          <div className="flex-1 min-w-0">
            <div className="bg-black rounded-xl overflow-hidden border border-gray-800">
              <GamePlayer
                gameUrl={gameUrl}
                title={game.title}
                slug={game.slug}
              />
            </div>

            {/* Game info */}
            <div className="mt-6 bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h1 className="text-2xl font-bold text-white mb-2">
                {game.title}
              </h1>
              {game.description && (
                <p className="text-gray-400 mb-4">{game.description}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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
                <span>
                  💾{" "}
                  {game.size > 1024 * 1024
                    ? `${(game.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${(game.size / 1024).toFixed(0)} KB`}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {game.files.map((file) => (
                  <span
                    key={file}
                    className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full"
                  >
                    {file}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Informações
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Slug</span>
                  <code className="text-neon-green">{game.slug}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tamanho</span>
                  <span className="text-gray-300">
                    {game.size > 1024 * 1024
                      ? `${(game.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${(game.size / 1024).toFixed(0)} KB`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Publicado</span>
                  <span className="text-gray-300">
                    {new Date(game.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Arquivos</span>
                  <span className="text-gray-300">{game.files.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jogadas</span>
                  <span className="text-gray-300">{game.playCount}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <a
                  href={gameUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-4 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Abrir em nova aba
                </a>
              </div>
            </div>
          </aside>
        </div>

        {/* Back to games */}
        <div className="mt-8 text-center">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-green transition-colors"
          >
            ← Voltar para todos os jogos
          </Link>
        </div>
      </main>
    </div>
  );
}
