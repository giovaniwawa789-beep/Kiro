#!/usr/bin/env python3
"""Cartao final do aftermovie.

Se a arte oficial estiver em assets/keyart.(png|jpg), ela e usada como esta,
apenas ajustada ao quadro 9:16 sobre fundo preto -- e como a arte ja tem fundo
preto, a juncao fica invisivel e a entrada parece continuacao da cena escurecendo.

Se a arte nao estiver disponivel, gera um cartao TIPOGRAFICO equivalente para
que o corte possa ser aprovado. O substituto reproduz o texto da arte, mas NAO
reproduz as quatro logos (Liga, Behring Founders, NXTP, Endeavor): desenhar
marcas de terceiros de memoria sairia errado, entao elas entram como creditos
em texto ate a arte oficial chegar.
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1080, 1920
ROOT = '/projects/sandbox/aftermovie'
OUT = f'{ROOT}/build/titles/endcard.png'
BLACK = '/usr/share/fonts/google-noto/NotoSans-Black.ttf'
MED = '/usr/share/fonts/google-noto/NotoSans-Medium.ttf'
YELLOW = (247, 184, 0)
GREY = (168, 168, 168)


def find_art():
    for ext in ('png', 'jpg', 'jpeg', 'webp'):
        p = f'{ROOT}/assets/keyart.{ext}'
        if os.path.exists(p):
            return p
    return None


def from_art(path):
    """Encaixa a arte oficial no quadro 9:16 sobre preto, sem distorcer."""
    art = Image.open(path).convert('RGB')
    canvas = Image.new('RGB', (W, H), (0, 0, 0))
    # ocupa 92% da largura, preservando a proporcao
    tw = int(W * 0.92)
    th = int(art.height * tw / art.width)
    if th > H * 0.86:                      # se ficar alta demais, limita pela altura
        th = int(H * 0.86)
        tw = int(art.width * th / art.height)
    art = art.resize((tw, th), Image.LANCZOS)
    canvas.paste(art, ((W - tw) // 2, (H - th) // 2))
    return canvas


def tracked(d, text, font, size, x, y, fill, track=0):
    f = ImageFont.truetype(font, size)
    for c in text:
        d.text((x, y), c, font=f, fill=fill)
        x += d.textlength(c, font=f) + track
    return x


def stand_in():
    img = Image.new('RGB', (W, H), (0, 0, 0))
    d = ImageDraw.Draw(img)
    x0 = 86
    tracked(d, 'DE', BLACK, 150, x0, 690, (255, 255, 255), track=-2)
    tracked(d, 'BUILDER A', BLACK, 150, x0, 838, (255, 255, 255), track=-2)
    tracked(d, 'FOUNDER', BLACK, 150, x0, 986, YELLOW, track=-2)
    tracked(d, 'UMA EXPERIÊNCIA DE EMPREENDEDORISMO', MED, 27, x0 + 4, 1168, GREY, track=2)
    d.rectangle([x0, 1330, W - x0, 1331], fill=(58, 58, 58))
    marks = 'LIGA EMPREENDEDORA    ·    BEHRING FOUNDERS    ·    NXTP    ·    ENDEAVOR'
    f = ImageFont.truetype(MED, 22)
    wid = sum(d.textlength(c, font=f) + 1.5 for c in marks)
    tracked(d, marks, MED, 22, (W - wid) / 2, 1372, (214, 214, 214), track=1.5)
    return img


if __name__ == '__main__':
    os.makedirs(f'{ROOT}/build/titles', exist_ok=True)
    art = find_art()
    if art:
        from_art(art).save(OUT)
        print(f'cartao final a partir da arte oficial: {art}')
    else:
        stand_in().save(OUT)
        print('AVISO: assets/keyart.png nao encontrada -> cartao TIPOGRAFICO '
              'substituto (sem as quatro logos).')
        print('       Coloque a arte em assets/keyart.png e rode de novo para trocar.')
    print('->', OUT)
