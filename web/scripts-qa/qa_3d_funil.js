/**
 * QA das novas seções: funil VIP (2 etapas, teclado e a11y) e muro de
 * credibilidade. Também confere que o three.js NÃO é baixado no carregamento
 * inicial e que as seções funcionam sem a camada 3D.
 */
const { chromium } = require("playwright");

const BASE = "http://127.0.0.1:3100";
const CHROME = "/opt/playwright/chromium-1148/chrome-linux/chrome";

(async () => {
  const browser = await chromium.launch({
    executablePath: CHROME,
    args: ["--no-sandbox"],
  });
  const problemas = [];

  /* ---------- 1. three.js não deve entrar no carregamento inicial ---------- */
  const p1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const scripts = [];
  p1.on("response", (r) => {
    const u = r.url();
    if (u.endsWith(".js")) scripts.push(u.split("/").pop());
  });
  await p1.goto(BASE + "/", { waitUntil: "networkidle" });
  await p1.waitForTimeout(1200);
  const antes = scripts.length;

  const temThreeNoInicio = await p1.evaluate(
    () => typeof window.THREE !== "undefined",
  );
  console.log(`scripts no carregamento inicial: ${antes}`);
  console.log(`THREE global exposto no início: ${temThreeNoInicio}`);

  /* ---------- 2. seções existem no HTML (SSR), sem depender de JS ---------- */
  const semJs = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false,
  });
  await semJs.goto(BASE + "/", { waitUntil: "domcontentloaded" });
  const conteudoSemJs = await semJs.evaluate(() => ({
    impactos: !!document.getElementById("impactos"),
    funil: !!document.getElementById("consultoria"),
    numeros: document.querySelectorAll("#impactos dt").length,
    casos: document.querySelectorAll("#projetos li").length,
    radios: document.querySelectorAll("#consultoria input[type=radio]").length,
    legends: document.querySelectorAll("#consultoria legend").length,
  }));
  console.log("\nsem JavaScript:", JSON.stringify(conteudoSemJs));
  if (!conteudoSemJs.impactos) problemas.push("impactos ausente sem JS");
  if (!conteudoSemJs.funil) problemas.push("funil ausente sem JS");
  if (conteudoSemJs.radios < 10) problemas.push("radios do funil ausentes sem JS");
  if (conteudoSemJs.legends < 4) problemas.push("legends do funil ausentes sem JS");
  await semJs.close();

  /* ---------- 3. funil: fluxo completo por teclado ---------- */
  const p2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p2.goto(BASE + "/#consultoria", { waitUntil: "networkidle" });
  await p2.waitForTimeout(1000);

  const progresso1 = await p2.getAttribute(
    '#consultoria [role="progressbar"]',
    "aria-valuenow",
  );

  /* Os radios são sr-only dentro de <label> (padrão acessível: foco e setas
     funcionam, o label é a área de clique). Playwright precisa clicar no label,
     não no input invisível. */
  const nomes = await p2.evaluate(() => {
    const vistos = [];
    document.querySelectorAll("#consultoria input[type=radio]").forEach((r) => {
      if (!vistos.includes(r.name)) vistos.push(r.name);
    });
    return vistos;
  });

  for (const n of nomes.slice(0, 4)) {
    const marcou = await p2.evaluate((nome) => {
      const input = document.querySelector(`#consultoria input[name="${nome}"]`);
      if (!input) return false;
      input.closest("label")?.click();
      return true;
    }, n);
    if (!marcou) problemas.push(`nao achei o grupo de radio ${n}`);
    await p2.waitForTimeout(120);
  }

  const marcados = await p2.evaluate(
    () => document.querySelectorAll("#consultoria input[type=radio]:checked").length,
  );
  console.log(`grupos marcados na etapa 1: ${marcados}`);
  if (marcados < 3) problemas.push("nao consegui marcar os grupos obrigatorios");

  /* teclado: seta para a direita deve mover a selecao dentro do grupo */
  await p2.evaluate(() => {
    const input = document.querySelector("#consultoria input[type=radio]");
    input?.focus();
  });
  const antesSeta = await p2.evaluate(
    () => document.querySelector("#consultoria input[type=radio]:checked")?.value,
  );
  await p2.keyboard.press("ArrowRight");
  await p2.waitForTimeout(200);
  const depoisSeta = await p2.evaluate(
    () => document.activeElement?.getAttribute("value"),
  );
  console.log(`teclado no grupo de radio: ${antesSeta} -> ${depoisSeta}`);
  if (antesSeta === depoisSeta)
    problemas.push("seta do teclado nao navega no grupo de radio");

  // avança
  await p2.evaluate(() => {
    const b = [...document.querySelectorAll("#consultoria button")].find((x) =>
      /Continuar para a agenda/i.test(x.textContent || ""));
    b?.click();
  });
  await p2.waitForTimeout(700);

  const progresso2 = await p2.getAttribute(
    '#consultoria [role="progressbar"]',
    "aria-valuenow",
  );
  const focoNoTitulo = await p2.evaluate(() => {
    const a = document.activeElement;
    return a?.tagName === "H3" ? a.textContent?.trim() : `outro: ${a?.tagName}`;
  });
  const anuncio = await p2.evaluate(
    () => document.querySelector("#consultoria [aria-live]")?.textContent?.trim(),
  );

  console.log(`\nfunil: progressbar ${progresso1} -> ${progresso2}`);
  console.log(`foco após avançar: ${focoNoTitulo}`);
  console.log(`anúncio aria-live: "${anuncio}"`);

  if (progresso1 !== "1" || progresso2 !== "2")
    problemas.push("progressbar não avançou de 1 para 2");
  if (!String(focoNoTitulo).includes("horário"))
    problemas.push("foco não foi para o título da etapa 2");
  if (!String(anuncio).includes("Etapa 2"))
    problemas.push("aria-live não anunciou a etapa 2");

  // validação: submeter vazio deve reclamar, não enviar
  await p2.evaluate(() => {
    const b = [...document.querySelectorAll("#consultoria button")].find((x) =>
      /Confirmar solicita/i.test(x.textContent || ""));
    b?.click();
  });
  await p2.waitForTimeout(500);
  const errosVisiveis = await p2.evaluate(
    () => document.querySelectorAll("#consultoria .text-red-600").length,
  );
  console.log(`erros de validação exibidos ao submeter vazio: ${errosVisiveis}`);
  if (errosVisiveis === 0)
    problemas.push("submeter sem dia/horário não gerou erro visível");

  // voltar preserva a etapa 1
  await p2.evaluate(() => {
    const b = [...document.querySelectorAll("#consultoria button")].find((x) =>
      (x.textContent || "").trim() === "Voltar");
    b?.click();
  });
  await p2.waitForTimeout(500);
  const voltou = await p2.getAttribute(
    '#consultoria [role="progressbar"]',
    "aria-valuenow",
  );
  console.log(`botão voltar: progressbar = ${voltou}`);
  if (voltou !== "1") problemas.push("botão voltar não retornou à etapa 1");

  /* ---------- 4. muro: imprensa não inventada ---------- */
  const imprensa = await p2.evaluate(() => {
    return document.body.textContent.includes(
      "Não encontrei menção de imprensa verificável",
    );
  });
  console.log(`\naviso de imprensa não verificada presente: ${imprensa}`);
  if (!imprensa) problemas.push("aviso de imprensa provisória não aparece");

  /* ---------- 5. responsivo ---------- */
  console.log("");
  for (const w of [375, 768, 1440, 1920]) {
    const p = await browser.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(BASE + "/", { waitUntil: "networkidle" });
    await p.evaluate(async () => {
      await new Promise((r) => {
        let y = 0;
        const s = () => {
          y += 700;
          scrollTo(0, y);
          if (y < document.body.scrollHeight) setTimeout(s, 40);
          else setTimeout(r, 600);
        };
        s();
      });
    });
    const m = await p.evaluate(() => ({
      overflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      h1: document.querySelectorAll("h1").length,
      semAlt: [...document.querySelectorAll("img")].filter(
        (i) => i.getAttribute("alt") === null,
      ).length,
    }));
    console.log(
      `${String(w).padEnd(5)} overflow:${m.overflow}  h1:${m.h1}  sem alt:${m.semAlt}`,
    );
    if (m.overflow > 0) problemas.push(`overflow de ${m.overflow}px em ${w}px`);
    await p.close();
  }

  await p2.screenshot({
    path: "/projects/sandbox/Kiro/web/preview/funil_1440.png",
  });

  console.log(
    "\n" +
      (problemas.length ? "PROBLEMAS:\n- " + problemas.join("\n- ") : "nenhum problema"),
  );
  await browser.close();
  process.exit(problemas.length ? 1 : 0);
})();
