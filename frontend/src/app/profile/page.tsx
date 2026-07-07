import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "Meu Perfil - Latency Zero",
  description:
    "Gerencie seu perfil, veja seu progresso, jogos favoritos e histórico de jogo.",
  openGraph: {
    title: "Meu Perfil - Latency Zero",
    description: "Gerencie seu perfil na Latency Zero.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
