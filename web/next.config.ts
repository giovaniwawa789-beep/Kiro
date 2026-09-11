import type { NextConfig } from "next";

/**
 * Build de preview no GitHub Pages.
 *
 * Ligado só quando PAGES=1, para o `npm run dev` e um deploy futuro em
 * Vercel continuarem sem basePath e com otimização de imagem normal.
 *
 * O site é 100% estático (nenhuma rota usa server action ou API), então o
 * `output: "export"` funciona sem perda de funcionalidade.
 */
const paraPages = process.env.PAGES === "1";

/** Em Project Pages o site é servido em /<repo>, não na raiz do domínio. */
const basePath = paraPages ? "/Kiro" : "";

const nextConfig: NextConfig = {
  // Exposto ao cliente para o helper `asset()`: o next/image em modo
  // unoptimized não prefixa o basePath sozinho.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  ...(paraPages
    ? {
        output: "export",
        basePath,
        // o exportador estático não roda o otimizador de imagem
        images: { unoptimized: true },
        // evita 404 em /sobre -> serve /sobre/index.html
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
