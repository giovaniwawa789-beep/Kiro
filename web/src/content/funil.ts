/**
 * Funil VIP de duas etapas.
 *
 * Etapa 1 qualifica; etapa 2 agenda. A ordem é deliberada: pedir dia e hora
 * antes de entender a operação gera reunião com quem não tem volume, e o custo
 * disso é a agenda de quem atende.
 */

export interface OpcaoCampo {
  valor: string;
  rotulo: string;
  /** Nota curta que aparece sob a opção. */
  nota?: string;
}

export const tiposOperacao: OpcaoCampo[] = [
  { valor: "confeccao", rotulo: "Confecção" },
  { valor: "industria-textil", rotulo: "Indústria têxtil" },
  { valor: "malharia", rotulo: "Malharia" },
  { valor: "lavanderia", rotulo: "Lavanderia industrial" },
  { valor: "uniformes", rotulo: "Uniformes corporativos" },
  { valor: "varejo", rotulo: "Varejo de moda" },
];

export const faixasVolume: OpcaoCampo[] = [
  { valor: "ate-500kg", rotulo: "Até 500 kg/mês", nota: "Coleta pontual" },
  { valor: "500kg-2t", rotulo: "500 kg a 2 t/mês", nota: "Coleta recorrente" },
  { valor: "2t-10t", rotulo: "2 a 10 t/mês", nota: "Operação dedicada" },
  { valor: "acima-10t", rotulo: "Acima de 10 t/mês", nota: "Projeto estruturado" },
];

export const situacoesDocumentais: OpcaoCampo[] = [
  { valor: "tem-pgrs", rotulo: "Já temos PGRS vigente" },
  { valor: "pgrs-vencido", rotulo: "Temos, mas está desatualizado" },
  { valor: "sem-pgrs", rotulo: "Não temos PGRS" },
  { valor: "nao-sei", rotulo: "Não sei dizer" },
];

export const urgencias: OpcaoCampo[] = [
  {
    valor: "fiscalizacao",
    rotulo: "Fiscalização ou autuação em curso",
    nota: "Prioridade máxima",
  },
  {
    valor: "auditoria",
    rotulo: "Auditoria ou certificação agendada",
    nota: "Prazo definido",
  },
  {
    valor: "planejamento",
    rotulo: "Planejamento para os próximos meses",
    nota: "Sem urgência",
  },
];

export const horarios: OpcaoCampo[] = [
  { valor: "09:00", rotulo: "09:00" },
  { valor: "10:30", rotulo: "10:30" },
  { valor: "14:00", rotulo: "14:00" },
  { valor: "15:30", rotulo: "15:30" },
  { valor: "17:00", rotulo: "17:00" },
];

/**
 * Próximos dias úteis a partir de hoje.
 *
 * Calculado no cliente, depois da hidratação: a lista depende da data atual e
 * renderizá-la no servidor causaria divergência de hidratação.
 *
 * TODO: substituir por disponibilidade real (Google Calendar, Cal.com, Calendly)
 * — hoje qualquer dia útil aparece como livre.
 */
export function proximosDiasUteis(quantidade = 6, hoje = new Date()) {
  const dias: { iso: string; diaSemana: string; dia: string; mes: string }[] = [];
  const cursor = new Date(hoje);
  cursor.setHours(0, 0, 0, 0);

  while (dias.length < quantidade) {
    cursor.setDate(cursor.getDate() + 1);
    const semana = cursor.getDay();
    if (semana === 0 || semana === 6) continue; // pula fim de semana

    dias.push({
      iso: cursor.toISOString().slice(0, 10),
      diaSemana: cursor.toLocaleDateString("pt-BR", { weekday: "short" }),
      dia: cursor.toLocaleDateString("pt-BR", { day: "2-digit" }),
      mes: cursor.toLocaleDateString("pt-BR", { month: "short" }),
    });
  }

  return dias;
}
