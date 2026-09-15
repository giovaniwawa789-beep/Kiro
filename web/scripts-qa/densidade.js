/**
 * Diff decisivo: a camada 3D pinta pixels? E onde?
 *
 * Compara o screenshot do viewport com a camada visível contra o mesmo
 * screenshot com a camada em visibility:hidden, pixel a pixel. Reporta quantos
 * pixels mudaram, o delta máximo e a caixa que envolve as mudanças. Também
 * salva um mapa de diferença amplificado, para inspeção visual.
 *
 * Isso substitui heurísticas frágeis ("canvas.width > 400", média de luminância
 * numa faixa escolhida a dedo") que passaram enquanto a camada estava invisível.
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");
const fs = require("fs");

const BASE = "http://127.0.0.1:3100";
const CHROME = "/opt/playwright/chromium-1148/chrome-linux/chrome";
const SECAO = process.argv[2] || "credibilidade";

(async () => {
  const b = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const logs = [];
  p.on("console", (m) => {
    if (m.type() === "error") logs.push(m.text());
  });
  p.on("pageerror", (e) => logs.push("pageerror: " + e.message));

  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.evaluate((id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo(0, el.offsetTop);
  }, SECAO);
  await p.waitForTimeout(4500);

  const info = await p.evaluate((id) => {
    const s = document.getElementById(id);
    const c = s?.querySelector("canvas");
    return {
      temCanvas: !!c,
      dim: c ? `${c.width}x${c.height}` : null,
      opacidadePai: c ? getComputedStyle(c.parentElement).opacity : null,
      scrollY: Math.round(window.scrollY),
      topoSecao: s ? Math.round(s.getBoundingClientRect().top) : null,
    };
  }, SECAO);
  console.log(`[${SECAO}]`, JSON.stringify(info));

  /* O fluido é efeito de hover: sem ponteiro não injeta tinta e o diff daria
     zero por comportamento correto, não por bug. Varre a seção antes de medir. */
  for (const [mx, my] of [[300, 300], [620, 380], [900, 480], [1100, 600], [700, 700]]) {
    await p.mouse.move(mx, my);
    await p.waitForTimeout(140);
  }
  await p.mouse.move(760, 470);
  await p.waitForTimeout(200);

  const bufCom = await p.screenshot();

  await p.evaluate((id) => {
    document
      .querySelectorAll(`#${id} canvas`)
      .forEach((c) => (c.style.visibility = "hidden"));
  }, SECAO);
  await p.mouse.move(760, 470);
  await p.waitForTimeout(500);
  const bufSem = await p.screenshot();

  const a = PNG.sync.read(bufCom);
  const z = PNG.sync.read(bufSem);

  let mudados = 0;
  let maxDelta = 0;
  let minX = 1e9;
  let maxX = -1;
  let minY = 1e9;
  let maxY = -1;
  const mapa = new PNG({ width: a.width, height: a.height });

  for (let y = 0; y < a.height; y++) {
    for (let x = 0; x < a.width; x++) {
      const i = (a.width * y + x) << 2;
      const d =
        Math.abs(a.data[i] - z.data[i]) +
        Math.abs(a.data[i + 1] - z.data[i + 1]) +
        Math.abs(a.data[i + 2] - z.data[i + 2]);
      if (d > maxDelta) maxDelta = d;
      if (d > 3) {
        mudados++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      // amplifica 12x para o mapa ficar visível
      const v = Math.min(255, d * 12);
      mapa.data[i] = v;
      mapa.data[i + 1] = v;
      mapa.data[i + 2] = v;
      mapa.data[i + 3] = 255;
    }
  }

  const total = a.width * a.height;
  console.log(
    `pixels alterados pela camada: ${mudados} (${((100 * mudados) / total).toFixed(2)}%)`,
  );
  console.log(`delta máximo (soma RGB): ${maxDelta}`);
  console.log(
    mudados
      ? `caixa das mudanças: x ${minX}-${maxX}, y ${minY}-${maxY}`
      : "caixa: nenhuma mudança",
  );
  if (logs.length) console.log("erros:", logs.slice(0, 4));

  fs.writeFileSync(
    `/projects/sandbox/Kiro/web/preview/diff_${SECAO}.png`,
    PNG.sync.write(mapa),
  );
  console.log(`mapa de diferença salvo em preview/diff_${SECAO}.png`);

  await b.close();
  process.exit(mudados < 500 ? 1 : 0);
})();
