#!/usr/bin/env python3
"""Analise tecnica por clipe: nitidez, movimento (tremor), exposicao, cor, energia de audio.
Objetivo: escolher os melhores IN/OUT points de cada take e guiar o color grading."""
import glob, json, os, subprocess, sys
import numpy as np
from PIL import Image
import wave

FF = "/projects/sandbox/aftermovie/tools/ffmpeg-7.0.2-amd64-static"
RAW = "/projects/sandbox/aftermovie/raw"
WORK = "/projects/sandbox/aftermovie/analysis"
FPS_SAMPLE = 4  # amostras por segundo


def probe_dur(path):
    out = subprocess.run([f"{FF}/ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True).stdout.strip()
    return float(out)


def extract_frames(path, base):
    d = f"{WORK}/frames/{base}"
    os.makedirs(d, exist_ok=True)
    if not glob.glob(f"{d}/*.jpg"):
        subprocess.run([f"{FF}/ffmpeg", "-v", "error", "-y", "-i", path,
                        "-vf", f"fps={FPS_SAMPLE},scale=232:-1", "-q:v", "3",
                        f"{d}/%04d.jpg"], check=True)
    return sorted(glob.glob(f"{d}/*.jpg"))


def lap_var(g):
    """Variancia do laplaciano = nitidez."""
    k = np.array([[0, 1, 0], [1, -4, 1], [0, 1, 0]], float)
    from scipy.signal import convolve2d
    return convolve2d(g, k, mode="valid").var()


def analyze_clip(path):
    base = os.path.basename(path).replace(".mp4", "").replace("(1)", "")
    dur = probe_dur(path)
    frames = extract_frames(path, base)
    grays, rgbs = [], []
    for f in frames:
        im = Image.open(f).convert("RGB")
        a = np.asarray(im, float)
        rgbs.append(a)
        grays.append(a.mean(axis=2))
    grays = np.array(grays)
    per = []
    for i in range(len(grays)):
        t = i / FPS_SAMPLE
        sharp = lap_var(grays[i])
        motion = float(np.abs(grays[i] - grays[i - 1]).mean()) if i > 0 else 0.0
        a = rgbs[i]
        bright = float(a.mean())
        mx = a.max(axis=2); mn = a.min(axis=2)
        sat = float(((mx - mn) / (mx + 1e-6)).mean())
        per.append(dict(t=round(t, 2), sharp=round(sharp, 1), motion=round(motion, 2),
                        bright=round(bright, 1), sat=round(sat, 3),
                        r=round(float(a[:, :, 0].mean()), 1),
                        g=round(float(a[:, :, 1].mean()), 1),
                        b=round(float(a[:, :, 2].mean()), 1)))
    allrgb = np.array(rgbs)
    stats = dict(
        clip=base, path=path, dur=round(dur, 3), n=len(frames),
        sharp_med=round(float(np.median([p["sharp"] for p in per])), 1),
        motion_med=round(float(np.median([p["motion"] for p in per[1:]] or [0])), 2),
        motion_max=round(float(max([p["motion"] for p in per[1:]] or [0])), 2),
        bright=round(float(allrgb.mean()), 1),
        p01=round(float(np.percentile(allrgb, 1)), 1),
        p99=round(float(np.percentile(allrgb, 99)), 1),
        rmean=round(float(allrgb[:, :, :, 0].mean()), 1),
        gmean=round(float(allrgb[:, :, :, 1].mean()), 1),
        bmean=round(float(allrgb[:, :, :, 2].mean()), 1),
        per_frame=per,
    )
    return stats


def audio_env(base):
    w = f"{WORK}/audio/{base}.wav"
    if not os.path.exists(w):
        return None
    wf = wave.open(w)
    n = wf.getnframes(); sr = wf.getframerate()
    x = np.frombuffer(wf.readframes(n), dtype=np.int16).astype(float) / 32768.0
    win = sr // 4  # 250ms
    env, flat = [], []
    for i in range(0, len(x) - win, win):
        seg = x[i:i + win]
        env.append(float(np.sqrt((seg ** 2).mean())))
        S = np.abs(np.fft.rfft(seg * np.hanning(len(seg)))) + 1e-10
        flat.append(float(np.exp(np.log(S).mean()) / S.mean()))  # spectral flatness
    return dict(rms=[round(v, 5) for v in env], flat=[round(v, 4) for v in flat], hop=0.25)


if __name__ == "__main__":
    res = []
    for p in sorted(glob.glob(f"{RAW}/VID*.mp4")):
        s = analyze_clip(p)
        s["audio"] = audio_env(s["clip"])
        res.append(s)
        print(f"{s['clip']}  dur={s['dur']:>6.2f}  sharp={s['sharp_med']:>7.1f}  "
              f"motion(med/max)={s['motion_med']:>5.2f}/{s['motion_max']:>5.2f}  "
              f"bright={s['bright']:>5.1f}  RGB=({s['rmean']},{s['gmean']},{s['bmean']})  "
              f"blacks={s['p01']} whites={s['p99']}")
    json.dump(res, open(f"{WORK}/clipstats.json", "w"), indent=1)
    print("\n-> analysis/clipstats.json")
