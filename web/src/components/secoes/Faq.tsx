"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";
import { revelar, noViewport, EASE } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";

export default function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 md:py-32">
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Perguntas frequentes"
            titulo={
              <>
                O que as empresas <span className="text-primary">mais perguntam</span>
              </>
            }
          />
        </motion.div>

        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-12 max-w-3xl"
        >
          <ul className="border-t border-white/8">
            {site.faq.map((item, i) => {
              const estaAberto = aberto === i;
              const idPainel = `faq-painel-${i}`;
              const idBotao = `faq-botao-${i}`;

              return (
                <li key={item.pergunta} className="border-b border-white/8">
                  <h3>
                    <button
                      type="button"
                      id={idBotao}
                      aria-expanded={estaAberto}
                      aria-controls={idPainel}
                      onClick={() => setAberto(estaAberto ? null : i)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="font-display text-[17px] font-semibold text-ink md:text-[19px]">
                        {item.pergunta}
                      </span>
                      <span
                        aria-hidden
                        className={`mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full border border-white/15 transition-[transform,border-color,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          estaAberto
                            ? "rotate-45 border-accent text-accent"
                            : "text-body"
                        }`}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          className="h-3.5 w-3.5"
                        >
                          <path d="M8 2v12M2 8h12" />
                        </svg>
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {estaAberto && (
                      <motion.div
                        id={idPainel}
                        role="region"
                        aria-labelledby={idBotao}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-12 text-[15px] leading-relaxed text-body">
                          {item.resposta}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
