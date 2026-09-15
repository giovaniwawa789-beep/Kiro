import { site, linkWhatsApp } from "@/content/site";
import FormularioOrcamento from "@/components/FormularioOrcamento";

/**
 * Conversão final: formulário curto de orçamento com o WhatsApp ao lado.
 * Quem já decidiu vai para o WhatsApp; quem precisa registrar internamente
 * usa o formulário.
 */
export default function CtaFinal() {
  return (
    <section id="orcamento" className="bg-branco py-20 md:py-28">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="rotulo">Orçamento</p>
          <h2 className="display mt-3 max-w-[20ch]">
            Vamos calcular o seu volume
          </h2>
          <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-corpo">
            Informe o tipo de material, o volume mensal e a cidade da unidade.
            Voltamos com frequência de coleta, rota de destinação e o que você
            recebe de documentação.
          </p>

          <a
            href={linkWhatsApp(
              "Olá! Quero um orçamento de coleta de resíduo têxtil.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="cta-final-whatsapp"
            className="pilula pilula-indigo mt-8"
          >
            Prefiro falar no WhatsApp
          </a>

          <p className="mt-10 text-[13.5px] leading-relaxed text-suave">
            {site.contato.cobertura}
          </p>
        </div>

        <FormularioOrcamento />
      </div>
    </section>
  );
}
