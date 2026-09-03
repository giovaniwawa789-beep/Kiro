#!/usr/bin/env python3
"""Gera o storyboard: extrai o frame real de cada plano da EDL, ja com
recorte 9:16, punch-in e correcao de cor, para revisao antes de renderizar."""
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from edl import timeline
from frame import FF, frame_filter, grade_filter, SHARPEN
from PIL import Image, ImageDraw

ROOT = '/projects/sandbox/aftermovie'
OUT = f'{ROOT}/analysis/storyboard'
os.makedirs(OUT, exist_ok=True)

tl, total = timeline()

for e in tl:
    dst = f"{OUT}/{e['idx']:02d}.jpg"
    vf = f"{frame_filter(e['z'])},{grade_filter(e['path'])},{SHARPEN}"
    src = f"{ROOT}/{e['path']}"
    if e['kind'] == 'video':
        # frame no meio do plano, para representar melhor o take
        ts = e['tin'] + e['dur'] / 2
        cmd = [f'{FF}/ffmpeg', '-v', 'error', '-y', '-ss', f'{ts:.3f}', '-i', src,
               '-vf', vf, '-frames:v', '1', '-q:v', '2', dst]
    else:
        cmd = [f'{FF}/ffmpeg', '-v', 'error', '-y', '-i', src,
               '-vf', vf, '-frames:v', '1', '-q:v', '2', dst]
    subprocess.run(cmd, check=True)

# monta folhas de contato de 8 planos, com numero e tempo
def sheet(items, out, cols=8, tw=200):
    ims = []
    for e in items:
        im = Image.open(f"{OUT}/{e['idx']:02d}.jpg").convert('RGB')
        im = im.resize((tw, int(tw * 16 / 9)))
        d = ImageDraw.Draw(im)
        lbl = f"{e['idx']}  {e['tin_tl']:.1f}-{e['tout_tl']:.1f}s"
        d.rectangle([0, 0, tw, 22], fill=(0, 0, 0))
        d.text((5, 5), lbl, fill=(255, 255, 255))
        src = e['path'].split('/')[-1].replace('VID-20260825-', '').replace('IMG-20260825-', 'F:')
        d.rectangle([0, im.height - 20, tw, im.height], fill=(0, 0, 0))
        d.text((5, im.height - 16), src.replace('.mp4', '').replace('.jpg', ''), fill=(180, 255, 120))
        ims.append(im)
    rows = (len(ims) + cols - 1) // cols
    rh = ims[0].height
    canvas = Image.new('RGB', (cols * tw + (cols + 1) * 5, rows * rh + (rows + 1) * 5), 'white')
    for i, im in enumerate(ims):
        canvas.paste(im, (5 + (i % cols) * (tw + 5), 5 + (i // cols) * (rh + 5)))
    canvas.save(out, quality=86)
    print(out, canvas.size)


sheet(tl[:16], f'{ROOT}/analysis/SB_1_ato1.jpg')
sheet(tl[16:30], f'{ROOT}/analysis/SB_2_ato2.jpg')
sheet(tl[30:], f'{ROOT}/analysis/SB_3_final.jpg')
print(f"{len(tl)} planos / {total:.1f}s")
