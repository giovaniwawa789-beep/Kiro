const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({
    executablePath: "/opt/playwright/chromium-1148/chrome-linux/chrome",
    args: ["--no-sandbox"] });
  const p = await b.newPage({ viewport: { width: 375, height: 812 } });
  await p.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  const culpados = await p.evaluate(() => {
    const larguraDoc = document.documentElement.clientWidth;
    /* Um elemento só empurra o documento se NENHUM ancestral recortar o eixo X.
       Filtrar por isso elimina os falsos positivos de dentro do carrossel. */
    const recortado = (el) => {
      /* Para ANTES do body: o body tem overflow-x hidden, então incluí-lo na
         busca marcava todo elemento como recortado e escondia o culpado. */
      let a = el.parentElement;
      while (a && a !== document.body && a !== document.documentElement) {
        const ox = getComputedStyle(a).overflowX;
        if (ox === "hidden" || ox === "auto" || ox === "scroll" || ox === "clip") return true;
        a = a.parentElement;
      }
      return false;
    };
    const fora = [];
    document.querySelectorAll("*").forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      if (r.right <= larguraDoc + 1 && r.left >= -1) return;
      if (recortado(el)) return;
      fora.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 80),
        left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
        txt: (el.textContent || "").trim().slice(0, 40),
      });
    });
    return { larguraDoc, scrollW: document.documentElement.scrollWidth, quantos: fora.length, fora: fora.slice(0, 8) };
  });
  console.log(JSON.stringify(culpados, null, 1));
  await b.close();
})();
