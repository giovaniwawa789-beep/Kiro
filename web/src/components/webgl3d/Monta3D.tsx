"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { medirCapacidade } from "@/lib/three/capacidade";

/**
 * Portão de entrada do Three.js.
 *
 * Resolve dois problemas que o `next/dynamic` sozinho não resolve:
 *
 *  1. `dynamic()` com SSR ligado mantém o componente na árvore inicial, então o
 *     three.js entrava no First Load JS (medido: 172 -> 317 kB). Aqui o import()
 *     só é disparado quando o elemento chega perto da viewport.
 *
 *  2. Não faz sentido baixar 145 kB de biblioteca 3D num aparelho que vai
 *     recusar a cena. `medirCapacidade()` é consultado ANTES do import: em
 *     Save-Data, pouca memória, poucos núcleos ou sem WebGL, o download nunca
 *     acontece.
 *
 * O conteúdo real da seção continua em HTML renderizado no servidor — este
 * componente só cuida da camada decorativa.
 */
export default function Monta3D({
  carregar,
  className = "",
}: {
  carregar: () => Promise<{ default: ComponentType }>;
  className?: string;
}) {
  const refAlvo = useRef<HTMLDivElement>(null);
  const [Camada, setCamada] = useState<ComponentType | null>(null);

  // mantém a função de import estável entre renders
  const refCarregar = useRef(carregar);
  refCarregar.current = carregar;

  useEffect(() => {
    const alvo = refAlvo.current;
    if (!alvo) return;

    // aparelho não aguenta: não baixa a biblioteca
    if (!medirCapacidade().pode) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        refCarregar
          .current()
          .then((modulo) => setCamada(() => modulo.default))
          .catch(() => {
            /* falha de rede no chunk: a seção segue sem a camada 3D */
          });
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );

    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return (
    <div ref={refAlvo} aria-hidden className={`absolute inset-0 ${className}`}>
      {Camada ? <Camada /> : null}
    </div>
  );
}
