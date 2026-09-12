# Identidade visual — Nunes & Lucato · Gestão Ambiental

Sistema de identidade construído a partir da logomarca existente. Seis boards em PNG
(1600×1000 @2x) + assets de marca prontos para uso.

| Board | Conteúdo |
|---|---|
| [`01_capa.png`](01_capa.png) | Capa e resumo da paleta |
| [`02_a_marca.png`](02_a_marca.png) | Anatomia da logomarca, dispositivo gráfico “O Fio”, família de ícones |
| [`03_paleta.png`](03_paleta.png) | Rampa índigo, neutras, acentos funcionais, contraste WCAG |
| [`04_tipografia.png`](04_tipografia.png) | Playfair Display + Montserrat + JetBrains Mono, escala tipográfica |
| [`05_uso_da_logo.png`](05_uso_da_logo.png) | Área de respiro, tamanho mínimo, versões, proibições |
| [`06_aplicacao.png`](06_aplicacao.png) | Cartão, documento, hero, selo, padrão, sinalização, e-mail, crachá |

## Ponto de atenção antes de adotar

Os dois decks já entregues (`apresentacoes/bioma_textil` e `apresentacoes/sinir_mtr`)
afirmam nos READMEs que a paleta índigo foi *“extraída da identidade da Nunes & Lucato”*.
**Isso não confere.** O arquivo de origem da logomarca (`videos/360355.jpg`) está em
**escala de cinza pura** (modo `L`, verificado via Pillow) e tem uma única tinta:
`#383838`. Não existe índigo — nem qualquer outra cor — na logomarca.

Optei por **manter o índigo** como cor primária, por três razões:

1. **Diferenciação.** O nicho é saturado de verde, e a Momo Ambiental — concorrente
   direta em resíduo têxtil — já ocupa marrom `#211818` + âmbar `#FFC03D`.
2. **Continuidade.** Duas apresentações institucionais já circularam com essa cor,
   inclusive para a Prefeitura de São Paulo. Trocar agora custa consistência.
3. **Coerência com o logotipo.** A serifa de alto contraste do logotipo é institucional,
   quase notarial — combina com índigo profundo, não com verde de startup.

O que ajustei: `#3432C9` puro é elétrico demais para uma operadora de gestão ambiental.
Ele foi rebaixado a **500 (base / link)** e a cor institucional passou a ser
**`#2A28A0` (600)**. O grafite `#383838` da logo entrou como neutra âncora.

Se você preferir abandonar o índigo, me diga — o sistema está parametrizado em
`assets/tokens.css` e a troca é de um bloco de variáveis.

## Paleta

**Índigo — primária**

| Token | Hex | Uso |
|---|---|---|
| 900 Noite | `#0D0C24` | Fundo escuro, capa, rodapé |
| 800 Profundo | `#17165D` | Gradiente, texto sobre claro |
| 700 Escuro | `#201F7A` | Gradiente |
| **600 Institucional** | **`#2A28A0`** | **Botão primário, rótulo, ícone** |
| 500 Base / link | `#3432C9` | Link, estado hover |
| 400 Ativo | `#5C5ADB` | Estado ativo, traço sobre escuro |
| 200 Névoa | `#C9C8F0` | Fundo de destaque |
| 100 Fundo | `#EEEEFB` | Fundo de seção |

**Neutras**

| Token | Hex | Uso |
|---|---|---|
| Grafite da logo | `#383838` | **Exclusivo da logomarca** |
| Tinta | `#14142E` | Texto principal |
| Texto secundário | `#6E7288` | Apoio |
| Régua | `#DFE2F0` | Borda, divisor |
| Fundo névoa | `#F4F5FC` | Cartão |

**Acentos funcionais — só em dado, nunca em decoração**

| Token | Hex | Uso |
|---|---|---|
| Verde ciclo | `#12A87B` | Indicador de material recuperado, Aterro Zero |
| Verde escuro | `#0B7F5C` | Texto sobre verde claro |
| Aqua | `#1E86C9` | Água, ciclo hídrico |

**Fora da paleta:** âmbar e dourado. É o acento da Momo Ambiental. Onde o deck antigo
usava âmbar `#B08535` para representar “modelo linear”, use grafite `#8A8EA3`.

## Tipografia

| Papel | Fonte | Pesos | Regra |
|---|---|---|---|
| Display / títulos | **Playfair Display** | 600–900 | Todo título acima de 32 px |
| Interface / corpo | **Montserrat** | 300–600 | Corpo, rótulo, botão, navegação |
| Dados e códigos | **JetBrains Mono** | 400–500 | MTR, CNPJ, lote, nº de laudo, tonelagem |

Todas gratuitas (SIL Open Font License). A Playfair é a novidade: ela ecoa a serifa de
alto contraste do logotipo, que nenhum material da empresa reaproveitava até agora.

Escala: ver board `04_tipografia.png`.

## O dispositivo gráfico — “O Fio”

O símbolo é uma agulha atravessada por uma linha que se fecha em laço contínuo: o setor
(têxtil) e a tese (circularidade) no mesmo traço. Dele deriva **O Fio**, uma linha
monotraço usada como divisor de seção, conector de diagrama e sublinha de palavra-chave.

Regras: nunca se cruza consigo mesma; nunca se interrompe dentro da mesma peça; em
padrão de repetição usa passo de 46 px, só sobre fundo escuro, opacidade máxima de 55%,
e nunca sob texto corrido.

Ícones: traço `3,4/100` do quadro, ponta e junta arredondadas, sem preenchimento.
Operação usa índigo; Aterro Zero usa verde.

## Uso da logomarca

- **Respiro mínimo:** `0,5x` em todos os lados, onde `x` = altura do símbolo da agulha.
- **Proporção:** `4,8613 : 1`. Nunca distorcer.
- **Tamanho mínimo:** 120 px (digital), 32 mm (impresso), 24 px (só símbolo).
- **Versões:** positiva grafite sobre claro; knockout branca sobre escuro ou índigo.
- **Nunca:** sobre o verde de acento, recolorida, com opacidade rebaixada, ou distorcida.

## Assets

```
identidade_visual/assets/
├── simbolo_grafite.png     símbolo isolado, tinta #383838, fundo transparente
├── simbolo_branco.png      símbolo isolado, knockout branco
├── favicon_512.png         512×512
├── favicon_180.png         180×180  (apple-touch-icon)
├── favicon_64.png          64×64
├── favicon_32.png          32×32
├── favicon_16.png          16×16
├── tokens.css              variáveis CSS da paleta e tipografia
└── tailwind.tokens.js      trecho de tailwind.config.js
```

O símbolo isolado foi recortado da logomarca por detecção do vão entre símbolo e
logotipo (`scripts/crop_symbol.py` no diretório de trabalho), centralizado em quadro
quadrado com respiro de 12%. Não houve redesenho: são os pixels originais.

## Regerar os boards

Requer Node com Playwright (Chromium) e Python com Pillow + NumPy.

```bash
cd brandwork
python3 crop_symbol.py     # símbolo isolado + favicons -> identidade_visual/assets
node shot.js               # 6 boards PNG -> identidade_visual
```

`board.html` é a fonte única dos boards; as fontes vêm do Google Fonts em tempo de
render, por isso o ambiente precisa de rede.

## O que ainda falta

- **Logomarca vetorial.** Tudo aqui parte de um PNG rasterizado de 1157×238. Para
  impressão grande, sinalização e bordado de uniforme é preciso vetorizar o símbolo em
  SVG/AI. Vale contratar o redesenho vetorial a partir do arquivo original.
- **Identificação exata das fontes do logotipo.** A serifa e a sans geométrica da
  assinatura não foram identificadas com certeza — Playfair Display e Montserrat são
  aproximações de sistema, não as fontes originais do logotipo.
- **Números de impacto reais.** O único dado confirmado é **1.000 t/mês**, vindo do
  briefing dos decks. Todo o resto nos mockups é placeholder.
