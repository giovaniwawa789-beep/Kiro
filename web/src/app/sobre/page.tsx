import type { Metadata } from "next";
import Image from "next/image";
import { site, linkWhatsApp } from "@/content/site";
import { projetos } from "@/content/projetos";
import Botao from "@/components/ui/Botao";

export const metadata: Metadata = {
  title: "Sobre a Nunes e Lucato",
  description:
    "Gestão ambiental especializada em resíduos têxteis: estrutura própria de transformação, equipe treinada e rastreabilidade documental completa, da coleta à destinação final.",
  alternates: { canonical: "/sobre" },
};

const PILARES = [
  {
    titulo: "Estrutura própria de transformação",
    texto:
      "A descaracterização e a confecção acontecem em unidade própria, com o processo registrado em fotografia e vídeo, peça por peça.",
  },
  {
    titulo: "Equipe treinada e artesãs capacitadas",
    texto:
      "Colaboradores treinados na operação e um time de artesãs cadastradas, que assume a confecção das peças de upcycle.",
  },
  {
    titulo: "Rastreabilidade documental completa",
    texto:
      "MTR na coleta, atestado de descaracterização ao final e documentação ambiental da destinação — da retirada ao relatório.",
  },
  {
    titulo: "Atendimento local",
    texto:
      "Operação concentrada na Capital e região, próxima à origem do resíduo, o que reduz o trecho de transporte.",
  },
];

export default function Sobre() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/8 pb-20 pt-36 md:pb-24 md:pt-44">
        <div className="glow absolute inset-0" aria-hidden />
        <div className="noise" aria-hidden />
        <div className="shell relative">
          <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            <span aria-hidden className="h-px w-8 bg-primary" />
            Sobre
          </p>
          <h1 className="max-w-4xl text-[clamp(2.1rem,5.5vw,4rem)]">
            Gestão ambiental especializada em{" "}
            <span className="text-primary">resíduos têxteis</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-body md:text-[19px]">
            A {site.nome} atua na cadeia de resíduos têxteis com estrutura
            própria de transformação, equipe treinada e rastreabilidade
            documental completa, da coleta à destinação final ambientalmente
            adequada.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell">
          <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)]">
            Como trabalhamos
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {PILARES.map((p) => (
              <li key={p.titulo} className="glass rounded-2xl p-7">
                <h3 className="text-[18px]">{p.titulo}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-body">
                  {p.texto}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/8 bg-surface/30 py-20 md:py-24">
        <div className="shell">
          <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)]">
            A hierarquia de destinação
          </h2>
          <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-body">
            Aterro Zero é o piso, não o diferencial: triturar tudo e mandar para
            coprocessamento também é Aterro Zero, e encerra o ciclo têxtil.
            Trabalhamos numa ordem declarada, do maior valor para o menor, e só
            descemos um degrau quando o de cima não é tecnicamente viável.
          </p>

          <ol className="mt-10 space-y-4">
            {[
              {
                n: "01",
                t: "Upcycle",
                d: "O tecido volta como produto têxtil novo, com valor de marca.",
                cor: "text-accent",
              },
              {
                n: "02",
                t: "Desfibramento",
                d: "A fibra é recuperada e volta como fibra, para novos usos.",
                cor: "text-primary",
              },
              {
                n: "03",
                t: "Coprocessamento",
                d: "Somente a fração irrecuperável, como último recurso.",
                cor: "text-body",
              },
              {
                n: "—",
                t: "Aterro sanitário",
                d: "Nenhuma fração.",
                cor: "text-body",
              },
            ].map((item) => (
              <li
                key={item.t}
                className="glass flex flex-col gap-3 rounded-2xl p-6 sm:flex-row sm:items-baseline sm:gap-7"
              >
                <span
                  className={`font-display text-[15px] font-semibold tabular-nums ${item.cor}`}
                >
                  {item.n}
                </span>
                <div>
                  <h3 className={`text-[18px] ${item.cor === "text-body" ? "line-through decoration-1" : ""}`}>
                    {item.t}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-body">
                    {item.d}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="shell">
          <h2 className="text-[clamp(1.6rem,3.4vw,2.4rem)]">
            Projetos e parcerias
          </h2>
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projetos.map((p) => (
              <li key={p.slug} className="glass overflow-hidden rounded-2xl">
                {p.imagem ? (
                  <div className="relative aspect-[3/2]">
                    <Image
                      src={p.imagem}
                      alt={p.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {p.cliente}
                  </p>
                  <h3 className="mt-2.5 text-[17px] leading-snug">{p.titulo}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/8 py-20 md:py-24">
        <div className="shell">
          <div className="glass rounded-2xl p-8 md:p-12">
            <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">
              Cadastro e conformidade
            </h2>
            <dl className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2">
              {[
                ["Razão social", site.razaoSocial],
                ["CNPJ", site.contato.cnpj],
                ["Código no SINIR", site.contato.sinir],
                ["Perfil no MTR", site.contato.perfilMtr],
                ["Responsável", site.contato.responsavel],
                ["Unidade", `${site.contato.endereco} — ${site.contato.cidade}/${site.contato.uf}`],
              ].map(([rotulo, valor]) => (
                <div key={rotulo} className="border-b border-white/8 pb-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-body">
                    {rotulo}
                  </dt>
                  <dd className="mt-2 text-[15px] text-ink">{valor}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10">
              <Botao href={linkWhatsApp()} externo>
                Fale conosco
              </Botao>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
