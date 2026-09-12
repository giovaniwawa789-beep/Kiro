/**
 * Serviços — texto institucional fornecido pelo cliente, usado como está.
 * Para editar um serviço, altere apenas este arquivo: a Home e as páginas
 * /servicos/[slug] são geradas a partir daqui.
 */

export type IconeServico =
  | "consultoria"
  | "reciclagem"
  | "documento"
  | "coleta"
  | "uniforme"
  | "produto";

export interface Servico {
  slug: string;
  numero: string;
  titulo: string;
  /** Frase curta para o card na Home. */
  resumo: string;
  /** Texto completo, exibido na página do serviço. */
  descricao: string;
  entregas: string[];
  icone: IconeServico;
  /** Benefícios objetivos, exibidos na página interna. */
  beneficios: string[];
  /** Base legal aplicável. */
  baseLegal: string[];
  seo: { title: string; description: string };
}

export const servicos: Servico[] = [
  {
    slug: "consultoria-gestao-ambiental-sustentabilidade",
    numero: "01",
    titulo: "Consultoria em Gestão Ambiental e Sustentabilidade",
    resumo:
      "Gestão ambiental da sua indústria têxtil estruturada de ponta a ponta, com processos auditáveis.",
    descricao:
      "Estruturamos a gestão ambiental da sua indústria têxtil de ponta a ponta: definição de política ambiental, planejamento, implantação dos controles, acompanhamento dos indicadores e revisão gerencial. Você opera em conformidade com a legislação e com processos auditáveis.",
    entregas: [
      "Diagnóstico ambiental",
      "Plano de adequação",
      "Indicadores e revisão periódica",
    ],
    icone: "consultoria",
    beneficios: [
      "Conformidade legal demonstrável em auditoria e fiscalização",
      "Indicadores ambientais próprios, no lugar de estimativas",
      "Política ambiental escrita e revisada em ciclo gerencial",
    ],
    baseLegal: [
      "Lei nº 12.305/2010 — Política Nacional de Resíduos Sólidos",
      "Decreto nº 10.936/2022 — regulamenta a PNRS",
      "Exigências do órgão ambiental estadual e municipal aplicáveis à atividade",
    ],
    seo: {
      title: "Consultoria ambiental têxtil | Nunes e Lucato",
      description:
        "Consultoria em gestão ambiental e sustentabilidade para indústrias e confecções têxteis: política ambiental, plano de adequação, indicadores e revisão gerencial.",
    },
  },
  {
    slug: "gestao-residuos-texteis-logistica-reversa",
    numero: "02",
    titulo: "Gestão de Resíduos Têxteis e Logística Reversa",
    resumo:
      "Seu resíduo têxtil volta à cadeia como matéria-prima, dentro de um ciclo real de logística reversa.",
    descricao:
      "Assumimos a gestão dos resíduos têxteis gerados na sua produção e os reinserimos na cadeia como matéria-prima. Implantamos a política de lixo zero e colocamos a sua marca dentro de um ciclo real de logística reversa têxtil.",
    entregas: [
      "Mapeamento da geração",
      "Fluxo de logística reversa",
      "Rastreabilidade e relatório de destinação",
    ],
    icone: "reciclagem",
    beneficios: [
      "Resíduo tratado como recurso, não como custo de descarte",
      "Rastreabilidade da coleta até a destinação final",
      "Base documental para relatório de ESG e comunicação de marca",
    ],
    baseLegal: [
      "Lei nº 12.305/2010 — responsabilidade compartilhada pelo ciclo de vida",
      "Sistema MTR Nacional / SINIR — manifesto de transporte de resíduos",
      "Plano Municipal de Gestão Integrada de Resíduos Sólidos de São Paulo",
    ],
    seo: {
      title: "Gestão de resíduos têxteis e logística reversa | Nunes e Lucato",
      description:
        "Gestão de resíduos têxteis com logística reversa: mapeamento da geração, rastreabilidade e relatório de destinação para indústrias e confecções.",
    },
  },
  {
    slug: "pgrs-plano-gerenciamento-residuos-solidos",
    numero: "03",
    titulo: "Plano de Gerenciamento de Resíduos Sólidos (PGRS)",
    resumo:
      "O documento exigido por lei, com inventário, classificação e destinação de cada resíduo.",
    descricao:
      "Elaboramos o PGRS, documento exigido por lei, reunindo o inventário completo dos resíduos gerados pela sua empresa, sua classificação e as formas ambientalmente adequadas de destinação de cada um.",
    entregas: [
      "Inventário e classificação",
      "Plano de destinação",
      "Documento pronto para o órgão ambiental",
    ],
    icone: "documento",
    beneficios: [
      "Documento pronto para protocolo no órgão ambiental",
      "Classificação técnica de cada resíduo, com destinação definida",
      "Redução do risco de autuação por ausência de plano",
    ],
    baseLegal: [
      "Lei nº 12.305/2010, arts. 20 a 24 — obrigatoriedade e conteúdo mínimo do PGRS",
      "Decreto nº 10.936/2022 — regulamenta a PNRS",
      "ABNT NBR 10.004 — classificação de resíduos sólidos",
    ],
    seo: {
      title: "PGRS para indústria têxtil e confecção | Nunes e Lucato",
      description:
        "Elaboração de Plano de Gerenciamento de Resíduos Sólidos (PGRS) para o setor têxtil: inventário, classificação e plano de destinação.",
    },
  },
  {
    slug: "coleta-seletiva-textil",
    numero: "04",
    titulo: "Coleta Seletiva Têxtil",
    resumo:
      "Coleta agendada na sua empresa, com transporte adequado e comprovação de destinação.",
    descricao:
      "Coletamos o resíduo diretamente na sua empresa quando o descarte nos nossos pontos não é viável, garantindo destinação adequada. Coleta agendada, com agilidade e compromisso, para qualquer volume de demanda.",
    entregas: [
      "Coleta agendada",
      "Transporte adequado",
      "Comprovação de destinação",
    ],
    icone: "coleta",
    beneficios: [
      "Retirada na sua unidade, sem depender de ponto de entrega",
      "Emissão do MTR a cada transporte",
      "Atendimento para qualquer volume de demanda",
    ],
    baseLegal: [
      "Sistema MTR Nacional / SINIR — manifesto obrigatório no transporte",
      "Lei nº 12.305/2010 — destinação final ambientalmente adequada",
      "Resolução CONAMA aplicável ao transporte de resíduos",
    ],
    seo: {
      title: "Coleta seletiva têxtil em São Paulo | Nunes e Lucato",
      description:
        "Coleta seletiva têxtil agendada na sua empresa, com transporte adequado, emissão de MTR e comprovação de destinação.",
    },
  },
  {
    slug: "descarte-reciclagem-uniformes",
    numero: "05",
    titulo: "Descarte e Reciclagem de Uniformes",
    resumo:
      "Descaracterização e reciclagem de uniformes, eliminando o risco de uso indevido da sua marca.",
    descricao:
      "Fazemos a descaracterização, o descarte e a reciclagem de uniformes, eliminando o risco de uso indevido da sua marca e garantindo a destinação sustentável das peças.",
    entregas: [
      "Descaracterização",
      "Certificado de destruição",
      "Reciclagem do material",
    ],
    icone: "uniforme",
    beneficios: [
      "Elimina o risco de a peça com a sua marca reaparecer em circulação",
      "Processo registrado em fotografia e vídeo, peça por peça",
      "Certificado formal ao final do processo",
    ],
    baseLegal: [
      "Lei nº 12.305/2010 — destinação final ambientalmente adequada",
      "Sistema MTR Nacional / SINIR — rastreabilidade do transporte",
      "Lei nº 9.279/1996 — proteção da marca contra uso indevido",
    ],
    seo: {
      title: "Descarte e reciclagem de uniformes | Nunes e Lucato",
      description:
        "Descaracterização, descarte e reciclagem de uniformes corporativos com certificado de destruição e destinação sustentável.",
    },
  },
  {
    slug: "desenvolvimento-produtos-sustentaveis",
    numero: "06",
    titulo: "Desenvolvimento de Produtos Sustentáveis",
    resumo:
      "Resíduo têxtil transformado em produto com valor de uso e de marca, para brindes e ESG.",
    descricao:
      "Transformamos resíduo têxtil em produtos com valor de uso e de marca: ecobags, jogos de escumadeiras, lixeiras basculantes de 7L e jogos de tapetes. Ideais para brindes corporativos e ações de ESG.",
    entregas: [
      "Desenvolvimento do produto",
      "Produção a partir do seu próprio resíduo",
      "Personalização com a sua marca",
    ],
    icone: "produto",
    beneficios: [
      "O brinde nasce do resíduo da própria empresa, com história verificável",
      "Valor agregado ao material que antes era custo de descarte",
      "Peça personalizada, aplicável a campanhas de ESG e datas comemorativas",
    ],
    baseLegal: [
      "Lei nº 12.305/2010 — prioridade à reutilização e à reciclagem",
      "Decreto nº 10.936/2022 — incentivo à economia circular",
    ],
    seo: {
      title: "Produtos sustentáveis de resíduo têxtil | Nunes e Lucato",
      description:
        "Desenvolvimento de produtos sustentáveis a partir do seu resíduo têxtil: ecobags, tapetes, lixeiras e brindes corporativos personalizados.",
    },
  },
];

export function servicoPorSlug(slug: string): Servico | undefined {
  return servicos.find((s) => s.slug === slug);
}
