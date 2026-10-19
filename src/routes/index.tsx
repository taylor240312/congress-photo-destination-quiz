import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/quiz/Quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Que Brasil queres? — Quiz político interativo" },
      { name: "description", content: "Responde a 9 perguntas rápidas sobre economia, segurança, saúde e educação no Brasil." },
      { property: "og:title", content: "Que Brasil queres? — Quiz político interativo" },
      { property: "og:description", content: "9 perguntas rápidas sobre as prioridades para o futuro do Brasil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Quiz,
});
