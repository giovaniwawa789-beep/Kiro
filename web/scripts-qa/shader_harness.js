/**
 * Verifica o SHADER isoladamente, separado do guardrail do site.
 *
 * Por que separar: no site o componente recusa contexto WebGL em rasterizador
 * de software (failIfMajorPerformanceCaveat), que é o comportamento correto em
 * produção — mas impede ver o shader neste sandbox sem GPU. Aqui eu monto uma
 * página mínima com o MESMO shader, sem o guardrail, e valido duas coisas:
 *
 *   1. o shader compila e desenha (nada de tela preta);
 *   2. o véu de contraste funciona: mede a luminância MÁXIMA do fundo na área
 *      onde o texto do hero fica e calcula a razão WCAG contra as cores reais
 *      de texto. Valida o véu direto na fonte, sem depender de screenshot com
 *      glifos por cima.
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const fs = require("fs");
const path = require("path");

const SHADER = path.resolve(
  __dirname,
  "../Kiro/web/src/components/webgl/fiberShader.ts",
);

/** Cores de texto do tema (tokens em globals.css). */
const TEXTOS = [
  { nome: "ink (títulos)", cor: { r: 0xf4, g: 0xf7, b: 0xf5 }, min: 3.0 },
  { nome: "body (corpo)", cor: { r: 0x9b, g: 0xa8, b: 0xa1 }, min: 4.5 },
];

function lum({ r, g, b }) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const razao = (a, b) =>
  (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

/** Extrai as duas template literals do módulo TS, sem precisar compilá-lo. */
function extraiShaders() {
  const src = fs.readFileSync(SHADER, "utf8");
  const pega = (nome) => {
    const i = src.indexOf(`export const ${nome}`);
    if (i < 0) throw new Error("nao achei " + nome);
    const abre = src.indexOf("`", i);
    const fecha = src.indexOf("`", abre + 1);
    return src.slice(abre + 1, fecha);
  };
  return { vertex: pega("VERTEX"), fragment: pega("FRAGMENT") };
}

(async () => {
  const { vertex, fragment } = extraiShaders();
  console.log(
    `shader lido: vertex ${vertex.length} chars, fragment ${fragment.length} chars`,
  );

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>html,body{margin:0;background:#070B09;overflow:hidden}canvas{display:block;width:100vw;height:100vh}</style>
</head><body><canvas id="c"></canvas><script>
const gl = document.getElementById("c").getContext("webgl", { alpha:false, antialias:false, depth:false });
window.__erro = null;
function comp(t, s){ const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh);
  if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)){ window.__erro = gl.getShaderInfoLog(sh); return null; } return sh; }
const vs = comp(gl.VERTEX_SHADER, ${JSON.stringify(vertex)});
const fs2 = comp(gl.FRAGMENT_SHADER, ${JSON.stringify(fragment)});
if (vs && fs2) {
  const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs2); gl.linkProgram(p);
  if(!gl.getProgramParameter(p, gl.LINK_STATUS)) window.__erro = gl.getProgramInfoLog(p);
  else {
    gl.useProgram(p);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, "aPos"); gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const c = document.getElementById("c");
    c.width = 1440; c.height = 900; gl.viewport(0,0,1440,900);
    gl.uniform2f(gl.getUniformLocation(p,"uRes"), 1440, 900);
    gl.uniform1f(gl.getUniformLocation(p,"uTime"), 14.0);
    gl.uniform1f(gl.getUniformLocation(p,"uFlow"), 1.0);
    gl.uniform1f(gl.getUniformLocation(p,"uScroll"), 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    window.__ok = true;
  }
}
</script></body></html>`;

  const browser = await chromium.launch({
    executablePath: "/opt/playwright/chromium-1148/chrome-linux/chrome",
    args: ["--no-sandbox", "--enable-unsafe-swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForTimeout(2500);

  const estado = await page.evaluate(() => ({
    ok: window.__ok === true,
    erro: window.__erro,
  }));

  if (estado.erro) {
    console.log("ERRO DE COMPILACAO:\n" + estado.erro);
    await browser.close();
    process.exit(1);
  }
  console.log("shader compilou e desenhou:", estado.ok);

  const buf = await page.screenshot();
  const png = PNG.sync.read(buf);

  // a imagem é toda preta? (shader compilou mas não pintou)
  let somaLum = 0;
  let maxGlobal = 0;
  for (let i = 0; i < png.data.length; i += 4) {
    const l = lum({ r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] });
    somaLum += l;
    if (l > maxGlobal) maxGlobal = l;
  }
  const mediaLum = somaLum / (png.data.length / 4);
  console.log(
    `luminância média ${mediaLum.toFixed(4)} · máxima ${maxGlobal.toFixed(4)}`,
  );
  if (maxGlobal < 0.004) {
    console.log("FALHA: saída praticamente preta — o shader não está pintando");
    await browser.close();
    process.exit(1);
  }

  /* Região onde o texto do hero vive: coluna esquerda, do topo até ~72%.
     Mede o PIOR caso (pixel mais claro) para o contraste.               */
  const x0 = 0;
  const x1 = Math.floor(png.width * 0.62);
  const y0 = Math.floor(png.height * 0.1);
  const y1 = Math.floor(png.height * 0.72);

  let piorPixel = null;
  for (let y = y0; y < y1; y += 2) {
    for (let x = x0; x < x1; x += 2) {
      const i = (png.width * y + x) << 2;
      const p = { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] };
      if (!piorPixel || lum(p) > lum(piorPixel)) piorPixel = p;
    }
  }

  console.log(
    `\npixel mais claro sob o texto: rgb(${piorPixel.r},${piorPixel.g},${piorPixel.b})`,
  );
  console.log("contraste no pior caso do fundo do shader:");

  let falhas = 0;
  for (const t of TEXTOS) {
    const r = razao(t.cor, piorPixel);
    const ok = r >= t.min;
    if (!ok) falhas++;
    console.log(
      `${ok ? "PASSA" : "FALHA"}  ${t.nome.padEnd(18)} ${r.toFixed(2)}:1 (mín ${t.min})`,
    );
  }

  fs.writeFileSync("/projects/sandbox/Kiro/web/preview/shader_raw.png", buf);
  console.log("\nsaída do shader salva em web/preview/shader_raw.png");

  await browser.close();
  process.exit(falhas ? 1 : 0);
})();
