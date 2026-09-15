const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({
    executablePath: "/opt/playwright/chromium-1148/chrome-linux/chrome",
    args: ["--no-sandbox"] });
  const p = await b.newPage({ viewport: { width: 375, height: 812 } });
  await p.goto("http://127.0.0.1:3100/", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);

  const r = await p.evaluate(() => {
    const base = document.documentElement.scrollWidth;
    const alvos = [...document.querySelectorAll("body > *, main > *")];
    const saida = [];
    for (const el of alvos) {
      const antes = el.style.display;
      el.style.display = "none";
      const agora = document.documentElement.scrollWidth;
      el.style.display = antes;
      if (agora < base) {
        saida.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || "(sem id)",
          cls: (el.className || "").toString().slice(0, 60),
          scrollWSemEle: agora,
        });
      }
    }
    return { base, clientW: document.documentElement.clientWidth, culpados: saida };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
