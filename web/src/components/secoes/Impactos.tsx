import Image from "next/image";
import { numerosImpacto } from "@/content/impacto";
import { asset } from "@/lib/asset";
import BlocoNumeros from "@/components/ui/BlocoNumeros";

/**
 * Impacto em números.
 *
 * Os números ambientais calculados (CO₂, água) exigem metodologia declarada
 * junto. Sem memória de cálculo, o dado não sobe: é o primeiro item que um
 * comprador de ESG questiona, e errar aqui contamina a credibilidade do resto.
 */
export default function Impactos() {
  return (
    <section id="impactos" className="bg-branco py-20 md:py-28">
      <div className="shell">
        <p className="rotulo">Impacto</p>
        <h2 className="display mt-3 max-w-[24ch]">
          Números que sua empresa pode reportar
        </h2>
        <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-corpo">
          Todo dado aqui tem origem rastreável. O que ainda não temos aparece
          marcado — preferimos a lacuna visível a um número que não se sustenta
          em auditoria.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <Image
            src={asset("/fotos/artesa_costura.jpg")}
            alt="Artesã costurando peça em máquina industrial na unidade de transformação"
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 92vw, 42vw"
            className="h-auto w-full rounded-2xl object-cover"
          />
          <BlocoNumeros numeros={numerosImpacto} colunas={2} />
        </div>
      </div>
    </section>
  );
}
