import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/asset";
import { site } from "@/content/site";
import Padrao from "@/components/ui/Padrao";

/**
 * "Quem somos": rótulo em índigo, título forte, foto da operação com selo de
 * cadastro, e um cartão de destaque para o projeto Bioma Têxtil.
 */
export default function QuemSomos() {
  return (
    <section id="quem-somos" className="bg-branco py-20 md:py-28">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="rotulo">Quem somos</p>
          <h2 className="display mt-3 max-w-[20ch]">
            Especialistas em resíduo têxtil, da coleta ao laudo
          </h2>
          <p className="mt-6 max-w-[52ch] text-[16px] leading-relaxed text-corpo">
            Atuamos na cadeia de resíduos têxteis com estrutura própria de
            transformação, equipe treinada e rastreabilidade documental completa.
            O processo é registrado em fotografia e vídeo, peça por peça.
          </p>

          <div className="relative mt-9">
            <Image
              src={asset("/fotos/operacao_fardos.jpg")}
              alt="Movimentação de fardos de resíduo têxtil no pátio de triagem"
              width={1200}
              height={800}
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="h-auto w-full rounded-xl"
            />
            {/* selo de cadastro: o equivalente factual a um selo de certificação */}
            <div className="absolute bottom-4 right-4 rounded-xl bg-branco/95 px-5 py-4 shadow-[0_10px_28px_rgba(20,20,46,0.14)] backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-suave">
                Cadastro SINIR
              </p>
              <p className="mt-1 font-display text-[20px] font-extrabold leading-none text-indigo">
                {site.contato.sinir}
              </p>
              <p className="mt-1 text-[11px] text-corpo">
                Perfil {site.contato.perfilMtr}
              </p>
            </div>
          </div>
        </div>

        {/* cartão de destaque do projeto */}
        <Link
          href="/#projetos"
          className="group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-2xl bg-creme p-8 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 md:p-10"
        >
          <div className="absolute inset-0 opacity-55">
            <Padrao />
          </div>

          <span className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-indigo text-branco transition-transform duration-300 group-hover:translate-x-1">
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5" />
            </svg>
          </span>

          <div className="relative rounded-xl bg-branco/95 p-6 backdrop-blur-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo">
              Projeto em proposta
            </p>
            <p className="mt-2 font-display text-[26px] font-extrabold leading-tight text-tinta">
              Bioma Têxtil
              <br />
              Ecoponto Belezinho
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-corpo">
              O primeiro bioma sustentável de reciclagem têxtil do município de
              São Paulo, com capacidade projetada de 1.000 t/mês.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
