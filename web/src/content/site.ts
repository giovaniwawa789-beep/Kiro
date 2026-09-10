/**
 * Configuração central do site — Nunes e Lucato.
 *
 * TODO abaixo = dado que precisa de confirmação antes de publicar.
 * Tudo que precisa ser trocado (contato, métricas, depoimentos) está NESTE arquivo.
 */

export const site = {
  nome: "Nunes e Lucato",
  nomeCompleto: "Nunes e Lucato — Gestão Ambiental",
  /** Razão social conforme cadastro no SINIR. Origem: decks internos da empresa. */
  razaoSocial: "Nunes&Lucato GSA Ltda",
  descricao:
    "Consultoria em gestão ambiental, sustentabilidade e gestão de resíduos têxteis para indústrias e confecções.",
  url: "https://www.nuneselucato.com.br", // TODO: confirmar com o cliente (domínio definitivo)

  contato: {
    /** TODO: confirmar com o cliente — número comercial.
     *  O celular que aparece nos materiais internos, (11) 94755-1771, é pessoal
     *  da responsável; não foi publicado aqui de propósito. */
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "5511000000000",
    whatsappExibicao: "(11) 00000-0000", // TODO: confirmar com o cliente
    telefone: "(11) 00000-0000", // TODO: confirmar com o cliente
    /** TODO: confirmar com o cliente — e-mail comercial no domínio.
     *  O e-mail dos materiais internos é uma conta pessoal (Gmail) e não deve
     *  virar canal público. */
    email: "contato@nuneselucato.com.br",
    cidade: "São Paulo",
    uf: "SP",
    /** Endereço da unidade. Origem: cadastro no MTR/SINIR (confirmar se atual). */
    endereco: "Rua Mário Augusto do Carmo, 275 — Jardim Avelino", // TODO: confirmar com o cliente
    cep: "03227-070", // TODO: confirmar com o cliente
    /** Origem: cadastro no MTR/SINIR (confirmar se atual). */
    cnpj: "13.762.164/0001-06", // TODO: confirmar com o cliente
    /** Código no SINIR. No deck de origem este rótulo ficou marcado como a confirmar. */
    sinir: "39087", // TODO: confirmar com o cliente
    /** Perfil no MTR Nacional. Confirmado no deck de MTR: Transportador. */
    perfilMtr: "Transportador",
    responsavel: "Ana Paola Nunes Lucato",
  },

  redes: [
    { nome: "Instagram", url: "https://www.instagram.com/ananuneslucato/" }, // TODO: confirmar com o cliente (perfil da empresa, se houver)
    { nome: "LinkedIn", url: "#" }, // TODO: confirmar com o cliente
  ],

  navegacao: [
    { rotulo: "Serviços", href: "/#servicos" },
    { rotulo: "Produtos", href: "/#produtos" },
    { rotulo: "Sobre", href: "/sobre" },
    { rotulo: "Contato", href: "/contato" },
  ],

  /**
   * Faixa de números. Os dois primeiros vieram do cliente (histórico de
   * projetos); os dois últimos seguem como placeholder.
   */
  metricas: [
    {
      valor: 2500,
      sufixo: "+",
      rotulo: "itens produzidos a partir de resíduo têxtil",
      nota: "Projetos Midea Carrier e Santista",
    },
    {
      valor: 40,
      sufixo: " t/mês",
      rotulo: "resíduo têxtil realocado para reciclagem",
      nota: "Projeto Bom Retiro Recicla",
    },
    {
      valor: 0,
      sufixo: "", // TODO: confirmar com o cliente (anos de atuação)
      rotulo: "anos de atuação em gestão ambiental têxtil",
      nota: "TODO: confirmar",
    },
    {
      valor: 0,
      sufixo: "%", // TODO: confirmar com o cliente (% desviado de aterro)
      rotulo: "do resíduo desviado de aterro sanitário",
      nota: "TODO: confirmar",
    },
  ],

  /** Público atendido. */
  publico: [
    "Confecções",
    "Indústrias têxteis",
    "Malharias",
    "Lavanderias",
    "Uniformes corporativos",
    "Varejo de moda",
  ],

  /** Produtos desenvolvidos a partir de resíduo têxtil. */
  produtos: [
    {
      nome: "Ecobags",
      descricao:
        "Sacola confeccionada com o tecido do próprio resíduo do cliente, personalizável com a marca.",
      imagem: "/fotos/produto_ecobag.jpg",
      alt: "Ecobag confeccionada a partir de uniforme reaproveitado, com alças e listras vermelhas",
    },
    {
      nome: "Necessaires e pochettes",
      descricao:
        "Peças de menor volumetria, indicadas para brindes corporativos e kits de evento.",
      imagem: "/fotos/produto_necessaire.jpg",
      alt: "Necessaire em tecido de uniforme reaproveitado, com zíper e pingente vermelho",
    },
    {
      nome: "Jogos de escumadeiras",
      descricao:
        "Conjunto utilitário produzido com resíduo têxtil, para ações de ESG e datas comemorativas.",
      imagem: null, // TODO: substituir por foto real do produto
      alt: "Jogo de escumadeiras produzido a partir de resíduo têxtil",
    },
    {
      nome: "Lixeiras basculantes de 7L",
      descricao:
        "Lixeira basculante de 7 litros, com estrutura revestida em material têxtil recuperado.",
      imagem: null, // TODO: substituir por foto real do produto
      alt: "Lixeira basculante de 7 litros revestida em material têxtil recuperado",
    },
    {
      nome: "Jogos de tapetes",
      descricao:
        "Tapetes produzidos com fibra recuperada, aproveitando retalho de maior gramatura.",
      imagem: null, // TODO: substituir por foto real do produto
      alt: "Jogo de tapetes produzido com fibra têxtil recuperada",
    },
    {
      nome: "Porta-vinhos em denim",
      descricao:
        "Peça desenvolvida em denim recuperado, com tag de rastreabilidade por QR Code.",
      imagem: "/fotos/santista_porta_vinhos.jpg",
      alt: "Porta-vinhos em denim com alça de couro e tag de QR Code",
    },
  ],

  /** TODO: substituir por depoimentos reais, com nome, cargo e empresa autorizados. */
  depoimentos: [
    {
      texto:
        "Espaço reservado para depoimento de cliente. Substituir por texto real, com autorização de uso.",
      autor: "Nome do cliente",
      cargo: "Cargo",
      empresa: "Empresa",
    },
    {
      texto:
        "Espaço reservado para depoimento de cliente. Substituir por texto real, com autorização de uso.",
      autor: "Nome do cliente",
      cargo: "Cargo",
      empresa: "Empresa",
    },
    {
      texto:
        "Espaço reservado para depoimento de cliente. Substituir por texto real, com autorização de uso.",
      autor: "Nome do cliente",
      cargo: "Cargo",
      empresa: "Empresa",
    },
  ],

  faq: [
    {
      pergunta: "O PGRS é obrigatório para a minha empresa?",
      resposta:
        "O Plano de Gerenciamento de Resíduos Sólidos é exigido por lei para os geradores enquadrados na Política Nacional de Resíduos Sólidos, o que inclui indústrias têxteis e confecções. No diagnóstico verificamos o enquadramento da sua operação e quais exigências do órgão ambiental se aplicam ao seu caso.",
    },
    {
      pergunta: "Qual é o prazo para elaborar o PGRS e o plano de adequação?",
      resposta:
        "O prazo depende do porte da operação, do número de unidades e da variedade de resíduos gerados. Após o diagnóstico apresentamos um cronograma com as etapas e as datas de entrega de cada documento.",
    },
    {
      pergunta: "Como funciona a coleta do resíduo?",
      resposta:
        "A coleta é agendada e feita diretamente na sua empresa quando o descarte nos nossos pontos não é viável. O transporte é realizado com a documentação exigida, incluindo a emissão do MTR, e você recebe a comprovação de destinação ao final.",
    },
    {
      pergunta: "O que acontece com o resíduo depois da coleta?",
      resposta:
        "O material é segregado e classificado por cor, composição e rota de destinação. A prioridade é manter a fibra na cadeia têxtil: primeiro upcycle, depois desfibramento para recuperação de fibra. Só a fração irrecuperável segue para coprocessamento. Nenhuma fração vai para aterro sanitário.",
    },
    {
      pergunta: "Vocês atendem fora da região de São Paulo?",
      resposta:
        "A operação e o atendimento são concentrados na Capital e região, próximos à origem do resíduo. Para outras regiões, avaliamos a demanda caso a caso conforme a volumetria e a logística envolvida.",
    },
    {
      pergunta: "Como é definido o custo do serviço?",
      resposta:
        "O orçamento é montado a partir da volumetria, do tipo de resíduo, da frequência de coleta e do escopo documental necessário. Em projetos de produtos sustentáveis, o custo considera também a peça escolhida e a quantidade. Fale com a nossa equipe para receber uma proposta.",
    },
  ],
} as const;

export type Site = typeof site;

/** Monta o link de WhatsApp com mensagem pré-preenchida. */
export function linkWhatsApp(mensagem?: string): string {
  const texto =
    mensagem ??
    "Olá! Vim pelo site e gostaria de falar sobre gestão de resíduos têxteis.";
  return `https://wa.me/${site.contato.whatsapp}?text=${encodeURIComponent(texto)}`;
}
