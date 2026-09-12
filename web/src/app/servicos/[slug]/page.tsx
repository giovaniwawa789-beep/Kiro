import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { servicos, servicoPorSlug } from "@/content/servicos";
import { linkWhatsApp } from "@/content/site";
import Botao from "@/components/ui/Botao";
import Icone from "@/components/Icone";

/** Uma rota estática por serviço, gerada a partir do arquivo de conteúdo. */
export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) return {};

  return {
    // `absolute` evita que o template do layout duplique "| Nunes e Lucato",
    // já presente no título de SEO de cada serviço.
    title: { absolute: servico.seo.title },
    description: servico.seo.description,
    alternates: { canonical: `/servicos/${servico.slug}` },
    openGraph: {
      title: servico.seo.title,
      description: servico.seo.description,
      url: `/servicos/${servico.slug}`,
    },
  };
}

export default async function PaginaServico({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servico = servicoPorSlug(slug);
  if (!servico) notFound();

  const outros = servicos.filter((s) => s.slug !== servico.slug).slice(0, 3);

  return (
    <>
      {/* hero próprio do serviço */}
      <section className="relative isolate overflow-hidden border-b border-white/8 pb-20 pt-36 md:pb-24 md:pt-44">
        <div className="glow absolute inset-0" aria-hidden />
        <div className="noise" aria-hidden />

        <div className="shell relative">
          <nav aria-label="Trilha de navegação" className="mb-8 text-[13px]">
            <ol className="flex flex-wrap items-center gap-2 text-body">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  Início
                </Link>
              </li>
              <li aria-hidden className="text-body">
                /
              </li>
              <li>
                <Link href="/#servicos" className="transition-colors hover:text-ink">
                  Serviços
                </Link>
              </li>
              <li aria-hidden className="text-body">
                /
              </li>
              <li className="text-ink">{servico.titulo}</li>
            </ol>
          </nav>

          <span className="text-primary">
            <Icone nome={servico.icone} className="h-11 w-11" />
          </span>

          <h1 className="mt-7 max-w-4xl text-[clamp(2.1rem,5.5vw,4rem)]">
            {servico.titulo}
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-body md:text-[19px]">
            {servico.descricao}
          </p>

          <div className="mt-10">
            <Botao href={linkWhatsApp(`Olá! Quero falar sobre: ${servico.titulo}`)} externo>
              Fale conosco
            </Botao>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">O que está incluso</h2>
            <ul className="mt-7 space-y-4">
              {servico.entregas.map((entrega) => (
                <li
                  key={entrega}
                  className="glass flex items-start gap-4 rounded-2xl p-5"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/15 text-primary"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M3 8.5 6 11.5 13 4.5" />
                    </svg>
                  </span>
                  <span className="text-[15px] text-ink">{entrega}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">Benefícios</h2>
            <ul className="mt-7 space-y-4">
              {servico.beneficios.map((b) => (
                <li
                  key={b}
                  className="border-b border-white/8 pb-4 text-[15px] leading-relaxed text-body"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-surface/30 py-20 md:py-24">
        <div className="shell">
          <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">Base legal aplicável</h2>
          <p className="mt-4 max-w-2xl text-[15px] text-body">
            Referências que orientam o serviço. O enquadramento exato da sua
            operação é confirmado no diagnóstico.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {servico.baseLegal.map((lei) => (
              <li
                key={lei}
                className="glass rounded-2xl p-6 text-[14px] leading-relaxed text-body"
              >
                {lei}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell">
          <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">Outros serviços</h2>
          <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {outros.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/servicos/${s.slug}`}
                  className="group glass flex h-full flex-col rounded-2xl p-6 transition-[transform,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.02] hover:border-accent/60"
                >
                  <span className="text-primary transition-colors duration-300 group-hover:text-accent">
                    <Icone nome={s.icone} className="h-8 w-8" />
                  </span>
                  <h3 className="mt-5 text-[17px] leading-snug">{s.titulo}</h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-body">
                    {s.resumo}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
