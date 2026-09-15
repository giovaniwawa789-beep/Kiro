/**
 * Números de impacto e contexto do problema.
 *
 * REGRA: nada aqui pode ser estimado por conta própria. Cada item tem `origem`.
 * O que não tenho, fica `valor: null` e a interface renderiza {{PREENCHER}}
 * visível — de propósito, para não subir ao ar com número inventado.
 *
 * Números ambientais (CO₂ evitado, água poupada) exigem metodologia declarada.
 * Não estimo fator de emissão: sem memória de cálculo, o número vira
 * greenwashing na primeira pergunta de auditoria.
 */

export interface Numero {
  /** null = dado ainda não fornecido; a UI mostra o marcador. */
  valor: string | null;
  unidade?: string;
  rotulo: string;
  origem: string;
  /** Metodologia, quando o número é ambiental calculado. */
  metodologia?: string;
}

/** Os três da faixa de credibilidade, logo abaixo do hero. */
export const destaques: Numero[] = [
  {
    valor: "2.500",
    unidade: "+",
    rotulo: "peças produzidas a partir de resíduo têxtil",
    origem: "Projetos Midea Carrier e Santista, informado pelo cliente",
  },
  {
    valor: "40",
    unidade: " t/mês",
    rotulo: "resíduo têxtil realocado para reciclagem",
    origem: "Projeto Bom Retiro Recicla, informado pelo cliente",
  },
  {
    valor: null,
    unidade: "",
    rotulo: "empresas atendidas",
    origem: "{{PREENCHER}} — número de clientes atendidos até hoje",
  },
];

/** Painel completo da seção de impacto. */
export const numerosImpacto: Numero[] = [
  ...destaques.slice(0, 2),
  {
    valor: null,
    unidade: " t",
    rotulo: "desviadas de aterro sanitário",
    origem: "{{PREENCHER}} — total acumulado de toneladas desviadas",
  },
  {
    valor: null,
    unidade: "%",
    rotulo: "de aproveitamento do material recebido",
    origem: "{{PREENCHER}} — percentual médio de aproveitamento",
  },
  {
    valor: null,
    unidade: " t",
    rotulo: "de CO₂ evitado",
    origem: "{{PREENCHER}} — total de CO₂ evitado",
    metodologia:
      "{{PREENCHER}} — fator de emissão e metodologia de cálculo usados. Sem memória de cálculo declarada, este número não deve ser publicado.",
  },
  {
    valor: null,
    unidade: " L",
    rotulo: "de água poupada",
    origem: "{{PREENCHER}} — total de água poupada",
    metodologia:
      "{{PREENCHER}} — metodologia de cálculo. Mesma regra do CO₂: sem memória de cálculo, não publicar.",
  },
  {
    valor: null,
    unidade: "",
    rotulo: "postos de trabalho e renda gerados",
    origem: "{{PREENCHER}} — artesãs, cooperativas e ateliês na cadeia",
  },
  {
    valor: "1.000",
    unidade: " t/mês",
    rotulo: "capacidade projetada no Bioma Têxtil",
    origem:
      "Proposta institucional em análise pela Prefeitura de São Paulo — projeto ainda não operante",
  },
];

/**
 * Contexto do problema, para a página Sobre.
 *
 * As duas fontes que encontrei divergem no escopo, e por isso as duas estão
 * aqui em vez de uma média inventada. Escolha qual adotar e cite a fonte na
 * página — número de mercado sem fonte é o primeiro item que um comprador
 * corporativo questiona.
 */
export const contextoProblema = [
  {
    numero: "4 milhões de t/ano",
    afirmacao:
      "de resíduo têxtil descartado no Brasil, com menos de 1% retornando a novos ciclos produtivos",
    fonte: "S2F Partners e Fundação Ellen MacArthur, via Cotton Move",
    url: "https://www.cottonmove.com.br",
  },
  {
    numero: "170 mil t/ano",
    afirmacao:
      "de resíduo têxtil gerado no Brasil, com cerca de 20% reciclado",
    fonte: "Sebrae (2023), via Portal do Agronegócio",
    url: "https://www.portaldoagronegocio.com.br/agroindustria/processamento/noticias/residuos-texteis-viram-materia-prima-e-impulsionam-economia-circular-na-industria",
  },
] as const;

export const notaDivergencia =
  "As duas fontes divergem porque medem escopos diferentes (resíduo industrial de confecção versus pós-consumo total). Defina o recorte antes de publicar e cite a fonte escolhida.";
