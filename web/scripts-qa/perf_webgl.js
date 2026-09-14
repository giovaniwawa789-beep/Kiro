/**
 * Mede o custo real do shader: FPS sustentado, se o canvas realmente inicializou
 * e o contraste do texto sobre o novo fundo (lendo o pixel renderizado).
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");

const BASE = "http://127.0.0.1:3100";

function lum({ r, g, b }) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const razao = (a, b) =>
  (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/playwright/chromium-1148/chrome-linux/chrome",
    args: ["--no-sandbox", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);

  // o canvas WebGL inicializou?
  const canvas = await page.evaluate(() => {
    const c = document.querySelector("section canvas");
    if (!c) return { existe: false };
    return {
      existe: true,
      opacidade: getComputedStyle(c).opacity,
      largura: c.width,
      altura: c.height,
      // um canvas que nunca desenhou fica com width/height default 300x150
      desenhou: c.width > 400,
    };
  });
  console.log("canvas:", JSON.stringify(canvas));

  // FPS sustentado por 3 segundos
  const fps = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let quadros = 0;
        const inicio = performance.now();
        const conta = () => {
          quadros++;
          if (performance.now() - inicio < 3000) requestAnimationFrame(conta);
          else resolve(Math.round((quadros / (performance.now() - inicio)) * 1000));
        };
        requestAnimationFrame(conta);
      }),
  );
  console.log(`FPS sustentado (3s, software rasterizer): ${fps}`);

  // long tasks: indício de travamento na thread principal
  const longTasks = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const lista = [];
        try {
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) lista.push(Math.round(e.duration));
          }).observe({ entryTypes: ["longtask"] });
        } catch {
          return resolve("nao suportado");
        }
        setTimeout(() => resolve(lista), 2500);
      }),
  );
  console.log("long tasks (ms):", JSON.stringify(longTasks));

  // contraste sobre o fundo novo
  const alvos = await page.evaluate(() => {
    const sels = [
      ["h1 do hero", "h1"],
      ["parágrafo do hero", "section p.mt-8"],
      ["nota do hero", "section p:last-of-type"],
      ["pill de prova", "section ul li.glass"],
    ];
    const out = [];
    for (const [nome, sel] of sels) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4) continue;
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.fillRect(0, 0, 1, 1);
      const px = ctx.getImageData(0, 0, 1, 1).data;
      out.push({
        nome,
        cor: { r: px[0], g: px[1], b: px[2] },
        alfa: px[3] / 255,
        tam: parseFloat(getComputedStyle(el).fontSize),
        peso: Number(getComputedStyle(el).fontWeight),
        x: Math.round(r.left + r.width / 2),
        y: Math.round(r.top + r.height / 2),
      });
    }
    return out;
  });

  const png = PNG.sync.read(await page.screenshot());
  console.log("\ncontraste sobre o shader:");
  let falhas = 0;

  for (const a of alvos) {
    let pior = null;
    for (let dx = -40; dx <= 40; dx += 10) {
      for (let dy = -8; dy <= 8; dy += 8) {
        const x = Math.min(png.width - 1, Math.max(0, a.x + dx));
        const y = Math.min(png.height - 1, Math.max(0, a.y + dy));
        const i = (png.width * y + x) << 2;
        const p = { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] };
        if (!pior || lum(p) > lum(pior)) pior = p;
      }
    }
    let cor = a.cor;
    if (a.alfa < 0.999) {
      cor = {
        r: a.alfa * cor.r + (1 - a.alfa) * pior.r,
        g: a.alfa * cor.g + (1 - a.alfa) * pior.g,
        b: a.alfa * cor.b + (1 - a.alfa) * pior.b,
      };
    }
    const r = razao(cor, pior);
    const grande = a.tam >= 24 || (a.tam >= 18.66 && a.peso >= 700);
    const min = grande ? 3.0 : 4.5;
    if (r < min) falhas++;
    console.log(
      `${r >= min ? "PASSA" : "FALHA"}  ${a.nome.padEnd(20)} ${r.toFixed(2)}:1 (mín ${min})`,
    );
  }

  console.log("\nerros de console:", erros.length ? erros : "nenhum");
  console.log(falhas ? `${falhas} falha(s) de contraste` : "contraste AA ok");

  await page.screenshot({ path: "/projects/sandbox/Kiro/web/preview/webgl_hero.png" });
  await browser.close();
  process.exit(falhas ? 1 : 0);
})();
