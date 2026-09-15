import Image from "next/image";
import { asset } from "@/lib/asset";
import Pendente from "./Pendente";
import type { Caso } from "@/content/cases";

/**
 * Card de case no formato desafio → solução → resultado.
 *
 * Sem número, um case é depoimento. Por isso o resultado sem valor mostra o
 * marcador em vez de sumir: a lacuna fica visível para quem vai preencher.
 *
 * O nome do cliente só aparece quando `autorizado` é true. Enquanto não houver
 * confirmação, entra o segmento — que comunica quase o mesmo sem expor a marca.
 */
export default function CardCase({ caso }: { caso: Caso }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-regua-2 bg-branco">
      {caso.foto ? (
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={asset(caso.foto.src)}
            alt={caso.foto.alt}
            fill
            sizes="(max-width: 1024px) 92vw, 46vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
          {caso.autorizado ? caso.cliente : caso.segmento}
        </p>

        {!caso.autorizado ? (
          <p className="mt-3">
            <Pendente titulo="Autorização de marca">
              Confirmar se o contrato com {caso.cliente} permite citar o nome e
              usar o logo. Até então, o card mostra apenas o segmento.
            </Pendente>
          </p>
        ) : null}

        <div className="mt-5 space-y-4">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-suave">
              Desafio
            </h4>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-corpo">
              {caso.desafio}
            </p>
          </div>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-suave">
              Solução
            </h4>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-corpo">
              {caso.solucao}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-regua-2 pt-5">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-suave">
            Resultado
          </h4>
          <dl className="mt-3 space-y-3">
            {caso.resultado.map((r) => (
              <div key={r.rotulo}>
                {r.valor ? (
                  <div className="flex items-baseline gap-2.5">
                    <dt className="font-display text-[26px] font-extrabold leading-none tracking-[-0.03em] text-indigo-esc">
                      {r.valor}
                    </dt>
                    <dd className="text-[13.5px] leading-snug text-corpo">
                      {r.rotulo}
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt className="sr-only">{r.rotulo}</dt>
                    <dd>
                      <Pendente titulo={r.rotulo}>{r.origem}</Pendente>
                    </dd>
                  </div>
                )}
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}
