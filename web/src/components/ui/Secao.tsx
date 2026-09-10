"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { ReactNode } from "react";
import { revelar, noViewport } from "@/lib/motion";

interface Props {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Respiro vertical. `solto` usa py-40 no desktop. */
  espaco?: "normal" | "solto";
}

/** Seção com reveal no scroll, disparado uma única vez. */
export default function Secao({
  children,
  id,
  className,
  espaco = "normal",
}: Props) {
  return (
    <section
      id={id}
      className={clsx(
        "relative",
        espaco === "solto" ? "py-28 md:py-40" : "py-24 md:py-32",
        className,
      )}
    >
      <motion.div
        className="shell"
        variants={revelar}
        initial="oculto"
        whileInView="visivel"
        viewport={noViewport}
      >
        {children}
      </motion.div>
    </section>
  );
}

/** Cabeçalho de seção: rótulo + título + linha de apoio. */
export function TituloSecao({
  rotulo,
  titulo,
  apoio,
  className,
}: {
  rotulo: string;
  titulo: ReactNode;
  apoio?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("max-w-3xl", className)}>
      <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        <span aria-hidden className="h-px w-8 bg-primary" />
        {rotulo}
      </p>
      <h2 className="text-[clamp(1.9rem,4vw,3.1rem)]">{titulo}</h2>
      {apoio ? (
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-body">
          {apoio}
        </p>
      ) : null}
    </div>
  );
}
