/**
 * Destinos dos ebooks. PREENCHER com as URLs reais (https://...).
 * Enquanto estiverem vazias, o quiz não redireciona e mostra um aviso discreto.
 */
export const LULA_EBOOK_URL = "";
export const FLAVIO_EBOOK_URL = "";

export type Destination = "lula" | "flavio";

export function getDestinationUrl(d: Destination): string | null {
  const url = d === "lula" ? LULA_EBOOK_URL : FLAVIO_EBOOK_URL;
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}
