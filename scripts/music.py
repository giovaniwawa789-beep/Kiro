#!/usr/bin/env python3
"""Trilha v2 do aftermovie "DE BUILDER A FOUNDER".

Reescrita a partir da v1 (preservada em music_v1.py). O que mudou e por que:

  - progressao Am - C - G - F (i-III-VII-VI), anthemica e com mais elevacao,
    no lugar da Am-F-C-G da v1, que resolvia rapido demais e soava polida;
  - acordes em PIANO ELETRICO por FM em vez de stack de serras: timbre com
    corpo e mais "humano", que e o que faltava para a ideia de encontro;
  - GANCHO melodico de 4 notas que repete e se desenvolve -- a v1 so tinha
    arpejo, entao nao ficava nada na cabeca;
  - SIDECHAIN de verdade (envelope de duck disparado pelo bumbo) no lugar do
    truque de abrir buraco no baixo;
  - percussao organica (shaker com swing, rim, tom) para dar levada humana;
  - dois reverbs (room curto na bateria, hall longo em pads e lead), com
    compressao de bus e saturacao suave na mixagem.

120 BPM (mesma grade da v1, entao os 43 cortes continuam na batida), La menor,
28 compassos = 56.0s -- 2 compassos a mais que a v1 para o cartao final.
"""
import json
import os
import wave

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
BPM = 120.0
BEAT = 60.0 / BPM
BAR = BEAT * 4
NBARS = 19
TAIL = 2.5
DUR = NBARS * BAR + TAIL
N = int(DUR * SR)
SWING = 0.012          # atraso dos 16avos impares, em segundos

rng = np.random.default_rng(11)


# ------------------------------------------------------------------ utilidades
def tt(n):
    return np.arange(n) / SR


def lp(x, fc, order=4):
    return sosfilt(butter(order, min(fc, SR * 0.49), 'low', fs=SR, output='sos'), x)


def hp(x, fc, order=4):
    return sosfilt(butter(order, max(fc, 15), 'high', fs=SR, output='sos'), x)


def bp(x, f1, f2, order=4):
    return sosfilt(butter(order, [max(f1, 20), min(f2, SR * 0.49)], 'band',
                          fs=SR, output='sos'), x)


def add(buf, x, at):
    i = int(at * SR)
    if i >= len(buf) or i < 0:
        return
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n]


def ir_reverb(dur, decay, damp, pre=0.008):
    n = int(dur * SR)
    x = rng.normal(0, 1, n) * np.exp(-np.linspace(0, decay, n))
    x = lp(x, damp)
    k = int(pre * SR)
    x[:k] *= np.linspace(0, 1, k)
    return x / (np.abs(x).max() + 1e-9)


# --------------------------------------------------------------- instrumentos
def kick(vel=1.0):
    """Tres camadas: sub com queda de tom, corpo e clique."""
    n = int(0.5 * SR)
    t = tt(n)
    f = 44 + 135 * np.exp(-t * 38)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.0)
    body = np.sin(2 * np.pi * 92 * t) * np.exp(-t * 26) * 0.45
    click = hp(rng.normal(0, 1, n), 1600) * np.exp(-t * 300) * 0.30
    return np.tanh((sub + body + click) * 1.45) * 0.92 * vel


def snap(vel=1.0):
    """Clap/snare com corpo e cauda curta de sala."""
    n = int(0.34 * SR)
    t = tt(n)
    layers = np.zeros(n)
    for off, g in ((0.0, 0.75), (0.009, 0.7), (0.019, 0.65), (0.030, 1.0)):
        i = int(off * SR)
        seg = rng.normal(0, 1, n - i) * np.exp(-tt(n - i) * (85 if g < 1 else 19))
        layers[i:] += seg * g
    x = bp(layers, 1100, 7200)
    tone = np.sin(2 * np.pi * 195 * t) * np.exp(-t * 55) * 0.20
    x = x / (np.abs(x).max() + 1e-9) + tone
    return x * 0.46 * vel


def shaker(vel=1.0, open_=False):
    n = int((0.14 if open_ else 0.055) * SR)
    x = bp(rng.normal(0, 1, n), 4200, 11000)
    x *= np.exp(-tt(n) * (16 if open_ else 78))
    return x / (np.abs(x).max() + 1e-9) * (0.13 if open_ else 0.10) * vel


def rim(vel=1.0):
    n = int(0.09 * SR)
    t = tt(n)
    x = (np.sin(2 * np.pi * 1750 * t) + 0.6 * np.sin(2 * np.pi * 2400 * t))
    x *= np.exp(-t * 120)
    x += hp(rng.normal(0, 1, n), 3000) * np.exp(-t * 170) * 0.5
    return x / (np.abs(x).max() + 1e-9) * 0.16 * vel


def tom(freq, vel=1.0):
    n = int(0.30 * SR)
    t = tt(n)
    f = freq * (1 + 0.5 * np.exp(-t * 30))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)
    return np.tanh(x * 1.2) * 0.30 * vel


def ep(freq, dur, vel=1.0, ratio=1.0, index=2.6):
    """Piano eletrico por FM (tipo Rhodes): indice de modulacao decai,
    o que da o ataque com brilho e a sustentacao doce."""
    n = int(dur * SR)
    t = tt(n)
    I = index * np.exp(-t * 5.5)
    x = np.sin(2 * np.pi * freq * t + I * np.sin(2 * np.pi * freq * ratio * t))
    env = np.exp(-t * 2.1) * (1 - np.exp(-t * 320))
    return x * env * 0.5 * vel


def pluck(freq, dur, vel=1.0):
    n = int(dur * SR)
    t = tt(n)
    I = 3.2 * np.exp(-t * 22)
    x = np.sin(2 * np.pi * freq * t + I * np.sin(2 * np.pi * freq * 3.0 * t))
    x *= np.exp(-t * 9.0) * (1 - np.exp(-t * 900))
    return x * 0.42 * vel


def sub_bass(freq, dur, vel=1.0):
    n = int(dur * SR)
    t = tt(n)
    x = np.sin(2 * np.pi * freq * t) + 0.30 * np.sin(2 * np.pi * freq * 2 * t)
    x += 0.12 * np.sin(2 * np.pi * freq * 3 * t)
    env = (1 - np.exp(-t * 400)) * np.exp(-t * 1.1)
    return np.tanh(x * env * 1.02) * 0.68 * vel


def strings(freqs, dur, vel=1.0, fc=2400):
    """Almofada de cordas: serras suaves, ataque lento, para os momentos de
    elevacao (entrada dos drops e o cartao final)."""
    n = int(dur * SR)
    t = tt(n)
    x = np.zeros(n)
    for f in freqs:
        for det in (-0.004, 0.0, 0.005):
            ph = 2 * np.pi * f * (1 + det) * t
            for h in range(1, 10):
                x += np.sin(ph * h + h) / (h ** 1.5)
    x /= (len(freqs) * 3 * 2.4)
    x = lp(x, fc)
    a = int(n * 0.30)
    env = np.concatenate([np.linspace(0, 1, a) ** 1.6,
                          np.linspace(1, 0.25, n - a) ** 1.3])
    return x * env * vel


def riser(dur, vel=1.0):
    n = int(dur * SR)
    nz = rng.normal(0, 1, n)
    out = np.zeros(n)
    step = int(0.04 * SR)
    for i in range(0, n - step, step):
        out[i:i + step] = hp(nz[i:i + step], 300 + 6500 * (i / n) ** 1.8)[:step]
    out *= np.linspace(0, 1, n) ** 2.4
    return out / (np.abs(out).max() + 1e-9) * 0.26 * vel


def impact(vel=1.0):
    n = int(1.9 * SR)
    t = tt(n)
    boom = np.sin(2 * np.pi * (60 * np.exp(-t * 2.0) + 32) * t) * np.exp(-t * 2.3)
    crack = lp(rng.normal(0, 1, n), 3200) * np.exp(-t * 6.5) * 0.45
    return np.tanh((boom + crack) * 1.25) * 0.62 * vel


# -------------------------------------------------------------------- harmonia
# Am - C - G - F  (i - III - VII - VI): mais elevacao que a Am-F-C-G da v1
CH = [
    dict(n='Am', ep=[220.00, 261.63, 329.63], root=55.00,
         str=[220.00, 261.63, 329.63, 440.00], hook=[659.25, 587.33, 523.25, 493.88]),
    dict(n='C', ep=[261.63, 329.63, 392.00], root=65.41,
         str=[261.63, 329.63, 392.00, 523.25], hook=[659.25, 523.25, 587.33, 523.25]),
    dict(n='G', ep=[246.94, 293.66, 392.00], root=49.00,
         str=[196.00, 246.94, 293.66, 392.00], hook=[587.33, 493.88, 440.00, 392.00]),
    dict(n='F', ep=[261.63, 349.23, 440.00], root=43.65,
         str=[174.61, 261.63, 349.23, 440.00], hook=[523.25, 440.00, 392.00, 349.23]),
]

# arranjo: k=bumbo c=clap h=shaker16 H=shaker8 o=shaker aberto r=rim
#          b=sub p=piano eletrico a=arpejo l=gancho s=cordas t=tom
ARR = {b: set() for b in range(NBARS)}


def setb(rng_, layers):
    for b in rng_:
        ARR[b] |= set(layers)


# v4: 19 compassos (38s), alinhado ao novo corte. O drop bate no compasso 6
# (12s), exatamente na revelacao da logo no telao (plano HERO).
setb(range(0, 2),   'pa')          #  0-4s   INTRO (abertura + coffee)
setb(range(2, 6),   'paHb')        #  4-12s  BUILD (coffee, sala enchendo)
setb(range(6, 12),  'pakchbolr')   # 12-24s  DROP 1 (bate na logo)
setb(range(12, 15), 'pakchbl')     # 24-30s  ATO 2
setb(range(13, 15), 'cor')
setb(range(15, 17), 'ps')          # 30-34s  BREAKDOWN (musica abre, mensagem)
setb(range(17, 19), 'ps')          # 34-38s  CARTAO FINAL (resolve)

SECTIONS = [('intro', 0, 2), ('build', 2, 6), ('drop1', 6, 12), ('ato2', 12, 15),
            ('breakdown', 15, 17), ('endcard', 17, 19)]

# ----------------------------------------------------------------------- render
drums = np.zeros(N)     # vai para o reverb curto
tonal = np.zeros(N)     # vai para o hall
dry = np.zeros(N)       # baixo: sem reverb
kick_times = []
beats = []

HOOK_RHYTHM = [(0.0, 0.9), (0.75, 0.55), (1.5, 0.85), (2.5, 0.6), (3.0, 0.75)]

for b in range(NBARS):
    t0 = b * BAR
    c = CH[b % 4]
    L = ARR[b]
    inten = 0.55 if b < 6 else (1.0 if 19 <= b < 24 else 0.86)

    if 'p' in L:
        vel = 0.55 if b < 3 else (0.7 if b < 6 else (0.66 if 17 <= b < 19 or b >= 26 else 0.62))
        # acordes em contratempo dao a levada de house organico
        for off, g in ((0.0, 1.0), (1.5, 0.6), (2.5, 0.75), (3.5, 0.5)):
            if b < 3 and off in (1.5, 3.5):
                continue
            for f in c['ep']:
                add(tonal, ep(f, 1.1, vel=vel * g), t0 + off * BEAT)

    if 'a' in L:
        pat = [0, 1, 2, 1, 0, 2, 1, 2]
        for s in range(8):
            if b < 3 and s % 2:
                continue
            sw = SWING if s % 2 else 0.0
            add(tonal, pluck(c['ep'][pat[s] % 3] * 2, 0.30,
                             vel=(0.20 if b < 6 else 0.26) * (1.0 if s % 4 == 0 else 0.7)),
                t0 + s * BEAT / 2 + sw)

    if 'l' in L:
        for off, g in HOOK_RHYTHM:
            i = int(off * 2) % 4
            add(tonal, pluck(c['hook'][i], 0.55, vel=0.30 * g * inten), t0 + off * BEAT)

    if 's' in L:
        add(tonal, strings(c['str'], BAR * 1.15,
                           vel=(0.22 if 17 <= b < 19 or b >= 26 else 0.20)), t0)

    if 'b' in L:
        for s in range(8):
            add(dry, sub_bass(c['root'], BEAT * 0.52, vel=0.9 * inten), t0 + s * BEAT / 2)

    if 'k' in L:
        for s in range(4):
            add(drums, kick(vel=(1.0 if s == 0 else 0.92) * inten), t0 + s * BEAT)
            kick_times.append(t0 + s * BEAT)

    if 'c' in L:
        for s in (1, 3):
            add(drums, snap(vel=0.92 * inten), t0 + s * BEAT)

    if 'h' in L:
        for s in range(16):
            sw = SWING if s % 2 else 0.0
            v = 1.0 if s % 4 == 0 else (0.5 if s % 2 == 0 else 0.34)
            add(drums, shaker(vel=v * inten), t0 + s * BEAT / 4 + sw)
    elif 'H' in L:
        for s in range(8):
            add(drums, shaker(vel=(0.75 if s % 2 == 0 else 0.42) * inten), t0 + s * BEAT / 2)

    if 'o' in L:
        add(drums, shaker(vel=0.7 * inten, open_=True), t0 + 1.5 * BEAT)
        add(drums, shaker(vel=0.7 * inten, open_=True), t0 + 3.5 * BEAT)

    if 'r' in L:
        for off in (0.75, 2.25, 2.75):
            add(drums, rim(vel=0.55 * inten), t0 + off * BEAT)

    if 't' in L or (b in (11, 23) and 'k' in L):
        for i, off in enumerate((3.0, 3.25, 3.5, 3.75)):
            add(drums, tom(150 - i * 14, vel=0.8), t0 + off * BEAT)

    for s in range(4):
        beats.append(round(t0 + s * BEAT, 4))

# viradas
# viradas: riser + impacto no drop (compasso 6 = 12s, na revelacao da logo)
add(drums, riser(BAR * 1.8, vel=0.9), 6 * BAR - BAR * 1.8)
add(drums, impact(0.95), 6 * BAR)
add(drums, riser(BAR * 0.8, vel=0.45)[::-1], 15 * BAR)   # downlifter no breakdown
add(drums, impact(0.6), 15 * BAR)                        # marca a entrada da mensagem
add(tonal, strings(CH[0]['str'], BAR * 2.2, vel=0.34, fc=1900), 17 * BAR)  # cartao final

# --------------------------------------------------------------- sidechain real
duck = np.ones(N)
atk, rel = int(0.006 * SR), 0.085
for kt in kick_times:
    i = int(kt * SR)
    if i >= N:
        continue
    seg = min(int(0.34 * SR), N - i)
    env = 1.0 - 0.50 * np.exp(-tt(seg) / rel)
    env[:atk] = np.linspace(1.0, env[atk] if atk < seg else 0.4, min(atk, seg))
    duck[i:i + seg] = np.minimum(duck[i:i + seg], env)

dry *= duck
tonal *= (0.45 + 0.55 * duck)      # acordes cedem menos que o baixo

# ------------------------------------------------------------------- espaco/mix
room = ir_reverb(0.55, 9.0, 6000)
hall = ir_reverb(2.4, 5.0, 5200)
drums_w = fftconvolve(drums, room)[:N]
tonal_w = fftconvolve(tonal, hall)[:N]

mix = drums * 0.95 + drums_w * 0.10 + tonal * 0.90 + tonal_w * 0.26 + dry * 2.1
# calor de fita
mix += lp(rng.normal(0, 1, N), 9000) * 0.0016
mix = hp(mix, 26)
mix -= 0.34 * hp(mix, 9500)        # tira aspereza
mix = lp(mix, 16800, order=2)


def compress(x, thr=0.55, ratio=2.0, atk=0.012, rel=0.22):
    """Compressor de bus simples, para colar a mixagem."""
    env = np.abs(x)
    a, r = np.exp(-1 / (atk * SR)), np.exp(-1 / (rel * SR))
    e, out = 0.0, np.empty_like(env)
    for i, v in enumerate(env):
        coef = a if v > e else r
        e = coef * e + (1 - coef) * v
        out[i] = e
    g = np.ones_like(out)
    over = out > thr
    g[over] = (thr + (out[over] - thr) / ratio) / out[over]
    return x * g


# ---- cola e arco dinamico ---------------------------------------------------
# ORDEM IMPORTA: o compressor de bus vem ANTES do ganho de arranjo. Ao contrario,
# ele reduz justamente os drops (que passam do limiar) e deixa o breakdown
# intacto, desfazendo o arco que a secao seguinte tenta impor.
mix /= (np.abs(mix).max() + 1e-9)
mix *= 0.80
mix = compress(mix)

# arco dinamico por secao: intro baixo, drops cheios, breakdown recuado,
# cartao final resolvendo.
SEC_GAIN = {'intro': 0.53, 'build': 0.64, 'drop1': 1.00, 'ato2': 0.92,
            'breakdown': 0.42, 'endcard': 0.40}
gain = np.ones(N)
for name, b0, b1 in SECTIONS:
    i0, i1 = int(b0 * BAR * SR), min(int(b1 * BAR * SR), N)
    gain[i0:i1] = SEC_GAIN[name]
gain[min(int(SECTIONS[-1][2] * BAR * SR), N - 1):] = SEC_GAIN['endcard']
k = int(0.40 * SR)
gain = np.convolve(gain, np.ones(k) / k, mode='same')
mix *= gain

# limitador de seguranca: age so acima de 0.92, para nao mexer no arco
over = np.abs(mix) > 0.92
mix[over] = np.sign(mix[over]) * (0.92 + np.tanh((np.abs(mix[over]) - 0.92) * 6) * 0.07)

# stereo: Haas suave + largura
d = int(0.0075 * SR)
Lc = mix.copy()
Rc = np.concatenate([np.zeros(d), mix[:-d]])
w = 0.14
st = np.stack([Lc * (1 - w) + Rc * w, Rc * (1 - w) + Lc * w], axis=1)

fn = int(2.0 * SR)
st[-fn:] *= np.linspace(1, 0, fn)[:, None]
k = int(0.04 * SR)
st[:k] *= np.linspace(0, 1, k)[:, None]
st /= (np.abs(st).max() + 1e-9)
st *= 0.95

os.makedirs('/projects/sandbox/aftermovie/build', exist_ok=True)
out = '/projects/sandbox/aftermovie/build/music.wav'
w_ = wave.open(out, 'w')
w_.setnchannels(2)
w_.setsampwidth(2)
w_.setframerate(SR)
w_.writeframes((st * 32767).astype(np.int16).tobytes())
w_.close()

json.dump(dict(bpm=BPM, beat=BEAT, bar=BAR, nbars=NBARS, dur=round(DUR, 3),
               beats=beats,
               sections=[dict(name=n, bar0=a, bar1=b_, t0=round(a * BAR, 3),
                              t1=round(b_ * BAR, 3)) for n, a, b_ in SECTIONS]),
          open('/projects/sandbox/aftermovie/build/grid.json', 'w'), indent=1)

print(f"music.wav  {DUR:.2f}s  {BPM:.0f} BPM  Am-C-G-F  {NBARS} compassos")
for n, a, b_ in SECTIONS:
    print(f"  {n:<10} compassos {a:>2}-{b_:<2}  t {a * BAR:>6.2f}-{b_ * BAR:>6.2f}s")
