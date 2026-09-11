import Link from "next/link";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { site, linkWhatsApp } from "@/content/site";
import { servicos } from "@/content/servicos";

export default function Footer() {
  const ano = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-surface/40">
      <div className="shell grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src={asset("/simbolo_branco.png")}
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
            <span className="font-display text-[15px] font-semibold text-ink">
              {site.nome}
            </span>
          </div>
          <p className="mt-5 max-w-[32ch] text-[14px] leading-relaxed text-body">
            {site.descricao}
          </p>
          <p className="mt-5 text-[13px] leading-relaxed text-body">
            {site.contato.endereco}
            <br />
            {site.contato.cidade}/{site.contato.uf} · CEP {site.contato.cep}
          </p>
        </div>

        <nav aria-label="Serviços">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-body">
            Serviços
          </h2>
          <ul className="mt-5 space-y-2.5">
            {servicos.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicos/${s.slug}`}
                  className="text-[14px] text-body transition-colors duration-300 hover:text-ink"
                >
                  {s.titulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Navegação do rodapé">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-body">
            Navegação
          </h2>
          <ul className="mt-5 space-y-2.5">
            {[
              { rotulo: "Projetos", href: "/#projetos" },
              { rotulo: "Produtos", href: "/#produtos" },
              { rotulo: "Como trabalhamos", href: "/#como-trabalhamos" },
              { rotulo: "Perguntas frequentes", href: "/#faq" },
              { rotulo: "Sobre", href: "/sobre" },
              { rotulo: "Contato", href: "/contato" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[14px] text-body transition-colors duration-300 hover:text-ink"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-body">
            Contato
          </h2>
          <ul className="mt-5 space-y-2.5 text-[14px]">
            <li>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body transition-colors duration-300 hover:text-ink"
              >
                WhatsApp {site.contato.whatsappExibicao}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.contato.telefone.replace(/\D/g, "")}`}
                className="text-body transition-colors duration-300 hover:text-ink"
              >
                {site.contato.telefone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.contato.email}`}
                className="text-body transition-colors duration-300 hover:text-ink"
              >
                {site.contato.email}
              </a>
            </li>
          </ul>

          <ul className="mt-6 flex gap-4">
            {site.redes.map((rede) => (
              <li key={rede.nome}>
                <a
                  href={rede.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-body underline decoration-white/20 underline-offset-4 transition-colors duration-300 hover:text-ink"
                >
                  {rede.nome}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="shell flex flex-col gap-3 py-7 text-[12.5px] text-body md:flex-row md:items-center md:justify-between">
          <p>
            © {ano} {site.razaoSocial} · CNPJ {site.contato.cnpj} · Cadastro
            SINIR {site.contato.sinir}
          </p>
          <p>
            Tratamos dados pessoais conforme a LGPD (Lei nº 13.709/2018). Os
            dados enviados pelo formulário são usados apenas para responder ao
            seu contato.
          </p>
        </div>
      </div>
    </footer>
  );
}
