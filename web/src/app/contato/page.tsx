import type { Metadata } from "next";
import { site, linkWhatsApp } from "@/content/site";
import FormularioOrcamento from "@/components/FormularioOrcamento";

export const metadata: Metadata = {
  title: "Solicitar orçamento",
  description:
    "Peça um orçamento de coleta e destinação de resíduo têxtil. Informe o tipo de resíduo, o volume mensal e a cidade da sua unidade.",
  alternates: { canonical: "/contato" },
};

export default function Contato() {
  return (
    <section className="bg-creme pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="rotulo">Orçamento</p>
          <h1 className="mt-4 text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.05]">
            Quanto resíduo a sua{" "}
            <br />
            operação gera por mês?
          </h1>
          <p className="mt-6 max-w-[44ch] text-[16.5px] leading-relaxed text-corpo">
            Com o tipo de material, o volume e a cidade, montamos a proposta com
            frequência de coleta, rota de destinação e o que você recebe de
            documentação.
          </p>

          <a
            href={linkWhatsApp(
              "Olá! Quero um orçamento de coleta de resíduo têxtil.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-cta="contato-whatsapp"
            className="pilula pilula-indigo mt-8"
          >
            Prefiro falar no WhatsApp
          </a>

          <dl className="mt-12 space-y-6">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-suave">
                E-mail
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.contato.email}`}
                  className="text-[16px] font-semibold text-indigo-esc underline decoration-indigo/30 underline-offset-4"
                >
                  {site.contato.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-suave">
                Unidade
              </dt>
              <dd className="mt-2 text-[15.5px] leading-relaxed text-corpo">
                {site.contato.endereco}{" "}
                <br />
                {site.contato.cidade}/{site.contato.uf} · CEP {site.contato.cep}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-suave">
                Área de atendimento
              </dt>
              <dd className="mt-2 text-[15.5px] leading-relaxed text-corpo">
                {site.contato.cobertura}
              </dd>
            </div>
          </dl>
        </div>

        <FormularioOrcamento />
      </div>
    </section>
  );
}
