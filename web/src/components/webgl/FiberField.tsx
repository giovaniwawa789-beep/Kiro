"use client";

import { useEffect, useRef, useState } from "react";
import { VERTEX, FRAGMENT } from "./fiberShader";

/**
 * Campo de fibras em WebGL — enriquecimento progressivo do hero.
 *
 * Princípios:
 *  - WebGL puro, sem three.js (que custaria ~150KB gzip para desenhar 1 quad);
 *  - só entra se o dispositivo aguentar: respeita reduced-motion, Save-Data,
 *    pouca memória e poucos núcleos;
 *  - pausa fora da viewport e com a aba em segundo plano;
 *  - se qualquer coisa falhar, simplesmente não renderiza e a aurora em CSS
 *    que já existe segue no lugar. Nunca fica tela preta.
 *
 * O canvas é `position: absolute` e não participa do layout, então não há
 * chance de deslocamento (CLS).
 */

const FPS_ALVO = 40; // acima disso o olho não ganha nada num fundo lento

function dispositivoAguenta(): boolean {
  if (typeof window === "undefined") return false;

  // Poupança de dados: não gastar GPU/bateria de quem pediu economia.
  const conexao = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  if (conexao?.saveData) return false;

  const memoria = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  if (typeof memoria === "number" && memoria < 4) return false;

  if (
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency < 4
  ) {
    return false;
  }

  return true;
}

function compilar(
  gl: WebGLRenderingContext,
  tipo: number,
  fonte: string,
): WebGLShader | null {
  const shader = gl.createShader(tipo);
  if (!shader) return null;
  gl.shaderSource(shader, fonte);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // não quebra a página: só desiste do enriquecimento
    if (process.env.NODE_ENV === "development") {
      console.warn("[FiberField]", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function FiberField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ativo, setAtivo] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const menosMovimento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!menosMovimento && !dispositivoAguenta()) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: true,
      }) ?? null;

    if (!gl) return;

    const vs = compilar(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    if (!vs || !fs) return;

    const programa = gl.createProgram();
    if (!programa) return;
    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;

    gl.useProgram(programa);

    // um quad em dois triângulos cobrindo o clip space
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(programa, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(programa, "uRes");
    const uTime = gl.getUniformLocation(programa, "uTime");
    const uFlow = gl.getUniformLocation(programa, "uFlow");
    const uScroll = gl.getUniformLocation(programa, "uScroll");

    // Com reduced-motion o campo é desenhado uma vez e congela.
    gl.uniform1f(uFlow, menosMovimento ? 0 : 1);

    /** DPR limitado a 1.5: acima disso só se paga fill rate. */
    const redimensionar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const l = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const a = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== l || canvas.height !== a) {
        canvas.width = l;
        canvas.height = a;
        gl.viewport(0, 0, l, a);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let frame = 0;
    let ultimo = 0;
    let visivel = true;
    let naViewport = true;
    const inicio = performance.now();
    const intervalo = 1000 / FPS_ALVO;

    /* Dolly de câmera dirigida pelo scroll.
       Lida no rAF a partir de uma variável, nunca dentro de um listener de
       scroll: assim não há trabalho de layout na thread de rolagem. */
    let scroll = 0;
    const medirScroll = () => {
      const altura = canvas.clientHeight || window.innerHeight;
      scroll = Math.min(Math.max(window.scrollY / altura, 0), 1);
    };
    medirScroll();
    window.addEventListener("scroll", medirScroll, { passive: true });

    const desenhar = (agora: number) => {
      frame = requestAnimationFrame(desenhar);
      if (!visivel || !naViewport) return;
      if (agora - ultimo < intervalo) return; // limita o FPS
      ultimo = agora;

      redimensionar();
      gl.uniform1f(uTime, (agora - inicio) / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    // quadro único quando o usuário pede menos movimento
    if (menosMovimento) {
      redimensionar();
      gl.uniform1f(uTime, 12.0); // instante escolhido: composição agradável
      gl.uniform1f(uScroll, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    } else {
      frame = requestAnimationFrame(desenhar);
    }

    setAtivo(true);

    // pausa com a aba em segundo plano
    const aoTrocarVisibilidade = () => {
      visivel = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", aoTrocarVisibilidade);

    // pausa quando o hero sai da tela
    const observador = new IntersectionObserver(
      ([entrada]) => {
        naViewport = entrada.isIntersecting;
      },
      { threshold: 0 },
    );
    observador.observe(canvas);

    // o navegador pode tirar o contexto sob pressão de memória
    const aoPerderContexto = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
      setAtivo(false);
    };
    canvas.addEventListener("webglcontextlost", aoPerderContexto);

    const aoRedimensionar = () => redimensionar();
    window.addEventListener("resize", aoRedimensionar, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", aoTrocarVisibilidade);
      canvas.removeEventListener("webglcontextlost", aoPerderContexto);
      window.removeEventListener("resize", aoRedimensionar);
      window.removeEventListener("scroll", medirScroll);
      observador.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(programa);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      /* fade-in só depois de inicializar: sem piscar preto sobre a aurora */
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        ativo ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
