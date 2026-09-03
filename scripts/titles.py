#!/usr/bin/env python3
"""Tipografia do aftermovie gerada como PNG RGBA e composta via overlay.

O build de ffmpeg disponivel nao tem o filtro drawtext, e desenhar com PIL da
controle melhor de entreletra, sombra e opacidade do que o drawtext daria.

COPY EDITAVEL: nao ha falas transcritas dos palestrantes (o audio bruto e
captacao distante e nao tem fala inteligivel - ver EDICAO.md). Por isso a
mensagem do breakdown entra como tipografia autoral, nunca como citacao
atribuida a alguem.
"""
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1080, 1920
OUT = '/projects/sandbox/aftermovie/build/titles'
os.makedirs(OUT, exist_ok=True)

BLACK = '/usr/share/fonts/google-noto/NotoSans-Black.ttf'
BOLD = '/usr/share/fonts/google-noto/NotoSans-Bold.ttf'
MED = '/usr/share/fonts/google-noto/NotoSans-Medium.ttf'

TITLE_1 = 'LIGA EMPREENDEDORA'
TITLE_2 = 'ENDEAVOR BEHRING NXTP'
MSG_1 = 'QUEM EMPREENDE'
MSG_2 = 'NÃO EMPREENDE SOZINHO'
END_1 = 'A COMUNIDADE ESTÁ'
END_2 = 'APENAS COMEÇANDO'
END_3 = 'LIGA EMPREENDEDORA   ×   ENDEAVOR BEHRING NXTP'


def draw_tracked(d, text, font, size, y, fill, track=0, center=True, x0=None):
    """Desenha texto com entreletra (tracking) controlada."""
    f = ImageFont.truetype(font, size)
    widths = [d.textlength(c, font=f) for c in text]
    total = sum(widths) + track * (len(text) - 1)
    x = (W - total) / 2 if center else x0
    for c, w in zip(text, widths):
        d.text((x, y), c, font=f, fill=fill)
        x += w + track
    return total


def layer(draw_fn):
    """Desenha numa camada e devolve imagem + sombra suave (legibilidade)."""
    img = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    draw_fn(d)
    # sombra: copia preta do alfa, deslocada e desfocada
    alpha = img.split()[3]
    sh = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    sh.putalpha(alpha.filter(ImageFilter.GaussianBlur(9)))
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    shadow.paste(sh, (0, 5))
    # reduz a intensidade da sombra
    sa = shadow.split()[3].point(lambda v: int(v * 0.62))
    shadow.putalpha(sa)
    return Image.alpha_composite(shadow, img)


def rule(d, y, w=64, alpha=210):
    d.rectangle([(W - w) / 2, y, (W + w) / 2, y + 3], fill=(255, 255, 255, alpha))


# ------------------------------------------------------------------- titulo
def _title(d):
    rule(d, 1108, 56)
    draw_tracked(d, TITLE_1, BLACK, 68, 1140, (255, 255, 255, 255), track=1)
    draw_tracked(d, TITLE_2, MED, 38, 1236, (255, 255, 255, 236), track=5)


# ---------------------------------------------------------------- mensagem
def _msg(d):
    draw_tracked(d, MSG_1, BLACK, 68, 842, (255, 255, 255, 255), track=1)
    draw_tracked(d, MSG_2, BLACK, 68, 932, (255, 255, 255, 255), track=1)


# ---------------------------------------------------------------- end card
def _end(d):
    draw_tracked(d, END_1, BLACK, 68, 828, (255, 255, 255, 255), track=1)
    draw_tracked(d, END_2, BLACK, 68, 922, (255, 255, 255, 255), track=1)
    rule(d, 1042, 72)
    draw_tracked(d, END_3, MED, 29, 1076, (255, 255, 255, 226), track=3)


if __name__ == '__main__':
    for name, fn in (('title', _title), ('msg', _msg), ('end', _end)):
        p = f'{OUT}/{name}.png'
        layer(fn).save(p)
        print('gerado', p)
