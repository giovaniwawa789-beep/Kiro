#!/usr/bin/env python3
"""Trilha original para o aftermovie: melodic/organic house, 120 BPM, Lá menor.
Feita do zero (sintese) para (a) nao ter risco de licenciamento e
(b) me dar a grade de batidas exata para sincronizar os cortes.

Estrutura: intro -> build -> drop 1 -> ambiente -> ato 2 -> breakdown -> drop final -> outro
"""
import json
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 48000
BPM = 120.0
BEAT = 60.0 / BPM          # 0.5 s
BAR = BEAT * 4             # 2.0 s
NBARS = 26
TAIL = 2.0
DUR = NBARS * BAR + TAIL
N = int(DUR * SR)

rng = np.random.default_rng(7)


# ----------------------------------------------------------------- utilidades
def t_of(nsamp):
    return np.arange(nsamp) / SR


def env_ad(n, a, d, curve=2.0):
    """Envelope attack/decay exponencial."""
    e = np.zeros(n)
    na = max(1, int(a * SR))
    e[:na] = np.linspace(0, 1, na) ** 0.6
    nd = n - na
    if nd > 0:
        e[na:] = np.exp(-np.linspace(0, curve * 5, nd))
    return e


def env_adsr(n, a, d, s, r):
    na, nd, nr = int(a * SR), int(d * SR), int(r * SR)
    ns = max(0, n - na - nd - nr)
    return np.concatenate([
        np.linspace(0, 1, na) ** 0.7,
        np.linspace(1, s, nd),
        np.full(ns, s),
        np.linspace(s, 0, nr) ** 1.5,
    ])[:n]


def lp(x, fc, order=4):
    sos = butter(order, min(fc, SR / 2 * 0.98), 'low', fs=SR, output='sos')
    return sosfilt(sos, x)


def hp(x, fc, order=4):
    sos = butter(order, max(fc, 10), 'high', fs=SR, output='sos')
    return sosfilt(sos, x)


def add(buf, x, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    n = min(len(x), len(buf) - i)
    buf[i:i + n] += x[:n]


def reverb_ir(dur=1.8, decay=5.5, pre=0.012):
    n = int(dur * SR)
    ir = rng.normal(0, 1, n) * np.exp(-np.linspace(0, decay, n))
    ir = lp(ir, 7000)
    ir[:int(pre * SR)] *= np.linspace(0, 1, int(pre * SR))
    return ir / np.abs(ir).max()


# --------------------------------------------------------------- instrumentos
def kick(vel=1.0):
    n = int(0.42 * SR)
    tt = t_of(n)
    f = 52 + 118 * np.exp(-tt * 42)                 # pitch drop
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7.2)
    click = rng.normal(0, 1, n) * np.exp(-tt * 320) * 0.35
    click = hp(click, 1200)
    x = (body * 1.0 + click) * vel
    return np.tanh(x * 1.5) * 0.9


def clap(vel=1.0):
    n = int(0.30 * SR)
    tt = t_of(n)
    bursts = np.zeros(n)
    for k, off in enumerate([0.0, 0.010, 0.020, 0.032]):
        i = int(off * SR)
        seg = rng.normal(0, 1, n - i) * np.exp(-t_of(n - i) * (70 if k < 3 else 16))
        bursts[i:] += seg * (0.7 if k < 3 else 1.0)
    x = hp(bursts, 900)
    x = lp(x, 7500)
    return x / (np.abs(x).max() + 1e-9) * 0.5 * vel


def hat(vel=1.0, open_=False):
    d = 0.16 if open_ else 0.045
    n = int(d * SR)
    x = rng.normal(0, 1, n) * np.exp(-t_of(n) * (14 if open_ else 60))
    x = hp(x, 7000)
    return x / (np.abs(x).max() + 1e-9) * (0.17 if open_ else 0.125) * vel


def pluck(freq, dur, vel=1.0, detune=0.004):
    n = int(dur * SR)
    tt = t_of(n)
    x = np.zeros(n)
    for m, amp in ((1, 1.0), (2, 0.30), (3, 0.12), (4, 0.05)):
        for dt in (-detune, detune):
            x += amp * np.sin(2 * np.pi * freq * m * (1 + dt) * tt)
    x *= env_ad(n, 0.004, dur, curve=1.4)
    return x / 3.0 * vel


def pad(freqs, dur, vel=1.0, fc=2200):
    """Stack de saws suaves com lowpass -> pad quente."""
    n = int(dur * SR)
    tt = t_of(n)
    x = np.zeros(n)
    for f in freqs:
        for dt in (-0.006, 0.0, 0.006):
            ph = 2 * np.pi * f * (1 + dt) * tt
            # saw suave por sintese aditiva
            for h in range(1, 9):
                x += np.sin(ph * h) / (h ** 1.35)
    x /= (len(freqs) * 3 * 2.2)
    x = lp(x, fc)
    x *= env_adsr(n, dur * 0.22, dur * 0.15, 0.78, dur * 0.38)
    return x * vel


def sub(freq, dur, vel=1.0):
    n = int(dur * SR)
    tt = t_of(n)
    x = np.sin(2 * np.pi * freq * tt) + 0.22 * np.sin(2 * np.pi * freq * 2 * tt)
    x *= env_adsr(n, 0.008, 0.05, 0.85, 0.06)
    return np.tanh(x * 1.2) * 0.42 * vel


def riser(dur, vel=1.0):
    n = int(dur * SR)
    tt = t_of(n)
    noise = rng.normal(0, 1, n)
    out = np.zeros(n)
    step = int(0.05 * SR)
    for i in range(0, n - step, step):
        fc = 400 + 7000 * (i / n) ** 1.7
        out[i:i + step] = hp(noise[i:i + step], fc)[:step]
    out *= (np.linspace(0, 1, n) ** 2.2)
    return out / (np.abs(out).max() + 1e-9) * 0.30 * vel


def impact(vel=1.0):
    n = int(1.6 * SR)
    tt = t_of(n)
    boom = np.sin(2 * np.pi * (68 * np.exp(-tt * 2.2) + 34) * tt) * np.exp(-tt * 2.6)
    nz = lp(rng.normal(0, 1, n), 2500) * np.exp(-tt * 5.5) * 0.5
    x = boom + nz
    return np.tanh(x * 1.3) * 0.65 * vel


# ------------------------------------------------------------------ harmonia
# Am9  ->  Fmaj7  ->  C(add9)  ->  Gsus  (i - VI - III - VII), 1 compasso cada
CHORDS = [
    dict(name="Am9",   pad=[220.00, 261.63, 329.63, 493.88], root=55.00,
         arp=[440.00, 523.25, 659.25, 987.77]),
    dict(name="Fmaj7", pad=[174.61, 220.00, 261.63, 329.63], root=43.65,
         arp=[349.23, 440.00, 523.25, 659.25]),
    dict(name="Cadd9", pad=[261.63, 329.63, 392.00, 587.33], root=65.41,
         arp=[523.25, 659.25, 783.99, 587.33]),
    dict(name="Gsus",  pad=[196.00, 246.94, 293.66, 329.63], root=49.00,
         arp=[392.00, 493.88, 587.33, 659.25]),
]

# arranjo por compasso: quais camadas tocam
# k=kick c=clap h=hats(16th) H=hats(8th) o=openhat b=sub p=pad a=arp l=lead
ARR = {}
for b in range(NBARS):
    ARR[b] = set()


def setbars(rng_bars, layers):
    for b in rng_bars:
        ARR[b] |= set(layers)


setbars(range(0, 3),   "pa")          #  0-6s   INTRO
setbars(range(3, 6),   "paH")         #  6-12s  BUILD
setbars(range(4, 6),   "b")
setbars(range(6, 12),  "pakchbo")     # 12-24s  DROP 1
setbars(range(12, 17), "pakchb")      # 24-34s  ATO 2
setbars(range(14, 17), "co")
setbars(range(17, 19), "p")           # 34-38s  BREAKDOWN (batida de texto)
setbars(range(19, 24), "pakchbol")    # 38-48s  DROP FINAL
setbars(range(24, 26), "p")           # 48-52s  OUTRO
setbars(range(24, 25), "kb")

# ------------------------------------------------------------------- render
music = np.zeros(N)
beats = []
sections = [
    ("intro", 0, 3), ("build", 3, 6), ("drop1", 6, 12), ("ato2", 12, 17),
    ("breakdown", 17, 19), ("dropfinal", 19, 24), ("outro", 24, 26),
]

for b in range(NBARS):
    t0 = b * BAR
    ch = CHORDS[b % 4]
    L = ARR[b]
    intensity = 0.55 if b < 6 else (1.0 if b >= 19 else 0.85)

    if 'p' in L:
        fc = 900 if b < 3 else (1500 if b < 6 else (1200 if 17 <= b < 19 else 2600))
        vel = 0.5 if b < 3 else (0.62 if b < 6 else (0.75 if 17 <= b < 19 else 0.58))
        if b >= 24:
            vel *= 0.9
        add(music, pad(ch['pad'], BAR * 1.05, vel=vel, fc=fc), t0)

    if 'a' in L:
        # arpejo em 16avos, padrao com variacao
        pat = [0, 1, 2, 3, 2, 1, 3, 2, 0, 2, 3, 1, 2, 3, 1, 0]
        for s in range(16):
            if b < 3 and s % 2 == 1:
                continue
            v = (0.30 if b < 6 else 0.42) * (1.0 if s % 4 == 0 else 0.72)
            if 17 <= b < 19:
                v *= 0.5
            add(music, pluck(ch['arp'][pat[s]], 0.34, vel=v), t0 + s * BEAT / 4)

    if 'l' in L:
        # lead: notas longas em oitava alta no drop final
        lead_pat = [(0.0, 0), (1.0, 2), (2.0, 3), (3.0, 1)]
        for off, idx in lead_pat:
            add(music, pluck(ch['arp'][idx] * 2, 0.9, vel=0.16, detune=0.008), t0 + off * BEAT)

    if 'b' in L:
        # sub bass: oitavos com sidechain implicito (gap no downbeat do kick)
        for s in range(8):
            if 'k' in L and s % 2 == 0:
                add(music, sub(ch['root'], BEAT * 0.40, vel=0.85 * intensity), t0 + s * BEAT / 2 + 0.055)
            else:
                add(music, sub(ch['root'], BEAT * 0.46, vel=0.80 * intensity), t0 + s * BEAT / 2)

    if 'k' in L:
        for s in range(4):
            add(music, kick(vel=(1.0 if s == 0 else 0.9) * intensity), t0 + s * BEAT)

    if 'c' in L:
        for s in (1, 3):
            add(music, clap(vel=0.9 * intensity), t0 + s * BEAT)

    if 'h' in L:
        for s in range(16):
            v = 1.0 if s % 4 == 0 else (0.55 if s % 2 == 0 else 0.38)
            add(music, hat(vel=v * intensity), t0 + s * BEAT / 4)
    elif 'H' in L:
        for s in range(8):
            add(music, hat(vel=(0.8 if s % 2 == 0 else 0.45) * intensity), t0 + s * BEAT / 2)

    if 'o' in L:
        for s in (1, 3):
            add(music, hat(vel=0.7 * intensity, open_=True), t0 + s * BEAT + BEAT / 2)

    for s in range(4):
        beats.append(round(t0 + s * BEAT, 4))

# risers e impactos nas viradas
add(music, riser(BAR * 1.6, vel=0.8), 6 * BAR - BAR * 1.6)      # entrada do drop 1
add(music, impact(0.9), 6 * BAR)
add(music, riser(BAR * 1.9, vel=1.0), 19 * BAR - BAR * 1.9)     # entrada do drop final
add(music, impact(1.0), 19 * BAR)
add(music, impact(0.75), 24 * BAR)                              # ultimo acento
# downlifter suave no breakdown
add(music, riser(BAR * 0.9, vel=0.5)[::-1], 17 * BAR)

# ------------------------------------------------------------- espacializacao
ir = reverb_ir()
wet = fftconvolve(music, ir)[:N]
mix = music * 0.84 + wet * 0.17
mix = hp(mix, 28)
# high-shelf suave para tirar aspereza dos agudos + teto de "ar"
mix = mix - 0.42 * hp(mix, 9000)
mix = lp(mix, 16500, order=2)

# leve stereo: atrasos/filtros distintos por canal (Haas suave)
d = int(0.008 * SR)
Lch = mix.copy()
Rch = np.concatenate([np.zeros(d), mix[:-d]])
Rch = lp(Rch, 15000)
wide = 0.13
st = np.stack([Lch * (1 - wide) + Rch * wide, Rch * (1 - wide) + Lch * wide], axis=1)

# fade final
fn = int(1.6 * SR)
st[-fn:] *= np.linspace(1, 0, fn)[:, None]
st[:int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))[:, None]

st = np.tanh(st * 1.08)
st /= (np.abs(st).max() + 1e-9)
st *= 0.94

import wave
out = '/projects/sandbox/aftermovie/build/music.wav'
import os
os.makedirs('/projects/sandbox/aftermovie/build', exist_ok=True)
w = wave.open(out, 'w')
w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st * 32767).astype(np.int16).tobytes())
w.close()

grid = dict(bpm=BPM, beat=BEAT, bar=BAR, nbars=NBARS, dur=round(DUR, 3),
            beats=beats,
            sections=[dict(name=n, bar0=a, bar1=b, t0=round(a * BAR, 3), t1=round(b * BAR, 3))
                      for n, a, b in sections])
json.dump(grid, open('/projects/sandbox/aftermovie/build/grid.json', 'w'), indent=1)

print(f"music.wav  {DUR:.2f}s  {BPM:.0f} BPM  beat={BEAT}s  bar={BAR}s  compassos={NBARS}")
for s in grid['sections']:
    print(f"  {s['name']:<10} compassos {s['bar0']:>2}-{s['bar1']:<2}  t {s['t0']:>6.2f}-{s['t1']:>6.2f}s")
