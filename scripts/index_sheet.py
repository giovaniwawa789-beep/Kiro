#!/usr/bin/env python3
"""Indice definitivo: extrai 3 frames de cada video pelo caminho explicito e
grava o nome do arquivo + timecode DENTRO do quadro, para nao haver duvida
sobre qual conteudo pertence a qual arquivo."""
import glob
import os
import subprocess

from PIL import Image, ImageDraw, ImageFont

FF = "/projects/sandbox/aftermovie/tools/ffmpeg-7.0.2-amd64-static"
ROOT = "/projects/sandbox/aftermovie"
TMP = f"{ROOT}/analysis/idx"
os.makedirs(TMP, exist_ok=True)

try:
    F = ImageFont.truetype("/usr/share/fonts/google-noto/NotoSans-Bold.ttf", 17)
except Exception:
    F = ImageFont.load_default()


def dur(p):
    return float(subprocess.run([f"{FF}/ffprobe", "-v", "error", "-show_entries",
                                 "format=duration", "-of", "csv=p=0", p],
                                capture_output=True, text=True).stdout.strip())


rows = []
for p in sorted(glob.glob(f"{ROOT}/raw/VID*.mp4")):
    name = os.path.basename(p)
    d = dur(p)
    tiles = []
    for frac in (0.15, 0.45, 0.80):
        ts = d * frac
        out = f"{TMP}/{name}_{frac}.jpg"
        subprocess.run([f"{FF}/ffmpeg", "-v", "error", "-y", "-ss", f"{ts:.3f}", "-i", p,
                        "-vf", "scale=210:-1", "-frames:v", "1", "-q:v", "3", out], check=True)
        im = Image.open(out).convert("RGB")
        dr = ImageDraw.Draw(im)
        dr.rectangle([0, 0, im.width, 40], fill=(0, 0, 0))
        dr.text((4, 2), name.replace("VID-20260825-", "").replace(".mp4", ""),
                fill=(150, 255, 90), font=F)
        dr.text((4, 21), f"t={ts:.2f}s / {d:.1f}s", fill=(255, 255, 255), font=F)
        tiles.append(im)
    rows.append((name, tiles))

tw, th = rows[0][1][0].size
cols = 3
per_sheet = 5
for si in range(0, len(rows), per_sheet):
    chunk = rows[si:si + per_sheet]
    canvas = Image.new("RGB", (cols * tw + (cols + 1) * 6,
                               len(chunk) * th + (len(chunk) + 1) * 6), "white")
    for r, (name, tiles) in enumerate(chunk):
        for c, im in enumerate(tiles):
            canvas.paste(im, (6 + c * (tw + 6), 6 + r * (th + 6)))
    out = f"{ROOT}/analysis/INDEX_{si // per_sheet + 1}.jpg"
    canvas.save(out, quality=88)
    print(out, canvas.size, [n for n, _ in chunk])
