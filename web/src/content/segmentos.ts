/**
 * Segmentos atendidos.
 *
 * Serve a dois propósitos: o visitante se reconhece em dois segundos, e cada
 * item carrega termo de busca do setor (SEO de cauda longa).
 */

import type { IconeServico } from "./servicos";

export interface Segmento {
  slug: string;
  nome: string;
  /** A dor específica desse setor, em uma linha. */
  dor: string;
  /** Serviço mais relevante para o segmento. */
  servico: string;
  icone: IconeServico;
}

export const segmentos: Segmento[] = [
  {
    slug: "confeccao",
    nome: "Indústria de confecção",
    dor: "Sobra de corte e aparas acumulando na fábrica, com custo de caçamba e sem comprovação de destino.",
    servico: "logistica-reversa-residuo-textil-industrial",
    icone: "coleta",
  },
  {
    slug: "moda-varejo",
    nome: "Marcas de moda e varejo",
    dor: "Coleção não vendida e peça com defeito travando estoque, com risco de mercado paralelo.",
    servico: "destinacao-defeito-sobra-estoque",
    icone: "estoque",
  },
  {
    slug: "uniformes-epi",
    nome: "Grandes bases de uniforme e EPI",
    dor: "Peça com logo em circulação depois do descarte, expondo a marca a contexto não escolhido.",
    servico: "logistica-reversa-uniformes-epi",
    icone: "uniforme",
  },
  {
    slug: "portos-mineracao",
    nome: "Portos e mineração",
    dor: "Volume alto de EPI trocado por ciclo, com exigência de rastreabilidade e auditoria frequente.",
    servico: "logistica-reversa-uniformes-epi",
    icone: "uniforme",
  },
  {
    slug: "saude-food-service",
    nome: "Saúde e food service",
    dor: "Rotina intensa de troca de uniforme e necessidade de descaracterização documentada.",
    servico: "logistica-reversa-uniformes-epi",
    icone: "uniforme",
  },
  {
    slug: "hotelaria",
    nome: "Hotelaria",
    dor: "Enxoval fora de uso em grande volume, sem canal de destinação que gere documento.",
    servico: "reciclagem-desfibramento-textil",
    icone: "reciclagem",
  },
  {
    slug: "lavanderia-industrial",
    nome: "Lavanderias industriais",
    dor: "Peça condenada por desgaste saindo em volume constante, sem rota de reaproveitamento.",
    servico: "reciclagem-desfibramento-textil",
    icone: "reciclagem",
  },
  {
    slug: "facilities",
    nome: "Facilities e indústria",
    dor: "Contrato com meta de ESG e cobrança por indicador de resíduo auditável.",
    servico: "relatorios-impacto-esg",
    icone: "documento",
  },
];
