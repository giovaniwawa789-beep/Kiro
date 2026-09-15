import { site } from "@/content/site";
import Pendente from "./Pendente";

/**
 * Faixa de selos de conformidade — compacta, do ponto de vista do benefício.
 *
 * O que MUDOU em relação à versão anterior do site: nada aqui explica o que é
 * MTR. Cada selo diz o que o cliente ganha. O número do SINIR sai de destaque e
 * volta para o lugar dele: credencial, ao lado de CNPJ e licenças.
 */

const SELOS = [
  {
    titulo: "MTR e certificado de destinação",
    beneficio:
      "A cada coleta, a documentação que seu time usa em auditoria, renovação de licença e relatório de sustentabilidade.",
    icone: (
      <>
        <path d="M14 3H6v18h12V7z" />
        <path d="M14 3v4h4" />
        <path d="M9 13.5l2 2 4-4" />
      </>
    ),
  },
  {
    titulo: "Descaracterização com registro",
    beneficio:
      "Sua marca sai de circulação junto com a peça, e o processo fica registrado em fotografia e vídeo.",
    icone: (
      <>
        <path d="M9 4l1.8 1.8h2.4L15 4l4.6 3.2-2.2 3.6-1.4-1.2V20H8V9.6L6.6 10.8 4.4 7.2z" />
        <path d="M6 18.5 18 6.5" />
      </>
    ),
  },
  {
    titulo: "Rastreabilidade por lote",
    beneficio:
      "Volume, composição e rota de destinação registrados operação por operação, não por estimativa.",
    icone: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" />
      </>
    ),
  },
  {
    titulo: "Cadeia de custódia própria",
    beneficio:
      "Coleta, transporte e transformação com equipe e estrutura nossas — sem repassar a responsabilidade.",
    icone: (
      <>
        <path d="M2 8h10v8H2z" />
        <path d="M12 11h4l4 3.5V16h-8z" />
        <circle cx="6" cy="18" r="1.9" />
        <circle cx="16.5" cy="18" r="1.9" />
      </>
    ),
  },
];

export default function FaixaSelos({
  compacta = false,
}: {
  /** `true` esconde o título da seção, para usar dentro de outra. */
  compacta?: boolean;
}) {
  return (
    <div>
      {!compacta ? (
        <>
          <p className="rotulo">Conformidade e segurança</p>
          <h2 className="display mt-3 max-w-[24ch]">
            O que sua auditoria pede, já vem no pacote
          </h2>
        </>
      ) : null}

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SELOS.map((s) => (
          <li key={s.titulo} className="border-t border-regua pt-5">
            <span aria-hidden className="text-indigo">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                {s.icone}
              </svg>
            </span>
            <h3 className="mt-4 text-[16px] leading-snug">{s.titulo}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-corpo">
              {s.beneficio}
            </p>
          </li>
        ))}
      </ul>

      {/* credenciais: aqui sim entram os números de cadastro */}
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl bg-creme px-6 py-5">
        <dl className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-baseline gap-2">
            <dt className="text-[12px] text-corpo">CNPJ</dt>
            <dd className="text-[13px] font-bold text-indigo-esc">
              {site.contato.cnpj}
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-[12px] text-corpo">Cadastro SINIR</dt>
            <dd className="text-[13px] font-bold text-indigo-esc">
              {site.contato.sinir}
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-[12px] text-corpo">Perfil no MTR</dt>
            <dd className="text-[13px] font-bold text-indigo-esc">
              {site.contato.perfilMtr}
            </dd>
          </div>
        </dl>
        <Pendente titulo="Licenças e certificações">
          Licença ambiental de operação (órgão emissor e número), CADRI se
          houver, e certificações como ISO 14001 ou Sistema B.
        </Pendente>
      </div>
    </div>
  );
}
