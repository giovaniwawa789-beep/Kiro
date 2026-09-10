#!/usr/bin/env python3
"""Extrai o símbolo (agulha + linha) isolado da logomarca Nunes & Lucato.

A logomarca é uma assinatura horizontal: símbolo à esquerda, logotipo à direita.
O script localiza a coluna vazia que separa os dois blocos e recorta só o símbolo,
gerando os arquivos de marca reduzida (favicon, avatar, selo de app).
"""
from PIL import Image
import numpy as np
import os

SRC = "img"
OUT = "../assets"
os.makedirs(OUT, exist_ok=True)


def content_mask(im):
    """Retorna máscara booleana (h, w) de pixels com tinta."""
    im = im.convert("RGBA")
    a = np.array(im)
    alpha = a[:, :, 3].astype(float) / 255.0
    # luminância invertida: tinta escura = conteúdo
    lum = a[:, :, :3].mean(axis=2) / 255.0
    # para a versão branca, a tinta é clara -> usar distância do meio
    ink_dark = (1.0 - lum) * alpha
    ink_light = lum * alpha
    return ink_dark, ink_light, alpha


def find_symbol_box(path, white=False):
    im = Image.open(path)
    ink_dark, ink_light, alpha = content_mask(im)
    ink = ink_light if white else ink_dark
    # só considera onde há alpha
    col = (ink * (alpha > 0.05)).sum(axis=0)
    thr = col.max() * 0.02
    filled = col > thr
    w = len(filled)

    # primeiro bloco de conteúdo a partir da esquerda
    i = 0
    while i < w and not filled[i]:
        i += 1
    start = i
    # avança até encontrar um vão horizontal significativo (>= 2.5% da largura)
    gap_needed = max(6, int(w * 0.025))
    end = start
    j = start
    while j < w:
        if filled[j]:
            end = j
            j += 1
        else:
            k = j
            while k < w and not filled[k]:
                k += 1
            if k - j >= gap_needed:
                break
            j = k
    # linhas
    row = (ink * (alpha > 0.05))[:, start:end + 1].sum(axis=1)
    rthr = row.max() * 0.02
    rows = np.where(row > rthr)[0]
    top, bot = int(rows[0]), int(rows[-1])
    return start, top, end + 1, bot + 1


def export(path, white, tag):
    box = find_symbol_box(path, white)
    im = Image.open(path).convert("RGBA")
    sym = im.crop(box)
    w, h = sym.size
    # quadro quadrado com respiro de 12%
    side = int(max(w, h) * 1.24)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(sym, ((side - w) // 2, (side - h) // 2), sym)
    out = os.path.join(OUT, f"simbolo_{tag}.png")
    canvas.save(out)
    print(f"{tag}: recorte {box} -> {w}x{h}  quadro {side}x{side}  -> {out}")
    # PNGs de favicon a partir da versão escura
    if tag == "grafite":
        for s in (512, 180, 64, 32, 16):
            canvas.resize((s, s), Image.LANCZOS).save(
                os.path.join(OUT, f"favicon_{s}.png"))
        print("  favicons: 512, 180, 64, 32, 16")
    return box


export("img/logo_dark.png", False, "grafite")
export("img/logo_white.png", True, "branco")
