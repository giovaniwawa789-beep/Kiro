/**
 * "O Fio" — mosaico geométrico da Nunes e Lucato.
 *
 * Cumpre no layout o mesmo papel do mosaico da concorrente: moldura e fundo das
 * fotos de produto. Mosaico geométrico em grade é convenção do setor, mas o
 * repertório de formas aqui é próprio — arco de linha, ponto de costura, laço e
 * furo de agulha, tudo derivado do símbolo da logomarca. Nada é redesenho do
 * mosaico deles.
 *
 * Uma grade densa de células é o que faz ler como tecido; a versão anterior era
 * esparsa e parecia glifo solto.
 */

interface Props {
  className?: string;
  /** `fina` reduz a célula, para molduras estreitas. */
  variante?: "normal" | "fina";
}

/** Célula: cada função desenha dentro de um quadrado c x c. */
function celulas(c: number) {
  const I = "var(--color-indigo)";
  const meio = c / 2;

  return [
    // quarto de disco cheio
    <path key="a" d={`M0 ${c} A ${c} ${c} 0 0 1 ${c} 0 L ${c} ${c} Z`} fill={I} opacity="0.9" />,
    // arcos concêntricos
    <g key="b" fill="none" stroke={I} strokeWidth={c * 0.09} opacity="0.75">
      <path d={`M0 ${c} A ${c * 0.34} ${c * 0.34} 0 0 1 ${c * 0.34} ${c * 0.66}`} />
      <path d={`M0 ${c} A ${c * 0.62} ${c * 0.62} 0 0 1 ${c * 0.62} ${c * 0.38}`} />
      <path d={`M0 ${c} A ${c * 0.9} ${c * 0.9} 0 0 1 ${c * 0.9} ${c * 0.1}`} />
    </g>,
    // pontos de costura verticais
    <g key="c" stroke={I} strokeWidth={c * 0.085} opacity="0.8" strokeLinecap="round">
      <line x1={c * 0.2} y1={c * 0.22} x2={c * 0.2} y2={c * 0.44} />
      <line x1={c * 0.2} y1={c * 0.56} x2={c * 0.2} y2={c * 0.78} />
      <line x1={c * 0.5} y1={c * 0.22} x2={c * 0.5} y2={c * 0.44} />
      <line x1={c * 0.5} y1={c * 0.56} x2={c * 0.5} y2={c * 0.78} />
      <line x1={c * 0.8} y1={c * 0.22} x2={c * 0.8} y2={c * 0.44} />
      <line x1={c * 0.8} y1={c * 0.56} x2={c * 0.8} y2={c * 0.78} />
    </g>,
    // furo de agulha: anel + centro
    <g key="d">
      <circle cx={meio} cy={meio} r={c * 0.34} fill="none" stroke={I} strokeWidth={c * 0.1} opacity="0.8" />
      <circle cx={meio} cy={meio} r={c * 0.12} fill={I} opacity="0.9" />
    </g>,
    // meia-lua
    <path key="e" d={`M${meio} 0 A ${meio} ${meio} 0 0 1 ${meio} ${c} Z`} fill={I} opacity="0.55" />,
    // trama diagonal
    <g key="f" stroke={I} strokeWidth={c * 0.08} opacity="0.65">
      <line x1="0" y1={c * 0.3} x2={c * 0.7} y2={c} />
      <line x1="0" y1={c * 0.65} x2={c * 0.35} y2={c} />
      <line x1={c * 0.3} y1="0" x2={c} y2={c * 0.7} />
      <line x1={c * 0.65} y1="0" x2={c} y2={c * 0.35} />
    </g>,
    // laço do fio
    <path
      key="g"
      d={`M0 ${c * 0.3} Q ${meio} ${c * 0.3} ${meio} ${meio} T ${c} ${c * 0.7}`}
      fill="none"
      stroke={I}
      strokeWidth={c * 0.1}
      strokeLinecap="round"
      opacity="0.8"
    />,
    // quadrado dentro de quadrado
    <g key="h">
      <rect x={c * 0.16} y={c * 0.16} width={c * 0.68} height={c * 0.68} fill="none" stroke={I} strokeWidth={c * 0.09} opacity="0.7" />
      <rect x={c * 0.38} y={c * 0.38} width={c * 0.24} height={c * 0.24} fill={I} opacity="0.85" />
    </g>,
    // barras horizontais
    <g key="i" fill={I} opacity="0.7">
      <rect x="0" y={c * 0.16} width={c} height={c * 0.12} />
      <rect x="0" y={c * 0.44} width={c} height={c * 0.12} />
      <rect x="0" y={c * 0.72} width={c} height={c * 0.12} />
    </g>,
    // célula vazia: respiro, evita o padrão virar bloco chapado
    <g key="j" />,
  ];
}

/** Arranjo 4x4 dos índices de célula: sequência escolhida para não criar faixas. */
const ARRANJO = [
  [0, 3, 6, 9],
  [2, 5, 1, 4],
  [7, 9, 8, 0],
  [4, 1, 3, 6],
];

export default function Padrao({ className = "", variante = "normal" }: Props) {
  const c = variante === "fina" ? 26 : 40;
  const tile = c * 4;
  const lista = celulas(c);
  const id = `mosaico-${variante}`;

  return (
    <svg
      aria-hidden
      focusable="false"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
          {ARRANJO.flatMap((linha, y) =>
            linha.map((indice, x) => (
              <g key={`${x}-${y}`} transform={`translate(${x * c}, ${y * c})`}>
                {lista[indice]}
              </g>
            )),
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Foto dentro de moldura padronizada. */
export function MolduraFoto({
  children,
  className = "",
  respiro = "p-5 md:p-7",
}: {
  children: React.ReactNode;
  className?: string;
  respiro?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <div className="absolute inset-0 opacity-[0.55]">
        <Padrao />
      </div>
      <div className={`relative ${respiro}`}>{children}</div>
    </div>
  );
}
