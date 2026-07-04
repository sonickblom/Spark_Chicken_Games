import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

const Footer = ({ className = "" }: FooterProps) => {
  const currentYear = new Date().getFullYear();

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
  };

  const socialLinks = [
    { label: "Discord", href: "https://discord.com", icon: "💬" },
    { label: "Twitter", href: "https://twitter.com", icon: "🐦" },
    { label: "GitHub", href: "https://github.com", icon: "💻" },
    { label: "YouTube", href: "https://youtube.com", icon: "▶️" },
  ];

  return (
    <footer className={cn("bg-black border-t border-gray-800", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 mb-4"
              aria-label="Latency Zero - Home"
            >
              <svg
                className="h-8 w-8 text-neon-green"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="font-bold text-xl text-white">Latency Zero</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Plataforma de jogos web de alta performance com acesso instantâneo
              e suporte offline.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-neon-green transition-colors text-lg"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Links da Plataforma">
            <h3 className="font-semibold text-white mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.plataforma.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-green transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links da Empresa">
            <h3 className="font-semibold text-white mb-4">Empresa</h3>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-green transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links de Suporte">
            <h3 className="font-semibold text-white mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.suporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-green transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Links para Desenvolvedores">
            <h3 className="font-semibold text-white mb-4">Desenvolvedores</h3>
            <ul className="space-y-3">
              {footerLinks.desenvolvedores.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-neon-green transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Latency Zero. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span>Feito com Next.js 15</span>
              <span>TypeScript</span>
              <span>Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

export default Footer;
