import { destaques } from "@/content/impacto";
import Pendente from "@/components/ui/Pendente";

/**
 * Faixa de credibilidade, logo abaixo do hero: quem confia + três números.
 *
 * Os clientes aparecem como texto, não como logotipo: não tenho os arquivos de
 * marca nem autorização de uso. Redesenhar logo por aproximação seria uso
 * indevido — e um logo errado numa faixa de credibilidade produz o efeito
 * oposto ao pretendido.
 */

const CLIENTES = [
  "Midea Carrier",
  "Santista S.A.",
  "Bom Retiro Recicla",
  "Prefeitura de São Paulo",
  "CULTSP PRO",
] as const;

export default function FaixaCredibilidade() {
  return (
    <section
      aria-label="Clientes e números"
      className="border-y border-regua-2 bg-branco py-12 md:py-16"
    >
      <div className="shell">
        <h2 className="text-center text-[12px] font-bold uppercase tracking-[0.2em] text-suave">
          Quem já confia na nossa operação
        </h2>

        <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {CLIENTES.map((c) => (
            <li
              key={c}
              className="font-display text-[clamp(1rem,2vw,1.35rem)] font-extrabold tracking-[-0.02em] text-indigo-esc/75"
            >
              {c}
            </li>
          ))}
        </ul>

        <p className="mt-6 flex justify-center">
          <Pendente titulo="Logos de clientes">
            Enviar os arquivos de logo e confirmar autorização de uso de marca
            por cliente. Até então, os nomes aparecem em texto.
          </Pendente>
        </p>

        <dl className="mt-12 grid grid-cols-1 gap-8 border-t border-regua-2 pt-10 sm:grid-cols-3">
          {destaques.map((n) => (
            <div key={n.rotulo} className="text-center">
              {n.valor ? (
                <>
                  <dt className="font-display text-[clamp(2.2rem,4.6vw,3.1rem)] font-extrabold leading-none tracking-[-0.04em] text-indigo-esc">
                    {n.valor}
                    <span className="text-indigo">{n.unidade}</span>
                  </dt>
                  <dd className="mx-auto mt-3 max-w-[24ch] text-[14px] leading-snug text-corpo">
                    {n.rotulo}
                  </dd>
                </>
              ) : (
                <>
                  <dt className="flex justify-center">
                    <Pendente titulo="Número pendente">{n.origem}</Pendente>
                  </dt>
                  <dd className="mx-auto mt-3 max-w-[24ch] text-[14px] leading-snug text-corpo">
                    {n.rotulo}
                  </dd>
                </>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
