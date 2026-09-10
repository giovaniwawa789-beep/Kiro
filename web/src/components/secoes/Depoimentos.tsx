"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import { revelar, escalonar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";

/**
 * TODO: substituir os depoimentos de `site.depoimentos` por textos reais, com
 * nome, cargo, empresa e autorização de uso. Enquanto forem placeholder, a
 * seção exibe um aviso explícito para não ir ao ar por engano.
 */
export default function Depoimentos() {
  return (
    <section id="depoimentos" className="relative py-24 md:py-32">
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Depoimentos"
            titulo={
              <>
                O que dizem <span className="text-primary">nossos clientes</span>
              </>
            }
          />
          <p className="mt-5 inline-flex items-start gap-2.5 rounded-lg border border-accent/30 bg-accent/8 px-4 py-3 text-[13px] text-accent">
            <span aria-hidden>⚠</span>
            <span>
              Conteúdo provisório. Substituir por depoimentos reais em{" "}
              <code className="font-mono text-[12px]">src/content/site.ts</code>{" "}
              antes de publicar.
            </span>
          </p>
        </motion.div>

        <motion.ul
          variants={escalonar(0.05, 0.07)}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {site.depoimentos.map((d, i) => (
            <motion.li
              key={i}
              variants={revelar}
              className="glass flex flex-col rounded-2xl p-7"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.3}
                className="h-7 w-7 text-primary/50"
              >
                <path d="M9 7H5.5A2.5 2.5 0 0 0 3 9.5V12h6zM21 7h-3.5A2.5 2.5 0 0 0 15 9.5V12h6z" />
                <path d="M3 12v2a4 4 0 0 0 4 4M15 12v2a4 4 0 0 0 4 4" />
              </svg>
              <blockquote className="mt-5 flex-1 text-[15px] leading-relaxed text-body">
                {d.texto}
              </blockquote>
              <footer className="mt-6 border-t border-white/8 pt-5">
                <p className="text-[14px] font-semibold text-ink">{d.autor}</p>
                <p className="mt-0.5 text-[13px] text-body">
                  {d.cargo} · {d.empresa}
                </p>
              </footer>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
