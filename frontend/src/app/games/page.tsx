import type { Metadata } from "next";
import { GamesClient } from "./GamesClient";

export const metadata: Metadata = {
  title: "Catálogo de Jogos - Latency Zero",
  description:
    "Explore nossa biblioteca completa de jogos. Filtre por categoria, popularidade e mais.",
  openGraph: {
    title: "Catálogo de Jogos - Latency Zero",
    description: "Explore nossa biblioteca completa de jogos.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function GamesPage() {
  return <GamesClient />;
}
