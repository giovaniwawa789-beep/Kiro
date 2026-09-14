import Link from "next/link";

/**
 * "Destinação": título grande à esquerda e trilha vertical pontilhada à direita,
 * com ícone circular e título de tracking largo por etapa.
 *
 * Conteúdo é a hierarquia de destinação da Nunes e Lucato — o argumento que
 * diferencia a empresa: Aterro Zero é o piso, a pergunta é o que vem antes.
 */

const ETAPAS = [
  {
    titulo: "Upcycle",
    texto:
      "O tecido volta como produto têxtil novo, com QR Code de origem. Maior valor da cadeia.",
    icone: (
      <>
        <path d="M12 20V9" />
        <path d="M7.5 13.5 12 9l4.5 4.5" />
        <path d="M6 21h12" />
      </>
    ),
  },
  {
    titulo: "Desfibramento",
    texto:
      "A fibra é recuperada e volta como fibra. Depende da triagem por cor e composição feita antes.",
    icone: (
      <>
        <path d="M12 6a6 6 0 0 1 5.2 9" />
        <path d="M12 18a6 6 0 0 1-5.2-9" />
        <path d="M15.6 13.8 17.6 16l-2.9.9" />
        <path d="M8.4 10.2 6.4 8l2.9-.9" />
      </>
    ),
  },
  {
    titulo: "Coprocessamento",
    texto:
      "Somente a fração contaminada ou irrecuperável, como último recurso, em parceria com o município.",
    icone: (
      <>
        <path d="M12 5.5 15.5 12h-7L12 5.5Z" />
        <path d="M7 18.5h10" />
      </>
    ),
  },
  {
    titulo: "Aterro Zero",
    texto:
      "Nenhuma fração encaminhada a aterro sanitário. É o compromisso que a documentação de destinação comprova.",
    destaque: true,
    icone: (
      <>
        <circle cx="12" cy="12" r="7.5" />
        <path d="M7 17 17 7" />
      </>
    ),
  },
];

export default function Destinacao() {
  return (
    <section id="destinacao" className="bg-branco py-20 md:py-28">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="rotulo">Destinação correta</p>
          <h2 className="display mt-3 text-indigo">
            Hierarquia de
            <br />
            destinação
          </h2>
          <p className="mt-6 max-w-[42ch] text-[16px] leading-relaxed text-corpo">
            Quase toda empresa do setor promete Aterro Zero. Triturar tudo e
            mandar para coprocessamento também é Aterro Zero —{" "}
            <strong className="font-semibold text-tinta">
              e encerra o ciclo têxtil
            </strong>
            . Trabalhamos numa ordem declarada, do maior valor para o menor, e só
            descemos um degrau quando o de cima não é viável.
          </p>
          <Link href="/#servicos" className="pilula pilula-vazada mt-8">
            Ver as soluções
          </Link>
        </div>

        {/* trilha vertical */}
        <ol className="relative">
          {/* linha pontilhada que conecta as etapas */}
          <span
            aria-hidden
            className="absolute left-[23px] top-4 bottom-4 w-px border-l-2 border-dotted border-regua-2"
          />

          {ETAPAS.map((etapa) => (
            <li key={etapa.titulo} className="relative flex gap-6 pb-10 last:pb-0">
              <span
                aria-hidden
                className={`relative z-10 flex h-12 w-12 flex-none items-center justify-center rounded-full border-2 bg-branco ${
                  etapa.destaque
                    ? "border-verde text-verde"
                    : "border-indigo/25 text-indigo"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {etapa.icone}
                </svg>
              </span>

              <div className="pt-1.5">
                <h3
                  className={`largo text-[clamp(1.05rem,2.2vw,1.5rem)] ${
                    etapa.destaque ? "text-verde" : "text-indigo"
                  }`}
                >
                  {etapa.titulo}
                </h3>
                <p className="mt-2 max-w-[44ch] text-[14.5px] leading-relaxed text-corpo">
                  {etapa.texto}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
