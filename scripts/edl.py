#!/usr/bin/env python3
"""EDL (decupagem) do aftermovie Liga Empreendedora x Endeavor Behring NXTP.

Grade musical: 120 BPM, beat = 0.5s, compasso = 2.0s. Todo corte cai na batida.
Duracao final: 56.0s (28 compassos), 1080x1920 (9:16), 30 fps.

CONTEUDO REAL DE CADA ARQUIVO (verificado quadro a quadro em analysis/INDEX_*.jpg):
  V36  chegada: participantes na porta de vidro, mochilas, atravessando o espaco
  V37  coffee: arranjo floral, mao arrumando o prato de paes, bowl de madeira
  V78  plateia de tras, sala cheia, painel ao fundo (camiseta Behring Academy)
  V79  PAINEL com as logos Liga / NXTP / Endeavor projetadas na parede (plano herói)
  V80  painel em angulo alto lateral (plano mais nitido do material)
  V84  plano alto amplo: sala lotada (estabelece a dimensao do evento)
  V85  tilt nas luminarias esfericas / treliça do galpao
  V86  plano alto: plateia sentada e palco
  V87  wide das quatro convidadas em contraluz de janela
  V88  painel medio (tres convidadas) - tem risada/reacao no final
  V89  painel medio - troca entre as convidadas, sorrisos
  V90  painel visto entre as cabecas da plateia (POV)
  V91  coffee: garrafoes de agua e suco, mao servindo
  V92  wide: painel na fachada de vidro

  Fotos coffee   : 103, 104, 105, 106, 107
  Fotos plateia  : 048, 049, 050, 052, 055
  (0081/0082/0098/0137 sao horizontais - nao usadas no corte 9:16)

Campos:
  src   origem ('V:xx' video / 'P:xxx' foto)
  tin   entrada na origem (s)
  b     duracao na timeline em BATIDAS (1 batida = 0.5s)
  tsrc  duracao consumida na origem (s) - se != b*0.5 gera camera lenta
  z     punch-in inicial (1.0 = quadro cheio) | zto: zoom final (drift)
"""

BEAT = 0.5

V = {
    '36': 'raw/VID-20260825-WA0036(1).mp4',
    '37': 'raw/VID-20260825-WA0037(1).mp4',
    '78': 'raw/VID-20260825-WA0078(1).mp4',
    '79': 'raw/VID-20260825-WA0079(1).mp4',
    '80': 'raw/VID-20260825-WA0080(1).mp4',
    '84': 'raw/VID-20260825-WA0084(1).mp4',
    '85': 'raw/VID-20260825-WA0085.mp4',
    '86': 'raw/VID-20260825-WA0086(1).mp4',
    '87': 'raw/VID-20260825-WA0087.mp4',
    '88': 'raw/VID-20260825-WA0088(1).mp4',
    '89': 'raw/VID-20260825-WA0089.mp4',
    '90': 'raw/VID-20260825-WA0090.mp4',
    '91': 'raw/VID-20260825-WA0091.mp4',
    '92': 'raw/VID-20260825-WA0092(1).mp4',
    # novos clipes de coffee, ja com a marca d'agua removida (delogo)
    '338': 'raw/VID-20260903-WA0338.mp4',
    '339': 'raw/VID-20260903-WA0339.mp4',
}
P = {k: f'raw/IMG-20260825-WA0{k}.jpg'
     for k in ('048', '049', '050', '052', '055', '103', '104', '105', '106', '107')}

# clipes que recebem estabilizacao (movimento mediano alto medido em clipstats)
STAB = {'36', '37', '78', '80', '84', '85', '86', '87', '91'}

SHOTS = [
    # ===== v4: estrutura baseada no corte "clideo" do cliente =================
    # O cliente recortou o v3 removendo as partes repetidas: a chegada/coffee do
    # inicio (que repetia) e TODA a montagem rapida do final (que reusava clipes).
    # Reproduzo esse corte no master em alta resolucao (sem marca d'agua) e
    # re-sincronizo a musica a esta nova duracao (38s). Ver EDICAO.md.
    #
    # ATO 1 / INTRO (0-4s): abertura -> coffee. Ordem: iluminacao, depois rapaz.
    dict(src='V:85', tin=1.90, b=3, tsrc=1.20, z=1.04, note='ABERTURA - iluminacao/telao (camera lenta), titulo sobre a cena'),
    dict(src='V:36', tin=2.45, b=3, z=1.06, note='o rapaz entrando no espaco do evento'),
    dict(src='V:91', tin=2.10, b=3, z=1.00, note='coffee: agua sendo servida (detalhe com movimento)'),

    # ===== BUILD (4-14s): coffee ampliado (2 clipes novos) + networking =======
    # V:338 e V:339 sao os clipes novos, com a marca d'agua removida. Dao uma
    # visao mais ampla do coffee: a mesa montada, as bebidas e as pessoas.
    dict(src='V:338', tin=0.10, b=3, z=1.02, note='COFFEE (novo, sem marca): mesa ampla - garrafa, doces, arranjo floral'),
    dict(src='P:104', tin=0.0, b=2, z=1.06, zto=1.16, note='foto: mesa do coffee (push-in lento)'),
    dict(src='V:339', tin=0.05, b=1, z=1.03, note='COFFEE (novo, sem marca): bebidas e pessoas ao fundo (networking)'),
    dict(src='V:36', tin=4.75, b=2, z=1.08, note='participantes conversando junto as cadeiras (networking)'),
    dict(src='V:86', tin=1.00, b=2, z=1.06, note='plano alto: a sala se enchendo (antecipa o drop)'),
    dict(src='V:84', tin=2.55, b=2, z=1.00, note='PLANO ALTO AMPLO: sala lotada'),
    dict(src='V:78', tin=0.90, b=2, z=1.04, note='plateia de tras: a sala cheia'),
    dict(src='P:049', tin=0.0, b=2, z=1.04, zto=1.14, note='foto: plateia lotada'),
    dict(src='V:90', tin=0.25, b=3, z=1.00, note='POV entre a plateia: o painel ao fundo'),

    # ===== DROP 1 (12-24s): energia sobe; o drop bate na revelacao da logo ====
    dict(src='V:79', tin=0.60, b=4, z=1.00, note='HERO/telao: painel com as logos Liga/NXTP/Endeavor (drop bate aqui)'),
    dict(src='V:80', tin=0.25, b=2, z=1.05, note='painel em angulo alto (plano mais nitido do material)'),
    dict(src='P:050', tin=0.0, b=2, z=1.05, zto=1.15, note='foto: plateia atenta (camiseta Behring Academy)'),
    dict(src='V:86', tin=4.55, b=2, z=1.08, note='plano alto: plateia e palco'),
    dict(src='V:88', tin=0.95, b=3, z=1.06, note='convidada falando ao microfone'),
    dict(src='V:92', tin=3.95, b=3, z=1.00, note='wide: o painel na fachada de vidro'),

    # ===== ATO 2 (24-30s): conteudo, reacoes ==================================
    dict(src='V:79', tin=3.40, b=3, z=1.12, note='painel: gesto com o microfone'),
    dict(src='V:89', tin=2.70, b=3, z=1.04, note='painel: troca entre as convidadas'),
    dict(src='P:052', tin=0.0, b=2, z=1.06, zto=1.16, note='foto: plateia e arquibancada'),
    dict(src='V:87', tin=3.00, b=3, z=1.30, pany=-0.55, note='wide das quatro convidadas em contraluz (reenquadrado)'),
    dict(src='V:89', tin=4.30, b=3, z=1.16, note='reacao: sorrisos no painel'),
    dict(src='P:055', tin=0.0, b=2, z=1.04, zto=1.14, note='foto: arquibancada lotada'),

    # ===== BREAKDOWN (30-34s): musica abre, entra a mensagem em texto =========
    dict(src='V:88', tin=5.60, b=4, z=1.08, note='risada / reacao das convidadas'),
    dict(src='V:79', tin=6.30, b=4, z=1.04, zto=1.10, note='painel estavel - musica reduz, entra o texto'),
    dict(src='V:90', tin=2.50, b=4, tsrc=1.80, z=1.02, zto=1.10, fadeout=1.4,
         note='painel (camera lenta) - a cena escurece aqui'),

    # ===== CARTAO FINAL (34-38s) ==============================================
    # A arte tem fundo preto: nasce do preto do plano anterior, como continuacao
    # do escurecimento. Assinatura DE BUILDER A FOUNDER sem data, com as 4 marcas.
    # cartao final ESTATICO: sem zoom drift. O zoompan, mesmo com drift minimo,
    # gera tremor sub-pixel numa arte com texto/logos finos. Aqui fica travado.
    dict(src='A:endcard', tin=0.0, b=8, z=1.00, fadein=0.9,
         note='assinatura DE BUILDER A FOUNDER (sem data) - estatico, sem tremor'),
]


ART = {'endcard': 'build/titles/endcard.png'}


def resolve(s):
    kind, key = s['src'].split(':')
    if kind == 'V':
        return 'video', V[key]
    if kind == 'A':
        return 'art', ART[key]
    return 'photo', P[key]


def timeline():
    out, t = [], 0.0
    for i, s in enumerate(SHOTS):
        d = s['b'] * BEAT
        kind, path = resolve(s)
        tsrc = s.get('tsrc', d)
        e = dict(s)
        e.update(idx=i + 1, kind=kind, path=path, tin_tl=round(t, 3),
                 tout_tl=round(t + d, 3), dur=round(d, 3), tsrc=round(tsrc, 3),
                 speed=round(tsrc / d, 4),
                 stab=(kind == 'video' and s['src'].split(':')[1] in STAB))
        out.append(e)
        t += d
    return out, t


if __name__ == '__main__':
    tl, total = timeline()
    print(f"{'#':>3} {'t_ini':>6} {'t_fim':>6} {'dur':>5} {'bt':>3} {'origem':<12} "
          f"{'in':>6} {'vel':>5} {'zoom':>11} {'est':>4}  nota")
    for e in tl:
        z = f"{e['z']:.2f}" + (f">{e['zto']:.2f}" if 'zto' in e else '')
        sh = e['path'].split('/')[-1].replace('VID-20260825-', '').replace('IMG-20260825-', 'F')
        sh = sh.replace('.mp4', '').replace('.jpg', '').replace('(1)', '')
        print(f"{e['idx']:>3} {e['tin_tl']:>6.2f} {e['tout_tl']:>6.2f} {e['dur']:>5.2f} {e['b']:>3} "
              f"{sh:<12} {e['tin']:>6.2f} {e['speed']:>5.2f} {z:>11} "
              f"{'sim' if e['stab'] else '-':>4}  {e['note']}")
    print(f"\nTOTAL: {total:.2f}s | {len(tl)} planos | media {total/len(tl):.2f}s por plano")
    from collections import Counter
    c = Counter(e['path'].split('/')[-1] for e in tl)
    print(f"\nfontes distintas: {len(c)}  |  reuso maximo: {max(c.values())}x")
    for k, v in c.most_common():
        print(f"  {v}x  {k}")
