"use client";

import Image from "next/image";
import { asset } from "@/lib/asset";
import { motion } from "framer-motion";
import { projetos, antesDepois } from "@/content/projetos";
import { revelar, escalonar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";

export default function Projetos() {
  return (
    <section id="projetos" className="relative py-24 md:py-32">
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Projetos"
            titulo={
              <>
                Projetos entregues,{" "}
                <span className="text-primary">não portfólio de intenção</span>
              </>
            }
            apoio="O uniforme sai da operação do cliente, é descaracterizado peça por peça e volta como produto têxtil com rastreabilidade. Abaixo, o mesmo material nas duas pontas."
          />
        </motion.div>

        {/* antes e depois: a prova do ciclo têxtil-para-têxtil */}
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-14 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]"
        >
          {[antesDepois.antes, antesDepois.depois].map((lado, i) => (
            <div key={lado.imagem} className={i === 1 ? "md:order-3" : ""}>
              <figure className="relative">
                <span
                  className={`absolute left-0 top-0 z-10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                    i === 0
                      ? "bg-white/12 text-ink backdrop-blur-sm"
                      : "bg-primary text-[#04120b]"
                  }`}
                >
                  {i === 0 ? "Antes" : "Depois"}
                </span>
                <Image
                  src={asset(lado.imagem)}
                  alt={lado.alt}
                  width={1000}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="aspect-square w-full rounded-2xl border border-white/8 object-cover"
                />
                <figcaption className="mt-3 text-[13px] text-body">
                  {lado.legenda}
                </figcaption>
              </figure>
            </div>
          ))}

          <div aria-hidden className="mx-auto md:order-2">
            <svg
              viewBox="0 0 120 60"
              fill="none"
              className="h-12 w-24 rotate-90 md:rotate-0"
            >
              <path
                d="M4 30 C 32 30 36 12 62 12 C 88 12 92 44 116 44"
                stroke="#12b76a"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <path
                d="M108 38 L116 44 L108 50"
                stroke="#12b76a"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>

        {/* cards de projeto */}
        <motion.ul
          variants={escalonar(0.05, 0.07)}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {projetos.map((projeto) => (
            <motion.li
              key={projeto.slug}
              variants={revelar}
              className="glass group overflow-hidden rounded-2xl"
            >
              {projeto.imagem ? (
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={asset(projeto.imagem)}
                    alt={projeto.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-base/85 via-base/10 to-transparent"
                  />
                </div>
              ) : null}

              <div className="p-7 md:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  {projeto.cliente}
                </p>
                <h3 className="mt-3 text-[20px] leading-snug md:text-[22px]">
                  {projeto.titulo}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                  {projeto.descricao}
                </p>

                <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/8 pt-5">
                  {projeto.destaques.map((d) => (
                    <div key={d.rotulo}>
                      <dt className="font-display text-[17px] font-semibold tabular-nums text-accent">
                        {d.valor}
                      </dt>
                      <dd className="mt-1 max-w-[24ch] text-[12.5px] leading-snug text-body">
                        {d.rotulo}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
