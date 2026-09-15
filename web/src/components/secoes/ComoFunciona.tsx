/** Como funciona, em quatro passos. Máximo duas linhas por passo. */

const PASSOS = [
  {
    titulo: "Diagnóstico",
    texto:
      "Entendemos o que sua operação gera, em que volume e o que a sua auditoria exige.",
  },
  {
    titulo: "Coleta programada",
    texto:
      "Retirada na sua unidade em frequência combinada, sem parar a produção.",
  },
  {
    titulo: "Triagem e processamento",
    texto:
      "Separação por composição e cor, descaracterização quando necessário, e destino de maior valor.",
  },
  {
    titulo: "Documentação e relatório",
    texto:
      "MTR, certificado de destinação e relatório de impacto no seu e-mail.",
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-branco py-20 md:py-28">
      <div className="shell">
        <p className="rotulo">Como funciona</p>
        <h2 className="display mt-3 max-w-[20ch]">Quatro passos, um responsável</h2>

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="border-t-2 border-indigo pt-5">
              <span className="font-display text-[13px] font-extrabold tabular-nums text-indigo">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-[19px] leading-snug">{p.titulo}</h3>
              <p className="mt-2.5 max-w-[30ch] text-[14.5px] leading-relaxed text-corpo">
                {p.texto}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
