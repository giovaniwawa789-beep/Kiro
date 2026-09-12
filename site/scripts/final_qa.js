const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const errs = [];
  for (const vp of [{w:1440,h:900,n:'desktop'},{w:768,h:1024,n:'tablet'},{w:390,h:844,n:'mobile'}]) {
    const p = await b.newPage({ viewport:{width:vp.w,height:vp.h} });
    p.on('console', m => { if (m.type()==='error') errs.push(vp.n+': '+m.text()); });
    p.on('pageerror', e => errs.push(vp.n+' pageerror: '+e.message));
    p.on('requestfailed', r => errs.push(vp.n+' 404: '+r.url().split('/').pop()));
    await p.goto('file://' + path.resolve(__dirname,'../Kiro/site/index.html'), {waitUntil:'load'});
    await p.evaluate(() => document.fonts.ready);
    // desliga o scroll suave: com ele, o scrollTo programatico nao chega ao fim
    await p.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
    await p.evaluate(async () => { await new Promise(r=>{let y=0;const s=()=>{y+=400;scrollTo(0,y);
      if(y<document.body.scrollHeight) setTimeout(s,40); else setTimeout(r,600);};s();}); });
    const r = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      imgs: document.querySelectorAll('img').length,
      quebradas: [...document.querySelectorAll('img')].filter(i=>i.complete && i.naturalWidth===0).map(i=>i.src.split('/').pop()),
      semAlt: [...document.querySelectorAll('img')].filter(i=>!i.alt).length,
      h1: document.querySelectorAll('h1').length,
      total: document.querySelectorAll('.reveal').length,
      escondidas: [...document.querySelectorAll('.reveal')].filter(e=>!e.classList.contains('is-visible')).length,
      scrollY: Math.round(window.scrollY), fim: Math.round(document.body.scrollHeight - window.innerHeight),
    }));
    console.log(vp.n.padEnd(8), 'overflow:', r.overflow, '| imgs:', r.imgs,
      '| quebradas:', r.quebradas.length?r.quebradas:'0', '| sem alt:', r.semAlt,
      '| h1:', r.h1, '| reveal:', (r.total - r.escondidas) + '/' + r.total,
      '| scroll:', r.scrollY + '/' + r.fim);
    await p.close();
  }
  console.log('\nerros:', errs.length ? errs : 'nenhum');
  await b.close();
})();
