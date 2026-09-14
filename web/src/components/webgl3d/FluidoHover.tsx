"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useCena3D } from "@/lib/three/useCena3D";

/**
 * Efeito fluido de hover.
 *
 * É simulação de verdade, não gradiente animado: dois render targets em
 * ping-pong. Cada quadro advecta o campo anterior (desloca a amostragem pela
 * própria velocidade), aplica decaimento e injeta tinta na posição do ponteiro
 * com a velocidade dele. O resultado é uma esteira que se dissolve, com a
 * inércia que um gradiente não consegue imitar.
 *
 * Por que UM canvas para a seção inteira, e não um por card: cada canvas é um
 * contexto WebGL, e o navegador limita a poucos por página. Um contexto de
 * seção posicionado atrás dos cards dá o mesmo efeito com um único contexto.
 *
 * Resolução da simulação fixa em 256x256 e independente do tamanho da tela: o
 * fluido é difuso, ninguém percebe a diferença, e o custo deixa de escalar com
 * o monitor.
 */

const RES_SIM = 256;

/** Passo de simulação: advecção + decaimento + injeção no ponteiro. */
const FRAG_SIM = /* glsl */ `
precision highp float;

uniform sampler2D uAnterior;
uniform vec2  uPonteiro;    /* 0..1 */
uniform vec2  uVelocidade;
uniform float uForca;       /* 0 quando o ponteiro está fora */
uniform float uDelta;

varying vec2 vUv;

void main() {
  /* campo anterior: rg = velocidade, b = tinta */
  vec4 anterior = texture2D(uAnterior, vUv);

  /* advecção semi-lagrangiana: busca de onde o fluido veio */
  vec2 vel = anterior.rg * 2.0 - 1.0;
  vec2 origem = vUv - vel * uDelta * 0.55;
  vec4 advectado = texture2D(uAnterior, origem);

  vec2 velNova = (advectado.rg * 2.0 - 1.0) * 0.972;  /* atrito */
  float tinta = advectado.b * 0.965;                  /* dissipação */

  /* injeção: pincel gaussiano na posição do ponteiro */
  float d = distance(vUv, uPonteiro);
  float pincel = exp(-d * d * 340.0) * uForca;
  velNova += uVelocidade * pincel * 1.6;
  tinta += pincel * 0.85;

  velNova = clamp(velNova, -1.0, 1.0);
  gl_FragColor = vec4(velNova * 0.5 + 0.5, clamp(tinta, 0.0, 1.0), 1.0);
}
`;

/** Passo de exibição: colore a tinta e distorce com a velocidade. */
const FRAG_TELA = /* glsl */ `
precision highp float;

uniform sampler2D uCampo;
uniform vec3 uCorA;
uniform vec3 uCorB;

varying vec2 vUv;

void main() {
  vec4 campo = texture2D(uCampo, vUv);
  vec2 vel = campo.rg * 2.0 - 1.0;
  float tinta = campo.b;

  /* reamostra deslocado pela velocidade: dá o arraste visual */
  float t2 = texture2D(uCampo, vUv - vel * 0.02).b;
  float mistura = mix(tinta, t2, 0.5);

  /* velocidade define a cor: rápido puxa para o lima, lento fica no verde */
  float energia = clamp(length(vel) * 1.7, 0.0, 1.0);
  vec3 cor = mix(uCorA, uCorB, energia);

  /* curva suave para não virar mancha chapada */
  float alfa = smoothstep(0.02, 0.55, mistura) * 0.62;
  gl_FragColor = vec4(cor * (0.35 + mistura * 1.1), alfa);
}
`;

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export default function FluidoHover({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<{
    alvoA: THREE.WebGLRenderTarget;
    alvoB: THREE.WebGLRenderTarget;
    cenaSim: THREE.Scene;
    matSim: THREE.ShaderMaterial;
    matTela: THREE.ShaderMaterial;
    cameraSim: THREE.OrthographicCamera;
    ultimoPonteiro: THREE.Vector2;
  } | null>(null);

  const { refContainer, ativo } = useCena3D({
    distanciaCamera: 1,

    montar: ({ cena }) => {
      const opcoes: THREE.RenderTargetOptions = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType, // precisão suficiente e barata
        depthBuffer: false,
        stencilBuffer: false,
      };
      const alvoA = new THREE.WebGLRenderTarget(RES_SIM, RES_SIM, opcoes);
      const alvoB = new THREE.WebGLRenderTarget(RES_SIM, RES_SIM, opcoes);

      const quad = new THREE.PlaneGeometry(2, 2);

      const matSim = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG_SIM,
        depthTest: false,
        uniforms: {
          uAnterior: { value: alvoA.texture },
          uPonteiro: { value: new THREE.Vector2(0.5, 0.5) },
          uVelocidade: { value: new THREE.Vector2(0, 0) },
          uForca: { value: 0 },
          uDelta: { value: 0.016 },
        },
      });

      const cenaSim = new THREE.Scene();
      cenaSim.add(new THREE.Mesh(quad, matSim));

      const matTela = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG_TELA,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uCampo: { value: alvoB.texture },
          uCorA: { value: new THREE.Color(0x0e7490) },
          uCorB: { value: new THREE.Color(0xa3e635) },
        },
      });
      cena.add(new THREE.Mesh(quad.clone(), matTela));

      ref.current = {
        alvoA,
        alvoB,
        cenaSim,
        matSim,
        matTela,
        cameraSim: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
        ultimoPonteiro: new THREE.Vector2(0.5, 0.5),
      };
    },

    aoQuadro: ({ renderer }, { delta, ponteiro }) => {
      const r = ref.current;
      if (!r) return;

      // ponteiro do hook vem em -1..1; a simulação usa 0..1
      const px = ponteiro.x * 0.5 + 0.5;
      const py = ponteiro.y * 0.5 + 0.5;
      const vx = px - r.ultimoPonteiro.x;
      const vy = py - r.ultimoPonteiro.y;
      r.ultimoPonteiro.set(px, py);

      // fora da seção o hook devolve (0,0) -> centro exato: não injeta tinta
      const parado = Math.abs(ponteiro.x) < 0.001 && Math.abs(ponteiro.y) < 0.001;

      r.matSim.uniforms.uPonteiro.value.set(px, py);
      r.matSim.uniforms.uVelocidade.value.set(vx * 12, vy * 12);
      r.matSim.uniforms.uForca.value = parado ? 0 : 1;
      r.matSim.uniforms.uDelta.value = Math.min(delta, 0.033);

      // ping-pong: lê de A, escreve em B, troca
      r.matSim.uniforms.uAnterior.value = r.alvoA.texture;
      renderer.setRenderTarget(r.alvoB);
      renderer.render(r.cenaSim, r.cameraSim);
      renderer.setRenderTarget(null);

      const t = r.alvoA;
      r.alvoA = r.alvoB;
      r.alvoB = t;

      r.matTela.uniforms.uCampo.value = r.alvoA.texture;
    },

    desmontar: () => {
      const r = ref.current;
      if (!r) return;
      r.alvoA.dispose();
      r.alvoB.dispose();
      r.cenaSim.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
      });
      r.matSim.dispose();
      r.matTela.dispose();
      ref.current = null;
    },
  });

  return (
    <div
      ref={refContainer}
      aria-hidden
      className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        ativo ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
