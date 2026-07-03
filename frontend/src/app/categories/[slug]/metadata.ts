import { Metadata } from "next";
import { getMockCategory } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getMockCategory(slug);

  if (!category) {
    return { title: "Categoria não encontrada" };
  }

  return {
    title: `${category.name} | Spark Chicken Games`,
    description: `Explore jogos da categoria ${category.name}. ${category.gameCount} jogos disponíveis.`,
    openGraph: {
      title: `${category.name} | Spark Chicken Games`,
      description: `Explore jogos da categoria ${category.name}`,
      type: "website",
    },
  };
}
