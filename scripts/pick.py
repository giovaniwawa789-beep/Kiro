#!/usr/bin/env python3
"""Mostra a evolucao temporal de nitidez/movimento/audio por clipe
para escolher os melhores IN/OUT e detectar aplausos/risadas."""
import json
import numpy as np

st = json.load(open('/projects/sandbox/aftermovie/analysis/clipstats.json'))

for s in st:
    print('=' * 96)
    print(f"{s['clip']}   dur={s['dur']}s")
    pf = s['per_frame']
    sh = np.array([p['sharp'] for p in pf])
    mo = np.array([p['motion'] for p in pf])
    shn = (sh - sh.min()) / (np.ptp(sh) + 1e-9)
    mon = np.clip(mo / 40.0, 0, 1)
    a = s.get('audio') or {}
    rms = np.array(a.get('rms', []))
    flat = np.array(a.get('flat', []))
    rn = rms / (rms.max() + 1e-9) if len(rms) else np.zeros(0)
    print("   t     sharp  motion  | nitidez        | movimento      | audio rms      flat")
    for i, p in enumerate(pf):
        ai = int(p['t'] / 0.25)
        bar_s = '#' * int(shn[i] * 14)
        bar_m = '#' * int(mon[i] * 14)
        if ai < len(rn):
            bar_a = '#' * int(rn[ai] * 14)
            fl = f"{flat[ai]:.3f}"
        else:
            bar_a, fl = '', '-'
        print(f" {p['t']:>5.2f} {p['sharp']:>8.0f} {p['motion']:>6.2f}  | {bar_s:<14} | {bar_m:<14} | {bar_a:<14} {fl}")
