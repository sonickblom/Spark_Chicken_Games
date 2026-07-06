import { GameForm } from "@/components/admin/GameForm";

export const metadata = {
  title: "Novo Jogo | Admin | Latency Zero",
  description: "Publicar novo jogo na plataforma",
};

export default function NewGamePage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Publicar Novo Jogo
        </h1>
        <p className="text-gray-400 mt-1">
          Preencha os dados abaixo para publicar um novo jogo na plataforma
        </p>
      </div>

      <GameForm />
    </div>
  );
}
