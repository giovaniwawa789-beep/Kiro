"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { site } from "@/content/site";
import { asset } from "@/lib/asset";

/**
 * Barra fixa clara: logomarca à esquerda, links em índigo, "Contato" destacado.
 * Estrutura espelhada da referência do setor; a logomarca é a original da
 * Nunes e Lucato, em grafite.
 */
export default function Navbar() {
  const [compacta, setCompacta] = useState(false);
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setCompacta(window.scrollY > 60);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", aoTeclar);
    };
  }, [aberto]);

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b bg-branco/95 backdrop-blur-md",
        "transition-[height,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        compacta
          ? "h-[68px] border-regua-2 shadow-[0_1px_16px_rgba(20,20,46,0.06)]"
          : "h-20 border-transparent",
      )}
    >
      <div className="shell flex h-full items-center gap-8">
        <Link
          href="/"
          aria-label={`${site.nome} — página inicial`}
          className="flex-none"
        >
          <Image
            src={asset("/logo_dark.png")}
            alt={site.nomeCompleto}
            width={620}
            height={128}
            priority
            className={clsx(
              "w-auto transition-[height] duration-300",
              compacta ? "h-7" : "h-8",
            )}
          />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="ml-auto hidden items-center gap-8 lg:flex"
        >
          {/* Contato sai da lista e vira destaque no fim, como na referência.
              Sem isso ele aparecia duas vezes. */}
          {site.navegacao
            .filter((item) => item.href !== "/contato")
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[15px] font-semibold text-indigo-esc transition-colors duration-300 hover:text-indigo"
              >
                {item.rotulo}
              </Link>
            ))}
          <Link
            href="/contato"
            className="text-[15px] font-bold text-indigo transition-colors duration-300 hover:text-indigo-esc"
          >
            Contato
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-mobile"
          aria-label={aberto ? "Fechar menu" : "Abrir menu"}
          className="ml-auto flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-regua-2 lg:hidden"
        >
          <span
            className={clsx(
              "block h-[1.5px] w-4 bg-indigo-esc transition-transform duration-300",
              aberto && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={clsx(
              "block h-[1.5px] w-4 bg-indigo-esc transition-transform duration-300",
              aberto && "-translate-y-[3.5px] -rotate-45",
            )}
          />
        </button>
      </div>

      {aberto ? (
        <div
          id="menu-mobile"
          className="border-b border-regua-2 bg-branco lg:hidden"
        >
          <nav
            aria-label="Navegação principal (mobile)"
            className="shell flex flex-col py-3"
          >
            {[
              ...site.navegacao.filter((i) => i.href !== "/contato"),
              { rotulo: "Contato", href: "/contato" },
            ].map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="border-b border-regua-2 py-4 text-[19px] font-bold text-indigo-esc last:border-0"
                >
                  {item.rotulo}
                </Link>
              ),
            )}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
