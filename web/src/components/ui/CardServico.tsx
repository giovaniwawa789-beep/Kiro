import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import Padrao from "./Padrao";
import Icone from "@/components/Icone";
import type { Servico } from "@/content/servicos";

/**
 * Card da vitrine de serviços: foto real quando existe, ícone quando não.
 * Uma linha de benefício — não descrição de procedimento.
 */
export default function CardServico({ servico }: { servico: Servico }) {
  return (
    <Link
      href={`/servicos/${servico.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-regua-2 bg-branco transition-[transform,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-indigo/40 hover:shadow-[0_14px_36px_rgba(20,20,46,0.10)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-creme">
        {servico.foto ? (
          <Image
            src={asset(servico.foto.src)}
            alt={servico.foto.alt}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-40">
              <Padrao variante="fina" />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-indigo">
              <Icone nome={servico.icone} className="h-16 w-16" />
            </span>
          </>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-branco/95 px-3 py-1 text-[11px] font-bold tabular-nums text-indigo backdrop-blur-sm">
          {servico.numero}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[19px] leading-snug">{servico.titulo}</h3>
        <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-corpo">
          {servico.beneficio}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-indigo">
          Ver o serviço
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
