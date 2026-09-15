import Image from "next/image";
import { destinos, pecasSemFoto } from "@/content/destinos";
import { asset } from "@/lib/asset";
import Padrao from "@/components/ui/Padrao";
import Pendente from "@/components/ui/Pendente";

/**
 * "O que acontece com o seu resíduo" — os destinos, em foto.
 *
 * Seção de diferenciação: a maioria dos concorrentes é econômica em prova visual
 * do destino final, e alguns mandam tecido para coprocessamento (incineração).
 * Aqui o argumento é material: o resíduo aparece como produto de volta ao
 * mercado.
 */
export default function Destinos() {
  return (
    <section id="destinos" className="bg-creme py-20 md:py-28">
      <div className="shell">
        <p className="rotulo">O que acontece com o seu resíduo</p>
        <h2 className="display mt-3 max-w-[26ch]">
          Ele não é incinerado. Ele volta ao mercado.
        </h2>
        <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed text-corpo">
          Coprocessamento resolve o descarte e encerra o ciclo têxtil: o material
          vira energia e deixa de existir. Aqui a rota começa no maior valor
          possível — o tecido volta como produto ou como matéria-prima para
          outras indústrias.
        </p>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destinos.map((d) => (
            <li
              key={d.nome}
              className="overflow-hidden rounded-2xl border border-regua bg-branco"
            >
              <div className="relative aspect-square bg-creme">
                {d.foto ? (
                  <Image
                    src={asset(d.foto.src)}
                    alt={d.foto.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 23vw"
                    className="object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-35">
                      <Padrao variante="fina" />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center p-4">
                      <span className="rounded-md border border-dashed border-amber-500/70 bg-amber-50 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-amber-700">
                        Foto pendente
                      </span>
                    </span>
                  </>
                )}
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo">
                  {d.volta}
                </p>
                <h3 className="mt-2 text-[17px] leading-snug">{d.nome}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-corpo">
                  {d.descricao}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-start gap-4">
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-corpo">
              Também produzimos, ainda sem foto própria:
            </p>
            <p className="mt-2 text-[14px] leading-relaxed text-corpo">
              {pecasSemFoto.join(" · ")}
            </p>
          </div>
          <Pendente titulo="Fotos de produto">
            Enviar foto das quatro peças acima e dos destinos industriais (fibra
            desfibrada, manta, pano/estopa, tapete). São a prova mais forte desta
            seção.
          </Pendente>
        </div>
      </div>
    </section>
  );
}
