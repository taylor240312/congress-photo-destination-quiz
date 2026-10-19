import type { Lean } from "@/data/questions";

export type Tally = { lula: number; flavio: number };

export function tally(leans: Lean[]): Tally {
  return leans.reduce<Tally>(
    (t, l) => (l === "neutral" ? t : { ...t, [l]: t[l] + 1 }),
    { lula: 0, flavio: 0 },
  );
}

/** Regra de desempate transparente: maioria simples; empate => null (pede pergunta extra). */
export function deterministicDecision(leans: Lean[]): "lula" | "flavio" | null {
  const t = tally(leans);
  if (t.lula > t.flavio) return "lula";
  if (t.flavio > t.lula) return "flavio";
  return null;
}
