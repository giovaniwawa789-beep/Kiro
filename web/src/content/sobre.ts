/**
 * Conteúdo da página Sobre.
 *
 * A história de fundação é o item que eu NÃO posso escrever: ano, fundador,
 * motivação, primeira coleta e primeira dificuldade não existem em nenhum
 * material do repositório. Inventar origem é o tipo de mentira que se descobre
 * na primeira conversa com o cliente, então os parágrafos vêm com o marcador e
 * uma orientação do que contar em cada um.
 *
 * O que É verdade e está aqui: a operação, a tese, o impacto social e as
 * credenciais — tudo com lastro nos materiais internos.
 */

export interface ParagrafoOrigem {
  /** Texto pronto, ou null quando depende de dado que não tenho. */
  texto: string | null;
  /** O que este parágrafo precisa contar. Aparece como orientação no marcador. */
  orientacao: string;
}

export const origem: ParagrafoOrigem[] = [
  {
    texto: null,
    orientacao:
      "O problema que você viu, onde e em que ano. Seja específico: que cena te incomodou? Sobra de corte indo para caçamba? Uniforme com logo aparecendo em feira? Uma frase concreta vale mais que um parágrafo de adjetivo.",
  },
  {
    texto: null,
    orientacao:
      "A primeira coleta: qual cliente, qual volume, como foi feito o transporte. Se foi precário, conte que foi precário — carro próprio, galpão emprestado, tudo à mão. É isso que gera confiança.",
  },
  {
    texto: null,
    orientacao:
      "A primeira dificuldade real e como foi resolvida. Falta de comprador para a fibra? Órgão ambiental exigindo documento que ainda não existia? Cliente que desistiu?",
  },
  {
    texto: null,
    orientacao:
      "A virada: o que fez a operação deixar de ser improviso e virar empresa. Pode ser o primeiro contrato grande, o cadastro no SINIR, a unidade própria.",
  },
];

export interface Marco {
  ano: string | null;
  titulo: string;
  descricao: string;
  /** true quando o marco tem lastro em material do repositório. */
  confirmado: boolean;
}

export const marcos: Marco[] = [
  {
    ano: null,
    titulo: "Fundação",
    descricao: "{{PREENCHER}} — ano de fundação e sócios fundadores",
    confirmado: false,
  },
  {
    ano: null,
    titulo: "Primeira coleta",
    descricao: "{{PREENCHER}} — cliente e volume da primeira operação",
    confirmado: false,
  },
  {
    ano: null,
    titulo: "Unidade de transformação",
    descricao:
      "{{PREENCHER}} — ano de abertura da unidade própria em Jardim Avelino",
    confirmado: false,
  },
  {
    ano: null,
    titulo: "Cadastro no SINIR como transportador",
    descricao:
      "Habilitação para emitir MTR em nome próprio. {{PREENCHER}} — ano do cadastro",
    confirmado: true,
  },
  {
    ano: null,
    titulo: "Projeto Bom Retiro Recicla",
    descricao:
      "Supervisão da realocação de 40 t/mês de resíduo têxtil no maior polo de confecção da cidade. {{PREENCHER}} — ano",
    confirmado: true,
  },
  {
    ano: null,
    titulo: "Primeiros projetos de upcycling corporativo",
    descricao:
      "Midea Carrier e Santista S.A., com mais de 2.500 peças produzidas. {{PREENCHER}} — ano",
    confirmado: true,
  },
  {
    ano: "2024",
    titulo: "Oficinas no CULTSP PRO",
    descricao:
      "Facilitação de oficinas de upcycling têxtil no programa de formação de profissionais da cultura do Estado de São Paulo, na Mega Artesanal.",
    confirmado: true,
  },
  {
    ano: null,
    titulo: "Proposta do Bioma Têxtil",
    descricao:
      "Projeto do primeiro bioma sustentável de reciclagem têxtil do município de São Paulo, no Ecoponto Belezinho, em análise pela Prefeitura.",
    confirmado: true,
  },
];

/** Nossa tese: o que acreditamos que precisa mudar. */
export const tese = [
  {
    titulo: "Aterro Zero é o piso, não o diferencial",
    texto:
      "Triturar tudo e mandar para coprocessamento também é Aterro Zero — e encerra o ciclo têxtil. A pergunta que importa é o que acontece antes disso.",
  },
  {
    titulo: "A fibra deve voltar como fibra",
    texto:
      "Material que você pagou para produzir não precisa virar energia numa fornalha. Com triagem por composição e cor, ele volta ao mercado como insumo.",
  },
  {
    titulo: "Sem documento, não houve destinação",
    texto:
      "Destinação que não gera papel não serve para auditoria, licença nem relatório. Documento não é burocracia: é a prova de que o serviço aconteceu.",
  },
];

export const missao = {
  missao:
    "Tirar o resíduo têxtil da rota do aterro e devolvê-lo ao mercado como matéria-prima ou produto, com documentação que sustente auditoria.",
  visao:
    "Ser a operação de referência em circularidade têxtil na cidade de São Paulo, com capacidade industrial e cadeia de trabalho formalizada.",
  valores: [
    {
      nome: "O número tem que ter origem",
      texto:
        "Não reportamos estimativa como se fosse medição. Todo dado que entregamos tem lastro documental — e dizemos quando não temos o dado.",
    },
    {
      nome: "Peça por peça, não por lote",
      texto:
        "Descaracterização e triagem são feitas item a item, com registro. É mais lento e é o que garante que a marca do cliente saia de circulação.",
    },
    {
      nome: "Quem costura aparece",
      texto:
        "A cadeia é feita de artesãs e cooperativas com nome. Elas não são custo de produção: são parte do resultado que o cliente compra.",
    },
    {
      nome: "Recusamos o que não conseguimos rastrear",
      texto:
        "Se não há como comprovar o destino de uma fração, não assumimos a operação. Vale menos receita e mais previsibilidade.",
    },
  ],
};

/** Impacto social — quem está na cadeia. */
export const impactoSocial = {
  texto:
    "A confecção das peças de upcycling é feita por um time de artesãs cadastradas e capacitadas na nossa unidade. A cadeia envolve ainda cooperativas e ateliês parceiros na triagem e no acabamento.",
  numeros: [
    {
      valor: null,
      rotulo: "artesãs cadastradas",
      origem: "{{PREENCHER}} — número de artesãs na cadeia",
    },
    {
      valor: null,
      rotulo: "cooperativas e ateliês parceiros",
      origem: "{{PREENCHER}} — número de parceiros",
    },
    {
      valor: null,
      rotulo: "pessoas formadas em oficinas",
      origem: "{{PREENCHER}} — participantes das oficinas do CULTSP PRO e outras",
    },
  ],
  programas: [
    "Coworking de costura para costureiras e artesãos autônomos",
    "Oficinas e cursos de aperfeiçoamento para a cadeia têxtil",
    "Curso permanente de compostagem e educação ambiental",
  ],
  fotos: [
    {
      src: "/fotos/artesa_costura.jpg",
      alt: "Artesã costurando peça em máquina industrial na unidade de transformação",
    },
    {
      src: "/fotos/oficina_chaveiro.jpg",
      alt: "Artesã apresentando chaveiro têxtil produzido em oficina de upcycling",
    },
    {
      src: "/fotos/evento_mega_artesanal.jpg",
      alt: "Equipe da Nunes e Lucato em oficina na feira Mega Artesanal",
    },
  ],
};

/** Estrutura operacional. */
export const operacao = {
  itens: [
    {
      valor: null,
      rotulo: "área do galpão",
      origem: "{{PREENCHER}} — metragem da unidade",
    },
    {
      valor: null,
      rotulo: "capacidade de processamento",
      origem: "{{PREENCHER}} — toneladas por mês da operação atual",
    },
    {
      valor: null,
      rotulo: "veículos na frota",
      origem: "{{PREENCHER}} — frota própria ou terceirizada",
    },
    {
      valor: null,
      rotulo: "equipamentos de desfibramento",
      origem: "{{PREENCHER}} — máquinas e capacidade",
    },
  ],
  fotos: [
    {
      src: "/fotos/operacao_fardos.jpg",
      alt: "Movimentação de fardos de resíduo têxtil no pátio de triagem",
    },
    {
      src: "/fotos/residuo_aparas.jpg",
      alt: "Fardos e sacos de aparas têxteis organizados na unidade",
    },
    {
      src: "/fotos/confeccao_denim.jpg",
      alt: "Costura de peça em denim recuperado na unidade de transformação",
    },
  ],
};

/** Time. */
export interface Pessoa {
  nome: string;
  cargo: string;
  frase: string | null;
  foto: string | null;
}

export const time: Pessoa[] = [
  {
    nome: "Ana Paola Nunes Lucato",
    cargo: "Sócia e responsável técnica",
    frase: null, // {{PREENCHER}} uma frase da Ana sobre o trabalho
    foto: null, // {{PREENCHER}} foto de retrato
  },
  {
    nome: "{{PREENCHER}}",
    cargo: "{{PREENCHER}} — demais lideranças",
    frase: null,
    foto: null,
  },
];
