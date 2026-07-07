import type { Metadata } from "next";
import { CategoriesClient } from "./CategoriesClient";

export const metadata: Metadata = {
  title: "Categorias - Latency Zero",
  description:
    "Explore jogos por categoria. Encontre os melhores jogos de Ação, Aventura, RPG, Estratégia e muito mais.",
  openGraph: {
    title: "Categorias - Latency Zero",
    description: "Explore jogos por categoria.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
