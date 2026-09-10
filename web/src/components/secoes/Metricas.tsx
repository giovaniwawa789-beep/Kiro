"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";

/** Contador que anima de 0 ao valor final quando entra na viewport. */
function Contador({ valor, sufixo }: { valor: number; sufixo: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true, amount: 0.5 });
  const menosMovimento = useReducedMotion();
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (!visivel) return;
    if (menosMovimento || valor === 0) {
      setAtual(valor);
      return;
    }

    const duracao = 600; // regra do projeto: nada acima de 600ms
    const inicio = performance.now();
    let frame = 0;

    const passo = (agora: number) => {
      const t = Math.min((agora - inicio) / duracao, 1);
      // easeOutCubic, alinhado ao easing da marca
      setAtual(Math.round(valor * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(passo);
    };

    frame = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(frame);
  }, [visivel, valor, menosMovimento]);

  return (
    <span ref={ref} className="tabular-nums">
      {atual.toLocaleString("pt-BR")}
      {sufixo}
    </span>
  );
}

export default function Metricas() {
  return (
    <section
      aria-label="Números da operação"
      className="border-y border-white/8 bg-surface/40"
    >
      <div className="shell grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-4">
        {site.metricas.map((m) => (
          <div
            key={m.rotulo}
            className="px-1 py-10 sm:px-6 lg:px-8"
          >
            <p className="font-display text-[clamp(2.1rem,4vw,3rem)] font-bold leading-none text-ink">
              <Contador valor={m.valor} sufixo={m.sufixo} />
            </p>
            <p className="mt-4 max-w-[26ch] text-[14px] leading-snug text-body">
              {m.rotulo}
            </p>
            <p className="mt-2 text-[12px] text-body">{m.nota}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
