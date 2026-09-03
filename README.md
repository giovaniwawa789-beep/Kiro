# Aftermovie — DE BUILDER A FOUNDER

Aftermovie do evento **DE BUILDER A FOUNDER** — Liga Empreendedora da Unicamp, com
Fundação Behring, NXTP, Endeavor e Alexandre Philippi (Sharpi), 25.08.
Montado a partir de 14 vídeos e 14 fotos do bruto.

**56,0 s · 44 planos · 120 BPM com todos os cortes na batida.**

## Baixar o vídeo

Os arquivos estão em [`videos/`](videos/). No GitHub, abra o arquivo e clique em
**Download** (ou em *View raw*).

| Arquivo | Tamanho | Resolução | Uso |
|---|---|---|---|
| [`...9x16_720p.mp4`](videos/aftermovie_de_builder_a_founder_9x16_720p.mp4) | 10,8 MB | 720×1280 | **Reels / Stories — comece por este** |
| [`...4x5_720p.mp4`](videos/aftermovie_de_builder_a_founder_4x5_720p.mp4) | 8,9 MB | 720×900 | Feed do Instagram e LinkedIn |
| [`...9x16_1080p.mp4`](videos/aftermovie_de_builder_a_founder_9x16_1080p.mp4) | 23,6 MB | 1080×1920 | Resolução cheia |
| [`...9x16_480p.mp4`](videos/aftermovie_de_builder_a_founder_9x16_480p.mp4) | 5,0 MB | 480×854 | Se a conexão estiver ruim |

Todas as versões têm os mesmos 1680 quadros, 56,0 s e o mesmo áudio.

## O que mudou nesta versão (v2)

1. **Cartão final com a arte oficial.** A cena do painel escurece (~51 s) e a arte
   *DE BUILDER A FOUNDER* — com as quatro marcas (Liga, Behring Founders, NXTP,
   Endeavor) — **nasce desse preto**. Como a arte já tem fundo preto, a transição
   lê como continuação do escurecimento, não como uma imagem colada.
2. **Trilha nova** ([`scripts/music.py`](scripts/music.py)), composição original:
   melodic/organic house em 120 BPM, progressão Am–C–G–F, piano elétrico (FM),
   gancho melódico, sidechain de verdade e percussão orgânica. Arco dinâmico bem
   mais aberto que a v1 (LRA 6,4 contra 4,6). A versão anterior está preservada em
   [`scripts/music_v1.py`](scripts/music_v1.py).
3. **Textos com o conteúdo real do evento.** Abertura *DE BUILDER A FOUNDER*; a
   mensagem no respiro (34–38 s) usa a copy da própria Liga: *"ficou mais fácil
   criar. ficou mais difícil vencer."* — não é mais texto genérico meu.

## Continua valendo

- **Não há falas dos palestrantes.** O áudio bruto é captação distante e não tem
  fala inteligível (`no_speech_prob` 0,62–0,84; modelos divergem). Qualquer frase
  seria inventada. Por isso a mensagem do respiro entra como tipografia.
- **O bruto é 464×832** (WhatsApp). 720p já é upscale — a versão de 720p é
  visualmente indistinguível da de 1080p.
- **O material não tinha** credenciamento, crachás, apertos de mão, aplausos nem
  close de rosto. 8 dos 14 clipes são do painel e só 1 é de chegada.

> ⚠️ A arte é a peça de **divulgação** ("inscrições abertas · 25 ago · vagas
> limitadas"). Num aftermovie (evento já realizado) esse texto fica um pouco fora
> de contexto. Você pediu para usar a imagem como está, e usei — mas se quiser um
> cartão de encerramento (sem "inscrições abertas"), me mande e eu troco em minutos.

Detalhamento completo em **[EDICAO.md](EDICAO.md)**.

## Reeditar

```bash
python3 scripts/music.py      # trilha + grade de batidas
python3 scripts/titles.py     # tipografia (título + mensagem)
python3 scripts/keyart.py     # cartão final a partir de assets/keyart.jpg
python3 scripts/edl.py        # imprime a decupagem
python3 scripts/render.py     # render completo (9:16 e 4:5)
```

A decupagem inteira é a lista `SHOTS` em [`scripts/edl.py`](scripts/edl.py): uma linha
por plano, com duração **em batidas**. Trocar um plano, a ordem ou a duração é editar
uma linha — a sincronia com a música se mantém sozinha.
