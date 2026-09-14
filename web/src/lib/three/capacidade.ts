/**
 * Guarda de capacidade para as camadas WebGL.
 *
 * Regra do projeto: 3D é enriquecimento, nunca requisito. Se o dispositivo não
 * aguenta, o componente não monta e o layout em HTML/CSS segue inteiro.
 */

export interface Capacidade {
  /** Pode montar a cena 3D. */
  pode: boolean;
  /** Usuário pediu menos movimento: desenhar um quadro e congelar. */
  menosMovimento: boolean;
  /** Limite de device pixel ratio (acima disso só se paga fill rate). */
  dpr: number;
  /** Teto de quadros por segundo. */
  fps: number;
}

export function medirCapacidade(): Capacidade {
  const negado: Capacidade = {
    pode: false,
    menosMovimento: false,
    dpr: 1,
    fps: 0,
  };

  if (typeof window === "undefined") return negado;

  const menosMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Poupança de dados: não gastar GPU e bateria de quem pediu economia.
  const conexao = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (conexao?.saveData) return negado;

  const memoria = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (typeof memoria === "number" && memoria < 4) return negado;

  const nucleos = navigator.hardwareConcurrency;
  if (typeof nucleos === "number" && nucleos < 4) return negado;

  // Sem contexto WebGL utilizável, nada a fazer.
  try {
    const teste = document.createElement("canvas");
    const gl = teste.getContext("webgl", {
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl) return negado;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return negado;
  }

  /* Telas grandes com muitos pixels custam caro: em >=1920 CSS px seguramos o
     DPR em 1.25 para não render 4x a área útil. */
  const larga = window.innerWidth >= 1920;

  return {
    pode: true,
    menosMovimento,
    dpr: Math.min(window.devicePixelRatio || 1, larga ? 1.25 : 1.5),
    fps: menosMovimento ? 0 : 40,
  };
}
