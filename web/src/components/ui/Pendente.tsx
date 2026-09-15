/**
 * Marcador de dado pendente.
 *
 * Aparece na página de propósito. A alternativa seria esconder a lacuna ou
 * preencher com número plausível — e número plausível numa página de impacto é
 * exatamente o que derruba a credibilidade quando o comprador confere.
 *
 * Visualmente inconfundível: ninguém publica isso por engano.
 */
export default function Pendente({
  children,
  titulo,
}: {
  /** O que precisa ser preenchido. */
  children: React.ReactNode;
  /** Rótulo opcional acima, para blocos maiores. */
  titulo?: string;
}) {
  return (
    <span className="inline-flex flex-col gap-1 rounded-md border border-dashed border-amber-500/70 bg-amber-50 px-3 py-2 text-left align-middle">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
        {titulo ?? "Preencher"}
      </span>
      <span className="text-[13px] font-medium leading-snug text-amber-900">
        {children}
      </span>
    </span>
  );
}

/** Versão em bloco, para parágrafos e seções inteiras. */
export function BlocoPendente({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-amber-500/70 bg-amber-50 p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">
        Preencher — {titulo}
      </p>
      <p className="mt-2 text-[14px] leading-relaxed text-amber-900">
        {children}
      </p>
    </div>
  );
}
