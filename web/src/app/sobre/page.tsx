import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, linkWhatsApp } from "@/content/site";
import { asset } from "@/lib/asset";
import {
  origem,
  marcos,
  tese,
  missao,
  impactoSocial,
  operacao,
} from "@/content/sobre";
import { contextoProblema, notaDivergencia } from "@/content/impacto";
import Timeline from "@/components/ui/Timeline";
import FaixaSelos from "@/components/ui/FaixaSelos";
import Pendente, { BlocoPendente } from "@/components/ui/Pendente";

export const metadata: Metadata = {
  title: "Sobre a Nunes e Lucato",
  description:
    "Quem somos, por que existimos e quem trabalha na nossa cadeia. Operação de circularidade têxtil em São Paulo, com estrutura própria de transformação.",
  alternates: { canonical: "/sobre" },
};

export default function Sobre() {
  return (
    <>
      {/* ---------------- abertura ---------------- */}
      <section className="bg-creme pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="shell">
          <p className="rotulo">Sobre</p>
          <h1 className="mt-4 max-w-[24ch] text-[clamp(2.3rem,5.4vw,4rem)] leading-[1.04]">
            Existimos porque tecido bom{" "}
            <br />
            <span className="text-indigo">estava virando aterro.</span>
          </h1>
        </div>
      </section>

      {/* ---------------- a origem ---------------- */}
      <section className="bg-branco py-20 md:py-28">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <h2 className="display max-w-[16ch]">A origem</h2>
            <div className="mt-8 space-y-5">
              {origem.map((p, i) =>
                p.texto ? (
                  <p
                    key={i}
                    className="max-w-[58ch] text-[16.5px] leading-relaxed text-corpo"
                  >
                    {p.texto}
                  </p>
                ) : (
                  <BlocoPendente key={i} titulo={`parágrafo ${i + 1} da história`}>
                    {p.orientacao}
                  </BlocoPendente>
                ),
              )}
            </div>
          </div>

          <Image
            src={asset("/fotos/residuo_aparas.jpg")}
            alt="Fardos e sacos de aparas têxteis na unidade, antes da triagem"
            width={1200}
            height={800}
            sizes="(max-width: 1024px) 92vw, 44vw"
            className="h-auto w-full rounded-2xl object-cover"
          />
        </div>
      </section>

      {/* ---------------- linha do tempo ---------------- */}
      <section className="bg-creme py-20 md:py-28">
        <div className="shell">
          <p className="rotulo">Trajetória</p>
          <h2 className="display mt-3 max-w-[18ch]">Linha do tempo</h2>
          <p className="mt-6 max-w-[54ch] text-[16.5px] leading-relaxed text-corpo">
            Os marcos com círculo cheio têm lastro nos nossos registros. Os
            demais aguardam data.
          </p>
          <div className="mt-12">
            <Timeline marcos={marcos} />
          </div>
        </div>
      </section>

      {/* ---------------- por que existimos ---------------- */}
      <section className="bg-branco py-20 md:py-28">
        <div className="shell">
          <p className="rotulo">Por que existimos</p>
          <h2 className="display mt-3 max-w-[22ch]">O problema, em número</h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {contextoProblema.map((c) => (
              <div
                key={c.fonte}
                className="rounded-2xl border border-regua-2 p-7"
              >
                <p className="font-display text-[clamp(1.7rem,3.4vw,2.4rem)] font-extrabold leading-none tracking-[-0.03em] text-indigo-esc">
                  {c.numero}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-corpo">
                  {c.afirmacao}
                </p>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-[13px] font-semibold text-indigo underline decoration-indigo/30 underline-offset-4"
                >
                  Fonte: {c.fonte}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6">
            <Pendente titulo="Decisão editorial">{notaDivergencia}</Pendente>
          </p>

          <h3 className="mt-16 text-[clamp(1.4rem,2.8vw,2rem)]">
            No que acreditamos
          </h3>
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {tese.map((t) => (
              <li key={t.titulo} className="border-t-2 border-indigo pt-5">
                <h4 className="text-[17px] leading-snug">{t.titulo}</h4>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-corpo">
                  {t.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- missão, visão e valores ---------------- */}
      <section className="bg-creme py-20 md:py-28">
        <div className="shell">
          <p className="rotulo">Missão, visão e valores</p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-branco p-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
                Missão
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-corpo">
                {missao.missao}
              </p>
            </div>
            <div className="rounded-2xl bg-branco p-7">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-indigo">
                Visão
              </h3>
              <p className="mt-3 text-[16px] leading-relaxed text-corpo">
                {missao.visao}
              </p>
            </div>
          </div>

          <h3 className="mt-14 text-[clamp(1.4rem,2.8vw,2rem)]">Valores</h3>
          <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-corpo">
            Cada um destes é uma regra que pode ser quebrada na prática — por
            isso serve como valor.
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {missao.valores.map((v) => (
              <li key={v.nome} className="border-t border-regua pt-5">
                <h4 className="text-[17px] leading-snug">{v.nome}</h4>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-corpo">
                  {v.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- impacto social ---------------- */}
      <section className="bg-branco py-20 md:py-28">
        <div className="shell">
          <p className="rotulo">Impacto social</p>
          <h2 className="display mt-3 max-w-[22ch]">Quem costura aparece</h2>
          <p className="mt-6 max-w-[58ch] text-[16.5px] leading-relaxed text-corpo">
            {impactoSocial.texto}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {impactoSocial.fotos.map((f) => (
              <Image
                key={f.src}
                src={asset(f.src)}
                alt={f.alt}
                width={1200}
                height={800}
                sizes="(max-width: 640px) 92vw, 31vw"
                className="h-full w-full rounded-xl object-cover"
              />
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {impactoSocial.numeros.map((n) => (
              <div key={n.rotulo} className="border-t border-regua pt-5">
                <dt>
                  <Pendente titulo="Número pendente">{n.origem}</Pendente>
                </dt>
                <dd className="mt-3 text-[14px] leading-snug text-corpo">
                  {n.rotulo}
                </dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-14 text-[19px]">Programas da cadeia</h3>
          <ul className="mt-4 space-y-2.5">
            {impactoSocial.programas.map((p) => (
              <li
                key={p}
                className="flex gap-3 text-[15px] leading-relaxed text-corpo"
              >
                <span
                  aria-hidden
                  className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-indigo"
                />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- nossa operação ---------------- */}
      <section className="bg-creme py-20 md:py-28">
        <div className="shell">
          <p className="rotulo">Nossa operação</p>
          <h2 className="display mt-3 max-w-[20ch]">Estrutura e capacidade</h2>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {operacao.fotos.map((f) => (
              <Image
                key={f.src}
                src={asset(f.src)}
                alt={f.alt}
                width={1200}
                height={800}
                sizes="(max-width: 640px) 92vw, 31vw"
                className="h-full w-full rounded-xl object-cover"
              />
            ))}
          </div>

          <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {operacao.itens.map((o) => (
              <div key={o.rotulo} className="border-t border-regua pt-5">
                <dt>
                  <Pendente titulo="Dado da operação">{o.origem}</Pendente>
                </dt>
                <dd className="mt-3 text-[14px] leading-snug text-corpo">
                  {o.rotulo}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[14px] leading-relaxed text-corpo">
            Unidade em {site.contato.endereco} — {site.contato.cidade}/
            {site.contato.uf}.
          </p>
        </div>
      </section>

      {/* ---------------- credenciais ---------------- */}
      {/* branco de propósito: a seção de operação acima é creme, e a de time que
          ficava entre as duas saiu. Sem esta troca, as duas faixas creme se
          fundiriam numa só. */}
      <section className="bg-branco py-20 md:py-28">
        <div className="shell">
          <FaixaSelos />
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-branco pb-20 md:pb-28">
        <div className="shell">
          <div className="rounded-3xl bg-indigo-esc px-8 py-14 text-center md:px-16">
            <h2 className="mx-auto max-w-[24ch] text-[clamp(1.8rem,4vw,2.8rem)] text-branco">
              Converse com o nosso time
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={linkWhatsApp(
                  "Olá! Vi o site e quero conversar sobre resíduo têxtil.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="sobre-whatsapp"
                className="pilula pilula-branca"
              >
                Falar no WhatsApp
              </a>
              <Link
                href="/#servicos"
                className="pilula border-[1.5px] border-branco/40 text-branco transition-colors hover:bg-branco/10"
              >
                Ver nossos serviços
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
