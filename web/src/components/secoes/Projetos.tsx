import Image from "next/image";
import { casos } from "@/content/credibilidade";
import { antesDepois } from "@/content/projetos";
import { asset } from "@/lib/asset";
import Padrao from "@/components/ui/Padrao";

/**
 * Projetos entregues, com o par antes/depois provando o ciclo têxtil-para-têxtil:
 * o uniforme que sai da operação e a peça que volta feita do mesmo tecido.
 */
export default function Projetos() {
  return (
    <section id="projetos" className="bg-creme py-20 md:py-28">
      <div className="shell">
        <p className="rotulo">Projetos entregues</p>
        <h2 className="display mt-3 max-w-[24ch]">
          O mesmo material, nas duas pontas
        </h2>
        <p className="mt-6 max-w-[56ch] text-[16px] leading-relaxed text-corpo">
          O uniforme sai da operação do cliente, é descaracterizado peça por peça
          e volta como produto com rastreabilidade.
        </p>

        {/* antes e depois */}
        <div className="mt-12 grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          {[antesDepois.antes, antesDepois.depois].map((lado, i) => (
            <figure key={lado.imagem} className={i === 1 ? "md:order-3" : ""}>
              <div className="relative overflow-hidden rounded-xl bg-branco">
                <div className="absolute inset-0 opacity-45">
                  <Padrao variante="fina" />
                </div>
                <span
                  className={`absolute left-0 top-0 z-10 rounded-br-lg px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] ${
                    i === 0
                      ? "bg-tinta text-branco"
                      : "bg-verde text-branco"
                  }`}
                >
                  {i === 0 ? "Antes" : "Depois"}
                </span>
                <Image
                  src={asset(lado.imagem)}
                  alt={lado.alt}
                  width={1000}
                  height={1000}
                  sizes="(max-width: 768px) 90vw, 38vw"
                  className="relative mx-auto h-auto w-[86%] py-8"
                />
              </div>
              <figcaption className="mt-3 text-[13.5px] text-corpo">
                {lado.legenda}
              </figcaption>
            </figure>
          ))}

          <div aria-hidden className="mx-auto md:order-2">
            <svg
              viewBox="0 0 100 40"
              fill="none"
              className="h-10 w-24 rotate-90 text-indigo md:rotate-0"
            >
              <path
                d="M4 20 C 28 20 30 8 52 8 C 74 8 76 32 96 32"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              />
              <path
                d="M89 26 L96 32 L89 38"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* casos */}
        <ul className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {casos.map((caso) => (
            <li
              key={caso.cliente}
              className="group overflow-hidden rounded-2xl bg-branco shadow-[0_2px_18px_rgba(20,20,46,0.05)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
            >
              {caso.imagem ? (
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={asset(caso.imagem)}
                    alt={caso.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, 44vw"
                    className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                </div>
              ) : null}
              <div className="p-7">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
                  {caso.cliente}
                </p>
                <h3 className="mt-2.5 text-[20px] leading-snug">
                  {caso.titulo}
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-corpo">
                  {caso.descricao}
                </p>
                <p className="mt-5 border-t border-regua-2 pt-4 text-[14px] font-semibold text-verde">
                  {caso.resultado}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
