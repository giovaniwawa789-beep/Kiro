import type { Numero } from "@/content/impacto";
import Pendente from "./Pendente";

/**
 * Bloco de números reutilizável.
 *
 * Número sem valor não é omitido: mostra o marcador. Assim a lacuna fica
 * visível para quem vai preencher, em vez de a seção simplesmente encolher e a
 * ausência passar batida.
 */
export default function BlocoNumeros({
  numeros,
  colunas = 4,
  tema = "claro",
}: {
  numeros: Numero[];
  colunas?: 2 | 3 | 4;
  tema?: "claro" | "escuro";
}) {
  const grade =
    colunas === 2
      ? "sm:grid-cols-2"
      : colunas === 3
        ? "sm:grid-cols-2 lg:grid-cols-3"
        : "sm:grid-cols-2 lg:grid-cols-4";

  const corValor = tema === "escuro" ? "text-branco" : "text-indigo-esc";
  const corUnidade = tema === "escuro" ? "text-branco/70" : "text-indigo";
  const corRotulo = tema === "escuro" ? "text-branco/75" : "text-corpo";
  const borda = tema === "escuro" ? "border-white/15" : "border-regua";

  return (
    <dl className={`grid grid-cols-1 gap-x-8 gap-y-10 ${grade}`}>
      {numeros.map((n) => (
        <div key={n.rotulo} className={`border-t pt-5 ${borda}`}>
          {n.valor ? (
            <>
              <dt
                className={`font-display text-[clamp(2.1rem,4.4vw,3.2rem)] font-extrabold leading-none tracking-[-0.04em] ${corValor}`}
              >
                {n.valor}
                <span className={corUnidade}>{n.unidade}</span>
              </dt>
              <dd className={`mt-3 max-w-[26ch] text-[14px] leading-snug ${corRotulo}`}>
                {n.rotulo}
              </dd>
            </>
          ) : (
            <>
              <dt className="mb-3">
                <Pendente titulo="Número pendente">{n.origem}</Pendente>
              </dt>
              <dd className={`max-w-[26ch] text-[14px] leading-snug ${corRotulo}`}>
                {n.rotulo}
              </dd>
            </>
          )}
          {n.metodologia ? (
            <dd className="mt-3">
              <Pendente titulo="Metodologia obrigatória">
                {n.metodologia}
              </Pendente>
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
