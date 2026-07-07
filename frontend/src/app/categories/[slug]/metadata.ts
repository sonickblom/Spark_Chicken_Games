import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const names: Record<string, string> = {
    all: "Todos os Jogos",
    recent: "Recém Adicionados",
    popular: "Mais Jogados",
  };

  const name = names[slug] || slug;

  return {
    title: `${name} | Latency Zero`,
    description: `Explore jogos da categoria ${name}`,
  };
}
