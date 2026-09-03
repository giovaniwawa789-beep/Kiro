#!/usr/bin/env python3
"""Para cada clipe, encontra as melhores janelas de duracao alvo,
pontuando nitidez alta + movimento controlado (sem tremor excessivo)."""
import json
import numpy as np

st = json.load(open('/projects/sandbox/aftermovie/analysis/clipstats.json'))
FPS = 4

for s in st:
    pf = s['per_frame']
    sh = np.array([p['sharp'] for p in pf], float)
    mo = np.array([p['motion'] for p in pf], float)
    # normaliza contra o proprio clipe
    shn = (sh - sh.min()) / (np.ptp(sh) + 1e-9)
    print('=' * 84)
    print(f"{s['clip']}  dur={s['dur']:.2f}s  sharp_med={s['sharp_med']}  motion_med={s['motion_med']}")
    for W in (1.0, 1.5, 2.0, 2.5):
        w = int(W * FPS)
        if w >= len(pf):
            continue
        best = []
        for i in range(len(pf) - w):
            seg_sh = shn[i:i + w].mean()
            seg_mo = mo[i:i + w]
            # penaliza tremor: variancia do movimento (jitter) e picos
            jitter = seg_mo.std()
            score = seg_sh * 1.0 - (jitter / 12.0) - max(0, seg_mo.mean() - 26) / 14.0
            best.append((score, i, seg_sh, seg_mo.mean(), jitter))
        best.sort(reverse=True)
        top = best[:3]
        out = "  ".join(f"[{b[1]/FPS:>5.2f}-{(b[1]+w)/FPS:>5.2f}] sc={b[0]:.2f} sh={b[2]:.2f} mo={b[3]:.1f} jit={b[4]:.1f}"
                        for b in top)
        print(f"  W={W}s: {out}")
