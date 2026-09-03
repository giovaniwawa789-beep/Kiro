#!/usr/bin/env python3
"""Enquadramento 9:16, punch-in/drift e correcao de cor por clipe."""

FF = "/projects/sandbox/aftermovie/tools/ffmpeg-7.0.2-amd64-static"
W, H = 1080, 1920
AR = W / H
FPS = 30

# Correcao de balanco de branco / contraste por arquivo, derivada das medias
# de canal medidas em analysis/clipstats.json.
#   rr,gg,bb = ganho por canal ; blk = ponto de preto ; whi = ponto de branco
#   sat = saturacao ; gam = gamma
GRADE = {
    # --- videos ---------------------------------------------------------
    '36': dict(rr=0.99, gg=1.00, bb=1.17, blk=2,  whi=245, sat=1.06, gam=1.00),
    '37': dict(rr=0.96, gg=1.00, bb=1.30, blk=6,  whi=245, sat=1.05, gam=1.02),
    '78': dict(rr=1.00, gg=1.00, bb=1.05, blk=4,  whi=246, sat=1.09, gam=1.00),
    '79': dict(rr=0.99, gg=1.00, bb=1.07, blk=16, whi=242, sat=1.10, gam=0.97),
    '80': dict(rr=0.97, gg=1.06, bb=1.02, blk=14, whi=244, sat=1.06, gam=0.98),
    '84': dict(rr=1.00, gg=1.01, bb=1.11, blk=3,  whi=243, sat=1.08, gam=1.00),
    '85': dict(rr=1.00, gg=1.00, bb=1.11, blk=2,  whi=242, sat=1.08, gam=1.00),
    '86': dict(rr=0.99, gg=1.01, bb=1.14, blk=3,  whi=243, sat=1.08, gam=1.01),
    '87': dict(rr=1.00, gg=1.00, bb=1.02, blk=4,  whi=240, sat=1.08, gam=0.99),
    '88': dict(rr=1.00, gg=0.99, bb=1.09, blk=5,  whi=243, sat=1.07, gam=0.99),
    '89': dict(rr=1.02, gg=0.97, bb=1.05, blk=9,  whi=241, sat=1.07, gam=0.98),
    '90': dict(rr=1.01, gg=1.01, bb=1.00, blk=4,  whi=242, sat=1.08, gam=1.00),
    '91': dict(rr=0.98, gg=1.00, bb=1.24, blk=1,  whi=244, sat=1.06, gam=1.00),
    '92': dict(rr=1.01, gg=1.01, bb=0.99, blk=2,  whi=241, sat=1.08, gam=1.00),
    # --- fotos: coffee (dominante amarelo-verde forte) -------------------
    'I103': dict(rr=0.97, gg=0.99, bb=1.36, blk=1, whi=246, sat=1.04, gam=1.02),
    'I104': dict(rr=0.97, gg=1.00, bb=1.31, blk=1, whi=246, sat=1.04, gam=1.02),
    'I105': dict(rr=1.00, gg=0.97, bb=1.28, blk=2, whi=246, sat=1.04, gam=1.01),
    'I106': dict(rr=1.00, gg=0.97, bb=1.32, blk=2, whi=246, sat=1.04, gam=1.01),
    'I107': dict(rr=1.00, gg=0.97, bb=1.27, blk=3, whi=246, sat=1.04, gam=1.01),
    # --- fotos: plateia (quase neutras, altas estouradas) ---------------
    'I048': dict(rr=0.99, gg=1.00, bb=1.08, blk=4, whi=248, sat=1.06, gam=1.00),
    'I049': dict(rr=1.00, gg=1.00, bb=1.05, blk=5, whi=246, sat=1.08, gam=1.03),
    'I050': dict(rr=1.00, gg=1.00, bb=1.07, blk=3, whi=248, sat=1.07, gam=1.01),
    'I052': dict(rr=1.00, gg=1.00, bb=1.06, blk=3, whi=248, sat=1.07, gam=1.01),
    'I055': dict(rr=0.99, gg=1.00, bb=1.06, blk=4, whi=248, sat=1.07, gam=1.02),
}


def grade_key(path):
    name = path.split('/')[-1]
    if name.startswith('IMG'):
        return 'I' + name.split('WA0')[1][:3]
    return name.split('WA00')[1][:2]


def grade_filter(path):
    """Balanco de branco -> ponto de preto/branco -> curva S -> saturacao."""
    g = GRADE[grade_key(path)]
    blk, whi = g['blk'] / 255.0, g['whi'] / 255.0
    pts = [(0.0, 0.0), (blk, 0.0)]
    for frac, y in ((0.25, 0.215), (0.50, 0.500), (0.75, 0.785)):
        pts.append((blk + (whi - blk) * frac, y))
    pts += [(whi, 1.0), (1.0, 1.0)]
    clean = []
    for x, y in pts:                      # curves exige x crescente com folga
        if not clean or x - clean[-1][0] >= 0.02:
            clean.append((x, y))
        elif x >= 0.999:
            clean[-1] = (x, y)
    curve = " ".join(f"{x:.4f}/{y:.4f}" for x, y in clean)
    return (f"colorchannelmixer=rr={g['rr']}:gg={g['gg']}:bb={g['bb']},"
            f"curves=m='{curve}',"
            f"eq=saturation={g['sat']}:gamma={g['gam']}")


def crop916(pan=0.0, pany=0.0):
    """Maior recorte 9:16 possivel dentro do quadro."""
    return (f"crop='if(gt(iw/ih,{AR}),ih*{AR},iw)':'if(gt(iw/ih,{AR}),ih,iw/{AR})'"
            f":'(iw-ow)/2+{pan}*(iw-ow)/2':'(ih-oh)/2+{pany}*(ih-oh)/2'")


def frame_filter(zoom=1.0, zto=None, nframes=None, speed=1.0, pan=0.0, pany=0.0):
    """Cadeia de geometria de um plano, na ordem correta:

      recorte 9:16 -> pre-escala (so no drift) -> retiming (camera lenta)
      -> fps=30 -> punch-in / zoompan -> saida 1080x1920

    O retiming vem ANTES do zoompan para que o zoompan veja exatamente
    `nframes` quadros: assim o drift de zoom comeca e termina no lugar certo.
    Para o drift o quadro e pre-escalado em `zoom` e o zoompan vai de z=1 ate
    z=zto/zoom, porque o zoompan nao aceita z<1 e assim a imagem e reamostrada
    uma unica vez, na resolucao maxima.
    """
    drift = bool(zto) and nframes and abs(zto - zoom) > 1e-4
    ch = [crop916(pan, pany)]
    if drift:
        ch.append(f"scale={int(W * zoom)}:{int(H * zoom)}:flags=lanczos")
    if abs(speed - 1.0) > 1e-3:
        ch.append(f"setpts=PTS/{speed:.6f}")
    ch.append(f"fps={FPS}")
    if drift:
        zp = zto / zoom
        n = max(1, nframes - 1)
        ch.append(f"zoompan=z='1+({zp - 1:.6f})*on/{n}'"
                  f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                  f":d=1:s={W}x{H}:fps={FPS}")
    else:
        if zoom > 1.001:
            # pan/pany reposicionam o punch-in. Nas origens que ja sao 9:16
            # exatas o crop916 nao tem folga, entao e aqui que se reenquadra.
            ch.append(f"crop=iw/{zoom}:ih/{zoom}"
                      f":'(iw-ow)/2+{pan}*(iw-ow)/2'"
                      f":'(ih-oh)/2+{pany}*(ih-oh)/2'")
        ch.append(f"scale={W}:{H}:flags=lanczos")
    return ','.join(ch)


SHARPEN = "unsharp=5:5:0.55:5:5:0.0"
