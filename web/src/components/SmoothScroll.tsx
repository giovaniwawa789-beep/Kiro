"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll global.
 *
 * Desligado quando o usuário pede menos movimento — nesse caso o scroll nativo
 * assume, sem nenhuma interpolação.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const pedeMenosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (pedeMenosMovimento) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    let frame = 0;
    const loop = (tempo: number) => {
      lenis.raf(tempo);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // links de âncora passam a usar o scroll interpolado
    const aoClicar = (evento: MouseEvent) => {
      const alvo = (evento.target as HTMLElement | null)?.closest(
        'a[href^="/#"], a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!alvo) return;

      const hash = alvo.getAttribute("href")?.split("#")[1];
      if (!hash) return;

      const destino = document.getElementById(hash);
      if (!destino) return;

      evento.preventDefault();
      lenis.scrollTo(destino, { offset: -88 });
    };

    document.addEventListener("click", aoClicar);

    return () => {
      document.removeEventListener("click", aoClicar);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
