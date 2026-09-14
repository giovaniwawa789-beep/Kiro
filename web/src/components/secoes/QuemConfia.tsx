import { selos, imprensa, temImprensaVerificada } from "@/content/credibilidade";

/**
 * "Quem confia" + cadastro conferível.
 *
 * A referência do setor mostra logotipos de clientes aqui. Não tenho os
 * arquivos de logo das contas da Nunes e Lucato nem autorização de uso de marca,
 * então os clientes aparecem como texto — que é verdadeiro e checável — em vez
 * de logotipo redesenhado por aproximação, que seria uso indevido de marca.
 */

const CLIENTES = [
  "Midea Carrier",
  "Santista S.A.",
  "Bom Retiro Recicla",
  "Prefeitura de São Paulo",
  "CULTSP PRO",
] as const;

export default function QuemConfia() {
  return (
    <section className="border-y border-regua-2 bg-branco py-16 md:py-20">
      <div className="shell">
        <h2 className="text-center text-[13px] font-bold uppercase tracking-[0.2em] text-suave">
          Quem confia
        </h2>

        <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {CLIENTES.map((c) => (
            <li
              key={c}
              className="font-display text-[clamp(1.05rem,2.2vw,1.5rem)] font-extrabold tracking-[-0.02em] text-indigo-esc/70"
            >
              {c}
            </li>
          ))}
        </ul>

        {/* cadastro público: prova que qualquer um pode conferir */}
        <dl className="mt-14 flex flex-wrap items-center justify-center gap-3">
          {selos.map((s) => (
            <div
              key={s.rotulo}
              className="flex items-baseline gap-2.5 rounded-full border border-regua-2 px-5 py-2.5"
            >
              <dt className="text-[12px] text-corpo">{s.rotulo}</dt>
              <dd className="text-[13px] font-bold text-indigo-esc">
                {s.valor}
              </dd>
            </div>
          ))}
        </dl>

        {/* imprensa: só aparece com item verificado */}
        {temImprensaVerificada ? (
          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {imprensa
              .filter((i) => i.verificado)
              .map((i) => (
                <li
                  key={i.titulo}
                  className="rounded-2xl border border-regua-2 p-6"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
                    {i.veiculo}
                  </p>
                  <p className="mt-2.5 text-[15px] leading-snug text-tinta">
                    {i.titulo}
                  </p>
                  {i.url ? (
                    <a
                      href={i.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-[13px] font-semibold text-indigo underline decoration-indigo/30 underline-offset-4"
                    >
                      Ler a matéria
                    </a>
                  ) : null}
                </li>
              ))}
          </ul>
        ) : (
          <p className="mx-auto mt-12 max-w-2xl rounded-xl border border-indigo/20 bg-indigo-nevoa px-5 py-4 text-center text-[13px] leading-relaxed text-indigo-esc">
            <strong className="font-bold">Seção &ldquo;Na mídia&rdquo; pendente.</strong>{" "}
            Não encontrei menção de imprensa verificável nos materiais
            fornecidos. Preencha{" "}
            <code className="font-mono text-[12px]">
              src/content/credibilidade.ts
            </code>{" "}
            com veículo, título, link e data reais — não publico veículo
            inventado numa seção de credibilidade.
          </p>
        )}
      </div>
    </section>
  );
}
