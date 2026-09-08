#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deck institucional Nunes & Lucato
Projeto de Assuncao da Area Livre do Ecoponto Belezinho
Primeiro Bioma Sustentavel de Reciclagem Textil da Cidade de Sao Paulo

Gera PPTX 16:9 totalmente editavel (texto, formas e icones vetoriais nativos).
"""
import sys
from nl_core import *

A = ASSETS
TOTAL = 21
LABEL = "Bioma Têxtil  ·  Ecoponto Belezinho"


# ------------------------------------------------------------------ cabecalho
def head(sl, eb, ttl, page, size=25.5, w=11.2, dark=False, y=0.66):
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


def stat(sl, x, y, num, unit, label, num_size=62, color=INDIGO):
    rich(sl, x, y, 5.0, num_size / 50, [(num, {"font": F_LIGHT, "size": num_size,
                                               "color": color}),
                                        ("  " + unit, {"font": F_LIGHT,
                                                       "size": num_size * 0.30,
                                                       "color": GREY})], ls=1.0)
    if label:
        txt(sl, x, y + num_size / 62.0 * 1.02, 5.0, 0.3, label, font=F_SB,
            size=9, color=GREY, tracking=1.4, caps=True)


def icon_badge(sl, cx, cy, d, icon, color=INDIGO, fill=TINT, ring=None):
    circle(sl, cx, cy, d, fill=fill, line=ring, lw=1.0)
    s = d * 0.52
    icon(sl, cx - s / 2, cy - s / 2, s, color)


def zone_chip(sl, x, y, w, h, num, name, desc=None, icon=None, color=INDIGO,
              fill=WHITE, border=RULE):
    rect(sl, x, y, w, h, fill=fill, line=border, lw=1.0)
    rect(sl, x, y, 0.03, h, fill=color)
    txt(sl, x + 0.24, y + 0.20, 0.6, 0.22, num, font=F_SB, size=8.6,
        color=color, tracking=1.2)
    if icon:
        icon(sl, x + w - 0.62, y + 0.18, 0.36, color)
    txt(sl, x + 0.24, y + 0.46, w - 0.5, 0.5, name, font=F_SB, size=10.4,
        color=INK, ls=1.2)
    if desc:
        txt(sl, x + 0.24, y + h - 0.52, w - 0.5, 0.46, desc, size=8.6,
            color=GREY, ls=1.24)


# =============================================================== 01 · CAPA
def s01(prs):
    sl = add_slide(prs)
    bg_dark(sl, "cover")
    # painel fotografico a direita, dissolvido no gradiente
    pw = 5.05
    px = W_IN - pw
    pic_cover(sl, f"{A}/duo_area_tall.jpg", px, 0, pw, H_IN, bias_y=0.55)
    rect(sl, px, 0, pw, H_IN, grad=[(0.0, INDIGO_DP, 0.96), (0.55, INDIGO_DP, 0.42),
                                    (1.0, INDIGO_DP, 0.20)], grad_angle=0)
    vline(sl, px, 0, H_IN, WHITE, 0.75, alpha=0.20)

    skyline(sl, 0, 5.62, W_IN, 1.05, WHITE, 0.13, 0.9)
    ic_recycle(sl, 11.35, 1.05, 0.62, WHITE)

    eyebrow(sl, ML, 1.42, "Proposta institucional  ·  Prefeitura de São Paulo",
            WHITE, size=8.6, tracking=1.9, rule_color=WHITE)
    title(sl, ML, 1.80, 7.0,
          [("Projeto de Assunção da\nÁrea Livre do ", {}),
           ("Ecoponto\nBelezinho", {"font": F_SB})],
          size=33, color=WHITE, ls=1.14)
    hline(sl, ML, 4.28, 1.05, WHITE, 1.8, alpha=0.75)
    txt(sl, ML, 4.52, 6.5, 0.9,
        "Criação do Primeiro Bioma Sustentável de Reciclagem\nTêxtil da Cidade de São Paulo",
        font=F_LIGHT, size=14, color=WHITE, ls=1.36)

    txt(sl, ML, 5.98, 4.0, 0.22, "Proposta apresentada pela", font=F_REG,
        size=8.2, color=WHITE, tracking=1.5, caps=True)
    sl.shapes.add_picture(LOGO_WHITE, Inches(ML), Inches(6.30),
                          height=Inches(0.40))
    return sl


# ========================================================= 02 · QUEM SOMOS
def s02(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Quem somos", [("Gestão ambiental especializada em ", {}),
                            ("resíduos têxteis", {"font": F_SB})], 2)
    txt(sl, ML, 1.98, 5.8, 1.5,
        "A Nunes & Lucato atua na cadeia de resíduos têxteis com estrutura "
        "própria de transformação, equipe treinada e rastreabilidade "
        "documental completa, da coleta à destinação final ambientalmente "
        "adequada.",
        size=10.8, color=GREY, ls=1.42)

    hline(sl, ML, 3.32, 5.8, RULE, 1.0)
    rich(sl, ML, 3.54, 5.8, 0.7,
         [("Da coleta à destinação final", {"font": F_SB, "size": 13.5,
                                            "color": INDIGO}),
          ("  ·  com respaldo documental", {"font": F_LIGHT, "size": 13.5,
                                            "color": INK})], ls=1.24)

    pic_frame(sl, f"{A}/eco_fachada.jpg", 7.35, 1.98, 5.15, 2.30,
              line=RULE, bias_y=0.5)

    items = [
        (ic_truck, "Coleta e transporte", "Com emissão de MTR, dando respaldo legal à logística."),
        (ic_scissors, "Descaracterização", "Avaliação e descaracterização peça por peça."),
        (ic_defiber, "Desfibramento", "Etiquetas, logos e referências de marca."),
        (ic_upcycle, "Upcycle", "Transformação em produtos de maior valor agregado."),
    ]
    cw, gap = 2.72, 0.245
    y = 4.62
    for i, (ic, t, d) in enumerate(items):
        x = ML + i * (cw + gap)
        cl = GREEN if ic is ic_upcycle else INDIGO
        card(sl, x, y, cw, 1.86, fill=WHITE, line=RULE, accent=cl)
        ic(sl, x + 0.24, y + 0.28, 0.40, cl)
        txt(sl, x + 0.24, y + 0.84, cw - 0.48, 0.28, t, font=F_SB, size=10.6,
            color=INK)
        txt(sl, x + 0.24, y + 1.14, cw - 0.48, 0.62, d, size=8.7, color=GREY,
            ls=1.26)
    return sl


# =================================================== 03 · COMO TRABALHAMOS
def s03(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Como trabalhamos", [("Estrutura própria, equipe treinada e ", {}),
                                  ("rastreabilidade", {"font": F_SB})], 3)

    items = [
        (ic_people, "Equipe capacitada",
         "Colaboradores treinados e artesãs com capacitação."),
        (ic_pin, "Atendimento local",
         "Operação e atendimento na Capital, próximos à origem do resíduo."),
        (ic_gear_leaf, "Unidade de transformação",
         "Processo registrado em fotografia e vídeo, peça por peça."),
        (ic_doc_check, "Documentação ambiental",
         "Atestado de descaracterização e documentação de destinação."),
    ]
    cw, ch, gx, gy = 3.30, 1.92, 0.26, 0.26
    x0, y0 = ML, 2.08
    for i, (ic, t, d) in enumerate(items):
        r, c = divmod(i, 2)
        x, y = x0 + c * (cw + gx), y0 + r * (ch + gy)
        card(sl, x, y, cw, ch, fill=TINT, line=None)
        ic(sl, x + 0.26, y + 0.26, 0.40, INDIGO)
        txt(sl, x + 0.26, y + 0.82, cw - 0.52, 0.28, t, font=F_SB, size=10.8,
            color=INK)
        txt(sl, x + 0.26, y + 1.14, cw - 0.52, 0.62, d, size=8.9, color=GREY,
            ls=1.28)

    px = x0 + 2 * (cw + gx)
    pic_frame(sl, f"{A}/duo_corredor_tall.jpg", px, y0, 4.42,
              2 * ch + gy, line=None, bias_y=0.5)
    # escurece a BASE do painel para garantir contraste do texto branco
    rect(sl, px, y0, 4.42, 2 * ch + gy,
         grad=[(0.0, INDIGO_DP, 0.08), (0.52, INDIGO_DP, 0.45),
               (1.0, INDIGO_DP, 0.88)], grad_angle=90)
    txt(sl, px + 0.30, y0 + 2 * ch + gy - 0.92, 3.8, 0.7,
        "Rastreabilidade completa\ndo material", font=F_LIGHT, size=14,
        color=WHITE, ls=1.28)
    return sl


# ==================================================== 04 · VISAO GERAL
def s04(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Visão geral do projeto",
         [("Oportunidade para transformar um espaço público em ", {}),
          ("referência nacional", {"font": F_SB})], 4, w=7.0, size=24)

    txt(sl, ML, 2.42, 5.9, 1.9,
        "O projeto propõe a assunção da área livre do Ecoponto Belezinho, "
        "localizado na Rua Herval, para implantação do primeiro Bioma "
        "Sustentável de Reciclagem Têxtil do Município de São Paulo, "
        "promovendo economia circular, redução de resíduos e destinação "
        "ambientalmente adequada dos materiais têxteis.",
        size=10.8, color=GREY, ls=1.46)

    # destaque "Bioma Sustentavel"
    rect(sl, ML, 4.50, 5.9, 0.96, fill=TINT)
    rect(sl, ML, 4.50, 0.035, 0.96, fill=GREEN)
    ic_leaf(sl, ML + 0.28, 4.72, 0.52, GREEN)
    rich(sl, ML + 1.00, 4.68, 4.6, 0.6,
         [("Bioma Sustentável", {"font": F_SB, "size": 14, "color": INK}),
          ("\nEconomia circular aplicada ao resíduo têxtil",
           {"font": F_REG, "size": 9.2, "color": GREY})], ls=1.34)

    # localizacao
    ic_pin(sl, ML, 5.72, 0.34, INDIGO)
    txt(sl, ML + 0.46, 5.74, 5.2, 0.5,
        "Rua Herval  ·  Ecoponto Belezinho  ·  São Paulo / SP",
        font=F_MED, size=9.6, color=INK_SOFT)

    pic_frame(sl, f"{A}/eco_area_wide.jpg", 7.35, 2.42, 5.15, 2.90,
              line=RULE, bias_y=0.55)
    caption(sl, 7.35, 5.42, 5.15,
            "Situação atual da área livre do Ecoponto Belezinho")
    skyline(sl, 7.35, 5.86, 5.15, 0.62, RULE, 1.0, 1.0)
    return sl


# ======================================================= 05 · OBJETIVO
def s05(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Objetivo", "Objetivo Principal", 5)

    rich(sl, ML, 2.10, 7.25, 2.5,
         [("Transformar a área livre do Ecoponto Belezinho em um ", {}),
          ("centro de referência para reciclagem têxtil sustentável",
           {"font": F_SB, "color": INK}),
          (", operando sob o conceito de ", {}),
          ("Aterro Zero", {"font": F_SB, "color": INDIGO}),
          (".", {})],
         font=F_LIGHT, size=19.5, color=INK_SOFT, ls=1.44)

    # painel conceitual
    rect(sl, 8.62, 1.98, 3.88, 3.30, fill=TINT)
    ic_leaf(sl, 11.72, 2.24, 0.52, GREEN)
    ic_circular(sl, 9.42, 2.62, 1.96, INDIGO)
    txt(sl, 8.62, 4.76, 3.88, 0.4, "Economia circular", font=F_SB, size=9.4,
        color=INDIGO, align="c", tracking=1.5, caps=True)

    # destaque ATERRO ZERO
    hline(sl, ML, 5.62, CW, RULE, 1.0)
    ic_zero_landfill(sl, ML, 5.86, 0.62, INDIGO)
    rich(sl, ML + 0.86, 5.80, 8.0, 0.8,
         [("ATERRO ZERO", {"font": F_SB, "size": 26, "color": INDIGO,
                           "tracking": 2.0})], ls=1.05)
    txt(sl, ML + 0.86, 6.30, 7.6, 0.3, "Máximo aproveitamento dos materiais",
        size=10, color=GREY)
    return sl


# ================================== 06 · ALINHAMENTO INSTITUCIONAL
def s06(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Alinhamento institucional",
         [("Integração com as ", {}), ("políticas públicas", {"font": F_SB}),
          (" e os compromissos globais", {})], 6, size=24)

    txt(sl, ML, 2.02, 11.0, 1.0,
        "Em perfeita integração com os objetivos das ODS e o Plano Municipal "
        "de Gerenciamento de Resíduos Sólidos do Município de São Paulo, a "
        "atividade integrará coleta, segregação, coworking para costureiras e "
        "espaço de integração para oficinas, workshops e cursos de "
        "aperfeiçoamento, voltados a artesãos e costureiras autônomas.",
        size=10.8, color=GREY, ls=1.46)

    items = [
        (ic_leaf, "ODS", "Objetivos de Desenvolvimento Sustentável",
         "Aderência aos compromissos globais de sustentabilidade.", GREEN),
        (ic_doc_check, "Plano Municipal", "Gerenciamento de Resíduos Sólidos",
         "Alinhamento ao instrumento de planejamento do Município de São Paulo.",
         INDIGO),
        (ic_people, "Mãos Paulistanas", "Possibilidade de integração",
         "O espaço poderá integrar o programa, caso seja de interesse da Prefeitura.",
         INDIGO),
    ]
    cw, gap = 3.71, 0.26
    y = 3.62
    for i, (ic, t, sub, d, cl) in enumerate(items):
        x = ML + i * (cw + gap)
        card(sl, x, y, cw, 2.42, fill=WHITE, line=RULE, accent=cl)
        ic(sl, x + 0.28, y + 0.32, 0.46, cl)
        txt(sl, x + 0.28, y + 0.96, cw - 0.56, 0.3, t, font=F_SB, size=12.6,
            color=INK)
        txt(sl, x + 0.28, y + 1.30, cw - 0.56, 0.3, sub, font=F_MED, size=9.2,
            color=cl)
        txt(sl, x + 0.28, y + 1.64, cw - 0.56, 0.66, d, size=8.9, color=GREY,
            ls=1.28)
    return sl


# ========================================= 07 · COMO FUNCIONARA O BIOMA
def s07(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Fluxo operacional", "Como funcionará o Bioma Têxtil", 7)

    steps = [
        (ic_truck, "Coleta", "Recolhimento na origem"),
        (ic_clipboard, "Recebimento", "Conferência e registro"),
        (ic_sort, "Separação", "Triagem técnica"),
        (ic_boxes, "Armazenamento", "Organização por lotes"),
        (ic_gear_leaf, "Processamento", "Adequação do material"),
        (ic_route, "Destinação Final", "Aterro Zero"),
    ]
    n = len(steps)
    cw, gap = 1.62, 0.38
    y = 2.32
    cy = y + 0.50
    for i, (ic, t, d) in enumerate(steps):
        x = ML + i * (cw + gap)
        cx = x + cw / 2
        icon_badge(sl, cx, cy, 1.00, ic, INDIGO, TINT)
        txt(sl, x - 0.10, y + 1.14, cw + 0.20, 0.30, t, font=F_SB, size=10.4,
            color=INK, align="c")
        txt(sl, x - 0.14, y + 1.46, cw + 0.28, 0.5, d, size=8.4, color=GREY,
            align="c", ls=1.24)
        if i < n - 1:
            ax = x + cw + 0.05
            arrow_abs(sl, [(ax, cy), (ax + gap - 0.12, cy)], INDIGO, 1.0, 0.085)

    note(sl, 4.72,
         "PICOTAGEM (atividade derivada): adequação dos materiais coletados às "
         "especificidades do mercado de desfibramento e coprocessamento.",
         icon=ic_shred, color=INDIGO, h=0.68)

    note(sl, 5.62,
         "Atividades de adequação dos materiais coletados executadas por "
         "profissionais treinados pela equipe Nunes & Lucato.",
         icon=ic_people, color=GREEN, fill=GREEN_LT, h=0.68)
    return sl


# ================================================ 08 · CAPACIDADE OPERACIONAL
def s08(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Estoque e armazenamento", "Capacidade Operacional", 8)

    rich(sl, ML, 2.02, 6.2, 1.5,
         [("1.000", {"font": F_LIGHT, "size": 82, "color": INDIGO}),
          ("  toneladas/mês", {"font": F_LIGHT, "size": 20, "color": GREY})],
         ls=1.0)
    hline(sl, ML, 3.52, 5.5, RULE, 1.0)

    items = [(ic_boxes, "Armazenamento temporário"),
             (ic_route, "Controle logístico"),
             (ic_clipboard, "Organização por lotes"),
             (ic_gear_leaf, "Fluxo operacional estruturado")]
    for i, (ic, t) in enumerate(items):
        r, c = divmod(i, 2)
        x = ML + c * 2.85
        y = 3.80 + r * 0.92
        ic(sl, x, y, 0.38, INDIGO)
        txt(sl, x + 0.54, y + 0.02, 2.25, 0.6, t, font=F_MED, size=9.8,
            color=INK_SOFT, ls=1.26)

    pic_frame(sl, f"{A}/eco_vao_wide.jpg", 7.62, 2.02, 4.88, 3.62, line=RULE,
              bias_y=0.45)
    caption(sl, 7.62, 5.74, 4.88,
            "Vão coberto do Ecoponto, área prevista para segregação e armazenamento")
    return sl


# =============================================== 09 · SEGREGACAO INTELIGENTE
def s09(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Segregação inteligente", "Separação Técnica dos Resíduos", 9)

    blocks = [("01", "Separação por cor", ic_palette,
               "Agrupamento cromático para reaproveitamento."),
              ("02", "Separação por composição", ic_molecule,
               "Identificação das fibras e materiais."),
              ("03", "Separação conforme destino final", ic_target,
               "Direcionamento por rota de destinação.")]
    cw, gap = 3.71, 0.26
    y = 2.06
    for i, (num, t, ic, d) in enumerate(blocks):
        x = ML + i * (cw + gap)
        card(sl, x, y, cw, 2.32, fill=WHITE, line=RULE, accent=INDIGO)
        txt(sl, x + 0.28, y + 0.30, 1.2, 0.5, num, font=F_LIGHT, size=30,
            color=INDIGO, ls=1.0)
        ic(sl, x + cw - 0.82, y + 0.34, 0.46, INDIGO)
        txt(sl, x + 0.28, y + 1.10, cw - 0.56, 0.56, t, font=F_SB, size=11.4,
            color=INK, ls=1.22)
        txt(sl, x + 0.28, y + 1.72, cw - 0.56, 0.46, d, size=9, color=GREY,
            ls=1.26)

    note(sl, 4.72,
         "A segregação poderá gerar uma terceira atividade: a PICOTAGEM, a fim "
         "de adequar o material às especificidades do mercado de desfibramento "
         "e coprocessamento.",
         icon=ic_shred, color=INDIGO, h=0.70)
    note(sl, 5.64,
         "Todo o processo será executado por profissionais treinados pela "
         "equipe Nunes & Lucato.",
         icon=ic_people, color=GREEN, fill=GREEN_LT, h=0.66)
    return sl


# ================================================= 10 · ESTOCAGEM ROTATIVA
def s10(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Estocagem rotativa", "Gestão eficiente do fluxo de materiais", 10)

    cx, cy, r = 3.62, 4.28, 1.48
    nodes = [("Entrada", -90), ("Organização", 0), ("Processamento", 90),
             ("Saída", 180)]
    # arcos com seta entre os nos
    for i in range(4):
        a0 = -90 + i * 90 + 16
        a1 = -90 + (i + 1) * 90 - 16
        ring_abs(sl, cx, cy, r, a0, a1, INDIGO, 1.15, arrow=True, head=0.105)
    for name, ang in nodes:
        nx = cx + r * math.cos(math.radians(ang))
        ny = cy + r * math.sin(math.radians(ang))
        circle(sl, nx, ny, 0.34, fill=WHITE, line=INDIGO, lw=1.3)
        circle(sl, nx, ny, 0.15, fill=INDIGO)
        dx = 0.0
        if ang == 0:
            tb = txt(sl, nx + 0.28, ny - 0.13, 1.35, 0.3, name, font=F_SB,
                     size=9.6, color=INK)
        elif ang == 180:
            txt(sl, nx - 1.63, ny - 0.13, 1.35, 0.3, name, font=F_SB,
                size=9.6, color=INK, align="r")
        elif ang == -90:
            txt(sl, nx - 0.85, ny - 0.50, 1.7, 0.3, name, font=F_SB, size=9.6,
                color=INK, align="c")
        else:
            txt(sl, nx - 0.85, ny + 0.28, 1.7, 0.3, name, font=F_SB, size=9.6,
                color=INK, align="c")
    txt(sl, cx - 1.05, cy - 0.34, 2.1, 0.7, "Fluxo\nrotativo contínuo",
        font=F_LIGHT, size=13, color=INDIGO, align="c", anchor="m", ls=1.24)

    items = [(ic_route, "Entrada contínua",
              "Recebimento permanente de materiais."),
             (ic_circular, "Organização por ciclos",
              "Lotes controlados e rastreados."),
             (ic_zero_landfill, "Redução de acúmulo",
              "Sem estoque parado no espaço público."),
             (ic_growth, "Maior eficiência operacional",
              "Giro constante entre entrada e destinação.")]
    y = 2.12
    for i, (ic, t, d) in enumerate(items):
        yy = y + i * 1.14
        ic(sl, 7.05, yy + 0.06, 0.40, INDIGO if i != 3 else GREEN)
        txt(sl, 7.62, yy, 4.9, 0.3, t, font=F_SB, size=11, color=INK)
        txt(sl, 7.62, yy + 0.32, 4.9, 0.5, d, size=9.2, color=GREY, ls=1.26)
        if i < 3:
            hline(sl, 7.05, yy + 0.94, 5.45, RULE_SOFT, 1.0)
    return sl


# ======================================================= 11 · ATERRO ZERO
def s11(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Destinação adequada", "Aterro Zero", 11)

    cols = [("Desfibramento", ic_defiber,
             "Recuperação de fibras têxteis para novos usos.", INDIGO),
            ("Coprocessamento", ic_bolt,
             "Destinação energética em parceria com o município.", AQUA),
            ("Upcycle", ic_upcycle,
             "Transformação de resíduos em produtos de maior valor agregado.",
             GREEN)]
    cw, gap = 3.71, 0.26
    y = 2.10
    for i, (t, ic, d, cl) in enumerate(cols):
        x = ML + i * (cw + gap)
        rect(sl, x, y, cw, 2.86, fill=TINT)
        rect(sl, x, y, cw, 0.055, fill=cl)
        icon_badge(sl, x + cw / 2, y + 0.86, 1.12, ic, cl, WHITE)
        txt(sl, x + 0.26, y + 1.62, cw - 0.52, 0.34, t, font=F_SB, size=13,
            color=INK, align="c", tracking=0.4)
        txt(sl, x + 0.40, y + 2.04, cw - 0.80, 0.68, d, size=9.2, color=GREY,
            align="c", ls=1.30)
        if i < 2:
            arrow_abs(sl, [(x + cw + 0.04, y + 1.43),
                           (x + cw + gap - 0.04, y + 1.43)], GREY_LT, 1.0, 0.075)

    hline(sl, ML, 5.52, CW, RULE, 1.0)
    ic_recycle(sl, ML, 5.76, 0.58, INDIGO)
    rich(sl, ML + 0.82, 5.74, 9.0, 0.7,
         [("Máximo aproveitamento dos materiais",
           {"font": F_SB, "size": 19, "color": INDIGO})], ls=1.1)
    txt(sl, ML + 0.82, 6.20, 9.0, 0.3,
        "Nenhuma fração destinada a aterro sanitário", size=9.6, color=GREY)
    return sl


# ============================================ 12 · BENEFICIOS PARA SAO PAULO
def s12(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Benefícios", "Benefícios para São Paulo", 12)

    items = [
        (ic_zero_landfill, "Redução do envio para aterros",
         "Menor pressão sobre a disposição final.", INDIGO),
        (ic_circular, "Economia circular",
         "Materiais reinseridos na cadeia produtiva.", INDIGO),
        (ic_people, "Geração de empregos",
         "Ocupação qualificada e capacitação.", INDIGO),
        (ic_scale, "Valorização dos resíduos têxteis",
         "Resíduo tratado como recurso.", GREEN),
        (ic_bulb, "Inovação ambiental",
         "Modelo inédito no Município.", GREEN),
        (ic_award, "Referência nacional em sustentabilidade",
         "Posicionamento pioneiro da Capital.", GREEN),
    ]
    cw, ch, gx, gy = 3.71, 1.96, 0.26, 0.28
    y0 = 2.08
    for i, (ic, t, d, cl) in enumerate(items):
        r, c = divmod(i, 3)
        x = ML + c * (cw + gx)
        y = y0 + r * (ch + gy)
        card(sl, x, y, cw, ch, fill=WHITE, line=RULE)
        rect(sl, x, y, 0.032, ch, fill=cl)
        ic(sl, x + 0.28, y + 0.26, 0.40, cl)
        txt(sl, x + 0.28, y + 0.80, cw - 0.56, 0.56, t, font=F_SB, size=10.8,
            color=INK, ls=1.22)
        txt(sl, x + 0.28, y + 1.42, cw - 0.56, 0.44, d, size=8.8, color=GREY,
            ls=1.24)
    return sl


# ================================================== 13 · IMPACTO AMBIENTAL
def s13(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Impacto ambiental", "Impacto Ambiental", 13)

    # ---- nucleo: indicador central
    cx, cy = 4.05, 4.24
    circle(sl, cx, cy, 2.10, fill=TINT)
    circle(sl, cx, cy, 2.10, fill=None, line=INDIGO, lw=1.1)
    rich(sl, cx - 1.00, cy - 0.50, 2.0, 0.9,
         [("1.000", {"font": F_LIGHT, "size": 38, "color": INDIGO})],
         align="c", ls=1.0)
    txt(sl, cx - 1.00, cy + 0.08, 2.0, 0.5, "toneladas/mês\nprocessadas",
        font=F_MED, size=8.8, color=GREY, align="c", ls=1.26)

    # ---- quatro satelites nas diagonais, rotulos fora do circulo
    R, ND = 1.92, 0.58
    sats = [(-135, "Redução\nde descarte", ic_zero_landfill, INDIGO),
            (-45, "Aproveitamento\nmáximo", ic_recycle, INDIGO),
            (135, "Redução do envio\na aterros", ic_scale, INDIGO),
            (45, "Ciclo\nfechado", ic_circular, GREEN)]
    for ang, name, ic, cl in sats:
        a = math.radians(ang)
        nx, ny = cx + R * math.cos(a), cy + R * math.sin(a)
        line(sl, cx + 1.05 * math.cos(a), cy + 1.05 * math.sin(a),
             nx - 0.30 * math.cos(a), ny - 0.30 * math.sin(a),
             RULE, 1.0, dash="sysDash")
        circle(sl, nx, ny, ND, fill=WHITE, line=cl, lw=1.2)
        ic(sl, nx - 0.16, ny - 0.16, 0.32, cl)
        # rotulo totalmente fora do circulo do no (ND/2 + folga)
        ly = (ny - ND / 2 - 0.14 - 0.56) if ang < 0 else (ny + ND / 2 + 0.14)
        txt(sl, nx - 1.15, ly, 2.30, 0.56, name, font=F_MED, size=9.0,
            color=INK_SOFT, align="c", ls=1.24,
            anchor="b" if ang < 0 else "t")

    vline(sl, 7.05, 2.06, 4.40, RULE, 1.0)

    # ---- ciclo fechado (cadeia com retorno)
    txt(sl, 7.48, 2.06, 4.95, 0.3, "Ciclo fechado", font=F_SB, size=9.4,
        color=INDIGO, tracking=1.6, caps=True)
    chain = [("Resíduo", ic_tshirt, INDIGO), ("Recuperação", ic_defiber, INDIGO),
             ("Novo uso", ic_upcycle, GREEN), ("Novo ciclo", ic_circular, GREEN)]
    cx0, cwd, chh, cgap = 7.48, 4.10, 0.72, 0.34
    y0 = 2.52
    for i, (t, ic, cl) in enumerate(chain):
        yy = y0 + i * (chh + cgap)
        rect(sl, cx0, yy, cwd, chh, fill=TINT)
        rect(sl, cx0, yy, 0.032, chh, fill=cl)
        ic(sl, cx0 + 0.24, yy + 0.16, 0.40, cl)
        txt(sl, cx0 + 0.80, yy, 3.1, chh, t, font=F_SB, size=11, color=INK,
            anchor="m")
        if i < 3:
            arrow_abs(sl, [(cx0 + cwd / 2, yy + chh + 0.05),
                           (cx0 + cwd / 2, yy + chh + cgap - 0.06)],
                      GREY_LT, 1.1, 0.075)
    ybot = y0 + 3 * (chh + cgap) + chh
    arrow_abs(sl, [(cx0 + cwd + 0.10, ybot - chh / 2),
                   (cx0 + cwd + 0.52, ybot - chh / 2),
                   (cx0 + cwd + 0.52, y0 + chh / 2),
                   (cx0 + cwd + 0.14, y0 + chh / 2)], GREEN, 1.15, 0.095)
    return sl


# ========================================= 14 · IMPACTO SOCIAL E ECONOMICO
def s14(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Impacto social e econômico", "Valor compartilhado para a cidade", 14)

    pts = [("Capacitação de profissionais", ic_people),
           ("Organização da cadeia têxtil", ic_tshirt),
           ("Apoio às políticas públicas ambientais", ic_gov),
           ("Desenvolvimento da economia verde", ic_growth)]
    y = 2.12
    for i, (t, ic) in enumerate(pts):
        yy = y + i * 0.80
        cl = GREEN if i == 3 else INDIGO
        ic(sl, ML, yy + 0.02, 0.38, cl)
        txt(sl, ML + 0.56, yy + 0.02, 5.4, 0.4, t, font=F_MED, size=11.2,
            color=INK_SOFT, ls=1.24)
        if i < 3:
            hline(sl, ML, yy + 0.62, 5.9, RULE_SOFT, 1.0)

    # mensagem Pessoas + Meio Ambiente + Economia
    rect(sl, 7.05, 2.12, 5.45, 2.42, fill=TINT)
    trio = [(ic_people, "Pessoas", INDIGO), (ic_leaf, "Meio Ambiente", GREEN),
            (ic_growth, "Economia", AQUA)]
    for i, (ic, t, cl) in enumerate(trio):
        cx = 7.05 + 0.98 + i * 1.74
        icon_badge(sl, cx, 3.00, 0.90, ic, cl, WHITE)
        txt(sl, cx - 0.85, 3.56, 1.7, 0.3, t, font=F_SB, size=9.6, color=INK,
            align="c")
        if i < 2:
            txt(sl, cx + 0.72, 2.82, 0.32, 0.4, "+", font=F_LIGHT, size=19,
                color=GREY_LT, align="c")
    txt(sl, 7.30, 3.98, 4.95, 0.42,
        "Valor compartilhado entre a cidade, o meio ambiente e as pessoas.",
        size=9.4, color=GREY, align="c", ls=1.26)

    note(sl, 5.08,
         "Coworking para costureiras e espaço de integração para oficinas, "
         "workshops e cursos de aperfeiçoamento, voltados a artesãos e "
         "costureiras autônomas.",
         icon=ic_sewing, color=INDIGO, h=0.70)
    note(sl, 5.94, "Atividades socioambientais permanentes no espaço.",
         icon=ic_compost, color=GREEN, fill=GREEN_LT, h=0.64)
    return sl


# ============================== 15 · PROGRAMA SOCIOAMBIENTAL E EDUCATIVO
def s15(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Programa socioambiental",
         [("Geração de renda, capacitação e ", {}),
          ("educação ambiental", {"font": F_SB})], 15)

    items = [
        (ic_sewing, "Coworking e costura criativa",
         "Espaço compartilhado para costureiras e artesãos autônomos.", INDIGO),
        (ic_workshop, "Oficinas e workshops",
         "Cursos de aperfeiçoamento voltados à cadeia têxtil.", INDIGO),
        (ic_compost, "Compostagem",
         "Curso mantido em caráter permanente no espaço.", GREEN),
        (ic_book, "Educação ambiental",
         "Disponível às escolas municipais que desejarem utilizar o espaço.",
         GREEN),
    ]
    cw, gap = 2.72, 0.245
    y = 2.14
    for i, (ic, t, d, cl) in enumerate(items):
        x = ML + i * (cw + gap)
        card(sl, x, y, cw, 2.46, fill=WHITE, line=RULE, accent=cl)
        icon_badge(sl, x + cw / 2, y + 0.86, 1.06, ic, cl, TINT)
        txt(sl, x + 0.22, y + 1.56, cw - 0.44, 0.52, t, font=F_SB, size=11,
            color=INK, align="c", ls=1.22)
        txt(sl, x + 0.26, y + 2.06, cw - 0.52, 0.6, d, size=8.7, color=GREY,
            align="c", ls=1.26)

    note(sl, 5.02,
         "Manteremos em caráter permanente um curso de compostagem e educação "
         "ambiental no espaço, caso as escolas municipais queiram aproveitá-lo "
         "para referidas atividades.",
         icon=ic_book, color=GREEN, fill=GREEN_LT, h=0.72)
    note(sl, 5.96,
         "O espaço poderá integrar o programa Mãos Paulistanas, caso seja de "
         "interesse da Prefeitura.",
         icon=ic_people, color=INDIGO, h=0.66)
    return sl


# ==================================================== 16 · DIFERENCIAIS
def s16(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Diferenciais do projeto",
         [("De um modelo ", {}), ("linear", {"font": F_SB, "color": GREY}),
          (" para um modelo ", {}), ("circular", {"font": F_SB, "color": INDIGO})],
         16)

    rows = [("Descarte", "Reaproveitamento"), ("Aterro", "Economia Circular"),
            ("Resíduo", "Recurso"), ("Acúmulo", "Fluxo Rotativo"),
            ("Perda de material", "Valorização")]
    lx, rx = ML, 6.95
    colw = 4.35
    hy = 2.12
    rh = 0.72

    # cabecalhos
    txt(sl, lx, hy, colw, 0.34, "Modelo Tradicional", font=F_SB, size=10.4,
        color=GREY, tracking=1.3, caps=True)
    rect(sl, rx, hy - 0.12, colw + 1.05, 0.58, fill=INDIGO)
    txt(sl, rx + 0.28, hy - 0.12, colw, 0.58, "Bioma Têxtil", font=F_SB,
        size=11.6, color=WHITE, tracking=1.3, caps=True, anchor="m")
    hline(sl, lx, hy + 0.46, colw, RULE, 1.2)

    for i, (a, b) in enumerate(rows):
        y = hy + 0.62 + i * rh
        txt(sl, lx, y, colw - 0.3, rh, a, font=F_REG, size=11.4, color=GREY,
            anchor="m")
        rect(sl, rx, y, colw + 1.05, rh - 0.06,
             fill=TINT if i % 2 == 0 else TINT_2)
        rect(sl, rx, y, 0.035, rh - 0.06, fill=INDIGO)
        txt(sl, rx + 0.28, y, colw, rh - 0.06, b, font=F_SB, size=11.6,
            color=INK, anchor="m")
        arrow_abs(sl, [(lx + colw + 0.30, y + (rh - 0.06) / 2),
                       (rx - 0.22, y + (rh - 0.06) / 2)], GREY_LT, 1.0, 0.075)
        if i < len(rows) - 1:
            hline(sl, lx, y + rh - 0.03, colw, RULE_SOFT, 1.0)
    return sl


# ============================================== 17 · PROGRAMA DO ESPACO
def s17(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Layout operacional", "Visão conceitual do Bioma Têxtil", 17)

    # planta esquematica
    px, py, pw, ph = ML, 2.40, 7.55, 3.18
    txt(sl, px, 2.02, pw, 0.3, "Organização proposta", font=F_SB, size=9.2,
        color=INDIGO, tracking=1.5, caps=True)
    rect(sl, px, py, pw, ph, fill=TINT, line=INDIGO, lw=1.1)
    zones = [("01", "Recebimento"), ("02", "Segregação"), ("03", "Picotagem"),
             ("04", "Armazenamento"), ("05", "Desfibramento"), ("06", "Upcycle"),
             ("07", "Coworking"), ("08", "Expedição")]
    cols, rows_n = 4, 2
    zw, zh = pw / cols, ph / rows_n
    for i, (num, name) in enumerate(zones):
        r, c = divmod(i, cols)
        zx, zy = px + c * zw, py + r * zh
        if c:
            vline(sl, zx, zy + 0.12, zh - 0.24, INDIGO, 0.75, alpha=0.35)
        if r:
            hline(sl, zx + 0.10, zy, zw - 0.20, INDIGO, 0.75, alpha=0.35)
        txt(sl, zx + 0.18, zy + 0.20, 0.7, 0.24, num, font=F_SB, size=8.6,
            color=INDIGO, tracking=1.1)
        txt(sl, zx + 0.18, zy + 0.52, zw - 0.36, 0.6, name, font=F_MED,
            size=10.2, color=INK, ls=1.2)
    # fluxo indicativo
    arrow_abs(sl, [(px + 0.35, py + zh - 0.30), (px + pw - 0.35, py + zh - 0.30)],
              INDIGO, 1.0, 0.085)
    arrow_abs(sl, [(px + 0.35, py + ph - 0.28), (px + pw - 0.35, py + ph - 0.28)],
              GREEN, 1.0, 0.085)

    txt(sl, px, py + ph + 0.10, pw, 0.3,
        "Fluxo indicativo das etapas operacionais", size=8.4, color=GREY_LT)

    # comparativo: espaco atual (mesma base e mesmo topo da planta)
    ax, aw = 8.72, 3.78
    txt(sl, ax, 2.02, aw, 0.3, "Espaço atual", font=F_SB, size=9.2,
        color=GREY, tracking=1.5, caps=True)
    hh = (ph - 0.14) / 2
    pic_frame(sl, f"{A}/eco_area.jpg", ax, py, aw, hh, line=RULE, bias_y=0.55)
    pic_frame(sl, f"{A}/eco_fachada.jpg", ax, py + hh + 0.14, aw, hh,
              line=RULE, bias_y=0.58)
    txt(sl, ax, py + ph + 0.10, aw, 0.3,
        "Áreas existentes do Ecoponto Belezinho", size=8.4, color=GREY_LT)

    note(sl, 6.08,
         "Organização proposta sobre a área existente, sem intervenção "
         "estrutural nesta etapa. Representação conceitual, sem caráter de "
         "projeto executivo ou arquitetônico.",
         icon=None, color=GREY_LT, fill=TINT, h=0.52, size=8.6, tcolor=GREY)
    return sl


# ================================================== 18 · VISAO DO ESPACO
def s18(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Visão do espaço", "Uso previsto das áreas do Ecoponto", 18)

    shots = [
        ("eco_area.jpg",
         "Frente das estações de segregação, upcycle e costura criativa"),
        ("eco_galpao.jpg", "Salas de coworking e costura criativa"),
        ("eco_vao.jpg", "Espaço de segregação e armazenamento"),
        ("eco_fachada.jpg", "Atividades socioambientais"),
    ]
    cw, gap = 2.72, 0.245
    y = 2.10
    for i, (f, cap) in enumerate(shots):
        x = ML + i * (cw + gap)
        pic_frame(sl, f"{A}/{f}", x, y, cw, 2.42, line=RULE, bias_y=0.5)
        rect(sl, x, y + 2.42, cw, 0.038, fill=INDIGO)
        txt(sl, x, y + 2.62, cw, 0.9, cap, font=F_MED, size=9.4, color=INK,
            ls=1.30)

    note(sl, 5.82,
         "Atividades de adequação dos materiais coletados, segregação, "
         "armazenamento, upcycle e costura criativa distribuídas conforme a "
         "vocação de cada área.", icon=ic_sort, color=INDIGO, h=0.70)
    return sl


# ======================================= 19 · RASTREABILIDADE E CONFORMIDADE
def s19(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Conformidade", "Rastreabilidade e conformidade ambiental", 19)

    items = [
        (ic_doc_check, "MTR", "Manifesto de Transporte de Resíduos emitido na coleta."),
        (ic_shield, "Atestado de descaracterização",
         "Documento emitido ao final do processo."),
        (ic_clipboard, "Registro do processo",
         "Etapas fotografadas e filmadas pela equipe."),
        (ic_recycle, "Destinação comprovada",
         "Documentação ambiental do destino final."),
    ]
    cw, gap = 2.72, 0.245
    y = 2.12
    for i, (ic, t, d) in enumerate(items):
        x = ML + i * (cw + gap)
        card(sl, x, y, cw, 2.30, fill=TINT, line=None, accent=INDIGO)
        ic(sl, x + 0.26, y + 0.28, 0.44, INDIGO)
        txt(sl, x + 0.26, y + 0.90, cw - 0.52, 0.56, t, font=F_SB, size=11,
            color=INK, ls=1.22)
        txt(sl, x + 0.26, y + 1.50, cw - 0.52, 0.66, d, size=8.8, color=GREY,
            ls=1.26)

    hline(sl, ML, 4.98, CW, RULE, 1.0)
    ic_route(sl, ML, 5.22, 0.56, INDIGO)
    rich(sl, ML + 0.80, 5.20, 9.6, 0.7,
         [("Rastreabilidade completa: da coleta à destinação final",
           {"font": F_LIGHT, "size": 18, "color": INK})], ls=1.14)
    txt(sl, ML + 0.80, 5.68, 9.6, 0.3,
        "Respaldo legal e transparência para o poder público", size=9.6,
        color=GREY)
    return sl


# ================================================== 20 · PROXIMOS PASSOS
def s20(prs):
    sl = add_slide(prs)
    bg_white(sl)
    head(sl, "Implantação", "Próximos Passos", 20)

    steps = [("01", "Assunção da área", ic_gov),
             ("02", "Adequação do espaço", ic_gear_leaf),
             ("03", "Implantação operacional", ic_boxes),
             ("04", "Início das operações", ic_recycle),
             ("05", "Consolidação como Bioma Sustentável", ic_leaf)]
    n = len(steps)
    cw = 2.10
    gap = (CW - n * cw) / (n - 1)
    ly = 3.30
    hline(sl, ML + cw / 2, ly, CW - cw, RULE, 1.2)
    for i, (num, t, ic) in enumerate(steps):
        x = ML + i * (cw + gap)
        cx = x + cw / 2
        cl = GREEN if i == n - 1 else INDIGO
        circle(sl, cx, ly, 0.62, fill=WHITE, line=cl, lw=1.3)
        circle(sl, cx, ly, 0.44, fill=cl)
        txt(sl, cx - 0.4, ly - 0.115, 0.8, 0.24, num, font=F_SB, size=10.4,
            color=WHITE, align="c")
        ic(sl, cx - 0.21, ly - 1.06, 0.42, cl)
        txt(sl, x - 0.15, ly + 0.52, cw + 0.30, 0.8, t, font=F_SB, size=10.4,
            color=INK, align="c", ls=1.24)
        if i < n - 1:
            arrow_abs(sl, [(cx + 0.42, ly), (cx + cw / 2 + gap / 2, ly)],
                      GREY_LT, 1.0, 0.075)

    note(sl, 5.30,
         "Sequência de etapas sem definição de prazos nesta fase. O cronograma "
         "será estabelecido em alinhamento com a Prefeitura de São Paulo.",
         icon=ic_clipboard, color=INDIGO, h=0.70)
    return sl


# ===================================================== 21 · ENCERRAMENTO
def s21(prs):
    sl = add_slide(prs)
    bg_dark(sl, "deep")
    pw = 4.45
    px = W_IN - pw
    pic_cover(sl, f"{A}/duo_corredor_tall.jpg", px, 0, pw, H_IN, bias_y=0.5)
    rect(sl, px, 0, pw, H_IN, grad=[(0.0, INDIGO_DK, 0.95), (0.6, INDIGO_DK, 0.55),
                                    (1.0, INDIGO_DK, 0.32)], grad_angle=0)
    vline(sl, px, 0, H_IN, WHITE, 0.75, alpha=0.18)
    skyline(sl, 0, 5.70, W_IN, 1.0, WHITE, 0.11, 0.9)
    ic_circular(sl, 11.55, 0.85, 0.70, WHITE)

    eyebrow(sl, ML, 1.30, "Nunes & Lucato  ·  Prefeitura de São Paulo", WHITE,
            size=8.6, rule_color=WHITE)
    rich(sl, ML, 1.78, 7.45, 3.0,
         [("O Primeiro Bioma Sustentável de Reciclagem Têxtil da Capital "
           "representa uma oportunidade de ", {}),
          ("transformar resíduos em desenvolvimento", {"font": F_SB}),
          (", fortalecendo as políticas públicas ambientais e posicionando "
           "São Paulo como ", {}),
          ("referência nacional em economia circular", {"font": F_SB}),
          (".", {})],
         font=F_LIGHT, size=17, color=WHITE, ls=1.46)

    hline(sl, ML, 4.62, 1.05, WHITE, 1.8, alpha=0.75)
    sl.shapes.add_picture(LOGO_WHITE, Inches(ML), Inches(4.92),
                          height=Inches(0.46))
    txt(sl, ML, 5.72, 6.6, 0.5, "“Transformando resíduos em valor.”",
        font=F_LIGHT, size=16, color=WHITE, ls=1.2)
    footer(sl, 21, TOTAL, dark=True, label=LABEL)
    return sl


# =========================================================== MONTAGEM
BUILDERS = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11,
            s12, s13, s14, s15, s16, s17, s18, s19, s20, s21]


def build(out, family="montserrat"):
    use_font_family(family)
    prs = new_deck()
    for fn in BUILDERS:
        fn(prs)
    prs.save(out)
    print(f"OK  {out}  ({len(prs.slides.__iter__.__self__._sldIdLst)} slides)")
    return out


if __name__ == "__main__":
    fam = sys.argv[2] if len(sys.argv) > 2 else "montserrat"
    build(sys.argv[1] if len(sys.argv) > 1 else "deck.pptx", fam)
