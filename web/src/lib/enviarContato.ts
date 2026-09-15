/**
 * Envio do formulário — camada isolada de propósito.
 *
 * Hoje não há backend: a implementação abre o cliente de e-mail com a mensagem
 * pronta. Para integrar de verdade (Resend, Formspree, API própria, CRM), troque
 * SOMENTE o corpo de `enviarOrcamento`. A UI depende apenas do tipo de retorno.
 */

import { site } from "@/content/site";

export interface DadosOrcamento {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  tipoResiduo: string;
  volumeMensal: string;
  cidade: string;
  mensagem: string;
  /** Campo-armadilha: bot preenche, humano não vê. */
  isca: string;
  /** Instante em que o formulário foi montado, para medir o tempo de preenchimento. */
  aberto: number;
}

export type Resultado = { ok: true } | { ok: false; erro: string };
export type Erros = Partial<Record<keyof DadosOrcamento, string>>;

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RE_TELEFONE = /^\d{10,11}$/;

/** Menos de 3s entre abrir e enviar é comportamento de robô, não de pessoa. */
const TEMPO_MINIMO_MS = 3000;

export function validarOrcamento(d: DadosOrcamento): Erros {
  const e: Erros = {};

  if (d.nome.trim().length < 2) e.nome = "Informe o seu nome.";
  if (d.empresa.trim().length < 2) e.empresa = "Informe a empresa.";
  if (!RE_EMAIL.test(d.email.trim())) e.email = "Informe um e-mail válido.";

  const digitos = d.telefone.replace(/\D/g, "");
  if (!RE_TELEFONE.test(digitos)) e.telefone = "Informe um telefone com DDD.";

  if (!d.tipoResiduo) e.tipoResiduo = "Selecione o tipo de resíduo.";
  if (!d.volumeMensal) e.volumeMensal = "Selecione o volume mensal.";
  if (d.cidade.trim().length < 2) e.cidade = "Informe a cidade.";

  return e;
}

export async function enviarOrcamento(d: DadosOrcamento): Promise<Resultado> {
  // Anti-spam 1: campo-armadilha preenchido = robô.
  if (d.isca.trim() !== "") {
    return { ok: false, erro: "Não foi possível enviar. Tente novamente." };
  }

  // Anti-spam 2: preenchimento instantâneo = robô.
  if (Date.now() - d.aberto < TEMPO_MINIMO_MS) {
    return {
      ok: false,
      erro: "Aguarde um instante e envie novamente.",
    };
  }

  if (Object.keys(validarOrcamento(d)).length > 0) {
    return { ok: false, erro: "Confira os campos destacados." };
  }

  try {
    const corpo = [
      "PEDIDO DE ORÇAMENTO — site",
      "",
      `Empresa: ${d.empresa}`,
      `Contato: ${d.nome}`,
      `E-mail: ${d.email}`,
      `Telefone: ${d.telefone}`,
      `Cidade: ${d.cidade}`,
      "",
      `Tipo de resíduo: ${d.tipoResiduo}`,
      `Volume mensal estimado: ${d.volumeMensal}`,
      "",
      d.mensagem.trim() ? `Observações: ${d.mensagem}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const url =
      `mailto:${site.contato.email}` +
      `?subject=${encodeURIComponent(`Orçamento — ${d.empresa}`)}` +
      `&body=${encodeURIComponent(corpo)}`;

    if (typeof window !== "undefined") window.location.href = url;
    return { ok: true };
  } catch {
    return {
      ok: false,
      erro: "Não foi possível enviar agora. Fale pelo WhatsApp.",
    };
  }
}

export const tiposResiduo = [
  "Retalho, aparas e sobra de corte",
  "Uniformes e EPIs",
  "Peças com defeito ou sobra de estoque",
  "Enxoval e rouparia",
  "Coleção não vendida",
  "Outro / não sei classificar",
] as const;

export const volumesMensais = [
  "Até 200 kg",
  "200 kg a 1 t",
  "1 a 5 t",
  "5 a 20 t",
  "Acima de 20 t",
  "Ainda não sei estimar",
] as const;
