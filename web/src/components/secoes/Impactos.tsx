import Image from "next/image";
import { asset } from "@/lib/asset";
import { resultados } from "@/content/credibilidade";

/**
 * "Impactos": foto da operação à esquerda, números grandes à direita, cada um
 * separado por régua fina — o padrão de prova quantitativa do setor.
 *
 * Todos os números têm origem rastreável em `content/credibilidade.ts`.
 */
export default function Impactos() {
  return (
    <section id="impactos" className="bg-creme py-20 md:py-28">
      <div className="shell">
        <p className="rotulo text-center">Resultados verificáveis</p>
        <h2 className="display mt-3 text-center">Impactos</h2>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Image
            src={asset("/fotos/artesa_costura.jpg")}
            alt="Artesã costurando peça em máquina industrial na unidade de transformação"
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 90vw, 52vw"
            className="h-auto w-full rounded-xl"
          />

          <dl>
            {resultados.map((r, i) => (
              <div
                key={r.rotulo}
                className={
                  i === 0
                    ? "pb-6"
                    : "border-t border-regua pt-6 pb-6 last:pb-0"
                }
              >
                <dt className="font-display text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold leading-none tracking-[-0.04em] text-indigo-esc">
                  {r.valor}
                  <span className="text-indigo">{r.unidade}</span>
                </dt>
                <dd className="mt-2 max-w-[34ch] text-[14px] leading-snug text-corpo">
                  {r.rotulo}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
