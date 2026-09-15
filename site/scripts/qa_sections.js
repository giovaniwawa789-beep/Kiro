const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SITE = 'file://' + path.resolve(__dirname, '../Kiro/site/index.html');
const OUT = path.resolve(__dirname, '../Kiro/site/preview');
fs.mkdirSync(OUT, { recursive: true });

const sections = ['hierarquia', 'repertorio', 'servicos', 'processo', 'bioma', 'conformidade', 'contato'];

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(SITE, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

  for (const id of sections) {
    await page.evaluate((sid) => {
      document.getElementById(sid).scrollIntoView({ behavior: 'instant', block: 'start' });
    }, id);
    await page.waitForTimeout(1100); // deixa a animação de entrada concluir
    await page.screenshot({ path: path.join(OUT, `qa_${id}.png`) });
    console.log('qa_' + id + '.png');
  }
  await browser.close();
})();
