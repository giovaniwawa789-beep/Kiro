"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { site, linkWhatsApp } from "@/content/site";
import { EASE } from "@/lib/motion";

export default function Navbar() {
  const [reduzida, setReduzida] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  /** Reduz a altura e liga o fundo translúcido depois de 80px de scroll. */
  useEffect(() => {
    const aoRolar = () => setReduzida(window.scrollY > 80);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  /** Trava o corpo e permite fechar no Esc enquanto o menu está aberto. */
  useEffect(() => {
    if (!menuAberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuAberto(false);
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [menuAberto]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-[height,background-color,border-color,backdrop-filter]",
        "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] border-b",
        reduzida
          ? "h-16 border-white/10 bg-base/80 backdrop-blur-xl"
          : "h-20 border-transparent bg-transparent",
      )}
    >
      <div className="shell flex h-full items-center gap-6">
        <Link
          href="/"
          className="flex flex-none items-center gap-2.5"
          aria-label={`${site.nome} — página inicial`}
        >
          <Image
            src={asset("/simbolo_branco.png")}
            alt=""
            width={30}
            height={30}
            priority
            className="h-7 w-7 object-contain"
          />
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            {site.nome}
          </span>
        </Link>

        <nav
          aria-label="Navegação principal"
          className="ml-auto hidden items-center gap-8 lg:flex"
        >
          {site.navegacao.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] text-body transition-colors duration-300 hover:text-ink"
            >
              {item.rotulo}
            </Link>
          ))}
        </nav>

        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto hidden rounded-full bg-primary px-6 py-3 text-[14px] font-semibold leading-none text-[#04120b] transition-colors duration-300 hover:bg-accent lg:ml-0 lg:inline-flex"
        >
          Fale conosco
        </a>

        <button
          type="button"
          onClick={() => setMenuAberto((v) => !v)}
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-white/15 lg:hidden"
        >
          <span
            className={clsx(
              "block h-px w-4 bg-ink transition-transform duration-300",
              menuAberto && "translate-y-[3px] rotate-45",
            )}
          />
          <span
            className={clsx(
              "block h-px w-4 bg-ink transition-transform duration-300",
              menuAberto && "-translate-y-[3px] -rotate-45",
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="border-b border-white/10 bg-base/95 backdrop-blur-xl lg:hidden"
          >
            <nav
              aria-label="Navegação principal (mobile)"
              className="shell flex flex-col py-4"
            >
              {site.navegacao.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className="border-b border-white/8 py-4 font-display text-2xl font-semibold text-ink"
                >
                  {item.rotulo}
                </Link>
              ))}
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuAberto(false)}
                className="mt-5 rounded-full bg-primary px-6 py-4 text-center text-[14px] font-semibold text-[#04120b]"
              >
                Fale conosco
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
