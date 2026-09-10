#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Prepara os ativos visuais do deck Nunes & Lucato / SINIR-MTR Login Unico Gov.br.

FONTES DAS IMAGENS
  1. Prints proprios da Nunes & Lucato .... Kiro/videos/Captura de Tela (8..12).png
     Telas reais do MTR Nacional, capturadas na conta da propria empresa:

       (8)  cabecalho da sessao (empresa / usuario / perfil Transportador)
       (9)  menu Configuracoes aberto
       (10) tela "Gerenciar Usuarios" com a lista de usuarios cadastrados
       (11) janela "Adicionar/Editar Usuario" — topo do formulario
       (12) janela "Adicionar/Editar Usuario" — fim do formulario e chaves

     Sao esses prints que sustentam o tutorial da Rota A (slides 9 a 12).

     Sobre o CPF: ele NAO e tarjado por padrao. O CPF da responsavel aparece
     de proposito nos slides 06, 10 e 20, porque o cliente precisa dele para
     conceder a autorizacao — tarjar em um print e publicar no slide ao lado
     seria incoerente. Para tarjar de todo modo, use TARJAR_CPF = True (cobre
     o cabecalho; a linha da tabela em (10) tem caixa propria).

  2. Logomarca Nunes & Lucato ............. reaproveitada de
     apresentacoes/bioma_textil/assets/logo_dark.png / logo_white.png

  3. Figuras 1 a 15 do "Guia Rapido - Login Unico GOV.BR - MTR Nacional -
     Sinir" (MMA / SINIR, versao 1.0, 05/01/2026), extraidas do PDF oficial.
     O PDF declara: reproducao permitida sem fins lucrativos, parcial ou
     total, por qualquer meio, desde que citada a fonte (MMA) e o sitio de
     origem. A citacao e feita no pe de cada slide que usa uma figura e no
     slide de fontes. Ver README.md.
     Usadas na Rota B (slides 8, 13, 14, 15 e 16).

Nao utiliza nenhuma imagem de banco de imagens nem de terceiros.
"""
import io
import os
import shutil
import urllib.request

from PIL import Image, ImageDraw, ImageFilter

# ------------------------------------------------------------------ caminhos
_HERE = os.path.dirname(os.path.abspath(__file__))
_PROJ = os.path.dirname(_HERE)                          # apresentacoes/sinir_mtr
_APRE = os.path.dirname(_PROJ)                          # apresentacoes
_REPO = os.path.dirname(_APRE)                          # raiz do repo

VID = os.environ.get("NL_VIDEOS", os.path.join(_REPO, "videos"))
OUT = os.environ.get("NL_ASSETS", os.path.join(_PROJ, "assets"))
CACHE = os.path.join(OUT, "_cache")
BIOMA = os.path.join(_APRE, "bioma_textil", "assets")

os.makedirs(OUT, exist_ok=True)
os.makedirs(CACHE, exist_ok=True)


def _shot(n):
    return os.path.join(VID, f"Captura de Tela ({n}).png")


# Todos os prints sao 1360x768 e compartilham o mesmo cabecalho.
# Recorte: nome de saida -> (numero do print, (x0, y0, x1, y1))
CROPS = {
    # cabecalho da sessao: empresa, usuario e perfil  (slide 05)
    "mtr_perfil.png":    (8,  (170, 6, 520, 58)),
    # menu Configuracoes aberto  (slide 09)
    "mtr_menu.png":      (9,  (10, 180, 700, 525)),
    # tela Gerenciar Usuarios inteira  (slide 09)
    "mtr_gerenciar.png": (10, (10, 240, 1270, 592)),
    # formulario Adicionar/Editar Usuario - topo  (slide 10)
    "mtr_form_top.png":  (11, (335, 188, 1025, 662)),
    # formulario - fim, com as chaves e o botao Salvar  (slide 11)
    "mtr_form_bot.png":  (12, (335, 188, 1025, 662)),
    # so a faixa das chaves Ativo / Padrao-Administrador / token  (slide 11)
    "mtr_toggles.png":   (12, (345, 525, 1010, 640)),
    # linha do usuario cadastrado, com Tipo, Situacao e Acoes  (slide 12)
    "mtr_linha.png":     (10, (120, 445, 1260, 578)),
}

# Tarja opcional do CPF, em pixels do original 1360x768.
TARJAR_CPF = False
CPF_BOX_CABECALHO = (211, 25, 274, 39)     # cabecalho verde, prints 8 a 12
CPF_BOX_TABELA = (128, 497, 250, 545)      # coluna CPF da tabela, print 10
CPF_FILL_CABECALHO = (11, 89, 84)
CPF_FILL_TABELA = (255, 255, 255)

UPSCALE = 2.0

GUIA_URL = ("https://portal-api.sinir.gov.br/wp-content/uploads/2026/07/"
            "Guia-Rapido-Login-Unico-GOV.BR-MTR-Nacional-Sinir.pdf")
GUIA_PDF = os.path.join(CACHE, "guia_login_unico_sinir.pdf")

# Figura oficial -> (pagina do PDF, indice da imagem naquela pagina)
FIGURAS = {
    1:  (6, 1),    # tela de login do MTR Nacional, botao "Entrar com GOV.BR"
    2:  (6, 0),    # gov.br - "Numero do CPF" + Continuar
    3:  (7, 0),    # gov.br - "Digite sua senha" + Entrar
    4:  (8, 0),    # Acesso ao Sistema - Empreendimento (coluna "Selecionar")
    5:  (8, 1),    # tela inicial do sistema
    6:  (9, 0),    # usuario sem vinculo a nenhum empreendimento
    7:  (9, 1),    # botao "Pesquisar CPF/CNPJ"
    8:  (10, 0),   # lista com a coluna "Solicitar acesso"
    9:  (10, 1),   # modal "Dados Cadastrais"
    10: (11, 0),   # confirmacao: aguardando aprovacao do administrador
    11: (11, 1),   # aviso de CPF nao vinculado
    12: (12, 0),   # modal "Pesquisar Empreendimento"
    13: (12, 1),   # nenhum empreendimento localizado / "Cadastrar Empreendimento"
    14: (13, 0),   # formulario de cadastro do empreendimento
    15: (14, 0),   # botao "Solicitar Acesso"
}


def _sharpen_up(im, factor=UPSCALE):
    """Amplia com LANCZOS e reforca a nitidez: prints de 1x ficam moles no
    projetor. Nao cria informacao, apenas melhora a leitura das bordas."""
    if factor and factor != 1.0:
        im = im.resize((int(im.width * factor), int(im.height * factor)),
                       Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=70, threshold=2))


# ======================================================== 1. LOGOMARCA
def build_logo():
    missing = []
    for name in ("logo_dark.png", "logo_white.png"):
        src = os.path.join(BIOMA, name)
        if not os.path.exists(src):
            missing.append(src)
            continue
        shutil.copy2(src, os.path.join(OUT, name))
        print(f"[logo] {name:16s} <- bioma_textil/assets")
    if missing:
        print("[logo] AVISO: nao encontrei:", *missing, sep="\n         ")
        print("       rode antes: python3 ../../bioma_textil/scripts/build_assets.py")


# ======================================================== 2. PRINTS PROPRIOS
_cache_src = {}


def _abrir(n):
    """Abre o print n, aplicando a tarja do CPF se configurada."""
    if n in _cache_src:
        return _cache_src[n]
    p = _shot(n)
    if not os.path.exists(p):
        print(f"[shot] AVISO: print nao encontrado: {p}")
        _cache_src[n] = None
        return None
    im = Image.open(p).convert("RGB")
    if TARJAR_CPF:
        d = ImageDraw.Draw(im)
        d.rectangle(list(CPF_BOX_CABECALHO), fill=CPF_FILL_CABECALHO)
        if n == 10:
            d.rectangle(list(CPF_BOX_TABELA), fill=CPF_FILL_TABELA)
    _cache_src[n] = im
    return im


def build_shots():
    print(f"[shot] TARJAR_CPF = {TARJAR_CPF}")
    for name, (n, box) in CROPS.items():
        im = _abrir(n)
        if im is None:
            continue
        c = _sharpen_up(im.crop(box))
        c.save(os.path.join(OUT, name), optimize=True)
        print(f"[shot] {name:20s} {str(c.size):14s} <- print ({n}) {box}")


# ================================================= 3. FIGURAS OFICIAIS
def _fetch_guia():
    if os.path.exists(GUIA_PDF) and os.path.getsize(GUIA_PDF) > 100_000:
        print(f"[guia] cache {os.path.relpath(GUIA_PDF, _PROJ)}"
              f"  ({os.path.getsize(GUIA_PDF)//1024} KB)")
        return True
    print(f"[guia] baixando {GUIA_URL}")
    try:
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(GUIA_URL, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, context=ctx, timeout=180) as r:
            data = r.read()
        with open(GUIA_PDF, "wb") as f:
            f.write(data)
        print(f"[guia] ok  {len(data)//1024} KB")
        return True
    except Exception as exc:
        print(f"[guia] FALHA no download: {exc}")
        print("       baixe manualmente e salve em", GUIA_PDF)
        return False


def build_figuras():
    if not _fetch_guia():
        return
    try:
        from pypdf import PdfReader
    except ImportError:
        print("[guia] FALHA: pypdf nao instalado  ->  pip install pypdf")
        return

    reader = PdfReader(GUIA_PDF)
    # ignora os elementos repetidos do template grafico do guia
    TEMPLATE = {(384, 436), (2172, 724), (295, 219), (803, 92), (1055, 1491)}
    por_pagina = {}
    for pi, page in enumerate(reader.pages, 1):
        uteis = []
        for img in page.images:
            try:
                pil = Image.open(io.BytesIO(img.data))
            except Exception:
                continue
            if pil.size in TEMPLATE or pil.width * pil.height < 40_000:
                continue
            uteis.append(pil.convert("RGB"))
        por_pagina[pi] = uteis

    for fig, (pag, idx) in sorted(FIGURAS.items()):
        uteis = por_pagina.get(pag, [])
        if idx >= len(uteis):
            print(f"[guia] AVISO: Figura {fig} nao encontrada (pag {pag}, idx {idx})")
            continue
        im = _sharpen_up(uteis[idx], 1.6)
        name = f"guia_fig{fig:02d}.png"
        im.save(os.path.join(OUT, name), optimize=True)
        print(f"[guia] {name:18s} {im.size}  (pag {pag})")


if __name__ == "__main__":
    build_logo()
    print()
    build_shots()
    print()
    build_figuras()
    print("\nOK -> ativos em", OUT)
