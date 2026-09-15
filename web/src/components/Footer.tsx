import Link from "next/link";
import Image from "next/image";
import { site, linkWhatsApp } from "@/content/site";
import { servicos } from "@/content/servicos";
import { asset } from "@/lib/asset";

/** Rodapé em bloco índigo, com colunas Links / Suporte / Contato. */
export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="bg-indigo-noite text-branco/70">
      <div className="shell grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <Image
            src={asset("/logo_white.png")}
            alt={site.nomeCompleto}
            width={620}
            height={128}
            className="h-8 w-auto"
          />
          <p className="mt-6 max-w-[34ch] text-[14px] leading-relaxed">
            {site.descricao}
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-branco/55">
            {site.contato.endereco}{" "}
            <br />
            {site.contato.cidade}/{site.contato.uf} · CEP {site.contato.cep}
          </p>
        </div>

        <nav aria-label="Links">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-branco/45">
            Links
          </h2>
          <ul className="mt-5 space-y-2.5">
            {[
              { r: "Quem somos", h: "/#quem-somos" },
              { r: "Soluções", h: "/#servicos" },
              { r: "Impactos", h: "/#impactos" },
              { r: "Projetos", h: "/#projetos" },
              { r: "Consultoria VIP", h: "/#consultoria" },
              { r: "Perguntas frequentes", h: "/#faq" },
            ].map((i) => (
              <li key={i.h}>
                <Link
                  href={i.h}
                  className="text-[14px] transition-colors duration-300 hover:text-branco"
                >
                  {i.r}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Suporte">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-branco/45">
            Suporte
          </h2>
          <ul className="mt-5 space-y-2.5">
            {servicos.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicos/${s.slug}`}
                  className="text-[14px] transition-colors duration-300 hover:text-branco"
                >
                  {s.titulo}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/sobre"
                className="text-[14px] transition-colors duration-300 hover:text-branco"
              >
                Sobre a empresa
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-branco/45">
            Contato
          </h2>
          <ul className="mt-5 space-y-2.5 text-[14px]">
            <li>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors duration-300 hover:text-branco"
              >
                WhatsApp {site.contato.whatsappExibicao}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contato.email}`}
                className="transition-colors duration-300 hover:text-branco"
              >
                {site.contato.email}
              </a>
            </li>
            <li>
              <Link
                href="/contato"
                className="transition-colors duration-300 hover:text-branco"
              >
                Formulário de contato
              </Link>
            </li>
          </ul>

          <p className="mt-6 text-[13px] leading-relaxed text-branco/55">
            Responsável técnica{" "}
            <br />
            <span className="text-branco/80">{site.contato.responsavel}</span>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-7 text-[12.5px] text-branco/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {ano} {site.razaoSocial} · CNPJ {site.contato.cnpj} · SINIR{" "}
            {site.contato.sinir}
          </p>
          <p>
            Dados tratados conforme a LGPD (Lei nº 13.709/2018), apenas para
            responder ao seu contato.
          </p>
        </div>
      </div>
    </footer>
  );
}
