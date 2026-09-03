# Aftermovie — Liga Empreendedora × Endeavor Behring NXTP

Entrega final e registro das decisões de edição.

## Arquivos

| Arquivo | Formato | Uso |
|---|---|---|
| `out/aftermovie_liga_endeavor_nxtp_9x16.mp4` | 1080×1920, 52,0s, 30fps | Reels / Stories / TikTok |
| `out/aftermovie_liga_endeavor_nxtp_4x5.mp4` | 1080×1350, 52,0s, 30fps | Feed do Instagram e LinkedIn |

H.264 High, yuv420p, AAC 256 kbps 48 kHz, `+faststart`.
Loudness **−13,9 LUFS / LRA 4,6 LU** (alvo de redes sociais), pico real abaixo de −1 dBTP.

Material de apoio: `analysis/SB_*.jpg` (storyboard dos 43 planos), `analysis/DECUPAGEM.txt`
(EDL completa), `analysis/INDEX_*.jpg` (índice do bruto), `analysis/QC_FINAL.jpg` (revisão).

---

## Três pontos que você precisa saber antes de aprovar

### 1. Não há falas dos palestrantes no vídeo — e não é por opção editorial

O briefing pedia falas reais com a música abrindo para a mensagem. **Não foi possível.**
Transcrevi todos os 14 clipes com Whisper (modelos `small` e `medium`, português, VAD).
O resultado não é aproveitável e a prova é objetiva:

- `no_speech_prob` entre **0,62 e 0,84** nos trechos com voz;
- os dois modelos produzem **frases completamente diferentes** para o mesmo áudio —
  assinatura clássica de alucinação, não de transcrição;
- loudness do bruto entre **−36 e −20 LUFS**: captação de celular, a vários metros
  do microfone, num galpão com muita reverberação, e ainda recomprimida pelo WhatsApp.

Não coloquei nenhuma frase no vídeo porque qualquer legenda ou corte de fala seria
**inventado** — e o briefing foi explícito em não alterar o sentido do que foi dito.

**No lugar disso**, o momento de respiro que você desenhou continua existindo: em
34–38s a música abre (só pad, sem bateria), a ambiência real da sala sobe e entra uma
mensagem em tipografia. A função narrativa está preservada, sem fabricar citação.

**Para ter as falas de verdade**, qualquer uma destas resolve:
- os arquivos originais da câmera/celular (sem passar por WhatsApp);
- o áudio da mesa de som / do microfone do evento, se foi gravado;
- você me manda por escrito as frases que quer usar e em qual clipe/tempo elas estão.

### 2. A música é composição original, feita para este vídeo

Não usei faixa de biblioteca. `scripts/music.py` sintetiza a trilha do zero:
melodic/organic house, **120 BPM, Lá menor**, progressão Am9 → Fmaj7 → Cadd9 → Gsus.

Dois motivos: **risco zero de licenciamento** (nada de claim ou áudio mudo no Instagram)
e, principalmente, **eu conheço a grade de batidas exata** — o que permitiu cravar os
cortes na batida (ver abaixo). O arranjo tem o arco pedido: intro filtrada → build com
hats → drop → ato 2 → breakdown → drop final → outro, com riser e impacto nas viradas.

Se preferir uma faixa licenciada, é troca de um arquivo: mantendo 120 BPM e a mesma
duração, a decupagem continua sincronizada sem reedição.

### 3. O bruto é de baixa resolução

Todos os 14 vídeos são **464×832 ou 576×1024** (compressão do WhatsApp, ~1,7 Mbps).
Entreguei em 1080×1920 com reescala Lanczos e sharpening leve, porque é o que as redes
esperam — mas a nitidez é limitada pela origem, não pela finalização. Com os arquivos
originais eu re-renderizo tudo em qualidade real sem mudar uma vírgula da edição.

---

## O que o material tinha (e o que não tinha)

Verifiquei o conteúdo de cada arquivo quadro a quadro antes de montar
(`analysis/INDEX_*.jpg`). Isso importa porque os nomes do WhatsApp não dizem nada
sobre o conteúdo — e a numeração **não** segue a ordem cronológica do evento.

| Arquivo | Conteúdo real |
|---|---|
| WA0036 | chegada: participantes na porta de vidro, mochilas, entrando no espaço |
| WA0037 | coffee: arranjo floral, mão arrumando o prato de pães, travessas |
| WA0078 | plateia de trás, sala cheia (camiseta Behring Academy) |
| WA0079 | **painel com as logos Liga / NXTP / Endeavor projetadas** — plano herói |
| WA0080 | painel em ângulo alto lateral (o plano mais nítido de todo o material) |
| WA0084 | plano alto amplo: sala lotada — estabelece a dimensão do evento |
| WA0085 | tilt nas luminárias esféricas e na treliça do galpão |
| WA0086 | plano alto: plateia e palco |
| WA0087 | wide das quatro convidadas em contraluz de janela |
| WA0088 | painel médio — tem a **risada/reação** no final |
| WA0089 | painel médio — troca entre as convidadas, sorrisos |
| WA0090 | painel visto entre as cabeças da plateia (POV) |
| WA0091 | coffee: garrafões de água e suco, mão servindo |
| WA0092 | wide: painel na fachada de vidro |
| Fotos | coffee (103, 104, 105, 106, 107) e plateia (048, 049, 050, 052, 055) |

**Itens do briefing que não existem no material** — não deixei de usar, não havia:

- credenciamento, fila, entrega de materiais, crachás;
- apertos de mão, abraços, cumprimentos;
- aplausos, plateia fazendo perguntas, interação com os palestrantes;
- close-ups de risadas e de conversas no coffee (o coffee só tem a mesa e as bebidas);
- take externo/cinematográfico do local;
- qualquer close de rosto de participante.

Isso muda o equilíbrio real do vídeo: **8 dos 14 clipes são do painel** e só **1** é de
chegada. O Ato 1 é sustentado por 1 clipe de chegada + 2 de coffee + 5 fotos. Se houver
mais material bruto em outro lugar (fotógrafo, celular da organização, stories dos
participantes), é o que mais elevaria o resultado — sobretudo close de gente.

### Por que 52 segundos e não 90

Contei os momentos visualmente distintos do bruto: ~30 em vídeo + 10 fotos verticais
aproveitáveis. Com média de 1,2s por plano, isso dá **~50s antes de começar a repetir
imagem**. Estiquei para 52s (26 compassos exatos). Um vídeo de 90s com este bruto
mostraria o mesmo plano 6–7 vezes, que é justamente o que o briefing pediu para evitar.
Reuso máximo no corte atual: **4×**, sempre com trecho e enquadramento diferentes e
espaçado na linha do tempo. 22 fontes distintas em 43 planos.

---

## Estrutura

| Seção | Tempo | Compassos | Música | Edição |
|---|---|---|---|---|
| Intro | 0–6s | 0–3 | pad + arpejo filtrados | 4 planos de 1,5s |
| Build | 6–12s | 3–6 | entram hats e sub | coffee, cortes de 1,0–1,5s |
| **Drop 1** | 12–24s | 6–12 | kick + clap + hats 16avos | o evento acontece |
| Ato 2 | 24–34s | 12–17 | groove mantido | conteúdo e reações, respiro maior |
| **Breakdown** | 34–38s | 17–19 | só pad, ambiência sobe | mensagem em tipografia |
| **Drop final** | 38–48s | 19–24 | tudo + lead | melhores momentos, cortes de 0,5s |
| Outro | 48–52s | 24–26 | pad decaindo | último plano amplo + end card |

Progressão narrativa: chegam → se encontram → a sala enche → o evento começa →
as ideias são compartilhadas → a plateia reage → a comunidade aparece reunida.

O plano final é o **WA0079 em câmera lenta**, com as logos projetadas na parede — o
fechamento nas marcas acontece dentro da cena real, sem placa gráfica.

## Sincronia com a música

`beat = 0,5s`, `compasso = 2,0s`. Todos os 43 planos têm duração inteira em batidas
(1, 2, 3 ou 4). Verificado no arquivo final por detecção de troca de plano:

```
cortes esperados: 42   trocas detectadas: 42
desvio vs. grade: máx = 0 ms   mediana = 0 ms
cortes fora da grade de 120 BPM: 0
```

Os dois impactos da trilha caem em corte de plano: **12,0s** (plano alto da sala lotada)
e **38,0s** (primeiro flash do drop final).

## Cor

Correção por arquivo, a partir das médias de canal medidas em cada clipe
(`analysis/clipstats.json`), não por filtro global. Cadeia: ganho por canal →
ponto de preto/branco → curva S suave → saturação.

Casos que exigiram tratamento distinto:

- **coffee** (WA0037, WA0091 e fotos 103–107): dominante amarelo-verde forte
  (azul em 79–97 contra vermelho em 119–124). Ganho de azul de 1,24 a 1,36 — neutralizei
  parcialmente, de propósito: neutralizar por completo deixaria a toalha verde e os pães
  com aparência falsa;
- **WA0080**: dominante magenta → ganho de verde;
- **WA0089**: excesso de verde → verde reduzido;
- **WA0079**: pretos lavados (percentil 1 em 20) → ponto de preto puxado e gamma 0,97;
- **WA0087, WA0090, WA0092, fotos de plateia**: altas quase estouradas (percentil 99 em
  244–255) → ponto de branco recuado para rolloff.

Saturação entre 1,04 e 1,10 e tons de pele preservados. Sem look pesado.

## Estabilização

Nove clipes com tremor medido alto passaram por `vidstab` em dois passes
(`smoothing=12`, ~0,4s): remove o tremor de mão e **preserva a panorâmica intencional**.
Os cinco clipes já estáveis (WA0079, 0088, 0089, 0090, 0092) ficaram intactos para não
perder resolução com o crop da estabilização.

Movimento mediano por clipe, antes: WA0037 34,4 · WA0036 30,7 · WA0086 29,4 ·
WA0078 22,8 · WA0084/0087/0091/0080 ~18,5 · WA0085 17,8.

## Áudio

Música (−14 LUFS) + **leito de ambiência com o áudio real da sala** ~20 dB abaixo:
murmurinho e presença, filtrado (170 Hz–5,2 kHz) para textura, sem fala legível.
No breakdown (34–38s) a ambiência sobe: é o momento em que se ouve a sala.

A normalização final é em dois passes com `linear=true`. O `loudnorm` em passe único
age como compressor e achatava o arco dinâmico (LRA caía para 2,8 LU); com ganho
estático o arco intro → drop → breakdown → drop final se mantém em 4,6 LU.

## Textos — copy editável

Gerados como PNG em `scripts/titles.py` (o build de ffmpeg disponível não tem `drawtext`;
desenhar com PIL deu controle melhor de entreletra e sombra). Todos dentro da área
segura para celular: acima de y=1670 no 9:16, longe da UI do Reels.

| Momento | Texto atual |
|---|---|
| 1,6–5,6s | LIGA EMPREENDEDORA / ENDEAVOR BEHRING NXTP |
| 34,3–37,8s | QUEM EMPREENDE / NÃO EMPREENDE SOZINHO |
| 49,9–52,0s | A COMUNIDADE ESTÁ / APENAS COMEÇANDO + assinatura das marcas |

**A mensagem de 34s é copy autoral minha, não citação de ninguém.** Troque pelo que
fizer sentido para vocês — é editar as constantes no topo de `scripts/titles.py`.

## Reproduzir / reeditar

```bash
python3 scripts/music.py      # trilha + grade de batidas (build/grid.json)
python3 scripts/titles.py     # tipografia (PNG RGBA)
python3 scripts/edl.py        # imprime a decupagem
python3 scripts/storyboard.py # storyboard dos planos escolhidos
python3 scripts/render.py     # render completo (9:16 e 4:5)
```

A decupagem inteira é a lista `SHOTS` em `scripts/edl.py`: cada plano é uma linha com
origem, entrada, duração **em batidas** e enquadramento. Mudar a ordem, trocar um plano
ou alterar duração é editar uma linha — a sincronia com a música se mantém automaticamente
porque a duração é expressa em batidas, não em segundos.
