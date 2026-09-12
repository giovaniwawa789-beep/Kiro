const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const BASE = "http://127.0.0.1:3100";
const OUT = path.resolve(__dirname, "../Kiro/web/preview");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { w: 375, h: 812, n: "375" },
  { w: 768, h: 1024, n: "768" },
  { w: 1440, h: 900, n: "1440" },
  { w: 1920, h: 1080, n: "1920" },
];

const ROTAS = [
  { url: "/", nome: "home" },
  { url: "/servicos/pgrs-plano-gerenciamento-residuos-solidos", nome: "servico" },
  { url: "/sobre", nome: "sobre" },
  { url: "/contato", nome: "contato" },
];

(async () => {
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const problemas = [];

  // ---------- responsivo da home ----------
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
    page.on("console", (m) => {
      if (m.type() === "error") problemas.push(`[${vp.n}] console: ${m.text()}`);
    });
    page.on("pageerror", (e) => problemas.push(`[${vp.n}] pageerror: ${e.message}`));
    page.on("requestfailed", (r) =>
      problemas.push(`[${vp.n}] falhou: ${r.url().replace(BASE, "")}`),
    );

    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(OUT, `home_${vp.n}_hero.png`) });

    // rola até o fim para disparar os reveals
    await page.evaluate(async () => {
      await new Promise((r) => {
        let y = 0;
        const passo = () => {
          y += 500;
          window.scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(passo, 60);
          else setTimeout(r, 900);
        };
        passo();
      });
    });

    const m = await page.evaluate(() => ({
      overflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      imgsQuebradas: [...document.querySelectorAll("img")].filter(
        (i) => i.complete && i.naturalWidth === 0,
      ).length,
      semAlt: [...document.querySelectorAll("img")].filter(
        (i) => i.getAttribute("alt") === null,
      ).length,
      h1: document.querySelectorAll("h1").length,
      invisiveis: [...document.querySelectorAll("section")].filter((s) => {
        const cs = getComputedStyle(s);
        return cs.opacity === "0";
      }).length,
    }));

    console.log(
      `${vp.n.padEnd(5)} overflow:${String(m.overflow).padEnd(4)} imgs quebradas:${m.imgsQuebradas}  sem alt:${m.semAlt}  h1:${m.h1}  secoes invisiveis:${m.invisiveis}`,
    );
    if (m.overflow > 0) problemas.push(`[${vp.n}] overflow horizontal de ${m.overflow}px`);
    if (m.invisiveis > 0) problemas.push(`[${vp.n}] ${m.invisiveis} secoes em opacity 0`);
    await page.close();
  }

  // ---------- páginas internas em 1440 ----------
  for (const rota of ROTAS) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on("pageerror", (e) => problemas.push(`[${rota.nome}] pageerror: ${e.message}`));
    const resp = await page.goto(BASE + rota.url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(800);
    console.log(`${rota.nome.padEnd(9)} status ${resp.status()}  titulo: ${await page.title()}`);
    if (resp.status() !== 200) problemas.push(`[${rota.nome}] status ${resp.status()}`);
    await page.screenshot({ path: path.join(OUT, `${rota.nome}_1440.png`) });
    await page.close();
  }

  // ---------- teclado no accordion ----------
  const kb = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await kb.goto(BASE + "/#faq", { waitUntil: "networkidle" });
  await kb.waitForTimeout(600);
  const botao = kb.locator("#faq button").first();
  await botao.focus();
  const antes = await botao.getAttribute("aria-expanded");
  await kb.keyboard.press("Enter");
  await kb.waitForTimeout(400);
  const depois = await botao.getAttribute("aria-expanded");
  console.log(`accordion   teclado: aria-expanded ${antes} -> ${depois}`);
  if (antes === depois) problemas.push("accordion nao alterna por teclado");
  await kb.close();

  // ---------- reduced motion ----------
  const rm = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  await rm.goto(BASE + "/", { waitUntil: "networkidle" });
  await rm.waitForTimeout(700);
  const rmOk = await rm.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).opacity : "0";
  });
  console.log(`reduced-motion  h1 opacity: ${rmOk}`);
  if (rmOk === "0") problemas.push("h1 invisivel com prefers-reduced-motion");
  await rm.close();

  console.log("\n" + (problemas.length ? "PROBLEMAS:\n- " + problemas.join("\n- ") : "nenhum problema"));
  await browser.close();
})();
