/**
 * Envio do formulário de contato — camada abstraída de propósito.
 *
 * Hoje não há backend: a implementação padrão abre o cliente de e-mail com a
 * mensagem pré-preenchida. Para integrar de verdade (Resend, Formspree, API
 * própria, HubSpot...), troque SOMENTE o corpo de `enviarContato`. A UI não
 * precisa mudar: ela só depende do tipo `ResultadoEnvio`.
 */

import { site } from "@/content/site";

export interface DadosContato {
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  tipoServico: string;
  mensagem: string;
}

export type ResultadoEnvio =
  | { ok: true }
  | { ok: false; erro: string };

export type ErrosContato = Partial<Record<keyof DadosContato, string>>;

const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Aceita telefone brasileiro com 10 ou 11 dígitos, com ou sem máscara. */
const RE_TELEFONE = /^\d{10,11}$/;

export function validarContato(dados: DadosContato): ErrosContato {
  const erros: ErrosContato = {};

  if (dados.nome.trim().length < 2) {
    erros.nome = "Informe o seu nome.";
  }
  if (dados.empresa.trim().length < 2) {
    erros.empresa = "Informe o nome da empresa.";
  }
  if (!RE_EMAIL.test(dados.email.trim())) {
    erros.email = "Informe um e-mail válido.";
  }
  const digitos = dados.telefone.replace(/\D/g, "");
  if (digitos && !RE_TELEFONE.test(digitos)) {
    erros.telefone = "Informe um telefone com DDD.";
  }
  if (dados.mensagem.trim().length < 10) {
    erros.mensagem = "Conte um pouco mais: pelo menos 10 caracteres.";
  }

  return erros;
}

export async function enviarContato(
  dados: DadosContato,
): Promise<ResultadoEnvio> {
  const erros = validarContato(dados);
  if (Object.keys(erros).length > 0) {
    return { ok: false, erro: "Confira os campos destacados." };
  }

  try {
    const corpo = [
      `Nome: ${dados.nome}`,
      `Empresa: ${dados.empresa}`,
      `E-mail: ${dados.email}`,
      `Telefone: ${dados.telefone || "não informado"}`,
      `Serviço de interesse: ${dados.tipoServico}`,
      "",
      dados.mensagem,
    ].join("\n");

    const url =
      `mailto:${site.contato.email}` +
      `?subject=${encodeURIComponent(`Contato pelo site — ${dados.empresa}`)}` +
      `&body=${encodeURIComponent(corpo)}`;

    if (typeof window !== "undefined") {
      window.location.href = url;
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      erro: "Não foi possível enviar agora. Tente pelo WhatsApp.",
    };
  }
}
