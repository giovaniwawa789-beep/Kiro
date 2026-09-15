/**
 * Confirma que as camadas Three.js realmente desenham e que o texto por cima
 * mantém contraste AA.
 *
 * Metodologia do contraste: tira DOIS screenshots — um normal e outro com o
 * texto invisível (visibility:hidden). O segundo dá o fundo puro sob cada
 * trecho de texto. Medir no screenshot normal amostraria os próprios glifos e
 * daria 1:1, que foi o erro da primeira versão deste teste.
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

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const erros = [];
  page.on("pageerror", (e) => erros.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") erros.push(m.text());
  });

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const problemas = [];

  for (const secao of ["credibilidade", "consultoria"]) {
    // rola até a seção e dá tempo do chunk do three baixar e montar
    await page.evaluate((id) => {
      document.getElementById(id)?.scrollIntoView({ block: "center" });
    }, secao);
    await page.waitForTimeout(3500);

    /* Pior caso: o ponteiro acende a grade e injeta tinta no fluido. Varre a
       seção antes de medir, senão o teste mede um fundo mais escuro do que o
       usuário realmente vê. */
    for (const [mx, my] of [[300, 300], [700, 420], [1000, 560], [520, 650]]) {
      await page.mouse.move(mx, my);
      await page.waitForTimeout(180);
    }
    await page.waitForTimeout(400);

    const estado = await page.evaluate((id) => {
      const s = document.getElementById(id);
      const c = s?.querySelector("canvas");
      return {
        temCanvas: !!c,
        largura: c?.width ?? 0,
        altura: c?.height ?? 0,
        desenhou: (c?.width ?? 0) > 400,
        opacidadeCamada: c
          ? getComputedStyle(c.parentElement).opacity
          : "n/a",
      };
    }, secao);

    console.log(`[${secao}] ${JSON.stringify(estado)}`);
    if (!estado.temCanvas) problemas.push(`${secao}: canvas não montou`);
    else if (!estado.desenhou)
      problemas.push(`${secao}: canvas com tamanho default (não desenhou)`);

    /* ---- contraste: coleta posições + cores, depois esconde o texto ---- */
    const alvos = await page.evaluate((id) => {
      const s = document.getElementById(id);
      if (!s) return [];
      const sels = ["h2", "p", "dt", "dd", "h3", "legend", "label span"];
      const out = [];
      const vistos = new Set();
      for (const sel of sels) {
        for (const el of s.querySelectorAll(sel)) {
          const r = el.getBoundingClientRect();
          if (r.width < 30 || r.height < 8) continue;
          if (r.top < 0 || r.bottom > window.innerHeight) continue;
          const chave = sel + Math.round(r.top);
          if (vistos.has(chave)) continue;
          vistos.add(chave);

          const cv = document.createElement("canvas");
          cv.width = cv.height = 1;
          const ctx = cv.getContext("2d");
          ctx.fillStyle = getComputedStyle(el).color;
          ctx.fillRect(0, 0, 1, 1);
          const px = ctx.getImageData(0, 0, 1, 1).data;

          out.push({
            sel,
            texto: (el.textContent || "").slice(0, 22),
            cor: { r: px[0], g: px[1], b: px[2] },
            alfa: px[3] / 255,
            tam: parseFloat(getComputedStyle(el).fontSize),
            peso: Number(getComputedStyle(el).fontWeight),
            x: Math.round(r.left + r.width / 2),
            y: Math.round(r.top + r.height / 2),
          });
          if (out.length >= 14) return out;
        }
      }
      return out;
    }, secao);

    // esconde só o texto, mantendo o fundo (o canvas continua desenhando)
    await page.evaluate((id) => {
      const s = document.getElementById(id);
      s?.querySelectorAll("h2,h3,p,dt,dd,legend,span,a,button").forEach((el) => {
        el.style.visibility = "hidden";
      });
    }, secao);
    await page.mouse.move(700, 430);
    await page.waitForTimeout(250);
    await page.mouse.move(760, 470);
    await page.waitForTimeout(250);

    const png = PNG.sync.read(await page.screenshot());

    // restaura
    await page.evaluate((id) => {
      const s = document.getElementById(id);
      s?.querySelectorAll("h2,h3,p,dt,dd,legend,span,a,button").forEach((el) => {
        el.style.visibility = "";
      });
    }, secao);

    for (const a of alvos) {
      let pior = null;
      for (let dx = -50; dx <= 50; dx += 10) {
        for (let dy = -6; dy <= 6; dy += 6) {
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
      const ok = r >= min;
      if (!ok)
        problemas.push(
          `${secao}: "${a.texto}" ${r.toFixed(2)}:1 (mín ${min})`,
        );
      console.log(
        `  ${ok ? "PASSA" : "FALHA"} ${a.sel.padEnd(10)} ${r.toFixed(2)}:1  "${a.texto}"`,
      );
    }
  }

  console.log("\nerros de console:", erros.length ? erros : "nenhum");
  console.log(
    problemas.length ? "PROBLEMAS:\n- " + problemas.join("\n- ") : "tudo ok",
  );

  await browser.close();
  process.exit(problemas.length ? 1 : 0);
})();
