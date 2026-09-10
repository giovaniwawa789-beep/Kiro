# MTR Nacional — Login Único Gov.br

Comunicado da **Nunes & Lucato** aos clientes geradores sobre a mudança no
acesso ao Sistema MTR – SINIR: desde **1º de agosto de 2026** o login é
exclusivamente pelo **Login Único Gov.br**, e por isso a Nunes & Lucato deixou
de conseguir emitir MTR em nome do gerador sem uma autorização explícita.

## Escopo

O deck cobre **acesso ao sistema** e **cadastro/autorização de usuário**.

Ele **não** ensina o gerador a preencher e emitir MTR — os slides de emissão
(dados do gerador, dados do transportador, resíduos/CDF) foram retirados de
propósito, porque a emissão continua sendo feita por nós. O objetivo do
material é obter a autorização de acesso.

## Arquivos

| Arquivo | Uso |
|---|---|
| `Nunes_Lucato_MTR_Login_Unico_Govbr.pptx` | **Entregável principal** — PPTX editável, 16:9, Montserrat |
| `Nunes_Lucato_MTR_Login_Unico_Govbr.pdf` | Versão para envio / projeção |
| `assets/` | Logomarca + prints tratados (derivados, regeneráveis) |
| `scripts/build_assets.py` | Prepara o print próprio e extrai as figuras oficiais |
| `scripts/nl_sinir_deck.py` | Monta os 21 slides |

## Estrutura — 21 slides

| # | Slide | Bloco |
|---|---|---|
| 01 | Capa | — |
| 02 | O que mudou | Diagnóstico |
| 03 | Antes e depois do login | Diagnóstico |
| 04 | Por que isso afeta você (CPF × unidade, perfis) | Diagnóstico |
| 05 | Impacto na nossa operação | Diagnóstico |
| 06 | A solução: você autoriza o nosso CPF | Solução |
| 07 | As duas rotas (comparativo A × B) | Solução |
| 08 | Rota A · 1 — entrar no MTR pelo Gov.br | Rota A |
| 09 | Rota A · 2 — abrir o Gerenciador de Usuários | Rota A |
| 10 | Rota A · 3 — preencher os dados do novo usuário | Rota A |
| 11 | Rota A · 4 — Administrador ou Padrão | Rota A |
| 12 | Rota A · conclusão — salvar, confirmar e revogar | Rota A |
| 13 | Rota B · 1 — CPF sem vínculo | Rota B |
| 14 | Rota B · 2 — localizar a empresa e solicitar acesso | Rota B |
| 15 | Rota B · 3 — o Administrador aprova | Rota B |
| 16 | Caso especial — empresa ainda não existe no MTR | Exceção |
| 17 | Alternativa — repassar login e senha Gov.br | Alternativa |
| 18 | Perguntas frequentes | Fechamento |
| 19 | Pontos de atenção | Fechamento |
| 20 | O que fazer agora (checklist) | Fechamento |
| 21 | Encerramento, contato e fontes | — |

### As duas rotas de autorização

**Rota A (slides 8 a 12)** — o Administrador da unidade do cliente cadastra o
CPF da nossa responsável: `Configurações › Meus Usuários › Gerenciador de
Usuários › Adicionar Usuário`. É o tutorial detalhado pedido no briefing, com
quatro passos, os dados a digitar, a decisão entre perfil Administrador e
Padrão, e o procedimento de revogação.

**Rota B (slides 13 a 15)** — nossa equipe entra com o CPF da responsável,
localiza a empresa por `Pesquisar CPF/CNPJ`, solicita acesso à unidade e o
Administrador do cliente aprova. É o fluxo documentado no Guia Rápido oficial
(Cenário 02), então tem telas reais.

**Alternativa (slide 17)** — o briefing pedia para registrar que a emissão
continua possível se o gerador repassar o login e a senha Gov.br do CPF
correspondente. Isso está no deck como escolha do cliente, ao lado dos pontos
a considerar (a conta Gov.br é pessoal e intransferível, a mesma senha abre
outros serviços do governo, e uma troca de senha derruba o acesso). As Rotas A
e B aparecem como recomendadas porque dão o mesmo resultado prático sem expor
a conta pessoal. **A decisão fica com o cliente** — nenhuma opção foi bloqueada.

## Dados preenchidos

Responsável da Nunes & Lucato, usada nos slides 06, 10, 15, 20 e 21:

| Campo | Valor |
|---|---|
| Nome completo | Ana Nunes Lucato |
| CPF | 142.803.138-30 |
| E-mail | anapnuneslucato@gmail.com |

Ficam em constantes no topo de `nl_sinir_deck.py` (`NL_NOME`, `NL_CPF`,
`NL_EMAIL`) — trocar num só lugar atualiza todos os slides.

> **Divergência a conferir.** O cabeçalho do sistema, no print de `videos/`,
> mostra **“Ana Paola Nunes Lucato”**. O deck usa “Ana Nunes Lucato”, conforme
> informado. Como o cadastro é vinculado a CPF, vale confirmar qual é o nome
> completo do registro antes de enviar o material — um nome que não bate com o
> CPF pode travar o cadastro no lado do cliente.

## Identidade visual

Mesmo sistema de design do deck Bioma Têxtil, importado de
`../bioma_textil/scripts/nl_core.py` — **o core não foi alterado**.

- Paleta institucional: índigo `#3432C9`, `#24238E`, `#17165D`, quase-preto
  `#0E0D28`; apoios verde `#12A87B` e azul `#1E86C9`.
- Cores locais deste deck: vermelho `#C0392B` para destaques nos prints e
  faixas de alerta, âmbar `#B08535` para avisos.
- **Logomarca em 21/21 slides**, no rodapé, altura 0,255 in, proporção original
  preservada. Versão knockout branca na capa e no encerramento.
- Ícones novos deste deck (cadeado, chave, CPF, alerta, navegador, calendário,
  usuário+, usuário-ok, proibido, menu) são freeform vetoriais definidos em
  `nl_sinir_deck.py`, não no core.

## Requisitos técnicos atendidos

- PPTX 16:9 exato (13,3333 × 7,5 in) — verificado.
- Ícones, diagramas, fluxos, “tabelas”, o esquema da janela *Adicionar Usuário*
  e os destaques em vermelho são **formas nativas editáveis**. Nenhum destaque
  foi queimado no pixel do print, então qualquer marcação pode ser movida no
  PowerPoint.
- Transição *fade* discreta; sem animações.
- `nl_sinir_deck.py --check` valida a geometria: acusa forma fora do slide e
  conteúdo invadindo a faixa do rodapé.

## Origem das imagens

**1. Print próprio da Nunes & Lucato** — `videos/Captura de Tela (8).png`,
tela real do sistema na conta da empresa. O deck usa o recorte do cabeçalho
(slide 05). O **CPF exibido nesse cabeçalho é tarjado** por `build_assets.py`:
não para esconder o CPF (ele aparece de propósito nos slides 06 e 10, porque o
cliente precisa dele), mas para evitar exposição incidental dentro de um print
de sessão logada. Para desligar, use `TARJAR_CPF = False`.

**2. Figuras 1 a 15 do Guia Rápido oficial** — “Login Único GOV.BR — MTR
Nacional/Sinir”, MMA/SINIR, versão 1.0, 05/01/2026, extraídas do PDF publicado
em `portal-api.sinir.gov.br`. Usadas nos slides 08, 13, 14, 15 e 16.

**3. Logomarca** — reaproveitada de `../bioma_textil/assets/logo_*.png`.

Nenhuma imagem de banco de imagens ou de terceiros.

### Licença das imagens oficiais

O Guia Rápido declara: reprodução permitida **sem fins lucrativos**, parcial ou
total, por qualquer meio, **desde que citada a fonte** (Ministério do Meio
Ambiente e Mudança do Clima) e o sítio de origem. No deck, cada slide que usa
uma figura traz o crédito no pé, e o slide 21 lista as fontes.

> Como este é um material de orientação distribuído gratuitamente aos clientes,
> a condição “sem fins lucrativos” foi considerada atendida. **Se o jurídico
> preferir não depender dessa interpretação**, basta substituir
> `assets/guia_fig*.png` por prints próprios das mesmas telas e regerar: os
> destaques em vermelho usam coordenadas fracionárias (0–1) da imagem, então
> continuam alinhados se o novo print tiver o mesmo enquadramento.

## Integridade do conteúdo

Não há dados inventados. O fluxo de acesso e de solicitação de vínculo vem do
Guia Rápido oficial; os tipos de usuário (Administrador e Padrão), o caminho de
menu `Configurações › Meus Usuários › Gerenciador de Usuários`, o procedimento
de inativação, a restrição a e-mails Microsoft e o canal `mtr.sinir@mma.gov.br`
vêm do comunicado oficial do SINIR.

O slide 10 mostra um **esquema vetorial** da janela *Adicionar Usuário*, não um
print. Isso está declarado no próprio slide: o SINIR documenta o caminho de
menu e manda “preencher os dados solicitados na janela”, mas não publica a tela
nem os rótulos dos campos.

Marcadores deixados de propósito:

- `[INSERIR TELEFONE]` — contato (slide 21).
- `[CONFIRMAR — rótulos exatos dos campos]` (slide 10).
- `[CONFIRMAR — se o perfil Padrão basta para emitir MTR]` (slide 11): o
  comunicado descreve o que o perfil Padrão **não** acessa (menus cadastrais e
  de usuários), mas não afirma explicitamente que ele emite MTR.
- `[PRINT PENDENTE]` (slides 09, 10, 12 e 15): telas do Gerenciador de
  Usuários, da janela *Adicionar Usuário*, da janela de edição do usuário e da
  aprovação da solicitação. O SINIR não publica essas telas e não temos print
  próprio. **Nenhuma tela foi descrita como se houvesse print.**

## Regerar

Requer Python 3 com `python-pptx`, `Pillow` e `pypdf`; o PDF usa LibreOffice.
A fonte Montserrat (SIL OFL) precisa estar instalada — sem ela, gere a
variante Calibri.

```bash
cd scripts
python3 build_assets.py                                   # print + figuras -> ../assets
python3 nl_sinir_deck.py ../Nunes_Lucato_MTR_Login_Unico_Govbr.pptx
python3 nl_sinir_deck.py --check                          # só valida o layout
soffice --headless --convert-to pdf --outdir .. \
        ../Nunes_Lucato_MTR_Login_Unico_Govbr.pptx
```

`build_assets.py` baixa o Guia Rápido oficial na primeira execução e o guarda
em `assets/_cache/`. Os caminhos podem ser sobrescritos por `NL_VIDEOS` e
`NL_ASSETS`.
