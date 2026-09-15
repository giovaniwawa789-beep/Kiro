#!/usr/bin/env python3
"""Extrai fotos dos reels da Nunes & Lucato para uso no site institucional.

Os arquivos de origem são downloads de Instagram, com dois problemas:
  1. letterbox — tarjas pretas de altura variável;
  2. legenda queimada no pixel, em posição fixa por vídeo.

Estratégia por tipo de frame:
  * produto em fundo branco -> acha a caixa branca e corta abaixo das linhas
    de texto (detecção automática, sem número mágico);
  * demais frames -> corta a faixa da legenda por fração do frame cheio e
    depois remove o letterbox por detecção de linhas escuras.

Índices de frame (1 fps) mapeados a partir de contact sheets numerados.
"""
import os
import glob
import subprocess

import imageio_ffmpeg
import numpy as np
from PIL import Image

FF = imageio_ffmpeg.get_ffmpeg_exe()
SRC = "../Kiro/repertorio_bruto"
TMP = "frames_full"
OUT = "../Kiro/site/assets/fotos"
os.makedirs(OUT, exist_ok=True)

VIDS = sorted(glob.glob(os.path.join(SRC, "*.mp4")))
# v0 = projeto Midea Carrier (legenda no topo)
# v1 = Dia do Meio Ambiente / operação (legenda na base)
# v2 = Santista, porta-vinhos (legenda no topo)
# faixas medidas com régua visual: v0 legenda em 19-34%, v2 em 0-20%
CORTE_LEGENDA = {0: ("top", 0.36), 1: ("bottom", 0.34), 2: ("top", 0.22)}

# (vídeo, frame, nome, aspecto, produto_em_fundo_branco?, modo)
# 'contain' mostra o objeto inteiro (produto); 'cover' preenche o quadro (cena).
PLANO = [
    # --- produtos finais ---
    # obs: o "saco com cordao" (frames 27-28) foi descartado: o corpo da peca
    # fica dentro da faixa da legenda queimada, sobrando so os cordoes.
    (0, 25, "produto_necessaire",       (1000, 1000), True,  "contain"),
    (0, 30, "produto_ecobag",           (1000, 1000), True,  "contain"),
    # --- a origem e o detalhe da marca ---
    (0,  2, "midea_uniforme_origem",    (1000, 1000), False, "contain"),
    (0, 20, "midea_bordado",            (1200, 800),  False, "cover"),
    # --- Santista ---
    (2,  4, "santista_porta_vinhos",    (900, 1200),  False, "cover"),
    # --- operação e pessoas ---
    (1,  8, "operacao_fardos",          (1200, 800),  False, "cover"),
    (1,  6, "residuo_aparas",           (1200, 800),  False, "cover"),
    (1, 12, "artesa_costura",           (1200, 800),  False, "cover"),
    (1, 10, "confeccao_denim",          (1200, 800),  False, "cover"),
    (1,  3, "oficina_chaveiro",         (1000, 1000), False, "cover"),
    (1, 19, "evento_mega_artesanal",    (1200, 800),  False, "cover"),
]


def extrai_frames():
    for i, v in enumerate(VIDS):
        d = os.path.join(TMP, f"v{i}")
        if glob.glob(os.path.join(d, "*.png")):
            continue
        os.makedirs(d, exist_ok=True)
        subprocess.run([FF, "-loglevel", "error", "-i", v, "-vf", "fps=1",
                        os.path.join(d, "%03d.png"), "-y"], check=True)


def tira_letterbox(im, limiar=20):
    a = np.asarray(im.convert("RGB")).astype(np.int16)
    linhas = np.where(a.max(axis=2).mean(axis=1) > limiar)[0]
    if not len(linhas):
        return im
    return im.crop((0, int(linhas[0]), im.width, int(linhas[-1]) + 1))


def tira_texto_base(im, faixa=0.30):
    """Remove linhas de legenda clara sobre fundo escuro na base da imagem."""
    a = np.asarray(im.convert("L")).astype(np.int16)
    h = a.shape[0]
    y0 = int(h * (1 - faixa))
    media = a.mean(axis=1)
    claros = (a > 232).mean(axis=1)
    # linha de legenda: fundo escuro, poucos pixels muito claros (o texto)
    cand = [y for y in range(y0, h) if media[y] < 105 and claros[y] > 0.004]
    if cand:
        im = im.crop((0, 0, im.width, max(0, min(cand) - 4)))
    return im


def recorta_produto(im):
    """Isola a região de fundo branco do estúdio (a legenda já foi cortada)."""
    a = np.asarray(im.convert("L")).astype(np.int16)
    lin = np.where((a > 200).mean(axis=1) > 0.35)[0]
    col = np.where((a > 200).mean(axis=0) > 0.35)[0]
    if len(lin) and len(col):
        im = im.crop((int(col[0]), int(lin[0]), int(col[-1]) + 1, int(lin[-1]) + 1))
    return im


def encaixa(im, alvo, modo="cover", fundo=(255, 255, 255)):
    """'cover' recorta para preencher; 'contain' reduz e centraliza no quadro."""
    tw, th = alvo
    if modo == "contain":
        m = 0.94                                  # respiro de 6%
        r = min(tw * m / im.width, th * m / im.height)
        nw, nh = max(1, int(im.width * r)), max(1, int(im.height * r))
        red = im.resize((nw, nh), Image.LANCZOS)
        canvas = Image.new("RGB", alvo, fundo)
        canvas.paste(red, ((tw - nw) // 2, (th - nh) // 2))
        return canvas
    return recorta_aspecto(im, alvo)


def recorta_aspecto(im, alvo):
    tw, th = alvo
    ar_alvo, ar = tw / th, im.width / im.height
    if ar > ar_alvo:
        nw = int(im.height * ar_alvo)
        x = (im.width - nw) // 2
        im = im.crop((x, 0, x + nw, im.height))
    else:
        nh = int(im.width / ar_alvo)
        y = (im.height - nh) // 2
        im = im.crop((0, y, im.width, y + nh))
    return im.resize(alvo, Image.LANCZOS)


extrai_frames()
print("processando fotos:")
for vi, idx, nome, alvo, produto, modo in PLANO:
    src = os.path.join(TMP, f"v{vi}", f"{idx:03d}.png")
    if not os.path.exists(src):
        print(f"  !! ausente: {src}")
        continue

    im = Image.open(src)
    lado, frac = CORTE_LEGENDA[vi]
    h = im.height
    if lado == "top":
        im = im.crop((0, int(h * frac), im.width, h))
    else:
        im = im.crop((0, 0, im.width, int(h * (1 - frac))))
    im = tira_letterbox(im)
    if lado == "bottom":
        im = tira_texto_base(im)
        im = tira_letterbox(im)
    if produto:
        im = recorta_produto(im)

    # fundo do "contain": branco no produto, tom claro da identidade nas cenas
    fundo = (255, 255, 255) if produto else (244, 245, 252)
    im = encaixa(im, alvo, modo, fundo)
    dst = os.path.join(OUT, nome + ".jpg")
    im.save(dst, quality=85, optimize=True, progressive=True)
    print(f"  {nome}.jpg  {alvo[0]}x{alvo[1]}  {os.path.getsize(dst)/1024:.0f} KB")

print("\nfotos em", OUT)
