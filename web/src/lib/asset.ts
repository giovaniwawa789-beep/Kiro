/**
 * Prefixa o caminho de um arquivo estático com o basePath da build.
 *
 * Por que isso existe: no `output: "export"` com `images.unoptimized`, o
 * next/image usa o `src` como veio e NÃO acrescenta o basePath. Num deploy em
 * subcaminho (GitHub Pages: /Kiro), todas as imagens apontariam para a raiz do
 * domínio e quebrariam. `next/link` e o CSS já lidam com basePath sozinhos —
 * o problema é só das imagens.
 *
 * Em dev e num deploy na raiz do domínio (Vercel), NEXT_PUBLIC_BASE_PATH é
 * vazio e a função devolve o caminho intacto.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(caminho: string): string {
  if (!caminho.startsWith("/")) return caminho;
  return `${BASE}${caminho}`;
}
