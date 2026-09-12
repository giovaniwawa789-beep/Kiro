import type { Metadata } from "next";
import { site, linkWhatsApp } from "@/content/site";
import FormularioContato from "@/components/FormularioContato";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Nunes e Lucato sobre gestão de resíduos têxteis, PGRS, coleta seletiva têxtil e reciclagem de uniformes.",
  alternates: { canonical: "/contato" },
};

export default function Contato() {
  return (
    <section className="relative isolate overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="glow absolute inset-0" aria-hidden />
      <div className="noise" aria-hidden />

      <div className="shell relative grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1fr] lg:gap-20">
        <div>
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary" />
            Contato
          </p>
          <h1 className="text-[clamp(2rem,4.5vw,3.4rem)]">
            Vamos falar sobre o seu{" "}
            <span className="text-primary">resíduo têxtil</span>
          </h1>
          <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-body">
            Conte o volume aproximado, o tipo de material e a cidade da unidade.
            Voltamos com o diagnóstico, o escopo documental e o calendário da
            operação.
          </p>

          <dl className="mt-10 space-y-6">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-body">
                WhatsApp
              </dt>
              <dd className="mt-2">
                <a
                  href={linkWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] text-ink underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent"
                >
                  {site.contato.whatsappExibicao}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-body">
                E-mail
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${site.contato.email}`}
                  className="text-[16px] text-ink underline decoration-primary/40 underline-offset-4 transition-colors hover:text-accent"
                >
                  {site.contato.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-body">
                Unidade
              </dt>
              <dd className="mt-2 text-[15.5px] leading-relaxed text-body">
                {site.contato.endereco}
                <br />
                {site.contato.cidade}/{site.contato.uf} · CEP {site.contato.cep}
              </dd>
            </div>
          </dl>
        </div>

        <FormularioContato />
      </div>
    </section>
  );
}
