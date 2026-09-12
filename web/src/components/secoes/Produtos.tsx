"use client";

import { useRef } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { revelar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";

export default function Produtos() {
  const trilha = useRef<HTMLUListElement>(null);

  const rolar = (direcao: -1 | 1) => {
    const el = trilha.current;
    if (!el) return;
    const passo = el.clientWidth * 0.8;
    el.scrollBy({ left: passo * direcao, behavior: "smooth" });
  };

  return (
    <section id="produtos" className="relative py-24 md:py-32">
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <TituloSecao
            rotulo="Produtos sustentáveis"
            titulo={
              <>
                O resíduo volta como{" "}
                <span className="text-primary">produto de marca</span>
              </>
            }
            apoio="Peças produzidas a partir do resíduo da própria empresa, personalizáveis. Indicadas para brindes corporativos e ações de ESG."
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => rolar(-1)}
              aria-label="Ver produtos anteriores"
              aria-controls="trilha-produtos"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M14 8H2M6.5 3.5 2 8l4.5 4.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => rolar(1)}
              aria-label="Ver próximos produtos"
              aria-controls="trilha-produtos"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              <svg
                aria-hidden
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
              </svg>
            </button>
          </div>
        </motion.div>

        <motion.ul
          id="trilha-produtos"
          ref={trilha}
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          tabIndex={0}
          aria-label="Produtos desenvolvidos a partir de resíduo têxtil"
          className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
        >
          {site.produtos.map((produto) => (
            <li
              key={produto.nome}
              className="glass w-[78vw] flex-none snap-start overflow-hidden rounded-2xl sm:w-[46%] lg:w-[31%]"
            >
              <div className="relative aspect-[4/3] bg-surface-2">
                {produto.imagem ? (
                  <Image
                    src={asset(produto.imagem)}
                    alt={produto.alt}
                    fill
                    sizes="(max-width: 640px) 78vw, (max-width: 1024px) 46vw, 31vw"
                    className="object-cover"
                  />
                ) : (
                  /* TODO: substituir por foto real do produto */
                  <div
                    role="img"
                    aria-label={produto.alt}
                    className="flex h-full w-full items-center justify-center border-b border-white/8"
                  >
                    <span className="rounded-full border border-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-body">
                      Foto pendente
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-[18px]">{produto.nome}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-body">
                  {produto.descricao}
                </p>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
