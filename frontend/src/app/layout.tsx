import "./globals.css";
import type { Metadata } from "next";
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
  title: "Latency Zero - Jogos Instantâneos",
  description:
    "Plataforma de jogos web de alta performance com acesso instantâneo e suporte offline.",
  icons: {
    icon: "/favicon.ico",
  },
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
        <AuthProvider>
          <Header />
          <main className="min-h-screen bg-[#030305] text-gray-100">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
