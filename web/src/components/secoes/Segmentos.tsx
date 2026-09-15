import Link from "next/link";
import { segmentos } from "@/content/segmentos";
import Icone from "@/components/Icone";

/**
 * Segmentos atendidos. Cada item nomeia a dor daquele setor — o visitante se
 * reconhece antes de ler o serviço. Também cobre busca de cauda longa.
 */
export default function Segmentos() {
  return (
    <section id="segmentos" className="bg-branco py-20 md:py-28">
      <div className="shell">
        <p className="rotulo">Segmentos atendidos</p>
        <h2 className="display mt-3 max-w-[22ch]">
          Onde a sua operação se encaixa
        </h2>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {segmentos.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/servicos/${s.servico}`}
                className="group flex h-full flex-col rounded-2xl border border-regua-2 bg-branco p-6 transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-indigo/40"
              >
                <span aria-hidden className="text-indigo">
                  <Icone nome={s.icone} className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-[16.5px] leading-snug">{s.nome}</h3>
                <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-corpo">
                  {s.dor}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-indigo">
                  Ver solução
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
