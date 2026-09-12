"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cursor customizado: círculo que expande sobre elementos clicáveis.
 *
 * Só no desktop com ponteiro fino — em toque não existe cursor, e com
 * `prefers-reduced-motion` fica desligado. A posição é escrita direto no
 * transform dentro de requestAnimationFrame, sem re-render do React.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);
  const [sobreClicavel, setSobreClicavel] = useState(false);

  useEffect(() => {
    const podeUsar =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!podeUsar) return;

    setAtivo(true);

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let alvoX = x;
    let alvoY = y;
    let frame = 0;

    const aoMover = (e: PointerEvent) => {
      alvoX = e.clientX;
      alvoY = e.clientY;
      const el = e.target as HTMLElement | null;
      setSobreClicavel(
        Boolean(el?.closest('a, button, summary, [role="button"], input, textarea')),
      );
    };

    const loop = () => {
      x += (alvoX - x) * 0.18;
      y += (alvoY - y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", aoMover, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", aoMover);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (!ativo) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden lg:block"
    >
      <div
        className={`rounded-full border transition-[width,height,background-color,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          sobreClicavel
            ? "h-10 w-10 border-accent bg-accent/15"
            : "h-4 w-4 border-white/40 bg-white/5"
        }`}
      />
    </div>
  );
}
