/**
 * "O que acontece com o seu resíduo" — os destinos, não o procedimento.
 *
 * Esta é a seção de diferenciação: os concorrentes são econômicos em prova
 * visual do destino final. Aqui o material aparece como produto.
 *
 * `foto: null` = ainda não temos imagem própria da peça. Não uso banco de
 * imagem genérico no lugar: a seção mostra o marcador de foto pendente, que é
 * honesto e some quando a foto real chegar.
 */

export interface Destino {
  nome: string;
  descricao: string;
  /** Onde o material chega depois: mercado, indústria ou consumidor. */
  volta: string;
  foto: { src: string; alt: string } | null;
}

export const destinos: Destino[] = [
  {
    nome: "Ecobag",
    descricao:
      "Sacola confeccionada com o tecido do próprio uniforme, personalizável com a marca.",
    volta: "Volta como brinde corporativo",
    foto: {
      src: "/fotos/produto_ecobag.jpg",
      alt: "Ecobag confeccionada a partir de uniforme corporativo, com alças e listras vermelhas",
    },
  },
  {
    nome: "Necessaire e pochette",
    descricao:
      "Peças de menor volumetria, indicadas para kit de evento e comunicação interna.",
    volta: "Volta como brinde corporativo",
    foto: {
      src: "/fotos/produto_necessaire.jpg",
      alt: "Necessaire em tecido de uniforme reaproveitado, com zíper e pingente",
    },
  },
  {
    nome: "Porta-vinhos em denim",
    descricao:
      "Peça comemorativa em denim recuperado, com alça em couro e tag de rastreabilidade.",
    volta: "Volta como produto de marca",
    foto: {
      src: "/fotos/santista_porta_vinhos.jpg",
      alt: "Porta-vinhos em denim recuperado com alça de couro e tag de QR Code",
    },
  },
  {
    nome: "Chaveiro têxtil",
    descricao:
      "Peça pequena de retalho, usada também nas oficinas de formação que conduzimos.",
    volta: "Volta como produto e como formação",
    foto: {
      src: "/fotos/oficina_chaveiro.jpg",
      alt: "Artesã mostrando chaveiro têxtil produzido em oficina de upcycling",
    },
  },
  {
    nome: "Fibra desfibrada",
    descricao:
      "Fibra recuperada por composição e cor, pronta para voltar à fiação e à indústria.",
    volta: "Volta como matéria-prima",
    foto: null, // {{PREENCHER}} foto da fibra desfibrada
  },
  {
    nome: "Manta e enchimento",
    descricao:
      "Fibra prensada em manta, usada como enchimento e isolamento por outras indústrias.",
    volta: "Volta como matéria-prima",
    foto: null, // {{PREENCHER}} foto de manta ou enchimento
  },
  {
    nome: "Pano e estopa",
    descricao:
      "Retalho de maior gramatura cortado para uso industrial de limpeza e manutenção.",
    volta: "Volta como insumo industrial",
    foto: null, // {{PREENCHER}} foto de pano/estopa
  },
  {
    nome: "Tapete e cobertor",
    descricao:
      "Fibra recuperada aplicada em peças de maior gramatura para uso doméstico.",
    volta: "Volta como produto acabado",
    foto: null, // {{PREENCHER}} foto de tapete ou cobertor
  },
];

/** Peças citadas nos materiais internos que ainda não têm foto própria. */
export const pecasSemFoto = [
  "Jogo de escumadeiras",
  "Lixeira basculante de 7 L",
  "Porta-sacos",
  "Carregador de celular para área comum",
] as const;
