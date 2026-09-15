"use client";

import { useEffect } from "react";

/**
 * Rastreamento de conversão nos CTAs.
 *
 * Um único listener no documento, capturando cliques em qualquer elemento com
 * `data-cta`. Melhor que instrumentar cada botão: novo CTA passa a ser rastreado
 * só por ganhar o atributo, sem tocar nesta camada.
 *
 * Não embute Google Analytics, GTM nem Meta Pixel: instalar tag de terceiro sem
 * base legal definida é problema de LGPD, e cada script desses custa
 * performance. Os eventos são empurrados para `window.dataLayer` — se você
 * instalar o GTM, eles já chegam lá; se não, ficam disponíveis no console.
 *
 * TODO: informar qual ferramenta será usada (GA4, GTM, Meta, RD Station) para
 * eu ligar o disparo e incluir o aviso de cookies correspondente.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export default function Rastreio() {
  useEffect(() => {
    const aoClicar = (evento: MouseEvent) => {
      const alvo = (evento.target as HTMLElement | null)?.closest("[data-cta]");
      if (!alvo) return;

      const nome = alvo.getAttribute("data-cta") ?? "desconhecido";
      const texto = (alvo.textContent ?? "").trim().slice(0, 60);

      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        event: "clique_cta",
        cta_id: nome,
        cta_texto: texto,
        pagina: window.location.pathname,
      });

      if (process.env.NODE_ENV === "development") {
        console.info("[cta]", nome, "→", texto);
      }
    };

    document.addEventListener("click", aoClicar, { capture: true });
    return () =>
      document.removeEventListener("click", aoClicar, { capture: true });
  }, []);

  return null;
}
