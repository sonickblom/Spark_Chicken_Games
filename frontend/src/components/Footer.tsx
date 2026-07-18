import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { MessageCircle, Twitter, Github, Youtube } from "lucide-react";

interface FooterProps {
  className?: string;
}

const footerLinks = {
  plataforma: [
    { label: "Todos os Jogos", href: "/games" },
    { label: "Categorias", href: "/categories" },
    { label: "Novos Jogos", href: "/games?sort=newest" },
    { label: "Populares", href: "/games?sort=popular" },
    { label: "Em Destaque", href: "/games?sort=featured" },
  ],
  empresa: [
    { label: "Sobre Nós", href: "/about" },
    { label: "Carreiras", href: "/careers" },
    { label: "Imprensa", href: "/press" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "/contact" },
  ],
  suporte: [
    { label: "Central de Ajuda", href: "/help" },
    { label: "Termos de Uso", href: "/terms" },
    { label: "Política de Privacidade", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
    { label: "Diretrizes da Comunidade", href: "/guidelines" },
  ],
  desenvolvedores: [
    { label: "API", href: "/api" },
    { label: "SDK", href: "/sdk" },
    { label: "Documentação", href: "/docs" },
    { label: "Submeter Jogo", href: "/submit" },
    { label: "Status da API", href: "/status" },
  ],
} as const;

const socialLinks = [
  { label: "Discord", href: "https://discord.com", Icon: MessageCircle },
  { label: "Twitter", href: "https://twitter.com", Icon: Twitter },
  { label: "GitHub", href: "https://github.com", Icon: Github },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
] as const;

const linkColumns = [
  { title: "Plataforma", key: "plataforma" as const },
  { title: "Empresa", key: "empresa" as const },
  { title: "Suporte", key: "suporte" as const },
  { title: "Desenvolvedores", key: "desenvolvedores" as const },
];

const Footer = ({ className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "relative bg-cyber-darker text-cyber-text",
        className,
      )}
    >
      {/* ── Green gradient top border ── */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/60 to-transparent shadow-[0_0_20px_rgba(0,255,65,0.4),0_0_40px_rgba(0,255,65,0.2)]" />
      </div>

      {/* ── Grid pattern background ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-5 lg:gap-8">
          {/* ── Logo column ── */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="group mb-6 inline-flex items-center gap-2.5"
              aria-label="Latency Zero - Home"
            >
              <svg
                className="h-8 w-8 text-neon-green drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:drop-shadow-[0_0_16px_rgba(0,255,65,0.8)]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="font-sans text-lg font-bold tracking-wider text-white transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:text-neon-green">
                LATENCY ZERO
              </span>
            </Link>
            <p className="mb-8 max-w-[14rem] font-mono text-xs leading-relaxed text-cyber-text-muted">
              Plataforma de jogos web de alta performance com acesso
              instantâneo e suporte offline.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const { Icon } = social;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={cn(
                      "flex size-9 items-center justify-center rounded-full",
                      "border border-white/[0.06] bg-white/[0.03]",
                      "text-cyber-text-muted",
                      "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                      "hover:border-neon-green/40 hover:text-neon-green hover:shadow-[0_0_16px_rgba(0,255,65,0.25)]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-darker",
                    )}
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Link columns ── */}
          {linkColumns.map((col) => (
            <nav key={col.key} aria-label={`Links da ${col.title}`}>
              <h3 className="mb-5 font-sans text-xs font-bold tracking-[0.15em] uppercase text-white">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {footerLinks[col.key].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group/link inline-flex items-center gap-1.5 font-mono text-xs text-cyber-text-muted",
                        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        "hover:text-neon-green hover:drop-shadow-[0_0_6px_rgba(0,255,65,0.4)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-green focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-darker rounded",
                      )}
                    >
                      <span className="inline-block size-1 rounded-full bg-neon-green/0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover/link:bg-neon-green group-hover/link:shadow-[0_0_4px_rgba(0,255,65,0.6)]" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Green glow line separator ── */}
        <div className="relative my-14 h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-32 rounded-full bg-neon-green/30 blur-md" />
        </div>

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-mono text-xs text-cyber-text-muted">
            © {currentYear} Latency Zero. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 font-mono text-[10px] tracking-wider text-cyber-text-muted/60 uppercase">
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-neon-green/40" />
              Next.js 15
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-neon-green/40" />
              TypeScript
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block size-1 rounded-full bg-neon-green/40" />
              Tailwind CSS
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
