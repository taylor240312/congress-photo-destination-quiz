import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  answers: z
    .array(
      z.object({
        theme: z.string().max(100),
        question: z.string().max(300),
        answer: z.string().max(300),
      }),
    )
    .min(1)
    .max(12),
});

export type AnalyzeResult = { decision: "lula" | "flavio" | "insufficient" };

export const analyzeAnswers = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<AnalyzeResult> => {
    const { generateResponse } = await import("@lovable.dev/ai-gateway");
    const transcript = data.answers
      .map((a, i) => `${i + 1}. [${a.theme}] ${a.question}\n   Resposta: ${a.answer}`)
      .join("\n");

    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      instructions:
        "És um classificador editorial neutro. Com base no conjunto completo de respostas de um visitante sobre prioridades políticas no Brasil, decide qual de dois conjuntos de conteúdos editoriais lhe corresponde melhor: 'lula' (prioridades associadas ao campo de Lula: Estado indutor, ampliação de programas sociais, investimento público, controlo de armas) ou 'flavio' (prioridades associadas ao campo de Flávio Bolsonaro: menos impostos e Estado, privatizações, segurança dura, valores tradicionais). Considera todas as respostas, não apenas a última. Se as respostas estiverem equilibradas ou forem insuficientes, devolve 'insufficient'. Não inventes.",
      input: transcript,
      text: {
        format: {
          type: "json_schema",
          name: "decision",
          strict: true,
          schema: {
            type: "object",
            properties: { decision: { type: "string", enum: ["lula", "flavio", "insufficient"] } },
            required: ["decision"],
            additionalProperties: false,
          },
        },
      },
    });

    const r = res as unknown as {
      output_text?: string;
      output?: { content?: { type: string; text?: string }[] }[];
    };
    const text =
      r.output_text ??
      r.output?.flatMap((o) => o.content ?? []).find((c) => c.type === "output_text")?.text ??
      "";
    const parsed = z
      .object({ decision: z.enum(["lula", "flavio", "insufficient"]) })
      .safeParse(JSON.parse(text || "{}"));
    if (!parsed.success) throw new Error("Resposta da análise inválida");
    return parsed.data;
  });
