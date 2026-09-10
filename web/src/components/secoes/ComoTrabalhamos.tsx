"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { revelar, escalonar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";

const ETAPAS = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    texto:
      "Visita à unidade, levantamento da geração por setor e checagem do enquadramento legal da operação.",
  },
  {
    numero: "02",
    titulo: "Plano e documentação",
    texto:
      "PGRS, plano de adequação e classificação dos resíduos, no formato que o órgão ambiental exige.",
  },
  {
    numero: "03",
    titulo: "Operação e coleta",
    texto:
      "Coleta agendada com emissão de MTR, segregação por cor e composição, e destinação pela rota de maior valor.",
  },
  {
    numero: "04",
    titulo: "Monitoramento e relatórios",
    texto:
      "Indicadores, relatório de destinação e revisão gerencial periódica para sustentar auditoria e ESG.",
  },
];

export default function ComoTrabalhamos() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.5"],
  });
  /** A linha se desenha conforme a seção entra na viewport. */
  const escala = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="como-trabalhamos" className="relative py-24 md:py-32">
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Como trabalhamos"
            titulo={
              <>
                Quatro etapas, <span className="text-primary">uma custódia</span>
              </>
            }
            apoio="A responsabilidade não é repartida entre fornecedores: do diagnóstico ao relatório, a cadeia é nossa."
          />
        </motion.div>

        <div ref={ref} className="relative mt-16">
          {/* trilho da timeline */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-white/10 lg:block"
          >
            <motion.div
              style={{ scaleX: escala }}
              className="h-full origin-left bg-gradient-to-r from-primary via-accent to-teal"
            />
          </div>

          <motion.ol
            variants={escalonar(0.05, 0.08)}
            initial="oculto"
            whileInView="visivel"
            viewport={noViewport}
            className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          >
            {ETAPAS.map((etapa) => (
              <motion.li key={etapa.numero} variants={revelar} className="relative">
                <div className="mb-6 flex items-center gap-4 lg:mb-0 lg:block">
                  <span
                    aria-hidden
                    className="relative z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/15 bg-surface font-display text-[13px] tabular-nums text-primary"
                  >
                    {etapa.numero}
                  </span>
                </div>
                <h3 className="mt-0 text-[19px] lg:mt-7">{etapa.titulo}</h3>
                <p className="mt-3 max-w-[34ch] text-[14.5px] leading-relaxed text-body">
                  {etapa.texto}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
