# MTR Nacional — Login Único Gov.br

Comunicado da **Nunes & Lucato** aos clientes geradores sobre a mudança no
acesso ao Sistema MTR – SINIR: desde **1º de agosto de 2026** o login é
exclusivamente pelo **Login Único Gov.br**, e por isso a Nunes & Lucato deixou
de conseguir emitir MTR em nome do gerador sem uma autorização explícita.

## Arquivos

| Arquivo | Uso |
|---|---|
| `Nunes_Lucato_MTR_Login_Unico_Govbr.pptx` | **Entregável principal** — PPTX editável, 16:9, Montserrat |
| `Nunes_Lucato_MTR_Login_Unico_Govbr.pdf` | Versão para envio / projeção |
| `assets/` | Logomarca + prints tratados (derivados, regeneráveis) |
| `scripts/build_assets.py` | Prepara os prints e extrai as figuras oficiais |
| `scripts/nl_sinir_deck.py` | Monta os 26 slides |

## Estrutura — 26 slides

| # | Slide | # | Slide |
|---|---|---|---|
| 01 | Capa | 14 | Passo 4 — senha do Gov.br |
| 02 | O que mudou | 15 | Passo 5 — selecionar a unidade |
| 03 | Antes e depois do login | 16 | Passo 6 — CPF sem vínculo |
| 04 | Por que isso afeta você | 17 | Passo 6 — dados cadastrais |
| 05 | Impacto na nossa operação | 18 | Passo 7 — empresa não cadastrada |
| 06 | Suas duas opções | 19 | Passo 7 — solicitar acesso |
| 07 | Caminho 1 — visão geral | 20 | Passo 8 — dados do gerador |
| 08 | Caminho 1 — como nos cadastrar | 21 | Passo 8 — dados do transportador |
| 09 | Caminho 1 — repassar login e senha | 22 | Passo 9 — resíduos, emissão, CDF |
| 10 | Caminho 2 — os 9 passos | 23 | Perguntas frequentes |
| 11 | Passo 1 — conta Gov.br | 24 | Erros comuns |
| 12 | Passo 2 — mtr.sinir.gov.br | 25 | O que fazer agora |
| 13 | Passo 3 — informar o CPF | 26 | Encerramento, contato e fontes |

### Os dois caminhos

O briefing pedia para registrar que a emissão continua possível **se o gerador
repassar o login e a senha Gov.br do CPF correspondente**. Isso está no deck
(slide 09), apresentado como escolha do cliente.

Ao lado dele foi acrescentado o caminho de **autorização de usuário**
(slides 07 e 08): o Administrador da unidade cadastra o CPF do responsável da
Nunes & Lucato — ou aprova a solicitação de acesso feita por ele. O resultado
prático é o mesmo (nós emitimos os MTRs), sem repassar senha pessoal e com
cada emissão registrada em um CPF identificado. Esse caminho aparece como
recomendado; o slide 09 lista os pontos a considerar antes de compartilhar
credenciais. **A decisão fica com o cliente** — o material apresenta as duas
opções sem bloquear nenhuma.

## Identidade visual

Mesmo sistema de design do deck Bioma Têxtil, importado de
`../bioma_textil/scripts/nl_core.py` — **o core não foi alterado**.

- Paleta institucional: índigo `#3432C9`, `#24238E`, `#17165D`, quase-preto
  `#0E0D28`; apoios verde `#12A87B` e azul `#1E86C9`.
- Cores locais deste deck: vermelho `#C0392B` para os destaques nos prints e
  faixas de alerta, âmbar `#B08535` para avisos.
- **Logomarca em 26/26 slides** (verificado por hash do arquivo), no rodapé,
  altura 0,255 in, proporção original preservada. Versão knockout branca na
  capa e no encerramento.
- Ícones novos deste deck (cadeado, chave, CPF, alerta, navegador, calendário,
  usuário+, proibido) são freeform vetoriais, definidos em `nl_sinir_deck.py`
  e não no core.

## Requisitos técnicos atendidos

- PPTX 16:9 exato (13,3333 × 7,5 in) — verificado.
- 26 slides, 1.319 formas, 448 caixas de texto com conteúdo, 42 imagens.
- Ícones, diagramas, fluxos, “tabelas” e destaques em vermelho são **formas
  nativas editáveis** — nenhum destaque foi queimado no pixel do print, então
  qualquer marcação pode ser movida no PowerPoint.
- Transição *fade* discreta; sem animações.
- `nl_sinir_deck.py` traz um validador geométrico (`--check`): acusa forma
  fora do slide e conteúdo invadindo a faixa do rodapé.

## Origem das imagens

**1. Print próprio da Nunes & Lucato** — `videos/Captura de Tela (8).png`, tela
real de emissão de MTR na conta da empresa. Usado nos slides 05, 20 e 21.
O **CPF do usuário administrador foi tarjado** por `build_assets.py`, porque o
material é distribuído a clientes; o CNPJ da empresa foi mantido.

**2. Figuras 1 a 15 do Guia Rápido oficial** — “Login Único GOV.BR — MTR
Nacional/Sinir”, MMA/SINIR, versão 1.0, 05/01/2026, extraídas do PDF publicado
em `portal-api.sinir.gov.br`. Usadas nos slides 12 a 19.

**3. Logomarca** — reaproveitada de `../bioma_textil/assets/logo_*.png`.

Nenhuma imagem de banco de imagens ou de terceiros.

### Licença das imagens oficiais

O Guia Rápido declara: reprodução permitida **sem fins lucrativos**, parcial ou
total, por qualquer meio, **desde que citada a fonte** (Ministério do Meio
Ambiente e Mudança do Clima) e o sítio de origem. No deck, cada slide que usa
uma figura traz o crédito no pé, e o slide 26 lista as fontes.

> Como este é um material de orientação distribuído gratuitamente aos clientes,
> a condição “sem fins lucrativos” foi considerada atendida. **Se o jurídico
> preferir não depender dessa interpretação**, basta substituir
> `assets/guia_fig*.png` por prints próprios das mesmas telas e regerar: os
> destaques em vermelho são posicionados em coordenadas fracionárias
> (0–1) da imagem em `HL`/`hls`, então continuam alinhados se o novo print
> tiver o mesmo enquadramento.

## Integridade do conteúdo

Não há dados inventados. Todo o passo a passo de acesso vem do Guia Rápido
oficial; os tipos de usuário (Administrador e Padrão), o caminho de menu
`Configurações › Meus Usuários › Gerenciador de Usuários`, a restrição a
e-mails Microsoft e o canal `mtr.sinir@mma.gov.br` vêm do comunicado oficial
do SINIR.

Marcadores deixados de propósito, para você completar:

- `[INSERIR NOME]`, `[INSERIR CPF]`, `[INSERIR E-MAIL]` — responsável da
  Nunes & Lucato (slide 07).
- `[INSERIR]` em Licença e Órgão emissor (slide 21).
- `[INSERIR RESPONSÁVEL]`, `[INSERIR TELEFONE]`, `[INSERIR E-MAIL]` —
  contatos (slide 26).
- `[CONFIRMAR — nível mínimo exigido pelo MTR Nacional]` (slide 11): o portal
  gov.br descreve os níveis bronze/prata/ouro, mas não localizamos declaração
  oficial de qual nível o MTR exige.
- `[CONFIRMAR — exigência de certificado digital]` (slide 23).
- `[CONFIRMAR — rótulo exato do código 39087]` (slide 21): o número aparece no
  cabeçalho do sistema, mas o rótulo do campo não.
- `[PRINT PENDENTE]` (slides 08, 20 e 22): telas que não temos — menu de
  emissão, bloco de resíduos, MTR gerado/impressão, consulta de MTRs, emissão
  em lote, modelos salvos e download do CDF. **Nenhuma tela foi descrita sem
  print correspondente.**

## Regerar

Requer Python 3 com `python-pptx`, `Pillow` e `pypdf`; o PDF usa LibreOffice.
A fonte Montserrat (SIL OFL) precisa estar instalada — sem ela, gere a
variante Calibri.

```bash
cd scripts
python3 build_assets.py                                   # prints + figuras -> ../assets
python3 nl_sinir_deck.py ../Nunes_Lucato_MTR_Login_Unico_Govbr.pptx
python3 nl_sinir_deck.py --check                          # só valida o layout
soffice --headless --convert-to pdf --outdir .. \
        ../Nunes_Lucato_MTR_Login_Unico_Govbr.pptx
```

`build_assets.py` baixa o Guia Rápido oficial na primeira execução e o guarda
em `assets/_cache/`. Os caminhos podem ser sobrescritos por `NL_VIDEOS` e
`NL_ASSETS`.
