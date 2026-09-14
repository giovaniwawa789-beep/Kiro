"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { site, linkWhatsApp } from "@/content/site";
import { palavra, escalonar, EASE } from "@/lib/motion";
import Botao from "@/components/ui/Botao";

/**
 * O campo de fibras entra fora do bundle inicial: o hero pinta primeiro com a
 * aurora em CSS (LCP intacto) e o WebGL sobe depois, por cima. Se não carregar
 * ou o dispositivo não aguentar, a aurora continua sendo o fundo.
 */
const FiberField = dynamic(() => import("@/components/webgl/FiberField"), {
  ssr: false,
});

const TITULO = "Do inventário legal ao produto acabado, sem passar pelo aterro.";
const PROVAS = [
  "PGRS e conformidade",
  "Coleta com MTR",
  "Aterro Zero",
  "Upcycle rastreado",
];

export default function Hero() {
  const menosMovimento = useReducedMotion();
  const palavras = TITULO.split(" ");

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-44">
      {/* Camada 1 — aurora em CSS: pinta imediato e é o fallback definitivo.
          Ambas as camadas são absolutas: não empurram layout (sem CLS). */}
      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      {/* Camada 2 — campo de fibras em WebGL, por cima, quando disponível. */}
      <FiberField />

      <div className="noise" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-base"
      />

      <div className="shell relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[12px] text-body backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-accent"
          />
          Consultoria e operação · Resíduos têxteis · São Paulo
        </motion.p>

        {/* Título revelado palavra por palavra. O texto completo fica acessível
            a leitores de tela via aria-label; as palavras são decorativas. */}
        <motion.h1
          aria-label={TITULO}
          variants={escalonar(0.1, 0.06)}
          initial="oculto"
          animate="visivel"
          className="max-w-5xl text-[clamp(2.75rem,7vw,6rem)] leading-[1.02]"
        >
          {/* O espaço entre as palavras é um nó de texto real, não margem:
              assim o textContent do h1 sai com espaços (importante para SEO e
              para o usuário copiar o texto). */}
          {palavras.map((p, i) => (
            <span key={`${p}-${i}`}>
              <motion.span
                variants={menosMovimento ? undefined : palavra}
                aria-hidden
                className="inline-block"
              >
                {i >= palavras.length - 2 ? (
                  <span className="text-primary">{p}</span>
                ) : (
                  p
                )}
              </motion.span>
              {i < palavras.length - 1 ? " " : ""}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55, ease: EASE }}
          className="mt-8 max-w-2xl text-[17px] leading-relaxed text-body md:text-[19px]"
        >
          Assumimos a cadeia inteira do resíduo têxtil da sua indústria: o PGRS
          que o órgão ambiental exige, a coleta com MTR, a descaracterização
          peça por peça e o retorno do material como produto de marca.
          <span className="text-ink"> Uma custódia, um responsável, um relatório.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {/* CTA primário de intenção alta: "diagnóstico" qualifica melhor que
              "fale conosco" e é o primeiro passo real do serviço. */}
          <Botao
            href={linkWhatsApp(
              "Olá! Gostaria de solicitar um diagnóstico de resíduos têxteis para a minha empresa.",
            )}
            externo
          >
            Solicitar diagnóstico
          </Botao>
          <Botao href="/#hierarquia" variante="secundario">
            Onde o material termina
          </Botao>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
          className="mt-12 flex flex-wrap gap-2.5"
        >
          {PROVAS.map((prova) => (
            <li
              key={prova}
              className="glass rounded-full px-4 py-2 text-[13px] text-ink"
            >
              {prova}
            </li>
          ))}
        </motion.ul>

        <p className="mt-10 text-[12.5px] text-body">
          {site.contato.cidade}/{site.contato.uf} · Cadastro no SINIR como{" "}
          {site.contato.perfilMtr} · Emissão de MTR a cada coleta
        </p>
      </div>
    </section>
  );
}
