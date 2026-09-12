const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  });
  const file = 'file://' + path.resolve(__dirname, 'board.html');
  await page.goto(file, { waitUntil: 'load' });
  // garante webfonts carregadas
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2500);

  const out = path.resolve(__dirname, '..');
  const names = {
    b1: '01_capa',
    b2: '02_a_marca',
    b3: '03_paleta',
    b4: '04_tipografia',
    b5: '05_uso_da_logo',
    b6: '06_aplicacao',
  };
  for (const [id, name] of Object.entries(names)) {
    const el = await page.locator('#' + id);
    await el.screenshot({ path: path.join(out, `${name}.png`) });
    console.log('ok ->', name + '.png');
  }
  await browser.close();
})();
