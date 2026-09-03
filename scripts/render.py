#!/usr/bin/env python3
"""Render do aftermovie.

Etapas:
  1. estabiliza (vidstab 2 passes) os clipes com tremor medido alto
  2. renderiza cada plano da EDL normalizado em 1080x1920 / 30fps / com grade
  3. concatena os planos
  4. monta a trilha: musica original + leito de ambiencia real da sala
  5. aplica os textos, fades e finaliza (H.264 + AAC, faststart)
"""
import json
import os
import shutil
import subprocess
import sys

sys.path.insert(0, os.path.dirname(__file__))
from edl import timeline, V, STAB
from frame import FF, FPS, H, W, SHARPEN, frame_filter, grade_filter

ROOT = '/projects/sandbox/aftermovie'
BUILD = f'{ROOT}/build'
OUT = f'{ROOT}/out'
for d in (f'{BUILD}/stab', f'{BUILD}/shots', OUT):
    os.makedirs(d, exist_ok=True)

FFMPEG = f'{FF}/ffmpeg'
LOG = ['-v', 'error', '-y']


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print('FALHOU:', ' '.join(cmd)[:400])
        print(r.stderr[-3000:])
        raise SystemExit(1)
    return r


# ------------------------------------------------------------------ 1. estab.
def stabilize():
    for key in sorted(STAB):
        src = f'{ROOT}/{V[key]}'
        dst = f'{BUILD}/stab/{key}.mp4'
        if os.path.exists(dst):
            continue
        trf = f'{BUILD}/stab/{key}.trf'
        run([FFMPEG] + LOG + ['-i', src, '-vf',
             f'vidstabdetect=shakiness=8:accuracy=15:result={trf}',
             '-f', 'null', '-'])
        # smoothing=12 (~0.4s) remove o tremor de mao mas preserva a
        # panoramica intencional; optzoom=1 evita bordas preta
        run([FFMPEG] + LOG + ['-i', src, '-vf',
             f'vidstabtransform=input={trf}:smoothing=12:optzoom=1:zoomspeed=0.2'
             f':interpol=bicubic:crop=black',
             '-c:v', 'libx264', '-crf', '14', '-preset', 'medium',
             '-pix_fmt', 'yuv420p', '-an', dst])
        print(f'  estabilizado {key}')


def source_for(e):
    if e['kind'] == 'video' and e['stab']:
        return f"{BUILD}/stab/{e['src'].split(':')[1]}.mp4"
    return f"{ROOT}/{e['path']}"


# ------------------------------------------------------------------ 2. planos
def render_shots(tl):
    for e in tl:
        dst = f"{BUILD}/shots/{e['idx']:02d}.mp4"
        if os.path.exists(dst):
            continue
        nfr = int(round(e['dur'] * FPS))
        src = source_for(e)
        if e['kind'] == 'photo':
            vf = frame_filter(e['z'], e.get('zto'), nfr,
                              pan=e.get('pan', 0.0), pany=e.get('pany', 0.0))
            vf += f",{grade_filter(e['path'])},{SHARPEN}"
            cmd = [FFMPEG] + LOG + ['-framerate', str(FPS), '-loop', '1',
                                    '-t', f"{e['dur'] + 0.2:.4f}", '-i', src, '-vf', vf]
        else:
            # o retiming entra dentro do frame_filter, antes do zoompan
            vf = frame_filter(e['z'], e.get('zto'), nfr, speed=e['speed'],
                              pan=e.get('pan', 0.0), pany=e.get('pany', 0.0))
            vf += f",{grade_filter(e['path'])},{SHARPEN}"
            # le um pouco mais da origem; -frames:v corta na medida exata
            cmd = [FFMPEG] + LOG + ['-ss', f"{e['tin']:.4f}",
                                    '-t', f"{e['tsrc'] + 0.25:.4f}",
                                    '-i', src, '-vf', vf]
        cmd += ['-frames:v', str(nfr), '-c:v', 'libx264', '-crf', '15',
                '-preset', 'medium', '-pix_fmt', 'yuv420p',
                '-video_track_timescale', '30000', '-an', dst]
        run(cmd)
        # confere a contagem de quadros: cada plano tem de fechar na batida
        got = subprocess.run([f'{FF}/ffprobe', '-v', 'error', '-count_frames',
                              '-select_streams', 'v:0', '-show_entries',
                              'stream=nb_read_frames', '-of', 'csv=p=0', dst],
                             capture_output=True, text=True).stdout.strip()
        flag = '' if got == str(nfr) else f'  <-- ESPERADO {nfr}'
        print(f"  plano {e['idx']:02d}  {got} quadros{flag}")


# ------------------------------------------------------------ 3. concatenacao
def concat(tl):
    lst = f'{BUILD}/concat.txt'
    with open(lst, 'w') as f:
        for e in tl:
            f.write(f"file '{BUILD}/shots/{e['idx']:02d}.mp4'\n")
    run([FFMPEG] + LOG + ['-f', 'concat', '-safe', '0', '-i', lst,
                          '-c', 'copy', f'{BUILD}/video_cut.mp4'])


# ---------------------------------------------------------------- 4. ambiencia
# Leito de ambiencia com o audio real da sala (murmurinho, presenca).
# O audio original e captacao distante e nao tem fala inteligivel -- por isso
# entra apenas como textura, filtrado e ~20 dB abaixo da musica.
AMB = ['79', '92', '89', '78', '90']


def ambience(total):
    dst = f'{BUILD}/amb.wav'
    ins, fc, prev = [], [], None
    for i, k in enumerate(AMB):
        ins += ['-i', f'{ROOT}/{V[k]}']
        fc.append(f'[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,'
                  f'highpass=f=170,lowpass=f=5200[a{i}]')
    for i in range(len(AMB)):
        if prev is None:
            prev = f'a{i}'
            continue
        nxt = f'x{i}'
        fc.append(f'[{prev}][a{i}]acrossfade=d=0.6:c1=tri:c2=tri[{nxt}]')
        prev = nxt
    fc.append(f'[{prev}]apad,atrim=0:{total},'
              f'dynaudnorm=f=250:g=15:p=0.6,'
              f'afade=t=in:st=0:d=1.0,afade=t=out:st={total - 1.5}:d=1.5[out]')
    run([FFMPEG] + LOG + ins + ['-filter_complex', ';'.join(fc),
                                '-map', '[out]', '-ac', '2', '-ar', '48000', dst])
    return dst


def audio_mix(total, bd0, bd1):
    """Musica + ambiencia. A ambiencia sobe no breakdown, quando a musica abre:
    e o momento em que se ouve a sala.

    A normalizacao e feita em dois passes com linear=true (ganho estatico).
    O loudnorm em passe unico age como compressor e achatava o arco dinamico
    intro -> drop -> breakdown -> drop final que a trilha foi feita para ter.
    """
    dst = f'{BUILD}/audio.wav'
    base = (
        f"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,"
        f"atrim=0:{total},volume=1.0[mus];"
        f"[1:a]volume='0.10+0.11*between(t,{bd0},{bd1})':eval=frame[amb];"
        f"[mus][amb]amix=inputs=2:normalize=0:duration=first[mx]"
    )
    ins = ['-i', f'{BUILD}/music.wav', '-i', f'{BUILD}/amb.wav']

    # passe 1: mede
    r = subprocess.run([FFMPEG, '-hide_banner', '-nostats', '-y'] + ins +
                       ['-filter_complex', base + ";[mx]loudnorm=I=-14:TP=-1.0:print_format=json[o]",
                        '-map', '[o]', '-f', 'null', '-'],
                       capture_output=True, text=True)
    txt = r.stderr
    m = json.loads(txt[txt.rindex('{'):txt.rindex('}') + 1])
    print(f"     medido: I={m['input_i']} LUFS  LRA={m['input_lra']} TP={m['input_tp']}")

    # passe 2: aplica so ganho (preserva a dinamica interna)
    fc = (base + f";[mx]loudnorm=I=-14:TP=-1.0:linear=true"
                 f":measured_I={m['input_i']}:measured_LRA={m['input_lra']}"
                 f":measured_TP={m['input_tp']}:measured_thresh={m['input_thresh']}"
                 f":offset={m['target_offset']}[out]")
    run([FFMPEG] + LOG + ins + ['-filter_complex', fc, '-map', '[out]',
                                '-ac', '2', '-ar', '48000', dst])
    return dst


# -------------------------------------------------------------------- 5. texto
def finalize(total, bd0, bd1):
    """Compoe a tipografia (PNGs RGBA gerados em titles.py) via overlay.

    Este build de ffmpeg nao traz o filtro drawtext, e desenhar com PIL da
    controle melhor de entreletra e sombra do que o drawtext daria.
    """
    T = f'{BUILD}/titles'
    # (arquivo, entrada, saida) de cada bloco de texto
    blocks = [
        ('title.png', 1.60, 5.60),
        ('msg.png', bd0 + 0.30, bd1 - 0.20),
        ('end.png', 49.90, total),
    ]
    ins = ['-i', f'{BUILD}/video_cut.mp4', '-i', f'{BUILD}/audio.wav']
    for f, _, _ in blocks:
        ins += ['-framerate', str(FPS), '-loop', '1', '-t', f'{total:.3f}',
                '-i', f'{T}/{f}']

    fc, cur = [], '0:v'
    for i, (f, t0, t1) in enumerate(blocks):
        d = 0.40
        fc.append(f"[{i + 2}:v]format=rgba,"
                  f"fade=t=in:st={t0:.3f}:d={d}:alpha=1,"
                  f"fade=t=out:st={t1 - d:.3f}:d={d}:alpha=1[t{i}]")
        fc.append(f"[{cur}][t{i}]overlay=0:0:format=auto[v{i}]")
        cur = f'v{i}'
    fc.append(f"[{cur}]fade=t=in:st=0:d=0.4,"
              f"fade=t=out:st={total - 0.7:.3f}:d=0.7[vout]")

    dst = f'{OUT}/aftermovie_liga_endeavor_nxtp_9x16.mp4'
    run([FFMPEG] + LOG + ins + ['-filter_complex', ';'.join(fc),
                                '-map', '[vout]', '-map', '1:a',
                                '-c:v', 'libx264', '-crf', '19', '-preset', 'slow',
                                '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                                '-level', '4.0', '-c:a', 'aac', '-b:a', '256k',
                                '-ar', '48000', '-movflags', '+faststart',
                                '-t', f'{total:.3f}', dst])
    return dst


def finalize_45(total, bd0, bd1, yoff=140):
    """Versao 4:5 (1080x1350) para o feed do Instagram / LinkedIn.

    Recorta antes de compor a tipografia e desloca os overlays em -yoff, de modo
    que titulo, mensagem e end card continuem enquadrados. O deslocamento de 140px
    foi escolhido para preservar as logos projetadas no alto do quadro.
    """
    T = f'{BUILD}/titles'
    blocks = [('title.png', 1.60, 5.60), ('msg.png', bd0 + 0.30, bd1 - 0.20),
              ('end.png', 49.90, total)]
    ins = ['-i', f'{BUILD}/video_cut.mp4', '-i', f'{BUILD}/audio.wav']
    for f, _, _ in blocks:
        ins += ['-framerate', str(FPS), '-loop', '1', '-t', f'{total:.3f}',
                '-i', f'{T}/{f}']
    fc = [f"[0:v]crop=1080:1350:0:{yoff}[base]"]
    cur = 'base'
    for i, (f, t0, t1) in enumerate(blocks):
        d = 0.40
        fc.append(f"[{i + 2}:v]format=rgba,"
                  f"fade=t=in:st={t0:.3f}:d={d}:alpha=1,"
                  f"fade=t=out:st={t1 - d:.3f}:d={d}:alpha=1[t{i}]")
        fc.append(f"[{cur}][t{i}]overlay=0:-{yoff}:format=auto[v{i}]")
        cur = f'v{i}'
    fc.append(f"[{cur}]fade=t=in:st=0:d=0.4,"
              f"fade=t=out:st={total - 0.7:.3f}:d=0.7[vout]")
    dst = f'{OUT}/aftermovie_liga_endeavor_nxtp_4x5.mp4'
    run([FFMPEG] + LOG + ins + ['-filter_complex', ';'.join(fc),
                                '-map', '[vout]', '-map', '1:a',
                                '-c:v', 'libx264', '-crf', '19', '-preset', 'slow',
                                '-pix_fmt', 'yuv420p', '-profile:v', 'high',
                                '-level', '4.0', '-c:a', 'aac', '-b:a', '256k',
                                '-ar', '48000', '-movflags', '+faststart',
                                '-t', f'{total:.3f}', dst])
    return dst


if __name__ == '__main__':
    tl, total = timeline()
    grid = json.load(open(f'{BUILD}/grid.json'))
    bd = [s for s in grid['sections'] if s['name'] == 'breakdown'][0]

    print('1/5 estabilizando clipes com tremor alto...')
    stabilize()
    print('2/5 renderizando planos...')
    render_shots(tl)
    print('3/5 concatenando...')
    concat(tl)
    print('4/5 montando trilha (musica + ambiencia da sala)...')
    ambience(total)
    audio_mix(total, bd['t0'], bd['t1'])
    print('5/5 textos, fades e finalizacao...')
    dst = finalize(total, bd['t0'], bd['t1'])
    print('     ->', dst)
    d45 = finalize_45(total, bd['t0'], bd['t1'])
    print('     ->', d45)
