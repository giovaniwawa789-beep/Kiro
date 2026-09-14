"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { medirCapacidade, type Capacidade } from "./capacidade";

export interface ContextoCena {
  renderer: THREE.WebGLRenderer;
  cena: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  capacidade: Capacidade;
  /** Tamanho em CSS px (não em pixels de device). */
  tamanho: { largura: number; altura: number };
}

export interface QuadroCena {
  /** Segundos desde o primeiro quadro. */
  tempo: number;
  /** Delta em segundos, limitado para evitar salto após pausa. */
  delta: number;
  /** Progresso 0..1 do elemento cruzando a viewport. */
  progresso: number;
  /** Ponteiro normalizado -1..1, suavizado. Fica em (0,0) sem interação. */
  ponteiro: { x: number; y: number };
}

interface Opcoes {
  /** Monta a cena: crie geometrias e materiais aqui. */
  montar: (ctx: ContextoCena) => void;
  /** Chamado a cada quadro renderizado. */
  aoQuadro?: (ctx: ContextoCena, q: QuadroCena) => void;
  /** Chamado em resize, após atualizar renderer e câmera. */
  aoRedimensionar?: (ctx: ContextoCena) => void;
  /** Descarte de recursos próprios (geometria, material, textura). */
  desmontar?: (ctx: ContextoCena) => void;
  /** Distância da câmera em unidades de cena. */
  distanciaCamera?: number;
}

/**
 * Ciclo de vida de uma cena Three.js, com todos os guardrails num só lugar.
 *
 * O que este hook garante, para os três componentes 3D não repetirem:
 *  - só inicializa quando o elemento entra na viewport (IntersectionObserver);
 *  - só inicializa se `medirCapacidade()` liberar;
 *  - limita DPR e FPS;
 *  - pausa fora da viewport e com a aba em segundo plano;
 *  - com `prefers-reduced-motion` desenha UM quadro e para;
 *  - descarta geometrias, materiais, texturas, render targets e o contexto;
 *  - sobrevive a `webglcontextlost` sem derrubar a página.
 *
 * Retorna `ref` (para o container) e `ativo` (para fazer fade-in só quando a
 * cena realmente existe — nunca aparece um retângulo preto).
 */
export function useCena3D(opcoes: Opcoes) {
  const refContainer = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(false);

  // guarda os callbacks em ref: mudar de identidade não deve remontar a cena
  const refOpcoes = useRef(opcoes);
  refOpcoes.current = opcoes;

  useEffect(() => {
    const container = refContainer.current;
    if (!container) return;

    const capacidade = medirCapacidade();
    if (!capacidade.pode) return;

    let ctx: ContextoCena | null = null;
    let frame = 0;
    let descartado = false;
    let visivelAba = true;
    let naViewport = false;
    let ultimo = 0;
    let inicio = 0;
    let jaDesenhouUm = false;

    const ponteiroAlvo = { x: 0, y: 0 };
    const ponteiro = { x: 0, y: 0 };

    /** Progresso do elemento atravessando a viewport, 0..1. */
    const medirProgresso = () => {
      const r = container.getBoundingClientRect();
      const total = window.innerHeight + r.height;
      const percorrido = window.innerHeight - r.top;
      return Math.min(Math.max(percorrido / total, 0), 1);
    };

    const iniciar = () => {
      if (ctx || descartado) return;

      const largura = container.clientWidth || 1;
      const altura = container.clientHeight || 1;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false, // DPR já suaviza; antialias custa banda
          powerPreference: "low-power",
          failIfMajorPerformanceCaveat: true,
        });
      } catch {
        return; // sem contexto: o layout HTML segue sozinho
      }

      renderer.setPixelRatio(capacidade.dpr);
      renderer.setSize(largura, altura, false);
      renderer.setClearColor(0x000000, 0);

      const canvas = renderer.domElement;
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      container.appendChild(canvas);

      const cena = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        largura / altura,
        0.1,
        100,
      );
      camera.position.z = opcoes.distanciaCamera ?? 6;

      ctx = {
        renderer,
        cena,
        camera,
        capacidade,
        tamanho: { largura, altura },
      };

      refOpcoes.current.montar(ctx);

      canvas.addEventListener("webglcontextlost", aoPerderContexto);
      setAtivo(true);

      inicio = performance.now();
      if (capacidade.menosMovimento) {
        // um quadro representativo e congela
        desenharUm(inicio + 1200);
      } else {
        frame = requestAnimationFrame(loop);
      }
    };

    const desenharUm = (agora: number) => {
      if (!ctx) return;
      const tempo = (agora - inicio) / 1000;
      refOpcoes.current.aoQuadro?.(ctx, {
        tempo,
        delta: 0,
        progresso: medirProgresso(),
        ponteiro,
      });
      ctx.renderer.render(ctx.cena, ctx.camera);
      jaDesenhouUm = true;
    };

    const loop = (agora: number) => {
      frame = requestAnimationFrame(loop);
      if (!ctx || !visivelAba || !naViewport) return;

      const intervalo = 1000 / capacidade.fps;
      if (agora - ultimo < intervalo) return;
      const delta = Math.min((agora - (ultimo || agora)) / 1000, 0.1);
      ultimo = agora;

      // suavização do ponteiro: evita tremor a cada evento
      ponteiro.x += (ponteiroAlvo.x - ponteiro.x) * 0.09;
      ponteiro.y += (ponteiroAlvo.y - ponteiro.y) * 0.09;

      refOpcoes.current.aoQuadro?.(ctx, {
        tempo: (agora - inicio) / 1000,
        delta,
        progresso: medirProgresso(),
        ponteiro,
      });
      ctx.renderer.render(ctx.cena, ctx.camera);
    };

    const aoPerderContexto = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frame);
      setAtivo(false);
    };

    /* Só inicializa quando entra na viewport, e pausa quando sai.
       rootMargin generoso: a cena já está pronta quando o usuário chega. */
    const observador = new IntersectionObserver(
      ([entrada]) => {
        naViewport = entrada.isIntersecting;
        if (naViewport) iniciar();
        // com reduced-motion, redesenha se o elemento voltar
        if (naViewport && ctx && capacidade.menosMovimento && !jaDesenhouUm) {
          desenharUm(performance.now());
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );
    observador.observe(container);

    const aoTrocarAba = () => {
      visivelAba = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", aoTrocarAba);

    const aoMoverPonteiro = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      ponteiroAlvo.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ponteiroAlvo.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const aoSairPonteiro = () => {
      ponteiroAlvo.x = 0;
      ponteiroAlvo.y = 0;
    };
    // pointermove no container: só custa quando o cursor está sobre a seção
    container.addEventListener("pointermove", aoMoverPonteiro, {
      passive: true,
    });
    container.addEventListener("pointerleave", aoSairPonteiro);

    const aoRedimensionar = () => {
      if (!ctx) return;
      const largura = container.clientWidth || 1;
      const altura = container.clientHeight || 1;
      ctx.tamanho = { largura, altura };
      ctx.renderer.setSize(largura, altura, false);
      ctx.camera.aspect = largura / altura;
      ctx.camera.updateProjectionMatrix();
      refOpcoes.current.aoRedimensionar?.(ctx);
      if (capacidade.menosMovimento) desenharUm(performance.now());
    };
    window.addEventListener("resize", aoRedimensionar, { passive: true });

    return () => {
      descartado = true;
      cancelAnimationFrame(frame);
      observador.disconnect();
      document.removeEventListener("visibilitychange", aoTrocarAba);
      container.removeEventListener("pointermove", aoMoverPonteiro);
      container.removeEventListener("pointerleave", aoSairPonteiro);
      window.removeEventListener("resize", aoRedimensionar);

      if (!ctx) return;
      ctx.renderer.domElement.removeEventListener(
        "webglcontextlost",
        aoPerderContexto,
      );
      refOpcoes.current.desmontar?.(ctx);

      // varre a cena descartando o que o Three não limpa sozinho
      ctx.cena.traverse((obj) => {
        const m = obj as THREE.Mesh | THREE.Points;
        m.geometry?.dispose?.();
        const mat = m.material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      ctx.cena.clear();
      ctx.renderer.dispose();
      ctx.renderer.forceContextLoss();
      ctx.renderer.domElement.remove();
      ctx = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { refContainer, ativo };
}
