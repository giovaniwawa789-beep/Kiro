# Preview e deploy

## Preview no ar agora

**https://giovaniwawa789-beep.github.io/Kiro/**

Servido por GitHub Pages a partir da branch `gh-pages`, que contém o build
estático de `web/`. Rotas publicadas:

| Rota | |
|---|---|
| `/` | Home |
| `/sobre/` | Sobre |
| `/contato/` | Contato |
| `/servicos/<slug>/` | 6 páginas de serviço |
| `/sitemap.xml` · `/robots.txt` | |

## Atualizar o preview

```bash
cd web
PAGES=1 npm run build     # gera out/ com basePath /Kiro
touch out/.nojekyll        # sem isso o Pages ignora a pasta _next/

rm -rf /tmp/ghp && cp -r out /tmp/ghp && touch /tmp/ghp/.nojekyll
cd /tmp/ghp
git init -b gh-pages && git add -A && git commit -m "preview"
git remote add origin <url-do-repo>
git push -f origin gh-pages
```

O Pages reconstrói em ~20s.

## Por que existe a variável PAGES

`next.config.ts` só liga `output: "export"`, `basePath: "/Kiro"` e
`trailingSlash` quando `PAGES=1`. Assim:

- `npm run dev` e `npm start` seguem normais, sem basePath;
- um deploy futuro na Vercel (raiz do domínio, com otimização de imagem)
  funciona sem tocar em nada — é só **não** passar `PAGES=1`.

## Duas armadilhas do export que já estão resolvidas

**1. Imagens quebravam todas no subcaminho.** No `output: "export"` com
`images.unoptimized`, o `next/image` usa o `src` como veio e **não** prefixa o
`basePath`. Num deploy em `/Kiro`, as 12 imagens apontavam para a raiz do
domínio e davam 404. Resolvido com o helper `src/lib/asset.ts`, que prefixa
`NEXT_PUBLIC_BASE_PATH` (vazio em dev e na Vercel). `next/link` e o CSS já
tratam basePath sozinhos — o problema era exclusivo das imagens.

**2. `robots.ts` e `sitemap.ts` falhavam o build.** No modo export, essas rotas
precisam de `export const dynamic = "force-static"`. Sem isso o build aborta com
*"export const dynamic not configured on route /robots.txt"*.

## Alternativa: Vercel (recomendado para produção)

O GitHub Pages serve um site estático num subcaminho, o que é ótimo para
aprovação, mas para produção a Vercel é melhor: domínio próprio, otimização
automática de imagem (o `next/image` volta a gerar AVIF/WebP e tamanhos
responsivos) e headers configuráveis.

1. Importe o repositório em vercel.com
2. **Root Directory:** `web`
3. Não defina `PAGES` — o build sai sem basePath, na raiz do domínio
4. Defina `NEXT_PUBLIC_WHATSAPP` com o número comercial
5. Aponte o domínio e atualize `site.url` em `src/content/site.ts`

## Rodar localmente

```bash
cd web
npm install
npm run dev     # http://localhost:3000
```
