"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { servicos } from "@/content/servicos";
import { linkWhatsApp } from "@/content/site";
import { revelar, escalonar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";
import Icone from "@/components/Icone";

export default function Servicos() {
  return (
    <section id="servicos" className="relative py-24 md:py-32">
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Serviços"
            titulo={
              <>
                Da documentação exigida por lei
                <br />
                <span className="text-primary">à destinação do último quilo</span>
              </>
            }
            apoio="Seis frentes que cobrem o ciclo completo: diagnóstico, plano, operação e prova documental. Você contrata só o que precisa ou o pacote inteiro."
          />
        </motion.div>

        <motion.ul
          variants={escalonar(0.05, 0.07)}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {servicos.map((servico) => (
            <motion.li key={servico.slug} variants={revelar}>
              <Link
                href={`/servicos/${servico.slug}`}
                className="group glass relative flex h-full flex-col rounded-2xl p-7 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:border-accent/60 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-primary transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[-8deg] group-hover:text-accent">
                    <Icone nome={servico.icone} className="h-9 w-9" />
                  </span>
                  <span className="font-display text-[13px] tabular-nums text-body">
                    {servico.numero}
                  </span>
                </div>

                <h3 className="mt-6 text-[21px] leading-snug md:text-[23px]">
                  {servico.titulo}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-body">
                  {servico.resumo}
                </p>

                <ul className="mt-6 space-y-2 border-t border-white/8 pt-5">
                  {servico.entregas.map((entrega) => (
                    <li
                      key={entrega}
                      className="flex items-start gap-2.5 text-[13.5px] text-body"
                    >
                      <span
                        aria-hidden
                        className="mt-[7px] h-1 w-1 flex-none rounded-full bg-primary"
                      />
                      {entrega}
                    </li>
                  ))}
                </ul>

                <span className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-ink transition-colors duration-300 group-hover:text-accent">
                  Ver o serviço
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
                  </svg>
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-10 text-[15px] text-body"
        >
          Não sabe por onde começar?{" "}
          <a
            href={linkWhatsApp("Olá! Não sei qual serviço preciso. Podem me orientar?")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent"
          >
            Fale conosco
          </a>{" "}
          e o diagnóstico aponta o caminho.
        </motion.p>
      </div>
    </section>
  );
}
