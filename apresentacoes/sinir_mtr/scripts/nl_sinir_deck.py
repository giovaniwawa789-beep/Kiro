#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deck Nunes & Lucato — Mudanca no acesso ao MTR Nacional (Login Unico Gov.br).

Comunicado aos clientes geradores: o que mudou desde 01/08/2026, por que a
Nunes & Lucato deixou de conseguir emitir MTR em nome do gerador e — em
detalhe — como autorizar o nosso usuario na unidade do cliente para que a
emissao volte ao normal.

ESCOPO. O deck cobre acesso ao sistema e cadastro/autorizacao de usuario.
NAO ensina o gerador a preencher e emitir MTR: os slides de emissao (dados do
gerador, dados do transportador, residuos/CDF) foram retirados de proposito,
porque a emissao continua sendo feita por nos.

Reaproveita o sistema de design de apresentacoes/bioma_textil/scripts/nl_core.py
(paleta, tipografia, icones vetoriais, rodape com a logomarca) — nada e alterado
no core; os icones novos (cadeado, chave, CPF, alerta, navegador, calendario,
usuario+, proibido, engrenagem-menu) sao definidos aqui.

Uso:
    python3 build_assets.py
    python3 nl_sinir_deck.py ../Nunes_Lucato_MTR_Login_Unico_Govbr.pptx
    python3 nl_sinir_deck.py saida.pptx Calibri      # variante sem Montserrat
    python3 nl_sinir_deck.py --check                 # so valida o layout
"""
import os
import sys

# ------------------------------------------------------------------ caminhos
_HERE = os.path.dirname(os.path.abspath(__file__))
_PROJ = os.path.dirname(_HERE)                       # apresentacoes/sinir_mtr
_APRE = os.path.dirname(_PROJ)                       # apresentacoes
_REPO = os.path.dirname(_APRE)                       # raiz do repo
_CORE = os.path.join(_APRE, "bioma_textil", "scripts")

# NL_ASSETS precisa estar definido ANTES do import: nl_core congela
# ASSETS / LOGO_DARK / LOGO_WHITE no momento do import.
os.environ.setdefault("NL_VIDEOS", os.path.join(_REPO, "videos"))
os.environ.setdefault("NL_ASSETS", os.path.join(_PROJ, "assets"))
sys.path.insert(0, _CORE)

import nl_core as nl                                          # noqa: E402
from nl_core import *                                          # noqa: E402,F403
from PIL import Image as _PIL                                  # noqa: E402

A = nl.ASSETS
TOTAL = 21
LABEL = "MTR Nacional  ·  Login Único Gov.br"
FONTE_GUIA = ("Figura do Guia Rápido “Login Único GOV.BR — MTR Nacional/Sinir”, "
              "MMA/SINIR, v. 1.0, 05/01/2026")

# ------------------------------------------------- dados do nosso responsavel
# Conferidos no print (10): e o registro que o sistema mostra para o CPF.
NL_NOME = "Ana Paola Nunes Lucato"
NL_CPF = "142.803.138-30"
NL_EMAIL = "anapnuneslucato@gmail.com"
NL_CARGO = "sócia"
NL_CELULAR = "[INSERIR CELULAR]"

# ------------------------------------------------- cores locais (nao no core)
RED      = "C0392B"      # destaques nos prints e faixas de alerta
RED_LT   = "FCEDEB"
AMBER_LT = "FDF4E3"
AMBER_DK = "B08535"


def _sync_fonts():
    """use_font_family() rebinda apenas os globais de nl_core."""
    globals().update({k: getattr(nl, k)
                      for k in ("F_LIGHT", "F_REG", "F_MED", "F_SB")})


# =========================================================== ICONES NOVOS
def ic_lock(sl, x, y, s, c=INDIGO, lw=1.25):
    """Senha / conta protegida."""
    poly(sl, x, y, s, [(22, 46), (78, 46), (78, 90), (22, 90)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, arc_pts(50, 46, 17, 180, 360, 24), color=c, lw=lw)
    circle(sl, x + 0.50 * s, y + 0.64 * s, 0.14 * s, fill=None, line=c, lw=lw)
    poly(sl, x, y, s, [(50, 70), (50, 80)], color=c, lw=lw * 0.9)
    return sl


def ic_key(sl, x, y, s, c=INDIGO, lw=1.25):
    """Credencial repassada / chave de acesso."""
    circle(sl, x + 0.30 * s, y + 0.30 * s, 0.34 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.30 * s, y + 0.30 * s, 0.13 * s, fill=None, line=c, lw=lw * 0.8)
    poly(sl, x, y, s, [(42, 42), (86, 86)], color=c, lw=lw)
    poly(sl, x, y, s, [(70, 70), (58, 82)], color=c, lw=lw * 0.85)
    poly(sl, x, y, s, [(80, 80), (68, 92)], color=c, lw=lw * 0.85)
    return sl


def ic_cpf(sl, x, y, s, c=INDIGO, lw=1.25):
    """Identificacao por CPF: documento com foto."""
    poly(sl, x, y, s, [(8, 22), (92, 22), (92, 78), (8, 78)], color=c, lw=lw,
         close=True)
    circle(sl, x + 0.30 * s, y + 0.42 * s, 0.20 * s, fill=None, line=c, lw=lw * 0.9)
    poly(sl, x, y, s, arc_pts(30, 66, 0, 200, 340, 18, rx=15, ry=11), color=c,
         lw=lw * 0.85)
    for yy in (38, 50, 62):
        poly(sl, x, y, s, [(52, yy), (82, yy)], color=c, lw=lw * 0.7)
    return sl


def ic_warning(sl, x, y, s, c=RED, lw=1.25):
    """Alerta."""
    poly(sl, x, y, s, [(50, 10), (93, 86), (7, 86)], color=c, lw=lw, close=True)
    poly(sl, x, y, s, [(50, 38), (50, 62)], color=c, lw=lw * 1.15)
    circle(sl, x + 0.50 * s, y + 0.735 * s, 0.075 * s, fill=c)
    return sl


def ic_browser(sl, x, y, s, c=INDIGO, lw=1.25):
    """Endereco / navegador."""
    poly(sl, x, y, s, [(8, 20), (92, 20), (92, 84), (8, 84)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, [(8, 36), (92, 36)], color=c, lw=lw * 0.85)
    for cx in (18, 27, 36):
        circle(sl, x + cx / 100 * s, y + 0.28 * s, 0.05 * s, fill=c)
    poly(sl, x, y, s, [(48, 28), (84, 28)], color=c, lw=lw * 0.7)
    return sl


def ic_calendar(sl, x, y, s, c=INDIGO, lw=1.25):
    """Prazo / data."""
    poly(sl, x, y, s, [(10, 24), (90, 24), (90, 88), (10, 88)], color=c, lw=lw,
         close=True)
    poly(sl, x, y, s, [(10, 42), (90, 42)], color=c, lw=lw * 0.9)
    poly(sl, x, y, s, [(30, 14), (30, 32)], color=c, lw=lw)
    poly(sl, x, y, s, [(70, 14), (70, 32)], color=c, lw=lw)
    for r in (56, 72):
        for cx in (26, 42, 58, 74):
            circle(sl, x + cx / 100 * s, y + r / 100 * s, 0.055 * s, fill=c)
    return sl


def ic_user_plus(sl, x, y, s, c=INDIGO, lw=1.25):
    """Cadastrar / autorizar usuario."""
    circle(sl, x + 0.38 * s, y + 0.32 * s, 0.30 * s, fill=None, line=c, lw=lw)
    poly(sl, x, y, s, arc_pts(38, 78, 0, 195, 345, 22, rx=26, ry=22), color=c,
         lw=lw)
    poly(sl, x, y, s, [(78, 54), (78, 84)], color=c, lw=lw * 1.05)
    poly(sl, x, y, s, [(63, 69), (93, 69)], color=c, lw=lw * 1.05)
    return sl


def ic_user_check(sl, x, y, s, c=GREEN, lw=1.25):
    """Usuario autorizado."""
    circle(sl, x + 0.38 * s, y + 0.32 * s, 0.30 * s, fill=None, line=c, lw=lw)
    poly(sl, x, y, s, arc_pts(38, 78, 0, 195, 345, 22, rx=26, ry=22), color=c,
         lw=lw)
    poly(sl, x, y, s, [(64, 68), (74, 78), (94, 56)], color=c, lw=lw * 1.15)
    return sl


def ic_ban(sl, x, y, s, c=RED, lw=1.25):
    """Bloqueado / nao funciona mais."""
    circle(sl, x + 0.5 * s, y + 0.5 * s, 0.86 * s, fill=None, line=c, lw=lw)
    poly(sl, x, y, s, [(20, 80), (80, 20)], color=c, lw=lw)
    return sl


def ic_menu(sl, x, y, s, c=INDIGO, lw=1.25):
    """Menu de configuracoes: engrenagem simplificada + linhas de menu."""
    circle(sl, x + 0.30 * s, y + 0.30 * s, 0.34 * s, fill=None, line=c, lw=lw)
    circle(sl, x + 0.30 * s, y + 0.30 * s, 0.13 * s, fill=None, line=c, lw=lw * 0.8)
    for k in range(6):
        a = k * 60
        p0 = nl._rot((30 + 19, 30), (30, 30), a)
        p1 = nl._rot((30 + 26, 30), (30, 30), a)
        poly(sl, x, y, s, [p0, p1], color=c, lw=lw * 0.85)
    for i, yy in enumerate((62, 76, 90)):
        poly(sl, x, y, s, [(46, yy), (94 - i * 14, yy)], color=c, lw=lw * 0.85)
    return sl


# ================================================== HELPERS DE COMPOSICAO
def head(sl, eb, ttl, page, size=25.5, w=11.3, dark=False, y=0.66):
    eyebrow(sl, ML, y, eb, WHITE if dark else INDIGO)
    title(sl, ML, y + 0.34, w, ttl, size=size, color=WHITE if dark else INK)
    footer(sl, page, TOTAL, dark=dark, label=LABEL)


def note(sl, y, text, icon=None, color=INDIGO, fill=TINT, h=0.62, x=ML, w=CW,
         size=9.6, tcolor=INK_SOFT):
    """Faixa de observacao com filete de acento a esquerda."""
    rect(sl, x, y, w, h, fill=fill)
    rect(sl, x, y, 0.035, h, fill=color)
    ix = x + 0.26
    if icon:
        icon(sl, ix, y + (h - 0.30) / 2, 0.30, color)
        ix += 0.50
    txt(sl, ix, y, w - (ix - x) - 0.3, h, text, size=size, color=tcolor,
        anchor="m", ls=1.28)


def source(sl, y, text, w=CW, x=ML):
    """Linha de credito de fonte, discreta."""
    txt(sl, x, y, w, 0.20, text, font=F_REG, size=7.4, color=GREY_LT, ls=1.2)


def num_badge(sl, cx, cy, d, n, fill=INDIGO, color=WHITE, size=None):
    circle(sl, cx, cy, d, fill=fill)
    txt(sl, cx - d / 2, cy - d / 2, d, d, str(n), font=F_SB,
        size=size or d * 30, color=color, align="c", anchor="m", ls=1.0)


def steps_list(sl, x, y, w, items, gap=0.86, d=0.30, color=INDIGO, size=10.0):
    """Lista numerada vertical com badge circular."""
    for i, it in enumerate(items):
        yy = y + i * gap
        num_badge(sl, x + d / 2, yy + 0.13, d, i + 1, fill=color)
        if isinstance(it, tuple):
            t, sub = it
            txt(sl, x + d + 0.18, yy, w - d - 0.18, 0.30, t, font=F_SB,
                size=size, color=INK, ls=1.2)
            txt(sl, x + d + 0.18, yy + 0.28, w - d - 0.18, 0.52, sub,
                size=size - 1.2, color=GREY, ls=1.26)
        else:
            txt(sl, x + d + 0.18, yy, w - d - 0.18, 0.60, it, size=size,
                color=INK_SOFT, ls=1.28)
    return y + len(items) * gap


def kv_card(sl, x, y, w, h, titulo, pares, icon=None, accent=INDIGO,
            fill=TINT, rh=0.30, size=9.4, top=0.76):
    card(sl, x, y, w, h, fill=fill, line=None, accent=accent)
    ix = x + 0.26
    if icon:
        icon(sl, ix, y + 0.26, 0.34, accent)
        ix += 0.50
    txt(sl, ix, y + 0.28, w - (ix - x) - 0.26, 0.30, titulo, font=F_SB,
        size=10.4, color=INK)
    yy = y + top
    for k, v in pares:
        txt(sl, x + 0.26, yy, w * 0.40, rh, k, font=F_MED, size=size,
            color=GREY, ls=1.2)
        txt(sl, x + 0.26 + w * 0.40, yy, w * 0.60 - 0.52, rh, v, font=F_SB,
            size=size, color=INK, ls=1.2)
        yy += rh
    return yy


def breadcrumb(sl, x, y, w, itens, rh=0.44, gap=0.08, ativo=INDIGO):
    """Caminho de menu em blocos empilhados, ultimo bloco destacado."""
    for i, item in enumerate(itens):
        yy = y + i * (rh + gap)
        ultimo = i == len(itens) - 1
        rect(sl, x, yy, w, rh, fill=ativo if ultimo else TINT,
             line=None if ultimo else RULE, lw=1.0)
        txt(sl, x + 0.24, yy, w - 0.48, rh, item, font=F_SB, size=10.2,
            color=WHITE if ultimo else INK, anchor="m")
        if not ultimo:
            arrow_abs(sl, [(x + 0.36, yy + rh + 0.005),
                           (x + 0.36, yy + rh + gap - 0.005)], GREY_LT, 1.0,
                      0.050)
    return y + len(itens) * (rh + gap)


# =============================================================== IMAGENS
_SIZES = {}


def _size(name):
    if name not in _SIZES:
        with _PIL.open(os.path.join(A, name)) as im:
            _SIZES[name] = im.size
    return _SIZES[name]


def shot(sl, name, x, y, w, cap=None, max_h=None, center_in=None):
    """Insere print preservando proporcao. Devolve (x, y, w, h) para os
    destaques. center_in=(x0, largura) centraliza horizontalmente na regiao."""
    iw, ih = _size(name)
    h = w * ih / iw
    if max_h and h > max_h:
        h = max_h
        w = h * iw / ih
    if center_in:
        x0, region = center_in
        x = x0 + (region - w) / 2
    pic_frame(sl, os.path.join(A, name), x, y, w, h, line=RULE, lw=0.9)
    if cap:
        caption(sl, x, y + h + 0.08, w, cap)
    return (x, y, w, h)


def hl(sl, box, fx, fy, fw, fh, n=None, color=RED, lw=1.9, badge="tl",
       pad=0.0):
    """Destaque retangular sobre o print. fx..fh em fracao 0..1 da imagem."""
    x, y, w, h = box
    bx = x + fx * w - pad
    by = y + fy * h - pad
    bw = fw * w + 2 * pad
    bh = fh * h + 2 * pad
    rect(sl, bx, by, bw, bh, fill=None, line=color, lw=lw)
    if n is not None:
        d = 0.26
        cx = bx - d * 0.42 if badge[1] == "l" else bx + bw + d * 0.42
        cy = by - d * 0.42 if badge[0] == "t" else by + bh + d * 0.42
        cx = min(max(cx, x + d / 2), x + w - d / 2)
        cy = min(max(cy, y + d / 2), y + h - d / 2)
        num_badge(sl, cx, cy, d, n, fill=color)
    return (bx, by, bw, bh)


# ================================================== LAYOUTS RECORRENTES
def passo_1fig(sl, eb, titulo, page, itens, fig, cap, hls=(), obs=None,
               fonte=None, esq_w=3.70):
    """Passo com lista a esquerda e um print grande a direita."""
    head(sl, eb, titulo, page)
    y0 = 2.02
    steps_list(sl, ML, y0, esq_w, itens)
    ix = ML + esq_w + 0.42
    iw = CR - ix
    box = shot(sl, fig, ix, y0, iw, cap=cap, max_h=3.55, center_in=(ix, iw))
    for h in hls:
        hl(sl, box, *h[:4], n=h[4] if len(h) > 4 else None,
           badge=h[5] if len(h) > 5 else "tl")
    if obs:
        note(sl, 6.00, obs, icon=ic_bulb, h=0.50)
    source(sl, 6.50 if obs else 6.34, fonte or FONTE_GUIA)
    return sl


def passo_2fig(sl, eb, titulo, page, banda, figs, hls_a=(), hls_b=(),
               obs=None):
    """Passo com faixa de instrucao no topo e dois prints lado a lado."""
    head(sl, eb, titulo, page)
    note(sl, 1.98, banda, icon=ic_clipboard, h=0.60)
    cw = (CW - 0.32) / 2
    y = 2.80
    boxes = []
    for i, (fig, cap) in enumerate(figs):
        x = ML + i * (cw + 0.32)
        boxes.append(shot(sl, fig, x, y, cw, cap=cap, max_h=2.42,
                          center_in=(x, cw)))
    for h in hls_a:
        hl(sl, boxes[0], *h[:4], n=h[4] if len(h) > 4 else None,
           badge=h[5] if len(h) > 5 else "tl")
    for h in hls_b:
        hl(sl, boxes[1], *h[:4], n=h[4] if len(h) > 4 else None,
           badge=h[5] if len(h) > 5 else "tl")
    if obs:
        note(sl, 5.70, obs, icon=ic_bulb, h=0.52)
    source(sl, 6.30 if obs else 6.10, FONTE_GUIA)
    return sl


# ============================================================ 01 · CAPA
def s01(prs):
    sl = add_slide(prs)
    bg_dark(sl, "cover")

    px, pw = 8.15, 4.35
    vline(sl, px - 0.35, 0, H_IN, WHITE, 0.75, alpha=0.18)
    cx, cy, cwd, chg = px + 0.30, 2.28, 3.55, 2.95
    rect(sl, cx, cy, cwd, chg, fill=WHITE, alpha=0.07,
         shape=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.045)
    rect(sl, cx, cy, cwd, chg, fill=None, line=WHITE, lw=0.9, line_alpha=0.30,
         shape=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.045)
    ic_cpf(sl, cx + 0.34, cy + 0.34, 0.44, WHITE)
    txt(sl, cx + 0.94, cy + 0.40, 2.2, 0.3, "Conta Gov.br", font=F_SB,
        size=10.6, color=WHITE)
    for i in range(2):
        yy = cy + 1.14 + i * 0.62
        txt(sl, cx + 0.34, yy - 0.24, 2.6, 0.2,
            "CPF" if i == 0 else "Senha", font=F_REG, size=7.6, color=WHITE,
            tracking=1.2, caps=True)
        hline(sl, cx + 0.34, yy + 0.06, cwd - 0.68, WHITE, 1.0, alpha=0.45)
    rect(sl, cx + 0.34, cy + 2.34, 1.52, 0.40, fill=WHITE, alpha=0.92,
         shape=MSO_SHAPE.ROUNDED_RECTANGLE, adj=0.22)
    txt(sl, cx + 0.34, cy + 2.34, 1.52, 0.40, "Entrar", font=F_SB, size=9.4,
        color=INDIGO_DK, align="c", anchor="m", tracking=1.0, caps=True)
    ic_lock(sl, cx + cwd - 0.72, cy + 2.36, 0.36, WHITE)

    ic_recycle(sl, 11.55, 0.92, 0.56, WHITE)

    eyebrow(sl, ML, 1.38, "Comunicado aos clientes geradores", WHITE,
            size=8.6, tracking=1.9, rule_color=WHITE)
    title(sl, ML, 1.76, 7.2,
          [("Nova forma de acesso ao\n", {}),
           ("MTR Nacional", {"font": F_SB}),
           (":\nLogin Único Gov.br", {})],
          size=32, color=WHITE, ls=1.16)
    hline(sl, ML, 4.24, 1.05, WHITE, 1.8, alpha=0.75)
    txt(sl, ML, 4.50, 6.6, 1.0,
        "O que mudou desde 1º de agosto de 2026 e como autorizar o nosso\n"
        "acesso para continuarmos emitindo os seus MTRs sem interrupção.",
        font=F_LIGHT, size=13.5, color=WHITE, ls=1.40)

    txt(sl, ML, 5.86, 4.0, 0.22, "Material preparado por", font=F_REG,
        size=8.0, color=WHITE, tracking=1.5, caps=True)
    sl.shapes.add_picture(nl.LOGO_WHITE, Inches(ML), Inches(6.16),
                          height=Inches(0.42))
    txt(sl, CR - 4.0, 6.28, 4.0, 0.24, "Setembro de 2026", font=F_REG,
        size=8.6, color=WHITE, align="r", tracking=0.8)
    return sl


# ==================================================== 02 · O QUE MUDOU
def s02(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "O que mudou",
         [("O acesso ao MTR Nacional agora é ", {}),
          ("pelo Gov.br", {"font": F_SB})], 2)

    rect(sl, ML, 1.94, CW, 0.66, fill=INDIGO)
    ic_calendar(sl, ML + 0.26, 2.10, 0.34, WHITE)
    rich(sl, ML + 0.76, 1.94, CW - 1.0, 0.66,
         [("Desde 1º de agosto de 2026", {"font": F_SB}),
          (", o acesso ao MTR Nacional – SINIR é feito exclusivamente por "
           "meio do Login Único Gov.br.", {})],
         font=F_REG, size=11.4, color=WHITE, anchor="m", ls=1.26)

    items = [
        (ic_ban, "A senha antiga não vale mais",
         "O login com a senha gerada pelo próprio sistema MTR foi "
         "descontinuado.", RED),
        (ic_cpf, "O acesso é por CPF",
         "Cada pessoa entra com a sua própria conta Gov.br e é identificada "
         "individualmente.", INDIGO),
        (ic_user_plus, "É preciso vínculo com a unidade",
         "O CPF só emite se estiver vinculado e autorizado na unidade da "
         "empresa.", INDIGO),
        (ic_shield, "Mais rastreabilidade",
         "Toda ação no sistema fica registrada no CPF de quem a executou.",
         GREEN),
    ]
    cw, gap = 2.72, 0.245
    y = 2.86
    for i, (ic, t, d, cl) in enumerate(items):
        x = ML + i * (cw + gap)
        card(sl, x, y, cw, 2.32, fill=WHITE, line=RULE, accent=cl)
        ic(sl, x + 0.26, y + 0.30, 0.44, cl)
        txt(sl, x + 0.26, y + 0.94, cw - 0.52, 0.58, t, font=F_SB, size=10.8,
            color=INK, ls=1.20)
        txt(sl, x + 0.26, y + 1.54, cw - 0.52, 0.68, d, size=8.8, color=GREY,
            ls=1.28)

    note(sl, 5.50,
         "Nada muda nas suas obrigações ambientais: o MTR continua obrigatório "
         "a cada envio de carga. O que mudou foi apenas a forma de entrar no "
         "sistema.", icon=ic_doc_check, h=0.62)
    source(sl, 6.28,
           "Fonte: portal do SINIR (sinir.gov.br/sistemas/mtr) e comunicado "
           "oficial “Login Único (Gov.br) — Sistema MTR Nacional”.")
    return sl


# ================================================= 03 · ANTES x DEPOIS
def s03(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Antes e depois",
         [("O que exatamente mudou ", {}), ("no login", {"font": F_SB})], 3)

    rows = [("CNPJ + CPF do usuário + senha do sistema",
             "CPF + senha da conta Gov.br"),
            ("Senha gerada e enviada pelo próprio MTR",
             "Senha única da sua conta Gov.br"),
            ("Uma senha usada por várias pessoas",
             "Um acesso individual por pessoa"),
            ("Terceiros entravam com a senha do cliente",
             "Terceiros precisam de vínculo autorizado"),
            ("Recuperação de senha pelo sistema MTR",
             "Recuperação pelo próprio Gov.br")]
    lx, rx, colw = ML, 6.95, 4.35
    hy, rh = 2.10, 0.64

    txt(sl, lx, hy, colw, 0.34, "Até 31 / 07 / 2026", font=F_SB, size=10.4,
        color=GREY, tracking=1.3, caps=True)
    rect(sl, rx, hy - 0.12, colw + 1.05, 0.58, fill=INDIGO)
    txt(sl, rx + 0.28, hy - 0.12, colw, 0.58, "A partir de 01 / 08 / 2026",
        font=F_SB, size=11.2, color=WHITE, tracking=1.3, caps=True, anchor="m")
    hline(sl, lx, hy + 0.46, colw, RULE, 1.2)

    for i, (a, b) in enumerate(rows):
        y = hy + 0.62 + i * rh
        txt(sl, lx, y, colw - 0.30, rh, a, font=F_REG, size=10.8, color=GREY,
            anchor="m", ls=1.22)
        rect(sl, rx, y, colw + 1.05, rh - 0.06,
             fill=TINT if i % 2 == 0 else TINT_2)
        rect(sl, rx, y, 0.035, rh - 0.06, fill=INDIGO)
        txt(sl, rx + 0.28, y, colw, rh - 0.06, b, font=F_SB, size=10.8,
            color=INK, anchor="m", ls=1.22)
        arrow_abs(sl, [(lx + colw + 0.28, y + (rh - 0.06) / 2),
                       (rx - 0.20, y + (rh - 0.06) / 2)], GREY_LT, 1.0, 0.070)
        if i < len(rows) - 1:
            hline(sl, lx, y + rh - 0.03, colw, RULE_SOFT, 1.0)

    note(sl, 6.00,
         "O cadastro da sua empresa e o histórico de MTRs continuam os mesmos. "
         "A mudança é na autenticação, não nos dados.", icon=ic_shield,
         color=GREEN, fill=GREEN_LT, h=0.58)
    return sl


# ============================================= 04 · POR QUE AFETA VOCE
def s04(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Por que isso afeta você",
         [("O acesso é ", {}), ("da pessoa", {"font": F_SB}),
          (", não da empresa", {})], 4)

    txt(sl, ML, 1.98, 5.45, 0.86,
        "Antes, quem tinha a senha da empresa entrava no sistema. Agora o "
        "sistema identifica a pessoa física pelo CPF e só libera as unidades "
        "às quais aquele CPF está vinculado.",
        size=10.6, color=GREY, ls=1.40)

    flow = [(ic_cpf, "O CPF da pessoa", "Conta Gov.br individual e pessoal"),
            (ic_user_plus, "O vínculo com a unidade",
             "Autorizado pelo Administrador da empresa"),
            (ic_doc_check, "A emissão do MTR",
             "Somente com vínculo ativo na unidade")]
    y = 3.06
    for i, (ic, t, d) in enumerate(flow):
        yy = y + i * 1.02
        cl = GREEN if i == 2 else INDIGO
        circle(sl, ML + 0.29, yy + 0.29, 0.58, fill=WHITE, line=cl, lw=1.2)
        ic(sl, ML + 0.29 - 0.16, yy + 0.29 - 0.16, 0.32, cl)
        txt(sl, ML + 0.78, yy + 0.04, 4.6, 0.28, t, font=F_SB, size=11.0,
            color=INK)
        txt(sl, ML + 0.78, yy + 0.34, 4.6, 0.30, d, size=9.0, color=GREY,
            ls=1.24)
        if i < 2:
            arrow_abs(sl, [(ML + 0.29, yy + 0.66), (ML + 0.29, yy + 0.94)],
                      GREY_LT, 1.0, 0.070)

    perfis = [(ic_shield, "Usuário Administrador",
               "Responsável pelo cadastro da empresa. Edita dados cadastrais, "
               "gerencia usuários, concede permissões e pode desativar "
               "acessos da unidade. Pode criar usuários Padrão e outros "
               "Administradores.", INDIGO),
              (ic_people, "Usuário Padrão",
               "Acessa o sistema pela unidade à qual está vinculado, mas não "
               "acessa os menus de edição dos dados da empresa nem dos "
               "usuários da unidade.", GREY)]
    px, pw = 6.95, 5.53
    for i, (ic, t, d, cl) in enumerate(perfis):
        yy = 2.02 + i * 2.06
        card(sl, px, yy, pw, 1.90, fill=TINT, line=None, accent=cl)
        ic(sl, px + 0.28, yy + 0.30, 0.40, cl)
        txt(sl, px + 0.82, yy + 0.36, pw - 1.1, 0.30, t, font=F_SB, size=11.4,
            color=INK)
        txt(sl, px + 0.28, yy + 0.86, pw - 0.56, 0.92, d, size=9.2, color=GREY,
            ls=1.32)

    source(sl, 6.26,
           "Fonte: comunicado oficial do SINIR sobre os tipos de usuário do "
           "Sistema MTR (Usuário Administrador e Usuário Padrão).")
    return sl


# ========================================== 05 · IMPACTO NA OPERACAO
def s05(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Impacto na nossa operação",
         [("Por que ", {}), ("não conseguimos mais emitir", {"font": F_SB}),
          (" no seu lugar", {})], 5)

    txt(sl, ML, 1.98, 5.45, 1.30,
        "Até 31/07/2026 nós emitíamos o MTR usando o acesso da sua empresa. "
        "Com o Login Único, o nosso acesso passou a ser o CPF do nosso "
        "responsável — e ele identifica a Nunes & Lucato como transportadora, "
        "na nossa própria unidade.",
        size=10.6, color=GREY, ls=1.40)

    bullets(sl, ML, 3.40, 5.30, 1.6,
            ["O nosso login não alcança a unidade do gerador.",
             "Sem vínculo autorizado, o sistema não exibe a sua empresa.",
             "Não há como emitir MTR em nome de quem não nos autorizou."],
            size=10.2, color=INK_SOFT, dot_color=RED, ls=1.30, gap=9)

    note(sl, 5.06,
         "Isso não é uma restrição da Nunes & Lucato: é uma regra do próprio "
         "sistema MTR Nacional.", icon=ic_warning, color=RED, fill=RED_LT,
         h=0.62, w=5.30)

    box = shot(sl, "mtr_perfil.png", 6.95, 2.10, 5.53,
               cap="Cabeçalho da nossa conta no MTR Nacional: empresa, usuário "
                   "e perfil.", max_h=1.10)
    hl(sl, box, 0.010, 0.640, 0.560, 0.320)
    txt(sl, 6.95, 3.42, 5.53, 0.60,
        "O nosso perfil no sistema é de Transportador. Ele nos permite "
        "emitir MTR nas unidades em que estamos autorizados — e só nelas.",
        size=9.6, color=INK_SOFT, ls=1.32)

    kv_card(sl, 6.95, 4.24, 5.53, 1.86, "O que isso significa na prática",
            [("Coleta sem MTR", "não pode circular"),
             ("MTR emitido por nós", "só com autorização sua"),
             ("Autorização", "leva minutos, uma única vez")],
            icon=ic_truck, accent=INDIGO, rh=0.32)
    return sl


# ============================================ 06 · O QUE PRECISAMOS
def s06(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "A solução",
         [("Você autoriza o nosso CPF ", {}),
          ("na sua unidade", {"font": F_SB})], 6)

    steps = [("01", "Você recebe os nossos dados", ic_cpf,
              "Nome, CPF e e-mail da nossa responsável estão no card abaixo."),
             ("02", "Seu Administrador autoriza", ic_user_plus,
              "Cadastro direto no sistema ou aprovação da nossa solicitação."),
             ("03", "Voltamos a emitir", ic_user_check,
              "A emissão volta ao normal, sem mudança na sua rotina.")]
    cw, gap = 3.71, 0.26
    y = 2.04
    for i, (num, t, ic, d) in enumerate(steps):
        x = ML + i * (cw + gap)
        cl = GREEN if i == 2 else INDIGO
        card(sl, x, y, cw, 2.24, fill=WHITE, line=RULE, accent=cl)
        txt(sl, x + 0.28, y + 0.28, 1.2, 0.5, num, font=F_LIGHT, size=30,
            color=cl, ls=1.0)
        ic(sl, x + cw - 0.82, y + 0.32, 0.46, cl)
        txt(sl, x + 0.28, y + 1.06, cw - 0.56, 0.56, t, font=F_SB, size=11.4,
            color=INK, ls=1.22)
        txt(sl, x + 0.28, y + 1.60, cw - 0.56, 0.56, d, size=9.0, color=GREY,
            ls=1.28)
        if i < 2:
            arrow_abs(sl, [(x + cw + 0.04, y + 1.12),
                           (x + cw + gap - 0.04, y + 1.12)], GREY_LT, 1.0,
                      0.070)

    kv_card(sl, ML, 4.58, 5.66, 1.90, "Dados da nossa responsável",
            [("Nome completo", NL_NOME),
             ("CPF", NL_CPF),
             ("E-mail", NL_EMAIL)],
            icon=ic_people, accent=INDIGO, rh=0.32)

    note(sl, 4.58, "Nenhuma senha pessoal é compartilhada neste caminho. "
                   "Cada MTR emitido fica registrado no CPF de quem o emitiu, "
                   "o que aumenta a sua rastreabilidade e a nossa.",
         icon=ic_shield, color=GREEN, fill=GREEN_LT, h=1.90, x=6.82, w=5.66,
         size=10.2)
    return sl


# =============================================== 07 · AS DUAS ROTAS
def s07(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "As duas rotas",
         [("Escolha ", {}), ("como prefere autorizar", {"font": F_SB})], 7)

    cw = (CW - 0.32) / 2
    y = 2.02
    rotas = [
        (INDIGO, "Rota A", "Você cadastra o nosso CPF", ic_menu, "Mais rápida",
         [("Quem executa", "o Administrador da sua unidade"),
          ("Quanto tempo", "poucos minutos"),
          ("O que precisa", "os dados do slide 10"),
          ("Passo a passo", "slides 8 a 12, com as telas")]),
        (GREEN, "Rota B", "Nós solicitamos, você aprova", ic_user_check,
         "Menos trabalho",
         [("Quem executa", "nossa equipe faz o pedido"),
          ("Seu papel", "apenas aprovar a solicitação"),
          ("O que precisa", "nada de antemão"),
          ("Passo a passo", "slides 13 a 15")]),
    ]
    for i, (cl, kicker, t, ic, pill_txt, pares) in enumerate(rotas):
        x = ML + i * (cw + 0.32)
        card(sl, x, y, cw, 3.62, fill=WHITE, line=RULE, accent=cl)
        ic(sl, x + 0.30, y + 0.34, 0.46, cl)
        txt(sl, x + 0.92, y + 0.36, 2.2, 0.24, kicker, font=F_SB, size=8.6,
            color=cl, tracking=1.5, caps=True)
        pill(sl, x + cw - 1.72, y + 0.32, 1.42, 0.28, pill_txt, fill=cl,
             size=7.2)
        txt(sl, x + 0.30, y + 0.96, cw - 0.60, 0.70, t, font=F_LIGHT,
            size=15.5, color=INK, ls=1.22)
        hline(sl, x + 0.30, y + 1.72, cw - 0.60, RULE, 1.0)
        yy = y + 1.92
        for k, v in pares:
            txt(sl, x + 0.30, yy, 1.90, 0.30, k, font=F_MED, size=9.0,
                color=GREY, ls=1.2)
            txt(sl, x + 2.24, yy, cw - 2.54, 0.30, v, font=F_SB, size=9.4,
                color=INK, ls=1.2)
            yy += 0.38

    note(sl, 5.88,
         "As duas rotas levam ao mesmo resultado. Escolha a que for mais "
         "prática para a sua equipe — e, se preferir, comece pela Rota B: "
         "nós damos o primeiro passo.", icon=ic_bulb, h=0.70)
    return sl


# ================================= 08 · ROTA A · ENTRAR NO SISTEMA
def s08(prs):
    sl = add_slide(prs)
    bg_white(sl)
    return passo_1fig(
        sl, "Rota A  ·  Passo 1 de 4",
        [("Entre no MTR Nacional pelo ", {}), ("Gov.br", {"font": F_SB})], 8,
        [("Abra mtr.sinir.gov.br",
          "Ignore os campos CNPJ, CPF e Senha: são do login antigo."),
         ("Clique em “Entrar com GOV.BR”",
          "É o único caminho de acesso desde 01/08/2026."),
         ("Informe o CPF e a senha Gov.br",
          "Do responsável pela empresa, não a senha antiga do MTR."),
         ("Selecione a sua unidade",
          "Clique no ícone da coluna “Selecionar”.")],
        "guia_fig01.png",
        "Figura 1 — tela inicial do MTR Nacional. O destaque marca o botão "
        "“Entrar com GOV.BR”.",
        hls=[(0.734, 0.750, 0.116, 0.052, 2, "tl")],
        obs="Sem conta Gov.br ainda? Crie em gov.br antes. Atenção: e-mails "
            "Outlook, Hotmail e Live não são aceitos no cadastro no momento.")


# ============================== 09 · ROTA A · MEUS USUARIOS
def s09(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Rota A  ·  Passo 2 de 4",
         [("Abra ", {}), ("Configurações › Meus Usuários", {"font": F_SB})], 9)
    note(sl, 1.94,
         "No menu principal, abra Configurações e clique em Meus Usuários. A "
         "tela Gerenciar Usuários lista quem tem acesso à unidade e traz o "
         "botão Adicionar Usuário.", icon=ic_menu, h=0.58)

    yimg = 2.72
    w1 = 4.28
    b1 = shot(sl, "mtr_menu.png", ML, yimg, w1)
    hl(sl, b1, 0.428, 0.024, 0.228, 0.128, n=1, badge="tr")
    hl(sl, b1, 0.430, 0.462, 0.190, 0.090, n=2, badge="tr")

    x2 = ML + w1 + 0.34
    w2 = CR - x2
    b2 = shot(sl, "mtr_gerenciar.png", x2, yimg, w2)
    hl(sl, b2, 0.090, 0.262, 0.122, 0.113, n=3, badge="tr")

    ycap = yimg + max(b1[3], b2[3]) + 0.08
    caption(sl, ML, ycap, w1,
            "Menu Configurações aberto: 1 o menu, 2 Meus Usuários.")
    caption(sl, x2, ycap, w2,
            "Tela Gerenciar Usuários: 3 o botão Adicionar Usuário e a lista "
            "de quem já tem acesso.")

    note(sl, 5.40,
         "Não encontrou o menu Configurações? Então esse login não é "
         "Administrador da unidade. Procure quem cadastrou a empresa no MTR, "
         "ou fale com a gente.", icon=ic_warning, color=AMBER_DK,
         fill=AMBER_LT, h=0.58)
    note(sl, 6.02,
         "O mesmo caminho serve para aprovar uma solicitação da Rota B.",
         icon=ic_bulb, h=0.42, size=9.2)
    source(sl, 6.52, "Prints próprios da Nunes & Lucato — MTR Nacional.")
    return sl


# ================================ 10 · ROTA A · CAMPOS DO FORMULARIO
def s10(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Rota A  ·  Passo 3 de 4",
         [("Preencha os campos ", {}), ("obrigatórios", {"font": F_SB})], 10)

    kv_card(sl, ML, 2.02, 6.10, 2.42, "Copie exatamente estes dados",
            [("Nome", NL_NOME),
             ("CPF", NL_CPF),
             ("Cargo", NL_CARGO),
             ("Celular", NL_CELULAR),
             ("Email", NL_EMAIL)],
            icon=ic_cpf, accent=INDIGO, rh=0.32, top=0.74)

    txt(sl, ML, 4.62, 6.10, 0.26, "Campos opcionais", font=F_SB, size=9.2,
        color=GREY, tracking=1.4, caps=True)
    txt(sl, ML, 4.92, 6.10, 0.30,
        "Departamento, Telefone e Ramal podem ficar em branco.",
        size=9.6, color=INK_SOFT, ls=1.26)

    note(sl, 5.40,
         "O CPF é o que liga a conta Gov.br dela à sua unidade: um dígito "
         "errado impede o vínculo. Os campos marcados com asterisco são "
         "obrigatórios.", icon=ic_warning, color=RED, fill=RED_LT, h=0.72,
         w=6.10)

    box = shot(sl, "mtr_form_top.png", 7.22, 2.02, CR - 7.22,
               max_h=3.86, center_in=(7.22, CR - 7.22))
    for i, fy in enumerate((0.2363, 0.3734, 0.5105, 0.7848), start=1):
        hl(sl, box, 0.022, fy, 0.935, 0.066, n=i, badge="tl")
    caption(sl, 7.22, box[1] + box[3] + 0.08, CR - 7.22,
            "Janela Adicionar/Editar Usuário: 1 Nome, 2 CPF, 3 Cargo, "
            "4 Celular.")
    source(sl, 6.44, "Print próprio da Nunes & Lucato — MTR Nacional.")
    return sl


# ============================ 11 · ROTA A · ATIVO E TIPO DE USUARIO
def s11(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Rota A  ·  Passo 4 de 4",
         [("Deixe ", {}), ("Ativo", {"font": F_SB}), (", escolha o ", {}),
          ("tipo", {"font": F_SB}), (" e salve", {})], 11)
    note(sl, 1.94,
         "No fim do formulário há três chaves e o botão Salvar. É aqui que "
         "você define se a nossa responsável entra como Usuário Padrão ou "
         "Usuário Administrador.", icon=ic_user_plus, h=0.58)

    box = shot(sl, "mtr_toggles.png", ML, 2.70, 8.20)
    hl(sl, box, 0.015, 0.130, 0.155, 0.304, n=1, badge="tl")
    hl(sl, box, 0.2105, 0.087, 0.4737, 0.478, n=2, badge="tr")
    hl(sl, box, 0.409, 0.600, 0.167, 0.296, n=3, badge="br")
    caption(sl, ML, 2.70 + box[3] + 0.08, 8.20,
            "1 chave Ativo · 2 Usuário Padrão ou Usuário Administrador · "
            "3 botão Salvar.")

    kv_card(sl, 9.30, 2.70, CR - 9.30, 1.72, "A terceira chave",
            [("O que é", "token de API"),
             ("Precisamos?", "não"),
             ("Deixe", "desligada")],
            icon=ic_key, accent=GREY, rh=0.30, size=8.8, top=0.72)

    cw = (CW - 0.32) / 2
    y = 4.72
    tipos = [
        (INDIGO, "Usuário Administrador", ic_shield, "Sugerido",
         ["Cuidamos também da gestão de acessos da unidade.",
          "Você continua Administrador: o seu acesso não muda."]),
        (GREY, "Usuário Padrão", ic_people, "Mais restrito",
         ["Sem acesso aos dados cadastrais nem aos usuários.",
          "Suficiente para a rotina de emissão. [CONFIRMAR]"]),
    ]
    for i, (cl, t, ic, pill_txt, its) in enumerate(tipos):
        x = ML + i * (cw + 0.32)
        card(sl, x, y, cw, 1.56, fill=WHITE, line=RULE, accent=cl)
        ic(sl, x + 0.28, y + 0.26, 0.36, cl)
        pill(sl, x + cw - 1.42, y + 0.26, 1.12, 0.26, pill_txt, fill=cl,
             size=7.0)
        txt(sl, x + 0.76, y + 0.30, cw - 2.30, 0.30, t, font=F_SB, size=11.0,
            color=INK)
        bullets(sl, x + 0.28, y + 0.78, cw - 0.62, 0.7, its, size=9.2,
                color=INK_SOFT, dot_color=cl, ls=1.26, gap=6)

    source(sl, 6.44,
           "Print próprio da Nunes & Lucato. [CONFIRMAR — se o perfil Padrão "
           "basta para emitir MTR na sua unidade]  O tipo pode ser trocado "
           "depois, a qualquer momento.")
    return sl


# =============================== 12 · ROTA A · CONFERIR E REVOGAR
def s12(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Rota A  ·  Conclusão",
         [("Confira a lista e ", {}),
          ("saiba como revogar", {"font": F_SB})], 12)
    note(sl, 1.94,
         "Depois de salvar, a nossa responsável passa a aparecer em Usuários "
         "Cadastrados. Confira as colunas Tipo e Situação — e nos avise.",
         icon=ic_user_check, color=GREEN, fill=GREEN_LT, h=0.58)

    box = shot(sl, "mtr_linha.png", ML, 2.68, CW)
    hl(sl, box, 0.6553, 0.005, 0.1158, 0.745, n=1, badge="br")
    hl(sl, box, 0.8675, 0.005, 0.0579, 0.745, n=2, badge="br")
    hl(sl, box, 0.9254, 0.005, 0.0482, 0.745, n=3, badge="br")
    caption(sl, ML, 2.68 + box[3] + 0.08, CW,
            "Lista de usuários cadastrados: 1 coluna Tipo · 2 coluna Situação "
            "· 3 ícone de edição, em Ações.")

    cw = (CW - 0.32) / 2
    y = 4.58
    card(sl, ML, y, cw, 1.30, fill=TINT, line=None, accent=GREEN)
    ic_user_check(sl, ML + 0.28, y + 0.24, 0.34, GREEN)
    txt(sl, ML + 0.74, y + 0.28, cw - 1.0, 0.28, "Confira antes de fechar",
        font=F_SB, size=10.4, color=INK)
    bullets(sl, ML + 0.28, y + 0.68, cw - 0.62, 0.6,
            ["Situação: Ativo.",
             "Tipo: conforme você escolheu no passo 4."],
            size=9.2, color=INK_SOFT, dot_color=GREEN, ls=1.26, gap=6)

    x2 = ML + cw + 0.32
    card(sl, x2, y, cw, 1.30, fill=TINT, line=None, accent=INDIGO)
    ic_shield(sl, x2 + 0.28, y + 0.24, 0.34, INDIGO)
    txt(sl, x2 + 0.74, y + 0.28, cw - 1.0, 0.28, "Para revogar depois",
        font=F_SB, size=10.4, color=INK)
    txt(sl, x2 + 0.28, y + 0.68, cw - 0.56, 0.56,
        "Mesmo caminho, clique no ícone de edição e desligue a chave Ativo. "
        "Reversível a qualquer momento, sem depender de nós.",
        size=9.2, color=INK_SOFT, ls=1.28)

    note(sl, 5.98,
         "Regra do sistema: um Administrador só pode ser inativado se houver "
         "outro Administrador cadastrado na unidade.", icon=ic_warning,
         color=AMBER_DK, fill=AMBER_LT, h=0.46, size=9.2)
    source(sl, 6.50, "Print próprio da Nunes & Lucato — MTR Nacional.")
    return sl


# ================================= 13 · ROTA B · CPF SEM VINCULO
def s13(prs):
    sl = add_slide(prs)
    bg_white(sl)
    return passo_2fig(
        sl, "Rota B  ·  Passo 1 de 3",
        [("Nós entramos e o sistema avisa que ", {}),
         ("falta o vínculo", {"font": F_SB})], 13,
        "Nossa responsável entra no MTR Nacional com o CPF dela. Como ela "
        "ainda não está vinculada à sua unidade, o sistema exibe o aviso e "
        "oferece o botão “Pesquisar CPF/CNPJ”.",
        [("guia_fig06.png",
          "Figura 6 — aviso de CPF sem vínculo com nenhum empreendimento."),
         ("guia_fig07.png",
          "Figura 7 — destaque no botão “Pesquisar CPF/CNPJ”.")],
        hls_b=[(0.6916, 0.2040, 0.0906, 0.0580, 1, "tl")],
        obs="Este passo é da nossa equipe. Se o sistema não aceitar a "
            "solicitação, confira em Configurações › Ativar solicitações "
            "usuário se a sua unidade recebe pedidos de acesso. [CONFIRMAR]")


# ============================== 14 · ROTA B · SOLICITAR O ACESSO
def s14(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Rota B  ·  Passo 2 de 3",
         [("Localizamos a sua empresa e ", {}),
          ("solicitamos o acesso", {"font": F_SB})], 14)
    note(sl, 1.98,
         "Buscamos a sua empresa pelo CNPJ. Na coluna “Solicitar acesso”, "
         "selecionamos a unidade e preenchemos os dados cadastrais da nossa "
         "responsável. Ainda é tudo do nosso lado.",
         icon=ic_clipboard, h=0.60)

    cw = (CW - 0.32) / 2
    b1 = shot(sl, "guia_fig08.png", ML, 2.80, cw,
              cap="Figura 8 — coluna “Solicitar acesso”.", max_h=2.42,
              center_in=(ML, cw))
    hl(sl, b1, 0.7100, 0.2620, 0.0720, 0.6800, n=1, badge="tr")
    b2 = shot(sl, "guia_fig09.png", ML + cw + 0.32, 2.80, cw,
              cap="Figura 9 — janela “Dados Cadastrais” e botão “Enviar”.",
              max_h=2.42, center_in=(ML + cw + 0.32, cw))
    hl(sl, b2, 0.5950, 0.6740, 0.0470, 0.0520, n=2, badge="tl")

    note(sl, 5.70,
         "Depois do envio, a solicitação fica pendente de aprovação. A sua "
         "unidade pode nos contatar por e-mail ou telefone antes de aprovar.",
         icon=ic_route, color=GREEN, fill=GREEN_LT, h=0.52)
    source(sl, 6.30, FONTE_GUIA + "  ·  Figuras 8 e 9.")
    return sl


# ================================ 15 · ROTA B · VOCE APROVA
def s15(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Rota B  ·  Passo 3 de 3",
         [("Seu Administrador ", {}), ("aprova a solicitação", {"font": F_SB}),
          (" — e pronto", {})], 15)

    steps_list(sl, ML, 2.02, 5.40,
               [("A solicitação chega para o Administrador",
                 "É quem cadastrou a sua empresa no MTR Nacional."),
                ("Ele entra no Gerenciador de Usuários",
                 "Configurações › Meus Usuários › Gerenciador de Usuários."),
                ("Confere o nome e o CPF da solicitante",
                 f"{NL_NOME} · {NL_CPF}"),
                ("Aprova e deixa o usuário “Ativo”",
                 "O acesso é liberado e a emissão volta ao normal.")],
               gap=0.94, color=GREEN)

    box = shot(sl, "guia_fig10.png", 6.95, 2.02, 5.53,
               cap="Figura 10 — confirmação de que a solicitação foi enviada e "
                   "aguarda aprovação.", max_h=2.40, center_in=(6.95, 5.53))

    note(sl, 5.06,
         "Se preferir, o Administrador pode simplesmente nos cadastrar direto, "
         "pela Rota A (slides 8 a 12). O resultado é o mesmo.",
         icon=ic_bulb, h=0.56, x=6.95, w=5.53, size=9.2)

    note(sl, 5.90,
         "Aprovado o acesso, nos avise: testamos na hora e retomamos a emissão "
         "dos seus MTRs.", icon=ic_user_check, color=GREEN, fill=GREEN_LT,
         h=0.56)
    source(sl, 6.50, FONTE_GUIA + "  ·  Figura 10.  [PRINT PENDENTE — tela de "
                                  "aprovação da solicitação]")
    return sl


# ================== 16 · SE A EMPRESA AINDA NAO EXISTE NO MTR
def s16(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Caso especial",
         [("Se a sua empresa ", {}),
          ("ainda não existe no MTR", {"font": F_SB})], 16)
    note(sl, 1.98,
         "Se a busca não encontrar o CNPJ, o empreendimento ainda não está "
         "cadastrado. O próprio sistema oferece o cadastro — e quem o solicita "
         "passa a ser o Administrador da unidade.",
         icon=ic_warning, color=AMBER_DK, fill=AMBER_LT, h=0.60)

    figs = [("guia_fig12.png", "1", "Informe o CPF ou CNPJ na janela "
                                    "“Pesquisar Empreendimento”."),
            ("guia_fig13.png", "2", "Não localizado: clique em “Cadastrar "
                                    "Empreendimento”."),
            ("guia_fig15.png", "3", "Preencha o formulário e clique em "
                                    "“Solicitar Acesso”.")]
    cw, gap = 3.71, 0.26
    hls = [None,
           (0.4392, 0.5539, 0.1204, 0.0447),
           (0.4290, 0.8700, 0.0900, 0.0270)]
    for i, (fig, num, cap) in enumerate(figs):
        x = ML + i * (cw + gap)
        num_badge(sl, x + 0.16, 2.86, 0.30, num, fill=INDIGO)
        box = shot(sl, fig, x, 3.08, cw, max_h=1.86, center_in=(x, cw))
        if hls[i]:
            hl(sl, box, *hls[i])
        txt(sl, x, 5.06, cw, 0.56, cap, size=8.8, color=INK_SOFT, ls=1.28)

    note(sl, 5.76,
         "Atenção: a pessoa que solicitar o cadastro fica responsável pela "
         "gestão de acessos e pela aprovação dos novos usuários da unidade. "
         "Escolha bem quem fará isso.", icon=ic_shield, h=0.62)
    source(sl, 6.52, FONTE_GUIA + "  ·  Figuras 12, 13 e 15.")
    return sl


# ==================================== 17 · ALTERNATIVA: LOGIN E SENHA
def s17(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Alternativa",
         [("Se preferir ", {}),
          ("repassar o login e a senha Gov.br", {"font": F_SB})], 17)

    cw = (CW - 0.32) / 2
    y = 2.02

    card(sl, ML, y, cw, 3.34, fill=WHITE, line=RULE, accent=INDIGO)
    ic_key(sl, ML + 0.30, y + 0.32, 0.46, INDIGO)
    txt(sl, ML + 0.30, y + 0.94, cw - 0.60, 0.62, "Como funcionaria",
        font=F_LIGHT, size=15.5, color=INK, ls=1.22)
    hline(sl, ML + 0.30, y + 1.62, cw - 0.60, RULE, 1.0)
    bullets(sl, ML + 0.30, y + 1.80, cw - 0.66, 1.4,
            ["Você nos informa o CPF e a senha da conta Gov.br do responsável.",
             "Acessamos o MTR Nacional com essas credenciais.",
             "Seguimos emitindo os MTRs como antes.",
             "Nada muda na sua rotina."],
            size=9.6, color=INK_SOFT, dot_color=INDIGO, ls=1.28, gap=8)

    x2 = ML + cw + 0.32
    card(sl, x2, y, cw, 3.34, fill=RED_LT, line=None, accent=RED)
    ic_warning(sl, x2 + 0.30, y + 0.32, 0.46, RED)
    txt(sl, x2 + 0.30, y + 0.94, cw - 0.60, 0.62, "Antes de decidir, considere",
        font=F_LIGHT, size=15.5, color=INK, ls=1.22)
    hline(sl, x2 + 0.30, y + 1.62, cw - 0.60, RULE, 1.0)
    bullets(sl, x2 + 0.30, y + 1.80, cw - 0.66, 1.4,
            ["A conta Gov.br é pessoal e intransferível.",
             "A mesma senha abre outros serviços do governo em nome do titular.",
             "Toda ação fica registrada como se fosse o próprio titular.",
             "Uma troca de senha derruba o nosso acesso sem aviso."],
            size=9.6, color=INK_SOFT, dot_color=RED, ls=1.28, gap=8)

    note(sl, 5.48,
         "Nossa recomendação: prefira a Rota A ou a Rota B. O resultado "
         "prático é o mesmo — nós emitimos os seus MTRs — sem expor a conta "
         "pessoal do responsável e sem depender da senha dele.",
         icon=ic_shield, color=GREEN, fill=GREEN_LT, h=0.76, size=10.2)
    source(sl, 6.34,
           "A decisão é da sua empresa. Seguiremos a orientação que você nos "
           "der, por escrito.")
    return sl


# ================================================ 18 · FAQ
def s18(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Perguntas frequentes",
         [("O que mais ", {}), ("costuma gerar dúvida", {"font": F_SB})], 18)

    qas = [
        ("Vou perder meu cadastro e meu histórico?",
         "Não. A mudança é na forma de entrar. Cadastro da empresa, unidades e "
         "MTRs já emitidos continuam."),
        ("Minha senha antiga do MTR ainda funciona?",
         "Não. Desde 01/08/2026 o acesso é apenas pelo Login Único Gov.br."),
        ("Autorizar vocês dá acesso a mais alguma coisa?",
         "Não. O acesso vale só para a unidade autorizada e pode ser retirado "
         "quando você quiser."),
        ("Preciso marcar “Administrador” para vocês?",
         "Não é obrigatório. Marque se quiser que a gente também cuide da "
         "gestão de acessos da unidade."),
        ("Mais de uma pessoa pode ter acesso?",
         "Sim. O Administrador cadastra quantos usuários precisar, cada um com "
         "o seu CPF."),
        ("Quem tira dúvidas sobre o sistema?",
         "O canal oficial do módulo MTR Nacional é mtr.sinir@mma.gov.br. "
         "Nossa equipe também apoia."),
    ]
    cw, gap = (CW - 0.30) / 2, 0.30
    for i, (q, a) in enumerate(qas):
        r, c = divmod(i, 2)
        x = ML + c * (cw + gap)
        y = 2.02 + r * 1.48
        rect(sl, x, y, cw, 1.32, fill=TINT)
        rect(sl, x, y, 0.035, 1.32, fill=INDIGO)
        txt(sl, x + 0.28, y + 0.20, cw - 0.56, 0.40, q, font=F_SB, size=10.2,
            color=INK, ls=1.22)
        txt(sl, x + 0.28, y + 0.66, cw - 0.56, 0.60, a, size=9.0, color=GREY,
            ls=1.28)
    return sl


# ================================================ 19 · PONTOS DE ATENCAO
def s19(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Pontos de atenção",
         [("Situação e ", {}), ("o que fazer", {"font": F_SB})], 19)

    rows = [
        ("A senha antiga do MTR não funciona mais",
         "É esperado. Entre pelo botão “Entrar com GOV.BR” com a senha da "
         "conta Gov.br."),
        ("O responsável ainda não tem conta Gov.br",
         "Crie em gov.br antes de tudo. E-mails Outlook, Hotmail e Live não "
         "são aceitos no momento."),
        ("Não aparece o menu Configurações",
         "Esse login não é Administrador da unidade. Só ele vê Meus Usuários e "
         "a tela Gerenciar Usuários."),
        ("O Administrador saiu da empresa",
         "Outro Administrador precisa assumir antes: só é possível inativar se "
         "houver outro cadastrado."),
        ("A autorização ainda não foi concedida",
         "Sem o vínculo, não conseguimos emitir e a coleta fica parada. É o "
         "item mais urgente."),
    ]
    y, rh = 2.04, 0.82
    for i, (p, s) in enumerate(rows):
        yy = y + i * rh
        if i % 2 == 0:
            rect(sl, ML, yy, CW, rh - 0.08, fill=TINT_2)
        ic_warning(sl, ML + 0.22, yy + 0.20, 0.30, RED)
        txt(sl, ML + 0.70, yy + 0.10, 5.05, 0.62, p, font=F_SB, size=10.0,
            color=INK, ls=1.24, anchor="m")
        arrow_abs(sl, [(ML + 5.90, yy + (rh - 0.08) / 2),
                       (ML + 6.20, yy + (rh - 0.08) / 2)], GREY_LT, 1.0, 0.070)
        txt(sl, ML + 6.36, yy + 0.10, CW - 6.60, 0.62, s, size=9.6,
            color=INK_SOFT, ls=1.28, anchor="m")

    note(sl, 6.14,
         "Travou em qualquer um desses pontos? Fale com a gente — resolvemos "
         "junto.", icon=ic_people, h=0.48, size=9.2)
    return sl


# ============================================ 20 · O QUE FAZER AGORA
def s20(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "O que fazer agora",
         [("Um ", {}), ("checklist curto", {"font": F_SB}),
          (" para a sua equipe", {})], 20)

    checks = [
        ("Identifique o Administrador da sua unidade no MTR",
         "É quem cadastrou a empresa e pode autorizar novos usuários."),
        ("Confirme se essa pessoa tem conta Gov.br ativa",
         "Sem ela, não há como entrar no sistema."),
        ("Escolha a rota: A (você cadastra) ou B (nós solicitamos)",
         "As duas levam ao mesmo resultado."),
        ("Cadastre ou aprove o CPF da nossa responsável",
         f"{NL_NOME} · {NL_CPF}"),
        ("Nos avise por escrito quando estiver feito",
         "Testamos o acesso e retomamos a emissão na mesma hora."),
        ("Revise periodicamente os usuários da unidade",
         "Desative quem não faz mais parte da operação."),
    ]
    y = 2.02
    for i, (t, d) in enumerate(checks):
        yy = y + i * 0.76
        rect(sl, ML, yy + 0.06, 0.30, 0.30, fill=None, line=INDIGO, lw=1.3)
        txt(sl, ML + 0.50, yy, 7.4, 0.30, t, font=F_SB, size=10.6, color=INK,
            ls=1.22)
        txt(sl, ML + 0.50, yy + 0.30, 7.4, 0.30, d, size=9.0, color=GREY,
            ls=1.24)

    card(sl, 8.90, 2.02, 3.58, 2.42, fill=INDIGO, line=None)
    ic_calendar(sl, 9.16, 2.30, 0.42, WHITE)
    txt(sl, 9.16, 2.90, 3.06, 0.34, "Já em vigor", font=F_SB, size=11.0,
        color=WHITE, tracking=1.0, caps=True)
    rich(sl, 9.16, 3.28, 3.06, 0.9,
         [("1º de agosto\nde 2026", {"font": F_LIGHT, "size": 22,
                                     "color": WHITE})], ls=1.16)
    txt(sl, 9.16, 4.02, 3.06, 0.30, "Login exclusivo pelo Gov.br",
        size=9.0, color=WHITE, ls=1.24)

    note(sl, 4.62,
         "Sem acesso, sem MTR. Sem MTR, a carga não pode ser transportada. "
         "Resolver o acesso é o que destrava a coleta.",
         icon=ic_warning, color=RED, fill=RED_LT, h=0.80, x=8.90, w=3.58,
         size=9.4)
    return sl


# ================================================= 21 · ENCERRAMENTO
def s21(prs):
    sl = add_slide(prs)
    bg_dark(sl, "deep")
    px, pw = 8.55, 4.78
    vline(sl, px - 0.30, 0, H_IN, WHITE, 0.75, alpha=0.18)
    ic_circular(sl, 11.60, 0.82, 0.64, WHITE)

    eyebrow(sl, ML, 1.20, "Nunes & Lucato  ·  Gestão Ambiental", WHITE,
            size=8.6, rule_color=WHITE)
    rich(sl, ML, 1.62, 7.30, 2.2,
         [("A mudança é só no acesso. O nosso compromisso com a ", {}),
          ("rastreabilidade dos seus resíduos", {"font": F_SB}),
          (" e com a regularidade da sua documentação continua ", {}),
          ("exatamente o mesmo", {"font": F_SB}), (".", {})],
         font=F_LIGHT, size=17, color=WHITE, ls=1.46)

    hline(sl, ML, 3.92, 1.05, WHITE, 1.8, alpha=0.75)

    contatos = [("Fale com a nossa equipe", NL_NOME),
                ("E-mail", NL_EMAIL),
                ("Telefone / WhatsApp", "[INSERIR TELEFONE]"),
                ("Suporte oficial do MTR Nacional", "mtr.sinir@mma.gov.br")]
    y = 4.18
    for i, (k, v) in enumerate(contatos):
        yy = y + i * 0.44
        txt(sl, ML, yy, 3.5, 0.24, k, font=F_REG, size=8.0, color=WHITE,
            tracking=1.2, caps=True)
        txt(sl, ML + 3.60, yy - 0.03, 3.6, 0.28, v, font=F_SB, size=10.4,
            color=WHITE)

    sl.shapes.add_picture(nl.LOGO_WHITE, Inches(px + 0.30), Inches(1.62),
                          height=Inches(0.46))
    txt(sl, px + 0.30, 2.42, pw - 0.60, 0.26, "Fontes", font=F_SB, size=8.2,
        color=WHITE, tracking=1.6, caps=True)
    hline(sl, px + 0.30, 2.72, pw - 0.60, WHITE, 0.75, alpha=0.30)
    fontes = [
        "Portal do SINIR — Sistema MTR: sinir.gov.br/sistemas/mtr",
        "Comunicado “Login Único (Gov.br) — Sistema MTR Nacional”, SINIR: "
        "tipos de usuário e gerenciamento de acessos.",
        "Guia Rápido “Login Único GOV.BR — MTR Nacional/Sinir”, MMA/SINIR, "
        "v. 1.0, 05/01/2026 — origem das Figuras 1 a 15.",
        "gov.br — serviços Emitir o MTR e Criar sua conta gov.br.",
        "Print da tela do sistema: acervo próprio da Nunes & Lucato.",
    ]
    yy = 2.86
    for f in fontes:
        txt(sl, px + 0.30, yy, pw - 0.60, 0.62, f, size=7.8, color=WHITE,
            ls=1.30)
        yy += 0.62
    txt(sl, px + 0.30, 6.06, pw - 0.60, 0.40,
        "Reprodução das figuras oficiais permitida sem fins lucrativos, "
        "citada a fonte (MMA).", size=7.0, color=WHITE, ls=1.26)

    footer(sl, 21, TOTAL, dark=True, label=LABEL)
    return sl


# ================================================================ MONTAGEM
BUILDERS = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13,
            s14, s15, s16, s17, s18, s19, s20, s21]

SAFE_BOTTOM = FOOT_RULE_Y - 0.04      # 6.74 in: limite inferior do conteudo


def _check(prs):
    """Validacao geometrica: nada pode vazar do slide nem invadir o rodape.

    O erro recorrente ao montar este deck foi conteudo (faixas de nota e
    linhas de fonte) descendo por baixo de FOOT_RULE_Y e colidindo com a
    logomarca do rodape. A segunda regra abaixo pega exatamente isso.
    """
    warn = 0
    for i, sl in enumerate(prs.slides, 1):
        for sh in sl.shapes:
            try:
                x = sh.left / 914400.0
                y = sh.top / 914400.0
                w = sh.width / 914400.0
                h = sh.height / 914400.0
            except TypeError:
                continue
            # fundos e sobreposicoes decorativas de altura total
            full_bleed = h >= H_IN - 0.02
            # a malha diagonal decorativa de bg_dark() extrapola de proposito
            # e e recortada pelo PowerPoint
            decorativa = str(sh.shape_type).startswith("LINE")

            if (x < -0.01 or y < -0.01 or x + w > W_IN + 0.01
                    or y + h > H_IN + 0.01):
                if not full_bleed and not decorativa:
                    print(f"  [!] slide {i:02d}: forma fora do slide "
                          f"({x:.2f},{y:.2f},{w:.2f},{h:.2f}) {sh.shape_type}")
                    warn += 1

            # conteudo invadindo a faixa do rodape
            if full_bleed or decorativa or y >= FOOT_RULE_Y - 0.001:
                continue
            if y + h > SAFE_BOTTOM:
                print(f"  [!] slide {i:02d}: conteudo invade o rodapé "
                      f"(y={y:.2f} h={h:.2f} fim={y + h:.2f} > "
                      f"{SAFE_BOTTOM:.2f}) {sh.shape_type}")
                warn += 1

    print(f"  {'OK' if not warn else str(warn) + ' aviso(s)'} na verificacao "
          f"geometrica")
    return warn


def build(out, family="montserrat", check=True):
    use_font_family(family)
    _sync_fonts()
    prs = new_deck()
    for fn in BUILDERS:
        fn(prs)
    if check:
        _check(prs)
    if out:
        prs.save(out)
        n = len(prs.slides._sldIdLst)
        print(f"OK  {out}  ({n} slides)")
    return prs


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--check"]
    only_check = "--check" in sys.argv
    out = None if only_check else (args[0] if args else "deck.pptx")
    fam = args[1] if len(args) > 1 else "montserrat"
    build(out, fam)
