import { cases } from "@/content/cases";
import CardCase from "@/components/ui/CardCase";

/** Cases em desafio → solução → resultado. */
export default function Cases() {
  return (
    <section id="cases" className="bg-creme py-20 md:py-28">
      <div className="shell">
        <p className="rotulo">Cases</p>
        <h2 className="display mt-3 max-w-[24ch]">
          O que já entregamos, com número
        </h2>
        <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-corpo">
          Cada case abaixo veio de material próprio da operação. Onde o número
          ainda não está fechado, o campo aparece marcado — case sem número é
          depoimento.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {cases.map((c) => (
            <li key={c.slug} className="flex">
              <CardCase caso={c} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
