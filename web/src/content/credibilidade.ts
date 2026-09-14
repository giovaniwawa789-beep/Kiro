/**
 * Muro de credibilidade — resultados, casos e imprensa.
 *
 * REGRA DESTE ARQUIVO: nada aqui pode ser inventado. Muro de credibilidade é
 * exatamente o lugar onde um dado falso destrói a confiança que ele deveria
 * construir. Cada item tem `origem` para conferência antes de publicar.
 *
 * O campo `verificado` controla a exibição: itens em `false` aparecem com aviso
 * visível de conteúdo provisório, para não irem ao ar por engano.
 */

export interface Resultado {
  valor: string;
  unidade?: string;
  rotulo: string;
  origem: string;
  verificado: boolean;
}

export interface Caso {
  cliente: string;
  titulo: string;
  resultado: string;
  descricao: string;
  imagem: string | null;
  alt: string;
  origem: string;
  verificado: boolean;
}

export interface Imprensa {
  veiculo: string;
  titulo: string;
  url: string | null;
  data: string | null;
  verificado: boolean;
}

/** Números de impacto. Os quatro primeiros vieram do histórico do cliente. */
export const resultados: Resultado[] = [
  {
    valor: "2.500",
    unidade: "+",
    rotulo: "itens produzidos a partir de resíduo têxtil",
    origem: "Projetos Midea Carrier e Santista, informado pelo cliente",
    verificado: true,
  },
  {
    valor: "40",
    unidade: " t/mês",
    rotulo: "resíduo têxtil realocado para reciclagem",
    origem: "Projeto Bom Retiro Recicla, informado pelo cliente",
    verificado: true,
  },
  {
    valor: "1.000",
    unidade: " t/mês",
    rotulo: "capacidade projetada no Bioma Têxtil",
    origem: "Proposta institucional em análise pela Prefeitura de São Paulo",
    verificado: true,
  },
  {
    valor: "0",
    unidade: "%",
    rotulo: "fração destinada a aterro sanitário",
    origem: "Compromisso operacional Aterro Zero, declarado nas propostas",
    verificado: true,
  },
];

/** Casos com material próprio no repositório da empresa. */
export const casos: Caso[] = [
  {
    cliente: "Midea Carrier",
    titulo: "Uniformes inservíveis em linha de brindes",
    resultado: "2.500+ itens com QR Code de origem",
    descricao:
      "Coleta, descaracterização peça por peça e confecção de necessaires, sacos e ecobags com o tecido dos próprios uniformes.",
    imagem: "/fotos/midea_bordado.jpg",
    alt: "Detalhe do bordado Midea e Carrier sobre tecido marcado para corte",
    origem: "Proposta de upcycle de uniformes + publicação da empresa",
    verificado: true,
  },
  {
    cliente: "Santista S.A.",
    titulo: "Denim recuperado em porta-vinhos exclusivo",
    resultado: "Peça comemorativa com tag de rastreabilidade",
    descricao:
      "Prototipagem, ficha técnica e confecção em denim recuperado, com alça em couro e bolso aplicado.",
    imagem: "/fotos/santista_porta_vinhos.jpg",
    alt: "Porta-vinhos em denim com alça de couro e tag de QR Code",
    origem: "Publicação da empresa + currículo do cliente",
    verificado: true,
  },
  {
    cliente: "Bom Retiro Recicla",
    titulo: "Realocação de resíduo têxtil em escala",
    resultado: "40 t/mês desviadas do descarte inadequado",
    descricao:
      "Supervisão do projeto de realocação no maior polo de confecção da cidade de São Paulo.",
    imagem: "/fotos/operacao_fardos.jpg",
    alt: "Empilhadeira movimentando fardos de resíduo têxtil no pátio de triagem",
    origem: "Currículo do cliente",
    verificado: true,
  },
  {
    cliente: "CULTSP PRO · Mega Artesanal",
    titulo: "Oficinas de upcycling têxtil",
    resultado: "Formação de artesãos e costureiras",
    descricao:
      "Facilitação de oficinas dentro do programa de formação de profissionais da cultura do Estado de São Paulo.",
    imagem: "/fotos/oficina_chaveiro.jpg",
    alt: "Artesã mostrando chaveiro têxtil produzido em oficina de upcycling",
    origem: "Programação pública do CULTSP PRO",
    verificado: true,
  },
];

/**
 * Imprensa.
 *
 * NÃO ENCONTREI nenhuma menção de imprensa verificável nos materiais fornecidos.
 * Deixei a estrutura pronta e os itens marcados como não verificados, em vez de
 * inventar veículo, manchete ou data — o que seria o pior tipo de invenção
 * possível numa seção de credibilidade.
 *
 * Para publicar: preencha veiculo, titulo, url e data, e marque verificado.
 */
export const imprensa: Imprensa[] = [
  {
    veiculo: "TODO: veículo",
    titulo: "TODO: título da matéria",
    url: null,
    data: null,
    verificado: false,
  },
];

/** Selos de cadastro e conformidade — checáveis em base pública. */
export const selos = [
  { rotulo: "Cadastro SINIR", valor: "39087" },
  { rotulo: "Perfil no MTR", valor: "Transportador" },
  { rotulo: "CNPJ", valor: "13.762.164/0001-06" },
  { rotulo: "Operação", valor: "São Paulo/SP" },
] as const;

export const temImprensaVerificada = imprensa.some((i) => i.verificado);
