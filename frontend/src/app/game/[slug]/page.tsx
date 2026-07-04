import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Star,
  Calendar,
  Monitor,
  Gamepad2,
  Tag,
  Heart,
  Share2,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  Shield,
  Globe,
  Download,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GameGrid } from "@/components/GameGrid";
import { GameEmbed } from "@/components/game/GameEmbed";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { MotionDiv } from "@/components/ui/Motion";
import { getMockGame, getMockRelatedGames } from "@/lib/mock-data";
import { formatNumber, formatDate, formatPrice } from "@/lib/utils";

interface GamePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: GamePageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getMockGame(slug);

  if (!game) {
    return { title: "Jogo não encontrado" };
  }

  return {
    title: `${game.title} | Spark Chicken Games`,
    description: game.shortDescription,
    openGraph: {
      title: game.title,
      description: game.shortDescription,
      type: "website",
      images: game.bannerImage
        ? [{ url: game.bannerImage }]
        : game.coverImage
          ? [{ url: game.coverImage }]
          : [],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = await getMockGame(slug);
  const relatedGames = game ? await getMockRelatedGames(game.id) : [];

  if (!game) {
    notFound();
  }

  const hasDiscount = game.discount && game.discount > 0;
  const platforms = game.platforms ?? [];
  const genres = game.genre ?? [];
  const tags = game.tags ?? [];
  const languages = game.languages ?? [];
  const screenshots = game.screenshots ?? [];

  return (
    <div className="min-h-screen bg-cyber-dark">
      <Header />

      <main id="main-content" className="pt-16 lg:pt-20">
        {/* Hero Banner */}
        <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={game.bannerImage || game.coverImage}
              alt=""
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-cyber-dark/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-dark/80 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
            <div className="max-w-3xl">
              <MotionDiv
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-wrap items-center gap-3 mb-4"
              >
                {hasDiscount && (
                  <span className="px-3 py-1 bg-red-500 text-cyber-dark text-sm font-bold rounded-full animate-pulse-neon">
                    -{game.discount}%
                  </span>
                )}
                {game.isNewRelease && (
                  <span className="px-3 py-1 bg-cyber-neon text-cyber-dark text-sm font-bold rounded-full">
                    Novo Lançamento
                  </span>
                )}
                {game.isFree && (
                  <span className="px-3 py-1 bg-green-500 text-cyber-dark text-sm font-bold rounded-full">
                    Gratuito
                  </span>
                )}
                {game.isEarlyAccess && (
                  <span className="px-3 py-1 bg-yellow-500 text-cyber-dark text-sm font-bold rounded-full">
                    Acesso Antecipado
                  </span>
                )}
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono text-cyber-text mb-4"
              >
                {game.title}
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex flex-wrap items-center gap-6 text-cyber-text-muted mb-6"
              >
                <div className="flex items-center gap-2">
                  <Star
                    className="w-5 h-5 text-yellow-400"
                    aria-hidden="true"
                  />
                  <span className="font-semibold text-cyber-text">
                    {game.rating.toFixed(1)}
                  </span>
                  <span>({formatNumber(game.reviewCount)} avaliações)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  <span>
                    {formatDate(game.releaseDate, {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" aria-hidden="true" />
                  <span>{platforms.join(", ")}</span>
                </div>
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-cyber-text-muted mb-8 max-w-2xl"
              >
                {game.shortDescription}
              </MotionDiv>

              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  {game.originalPrice && game.originalPrice > game.price ? (
                    <>
                      <span className="text-xl text-cyber-text-muted line-through">
                        {formatPrice(game.originalPrice)}
                      </span>
                      <span className="text-3xl font-bold text-cyber-neon">
                        {formatPrice(game.price)}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-cyber-neon">
                      {game.isFree ? "Gratuito" : formatPrice(game.price)}
                    </span>
                  )}
                </div>
                <Button
                  size="xl"
                  className="group"
                  leftIcon={<Download className="w-5 h-5" />}
                >
                  {game.isFree ? "Jogar Grátis" : "Comprar Agora"}
                  <ArrowRight
                    className="w-5 h-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  leftIcon={<Heart className="w-5 h-5" />}
                >
                  <span className="hidden sm:inline">Favoritar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="xl"
                  leftIcon={<Share2 className="w-5 h-5" />}
                >
                  <span className="hidden sm:inline">Compartilhar</span>
                </Button>
              </MotionDiv>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Game Player */}
                {game.iframeUrl && (
                  <GameEmbed 
                    gameUrl={game.iframeUrl} 
                    coverImage={game.coverImage || game.bannerImage} 
                    title={game.title} 
                  />
                )}

                {/* About Section */}
                <Card padding="lg">
                  <CardHeader>
                    <CardTitle>Sobre este Jogo</CardTitle>
                    <CardDescription>
                      Tudo o que você precisa saber antes de jogar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="prose prose-invert max-w-none">
                    <p className="text-cyber-text-muted leading-relaxed mb-6">
                      {game.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                          <Gamepad2
                            className="w-5 h-5 text-cyber-neon"
                            aria-hidden="true"
                          />
                          Desenvolvedor & Editor
                        </h4>
                        <p className="text-cyber-text-muted">
                          <strong className="text-cyber-text">
                            Desenvolvedor:
                          </strong>{" "}
                          {game.developer}
                          <br />
                          <strong className="text-cyber-text">
                            Editor:
                          </strong>{" "}
                          {game.publisher}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                          <Calendar
                            className="w-5 h-5 text-cyber-neon"
                            aria-hidden="true"
                          />
                          Lançamento
                        </h4>
                        <p className="text-cyber-text-muted">
                          {formatDate(game.releaseDate, {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                        <Tag
                          className="w-5 h-5 text-cyber-neon"
                          aria-hidden="true"
                        />
                        Gêneros & Tags
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-3 py-1 bg-cyber-dark-surface border border-cyber-dark-border rounded-full text-sm text-cyber-neon"
                          >
                            {genre}
                          </span>
                        ))}
                        {tags.slice(0, 8).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-cyber-dark-surface border border-cyber-dark-border rounded-full text-sm text-cyber-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {languages.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                          <Globe
                            className="w-5 h-5 text-cyber-neon"
                            aria-hidden="true"
                          />
                          Idiomas Disponíveis
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {languages.map((lang) => (
                            <span
                              key={lang}
                              className="px-3 py-1 bg-cyber-dark-surface border border-cyber-dark-border rounded-full text-sm text-cyber-text"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {game.ageRating && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                          <Shield
                            className="w-5 h-5 text-cyber-neon"
                            aria-hidden="true"
                          />
                          Classificação Etária
                        </h4>
                        <span className="px-3 py-1 bg-cyber-dark-surface border border-cyber-dark-border rounded-full text-sm text-cyber-text">
                          {game.ageRating}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* System Requirements */}
                {game.systemRequirements && (
                  <Card padding="lg">
                    <CardHeader>
                      <CardTitle>Requisitos do Sistema</CardTitle>
                      <CardDescription>
                        Verifique se seu sistema pode rodar este jogo
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                            <CheckCircle
                              className="w-5 h-5 text-green-500"
                              aria-hidden="true"
                            />
                            Mínimos
                          </h4>
                          <dl className="space-y-2 text-sm">
                            {Object.entries(
                              game.systemRequirements.minimum,
                            ).map(([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between py-2 border-b border-cyber-dark-border"
                              >
                                <dt className="text-cyber-text-muted capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </dt>
                                <dd className="text-cyber-text font-medium">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                        <div>
                          <h4 className="font-semibold text-cyber-text mb-3 flex items-center gap-2">
                            <Star
                              className="w-5 h-5 text-yellow-500"
                              aria-hidden="true"
                            />
                            Recomendados
                          </h4>
                          <dl className="space-y-2 text-sm">
                            {Object.entries(
                              game.systemRequirements.recommended,
                            ).map(([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between py-2 border-b border-cyber-dark-border"
                              >
                                <dt className="text-cyber-text-muted capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </dt>
                                <dd className="text-cyber-text font-medium">
                                  {value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Screenshots */}
                {screenshots.length > 0 && (
                  <Card padding="lg">
                    <CardHeader>
                      <CardTitle>Capturas de Tela</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {screenshots.map((screenshot, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer"
                          >
                            <Image
                              src={screenshot}
                              alt={`Screenshot ${index + 1} de ${game.title}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Purchase Card */}
                <Card padding="lg" className="sticky top-24">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-cyber-neon mb-2">
                      {game.isFree ? "Gratuito" : formatPrice(game.price)}
                    </div>
                    {game.originalPrice && game.originalPrice > game.price && (
                      <p className="text-cyber-text-muted line-through">
                        {formatPrice(game.originalPrice)}
                      </p>
                    )}
                    {hasDiscount && (
                      <span className="inline-block mt-2 px-3 py-1 bg-red-500 text-cyber-dark text-sm font-bold rounded-full">
                        Economize {game.discount}%
                      </span>
                    )}
                  </div>

                  <Button
                    className="w-full mb-3"
                    size="lg"
                    leftIcon={<Download className="w-5 h-5" />}
                  >
                    {game.isFree ? "Jogar Grátis" : "Comprar Agora"}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full mb-3"
                    leftIcon={<Heart className="w-5 h-5" />}
                  >
                    Adicionar à Lista de Desejos
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full mb-6"
                    leftIcon={<Share2 className="w-5 h-5" />}
                  >
                    Compartilhar
                  </Button>

                  <div className="border-t border-cyber-dark-border pt-6">
                    <h4 className="font-semibold text-cyber-text mb-4">
                      Links Oficiais
                    </h4>
                    <div className="space-y-2">
                      {game.website && (
                        <a
                          href={game.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-cyber-text-muted hover:text-cyber-neon transition-colors"
                        >
                          <ExternalLink
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                          Site Oficial
                        </a>
                      )}
                      {game.steamUrl && (
                        <a
                          href={game.steamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-cyber-text-muted hover:text-cyber-neon transition-colors"
                        >
                          <Monitor className="w-4 h-4" aria-hidden="true" />
                          Steam
                        </a>
                      )}
                      {game.epicUrl && (
                        <a
                          href={game.epicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-cyber-text-muted hover:text-cyber-neon transition-colors"
                        >
                          <Gamepad2 className="w-4 h-4" aria-hidden="true" />
                          Epic Games
                        </a>
                      )}
                      {game.gogUrl && (
                        <a
                          href={game.gogUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-cyber-text-muted hover:text-cyber-neon transition-colors"
                        >
                          <Download className="w-4 h-4" aria-hidden="true" />
                          GOG
                        </a>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Related Games */}
                {relatedGames.length > 0 && (
                  <Card padding="lg">
                    <CardHeader>
                      <CardTitle>Jogos Relacionados</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <GameGrid games={relatedGames} variant="compact" />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
