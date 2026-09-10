/**
 * Projetos entregues.
 *
 * Todo o conteúdo aqui vem de material da própria empresa (propostas, decks e
 * publicações). Números informados pelo cliente estão marcados na propriedade
 * `origem` para facilitar a checagem antes de publicar.
 */

export interface Projeto {
  slug: string;
  cliente: string;
  titulo: string;
  descricao: string;
  destaques: { valor: string; rotulo: string }[];
  imagem: string | null;
  alt: string;
  /** De onde vem a informação — usado só como nota interna de conferência. */
  origem: string;
}

export const projetos: Projeto[] = [
  {
    slug: "midea-carrier",
    cliente: "Midea Carrier",
    titulo: "Uniformes inservíveis transformados em linha de brindes",
    descricao:
      "Coleta, descaracterização peça por peça e confecção de necessaires, sacos e ecobags a partir do tecido dos próprios uniformes. Cada peça saiu com QR Code para o colaborador acessar a história do material.",
    destaques: [
      { valor: "2.500+", rotulo: "itens produzidos (com Santista)" },
      { valor: "QR Code", rotulo: "rastreabilidade por peça" },
    ],
    imagem: "/fotos/midea_bordado.jpg",
    alt: "Detalhe do bordado Midea e Carrier sobre tecido marcado para corte",
    origem: "Proposta de upcycle de uniformes + números informados pelo cliente",
  },
  {
    slug: "santista",
    cliente: "Santista S.A.",
    titulo: "Denim recuperado em porta-vinhos exclusivo",
    descricao:
      "Peça comemorativa desenvolvida em denim para a Santista, com alça em couro, bolso aplicado e tag de rastreabilidade. Prototipagem, ficha técnica e confecção pelo time de artesãs.",
    destaques: [
      { valor: "Denim", rotulo: "recuperado, sem downcycling" },
      { valor: "Protótipo", rotulo: "aprovado antes do corte" },
    ],
    imagem: "/fotos/santista_porta_vinhos.jpg",
    alt: "Porta-vinhos em denim com alça de couro e tag de QR Code",
    origem: "Publicação da empresa + currículo do cliente",
  },
  {
    slug: "bom-retiro-recicla",
    cliente: "Bom Retiro Recicla",
    titulo: "Realocação de resíduo têxtil em escala",
    descricao:
      "Supervisão do projeto de realocação de resíduo têxtil do Bom Retiro para reciclagem, evitando o descarte inadequado no maior polo de confecção da cidade de São Paulo.",
    destaques: [
      { valor: "40 t/mês", rotulo: "resíduo têxtil realocado" },
      { valor: "Aterro Zero", rotulo: "critério de destinação" },
    ],
    imagem: "/fotos/operacao_fardos.jpg",
    alt: "Empilhadeira movimentando fardos de resíduo têxtil no pátio de triagem",
    origem: "Currículo do cliente",
  },
  {
    slug: "bioma-textil-ecoponto-belezinho",
    cliente: "Prefeitura de São Paulo",
    titulo: "Bioma Têxtil — Ecoponto Belezinho",
    descricao:
      "Proposta de assunção da área livre do Ecoponto Belezinho, na Rua Herval, para implantar o primeiro Bioma Sustentável de Reciclagem Têxtil do Município de São Paulo, em operação Aterro Zero. Projeto em fase de proposta, sem cronograma definido.",
    destaques: [
      { valor: "1.000 t/mês", rotulo: "capacidade projetada" },
      { valor: "1º", rotulo: "bioma têxtil do município" },
    ],
    imagem: "/fotos/residuo_aparas.jpg",
    alt: "Fardos e sacos de aparas têxteis aguardando triagem",
    origem: "Proposta institucional Bioma Têxtil (em análise pela Prefeitura)",
  },
  {
    slug: "cultsp-pro-mega-artesanal",
    cliente: "CULTSP PRO · Mega Artesanal",
    titulo: "Oficinas de upcycling têxtil",
    descricao:
      "Facilitação de oficinas de upcycling — entre elas o chaveiro têxtil — dentro do programa de formação de profissionais da cultura do Estado de São Paulo, realizadas na Mega Artesanal. Atividades gratuitas.",
    destaques: [
      { valor: "Formação", rotulo: "de artesãos e costureiras" },
      { valor: "Programa público", rotulo: "de cultura do Estado de SP" },
    ],
    imagem: "/fotos/oficina_chaveiro.jpg",
    alt: "Artesã mostrando chaveiro têxtil produzido em oficina de upcycling",
    origem: "Publicação da empresa (programação do CULTSP PRO)",
  },
];

/** Prova visual do ciclo têxtil-para-têxtil: mesmo material nas duas pontas. */
export const antesDepois = {
  antes: {
    imagem: "/fotos/midea_uniforme_origem.jpg",
    alt: "Uniformes Midea, Carrier e Totaline fora de uso, separados para descaracterização",
    legenda: "Uniforme fora de uso, com as marcas ainda aplicadas.",
  },
  depois: {
    imagem: "/fotos/produto_ecobag.jpg",
    alt: "Ecobag confeccionada a partir do uniforme, com alças e listras vermelhas",
    legenda: "Ecobag confeccionada com o tecido do próprio uniforme.",
  },
};
