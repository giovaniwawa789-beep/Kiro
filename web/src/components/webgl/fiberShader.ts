/**
 * Shader do hero — "seda líquida sob vidro".
 *
 * Três sistemas combinados, todos num único fullscreen quad:
 *   1. distorção líquida orgânica  — domain warping iterativo com fluxo temporal
 *   2. refração de vidro           — normal a partir de campo de altura, offset
 *                                    de UV por IOR, dispersão cromática e Fresnel
 *   3. iluminação cinematográfica  — key light especular, rim light e feixe suave
 *
 * Escrito em GLSL ES 1.0 (contexto "webgl", não "webgl2") de propósito:
 * suporte máximo, inclusive Android antigo e Safari mais velho.
 *
 * ATENÇÃO ao editar: nada de crase nos comentários. Este arquivo é uma
 * template literal de TypeScript e a crase a encerra no meio do shader.
 */

export const VERTEX = /* glsl */ `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

export const FRAGMENT = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
/** 0 = campo congelado (reduced-motion), 1 = fluxo normal. */
uniform float uFlow;
/** 0..1 de progresso do scroll no hero: faz a dolly de câmera. */
uniform float uScroll;

/* paleta vinda dos tokens da marca */
const vec3 BASE    = vec3(0.027, 0.043, 0.035); // #070B09
const vec3 PRIMARY = vec3(0.071, 0.718, 0.416); // #12B76A
const vec3 TEAL    = vec3(0.055, 0.455, 0.565); // #0E7490
const vec3 ACCENT  = vec3(0.639, 0.902, 0.208); // #A3E635

/* direção da luz principal, em espaço de tela */
const vec3 LUZ = vec3(-0.42, 0.72, 0.55);

/* ============================ ruído ============================ */
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

/* =================== 1. distorção líquida =====================
   Domain warping em dois níveis. O primeiro deforma o espaço, o
   segundo deforma a deformação: é isso que dá caimento de líquido
   em vez de gradiente deslizando.                                */
vec2 liquido(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.08)),
                fbm(p + vec2(4.3, 1.7 - t * 0.06)));
  vec2 r = vec2(fbm(p + 2.4 * q + vec2(1.7, 9.2)),
                fbm(p + 2.4 * q + vec2(8.3, 2.8)));
  return p + 0.55 * r;
}

/* Campo de altura: os filamentos de seda.
   A anisotropia (x comprimido) transforma manchas em fios longos,
   que é a leitura certa para uma empresa de resíduo têxtil.        */
float altura(vec2 p, float t) {
  vec2 w = liquido(p * 1.15, t);

  float f1 = sin((w.y * 2.6 + fbm(w * 1.8) * 3.4) * 3.14159);
  float f2 = sin((w.y * 4.1 + fbm(w * 2.6 + 2.1) * 3.0 + 1.3) * 3.14159);

  float fios = smoothstep(0.55, 1.0, abs(f1)) * 0.65
             + smoothstep(0.70, 1.0, abs(f2)) * 0.35;

  return fios;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);

  float t = uTime * uFlow;

  /* dolly de câmera: o campo recua e desloca conforme o scroll.
     Só multiplicação de coordenada, sem custo extra de amostragem. */
  float zoom = 1.0 + uScroll * 0.55;
  p *= zoom;
  p += vec2(t * 0.010, t * -0.005) + vec2(0.0, uScroll * 0.30);
  p.x *= 0.34; // anisotropia -> filamentos

  /* ================ campo de altura + normal ================= */
  float e = 0.0022;
  float h  = altura(p, t);
  float hx = altura(p + vec2(e, 0.0), t);
  float hy = altura(p + vec2(0.0, e), t);

  /* normal do relevo: a base da refração e da luz */
  vec3 n = normalize(vec3((hx - h) / e, (hy - h) / e, 1.6));

  /* ================ 2. refração de vidro ==================== */
  /* A normal desvia a coordenada de amostragem, como uma lâmina de
     vidro sobre o tecido. Cada canal desvia um pouco diferente:
     é a dispersão cromática que vende a leitura de vidro.         */
  float ior = 0.055;
  vec2 desvio = n.xy * ior;

  float cR = altura(p + desvio * 1.00, t);
  float cG = altura(p + desvio * 0.93, t);
  float cB = altura(p + desvio * 0.86, t);

  vec3 tecido = PRIMARY * cG * 0.20
              + TEAL    * cB * 0.15
              + ACCENT  * cR * 0.04;

  /* Fresnel: borda do relevo acende, como canto de vidro */
  float fresnel = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.2);

  /* =============== 3. iluminação cinematográfica ============== */
  vec3 L = normalize(LUZ);
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);

  float difusa   = clamp(dot(n, L), 0.0, 1.0);
  float especular = pow(clamp(dot(n, H), 0.0, 1.0), 42.0);
  /* rim light: contorna o relevo pelo lado oposto à key light */
  float rim = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 3.0)
            * clamp(dot(n, -L) * 0.5 + 0.5, 0.0, 1.0);

  vec3 cor = BASE;
  cor += tecido * (0.45 + 0.55 * difusa);
  cor += vec3(0.85, 1.0, 0.92) * especular * 0.13;   // brilho de seda
  cor += TEAL * rim * 0.12;                           // contorno frio
  cor += ACCENT * fresnel * 0.04;                     // canto de vidro

  /* feixe de luz suave descendo pela esquerda, onde o título respira */
  vec2 fp = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  float feixe = exp(-abs(fp.x * 1.15 + fp.y * 0.45 + 0.30) * 2.6);
  cor += vec3(0.60, 0.95, 0.78) * feixe * 0.045;

  /* halo difuso atrás do texto */
  float halo = exp(-length(fp - vec2(-0.28, 0.22)) * 1.7);
  cor += PRIMARY * halo * 0.07;

  /* ============ véu de contraste (não é estética) ============
     Sem ele o texto do hero cai abaixo de 4.5:1 sobre os
     filamentos claros. Medido, não estimado.                    */
  float veu = smoothstep(0.05, 0.95, uv.y);
  cor = mix(cor * 0.34, cor, 0.50 + 0.50 * (1.0 - veu));

  /* rampa horizontal: esquerda funda (texto), direita respira */
  float col = smoothstep(0.02, 0.72, uv.x);
  cor *= mix(0.30, 1.0, col);

  cor *= 0.62;

  /* vinheta cinematográfica */
  cor *= 1.0 - 0.38 * smoothstep(0.42, 1.30, length(fp));

  /* grão: quebra o banding em telas de 8 bits */
  cor += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.020;

  gl_FragColor = vec4(cor, 1.0);
}
`;
