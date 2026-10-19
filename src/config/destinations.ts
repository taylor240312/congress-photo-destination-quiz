import lulaVencer from "@/assets/lula-vencer.pdf.asset.json";
import lulaPerder from "@/assets/lula-perder.pdf.asset.json";

/** PDFs enviados: vencer para Lula; perder para Flávio Bolsonaro. */
export const LULA_EBOOK_URL = lulaVencer.url;
export const FLAVIO_EBOOK_URL = lulaPerder.url;

export type Destination = "lula" | "flavio";

export function getDestinationUrl(d: Destination): string | null {
  const url = d === "lula" ? LULA_EBOOK_URL : FLAVIO_EBOOK_URL;
  if (url.startsWith("/__l5e/assets-v1/")) return url;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}
