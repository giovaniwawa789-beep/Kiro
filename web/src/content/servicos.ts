/**
 * Vitrine de serviços — orientada a benefício, não a procedimento.
 *
 * Regra de escrita aplicada aqui: a primeira frase diz o que o cliente RESOLVE,
 * não o que nós executamos. Conformidade (MTR, certificado, licença) aparece
 * como consequência do serviço, nunca como aula.
 *
 * `confirmar: true` marca serviço que veio do briefing mas não tem lastro nos
 * materiais internos que li — precisa de validação antes de publicar.
 */

export type IconeServico =
  | "coleta"
  | "uniforme"
  | "estoque"
  | "reciclagem"
  | "produto"
  | "pev"
  | "documento";

export interface Servico {
  slug: string;
  numero: string;
  titulo: string;
  /** Nome curto, para navegação e breadcrumb. */
  curto: string;
  /** Uma linha de benefício, para o card da vitrine. */
  beneficio: string;
  /** Abertura da página do serviço: a dor, em segunda pessoa. */
  dor: string;
  /** Como resolvemos — sem passo a passo burocrático. */
  solucao: string;
  /** O que o cliente recebe. */
  entregas: string[];
  /** Para quem esse serviço é. */
  paraQuem: string[];
  icone: IconeServico;
  foto?: { src: string; alt: string };
  confirmar?: boolean;
  seo: { title: string; description: string };
}

export const servicos: Servico[] = [
  {
    slug: "logistica-reversa-residuo-textil-industrial",
    numero: "01",
    titulo: "Coleta e logística reversa de resíduo têxtil industrial",
    curto: "Resíduo industrial",
    beneficio:
      "Retalho, aparas e sobra de corte saem da sua fábrica com destino comprovado e sem parar sua produção.",
    dor: "Sobra de corte acumulada ocupa área útil, gera custo de caçamba e vira passivo quando o órgão ambiental pergunta para onde foi.",
    solucao:
      "Assumimos a retirada em frequência combinada com o seu volume. O material é segregado por composição e cor, e cada coleta fecha com a documentação que o seu time usa em auditoria.",
    entregas: [
      "Coleta programada na sua unidade",
      "Segregação por composição e cor",
      "MTR e certificado de destinação final",
      "Relatório mensal de volume e destino",
    ],
    paraQuem: [
      "Indústrias de confecção",
      "Malharias e tecelagens",
      "Facções e ateliês de grande porte",
    ],
    icone: "coleta",
    foto: {
      src: "/fotos/residuo_aparas.jpg",
      alt: "Fardos e sacos de aparas têxteis organizados para coleta",
    },
    seo: {
      title: "Logística reversa de resíduo têxtil industrial",
      description:
        "Coleta programada de retalho, aparas e sobra de corte com segregação por composição, MTR e certificado de destinação final. São Paulo e região.",
    },
  },
  {
    slug: "logistica-reversa-uniformes-epi",
    numero: "02",
    titulo: "Logística reversa de uniformes e EPIs",
    curto: "Uniformes e EPI",
    beneficio:
      "Sua marca sai de circulação junto com a peça: descaracterização registrada peça por peça.",
    dor: "Uniforme com logo em circulação é risco de imagem. A peça pode reaparecer num contexto que a sua empresa não escolheu — e o descarte comum não impede isso.",
    solucao:
      "Recolhemos o lote, avaliamos peça por peça e removemos etiquetas, logos e qualquer referência à marca. O processo é registrado em fotografia e vídeo, e encerra com atestado de descaracterização.",
    entregas: [
      "Avaliação peça por peça, não por lote",
      "Descaracterização com registro audiovisual",
      "Atestado de descaracterização",
      "MTR e certificado de destinação final",
    ],
    paraQuem: [
      "Portos e mineração",
      "Saúde e food service",
      "Facilities e indústria",
      "Hotelaria",
    ],
    icone: "uniforme",
    foto: {
      src: "/fotos/midea_uniforme_origem.jpg",
      alt: "Uniformes corporativos fora de uso separados para descaracterização",
    },
    seo: {
      title: "Descarte de uniformes e EPI com descaracterização de marca",
      description:
        "Logística reversa de uniformes e EPIs com descaracterização peça por peça, registro audiovisual e atestado. Elimina o risco de uso indevido da marca.",
    },
  },
  {
    slug: "destinacao-defeito-sobra-estoque",
    numero: "03",
    titulo: "Destinação de peças com defeito e sobra de estoque",
    curto: "Sobra de estoque",
    beneficio:
      "Coleção não vendida e peça com defeito saem do estoque sem risco de mercado paralelo.",
    dor: "Peça com defeito e coleção encalhada travam capital e área de estoque. Doar sem controle coloca o seu produto em canal que compete com a sua própria loja.",
    solucao:
      "Retiramos o lote com descaracterização quando a marca precisa sair de circulação, e direcionamos cada fração para a rota de maior valor: reinserção como matéria-prima ou transformação em produto novo.",
    entregas: [
      "Inventário do lote recebido",
      "Descaracterização quando aplicável",
      "Destinação por rota de maior valor",
      "Documentação completa da operação",
    ],
    paraQuem: [
      "Marcas de moda",
      "Varejo de vestuário",
      "E-commerce de moda",
    ],
    icone: "estoque",
    confirmar: true,
    seo: {
      title: "Destinação de sobra de estoque e peças com defeito",
      description:
        "Destinação responsável de coleção não vendida e peças com defeito, com descaracterização de marca e documentação de destinação final.",
    },
  },
  {
    slug: "reciclagem-desfibramento-textil",
    numero: "04",
    titulo: "Reciclagem e desfibramento",
    curto: "Reciclagem",
    beneficio:
      "A fibra volta ao mercado como matéria-prima, em vez de virar energia numa fornalha.",
    dor: "Mandar tecido para coprocessamento resolve o descarte e encerra o ciclo têxtil. O material que você pagou para produzir deixa de existir.",
    solucao:
      "Separamos por composição e cor, adequamos a granulometria e desfibramos para recuperação da fibra. O que sai daqui volta para a cadeia como insumo — manta, enchimento, estopa, fio.",
    entregas: [
      "Triagem por composição e cor",
      "Picotagem e adequação do material",
      "Desfibramento para recuperação de fibra",
      "Relatório de aproveitamento por lote",
    ],
    paraQuem: [
      "Indústrias têxteis",
      "Confecções de médio e grande porte",
      "Lavanderias industriais",
    ],
    icone: "reciclagem",
    foto: {
      src: "/fotos/operacao_fardos.jpg",
      alt: "Movimentação de fardos de resíduo têxtil no pátio de triagem",
    },
    seo: {
      title: "Reciclagem e desfibramento de resíduo têxtil",
      description:
        "Desfibramento com triagem por composição e cor para reinserção da fibra têxtil como matéria-prima. Alternativa ao coprocessamento.",
    },
  },
  {
    slug: "upcycling-brindes-corporativos",
    numero: "05",
    titulo: "Upcycling e brindes corporativos",
    curto: "Upcycling",
    beneficio:
      "O resíduo da sua operação volta como brinde da sua marca, com a origem rastreável por QR Code.",
    dor: "Brinde corporativo comprado pronto não conta história nenhuma. E a sua ação de sustentabilidade fica sem prova material para mostrar ao time.",
    solucao:
      "Desenvolvemos a peça a partir do seu próprio resíduo, com protótipo e ficha técnica aprovados antes do corte. A confecção é feita por artesãs capacitadas, e cada peça sai com QR Code contando de onde veio o material.",
    entregas: [
      "Desenvolvimento de produto e protótipo",
      "Produção com o resíduo da sua empresa",
      "QR Code de rastreabilidade por peça",
      "Entrega na unidade escolhida",
    ],
    paraQuem: [
      "Marketing e comunicação interna",
      "Times de ESG",
      "RH e endomarketing",
    ],
    icone: "produto",
    foto: {
      src: "/fotos/produto_necessaire.jpg",
      alt: "Necessaire confeccionada a partir de uniforme corporativo reaproveitado",
    },
    seo: {
      title: "Upcycling têxtil e brindes corporativos sustentáveis",
      description:
        "Transformação do seu resíduo têxtil em ecobags, necessaires e brindes corporativos, com QR Code de rastreabilidade e confecção por artesãs.",
    },
  },
  {
    slug: "coleta-pos-consumo-take-back",
    numero: "06",
    titulo: "Programas de coleta pós-consumo",
    curto: "Pós-consumo",
    beneficio:
      "Sua marca recebe de volta o que vendeu, com ponto de coleta em loja e campanha de take-back.",
    dor: "A responsabilidade pelo ciclo de vida não termina na venda, e o consumidor já pergunta o que fazer com a peça velha. Sem canal de retorno, a resposta é o lixo comum.",
    solucao:
      "Estruturamos o ponto de entrega voluntária na sua loja, a logística de recolhimento e a comunicação da campanha. O material recebido entra na nossa cadeia de triagem e destinação.",
    entregas: [
      "Implantação de ponto de entrega voluntária",
      "Logística de recolhimento periódico",
      "Material de comunicação da campanha",
      "Relatório de volume por ponto",
    ],
    paraQuem: [
      "Marcas de moda com rede de lojas",
      "Varejo de vestuário",
      "Shoppings e redes de franquia",
    ],
    icone: "pev",
    confirmar: true,
    seo: {
      title: "Programa de coleta pós-consumo e take-back para marcas",
      description:
        "Ponto de entrega voluntária em loja, logística de recolhimento e campanha de take-back para marcas de moda e varejo de vestuário.",
    },
  },
  {
    slug: "relatorios-impacto-esg",
    numero: "07",
    titulo: "Relatórios de impacto e documentação para ESG",
    curto: "Relatórios e ESG",
    beneficio:
      "Você reporta números auditáveis, com a documentação que sustenta cada linha do relatório.",
    dor: "Na hora de reportar, o dado de resíduo aparece estimado ou não aparece. Auditoria pede comprovação e a planilha não tem lastro documental.",
    solucao:
      "Consolidamos volume, rota de destinação e aproveitamento por período, amarrados aos documentos de cada coleta. O material sai pronto para relatório de sustentabilidade, auditoria e renovação de licença.",
    entregas: [
      "Relatório periódico de volume e destino",
      "Documentação amarrada a cada coleta",
      "Indicadores para relatório de sustentabilidade",
      "Apoio na elaboração e revisão do PGRS",
    ],
    paraQuem: [
      "Gerências de ESG e sustentabilidade",
      "Meio ambiente e SGI",
      "Suprimentos e facilities",
    ],
    icone: "documento",
    foto: {
      src: "/fotos/confeccao_denim.jpg",
      alt: "Detalhe de costura em peça de denim recuperado na unidade de transformação",
    },
    seo: {
      title: "Relatórios de impacto e documentação ESG de resíduo têxtil",
      description:
        "Relatório de volume, rota de destinação e aproveitamento com lastro documental para auditoria, licença ambiental e relatório de sustentabilidade.",
    },
  },
];

export function servicoPorSlug(slug: string): Servico | undefined {
  return servicos.find((s) => s.slug === slug);
}

/**
 * Rotas antigas -> novas. As URLs anteriores podem estar indexadas, então cada
 * uma ganha redirect 301 em next.config.ts (nunca 302: 301 transfere autoridade).
 */
export const redirecionamentos: { de: string; para: string }[] = [
  {
    de: "/servicos/coleta-seletiva-textil",
    para: "/servicos/logistica-reversa-residuo-textil-industrial",
  },
  {
    de: "/servicos/gestao-residuos-texteis-logistica-reversa",
    para: "/servicos/logistica-reversa-residuo-textil-industrial",
  },
  {
    de: "/servicos/descarte-reciclagem-uniformes",
    para: "/servicos/logistica-reversa-uniformes-epi",
  },
  {
    de: "/servicos/desenvolvimento-produtos-sustentaveis",
    para: "/servicos/upcycling-brindes-corporativos",
  },
  {
    de: "/servicos/pgrs-plano-gerenciamento-residuos-solidos",
    para: "/servicos/relatorios-impacto-esg",
  },
  {
    de: "/servicos/consultoria-gestao-ambiental-sustentabilidade",
    para: "/servicos/relatorios-impacto-esg",
  },
];
