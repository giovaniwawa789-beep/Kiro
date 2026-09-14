"use client";

import { motion } from "framer-motion";
import { site, linkWhatsApp } from "@/content/site";
import { revelar, noViewport } from "@/lib/motion";
import Botao from "@/components/ui/Botao";

export default function CtaFinal() {
  return (
    <section className="relative isolate overflow-hidden border-t border-white/8 py-28 md:py-36">
      <div className="glow absolute inset-0" aria-hidden />
      <div className="noise" aria-hidden />

      <motion.div
        variants={revelar}
        initial="oculto"
        whileInView="visivel"
        viewport={noViewport}
        className="shell relative text-center"
      >
        <h2 className="mx-auto max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">
          Numa fiscalização, o seu resíduo{" "}
          <span className="text-primary">tem documento?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-body">
          O diagnóstico é o primeiro passo e responde três coisas: em que você
          está irregular, quanto material está sendo perdido e o que dele pode
          voltar como produto. Conte o volume e o tipo de material.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Botao
            href={linkWhatsApp(
              "Olá! Gostaria de solicitar um diagnóstico de resíduos têxteis para a minha empresa.",
            )}
            externo
          >
            Solicitar diagnóstico
          </Botao>
          <Botao href="/contato" variante="secundario">
            Enviar mensagem
          </Botao>
        </div>
        <p className="mx-auto mt-8 max-w-md text-[13px] text-body">
          Cadastro no SINIR como {site.contato.perfilMtr} · CNPJ{" "}
          {site.contato.cnpj}
        </p>
      </motion.div>
    </section>
  );
}
