/**
 * Contraste medido do jeito certo: esconde o texto e amostra o FUNDO.
 *
 * O contraste.js antigo amostrava o pixel na posição do texto e, em texto claro
 * sobre bloco sólido, acabava lendo o próprio glifo — daí os "1.00:1", que são
 * artefato de medição, não falha real. Aqui: coleta cor e posição, esconde só o
 * texto (visibility:hidden preserva o layout), tira o screenshot do fundo e
 * então compara.
 */
const { chromium } = require("playwright");
const { PNG } = require("pngjs");

const BASE = "http://127.0.0.1:3100";
const CHROME = "/opt/playwright/chromium-1148/chrome-linux/chrome";

function lum({ r, g, b }) {
  const f = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
const razao = (a, b) =>
  (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);

const ALVOS = [
  ["título do card de serviço", "#servicos li p"],
  ["'Saiba mais'", "#servicos li span.font-bold"],
  ["número de impacto", "#impactos dt"],
  ["legenda de impacto", "#impactos dd"],
  ["etapa da destinação", "#destinacao h3"],
  ["texto da destinação", "#destinacao li p"],
  ["cliente em Quem confia", "section li.font-display"],
  ["resultado do caso", "#projetos li p.text-verde"],
  ["texto do rodapé", "footer p"],
  ["link do rodapé", "footer a"],
  ["CTA final", "#contato-cta h2"],
  ["apoio do CTA", "#contato-cta p"],
];

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 2200 } });
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  // revela tudo e desliga animação, para medir o estado final
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    await new Promise((r) => {
      let y = 0;
      const s = () => {
        y += 700;
        scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(s, 40);
        else setTimeout(r, 700);
      };
      s();
    });
    scrollTo(0, 0);
  });
  await page.waitForTimeout(600);

  const coletados = await page.evaluate((alvos) => {
    const out = [];
    for (const [nome, sel] of alvos) {
      const el = document.querySelector(sel);
      if (!el) {
        out.push({ nome, ausente: true });
        continue;
      }
      el.scrollIntoView({ block: "center", behavior: "instant" });
      const r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 6) {
        out.push({ nome, ausente: true });
        continue;
      }
      const cv = document.createElement("canvas");
      cv.width = cv.height = 1;
      const ctx = cv.getContext("2d");
      ctx.fillStyle = getComputedStyle(el).color;
      ctx.fillRect(0, 0, 1, 1);
      const px = ctx.getImageData(0, 0, 1, 1).data;
      out.push({
        nome,
        sel,
        cor: { r: px[0], g: px[1], b: px[2] },
        alfa: px[3] / 255,
        tam: parseFloat(getComputedStyle(el).fontSize),
        peso: Number(getComputedStyle(el).fontWeight),
        scrollY: Math.round(window.scrollY),
        x: Math.round(r.left + r.width / 2),
        y: Math.round(r.top + r.height / 2),
      });
    }
    return out;
  }, ALVOS);

  let falhas = 0;

  for (const a of coletados) {
    if (a.ausente) {
      console.log(`  n/d   ${a.nome} (seletor não encontrou elemento visível)`);
      continue;
    }

    await page.evaluate((y) => window.scrollTo(0, y), a.scrollY);
    await page.waitForTimeout(180);

    /* Apaga só os GLIFOS, com color:transparent. visibility:hidden em <li>
       escondia o próprio cartão índigo e o fundo medido virava o branco da
       página — falso 1.00:1. */
    await page.evaluate(() => {
      document.querySelectorAll("*").forEach((el) => {
        el.dataset.cor = el.style.color;
        el.style.color = "transparent";
      });
    });
    await page.waitForTimeout(120);
    const png = PNG.sync.read(await page.screenshot());
    await page.evaluate(() => {
      document.querySelectorAll("*").forEach((el) => {
        el.style.color = el.dataset.cor || "";
        delete el.dataset.cor;
      });
    });

    let pior = null;
    for (let dx = -40; dx <= 40; dx += 8) {
      for (let dy = -5; dy <= 5; dy += 5) {
        const x = Math.min(png.width - 1, Math.max(0, a.x + dx));
        const y = Math.min(png.height - 1, Math.max(0, a.y + dy));
        const i = (png.width * y + x) << 2;
        const p = { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] };
        // pior caso = fundo com luminância mais próxima da do texto
        if (
          !pior ||
          Math.abs(lum(p) - lum(a.cor)) < Math.abs(lum(pior) - lum(a.cor))
        ) {
          pior = p;
        }
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
    const ok = r >= min;
    if (!ok) falhas++;
    console.log(
      `  ${ok ? "PASSA" : "FALHA"} ${a.nome.padEnd(26)} ${r.toFixed(2)}:1  (mín ${min}, ${a.tam}px, fundo rgb(${pior.r},${pior.g},${pior.b}))`,
    );
  }

  console.log(falhas ? `\n${falhas} falha(s) real(is)` : "\ntodos passam AA");
  await browser.close();
  process.exit(falhas ? 1 : 0);
})();
