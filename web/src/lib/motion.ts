/**
 * Variantes de movimento compartilhadas.
 *
 * Regras do projeto: easing [0.22, 1, 0.36, 1] e nenhuma animação acima de
 * 600ms. `prefers-reduced-motion` é tratado no CSS (globals.css) e, nos
 * componentes que precisam, pelo hook useReducedMotion do framer-motion.
 */

import type { Variants, Transition } from "framer-motion";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const transicao: Transition = { duration: 0.55, ease: EASE };

/** Reveal padrão de seção: opacity 0 -> 1, y 32 -> 0. */
export const revelar: Variants = {
  oculto: { opacity: 0, y: 32 },
  visivel: { opacity: 1, y: 0, transition: transicao },
};

/** Container que escalona os filhos. */
export function escalonar(atraso = 0, intervalo = 0.06): Variants {
  return {
    oculto: {},
    visivel: {
      transition: { delayChildren: atraso, staggerChildren: intervalo },
    },
  };
}

/** Palavra do título do hero: y 24 -> 0 com blur 8 -> 0. */
export const palavra: Variants = {
  oculto: { opacity: 0, y: 24, filter: "blur(8px)" },
  visivel: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

/** Configuração de viewport reutilizada em todas as seções. */
export const noViewport = { once: true, amount: 0.3 } as const;
