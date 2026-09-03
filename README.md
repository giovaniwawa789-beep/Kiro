# Aftermovie — Liga Empreendedora × Endeavor Behring NXTP

Aftermovie do evento, montado a partir de 14 vídeos e 14 fotos do bruto.
**52,0 s · 43 planos · 120 BPM com todos os cortes na batida.**

## Baixar o vídeo

Os arquivos estão em [`videos/`](videos/). No GitHub, abra o arquivo e clique em
**Download** (ou em *View raw*).

| Arquivo | Tamanho | Resolução | Uso |
|---|---|---|---|
| [`aftermovie_9x16_720p.mp4`](videos/aftermovie_9x16_720p.mp4) | 10,6 MB | 720×1280 | **Reels / Stories — comece por este** |
| [`aftermovie_4x5_720p.mp4`](videos/aftermovie_4x5_720p.mp4) | 8,7 MB | 720×900 | Feed do Instagram e LinkedIn |
| [`aftermovie_9x16_480p.mp4`](videos/aftermovie_9x16_480p.mp4) | 3,7 MB | 480×854 | Se a conexão estiver ruim |

Os masters em 1080p estão anexados na
[Release v1](../../releases/latest), com link direto de download.

> O bruto é 464×832 (compressão do WhatsApp), então **720p já é upscale**: as versões
> acima são visualmente indistinguíveis do master de 1080p — a comparação a 100% está
> em [`analysis/QC_COMPRESSAO.jpg`](analysis/QC_COMPRESSAO.jpg). Instagram e LinkedIn
> recodificam tudo no upload, então enviar o arquivo maior não melhora o resultado.

## Três pontos antes de aprovar

1. **Não há falas dos palestrantes** — e não foi opção editorial. O áudio bruto é
   captação distante, em galpão reverberante e recomprimida: o Whisper devolve
   `no_speech_prob` de 0,62 a 0,84 e os modelos `small` e `medium` produzem frases
   *diferentes* para o mesmo trecho (alucinação). Qualquer frase no vídeo seria
   inventada. O momento de respiro existe (34–38 s), mas com tipografia.
2. **A trilha é composição original** ([`scripts/music.py`](scripts/music.py)),
   120 BPM em Lá menor. Risco zero de licenciamento e grade de batidas exata.
3. **O material não tinha** credenciamento, crachás, apertos de mão, aplausos nem
   close de rosto. 8 dos 14 clipes são do painel e só 1 é de chegada.

Detalhamento completo em **[EDICAO.md](EDICAO.md)**.

## Revisão

| Arquivo | O que é |
|---|---|
| [`analysis/SB_1_ato1.jpg`](analysis/SB_1_ato1.jpg) · [`SB_2`](analysis/SB_2_ato2.jpg) · [`SB_3`](analysis/SB_3_final.jpg) | storyboard dos 43 planos, na ordem do corte |
| [`analysis/DECUPAGEM.txt`](analysis/DECUPAGEM.txt) | EDL completa (origem, entrada, duração, zoom) |
| [`analysis/INDEX_1.jpg`](analysis/INDEX_1.jpg) … [`INDEX_FOTOS`](analysis/INDEX_FOTOS.jpg) | índice do bruto com o nome do arquivo gravado no quadro |
| [`analysis/QC_FINAL.jpg`](analysis/QC_FINAL.jpg) | 24 quadros do resultado, ao longo da linha do tempo |
| [`analysis/clipstats.json`](analysis/clipstats.json) | medições por clipe (nitidez, tremor, exposição, cor) |

## Reeditar

```bash
python3 scripts/music.py      # trilha + grade de batidas
python3 scripts/titles.py     # tipografia (PNG RGBA)
python3 scripts/edl.py        # imprime a decupagem
python3 scripts/render.py     # render completo (9:16 e 4:5)
```

A decupagem inteira é a lista `SHOTS` em [`scripts/edl.py`](scripts/edl.py): uma linha
por plano, com duração **em batidas**. Trocar um plano ou mudar a ordem é editar uma
linha — a sincronia com a música se mantém sozinha.

Requer `ffmpeg` com `vidstab`, `zoompan` e `libx264`, mais `numpy`, `scipy` e `pillow`.
O bruto (`raw/`) e os intermediários (`build/`) não estão versionados.
