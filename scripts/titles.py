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

# Nome real do evento e copy da propria Liga, tirados do post de divulgacao
# (instagram.com/p/DcBfSGjxTEN). A mensagem do breakdown NAO e mais texto
# autoral meu: e a frase que a Liga escreveu para anunciar o evento, em
# minusculas como eles usam.
TITLE_1 = 'DE BUILDER A'
TITLE_2 = 'FOUNDER'
TITLE_3 = 'uma experiência de empreendedorismo'
MSG_1 = 'ficou mais fácil criar.'
MSG_2 = 'ficou mais difícil vencer.'
YELLOW = (247, 184, 0)


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
    rule(d, 1058, 56)
    draw_tracked(d, TITLE_1, BLACK, 76, 1090, (255, 255, 255, 255), track=0)
    draw_tracked(d, TITLE_2, BLACK, 76, 1184, YELLOW + (255,), track=0)
    draw_tracked(d, TITLE_3, MED, 30, 1300, (255, 255, 255, 224), track=3)


# ---------------------------------------------------------------- mensagem
def _msg(d):
    draw_tracked(d, MSG_1, BLACK, 70, 838, (255, 255, 255, 240), track=0)
    draw_tracked(d, MSG_2, BLACK, 70, 934, YELLOW + (255,), track=0)


# ---------------------------------------------------------------- end card
if __name__ == '__main__':
    for name, fn in (('title', _title), ('msg', _msg)):
        p = f'{OUT}/{name}.png'
        layer(fn).save(p)
        print('gerado', p)
