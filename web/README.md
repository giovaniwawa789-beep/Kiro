# Site institucional — Nunes e Lucato

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis.
Tema escuro "motion-first", sem CMS: todo o conteúdo vive em arquivos tipados.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de produção
npm start       # serve o build
```

## Onde editar cada coisa

| O que | Arquivo |
|---|---|
| **Contatos, CNPJ, métricas, produtos, FAQ, depoimentos, redes** | `src/content/site.ts` |
| **Os 6 serviços** (texto, entregas, benefícios, base legal, SEO) | `src/content/servicos.ts` |
| **Projetos** (Midea Carrier, Santista, Bom Retiro Recicla, Bioma Têxtil, oficinas) | `src/content/projetos.ts` |
| **Paleta, tipografia e movimento** | `src/app/globals.css` (bloco `@theme`) |
| **Integração do formulário** | `src/lib/enviarContato.ts` |
| **Variantes de animação** | `src/lib/motion.ts` |

Tailwind v4 não usa `tailwind.config.js`: o tema está no `@theme` do
`globals.css`. Trocar a paleta é editar aquele bloco — nada mais.

### Adicionar um serviço

Acrescente um objeto em `src/content/servicos.ts`. A Home, o rodapé, o
`sitemap.xml`, o JSON-LD e a rota `/servicos/[slug]` passam a incluí-lo
automaticamente. Se precisar de um ícone novo, adicione o traço em
`src/components/Icone.tsx`.

### Ligar o formulário a um backend

`src/lib/enviarContato.ts` isola o envio. Hoje ele abre o cliente de e-mail.
Troque **apenas o corpo** de `enviarContato` por um `fetch` para o seu endpoint
(Resend, Formspree, API própria). A UI não muda: ela só depende do tipo
`ResultadoEnvio`. A validação fica em `validarContato` e é reaproveitada.

### WhatsApp

O número vem de `NEXT_PUBLIC_WHATSAPP` e cai no valor de `site.ts` se a
variável não existir:

```bash
# .env.local
NEXT_PUBLIC_WHATSAPP=5511999999999
```

## Estrutura

```
src/
├── app/
│   ├── layout.tsx              fontes, metadata, JSON-LD, navbar/footer
│   ├── page.tsx                Home (compõe as seções)
│   ├── globals.css             tema (@theme), aurora, glass, noise, reduced-motion
│   ├── servicos/[slug]/        uma página por serviço (SSG)
│   ├── sobre/  contato/
│   ├── sitemap.ts  robots.ts
├── components/
│   ├── Navbar · Footer · SmoothScroll · Cursor · Icone · FormularioContato
│   ├── ui/ (Botao, Secao)
│   └── secoes/ (Hero, Metricas, Servicos, ComoTrabalhamos, Projetos,
│                Produtos, ParaQuem, Depoimentos, Faq, CtaFinal)
├── content/  site.ts · servicos.ts · projetos.ts
└── lib/      motion.ts · enviarContato.ts
```

## Movimento

Easing único `[0.22, 1, 0.36, 1]`, nada acima de 600ms.

- Hero: título revelado palavra por palavra (stagger 60ms, `y: 24→0`, `blur: 8→0`)
- Reveal de seção: `opacity 0→1`, `y: 32→0`, `viewport={{ once: true, amount: 0.3 }}`
- Cards: `scale 1.02` no hover, borda acende no lima, ícone com micro-rotação
- Contadores animam ao entrar na viewport
- Navbar reduz de 80px para 64px e ganha fundo translúcido após 80px de scroll
- Timeline com a linha se desenhando conforme o scroll (`useScroll` + `scaleX`)
- Cursor customizado: só em `pointer: fine`, expande sobre elementos clicáveis

`prefers-reduced-motion` desliga a aurora e os transforms, mantendo fades de
150ms. Verificado: o `<h1>` permanece visível (opacity 1) nesse modo.

## Qualidade verificada

Build: **15 páginas estáticas, zero erro de TypeScript, zero warning.**

| Verificação | Resultado |
|---|---|
| Overflow horizontal em 375 / 768 / 1440 / 1920 | 0 px em todos |
| Imagens quebradas · sem `alt` | 0 · 0 |
| `<h1>` por página | exatamente 1 |
| Seções presas em `opacity: 0` | 0 |
| Accordion por teclado | alterna `aria-expanded` |
| `prefers-reduced-motion` | conteúdo visível |
| Contraste AA (medido no pixel renderizado) | 8 amostras, todas passam |

O contraste foi medido com um script que **lê o pixel de fundo renderizado** e
compõe a cor do texto com o alfa — não confia no CSS declarado. Isso pegou duas
falhas reais: `text-body/70` (4,35:1) e `text-body/60` (3,49:1) em textos
pequenos sobre o gradiente. Corrigido removendo a opacidade desses textos, que
agora medem 7,8:1. Scripts em `../brandwork/contraste.js` e `qa_web.js`.

Prévias renderizadas em [`preview/`](preview/).

## SEO

Metadata por página (title, description, canonical, Open Graph), `sitemap.xml`
com 9 URLs, `robots.txt` e JSON-LD com `LocalBusiness` + um `Service` por
serviço. Termos distribuídos no texto: gestão de resíduos têxteis, PGRS,
logística reversa têxtil, consultoria ambiental têxtil, reciclagem de uniformes,
coleta seletiva têxtil.

## ⚠️ Pendências antes de publicar

Todas concentradas em `src/content/site.ts`, marcadas com `// TODO: confirmar com o cliente`.

1. **WhatsApp, telefone e e-mail.** Estão como placeholder. Nos materiais
   internos o contato é um Gmail e um celular pessoais da responsável — não
   publiquei nenhum dos dois. Recomendo criar e-mail no domínio.
2. **Domínio.** `site.url` está em `nuneselucato.com.br`; ajuste se for outro
   (afeta canonical, sitemap e JSON-LD).
3. **Duas métricas.** "Anos de atuação" e "% desviado de aterro" estão em zero.
   As outras duas (2.500+ itens e 40 t/mês) vieram de você.
4. **Depoimentos.** Placeholder, com aviso visível na própria seção.
5. **Fotos de 3 produtos.** Jogos de escumadeiras, lixeiras de 7L e jogos de
   tapetes aparecem com marcador "Foto pendente" (o `alt` real já está escrito).
6. **CNPJ, endereço e código SINIR 39087.** Vêm do cadastro no MTR nos decks
   internos; confirme se seguem atuais. O rótulo do 39087 estava marcado como a
   confirmar no material de origem.
7. **Nomes de clientes.** Midea Carrier e Santista aparecem nos projetos.
   Confirme se há cláusula de confidencialidade nos contratos.
8. **Logo em SVG.** Hoje uso o símbolo em PNG (`public/simbolo_branco.png`).
   Para nitidez em telas grandes, o ideal é vetorizar.

Não foram publicados: o CPF da responsável (PII), o orçamento de R$ 150 mil
(número interno que ancora preço) e o "+15% de engajamento" (métrica sem
metodologia — risco de greenwashing). Todos os três seguem disponíveis para
proposta comercial, mas não para página pública.
