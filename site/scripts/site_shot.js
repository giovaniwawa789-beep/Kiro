const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SITE = 'file://' + path.resolve(__dirname, '../Kiro/site/index.html');
const OUT = path.resolve(__dirname, '../Kiro/site/preview');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });

  // ---------- desktop ----------
  const desk = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const errors = [];
  desk.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  desk.on('pageerror', (e) => errors.push('pageerror: ' + e.message));

  await desk.goto(SITE, { waitUntil: 'load' });
  await desk.evaluate(() => document.fonts.ready);
  await desk.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  // revela tudo para o screenshot de página inteira
  await desk.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const step = () => {
        y += 600;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else { window.scrollTo(0, 0); setTimeout(r, 500); }
      };
      step();
    });
  });
  await desk.waitForTimeout(1200);

  await desk.screenshot({ path: path.join(OUT, 'desktop_hero.png') });
  await desk.screenshot({ path: path.join(OUT, 'desktop_completo.png'), fullPage: true });

  const h = await desk.evaluate(() => document.body.scrollHeight);
  console.log('altura total desktop:', h, 'px');

  // ---------- mobile ----------
  const mob = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await mob.goto(SITE, { waitUntil: 'load' });
  await mob.evaluate(() => document.fonts.ready);
  await mob.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await mob.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const step = () => {
        y += 500;
        window.scrollTo(0, y);
        if (y < document.body.scrollHeight) setTimeout(step, 55);
        else { window.scrollTo(0, 0); setTimeout(r, 500); }
      };
      step();
    });
  });
  await mob.waitForTimeout(1000);
  await mob.screenshot({ path: path.join(OUT, 'mobile_hero.png') });
  await mob.screenshot({ path: path.join(OUT, 'mobile_completo.png'), fullPage: true });

  // overflow horizontal?
  const overflow = await mob.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('overflow horizontal mobile:', overflow, 'px');

  console.log('erros de console:', errors.length ? errors : 'nenhum');
  await browser.close();
})();
