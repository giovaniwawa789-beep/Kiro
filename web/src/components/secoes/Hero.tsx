import Image from "next/image";
import Link from "next/link";
import { site, linkWhatsApp } from "@/content/site";
import { asset } from "@/lib/asset";
import Padrao from "@/components/ui/Padrao";

/**
 * Hero: fundo creme, wordmark gigante em índigo, subtítulo em duas linhas e
 * foto de produto sobre o padrão "O Fio".
 *
 * Sem animação de entrada e sem WebGL: o conteúdo pinta no primeiro quadro.
 * É componente de servidor — zero JavaScript enviado por esta seção.
 */
export default function Hero() {
  return (
    <section className="bg-creme pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="shell grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div>
          <h1 className="text-[clamp(2.4rem,10.5vw,6.2rem)] leading-[0.92] text-indigo">
            Nunes<span className="text-tinta">&amp;</span>Lucato
          </h1>
          <p className="mt-5 max-w-[22ch] text-[clamp(1.15rem,2.4vw,1.6rem)] font-bold leading-[1.25] tracking-[-0.02em] text-tinta">
            Gestão ambiental de resíduos têxteis, da coleta ao produto.
          </p>
          <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-corpo">
            Documentação exigida pelo órgão ambiental, coleta com MTR,
            descaracterização peça por peça e retorno do material como produto de
            marca. Uma custódia, um responsável, um relatório.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={linkWhatsApp(
                "Olá! Gostaria de solicitar um diagnóstico de resíduos têxteis para a minha empresa.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="pilula pilula-indigo"
            >
              Solicitar diagnóstico
            </a>
            <Link href="/#servicos" className="pilula pilula-vazada">
              Conheça as soluções
            </Link>
          </div>

          <p className="mt-8 text-[13px] text-suave">
            {site.contato.cidade}/{site.contato.uf} · Cadastro no SINIR{" "}
            {site.contato.sinir} como {site.contato.perfilMtr} · MTR a cada coleta
          </p>
        </div>

        {/* foto de produto sobre o padrão */}
        <div className="relative">
          <div className="absolute inset-0 opacity-60">
            <Padrao />
          </div>
          <div className="relative flex items-center justify-center p-6 md:p-10">
            <Image
              src={asset("/fotos/produto_ecobag.jpg")}
              alt="Ecobag confeccionada a partir de uniforme corporativo reaproveitado"
              width={1000}
              height={1000}
              priority
              sizes="(max-width: 1024px) 90vw, 46vw"
              className="h-auto w-full max-w-[430px] rounded-lg shadow-[0_18px_48px_rgba(20,20,46,0.14)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
