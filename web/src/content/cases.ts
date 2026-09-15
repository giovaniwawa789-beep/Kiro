/**
 * Cases em formato desafio → solução → resultado.
 *
 * Os dois primeiros têm lastro em material próprio da empresa (proposta de
 * upcycle e publicações). O resultado numérico, porém, é o que falta: sem o
 * número, um case é depoimento. Por isso `resultado.valor` vem null onde não
 * tenho o dado, e a UI mostra {{PREENCHER}}.
 *
 * `autorizado` controla a citação do nome do cliente. Marcar como false até
 * confirmar autorização de uso de marca — as peças estão públicas no Instagram
 * da empresa, mas contrato B2B costuma ter cláusula de confidencialidade.
 */

export interface Caso {
  slug: string;
  cliente: string;
  autorizado: boolean;
  segmento: string;
  desafio: string;
  solucao: string;
  resultado: { valor: string | null; rotulo: string; origem: string }[];
  foto: { src: string; alt: string } | null;
}

export const cases: Caso[] = [
  {
    slug: "midea-carrier",
    cliente: "Midea Carrier",
    autorizado: false, // {{PREENCHER}} confirmar autorização de uso de marca
    segmento: "Uniformes corporativos",
    desafio:
      "Lote de uniformes fora de uso com a marca aplicada, que não podia voltar a circular e ainda ocupava espaço no estoque.",
    solucao:
      "Coleta, descaracterização peça por peça com registro audiovisual e confecção de necessaires, sacos e ecobags com o tecido dos próprios uniformes. Cada peça saiu com QR Code contando a origem do material.",
    resultado: [
      {
        valor: "2.500+",
        rotulo: "peças produzidas (somado ao projeto Santista)",
        origem: "Informado pelo cliente",
      },
      {
        valor: null,
        rotulo: "toneladas de uniforme processadas",
        origem: "{{PREENCHER}} — tonelagem do lote",
      },
      {
        valor: null,
        rotulo: "% do lote aproveitado",
        origem: "{{PREENCHER}} — percentual de aproveitamento",
      },
    ],
    foto: {
      src: "/fotos/midea_bordado.jpg",
      alt: "Detalhe de bordado de marca em tecido de uniforme marcado para corte",
    },
  },
  {
    slug: "santista",
    cliente: "Santista S.A.",
    autorizado: false, // {{PREENCHER}} confirmar autorização de uso de marca
    segmento: "Indústria têxtil",
    desafio:
      "Necessidade de uma peça comemorativa que comunicasse circularidade com material próprio, e não com brinde comprado pronto.",
    solucao:
      "Desenvolvimento de porta-vinhos em denim recuperado, com prototipagem e ficha técnica aprovadas antes do corte, alça em couro e tag de rastreabilidade. Confecção pelo time de artesãs.",
    resultado: [
      {
        valor: null,
        rotulo: "peças entregues",
        origem: "{{PREENCHER}} — quantidade do pedido",
      },
      {
        valor: null,
        rotulo: "kg de denim recuperado",
        origem: "{{PREENCHER}} — volume de material",
      },
    ],
    foto: {
      src: "/fotos/santista_porta_vinhos.jpg",
      alt: "Porta-vinhos em denim recuperado com alça de couro e tag de rastreabilidade",
    },
  },
  {
    slug: "bom-retiro-recicla",
    cliente: "Bom Retiro Recicla",
    autorizado: true,
    segmento: "Polo de confecção",
    desafio:
      "O maior polo de confecção da cidade de São Paulo gerando resíduo têxtil sem rota organizada de reciclagem, com descarte inadequado difuso entre centenas de oficinas.",
    solucao:
      "Supervisão do projeto de realocação do resíduo têxtil do Bom Retiro para reciclagem, estruturando a rota de coleta e a destinação do material.",
    resultado: [
      {
        valor: "40",
        rotulo: "toneladas por mês realocadas",
        origem: "Informado pelo cliente",
      },
      {
        valor: null,
        rotulo: "oficinas atendidas",
        origem: "{{PREENCHER}} — número de oficinas participantes",
      },
    ],
    foto: {
      src: "/fotos/operacao_fardos.jpg",
      alt: "Empilhadeira movimentando fardos de resíduo têxtil em pátio de triagem",
    },
  },
];
