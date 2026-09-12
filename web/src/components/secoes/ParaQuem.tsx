"use client";

import { motion } from "framer-motion";
import { site } from "@/content/site";
import { revelar, escalonar, noViewport } from "@/lib/motion";
import { TituloSecao } from "@/components/ui/Secao";

export default function ParaQuem() {
  return (
    <section
      id="para-quem"
      className="relative border-y border-white/8 bg-surface/30 py-24 md:py-32"
    >
      <div className="shell">
        <motion.div
          variants={revelar}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
        >
          <TituloSecao
            rotulo="Para quem atendemos"
            titulo={
              <>
                Quem gera resíduo têxtil{" "}
                <span className="text-primary">em volume</span>
              </>
            }
            apoio="Atendimento concentrado na Capital e região, próximo à origem do resíduo."
          />
        </motion.div>

        <motion.ul
          variants={escalonar(0.05, 0.05)}
          initial="oculto"
          whileInView="visivel"
          viewport={noViewport}
          className="mt-12 flex flex-wrap gap-3"
        >
          {site.publico.map((item) => (
            <motion.li
              key={item}
              variants={revelar}
              className="glass rounded-full px-5 py-3 text-[14.5px] text-ink"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
