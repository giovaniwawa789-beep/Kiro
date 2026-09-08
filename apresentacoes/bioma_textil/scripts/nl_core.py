#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de design do deck Nunes & Lucato — Bioma Textil / Ecoponto Belezinho.

Tudo e construido com formas nativas do PowerPoint (autoshapes + freeform),
portanto 100% editavel: nenhum icone rasterizado, nenhum fundo achatado.
"""
import math
from lxml import etree

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn

# ============================================================== DIMENSOES
W_IN, H_IN = 13.3333, 7.5
ML, MR = 0.85, 0.85          # margens laterais
CW = W_IN - ML - MR          # 11.6333 largura util
CR = W_IN - MR               # borda direita do conteudo

FOOT_RULE_Y = 6.78
FOOT_LOGO_Y = 6.94
FOOT_LOGO_H = 0.255
LOGO_RATIO = 4.8613          # proporcao original da logomarca

# ================================================================ PALETA
# paleta institucional Nunes & Lucato (indigo) + apoios sustentabilidade
INK        = "14142E"   # navy quase preto - texto principal
INK_SOFT   = "3A3C55"
INDIGO     = "3432C9"   # indigo institucional
INDIGO_MID = "24238E"
INDIGO_DK  = "17165D"
INDIGO_DP  = "0E0D28"
NIGHT      = "090818"
GREY       = "6E7288"   # texto secundario
GREY_LT    = "9A9DB0"
RULE       = "DFE2F0"
RULE_SOFT  = "EDEFF8"
TINT       = "F4F5FC"   # fundo de cartao levissimo
TINT_2     = "EEF0FB"
WHITE      = "FFFFFF"
GREEN      = "12A87B"   # sustentabilidade
GREEN_DK   = "0B7F5C"
GREEN_LT   = "E7F6F1"
AQUA       = "1E86C9"   # azul complementar (ciclo / agua)
AQUA_LT    = "E6F2FA"
AMBER      = "B08535"   # usado so no "modelo tradicional" (contraponto discreto)
NEUTRAL    = "8A8EA3"

# ============================================================= TIPOGRAFIA
F_LIGHT = "Montserrat Light"
F_REG   = "Montserrat"
F_MED   = "Montserrat Medium"
F_SB    = "Montserrat SemiBold"


def use_font_family(family):
    """Permite gerar variante com Aptos/Calibri se Montserrat nao existir."""
    global F_LIGHT, F_REG, F_MED, F_SB
    if family == "montserrat":
        F_LIGHT, F_REG, F_MED, F_SB = ("Montserrat Light", "Montserrat",
                                       "Montserrat Medium", "Montserrat SemiBold")
    else:
        F_LIGHT = F_REG = F_MED = F_SB = family


# =========================================================== XML UTILITARIOS
def _sub(parent, tag, **attrs):
    el = etree.SubElement(parent, qn(tag))
    for k, v in attrs.items():
        el.set(k, str(v))
    return el


def _clear_fill(spPr):
    for tag in ("a:noFill", "a:solidFill", "a:gradFill", "a:blipFill",
                "a:pattFill", "a:grpFill"):
        for e in spPr.findall(qn(tag)):
            spPr.remove(e)


def _fill_anchor(spPr):
    """Insere o fill na posicao correta do spPr (depois de geom, antes de ln)."""
    return ("a:ln", "a:effectLst", "a:effectDag", "a:scene3d", "a:sp3d", "a:extLst")


def grad_fill(shape, stops, angle=0.0):
    """stops = [(pos 0..1, 'RRGGBB'[, alpha 0..1]), ...] ; angle em graus."""
    spPr = shape._element.spPr
    _clear_fill(spPr)
    grad = etree.SubElement(spPr, qn("a:gradFill"))
    grad.set("flip", "none")
    grad.set("rotWithShape", "1")
    gsLst = _sub(grad, "a:gsLst")
    for st in stops:
        pos, rgb = st[0], st[1]
        alpha = st[2] if len(st) > 2 else None
        gs = _sub(gsLst, "a:gs", pos=int(round(pos * 100000)))
        clr = _sub(gs, "a:srgbClr", val=rgb)
        if alpha is not None:
            _sub(clr, "a:alpha", val=int(round(alpha * 100000)))
    _sub(grad, "a:lin", ang=int(round(angle * 60000)), scaled="0")
    spPr.remove(grad)
    spPr.insert_element_before(grad, *_fill_anchor(spPr))
    return shape


def solid_fill(shape, rgb, alpha=None):
    spPr = shape._element.spPr
    _clear_fill(spPr)
    sf = etree.SubElement(spPr, qn("a:solidFill"))
    clr = _sub(sf, "a:srgbClr", val=rgb)
    if alpha is not None:
        _sub(clr, "a:alpha", val=int(round(alpha * 100000)))
    spPr.remove(sf)
    spPr.insert_element_before(sf, *_fill_anchor(spPr))
    return shape


def no_fill(shape):
    spPr = shape._element.spPr
    _clear_fill(spPr)
    nf = etree.SubElement(spPr, qn("a:noFill"))
    spPr.remove(nf)
    spPr.insert_element_before(nf, *_fill_anchor(spPr))
    return shape


def set_line(shape, rgb=None, w=1.0, alpha=None, cap="rnd", dash=None):
    """Contorno fino com ponta arredondada (aspecto de icone linear)."""
    spPr = shape._element.spPr
    for e in spPr.findall(qn("a:ln")):
        spPr.remove(e)
    ln = etree.Element(qn("a:ln"))
    ln.set("w", str(int(round(w * 12700))))
    ln.set("cap", cap)
    if rgb is None:
        _sub(ln, "a:noFill")
    else:
        sf = _sub(ln, "a:solidFill")
        clr = _sub(sf, "a:srgbClr", val=rgb)
        if alpha is not None:
            _sub(clr, "a:alpha", val=int(round(alpha * 100000)))
    if dash:
        _sub(ln, "a:prstDash", val=dash)
    _sub(ln, "a:round")
    spPr.insert_element_before(ln, "a:effectLst", "a:effectDag", "a:scene3d",
                               "a:sp3d", "a:extLst")
    return shape


def flat(shape):
    """Zera efeitos herdados do tema (sombra) e a referencia de estilo.

    O template padrao aplica <p:style> com effectRef do tema, o que gera
    sombra em formas fechadas e conectores. Um <a:effectLst/> vazio dentro
    de spPr sobrescreve essa heranca e mantem o desenho totalmente flat.
    """
    el = shape._element
    for st in el.findall(qn("p:style")):
        el.remove(st)
    spPr = getattr(el, "spPr", None)
    if spPr is None:
        return shape
    for e in spPr.findall(qn("a:effectLst")):
        spPr.remove(e)
    eff = etree.Element(qn("a:effectLst"))
    try:
        spPr.insert_element_before(eff, "a:effectDag", "a:scene3d", "a:sp3d",
                                   "a:extLst")
    except Exception:
        spPr.append(eff)
    return shape


def add_transition(slide, dur=650):
    """Transicao fade discreta em cada slide."""
    sld = slide._element
    xml = (
        '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">'
        '<mc:Choice xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p14">'
        f'<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="slow" p14:dur="{dur}">'
        '<p:fade/></p:transition></mc:Choice><mc:Fallback>'
        '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="slow">'
        '<p:fade/></p:transition></mc:Fallback></mc:AlternateContent>')
    frag = etree.fromstring(xml)
    clrMapOvr = sld.find(qn("p:clrMapOvr"))
    if clrMapOvr is not None:
        clrMapOvr.addnext(frag)
    else:
        sld.find(qn("p:cSld")).addnext(frag)


# ============================================================ FORMAS BASICAS
def rect(sl, x, y, w, h, fill=None, alpha=None, line=None, lw=1.0,
         line_alpha=None, shape=MSO_SHAPE.RECTANGLE, adj=None, rot=None,
         grad=None, grad_angle=0.0, dash=None):
    s = sl.shapes.add_shape(shape, Inches(x), Inches(y), Inches(w), Inches(h))
    flat(s)
    s.text_frame.text = ""
    if adj is not None:
        try:
            s.adjustments[0] = adj
        except Exception:
            pass
    if grad:
        grad_fill(s, grad, grad_angle)
    elif fill:
        solid_fill(s, fill, alpha)
    else:
        no_fill(s)
    if line:
        set_line(s, line, lw, line_alpha, dash=dash)
    else:
        set_line(s, None)
    if rot:
        s.rotation = rot
    return s


def hline(sl, x, y, w, color=RULE, lw=1.0, alpha=None, dash=None):
    c = sl.shapes.add_connector(1, Inches(x), Inches(y), Inches(x + w), Inches(y))
    flat(c)
    set_line(c, color, lw, alpha, dash=dash)
    return c


def vline(sl, x, y, h, color=RULE, lw=1.0, alpha=None, dash=None):
    c = sl.shapes.add_connector(1, Inches(x), Inches(y), Inches(x), Inches(y + h))
    flat(c)
    set_line(c, color, lw, alpha, dash=dash)
    return c


def line(sl, x1, y1, x2, y2, color=RULE, lw=1.0, alpha=None, dash=None):
    c = sl.shapes.add_connector(1, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    flat(c)
    set_line(c, color, lw, alpha, dash=dash)
    return c


def circle(sl, cx, cy, d, fill=None, alpha=None, line=None, lw=1.0,
           line_alpha=None):
    return rect(sl, cx - d / 2, cy - d / 2, d, d, fill=fill, alpha=alpha,
                line=line, lw=lw, line_alpha=line_alpha, shape=MSO_SHAPE.OVAL)


# ================================================================== TEXTO
_AL = {"l": PP_ALIGN.LEFT, "c": PP_ALIGN.CENTER, "r": PP_ALIGN.RIGHT,
       "j": PP_ALIGN.JUSTIFY}
_AN = {"t": MSO_ANCHOR.TOP, "m": MSO_ANCHOR.MIDDLE, "b": MSO_ANCHOR.BOTTOM}


def _style_run(r, font, size, color, bold=False, italic=False, tracking=None,
               caps=False):
    r.font.name = font
    r.font.size = Pt(size)
    r.font.bold = bold
    r.font.italic = italic
    r.font.color.rgb = RGBColor.from_string(color)
    rPr = r.font._rPr
    if tracking:
        rPr.set("spc", str(int(round(tracking * 100))))
    if caps:
        rPr.set("cap", "all")
    # garante a fonte tambem em latin/cs
    for tag in ("a:latin", "a:cs"):
        for e in rPr.findall(qn(tag)):
            e.set("typeface", font)


def txt(sl, x, y, w, h, text="", font=None, size=11, color=GREY, bold=False,
        italic=False, align="l", anchor="t", ls=1.35, tracking=None, caps=False,
        space_after=0, wrap=True, autofit=False):
    """Caixa de texto simples (um paragrafo, aceita \n)."""
    font = font or F_REG
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    flat(tb)
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = _AN[anchor]
    lines = str(text).split("\n")
    for i, ln in enumerate(lines):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = _AL[align]
        p.line_spacing = ls
        if space_after:
            p.space_after = Pt(space_after)
        r = p.add_run()
        r.text = ln
        _style_run(r, font, size, color, bold, italic, tracking, caps)
    return tb


def rich(sl, x, y, w, h, parts, font=None, size=11, color=GREY, align="l",
         anchor="t", ls=1.35, tracking=None, caps=False, wrap=True):
    """parts = [(texto, {overrides})...] num unico paragrafo (varios estilos)."""
    font = font or F_REG
    tb = sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    flat(tb)
    tf = tb.text_frame
    tf.word_wrap = wrap
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = _AN[anchor]
    p = tf.paragraphs[0]
    p.alignment = _AL[align]
    p.line_spacing = ls
    for item in parts:
        t, ov = (item, {}) if isinstance(item, str) else item
        r = p.add_run()
        r.text = t
        _style_run(r, ov.get("font", font), ov.get("size", size),
                   ov.get("color", color), ov.get("bold", False),
                   ov.get("italic", False), ov.get("tracking", tracking),
                   ov.get("caps", caps))
    return tb


def bullets(sl, x, y, w, h, items, font=None, size=10.5, color=GREY, ls=1.32,
            gap=7, dot_color=None, dot_r=0.038, dot_dx=0.0, line_h=None):
    """Lista com marcador circular vetorial (sem bullets de template)."""
    font = font or F_REG
    dot_color = dot_color or INDIGO
    lh = line_h or (size * ls / 72.0)
    yy = y
    for it in items:
        circle(sl, x + dot_dx + dot_r, yy + lh * 0.44, dot_r * 2, fill=dot_color)
        tb = txt(sl, x + dot_dx + dot_r * 2 + 0.13, yy, w - 0.2, lh * 3,
                 it, font=font, size=size, color=color, ls=ls)
        nlines = max(1, int(math.ceil(_est_lines(it, size, w - 0.35)))) 
        yy += lh * nlines + gap / 72.0
    return yy


def _est_lines(text, size_pt, width_in):
    """Estimativa de quebra de linha (Montserrat ~0.545 em de largura media)."""
    char_w = size_pt * 0.545 / 72.0
    per_line = max(6, int(width_in / char_w))
    words, cur, n = str(text).split(), 0, 1
    for wd in words:
        add = len(wd) + (1 if cur else 0)
        if cur + add > per_line:
            n += 1
            cur = len(wd)
        else:
            cur += add
    return n


# ============================================================== CARTOES
def card(sl, x, y, w, h, fill=WHITE, line=RULE, lw=1.0, accent=None,
         accent_h=0.055, radius=None):
    """Cartao institucional: fundo claro, borda hairline, faixa de acento."""
    shape = MSO_SHAPE.ROUNDED_RECTANGLE if radius else MSO_SHAPE.RECTANGLE
    s = rect(sl, x, y, w, h, fill=fill, line=line, lw=lw, shape=shape,
             adj=radius)
    if accent:
        rect(sl, x, y, w, accent_h, fill=accent)
    return s


def pill(sl, x, y, w, h, text, fill=INDIGO, color=WHITE, size=8.5,
         font=None, tracking=1.2):
    s = rect(sl, x, y, w, h, fill=fill, shape=MSO_SHAPE.ROUNDED_RECTANGLE,
             adj=0.5)
    txt(sl, x, y + (h - size / 72 * 1.5) / 2, w, size / 72 * 1.6, text,
        font=font or F_SB, size=size, color=color, align="c", anchor="m",
        tracking=tracking, caps=True)
    return s


def eyebrow(sl, x, y, text, color=INDIGO, size=9.0, tracking=1.9, rule=True,
            rule_w=0.30, rule_color=None):
    """Rotulo superior: traco curto + texto caixa-alta espacado."""
    if rule:
        hline(sl, x, y + 0.072, rule_w, rule_color or color, 1.6)
        x = x + rule_w + 0.16
    return txt(sl, x, y - 0.025, 8.0, 0.2, text, font=F_SB, size=size,
               color=color, tracking=tracking, caps=True, ls=1.0)


def title(sl, x, y, w, parts, size=26, color=INK, ls=1.16, align="l"):
    """Titulo de slide. parts pode ser str ou lista de (texto, overrides)."""
    if isinstance(parts, str):
        parts = [(parts, {})]
    return rich(sl, x, y, w, 1.5, parts, font=F_LIGHT, size=size, color=color,
                ls=ls, align=align)


# =============================================================== RODAPE
def footer(sl, page, total, dark=False, label="Projeto Bioma Textil  ·  Ecoponto Belezinho"):
    lw_ = FOOT_LOGO_H * LOGO_RATIO
    if dark:
        hline(sl, ML, FOOT_RULE_Y, CW, WHITE, 0.75, alpha=0.22)
        sl.shapes.add_picture(LOGO_WHITE, Inches(ML), Inches(FOOT_LOGO_Y),
                              height=Inches(FOOT_LOGO_H))
        txt(sl, CR - 5.4, FOOT_LOGO_Y + 0.055, 5.4, 0.2,
            f"{label}    |    {page:02d}", font=F_REG, size=7.5, color=WHITE,
            align="r", tracking=0.5)
    else:
        hline(sl, ML, FOOT_RULE_Y, CW, RULE, 0.75)
        sl.shapes.add_picture(LOGO_DARK, Inches(ML), Inches(FOOT_LOGO_Y),
                              height=Inches(FOOT_LOGO_H))
        txt(sl, CR - 5.4, FOOT_LOGO_Y + 0.055, 5.4, 0.2,
            f"{label}    |    {page:02d}", font=F_REG, size=7.5, color=GREY_LT,
            align="r", tracking=0.5)
    return sl


# ====================================================== FUNDOS DE SLIDE
def bg_white(sl):
    rect(sl, 0, 0, W_IN, H_IN, fill=WHITE)


def bg_dark(sl, variant="cover"):
    """Fundo indigo institucional, gradiente nativo + malha vetorial sutil."""
    if variant == "cover":
        stops = [(0.0, NIGHT), (0.34, INDIGO_DP), (0.70, INDIGO_MID), (1.0, INDIGO)]
        ang = 0
    elif variant == "deep":
        stops = [(0.0, INDIGO_DK), (0.52, INDIGO_MID), (1.0, INDIGO)]
        ang = 35
    else:
        stops = [(0.0, INDIGO_DP), (0.55, INDIGO_MID), (1.0, INDIGO)]
        ang = 12
    rect(sl, 0, 0, W_IN, H_IN, grad=stops, grad_angle=ang)
    # malha de linhas diagonais finissimas (editavel, evita textura rasterizada)
    step = 0.46
    n = int((W_IN + H_IN) / step) + 2
    for i in range(n):
        x0 = -H_IN + i * step
        line(sl, x0, H_IN, x0 + H_IN, 0.0, WHITE, 0.5, alpha=0.055)
    # brilho suave no canto inferior direito
    rect(sl, W_IN * 0.42, 0, W_IN * 0.58, H_IN,
         grad=[(0.0, INDIGO, 0.0), (1.0, INDIGO, 0.32)], grad_angle=0)


def bg_split(sl, photo, side="r", frac=0.38, tint=True):
    """Fundo branco com painel fotografico lateral."""
    bg_white(sl)
    pw = W_IN * frac
    px = W_IN - pw if side == "r" else 0.0
    pic_cover(sl, photo, px, 0, pw, H_IN)
    if tint:
        rect(sl, px, 0, pw, H_IN, fill=INDIGO_DK, alpha=0.18)
    return px, pw


# =============================================================== IMAGENS
from PIL import Image as _PILImage


def pic_cover(sl, path, x, y, w, h, bias_x=0.5, bias_y=0.5):
    """Insere imagem preenchendo a caixa, recortando pelo crop (sem distorcer)."""
    with _PILImage.open(path) as im:
        iw, ih = im.size
    a_img, a_box = iw / ih, w / h
    p = sl.shapes.add_picture(path, Inches(x), Inches(y), Inches(w), Inches(h))
    if abs(a_img - a_box) > 1e-4:
        if a_img > a_box:                      # imagem mais larga -> corta lados
            keep = a_box / a_img
            cut = 1 - keep
            p.crop_left = cut * bias_x
            p.crop_right = cut * (1 - bias_x)
        else:                                   # imagem mais alta -> corta topo/base
            keep = a_img / a_box
            cut = 1 - keep
            p.crop_top = cut * bias_y
            p.crop_bottom = cut * (1 - bias_y)
    flat(p)
    return p


def pic_frame(sl, path, x, y, w, h, line=RULE, lw=0.75, bias_x=0.5, bias_y=0.5,
              tint=None, tint_alpha=0.16):
    p = pic_cover(sl, path, x, y, w, h, bias_x, bias_y)
    if tint:
        rect(sl, x, y, w, h, fill=tint, alpha=tint_alpha)
    if line:
        rect(sl, x, y, w, h, fill=None, line=line, lw=lw)
    return p


def caption(sl, x, y, w, text, color=GREY_LT, size=7.8):
    return txt(sl, x, y, w, 0.32, text, font=F_REG, size=size, color=color,
               ls=1.25, tracking=0.3)


# ============================================ GEOMETRIA PARA ICONES VETORIAIS
def _emu(v):
    return int(round(v * 914400))


def poly(sl, x0, y0, s, pts, color=INDIGO, lw=1.25, close=False, fill=None,
         fill_alpha=None):
    """Polilinha em coordenadas normalizadas 0..100 dentro de uma caixa s x s."""
    def P(p):
        return (_emu(x0 + p[0] / 100.0 * s), _emu(y0 + p[1] / 100.0 * s))
    a = P(pts[0])
    ff = sl.shapes.build_freeform(a[0], a[1], scale=1.0)
    ff.add_line_segments([P(p) for p in pts[1:]], close=close)
    sh = ff.convert_to_shape()
    flat(sh)
    if fill:
        solid_fill(sh, fill, fill_alpha)
    else:
        no_fill(sh)
    set_line(sh, color, lw)
    return sh


def poly_abs(sl, pts, color=INDIGO, lw=1.25, close=False, fill=None,
             fill_alpha=None):
    """Polilinha com coordenadas absolutas em polegadas (para diagramas)."""
    ff = sl.shapes.build_freeform(_emu(pts[0][0]), _emu(pts[0][1]), scale=1.0)
    ff.add_line_segments([(_emu(p[0]), _emu(p[1])) for p in pts[1:]],
                         close=close)
    sh = ff.convert_to_shape()
    flat(sh)
    if fill:
        solid_fill(sh, fill, fill_alpha)
    else:
        no_fill(sh)
    if color:
        set_line(sh, color, lw)
    else:
        set_line(sh, None)
    return sh


def arrow_abs(sl, pts, color=INDIGO, lw=1.15, head=0.095):
    """Seta em coordenadas absolutas (polegadas), ponta na tangente final."""
    poly_abs(sl, pts, color, lw)
    p2, p1 = pts[-2], pts[-1]
    ang = math.degrees(math.atan2(p1[1] - p2[1], p1[0] - p2[0]))
    q1 = _rot((p1[0] + head, p1[1]), p1, ang + 152)
    q2 = _rot((p1[0] + head, p1[1]), p1, ang - 152)
    poly_abs(sl, [p1, q1, q2], color, lw * 0.6, close=True, fill=color)
    return sl


def ring_abs(sl, cx, cy, r, a0, a1, color=INDIGO, lw=1.15, n=48, arrow=False,
             head=0.10, dash=None):
    """Arco em coordenadas absolutas; opcionalmente com ponta de seta."""
    pts = [(cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
           for a in [a0 + (a1 - a0) * i / n for i in range(n + 1)]]
    if arrow:
        arrow_abs(sl, pts, color, lw, head)
    else:
        poly_abs(sl, pts, color, lw)
    return pts


def arc_pts(cx, cy, r, a0, a1, n=36, rx=None, ry=None):
    """Pontos de um arco (graus, sentido horario na tela)."""
    rx = r if rx is None else rx
    ry = r if ry is None else ry
    return [(cx + rx * math.cos(math.radians(a)),
             cy + ry * math.sin(math.radians(a)))
            for a in [a0 + (a1 - a0) * i / n for i in range(n + 1)]]


def _rot(p, c, deg):
    a = math.radians(deg)
    dx, dy = p[0] - c[0], p[1] - c[1]
    return (c[0] + dx * math.cos(a) - dy * math.sin(a),
            c[1] + dx * math.sin(a) + dy * math.cos(a))


def arrow_head(sl, x0, y0, s, tip, ang, size=13, color=INDIGO, lw=1.25,
               filled=True, back=152):
    """Ponta de seta em (tip) apontando para 'ang' graus."""
    p1 = _rot((tip[0] + size, tip[1]), tip, ang + back)
    p2 = _rot((tip[0] + size, tip[1]), tip, ang - back)
    if filled:
        return poly(sl, x0, y0, s, [tip, p1, p2], color=color, lw=lw * 0.6,
                    close=True, fill=color)
    return poly(sl, x0, y0, s, [p1, tip, p2], color=color, lw=lw)


def poly_arrow(sl, x0, y0, s, pts, color=INDIGO, lw=1.25, head=13):
    """Polilinha com ponta de seta alinhada a tangente do ultimo segmento."""
    poly(sl, x0, y0, s, pts, color=color, lw=lw)
    p2, p1 = pts[-2], pts[-1]
    ang = math.degrees(math.atan2(p1[1] - p2[1], p1[0] - p2[0]))
    arrow_head(sl, x0, y0, s, p1, ang, head, color, lw)


# ==================================================== BIBLIOTECA DE ICONES
# Todos os icones desenham dentro de uma caixa quadrada (x, y, s) em polegadas.

def ic_recycle(sl, x, y, s, c=INDIGO, lw=1.25):
    """Simbolo de reciclagem: tres setas encadeadas em triangulo."""
    cen, R = (50, 54), 33
    V = [(cen[0] + R * math.cos(math.radians(-90 + 120 * k)),
          cen[1] + R * math.sin(math.radians(-90 + 120 * k))) for k in range(3)]
    for k in range(3):
        a, b = V[k], V[(k + 1) % 3]
        def at(t):
            return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
        poly_arrow(sl, x, y, s, [at(0.06), at(0.78)], color=c, lw=lw, head=11)
    return sl


def ic_leaf(sl, x, y, s, c=GREEN, lw=1.25):
    """Folha: duas curvas simetricas + nervuras, levemente inclinada."""
    cen, tilt = (50, 50), -20
    n, half = 26, 25.0
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        yy = 88 - 76 * t
        dx = half * math.sin(math.pi * t) ** 1.08
        left.append((50 - dx, yy))
        right.append((50 + dx, yy))
    path = [_rot(p, cen, tilt) for p in left] + \
           [_rot(p, cen, tilt) for p in reversed(right)]
    poly(sl, x, y, s, path, color=c, lw=lw, close=True)
    base, tip = _rot((50, 88), cen, tilt), _rot((50, 12), cen, tilt)
    poly(sl, x, y, s, [base, tip], color=c, lw=lw * 0.8)
    for t in (0.28, 0.48, 0.68):
        m = _rot((50, 88 - 76 * t), cen, tilt)
        d = half * math.sin(math.pi * t) ** 1.08
        for sg in (-1, 1):
            e = _rot((50 + sg * d * 0.72, 88 - 76 * (t + 0.14)), cen, tilt)
            poly(sl, x, y, s, [m, e], color=c, lw=lw * 0.6)
    return sl


def ic_circular(sl, x, y, s, c=INDIGO, lw=1.25):
    """Economia circular: dois arcos opostos com setas tangentes.
    Cabecas maiores para o icone continuar legivel em tamanho reduzido."""
    for a0, a1 in ((-52, 112), (128, 292)):
        pts = arc_pts(50, 50, 32, a0, a1, 30)
        poly_arrow(sl, x, y, s, pts, color=c, lw=lw, head=19)
    return sl


def ic_truck(sl, x, y, s, c=INDIGO, lw=1.25):
    poly(sl, x, y, s, [(8, 30), (52, 30), (52, 64), (8, 64)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, [(52, 42), (72, 42), (86, 55), (86, 64), (52, 64)],
         color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(8, 64), (86, 64)], color=c, lw=lw)
    circle(sl, x + 0.26 * s, y + 0.715 * s, 0.15 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.72 * s, y + 0.715 * s, 0.15 * s, fill=None, line=c, lw=lw)
    return sl


def ic_boxes(sl, x, y, s, c=INDIGO, lw=1.25):
    """Estoque: caixas empilhadas."""
    poly(sl, x, y, s, [(10, 50), (44, 50), (44, 80), (10, 80)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, [(48, 50), (82, 50), (82, 80), (48, 80)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, [(29, 18), (63, 18), (63, 46), (29, 46)], color=c, lw=lw,
         close=True)
    for a, b in ((21, 33), (59, 33), (40, 0)):
        pass
    poly(sl, x, y, s, [(27, 50), (27, 80)], color=c, lw=lw * 0.7)
    poly(sl, x, y, s, [(65, 50), (65, 80)], color=c, lw=lw * 0.7)
    poly(sl, x, y, s, [(46, 18), (46, 46)], color=c, lw=lw * 0.7)
    return sl


def ic_sort(sl, x, y, s, c=INDIGO, lw=1.25):
    """Separacao: fluxo unico que se divide em tres destinos."""
    poly(sl, x, y, s, [(6, 50), (30, 50)], color=c, lw=lw)
    for yy in (18, 50, 82):
        pts = [(30, 50), (30, yy), (66, yy)] if yy != 50 else [(30, 50), (66, 50)]
        poly_arrow(sl, x, y, s, pts, color=c, lw=lw, head=12)
    return sl


def ic_tshirt(sl, x, y, s, c=INDIGO, lw=1.25):
    """Residuo textil / vestuario."""
    poly(sl, x, y, s, [(34, 12), (42, 20), (58, 20), (66, 12), (88, 26),
                       (78, 44), (71, 38), (71, 90), (29, 90), (29, 38),
                       (22, 44), (12, 26)], color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(42, 20), (50, 27), (58, 20)], color=c, lw=lw * 0.8)
    return sl


def ic_fabric(sl, x, y, s, c=INDIGO, lw=1.25):
    """Tecidos: camadas dobradas."""
    for i in range(3):
        top = 30 + i * 20
        wave = [(10 + j * 4, top + 4 * math.sin(j * 0.52)) for j in range(21)]
        low = [(p[0], p[1] + 12) for p in reversed(wave)]
        poly(sl, x, y, s, wave + low, color=c, lw=lw * 0.9, close=True)
    return sl


def ic_spool(sl, x, y, s, c=INDIGO, lw=1.25):
    """Carretel de linha (industria textil)."""
    poly(sl, x, y, s, [(30, 16), (70, 16)], color=c, lw=lw)
    poly(sl, x, y, s, [(30, 74), (70, 74)], color=c, lw=lw)
    poly(sl, x, y, s, [(37, 16), (37, 74)], color=c, lw=lw)
    poly(sl, x, y, s, [(63, 16), (63, 74)], color=c, lw=lw)
    for yy in (26, 38, 50, 62):
        poly(sl, x, y, s, [(37, yy), (63, yy + 5)], color=c, lw=lw * 0.65)
    poly(sl, x, y, s, [(63, 68), (78, 78), (72, 92)], color=c, lw=lw * 0.75)
    return sl


def ic_bolt(sl, x, y, s, c=INDIGO, lw=1.25):
    poly(sl, x, y, s, [(56, 8), (28, 52), (48, 52), (40, 92), (72, 44),
                       (52, 44), (60, 8)], color=c, lw=lw, close=True)
    return sl


def ic_zero_landfill(sl, x, y, s, c=INDIGO, lw=1.25):
    """Aterro Zero: descarte em aterro interditado."""
    circle(sl, x + 0.5 * s, y + 0.5 * s, 0.86 * s, fill=None, line=c, lw=lw)
    # cacamba / celula de aterro
    poly(sl, x, y, s, [(28, 46), (72, 46), (66, 70), (34, 70)], color=c,
         lw=lw * 0.95, close=True)
    poly(sl, x, y, s, [(24, 46), (76, 46)], color=c, lw=lw * 0.95)
    # residuo acumulado
    poly(sl, x, y, s, [(36, 46), (43, 34), (50, 41), (57, 30), (64, 46)],
         color=c, lw=lw * 0.8)
    # interdicao
    poly(sl, x, y, s, [(22, 78), (78, 22)], color=c, lw=lw * 1.2)
    return sl


def ic_upcycle(sl, x, y, s, c=GREEN, lw=1.25):
    """Upcycle: ciclo ascendente (valor agregado)."""
    pts = arc_pts(50, 52, 32, 55, 335, 34)
    poly_arrow(sl, x, y, s, pts, color=c, lw=lw, head=13)
    poly(sl, x, y, s, [(34, 60), (50, 40), (66, 60)], color=c, lw=lw * 1.05)
    poly(sl, x, y, s, [(50, 40), (50, 74)], color=c, lw=lw * 1.05)
    return sl


def ic_shred(sl, x, y, s, c=INDIGO, lw=1.25):
    """Picotagem: adequacao granulometrica do material."""
    poly(sl, x, y, s, [(24, 8), (76, 8), (76, 28), (24, 28)], color=c,
         lw=lw, close=True)
    poly(sl, x, y, s, [(10, 34), (90, 34), (90, 48), (10, 48)], color=c,
         lw=lw, close=True)
    for cx in (24, 38, 52, 66, 80):
        poly(sl, x, y, s, [(cx, 38), (cx, 44)], color=c, lw=lw * 0.7)
    for cx, y0, h in ((22, 56, 16), (36, 56, 26), (50, 56, 18),
                      (64, 56, 28), (78, 56, 14)):
        poly(sl, x, y, s, [(cx, y0), (cx, y0 + h)], color=c, lw=lw * 0.8)
    return sl


def ic_compost(sl, x, y, s, c=GREEN, lw=1.25):
    """Compostagem: solo, broto e ciclo."""
    poly(sl, x, y, s, arc_pts(50, 78, 0, 180, 360, 24, rx=30, ry=16),
         color=c, lw=lw)
    poly(sl, x, y, s, [(20, 78), (80, 78)], color=c, lw=lw)
    poly(sl, x, y, s, [(50, 62), (50, 34)], color=c, lw=lw * 0.9)
    for sg in (-1, 1):
        pts = [(50, 46)] + [(50 + sg * 16 * math.sin(math.pi * t),
                             46 - 16 * t) for t in
                            [i / 10 for i in range(1, 11)]]
        poly(sl, x, y, s, pts, color=c, lw=lw * 0.75)
    return sl


def ic_book(sl, x, y, s, c=INDIGO, lw=1.25):
    """Educacao ambiental."""
    poly(sl, x, y, s, [(50, 30), (18, 22), (18, 76), (50, 84)], color=c,
         lw=lw, close=True)
    poly(sl, x, y, s, [(50, 30), (82, 22), (82, 76), (50, 84)], color=c,
         lw=lw, close=True)
    poly(sl, x, y, s, [(50, 30), (50, 84)], color=c, lw=lw * 0.8)
    return sl


def ic_sewing(sl, x, y, s, c=INDIGO, lw=1.25):
    """Costura criativa / coworking de costureiras: maquina de costura."""
    poly(sl, x, y, s, [(16, 16), (80, 16), (80, 32), (16, 32)], color=c,
         lw=lw, close=True)
    poly(sl, x, y, s, [(80, 32), (80, 70)], color=c, lw=lw)
    poly(sl, x, y, s, [(10, 70), (90, 70), (90, 82), (10, 82)], color=c,
         lw=lw, close=True)
    poly(sl, x, y, s, [(18, 32), (18, 46), (32, 46), (32, 32)], color=c,
         lw=lw * 0.9, close=True)
    poly(sl, x, y, s, [(25, 46), (25, 62)], color=c, lw=lw * 0.9)
    poly(sl, x, y, s, [(14, 64), (66, 64)], color=c, lw=lw * 0.7)
    return sl


def ic_workshop(sl, x, y, s, c=INDIGO, lw=1.25):
    """Oficinas, workshops e cursos: apresentacao para grupo."""
    poly(sl, x, y, s, [(14, 12), (86, 12), (86, 56), (14, 56)], color=c,
         lw=lw, close=True)
    poly(sl, x, y, s, [(26, 26), (56, 26)], color=c, lw=lw * 0.7)
    poly(sl, x, y, s, [(26, 38), (72, 38)], color=c, lw=lw * 0.7)
    for cx in (28, 50, 72):
        circle(sl, x + cx / 100 * s, y + 0.70 * s, 0.15 * s, fill=WHITE,
               line=c, lw=lw * 0.85)
        poly(sl, x, y, s, arc_pts(cx, 92, 0, 196, 344, 16, rx=13, ry=13),
             color=c, lw=lw * 0.85)
    return sl


def ic_bulb(sl, x, y, s, c=INDIGO, lw=1.25):
    """Inovacao ambiental: lampada com folha."""
    poly(sl, x, y, s, arc_pts(50, 40, 0, 200, 340, 28, rx=26, ry=26) +
         [(60, 62), (60, 72), (40, 72), (40, 62)], color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(41, 78), (59, 78)], color=c, lw=lw * 0.8)
    poly(sl, x, y, s, [(44, 86), (56, 86)], color=c, lw=lw * 0.8)
    poly(sl, x, y, s, [(50, 58), (50, 34)], color=c, lw=lw * 0.7)
    poly(sl, x, y, s, [(50, 44), (61, 33)], color=c, lw=lw * 0.7)
    poly(sl, x, y, s, [(50, 44), (39, 33)], color=c, lw=lw * 0.7)
    return sl


def ic_scissors(sl, x, y, s, c=INDIGO, lw=1.25):
    """Descaracterizacao: corte peca por peca."""
    poly(sl, x, y, s, [(24, 18), (66, 66)], color=c, lw=lw)
    poly(sl, x, y, s, [(76, 18), (34, 66)], color=c, lw=lw)
    circle(sl, x + 0.28 * s, y + 0.80 * s, 0.22 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.72 * s, y + 0.80 * s, 0.22 * s, fill=None, line=c, lw=lw)
    return sl


def ic_defiber(sl, x, y, s, c=INDIGO, lw=1.25):
    """Desfibramento: bloco que se abre em fibras."""
    poly(sl, x, y, s, [(8, 34), (36, 34), (36, 66), (8, 66)], color=c, lw=lw,
         close=True)
    for i, yy in enumerate((18, 32, 46, 60, 74, 88)):
        poly(sl, x, y, s, [(36, 50), (58, (50 + (yy - 50) * 0.55)), (88, yy)],
             color=c, lw=lw * 0.72)
    return sl


def ic_people(sl, x, y, s, c=INDIGO, lw=1.25):
    circle(sl, x + 0.5 * s, y + 0.30 * s, 0.24 * s, fill=None, line=c, lw=lw)
    poly(sl, x, y, s, arc_pts(50, 88, 0, 190, 350, 22, rx=27, ry=26),
         color=c, lw=lw)
    circle(sl, x + 0.16 * s, y + 0.40 * s, 0.18 * s, fill=None, line=c, lw=lw * 0.85)
    poly(sl, x, y, s, arc_pts(16, 92, 0, 195, 345, 18, rx=17, ry=18),
         color=c, lw=lw * 0.85)
    circle(sl, x + 0.84 * s, y + 0.40 * s, 0.18 * s, fill=None, line=c, lw=lw * 0.85)
    poly(sl, x, y, s, arc_pts(84, 92, 0, 195, 345, 18, rx=17, ry=18),
         color=c, lw=lw * 0.85)
    return sl


def ic_doc_check(sl, x, y, s, c=INDIGO, lw=1.25):
    poly(sl, x, y, s, [(20, 8), (62, 8), (78, 26), (78, 92), (20, 92)],
         color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(62, 8), (62, 26), (78, 26)], color=c, lw=lw * 0.8)
    for yy in (42, 54):
        poly(sl, x, y, s, [(31, yy), (67, yy)], color=c, lw=lw * 0.7)
    poly(sl, x, y, s, [(33, 72), (44, 82), (66, 62)], color=c, lw=lw * 1.1)
    return sl


def ic_shield(sl, x, y, s, c=INDIGO, lw=1.25):
    poly(sl, x, y, s, [(50, 8), (84, 22), (84, 52), (50, 92), (16, 52),
                       (16, 22)], color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(35, 48), (46, 60), (67, 36)], color=c, lw=lw * 1.1)
    return sl


def ic_pin(sl, x, y, s, c=INDIGO, lw=1.25):
    pts = arc_pts(50, 40, 30, 135, 405, 30)
    poly(sl, x, y, s, pts + [(50, 92)], color=c, lw=lw, close=True)
    circle(sl, x + 0.5 * s, y + 0.40 * s, 0.20 * s, fill=None, line=c, lw=lw * 0.85)
    return sl


def ic_factory(sl, x, y, s, c=INDIGO, lw=1.25):
    poly(sl, x, y, s, [(10, 84), (10, 44), (34, 58), (34, 44), (58, 58),
                       (58, 44), (82, 58), (82, 84)], color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(66, 44), (66, 16), (78, 16), (78, 50)], color=c,
         lw=lw * 0.8)
    poly(sl, x, y, s, [(10, 84), (90, 84)], color=c, lw=lw)
    return sl


def ic_scale(sl, x, y, s, c=INDIGO, lw=1.25):
    """Valorizacao / pesagem: balanca de pratos suspensos."""
    poly(sl, x, y, s, [(50, 22), (50, 84)], color=c, lw=lw)
    poly(sl, x, y, s, [(16, 30), (84, 30)], color=c, lw=lw)
    poly(sl, x, y, s, [(32, 84), (68, 84)], color=c, lw=lw)
    for cx in (16, 84):
        poly(sl, x, y, s, [(cx, 30), (cx - 13, 46)], color=c, lw=lw * 0.6)
        poly(sl, x, y, s, [(cx, 30), (cx + 13, 46)], color=c, lw=lw * 0.6)
        poly(sl, x, y, s, arc_pts(cx, 46, 0, 0, 180, 18, rx=13, ry=12),
             color=c, lw=lw * 0.9)
    circle(sl, x + 0.5 * s, y + 0.20 * s, 0.13 * s, fill=WHITE, line=c,
           lw=lw * 0.9)
    return sl


def ic_award(sl, x, y, s, c=INDIGO, lw=1.25):
    circle(sl, x + 0.5 * s, y + 0.38 * s, 0.52 * s, fill=None, line=c, lw=lw)
    star = []
    for i in range(10):
        ang = -90 + i * 36
        r = 15 if i % 2 == 0 else 7
        star.append((50 + r * math.cos(math.radians(ang)),
                     38 + r * math.sin(math.radians(ang))))
    poly(sl, x, y, s, star, color=c, lw=lw * 0.8, close=True)
    poly(sl, x, y, s, [(33, 62), (26, 94), (50, 84), (74, 94), (67, 62)],
         color=c, lw=lw * 0.9)
    return sl


def ic_growth(sl, x, y, s, c=GREEN, lw=1.25):
    poly(sl, x, y, s, [(12, 86), (88, 86)], color=c, lw=lw)
    for xx, hh in ((24, 26), (44, 44), (64, 62)):
        poly(sl, x, y, s, [(xx, 86), (xx, 86 - hh), (xx + 12, 86 - hh),
                           (xx + 12, 86)], color=c, lw=lw * 0.85)
    poly(sl, x, y, s, [(80, 30), (88, 30), (88, 38)], color=c, lw=lw * 0.9)
    poly(sl, x, y, s, [(60, 52), (88, 30)], color=c, lw=lw * 0.9)
    return sl


def ic_gov(sl, x, y, s, c=INDIGO, lw=1.25):
    """Poder publico: edificio institucional."""
    poly(sl, x, y, s, [(8, 34), (50, 12), (92, 34)], color=c, lw=lw)
    poly(sl, x, y, s, [(12, 34), (88, 34)], color=c, lw=lw)
    for xx in (24, 40, 56, 72):
        poly(sl, x, y, s, [(xx, 40), (xx, 78)], color=c, lw=lw * 0.8)
    poly(sl, x, y, s, [(12, 78), (88, 78)], color=c, lw=lw)
    poly(sl, x, y, s, [(8, 88), (92, 88)], color=c, lw=lw)
    return sl


def ic_palette(sl, x, y, s, c=INDIGO, lw=1.25):
    """Separacao por cor: circulos sobrepostos."""
    circle(sl, x + 0.36 * s, y + 0.36 * s, 0.44 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.64 * s, y + 0.36 * s, 0.44 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.50 * s, y + 0.62 * s, 0.44 * s, fill=None, line=c, lw=lw)
    return sl


def ic_molecule(sl, x, y, s, c=INDIGO, lw=1.25):
    """Separacao por composicao."""
    nodes = [(50, 20), (20, 66), (80, 66), (50, 50)]
    for a, b in ((3, 0), (3, 1), (3, 2)):
        poly(sl, x, y, s, [nodes[a], nodes[b]], color=c, lw=lw * 0.8)
    for i, n in enumerate(nodes):
        d = 0.20 if i == 3 else 0.17
        circle(sl, x + n[0] / 100 * s, y + n[1] / 100 * s, d * s, fill=WHITE,
               line=c, lw=lw)
    return sl


def ic_target(sl, x, y, s, c=INDIGO, lw=1.25):
    for d in (0.82, 0.52, 0.22):
        circle(sl, x + 0.5 * s, y + 0.5 * s, d * s, fill=None, line=c,
               lw=lw if d > 0.3 else lw * 1.1)
    return sl


def ic_route(sl, x, y, s, c=INDIGO, lw=1.25):
    """Destinacao / expedicao: caminho com seta."""
    poly(sl, x, y, s, [(12, 80), (36, 80), (36, 46), (64, 46), (64, 22),
                       (84, 22)], color=c, lw=lw)
    arrow_head(sl, x, y, s, (92, 22), 0, size=13, color=c, lw=lw)
    circle(sl, x + 0.12 * s, y + 0.80 * s, 0.14 * s, fill=WHITE, line=c, lw=lw)
    return sl


def ic_clipboard(sl, x, y, s, c=INDIGO, lw=1.25):
    """Recebimento / conferencia."""
    poly(sl, x, y, s, [(20, 18), (80, 18), (80, 92), (20, 92)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, [(38, 8), (62, 8), (62, 26), (38, 26)], color=c, lw=lw,
         close=True)
    for yy in (46, 60, 74):
        poly(sl, x, y, s, [(32, yy), (68, yy)], color=c, lw=lw * 0.7)
    return sl


def ic_gear_leaf(sl, x, y, s, c=INDIGO, lw=1.25):
    """Processamento industrial sustentavel."""
    circle(sl, x + 0.5 * s, y + 0.5 * s, 0.46 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.5 * s, y + 0.5 * s, 0.18 * s, fill=None, line=c, lw=lw)
    for k in range(8):
        a = k * 45
        p0 = _rot((50 + 25, 50), (50, 50), a)
        p1 = _rot((50 + 34, 50), (50, 50), a)
        poly(sl, x, y, s, [p0, p1], color=c, lw=lw * 0.9)
    return sl


def ic_water(sl, x, y, s, c=AQUA, lw=1.25):
    poly(sl, x, y, s, [(50, 10)] + arc_pts(50, 58, 0, -60, 240, 30, rx=30, ry=32),
         color=c, lw=lw, close=True)
    return sl


def ic_city(sl, x, y, s, c=INDIGO, lw=1.25):
    """Referencia visual urbana / Sao Paulo."""
    bars = [(10, 46), (24, 62), (38, 34), (52, 54), (66, 42), (80, 58)]
    for bx, hh in bars:
        poly(sl, x, y, s, [(bx, 86), (bx, 86 - hh), (bx + 10, 86 - hh),
                           (bx + 10, 86)], color=c, lw=lw * 0.9)
    poly(sl, x, y, s, [(6, 86), (94, 86)], color=c, lw=lw)
    return sl


# ------------------------------------------------- skyline decorativo (vetor)
SKYLINE = [
    (0, 30), (4, 30), (4, 52), (9, 52), (9, 40), (13, 40), (13, 62), (17, 62),
    (17, 34), (20, 34), (20, 24), (23, 24), (23, 34), (27, 34), (27, 56),
    (32, 56), (32, 44), (36, 44), (36, 66), (41, 66), (41, 38), (45, 38),
    (45, 50), (50, 50), (50, 28), (53, 28), (53, 18), (56, 18), (56, 28),
    (60, 28), (60, 58), (65, 58), (65, 42), (69, 42), (69, 64), (74, 64),
    (74, 36), (78, 36), (78, 54), (83, 54), (83, 46), (87, 46), (87, 60),
    (92, 60), (92, 32), (96, 32), (96, 48), (100, 48),
]


def skyline(sl, x, y, w, h, color=WHITE, alpha=0.16, lw=0.9):
    """Silhueta urbana estilizada (Sao Paulo), como linha vetorial discreta."""
    pts = [(p[0], 100 - (100 - p[1]) * 1.0) for p in SKYLINE]
    def P(p):
        return (_emu(x + p[0] / 100.0 * w), _emu(y + p[1] / 100.0 * h))
    a = P(pts[0])
    ff = sl.shapes.build_freeform(a[0], a[1], scale=1.0)
    ff.add_line_segments([P(p) for p in pts[1:]], close=False)
    sh = ff.convert_to_shape()
    flat(sh)
    no_fill(sh)
    set_line(sh, color, lw, alpha)
    return sh


# =============================================================== APRESENTACAO
import os as _os

_HERE = _os.path.dirname(_os.path.abspath(__file__))
_PROJ = _os.path.dirname(_HERE)

ASSETS = _os.environ.get("NL_ASSETS", _os.path.join(_PROJ, "assets"))
LOGO_DARK = _os.path.join(ASSETS, "logo_dark.png")
LOGO_WHITE = _os.path.join(ASSETS, "logo_white.png")


def new_deck():
    prs = Presentation()
    prs.slide_width = Inches(W_IN)
    prs.slide_height = Inches(H_IN)
    return prs


def add_slide(prs):
    sl = prs.slides.add_slide(prs.slide_layouts[6])
    add_transition(sl)
    return sl
