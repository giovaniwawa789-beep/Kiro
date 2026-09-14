"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useCena3D } from "@/lib/three/useCena3D";

/**
 * Grade de partículas interativa — a "malha têxtil".
 *
 * Conceito: uma trama regular de pontos, como fios de urdume e trama. O
 * ponteiro empurra a malha (repulsão gaussiana) e o scroll passa uma onda por
 * ela. A regularidade é o que faz ler como tecido em vez de confete.
 *
 * A grade é gerada a partir do FRUSTUM da câmera, não de um tamanho fixo. Foi um
 * bug real: com extensão fixa de 9.5 x 5.0 e a câmera vendo ~2.8 x 4.3, só uma
 * faixa central estreita aparecia e a malha ficava esparsa. Agora o espaçamento
 * é constante e a contagem de pontos se adapta ao formato do container, então a
 * densidade visual é a mesma em qualquer tela.
 *
 * Performance: um único Points, um draw call. O deslocamento é todo no vertex
 * shader — a CPU só escreve 4 uniforms por quadro.
 *
 * Acessibilidade: puramente decorativo, aria-hidden. O conteúdo real é HTML.
 */

/** Distância entre pontos, em unidades de mundo. */
const ESPACAMENTO = 0.028;
/** Teto de pontos: protege telas grandes de custo desnecessário. */
const MAX_PONTOS = 20000;
const DISTANCIA_CAMERA = 5.2;
/** 2 * tan(fov/2) para fov de 45°. */
const FATOR_FOV = 0.8284;

const VERTEX = /* glsl */ `
uniform float uTempo;
uniform float uProgresso;
uniform vec2  uPonteiro;
uniform vec2  uMundo;      /* metade da largura e altura visíveis */
uniform float uEscalaPx;   /* mundo -> pixel */

attribute float aIndiceFio;

varying float vIntensidade;

void main() {
  vec3 pos = position;

  /* onda de urdume: viaja no eixo X, empurrada pelo scroll */
  float onda = sin(pos.x * 1.9 + uTempo * 0.7 + uProgresso * 6.28) * 0.09;
  /* onda de trama: transversal e mais lenta, cria o cruzamento */
  onda += sin(pos.y * 2.6 - uTempo * 0.45) * 0.06;
  pos.z += onda;

  /* repulsão do ponteiro, em coordenadas de mundo da própria seção */
  vec2 ponteiroMundo = uPonteiro * uMundo;
  vec2 d = pos.xy - ponteiroMundo;
  float dist = length(d);
  float forca = exp(-dist * dist * 1.6);
  pos.xy += normalize(d + 1e-4) * forca * 0.26;
  pos.z += forca * 0.42;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  /* tamanho em unidades de mundo convertido para pixels pela perspectiva */
  float tamanhoMundo = 0.016 + forca * 0.026;
  gl_PointSize = clamp(tamanhoMundo * uEscalaPx / -mv.z, 1.0, 7.0);

  /* variação por fio: textura em vez de grade morta */
  float variacao = 0.6 + 0.4 * sin(aIndiceFio * 1.7);
  vIntensidade = variacao * (0.34 + onda * 1.6 + forca * 0.9);
}
`;

const FRAGMENT = /* glsl */ `
precision mediump float;

uniform vec3 uCorBase;
uniform vec3 uCorAcento;

varying float vIntensidade;

void main() {
  /* ponto redondo com borda suave, sem textura */
  vec2 c = gl_PointCoord - 0.5;
  float alfa = smoothstep(0.5, 0.14, length(c));
  if (alfa < 0.01) discard;

  vec3 cor = mix(uCorBase, uCorAcento, clamp(vIntensidade, 0.0, 1.0));
  /* teto de alfa: em blending aditivo, alfa alto satura para branco e come o
     contraste do texto por cima. Medido, não estimado. */
  gl_FragColor = vec4(cor, alfa * clamp(0.10 + vIntensidade * 0.85, 0.0, 0.85));
}
`;

export default function GradeParticulas({
  className = "",
}: {
  className?: string;
}) {
  const ref = useRef<{
    pontos: THREE.Points;
    geometria: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    posicoes: Float32Array;
    fios: Float32Array;
  } | null>(null);

  /** Reconstrói a trama para preencher o frustum no formato atual. */
  const gerar = (largura: number, altura: number) => {
    const r = ref.current;
    if (!r) return;

    const alturaVisivel = FATOR_FOV * DISTANCIA_CAMERA;
    const larguraVisivel = alturaVisivel * (largura / altura);

    // margem de 12%: a repulsão empurra pontos para fora da borda
    const extX = larguraVisivel * 1.12;
    const extY = alturaVisivel * 1.12;

    let colunas = Math.ceil(extX / ESPACAMENTO) + 1;
    let linhas = Math.ceil(extY / ESPACAMENTO) + 1;

    // respeita o teto de pontos mantendo a proporção
    if (colunas * linhas > MAX_PONTOS) {
      const fator = Math.sqrt(MAX_PONTOS / (colunas * linhas));
      colunas = Math.max(2, Math.floor(colunas * fator));
      linhas = Math.max(2, Math.floor(linhas * fator));
    }

    const total = colunas * linhas;
    let i = 0;
    for (let y = 0; y < linhas; y++) {
      for (let x = 0; x < colunas; x++) {
        r.posicoes[i * 3] = (x / (colunas - 1) - 0.5) * extX;
        r.posicoes[i * 3 + 1] = (y / (linhas - 1) - 0.5) * extY;
        r.posicoes[i * 3 + 2] = 0;
        r.fios[i] = x + y * 0.5;
        i++;
      }
    }

    r.geometria.attributes.position.needsUpdate = true;
    r.geometria.attributes.aIndiceFio.needsUpdate = true;
    r.geometria.setDrawRange(0, total);

    r.material.uniforms.uMundo.value.set(
      larguraVisivel / 2,
      alturaVisivel / 2,
    );
    r.material.uniforms.uEscalaPx.value = altura / FATOR_FOV;
  };

  const { refContainer, ativo } = useCena3D({
    distanciaCamera: DISTANCIA_CAMERA,

    montar: ({ cena, tamanho }) => {
      // aloca o máximo uma única vez; o resize só reescreve e ajusta drawRange
      const posicoes = new Float32Array(MAX_PONTOS * 3);
      const fios = new Float32Array(MAX_PONTOS);

      const geometria = new THREE.BufferGeometry();
      geometria.setAttribute(
        "position",
        new THREE.BufferAttribute(posicoes, 3),
      );
      geometria.setAttribute("aIndiceFio", new THREE.BufferAttribute(fios, 1));

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTempo: { value: 0 },
          uProgresso: { value: 0 },
          uPonteiro: { value: new THREE.Vector2(0, 0) },
          uMundo: { value: new THREE.Vector2(1, 1) },
          uEscalaPx: { value: 1000 },
          // tokens da marca
          uCorBase: { value: new THREE.Color(0x0e7490) },
          uCorAcento: { value: new THREE.Color(0x12b76a) },
        },
      });

      const pontos = new THREE.Points(geometria, material);
      // a trama não desaparece por frustum culling durante a repulsão
      pontos.frustumCulled = false;

      ref.current = { pontos, geometria, material, posicoes, fios };
      cena.add(pontos);

      gerar(tamanho.largura, tamanho.altura);
    },

    aoQuadro: (_ctx, { tempo, progresso, ponteiro }) => {
      const u = ref.current?.material.uniforms;
      if (!u) return;
      u.uTempo.value = tempo;
      u.uProgresso.value = progresso;
      u.uPonteiro.value.set(ponteiro.x, ponteiro.y);
    },

    aoRedimensionar: ({ tamanho }) => {
      gerar(tamanho.largura, tamanho.altura);
    },

    desmontar: () => {
      ref.current = null;
    },
  });

  return (
    <div
      ref={refContainer}
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        ativo ? "opacity-75" : "opacity-0"
      } ${className}`}
    />
  );
}
