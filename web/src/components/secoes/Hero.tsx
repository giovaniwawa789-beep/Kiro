import Image from "next/image";
import Link from "next/link";
import { linkWhatsApp } from "@/content/site";
import { asset } from "@/lib/asset";

/**
 * Hero focado na dor e no desfecho, não no processo.
 *
 * Foto real de operação (fardos no pátio de triagem), nunca banco de imagem.
 * Componente de servidor: zero JavaScript, o conteúdo pinta no primeiro quadro.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-creme pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_1fr] lg:gap-16">
        <div>
          <p className="rotulo">Gestão de resíduos têxteis · São Paulo e região</p>

          <h1 className="mt-4 text-[clamp(2.3rem,5.6vw,4.15rem)] leading-[1.03]">
            Seu resíduo têxtil não
            <br />
            precisa terminar
            <br />
            <span className="text-indigo">em aterro.</span>
          </h1>

          <p className="mt-6 max-w-[50ch] text-[17px] leading-relaxed text-corpo">
            Coletamos o resíduo da sua produção, dos seus uniformes e do seu
            estoque, devolvemos o material ao mercado como matéria-prima ou
            produto — e entregamos a documentação que sua auditoria pede.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href={linkWhatsApp(
                "Olá! Quero solicitar um diagnóstico de resíduo têxtil para a minha empresa.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              data-cta="hero-diagnostico"
              className="pilula pilula-indigo"
            >
              Solicitar diagnóstico
            </a>
            <Link
              href="/#servicos"
              data-cta="hero-servicos"
              className="pilula pilula-vazada"
            >
              Ver nossos serviços
            </Link>
          </div>
        </div>

        <div className="relative">
          <Image
            src={asset("/fotos/operacao_fardos.jpg")}
            alt="Empilhadeira movimentando fardos de resíduo têxtil no pátio de triagem da unidade"
            width={1200}
            height={800}
            priority
            sizes="(max-width: 1024px) 92vw, 48vw"
            className="h-auto w-full rounded-2xl object-cover shadow-[0_20px_50px_rgba(20,20,46,0.16)]"
          />
          {/* etiqueta sobre a foto: reforça que é operação real, não estoque */}
          <p className="absolute bottom-4 left-4 rounded-lg bg-branco/95 px-4 py-2.5 text-[12px] font-semibold text-indigo-esc backdrop-blur-sm">
            Pátio de triagem · unidade própria
          </p>
        </div>
      </div>
    </section>
  );
}
