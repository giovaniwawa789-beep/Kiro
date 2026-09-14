"use client";

import { useState } from "react";
import { site } from "@/content/site";

/**
 * FAQ em acordeão. Botão nativo com aria-expanded/aria-controls: navegação por
 * teclado e leitura correta pelo leitor de tela, sem imitar widget.
 */
export default function Faq() {
  const [aberto, setAberto] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-branco py-20 md:py-28">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="rotulo">Tem alguma dúvida?</p>
          <h2 className="display mt-3">
            Perguntas
            <br />
            frequentes
          </h2>
          <p className="mt-6 max-w-[38ch] text-[16px] leading-relaxed text-corpo">
            As dúvidas que mais aparecem sobre PGRS, coleta e destinação. Se a sua
            não estiver aqui, fale com a nossa equipe.
          </p>
        </div>

        <ul className="border-t border-regua-2">
          {site.faq.map((item, i) => {
            const estaAberto = aberto === i;
            const idPainel = `faq-painel-${i}`;
            const idBotao = `faq-botao-${i}`;

            return (
              <li key={item.pergunta} className="border-b border-regua-2">
                <h3>
                  <button
                    type="button"
                    id={idBotao}
                    aria-expanded={estaAberto}
                    aria-controls={idPainel}
                    onClick={() => setAberto(estaAberto ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-[17px] font-bold leading-snug text-tinta md:text-[18px]">
                      {item.pergunta}
                    </span>
                    <span
                      aria-hidden
                      className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-[transform,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        estaAberto
                          ? "rotate-45 border-indigo bg-indigo text-branco"
                          : "border-regua-2 text-indigo"
                      }`}
                    >
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={idPainel}
                  role="region"
                  aria-labelledby={idBotao}
                  hidden={!estaAberto}
                >
                  <p className="pb-7 pr-10 text-[15px] leading-relaxed text-corpo">
                    {item.resposta}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
