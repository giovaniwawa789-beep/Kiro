/**
 * Mede o contraste real do texto contra o pixel de fundo renderizado.
 *
 * Não confia na cor declarada em CSS: tira um screenshot, lê o pixel atrás de
 * cada trecho de texto e calcula a razão WCAG. É o único jeito de validar
 * contraste sobre um gradiente animado.
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");

const BASE = "http://127.0.0.1:3100";

function luminancia({ r, g, b }) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function razao(a, b) {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function corDeTexto(css) {
  // canvas devolve "#rrggbb" ou "rgba(...)"
  if (css.startsWith("#")) {
    const h = css.slice(1);
    const n = h.length === 3 ? h.split("").map((c) => c + c) : h.match(/../g);
    const [r, g, b] = n.map((x) => parseInt(x, 16));
    return { r, g, b };
  }
  const m = css.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error("cor nao reconhecida: " + css);
  const [r, g, b] = m[1].split(/[,\s\/]+/).filter(Boolean).map(parseFloat);
  return { r, g, b };
}

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);

  const alvos = await page.evaluate(() => {
    const sels = [
      ["h1 (hero)", "h1"],
      ["parágrafo do hero", "section p.mt-8, section p.max-w-2xl"],
      ["pill de prova", "section ul li.glass"],
      ["nota pequena do hero", "section p:last-of-type"],
      ["rotulo de metrica", "section[aria-label] p.mt-4"],
      ["nota de metrica", "section[aria-label] p.mt-2"],
      ["texto de card", "#servicos li p"],
      ["rodape", "footer p"],
    ];
    const saida = [];
    for (const [nome, sel] of sels) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      // pinta a cor e le o pixel de volta: resolve oklab/color-mix para rgb.
      // Tailwind v4 emite oklab nos modificadores de opacidade (text-body/60).
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.fillRect(0, 0, 1, 1);
      const px = ctx.getImageData(0, 0, 1, 1).data;
      saida.push({
        nome,
        cor: `rgb(${px[0]}, ${px[1]}, ${px[2]})`,
        alfa: px[3] / 255,
        tamanho: parseFloat(getComputedStyle(el).fontSize),
        peso: getComputedStyle(el).fontWeight,
        x: Math.round(r.left + r.width / 2),
        y: Math.round(r.top + r.height / 2),
      });
    }
    return saida;
  });

  const buffer = await page.screenshot();
  const png = PNG.sync.read(buffer);

  console.log("contraste medido no pixel renderizado (fundo animado):\n");
  let falhas = 0;

  for (const a of alvos) {
    // amostra uma vizinhança e pega o pixel mais claro (pior caso p/ texto claro)
    let pior = null;
    for (let dx = -30; dx <= 30; dx += 10) {
      for (let dy = -6; dy <= 6; dy += 6) {
        const x = Math.min(png.width - 1, Math.max(0, a.x + dx));
        const y = Math.min(png.height - 1, Math.max(0, a.y + dy));
        const i = (png.width * y + x) << 2;
        const p = { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] };
        if (!pior || luminancia(p) > luminancia(pior)) pior = p;
      }
    }

    let texto = corDeTexto(a.cor);
    // Texto com opacidade precisa ser COMPOSTO sobre o fundo antes de medir:
    // ignorar o alfa superestima o contraste (o caso de text-body/60).
    const alfa = typeof a.alfa === "number" ? a.alfa : 1;
    if (alfa < 0.999) {
      texto = {
        r: alfa * texto.r + (1 - alfa) * pior.r,
        g: alfa * texto.g + (1 - alfa) * pior.g,
        b: alfa * texto.b + (1 - alfa) * pior.b,
      };
    }
    const r = razao(texto, pior);
    // AA: 4.5 para texto normal, 3.0 para texto grande (>=24px ou >=18.66px bold)
    const grande = a.tamanho >= 24 || (a.tamanho >= 18.66 && Number(a.peso) >= 700);
    const minimo = grande ? 3.0 : 4.5;
    const ok = r >= minimo;
    if (!ok) falhas++;
    console.log(
      `${ok ? "PASSA" : "FALHA"}  ${a.nome.padEnd(20)} ${r.toFixed(2)}:1  ` +
        `(mínimo ${minimo}, ${a.tamanho}px${grande ? " grande" : ""}` +
        `${alfa < 0.999 ? `, alfa ${alfa.toFixed(2)}` : ""})`,
    );
  }

  console.log(falhas ? `\n${falhas} falha(s) de contraste` : "\ntodos passam AA");
  await browser.close();
  process.exit(falhas ? 1 : 0);
})();
