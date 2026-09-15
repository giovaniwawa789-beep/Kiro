# Site institucional — Nunes & Lucato · Gestão Ambiental

Landing page de página única, estática (HTML + CSS + JS, sem build), construída sobre o
sistema de identidade visual de `../identidade_visual`. UI no padrão MotionSites
(hero escuro com gradiente, tipografia serifada, seções amplas, micro-interações),
traduzida para a identidade índigo da marca.

## Como abrir

Não há etapa de build. Abra `index.html` no navegador, ou sirva a pasta:

```bash
cd site
python3 -m http.server 8000    # depois acesse http://localhost:8000
```

Prévias renderizadas ficam em [`preview/`](preview/).

## Estrutura

```
site/
├── index.html              markup e todo o conteúdo (copy)
├── assets/
│   ├── tokens.css           variáveis da identidade — vem de identidade_visual
│   ├── styles.css           estilos do site
│   ├── main.js              menu mobile, animação de entrada, formulário
│   ├── logo_*.png / simbolo_*.png / favicon_*.png
│   └── fotos/               11 fotos extraídas dos reels da empresa
├── scripts/
│   ├── extrai_fotos.py      gera assets/fotos a partir dos reels
│   ├── site_shot.js         prévias desktop + mobile
│   └── qa_sections.js       prévia seção por seção
├── preview/                 prévias renderizadas (JPG)
└── README.md
```

## Seções

`hero` · `#hierarquia` (destinação) · `#repertorio` (projetos) · `#servicos` ·
`#processo` · `#bioma` (Bioma Têxtil) · `#conformidade` · `#contato`

## O ângulo da copy: têxtil-para-têxtil

O eixo de diferenciação é a **hierarquia de destinação**. Quase toda empresa do setor
promete "Aterro Zero", mas triturar tudo e mandar para coprocessamento também é Aterro
Zero — e encerra o ciclo têxtil. A seção `#hierarquia` declara a ordem, do maior valor
para o menor:

1. **Upcycle** — o tecido volta como produto têxtil novo
2. **Desfibramento** — a fibra volta como fibra
3. **Coprocessamento** — só o rejeito irrecuperável (último recurso)
4. **Aterro** — nunca

Isso posiciona a marca acima da Momo Ambiental, concorrente direta, que transforma
resíduo têxtil em polímero de engenharia — uma rota de downcycling.

O bloco **antes e depois** em `#repertorio` é a prova visual da tese: o uniforme Midea /
Carrier / Totaline fora de uso à esquerda, a ecobag confeccionada com o próprio tecido à
direita, ligados pelo dispositivo gráfico "O Fio".

## De onde veio cada dado

Todo o conteúdo factual saiu dos materiais da própria empresa neste repositório — nada
foi inventado:

| Dado | Fonte |
|---|---|
| Processo (coleta, MTR, descaracterização, upcycle, artesãs, QR Code) | `videos/Midea_Upcycle_compressed.pdf` |
| Calendário de 4 meses, faturamento 50%+50%, peças sugeridas | `videos/Midea_Upcycle_compressed.pdf` |
| Fluxo do Bioma Têxtil, 1.000 t/mês, Aterro Zero, programa socioambiental | `apresentacoes/bioma_textil/…pdf` |
| Perfil "Transportador" no MTR, cadastro SINIR | `apresentacoes/sinir_mtr/…pdf` |
| Razão social, CNPJ, endereço, código SINIR 39087 | `apresentacoes/sinir_mtr/scripts/nl_sinir_deck.py` |
| 2.500+ itens · 40 t/mês no Bom Retiro Recicla · clientes | currículo, informado pelo cliente |
| Oficinas CULTSP PRO / Mega Artesanal | posts da própria empresa (`main`) |

### As fotos

`assets/fotos` foi gerado por `scripts/extrai_fotos.py` a partir dos três reels enviados
para a branch `main` (arquivos `SaveClip.App_*.mp4`). Os reels vêm do Instagram com
**legenda queimada no pixel** e letterbox de altura variável, então o script:

1. extrai os frames a 1 fps em resolução cheia (seleção por índice, precisa);
2. corta a faixa da legenda por fração medida com régua visual
   (v0 topo 36%, v1 base 34%, v2 topo 22%);
3. remove o letterbox por detecção de linhas escuras;
4. isola a área branca de estúdio nos produtos e encaixa em `contain`.

Nenhuma foto tem legenda de Instagram visível. Para regerar, deixe os `SaveClip.App_*.mp4`
numa pasta `repertorio_bruto/` na raiz e rode `python3 scripts/extrai_fotos.py`.

> **Peça descartada:** o "saco com cordão" (frames 27–28) ficou de fora porque o corpo da
> peça está dentro da faixa da legenda — sobravam só os cordões. Se quiser essa peça no
> site, mande a foto original sem o texto sobreposto.

## ⚠️ Antes de publicar — precisa da sua decisão

1. **Contato.** O formulário abre um e-mail para o placeholder
   `contato@nuneselucato.com.br`. Não publiquei o Gmail pessoal nem o celular que
   aparecem nos decks. Diga qual endereço comercial usar, ou integre um backend.
2. **Nomes de clientes.** Midea Carrier e Santista aparecem no site. As peças com os
   logos já estão públicas no Instagram da empresa, mas **confirme se há cláusula de
   confidencialidade** nos contratos antes de publicar.
3. **Deixei dois números do currículo FORA do site, de propósito:**
   - **R$ 150 mil de orçamento gerido.** É número interno; publicado, ancora a
     expectativa de preço do próximo cliente e enfraquece a negociação. Serve muito bem
     em proposta comercial e no seu currículo — não numa página pública.
   - **"+15% de engajamento sustentável das marcas".** Métrica sem metodologia nem fonte
     verificável. Numa página de sustentabilidade, é exatamente o tipo de afirmação que
     abre flanco para acusação de greenwashing. Se houver pesquisa ou relatório do
     cliente que sustente o número, dá para incluir citando a fonte.
4. **Código SINIR 39087.** O rótulo exato foi marcado como `[CONFIRMAR]` no deck de
   origem. Confirme antes de exibir numa página de conformidade.
5. **CNPJ e endereço.** Vêm de um rascunho do deck (a versão final removeu o cartão).
   Confirme se seguem atuais.
6. **Sem CPF.** O CPF pessoal da responsável, presente nos decks de MTR, foi
   deliberadamente mantido **fora** do site — é PII e não vai para página pública.
7. **A confirmar:** um post cita "tijolos, vasos" entre as criações. Não coloquei no site
   porque a frase é ambígua. Vocês produzem tijolo e vaso a partir de resíduo têxtil? Se
   sim, é uma linha de produto forte e merece seção própria.

## Acessibilidade e performance

- HTML semântico, `lang="pt-BR"`, um único `<h1>`, hierarquia de headings sequencial.
- Skip link, foco visível, navegação por teclado no menu mobile, `aria-*` no toggle.
- Todas as imagens com `alt` descritivo, `loading="lazy"` e `width`/`height` declarados.
- `prefers-reduced-motion` desativa as animações de entrada.
- Fotos otimizadas (JPEG progressivo, 20–200 KB); total de `assets/` abaixo de 2 MB.
- Sem dependências externas além das fontes do Google Fonts (SIL OFL). Zero JS de terceiros.
- Validado em 1440 px e 390 px: sem overflow horizontal, sem erros de console.
