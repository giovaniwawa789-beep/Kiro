import Link from "next/link";
import { site, linkWhatsApp } from "@/content/site";
import Padrao from "@/components/ui/Padrao";

/**
 * Bloco final de conversão: painel índigo cheio, com o padrão da marca ao fundo.
 * Ancora na dor concreta (fiscalização) em vez de convite genérico.
 */
export default function CtaFinal() {
  return (
    <section id="contato-cta" className="bg-branco pb-20 md:pb-28">
      <div className="shell">
        <div className="relative overflow-hidden rounded-3xl bg-indigo-esc px-8 py-14 md:px-16 md:py-20">
          <div className="absolute inset-0 opacity-25">
            <Padrao />
          </div>

          <div className="relative text-center">
            <h2 className="mx-auto max-w-[26ch] text-[clamp(1.9rem,4.4vw,3.1rem)] text-branco">
              Numa fiscalização, o seu resíduo tem documento?
            </h2>
            <p className="mx-auto mt-6 max-w-[52ch] text-[16px] leading-relaxed text-branco/80">
              O diagnóstico responde três coisas: em que você está irregular,
              quanto material está sendo perdido e o que dele pode voltar como
              produto.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={linkWhatsApp(
                  "Olá! Gostaria de solicitar um diagnóstico de resíduos têxteis para a minha empresa.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="pilula pilula-branca"
              >
                Solicitar diagnóstico
              </a>
              <Link
                href="/contato"
                className="pilula border-[1.5px] border-branco/40 text-branco transition-colors hover:bg-branco/10"
              >
                Enviar mensagem
              </Link>
            </div>

            <p className="mt-8 text-[13px] text-branco/60">
              Cadastro no SINIR {site.contato.sinir} como{" "}
              {site.contato.perfilMtr} · CNPJ {site.contato.cnpj}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
