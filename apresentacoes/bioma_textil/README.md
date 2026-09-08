# Bioma Têxtil — Ecoponto Belezinho

Apresentação institucional da **Nunes & Lucato** para a Prefeitura de São Paulo:
*Projeto de Assunção da Área Livre do Ecoponto Belezinho — Criação do Primeiro
Bioma Sustentável de Reciclagem Têxtil da Cidade de São Paulo.*

## Arquivos

| Arquivo | Uso |
|---|---|
| `Nunes_Lucato_Bioma_Textil_Ecoponto_Belezinho.pptx` | **Entregável principal** — PPTX editável, 16:9, tipografia Montserrat |
| `Nunes_Lucato_Bioma_Textil_Ecoponto_Belezinho.pdf` | Versão para envio / projeção |
| `Nunes_Lucato_Bioma_Textil_Ecoponto_Belezinho__Calibri.pptx` | Cópia de segurança em Calibri (ver *Tipografia*) |
| `assets/` | Logomarca recortada com fundo transparente + fotos tratadas |
| `scripts/` | Geração reproduzível do deck |

## Estrutura — 21 slides

| # | Slide | # | Slide |
|---|---|---|---|
| 01 | Capa | 12 | Benefícios para São Paulo |
| 02 | Quem somos | 13 | Impacto ambiental |
| 03 | Como trabalhamos | 14 | Impacto social e econômico |
| 04 | Visão geral do projeto | 15 | Programa socioambiental |
| 05 | Objetivo principal | 16 | Diferenciais — linear → circular |
| 06 | Alinhamento institucional | 17 | Visão conceitual (layout) |
| 07 | Como funcionará o Bioma Têxtil | 18 | Uso previsto das áreas |
| 08 | Capacidade operacional | 19 | Rastreabilidade e conformidade |
| 09 | Separação técnica dos resíduos | 20 | Próximos passos |
| 10 | Estocagem rotativa | 21 | Encerramento |
| 11 | Aterro Zero | | |

O briefing inicial pedia 15 slides. Foram acrescentados 6 slides para acomodar
o conteúdo solicitado depois: apresentação da empresa (02, 03), alinhamento
institucional — ODS, Plano Municipal de Gerenciamento de Resíduos Sólidos e
Programa Mãos Paulistanas (06), programa socioambiental — coworking, oficinas,
compostagem e educação ambiental (15), uso previsto das áreas (18) e
rastreabilidade (19). Remover esses seis devolve a estrutura original.

## Identidade visual

- **Paleta institucional** extraída da identidade da Nunes & Lucato:
  índigo `#3432C9`, `#24238E`, `#17165D`, quase-preto `#0E0D28`.
  Apoios discretos para sustentabilidade: verde `#12A87B`, azul `#1E86C9`.
- **Fundo branco** em todos os slides de conteúdo; índigo com gradiente
  nativo apenas na capa e no encerramento.
- **Logomarca em 21/21 slides**, no rodapé, 1,24 in de largura, proporção
  original 4,8613 preservada — sem distorção e sem recriação. Versão knockout
  branca apenas sobre fundo escuro (capa e encerramento).

## Requisitos técnicos atendidos

- PPTX 16:9 exato (13,3333 × 7,5 in) — verificado.
- 258 caixas de texto editáveis.
- 714 formas vetoriais nativas (autoshapes + freeform): **todos** os ícones,
  fluxos, diagramas, tabela e gradientes são editáveis no PowerPoint.
  Nenhum ícone rasterizado, nenhum clipart.
- Transição *fade* discreta nos 21 slides; sem animações.
- Sem sombras herdadas do tema (desenho flat).

## Tipografia

Montserrat (Light / Regular / Medium / SemiBold), primeira opção do briefing.
Não é fonte padrão do Office: se as máquinas da apresentação não a tiverem,
instale-a (gratuita, SIL Open Font License) **ou** use a cópia
`__Calibri.pptx`, que tem layout idêntico com fonte nativa do Office.
O PDF já traz a Montserrat embutida e projeta corretamente em qualquer máquina.

## Origem das imagens

Somente arquivos próprios da Nunes & Lucato, de `videos/` neste repositório:

- `360355.jpg` — logomarca oficial (fundo removido para `assets/logo_*.png`)
- `360364`, `360368`, `360370`, `360376`, `360379` — Ecoponto Belezinho

Nenhuma imagem de terceiros, banco de imagens ou de outra apresentação foi
utilizada. As ilustrações de reciclagem, economia circular, logística,
desfibramento, upcycle etc. são desenhos vetoriais gerados para este deck.

## Integridade do conteúdo

Não há dados inventados. Não foram criados prazos, investimentos, número de
empregos, metas ou estatísticas. O único número é **1.000 toneladas/mês**,
fornecido no briefing. O slide 20 declara explicitamente que o cronograma não
tem prazos definidos, e o slide 17 registra que o layout é representação
conceitual, sem caráter de projeto executivo ou arquitetônico. A menção ao
Programa Mãos Paulistanas aparece como possibilidade condicionada ao interesse
da Prefeitura, conforme informado.

## Regerar

Requer Python 3 com `python-pptx` e `Pillow`; o PDF usa LibreOffice.

```bash
cd scripts
python3 build_assets.py                                      # logo + fotos -> ../assets
python3 nl_deck.py ../Nunes_Lucato_Bioma_Textil_Ecoponto_Belezinho.pptx
soffice --headless --convert-to pdf --outdir .. \
        ../Nunes_Lucato_Bioma_Textil_Ecoponto_Belezinho.pptx
```

`nl_core.py` concentra o sistema de design (paleta, escala tipográfica,
biblioteca de ícones vetoriais, rodapé); `nl_deck.py` monta os 21 slides.
Os caminhos são relativos ao repositório e podem ser sobrescritos por
`NL_VIDEOS` e `NL_ASSETS`.
