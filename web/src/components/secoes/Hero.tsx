"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site, linkWhatsApp } from "@/content/site";
import { palavra, escalonar, EASE } from "@/lib/motion";
import Botao from "@/components/ui/Botao";

const TITULO = "Gestão ambiental têxtil, do diagnóstico ao resíduo zero.";
const PROVAS = ["Conformidade legal", "Logística reversa", "Lixo zero"];

export default function Hero() {
  const menosMovimento = useReducedMotion();
  const palavras = TITULO.split(" ");

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-32 md:pb-28 md:pt-44">
      {/* fundo aurora + grão. Ambos absolutos: não empurram layout (sem CLS). */}
      <div className="aurora" aria-hidden>
        <span />
        <span />
        <span />
      </div>
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
          Consultoria e operação para indústrias e confecções têxteis
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
          {palavras.map((p, i) => (
            <motion.span
              key={`${p}-${i}`}
              variants={menosMovimento ? undefined : palavra}
              aria-hidden
              className="mr-[0.28em] inline-block"
            >
              {i >= palavras.length - 2 ? (
                <span className="text-primary">{p}</span>
              ) : (
                p
              )}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55, ease: EASE }}
          className="mt-8 max-w-2xl text-[17px] leading-relaxed text-body md:text-[19px]"
        >
          Adequação legal e destinação correta dos resíduos têxteis da sua
          produção. Assumimos o diagnóstico, a documentação exigida pelo órgão
          ambiental, a coleta e a rastreabilidade — até a última fração sair da
          rota do aterro.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7, ease: EASE }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <Botao href={linkWhatsApp()} externo>
            Fale conosco
          </Botao>
          <Botao href="/#servicos" variante="secundario">
            Ver serviços
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
