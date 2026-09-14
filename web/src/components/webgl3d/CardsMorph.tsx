"use client";

import { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { useCena3D } from "@/lib/three/useCena3D";

/**
 * Cards geométricos com morph — a hierarquia de destinação em 3D.
 *
 * Cada sólido representa um degrau: upcycle, desfibramento, coprocessamento.
 * O morph é real, no vertex shader: interpola entre a posição na esfera
 * (material íntegro, coeso) e a posição achatada e ruidosa (material
 * fragmentado). Quanto mais baixo o degrau, mais fragmentado o sólido.
 *
 * Acessibilidade: os rótulos NÃO estão na textura — texto em WebGL é invisível
 * para leitor de tela e não pode ser selecionado. Aqui o 3D é o pano de fundo e
 * os nomes são HTML por cima, com o mesmo índice. O hover é sincronizado nos
 * dois sentidos: passar no HTML destaca o sólido, e vice-versa.
 */

export interface ItemMorph {
  rotulo: string;
  /** 0 = íntegro (upcycle), 1 = fragmentado (coprocessamento). */
  fragmentacao: number;
  cor: number;
}

const VERTEX = /* glsl */ `
uniform float uTempo;
uniform float uMorph;      /* 0 = esfera, 1 = disco fragmentado */
uniform float uDestaque;   /* 0..1 hover */

attribute vec3 aAlvo;      /* posição achatada correspondente */
attribute float aRuido;

varying float vFresnel;
varying float vAltura;

void main() {
  /* interpola entre íntegro e fragmentado */
  vec3 pos = mix(position, aAlvo, uMorph);

  /* respiração: sólido íntegro pulsa devagar, fragmentado tremula */
  float tremor = mix(0.012, 0.05, uMorph);
  pos += normalize(position) * sin(uTempo * 1.1 + aRuido * 6.28) * tremor;

  /* hover infla levemente o sólido */
  pos *= 1.0 + uDestaque * 0.06;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  /* fresnel para dar leitura de vidro/mineral na borda */
  vec3 n = normalize(normalMatrix * normal);
  vec3 v = normalize(-mv.xyz);
  vFresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);
  vAltura = pos.y;
}
`;

const FRAGMENT = /* glsl */ `
precision mediump float;

uniform vec3  uCor;
uniform float uDestaque;

varying float vFresnel;
varying float vAltura;

void main() {
  /* corpo escuro translúcido + borda acesa: material, não plástico */
  float borda = vFresnel;
  vec3 cor = uCor * (0.16 + borda * 1.25);
  cor += uCor * uDestaque * 0.35;

  /* leve gradiente vertical: sugere luz vindo de cima */
  cor *= 0.82 + 0.28 * smoothstep(-1.0, 1.0, vAltura);

  float alfa = 0.14 + borda * 0.72 + uDestaque * 0.16;
  gl_FragColor = vec4(cor, clamp(alfa, 0.0, 0.95));
}
`;

export default function CardsMorph({
  itens,
  className = "",
}: {
  itens: ItemMorph[];
  className?: string;
}) {
  const refMalhas = useRef<THREE.Mesh[]>([]);
  const [destacado, setDestacado] = useState<number | null>(null);
  const refDestacado = useRef<number | null>(null);
  refDestacado.current = destacado;

  const { refContainer, ativo } = useCena3D({
    distanciaCamera: 7.2,

    montar: ({ cena }) => {
      const luz = new THREE.Vector3(-1, 1, 1).normalize();
      void luz; // iluminação é feita no shader, não por luzes da cena

      itens.forEach((item, indice) => {
        // esfera de baixa densidade: leitura facetada, barata
        const geometria = new THREE.IcosahedronGeometry(1, 3);
        const qtd = geometria.attributes.position.count;
        const origem = geometria.attributes.position.array as Float32Array;

        const alvo = new Float32Array(qtd * 3);
        const ruido = new Float32Array(qtd);

        for (let i = 0; i < qtd; i++) {
          const x = origem[i * 3];
          const y = origem[i * 3 + 1];
          const z = origem[i * 3 + 2];

          // achata em disco e espalha conforme a fragmentação do degrau
          const espalho = 1 + item.fragmentacao * 1.5;
          const r = Math.random();
          alvo[i * 3] = x * espalho + (r - 0.5) * item.fragmentacao * 0.9;
          alvo[i * 3 + 1] = y * 0.22 + (r - 0.5) * item.fragmentacao * 0.7;
          alvo[i * 3 + 2] = z * espalho + (r - 0.5) * item.fragmentacao * 0.9;
          ruido[i] = r;
        }

        geometria.setAttribute("aAlvo", new THREE.BufferAttribute(alvo, 3));
        geometria.setAttribute("aRuido", new THREE.BufferAttribute(ruido, 1));

        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX,
          fragmentShader: FRAGMENT,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          uniforms: {
            uTempo: { value: 0 },
            uMorph: { value: item.fragmentacao },
            uDestaque: { value: 0 },
            uCor: { value: new THREE.Color(item.cor) },
          },
        });

        const malha = new THREE.Mesh(geometria, material);
        // distribui em linha, ligeiramente escalonado em profundidade
        malha.position.x = (indice - (itens.length - 1) / 2) * 2.7;
        malha.position.z = -indice * 0.35;
        malha.scale.setScalar(1.05 - indice * 0.08);

        refMalhas.current.push(malha);
        cena.add(malha);
      });
    },

    aoQuadro: (_ctx, { tempo, delta, progresso, ponteiro }) => {
      refMalhas.current.forEach((malha, indice) => {
        const mat = malha.material as THREE.ShaderMaterial;
        mat.uniforms.uTempo.value = tempo;

        // hover aproxima suavemente de 1 ou 0
        const alvo = refDestacado.current === indice ? 1 : 0;
        mat.uniforms.uDestaque.value +=
          (alvo - mat.uniforms.uDestaque.value) * Math.min(delta * 6, 1);

        // rotação lenta + resposta ao ponteiro e ao scroll
        malha.rotation.y += delta * (0.16 + indice * 0.04);
        malha.rotation.x = ponteiro.y * 0.22 + progresso * 0.3;
        malha.rotation.z = ponteiro.x * 0.1;
      });
    },

    desmontar: () => {
      refMalhas.current = [];
    },
  });

  /** Rótulos em HTML: acessíveis, selecionáveis e sincronizados com o 3D. */
  const aoEntrar = useCallback((i: number) => setDestacado(i), []);
  const aoSair = useCallback(() => setDestacado(null), []);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={refContainer}
        aria-hidden
        className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          ativo ? "opacity-100" : "opacity-0"
        }`}
      />

      <ul className="relative grid grid-cols-1 gap-4 sm:grid-cols-3">
        {itens.map((item, i) => (
          <li key={item.rotulo}>
            <button
              type="button"
              onPointerEnter={() => aoEntrar(i)}
              onPointerLeave={aoSair}
              onFocus={() => aoEntrar(i)}
              onBlur={aoSair}
              aria-pressed={destacado === i}
              className={`w-full rounded-2xl border px-5 py-4 text-left transition-[border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                destacado === i
                  ? "border-accent/70 bg-white/[0.06]"
                  : "border-white/12 bg-white/[0.02]"
              }`}
            >
              <span className="block font-display text-[15px] font-semibold text-ink">
                {item.rotulo}
              </span>
              <span className="mt-1 block text-[12.5px] text-body">
                {item.fragmentacao < 0.34
                  ? "Material íntegro"
                  : item.fragmentacao < 0.7
                    ? "Fibra recuperada"
                    : "Fração irrecuperável"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
