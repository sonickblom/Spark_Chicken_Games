import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/auth-context";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Latency Zero - Jogos Instantâneos",
    template: "%s | Latency Zero",
  },
  description:
    "Plataforma de jogos web de alta performance com acesso instantâneo e suporte offline.",
  keywords: [
    "jogos online",
    "jogos web",
    "gratuito",
    "offline",
    "navegador",
    "Spark Chicken Games",
    "Latency Zero",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Latency Zero",
    description:
      "Plataforma de jogos web de alta performance com acesso instantâneo e suporte offline.",
    siteName: "Latency Zero",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Latency Zero",
    description:
      "Plataforma de jogos web de alta performance com acesso instantâneo e suporte offline.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body
        className={`${orbitron.variable} ${jetbrainsMono.variable} font-mono antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-neon-green focus:text-black focus:rounded-lg focus:font-bold"
        >
          Pular para o conteúdo principal
        </a>
        <AuthProvider>
          <Header />
          <main id="main-content" className="min-h-screen bg-cyber-darker text-cyber-text">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
