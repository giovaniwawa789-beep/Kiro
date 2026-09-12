"use client";

import { motion } from "framer-motion";
import { linkWhatsApp } from "@/content/site";
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
          Seu resíduo têxtil já tem{" "}
          <span className="text-primary">destino documentado?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-body">
          Conte o volume e o tipo de material. Voltamos com o diagnóstico, o
          escopo documental e o calendário da operação.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Botao href={linkWhatsApp()} externo>
            Fale conosco
          </Botao>
          <Botao href="/contato" variante="secundario">
            Enviar mensagem
          </Botao>
        </div>
      </motion.div>
    </section>
  );
}
