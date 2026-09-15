import type { NextConfig } from "next";
import { redirecionamentos } from "./src/content/servicos";

/**
 * Build de preview no GitHub Pages quando PAGES=1.
 * Sem a variável, dev e um deploy na Vercel seguem sem basePath e com
 * otimização de imagem normal.
 */
const paraPages = process.env.PAGES === "1";
const basePath = paraPages ? "/Kiro" : "";

const nextConfig: NextConfig = {
  // Exposto ao cliente para o helper `asset()`: no modo export, o next/image
  // com `unoptimized` não prefixa o basePath sozinho.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },

  /**
   * 301 nas rotas de serviço que mudaram de slug. Permanente, não temporário:
   * 301 transfere a autoridade da URL antiga para a nova; 302 não.
   *
   * No `output: "export"` não há servidor para responder redirect, então a
   * exportação gera páginas-ponte (ver `redirecionamentos` em servicos.ts e o
   * fallback em app/servicos/[slug]).
   */
  async redirects() {
    return redirecionamentos.map((r) => ({
      source: r.de,
      destination: r.para,
      permanent: true,
    }));
  },

  ...(paraPages
    ? {
        output: "export",
        basePath,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
