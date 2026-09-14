import Link from "next/link";
import Image from "next/image";
import { servicos } from "@/content/servicos";
import { linkWhatsApp } from "@/content/site";
import { asset } from "@/lib/asset";
import Padrao from "@/components/ui/Padrao";
import Icone from "@/components/Icone";

/**
 * Grade de soluções: cartões índigo cheios, cada um com a peça ou o ícone
 * numa moldura padronizada, rótulo e "Saiba mais".
 *
 * Estrutura espelhada da referência do setor (duas fileiras de três, régua fina
 * acima de cada fileira). Cor, padrão e conteúdo são da Nunes e Lucato.
 */

/** Foto real quando existe; senão o ícone do serviço na moldura. */
const FOTOS: Record<string, { src: string; alt: string } | undefined> = {
  "descarte-reciclagem-uniformes": {
    src: "/fotos/midea_uniforme_origem.jpg",
    alt: "Uniformes corporativos fora de uso separados para descaracterização",
  },
  "desenvolvimento-produtos-sustentaveis": {
    src: "/fotos/produto_necessaire.jpg",
    alt: "Necessaire confeccionada a partir de uniforme reaproveitado",
  },
  "coleta-seletiva-textil": {
    src: "/fotos/residuo_aparas.jpg",
    alt: "Fardos de aparas têxteis aguardando coleta",
  },
  "gestao-residuos-texteis-logistica-reversa": {
    src: "/fotos/confeccao_denim.jpg",
    alt: "Costura de peça em denim recuperado",
  },
};

export default function Servicos() {
  return (
    <section id="servicos" className="bg-branco pb-20 md:pb-28">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rotulo">Soluções</p>
            <h2 className="display mt-3 max-w-[18ch]">
              Conheça as nossas soluções
            </h2>
          </div>
          <a
            href={linkWhatsApp(
              "Olá! Quero falar com um especialista sobre resíduos têxteis.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="pilula pilula-indigo"
          >
            Fale com um especialista
          </a>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((servico, i) => {
            const foto = FOTOS[servico.slug];
            return (
              <li key={servico.slug} className="flex flex-col">
                {/* régua fina acima de cada cartão, como na referência */}
                <div className="regua-fina mb-6" aria-hidden />
                <Link
                  href={`/servicos/${servico.slug}`}
                  className="cartao-servico group flex h-full flex-col p-5 md:p-6"
                >
                  <div className="moldura relative flex aspect-[4/3] items-center justify-center">
                    <div className="absolute inset-0 opacity-40">
                      <Padrao variante="fina" />
                    </div>
                    {foto ? (
                      <Image
                        src={asset(foto.src)}
                        alt={foto.alt}
                        width={600}
                        height={450}
                        sizes="(max-width: 640px) 88vw, (max-width: 1024px) 42vw, 28vw"
                        className="relative h-[86%] w-[88%] rounded object-cover shadow-[0_8px_22px_rgba(20,20,46,0.18)]"
                      />
                    ) : (
                      <span className="relative flex h-[86%] w-[88%] items-center justify-center rounded bg-branco text-indigo shadow-[0_8px_22px_rgba(20,20,46,0.14)]">
                        <Icone nome={servico.icone} className="h-14 w-14" />
                      </span>
                    )}
                  </div>

                  <p className="mt-6 text-center text-[15px] font-semibold leading-snug text-branco">
                    {servico.titulo}
                  </p>

                  <span
                    aria-hidden
                    className="mx-auto mt-4 block h-px w-8 bg-branco/45"
                  />

                  <span className="mt-4 text-center text-[15px] font-bold text-branco">
                    Saiba mais
                  </span>

                  <span className="sr-only">sobre {servico.titulo}</span>
                  {/* numeração discreta, ajuda a ler a grade como um conjunto */}
                  <span
                    aria-hidden
                    className="mt-4 text-center text-[11px] font-semibold tracking-[0.18em] text-branco/50"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
