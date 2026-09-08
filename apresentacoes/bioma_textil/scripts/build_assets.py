#!/usr/bin/env python3
"""
Prepara os ativos visuais do deck Nunes & Lucato / Bioma Textil.

FONTES PERMITIDAS (exclusivamente arquivos proprios da Nunes & Lucato):
  - Logo oficial ............... Kiro/videos/360355.jpg
  - Fotos do Ecoponto Belezinho  Kiro/videos/360364 / 360368 / 360370 /
                                 360376 / 360379 .jpg

Nao utiliza nenhuma imagem de terceiros. Os fundos degrade e as texturas
sao gerados nativamente no PPTX (gradiente + formas vetoriais editaveis),
portanto nao ha fundo rasterizado aqui.
"""
import os
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

# caminhos relativos ao proprio arquivo: scripts/ -> bioma_textil/ -> ... -> repo
_HERE = os.path.dirname(os.path.abspath(__file__))
_PROJ = os.path.dirname(_HERE)
_REPO = os.path.dirname(os.path.dirname(_PROJ))

VID = os.environ.get("NL_VIDEOS", os.path.join(_REPO, "videos"))
OUT = os.environ.get("NL_ASSETS", os.path.join(_PROJ, "assets"))
os.makedirs(OUT, exist_ok=True)

# paleta institucional (derivada da identidade Nunes & Lucato)
INDIGO_DK = (0x17, 0x16, 0x5D)
PAPER     = (0xEE, 0xF0, 0xFC)


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(3))


def ramp(c0, c1, n=256):
    return [lerp(c0, c1, i / (n - 1)) for i in range(n)]


# ============================================================ 1. LOGOMARCA
def build_logo():
    src = Image.open(f"{VID}/360355.jpg").convert("L")
    print(f"[logo] origem {src.size}  lum min={min(src.getdata())} max={max(src.getdata())}")

    # alpha a partir da luminancia (fundo branco -> transparente),
    # preservando o antialiasing original do arquivo
    LO_W, LO_D = 244, 70
    alpha = src.point(lambda v: 0 if v >= LO_W else
                      (255 if v <= LO_D else int(round(255 * (LO_W - v) / (LO_W - LO_D)))))
    bbox = alpha.getbbox()
    alpha_c, lum_c = alpha.crop(bbox), src.crop(bbox)

    # versao original: mantem o cinza-carvao do arquivo, so remove o fundo
    Image.merge("RGBA", (lum_c, lum_c, lum_c, alpha_c)).save(f"{OUT}/logo_dark.png")

    # versao knockout branco, para aplicacao sobre fundo indigo/escuro
    white = Image.new("L", alpha_c.size, 255)
    Image.merge("RGBA", (white, white, white, alpha_c)).save(f"{OUT}/logo_white.png")

    w, h = alpha_c.size
    print(f"[logo] recorte {w}x{h}  proporcao={w/h:.4f}  -> logo_dark.png / logo_white.png")
    return w / h


# ============================================================ 2. FOTOGRAFIAS
def prep(src, dst, aspect, centering=(0.5, 0.5), bright=1.0, contrast=1.0,
         sat=1.0, target_w=1900, sharpen=True):
    im = Image.open(os.path.join(VID, src)).convert("RGB")
    # cutoff baixo no lado claro preserva as altas (pisos claros estouravam)
    im = ImageOps.autocontrast(im, cutoff=(0.5, 0.05))
    if bright != 1.0:
        im = ImageEnhance.Brightness(im).enhance(bright)
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    if sat != 1.0:
        im = ImageEnhance.Color(im).enhance(sat)
    tw = min(target_w, im.width)
    th = int(round(tw / aspect))
    im = ImageOps.fit(im, (tw, th), Image.LANCZOS, centering=centering)
    if sharpen:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=55, threshold=3))
    im.save(os.path.join(OUT, dst), quality=93, optimize=True)
    print(f"[foto] {dst:24s} {im.size}  ({src})")


def duo(src, dst, aspect, centering=(0.5, 0.5), target_w=1900, gamma=0.72):
    """Duotone institucional: sombras indigo -> altas quase brancas.
    O gamma < 1 empurra os meios-tons para a faixa clara, evitando o
    aspecto 'roxo chapado' e mantendo a leitura aerada/executiva."""
    im = Image.open(os.path.join(VID, src)).convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=(0.5, 0.5))
    tw = min(target_w, im.width)
    th = int(round(tw / aspect))
    im = ImageOps.fit(im, (tw, th), Image.LANCZOS, centering=centering)
    g = ImageOps.grayscale(im)

    stops = [(0.00, (0x0F, 0x0F, 0x36)),
             (0.45, (0x3A, 0x44, 0xA6)),
             (0.78, (0x9C, 0xA6, 0xDE)),
             (1.00, (0xF5, 0xF7, 0xFE))]
    lut = []
    for i in range(256):
        t = (i / 255.0) ** gamma
        for j in range(len(stops) - 1):
            p0, c0 = stops[j]
            p1, c1 = stops[j + 1]
            if p0 <= t <= p1:
                lut.append(lerp(c0, c1, (t - p0) / (p1 - p0) if p1 > p0 else 0))
                break
        else:
            lut.append(stops[-1][1])

    out = Image.new("RGB", g.size)
    out.putdata([lut[v] for v in g.getdata()])
    out.save(os.path.join(OUT, dst), quality=93, optimize=True)
    print(f"[duo ] {dst:24s} {out.size}  ({src})")


def build_photos():
    # 360376 = area livre sob o viaduto (colunas + tela): foto-chave do projeto
    prep("360376.jpg", "eco_area.jpg",       4 / 3,  (0.5, 0.55), 1.10, 1.04, 0.92)
    prep("360376.jpg", "eco_area_wide.jpg", 16 / 9,  (0.5, 0.50), 1.12, 1.04, 0.92)
    prep("360376.jpg", "eco_area_tall.jpg",  2 / 3,  (0.5, 0.55), 1.10, 1.04, 0.92)
    # 360364 = fachada / portao
    prep("360364.jpg", "eco_fachada.jpg",    4 / 3,  (0.5, 0.50), 1.08, 1.05, 0.95)
    # 360379 / 360368 = vaos internos longos (originais subexpostos ao fundo e
    # estourados no piso -> sem ganho de brilho, apenas contraste suave)
    # centering acima do meio: o miolo das fotos verticais e so piso
    prep("360379.jpg", "eco_corredor.jpg",   3 / 4,  (0.5, 0.30), 0.98, 1.02, 0.94)
    prep("360368.jpg", "eco_vao.jpg",        3 / 4,  (0.5, 0.28), 0.96, 1.02, 0.94)
    prep("360368.jpg", "eco_vao_wide.jpg",  16 / 10, (0.5, 0.28), 0.96, 1.02, 0.94)
    # 360370 = area coberta / sala interna
    prep("360370.jpg", "eco_galpao.jpg",     3 / 4,  (0.5, 0.34), 1.00, 1.03, 0.94)
    prep("360370.jpg", "eco_galpao_wide.jpg", 16 / 10, (0.5, 0.34), 1.00, 1.03, 0.94)

    # duotones institucionais (indigo) para capa, divisores e encerramento
    duo("360376.jpg", "duo_area_tall.jpg",  2 / 3,  (0.5, 0.55))
    duo("360376.jpg", "duo_area_wide.jpg", 16 / 9,  (0.5, 0.50))
    duo("360370.jpg", "duo_galpao_wide.jpg", 16 / 9, (0.5, 0.45))
    duo("360364.jpg", "duo_fachada_wide.jpg", 16 / 9, (0.5, 0.50))
    duo("360379.jpg", "duo_corredor_tall.jpg", 2 / 3, (0.5, 0.50))


if __name__ == "__main__":
    build_logo()
    build_photos()
    print("\nOK -> ativos em", OUT)
