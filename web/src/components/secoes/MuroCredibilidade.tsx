"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { asset } from "@/lib/asset";
import {
  resultados,
  casos,
  imprensa,
  selos,
  temImprensaVerificada,
} from "@/content/credibilidade";
import { revelar, escalonar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";
import Monta3D from "@/components/webgl3d/Monta3D";

/**
 * Muro de credibilidade 3D.
 *
 * DECISÃO DE ARQUITETURA: o 3D aqui é o palco, não o conteúdo. Os números, os
 * casos e os selos são HTML real, posicionados em CSS 3D (perspective +
 * rotateY/translateZ). Assar esse texto numa textura WebGL daria o mesmo visual
 * e destruiria o que importa numa seção de credibilidade: leitor de tela não lê
 * textura, ninguém copia um número que é pixel, e o Google não indexa. A grade
 * de partículas em Three.js fica atrás, dando profundidade real.
 *
 * O muro inclina seguindo o ponteiro. Com `prefers-reduced-motion` a inclinação
 * é desligada e o muro fica plano — o conteúdo nunca depende do movimento.
 */
export default function MuroCredibilidade() {
  const refPalco = useRef<HTMLDivElement>(null);
  const [inclinacao, setInclinacao] = useState({ x: 0, y: 0 });
  const menosMovimento = useReducedMotion();

  const aoMover = (e: React.PointerEvent) => {
    if (menosMovimento) return;
    const r = refPalco.current?.getBoundingClientRect();
    if (!r) return;
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    // amplitude contida: acima de ~7deg o texto começa a perder legibilidade
    setInclinacao({ x: -ny * 5, y: nx * 7 });
  };

  const aoSair = () => setInclinacao({ x: 0, y: 0 });

  return (
    <section
      id="credibilidade"
      className="relative isolate overflow-hidden border-y border-white/8 py-24 md:py-32"
    >
      {/* palco 3D: só baixa o three quando a seção se aproxima */}
      <Monta3D carregar={() => import("@/components/webgl3d/GradeParticulas")} />
      <div className="noise" aria-hidden />

      <div className="shell relative">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Resultados verificáveis"
            titulo={
              <>
                O que já saiu da operação,{" "}
                <span className="text-primary">com nome e número</span>
              </>
            }
            apoio="Cada dado abaixo tem origem rastreável em material da própria empresa ou em base pública. Nada de estimativa arredondada para impressionar."
          />
        </motion.div>

        {/* ---------- números ---------- */}
        <motion.dl
          variants={escalonar(0.05, 0.06)}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {resultados.map((r) => (
            <motion.div
              key={r.rotulo}
              variants={revelar}
              className="glass rounded-2xl p-6"
            >
              <dt className="font-display text-[clamp(2rem,3.4vw,2.7rem)] font-bold leading-none tabular-nums text-ink">
                {r.valor}
                <span className="text-primary">{r.unidade}</span>
              </dt>
              <dd className="mt-3 text-[13.5px] leading-snug text-body">
                {r.rotulo}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* ---------- muro 3D de casos ---------- */}
        <div
          ref={refPalco}
          onPointerMove={aoMover}
          onPointerLeave={aoSair}
          className="mt-8 [perspective:1400px]"
        >
          <motion.ul
            variants={escalonar(0.05, 0.07)}
            initial="oculto"
            whileInView="visivel"
            viewport={noViewport}
            style={{
              transform: `rotateX(${inclinacao.x}deg) rotateY(${inclinacao.y}deg)`,
              transformStyle: "preserve-3d",
              transition:
                "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            {casos.map((caso, i) => (
              <motion.li
                key={caso.cliente}
                variants={revelar}
                /* Cada card num plano Z diferente: profundidade de verdade, não
                   sombra imitando profundidade. Amplitude baixa de propósito —
                   a ±26px a diferença de escala da perspectiva desalinhava o
                   topo das imagens e lia como bug de layout, não como 3D. */
                style={{
                  transform: `translateZ(${(i % 2 === 0 ? 1 : -1) * 12}px)`,
                }}
                className="glass group overflow-hidden rounded-2xl"
              >
                {caso.imagem ? (
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={asset(caso.imagem)}
                      alt={caso.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent"
                    />
                    <p className="absolute bottom-4 left-5 right-5 font-display text-[15px] font-semibold text-accent">
                      {caso.resultado}
                    </p>
                  </div>
                ) : null}

                <div className="p-6 md:p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {caso.cliente}
                  </p>
                  <h3 className="mt-2.5 text-[19px] leading-snug">
                    {caso.titulo}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-body">
                    {caso.descricao}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* ---------- selos de cadastro ---------- */}
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-14"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-body">
            Cadastro conferível em base pública
          </h3>
          <dl className="mt-5 flex flex-wrap gap-3">
            {selos.map((s) => (
              <div
                key={s.rotulo}
                className="glass flex items-baseline gap-2.5 rounded-full px-5 py-3"
              >
                <dt className="text-[12px] text-body">{s.rotulo}</dt>
                <dd className="font-mono text-[13px] font-medium text-ink">
                  {s.valor}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* ---------- imprensa ---------- */}
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-14"
        >
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-body">
            Imprensa
          </h3>

          {temImprensaVerificada ? (
            <ul className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {imprensa
                .filter((i) => i.verificado)
                .map((i) => (
                  <li key={i.titulo} className="glass rounded-2xl p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      {i.veiculo}
                    </p>
                    <p className="mt-2.5 text-[15px] leading-snug text-ink">
                      {i.titulo}
                    </p>
                    {i.url ? (
                      <a
                        href={i.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-[13px] text-accent underline decoration-accent/40 underline-offset-4"
                      >
                        Ler a matéria
                      </a>
                    ) : null}
                  </li>
                ))}
            </ul>
          ) : (
            /* Sem menção de imprensa verificável nos materiais fornecidos.
               Aviso explícito em vez de logo inventado. */
            <p className="mt-5 inline-flex max-w-2xl items-start gap-2.5 rounded-lg border border-accent/30 bg-accent/8 px-4 py-3 text-[13px] leading-relaxed text-accent">
              <span aria-hidden>⚠</span>
              <span>
                Nenhuma menção de imprensa verificável foi encontrada nos
                materiais fornecidos. Preencha{" "}
                <code className="font-mono text-[12px]">
                  src/content/credibilidade.ts
                </code>{" "}
                com veículo, título, link e data reais. Esta seção não sobe ao ar
                com veículo inventado.
              </span>
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
