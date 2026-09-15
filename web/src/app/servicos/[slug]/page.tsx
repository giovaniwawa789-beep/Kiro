import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { servicos, servicoPorSlug } from "@/content/servicos";
import { segmentos } from "@/content/segmentos";
import { linkWhatsApp } from "@/content/site";
import { asset } from "@/lib/asset";
import Icone from "@/components/Icone";
import CardServico from "@/components/ui/CardServico";
import FaixaSelos from "@/components/ui/FaixaSelos";

export function generateStaticParams() {
  return servicos.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = servicoPorSlug(slug);
  if (!s) return {};

  return {
    // absolute evita o template do layout duplicar o nome da empresa
    title: { absolute: `${s.seo.title} | Nunes e Lucato` },
    description: s.seo.description,
    alternates: { canonical: `/servicos/${s.slug}` },
    openGraph: {
      title: s.seo.title,
      description: s.seo.description,
      url: `/servicos/${s.slug}`,
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
  const setores = segmentos.filter((s) => s.servico === servico.slug);

  return (
    <>
      {/* ---------------- abertura ---------------- */}
      <section className="bg-creme pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="shell">
          <nav aria-label="Trilha de navegação" className="mb-8 text-[13px]">
            <ol className="flex flex-wrap items-center gap-2 text-corpo">
              <li>
                <Link href="/" className="hover:text-indigo">
                  Início
                </Link>
              </li>
              <li aria-hidden className="text-suave">
                /
              </li>
              <li>
                <Link href="/#servicos" className="hover:text-indigo">
                  Serviços
                </Link>
              </li>
              <li aria-hidden className="text-suave">
                /
              </li>
              <li className="font-semibold text-tinta">{servico.curto}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <span aria-hidden className="text-indigo">
                <Icone nome={servico.icone} className="h-11 w-11" />
              </span>
              <h1 className="mt-6 max-w-[22ch] text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[1.05]">
                {servico.titulo}
              </h1>
              <p className="mt-6 max-w-[50ch] text-[17px] font-semibold leading-relaxed text-tinta">
                {servico.beneficio}
              </p>
              <a
                href={linkWhatsApp(`Olá! Quero falar sobre: ${servico.titulo}`)}
                target="_blank"
                rel="noopener noreferrer"
                data-cta={`servico-${servico.slug}`}
                className="pilula pilula-indigo mt-8"
              >
                Solicitar diagnóstico
              </a>
            </div>

            {servico.foto ? (
              <Image
                src={asset(servico.foto.src)}
                alt={servico.foto.alt}
                width={1200}
                height={800}
                priority
                sizes="(max-width: 1024px) 92vw, 46vw"
                className="h-auto w-full rounded-2xl object-cover shadow-[0_18px_44px_rgba(20,20,46,0.14)]"
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------- dor e solução ---------------- */}
      <section className="bg-branco py-20 md:py-28">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-suave">
              O problema
            </h2>
            <p className="mt-4 text-[19px] leading-relaxed text-tinta">
              {servico.dor}
            </p>
          </div>
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
              Como resolvemos
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-corpo">
              {servico.solucao}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- o que você recebe ---------------- */}
      <section className="bg-creme py-20 md:py-24">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
          <div>
            <h2 className="display max-w-[16ch]">O que você recebe</h2>
            <ul className="mt-8 space-y-3">
              {servico.entregas.map((e) => (
                <li
                  key={e}
                  className="flex items-start gap-4 rounded-xl bg-branco p-5"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-indigo text-branco"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3 w-3"
                    >
                      <path d="M3 8.5 6 11.5 13 4.5" />
                    </svg>
                  </span>
                  <span className="text-[15px] font-medium text-tinta">{e}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.16em] text-suave">
              Para quem é
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {servico.paraQuem.map((q) => (
                <li
                  key={q}
                  className="rounded-full border border-regua bg-branco px-4 py-2 text-[14px] text-tinta"
                >
                  {q}
                </li>
              ))}
            </ul>

            {setores.length > 0 ? (
              <>
                <h3 className="mt-10 text-[11px] font-bold uppercase tracking-[0.16em] text-suave">
                  Segmentos com essa dor
                </h3>
                <ul className="mt-4 space-y-3">
                  {setores.map((s) => (
                    <li key={s.slug} className="border-t border-regua pt-3">
                      <p className="text-[15px] font-semibold text-tinta">
                        {s.nome}
                      </p>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-corpo">
                        {s.dor}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------- conformidade compacta ---------------- */}
      <section className="bg-branco py-20 md:py-24">
        <div className="shell">
          <FaixaSelos />
        </div>
      </section>

      {/* ---------------- outros serviços ---------------- */}
      <section className="bg-creme py-20 md:py-24">
        <div className="shell">
          <h2 className="display max-w-[18ch]">Outros serviços</h2>
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {outros.map((s) => (
              <li key={s.slug} className="flex">
                <CardServico servico={s} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
