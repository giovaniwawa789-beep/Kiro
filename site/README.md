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

## Estrutura

```
site/
├── index.html          markup e todo o conteúdo (copy)
├── assets/
│   ├── tokens.css       variáveis da identidade (cor, tipografia) — vem de identidade_visual
│   ├── styles.css       estilos do site
│   ├── main.js          menu mobile, animação de entrada, formulário
│   ├── logo_dark.png / logo_white.png
│   ├── simbolo_*.png / favicon_*.png
└── README.md
```

## O ângulo da copy: têxtil-para-têxtil

O eixo de diferenciação, conforme combinado, é a **hierarquia de destinação**. Quase toda
empresa do setor promete "Aterro Zero", mas triturar tudo e mandar para coprocessamento
também é Aterro Zero — e encerra o ciclo têxtil. A seção `#hierarquia` declara a ordem da
Nunes & Lucato, do maior valor para o menor:

1. **Upcycle** — o tecido volta como produto têxtil novo (maior valor)
2. **Desfibramento** — a fibra volta como fibra
3. **Coprocessamento** — só o rejeito irrecuperável (último recurso)
4. **Aterro** — nunca

Isso posiciona a marca acima do concorrente direto (Momo Ambiental), que transforma
resíduo têxtil em polímero de engenharia — uma rota de downcycling.

## De onde veio cada dado

Todo o conteúdo factual foi extraído dos materiais da própria empresa neste repositório —
nada foi inventado:

| Dado | Fonte no repositório |
|---|---|
| Processo (coleta, MTR, descaracterização, upcycle, artesãs) | `videos/Midea_Upcycle_compressed.pdf` |
| Calendário de 4 meses, faturamento 50%+50%, peças sugeridas | `videos/Midea_Upcycle_compressed.pdf` |
| Fluxo do Bioma Têxtil, 1.000 t/mês, Aterro Zero, programa socioambiental | `apresentacoes/bioma_textil/…pdf` |
| Perfil "Transportador" no MTR, cadastro SINIR | `apresentacoes/sinir_mtr/…pdf` |
| Razão social, CNPJ, endereço, código SINIR 39087 | `apresentacoes/sinir_mtr/scripts/nl_sinir_deck.py` |

## ⚠️ Antes de publicar — precisa da sua confirmação

1. **Contato.** O formulário abre um e-mail para o placeholder
   `contato@nuneselucato.com.br`. Não publiquei o e-mail pessoal (Gmail) nem o celular que
   aparecem nos decks — são dados da Ana e merecem um endereço/telefone comercial. Diga
   qual usar (recomendo criar um e-mail no domínio) ou integre um formulário com backend.
2. **Código SINIR 39087.** O rótulo exato desse número foi marcado como `[CONFIRMAR]` no
   próprio deck de origem. Confirme se é "Código no SINIR" antes de exibir numa página de
   conformidade.
3. **CNPJ e endereço.** Vêm de um rascunho anterior do deck (a versão final removeu esse
   cartão). Confirme que continuam corretos e atuais.
4. **Sem CPF.** O CPF pessoal da responsável, que aparece nos decks de MTR, foi
   deliberadamente **mantido fora** do site — é PII e não deve ir para uma página pública.
5. **Números de impacto.** O único número operacional é 1.000 t/mês (capacidade projetada
   do Bioma, ainda em proposta). Não inventei toneladas processadas, empregos ou % de CO₂.

## Acessibilidade e performance

- HTML semântico, `lang="pt-BR"`, um único `<h1>`, hierarquia de headings sequencial.
- Skip link, foco visível, navegação por teclado no menu mobile, `aria-*` no toggle.
- Contraste conferido (ver board de paleta em `identidade_visual`).
- `prefers-reduced-motion` desativa as animações de entrada.
- Sem dependências externas além das fontes do Google Fonts (SIL OFL). Zero JS de terceiros.
- Validado em 1440px e 390px: sem overflow horizontal, sem erros de console.
