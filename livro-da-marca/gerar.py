#!/usr/bin/env python3
# Gera livro-da-marca/index.html a partir dos arquivos da marca no repositório.
import base64, html, json, re, os

R = '/home/user/codimdev_tech'
M = R + '/marca'
md = open(M + '/plataforma-da-marca.md', encoding='utf-8').read()
voz = open(M + '/tom-de-voz.md', encoding='utf-8').read()
tokens = json.load(open(M + '/tokens.json', encoding='utf-8'))


def esc(s):
    return html.escape(s, quote=False)


def inline(s):
    s = esc(s)
    s = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = re.sub(r'`([^`]+)`', r'<code>\1</code>', s)
    return s


def section(text, title):
    parts = re.split(r'\n(?=## )', text)
    for p in parts:
        if p.startswith('## ' + title):
            return p
    raise KeyError(title)


def tables(text):
    out, cur = [], []
    for line in text.split('\n'):
        if line.startswith('|'):
            cur.append(line)
        elif cur:
            out.append(cur)
            cur = []
    if cur:
        out.append(cur)
    res = []
    for t in out:
        rows = []
        for i, l in enumerate(t):
            cells = [c.strip() for c in l.strip().strip('|').split('|')]
            if i == 1 and all(set(c) <= set('-: ') for c in cells):
                continue
            rows.append(cells)
        res.append(rows)
    return res


def paras(text):
    return [l for l in text.split('\n') if l.strip() and not l.startswith(('#', '|', '- ', '>')) and not re.match(r'\d+\. ', l)]


def bullets(text):
    return [re.sub(r'^- (\[ \] )?', '', l) for l in text.split('\n') if l.startswith('- ')]


def numbered(text):
    return [re.sub(r'^\d+\. ', '', l) for l in text.split('\n') if re.match(r'\d+\. ', l)]


def table_html(rows, cls='', drop=None):
    drop = drop or []
    keep = [i for i in range(len(rows[0])) if i not in drop]
    h = '<div class="tw"><table class="%s"><thead><tr>' % cls
    h += ''.join('<th>%s</th>' % inline(rows[0][i]) for i in keep) + '</tr></thead><tbody>'
    for r in rows[1:]:
        h += '<tr>' + ''.join('<td>%s</td>' % inline(r[i]) for i in keep) + '</tr>'
    return h + '</tbody></table></div>'


def b64svg(path):
    b = open(path, 'rb').read()
    return 'data:image/svg+xml;base64,' + base64.b64encode(b).decode()


L = {k: b64svg(f'{M}/logos/codimdev-{k}.svg') for k in [
    'fundo-claro', 'fundo-escuro', 'empilhada-fundo-claro', 'empilhada-fundo-escuro',
    'simbolo-fundo-claro', 'simbolo-fundo-escuro']}


def logo_swap(kind, cls='', alt='codimdev'):
    suf = {'h': ('fundo-claro', 'fundo-escuro'), 's': ('empilhada-fundo-claro', 'empilhada-fundo-escuro'),
           'm': ('simbolo-fundo-claro', 'simbolo-fundo-escuro')}[kind]
    return ('<img class="lg-l %s" src="%s" alt="%s"><img class="lg-d %s" src="%s" alt="" aria-hidden="true">'
            % (cls, L[suf[0]], alt, cls, L[suf[1]]))


# fotos
def b64img(path):
    return 'data:image/webp;base64,' + base64.b64encode(open(path, 'rb').read()).decode()

PH = {'moletom': b64img(R + '/imagens/zacarias/moletom-bege-2-840x1050.webp')}
ALT_M = 'Zacarias, de braços cruzados, de moletom bege'

# ícones
icon_order = ['site', 'sistema', 'automacao', 'design', 'video', 'etiqueta', 'mensagem', 'dados', 'ajustes', 'codigo',
              'seta', 'check', 'fechar', 'menu', 'mais', 'busca', 'email', 'celular', 'calendario', 'relogio',
              'download', 'externo', 'usuario']


def icon(name):
    s = open(f'{M}/icones/{name}.svg', encoding='utf-8').read()
    s = s.replace('#18191D', 'currentColor').replace('#C42A1F', 'var(--carmim)')
    s = re.sub(r' width="24" height="24"', '', s)
    s = s.replace('role="img" aria-label="%s"' % name, 'aria-hidden="true"')
    return s


# ---------------- conteúdo ----------------
quem = section(md, 'Quem é a codimdev')
qp = paras(quem)
frase = [p for p in qp if p.startswith('**Em uma frase')][0]
nome = [p for p in qp if p.startswith('**O nome')][0]
grafia = [p for p in qp if p.startswith('**Grafia')][0]
contato = [p for p in qp if p.startswith('**Contato')][0]
fora = [p for p in qp if p.startswith('**Fora do escopo')][0]
intro = qp[0]

prop = section(md, 'Propósito, missão')
prop_p = paras(prop)[0]
prop_b = bullets(prop)
valores = tables(prop)[0]

serv = section(md, 'Serviços')
serv_t = tables(serv)[0]

como = section(md, 'O que entrego')
como_t = tables(como)[0]
trab = section(md, 'Como trabalho')
trab_steps = numbered(trab)

pub = section(md, 'Público e personas')
pub_p = paras(pub)
pers = tables(pub)[0]
decide = [p for p in pub_p if p.startswith('**Quem decide')][0]

pos = section(md, 'Posicionamento')
pos_p = paras(pos)[0]
alts = tables(pos)[0]
difs = numbered(pos)

tom = section(md, 'Personalidade')
tom_p = paras(tom)
tom_intro = tom_p[0]
somos = tables(tom)[0]
escrever = bullets(tom.split('**Como escrever:**')[1].split('**Palavras')[0])
palavras = [p for p in tom_p if p.startswith('**Palavras que usamos')][0]
ex = bullets(tom.split('**Exemplo:**')[1])

bios = numbered(voz.split('**Bio (escolha uma):**')[1].split('Última linha')[0])
aberturas = bullets(voz.split('**Aberturas que funcionam:**')[1].split('## WhatsApp')[0])

canais = section(md, 'Canais e conteúdo')
canais_t = tables(canais)
regras = tables(section(md, 'Regras da marca'))[0]

# tokens
cores = tokens['color']['tokens']

# ---------------- CSS ----------------
CSS = r'''
/* Layout: um livro de capítulos. Cada capítulo abre com a barra de quatro colunas em mono dos modelos de Instagram da marca.
   Cores e fontes são os tokens da codimdev; o tema escuro usa os valores "escuro" de tokens.json. */
:root{
  --algodao:#F5F4EF;--trama:#E9E7E0;--cru:#DEDCD4;--linha:#D6D4CC;--grafite:#18191D;--suave:#5C5D63;
  --carmim:#C42A1F;--no-carmim:#FFFFFF;--floresta:#2F6E54;--erro:#8E1B12;
  --sombra:0 8px 24px rgba(24,25,29,.08);
  --f-display:"IBM Plex Sans",system-ui,sans-serif;--f-sans:"Inter",system-ui,sans-serif;--f-mono:"IBM Plex Mono",ui-monospace,monospace;
  --r:4px;--gutter:clamp(20px,4vw,56px);
}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){
  --algodao:#141518;--trama:#1E1F23;--cru:#2A2B30;--linha:#34353B;--grafite:#F2F1EC;--suave:#A3A4AA;
  --carmim:#EC5A4D;--no-carmim:#141518;--floresta:#4FA37F;--erro:#FF8A7E;--sombra:none;color-scheme:dark}}
:root[data-theme="dark"]{
  --algodao:#141518;--trama:#1E1F23;--cru:#2A2B30;--linha:#34353B;--grafite:#F2F1EC;--suave:#A3A4AA;
  --carmim:#EC5A4D;--no-carmim:#141518;--floresta:#4FA37F;--erro:#FF8A7E;--sombra:none;color-scheme:dark}
*{box-sizing:border-box}
html{scroll-padding-top:16px}
body{margin:0;background:var(--algodao);color:var(--grafite);font:400 17px/1.55 var(--f-sans);-webkit-font-smoothing:antialiased;overflow-x:clip}
.wrap{max-width:1200px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px),var(--gutter));padding-right:max(16px,env(safe-area-inset-right,0px),var(--gutter))}
h1,h2,h3,h4{font-family:var(--f-display);font-weight:600;margin:0;text-wrap:balance}
h1{font-size:clamp(2.6rem,1rem + 6.4vw,6.2rem);line-height:.98;letter-spacing:-.045em}
h2{font-size:clamp(2rem,1.2rem + 2.6vw,3.6rem);line-height:1.05;letter-spacing:-.03em}
h3{font-size:clamp(1.25rem,1.05rem + .7vw,1.6rem);line-height:1.2;letter-spacing:-.015em}
h4{font-size:1.05rem;line-height:1.3}
p{margin:0}
a{color:var(--carmim);text-decoration:none}a:hover{text-decoration:underline}
a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--grafite);outline-offset:2px}
code,.mono{font-family:var(--f-mono)}
code{font-size:.88em;background:var(--trama);padding:1px 6px;border-radius:var(--r)}
.mono{font-size:12px;line-height:16px;letter-spacing:.06em;text-transform:uppercase;color:var(--suave)}
.suave{color:var(--suave)}
.lead{font-size:clamp(1.1rem,1rem + .5vw,1.35rem);line-height:1.5;max-width:60ch}
.slash{display:inline-block;width:18px;height:12px;background:var(--carmim);transform:skewX(-36deg);border-radius:2px;flex:none}
.destaque{color:var(--carmim)}
.lg-l{display:block}.lg-d{display:none}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .lg-l{display:none}:root:not([data-theme="light"]) .lg-d{display:block}}
:root[data-theme="dark"] .lg-l{display:none}:root[data-theme="dark"] .lg-d{display:block}

/* capa */
.capa{padding-block:28px clamp(48px,8vw,96px)}
.barra{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;border-top:2px solid var(--grafite);padding-top:14px}
.barra span:last-child{text-align:right}
.capa .logo{width:min(320px,70%);margin-block:clamp(40px,7vw,88px) clamp(32px,5vw,64px)}
.capa .logo img{width:100%;height:auto}
.capa h1{max-width:13ch}
.capa .lead{margin-top:28px;color:var(--suave)}
.fio{display:flex;align-items:center;margin-block:clamp(40px,6vw,72px) 20px}
.fio i{flex:1;height:4px;background:var(--carmim)}
.fio .slash{width:54px;height:30px;margin-left:-4px}
.indice{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0 24px;list-style:none;margin:0;padding:0}
.indice a{display:flex;gap:12px;align-items:baseline;padding:11px 0;border-top:1px solid var(--linha);color:var(--grafite);font-family:var(--f-display);font-weight:600;font-size:18px}
.indice a:hover{color:var(--carmim);text-decoration:none}
.indice .mono{min-width:2ch}

/* foto na capa e capítulo de fotografia */
.capa__grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(24px,5vw,64px);align-items:end}
.capa__foto{align-self:end}
.capa__foto img{width:100%;height:auto;max-height:620px;object-fit:contain;object-position:bottom}
@media(max-width:820px){.capa__grid{grid-template-columns:1fr}.capa__foto{max-width:360px}}
.foto{border-radius:var(--r);border:1px solid var(--linha);overflow:hidden;aspect-ratio:4/5}
.foto img{display:block;width:100%;height:100%;object-fit:contain;object-position:center bottom}
.g2.f4{grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr))}
.foto.a{background:#F5F4EF}.foto.t{background:#E9E7E0}.foto.g{background:#18191D;border-color:#18191D}
.foto.nao{position:relative}
.foto.nao::after{content:"";position:absolute;left:-10%;right:-10%;top:50%;height:2px;background:#C42A1F;rotate:-24deg}

/* capítulos */
.cap{padding-block:clamp(56px,9vw,112px) 0}
.cap__topo{margin-bottom:clamp(28px,4vw,48px);display:grid;gap:22px}
.cap__topo .lead{color:var(--suave)}
.bloco{margin-top:clamp(32px,5vw,56px);display:grid;gap:16px}
.bloco>h3{padding-bottom:10px;border-bottom:1px solid var(--linha)}
.g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:16px}
.g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:16px}
.cartao{background:var(--trama);border:1px solid var(--linha);border-radius:var(--r);padding:24px;display:grid;gap:10px;align-content:start;min-width:0}
.cartao p{color:var(--suave);font-size:15px}
.cartao .mono{color:var(--carmim)}
.cartao.escuro{background:var(--grafite);color:var(--algodao);border-color:var(--grafite)}
.cartao.escuro p{color:var(--algodao);opacity:.8}
.cartao .frase-grande{font-size:clamp(1.5rem,1.1rem + 1.4vw,2.2rem);color:inherit;opacity:1;max-width:none}
.frase-grande{font-family:var(--f-display);font-weight:600;font-size:clamp(1.6rem,1.1rem + 2vw,2.6rem);line-height:1.12;letter-spacing:-.025em;max-width:26ch}
.tw{overflow-x:auto;border:1px solid var(--linha);border-radius:var(--r)}
table{border-collapse:collapse;width:100%;min-width:560px;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:12px 14px;border-bottom:1px solid var(--linha)}
tr:last-child td{border-bottom:0}
th{font:500 12px/16px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--suave);background:var(--trama)}
td:first-child{font-weight:600}
.lista{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.lista li{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start}
.lista li::before{content:"";width:12px;height:8px;margin-top:9px;background:var(--carmim);transform:skewX(-36deg);border-radius:2px}
ol.num{margin:0;padding:0;list-style:none;display:grid;gap:12px;counter-reset:n}
ol.num li{counter-increment:n;display:grid;grid-template-columns:36px 1fr;gap:14px;align-items:start}
ol.num li::before{content:counter(n,decimal-leading-zero);font:500 13px/36px var(--f-mono);color:var(--carmim)}
.par-sn{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px}
.sn{border-radius:var(--r);padding:20px;display:grid;gap:8px;min-width:0}
.sn.sim{border:2px solid var(--grafite)}
.sn.nao{background:var(--trama);border:1px solid var(--linha)}
.sn q{quotes:none;display:block;font:600 1.15rem/1.3 var(--f-display);letter-spacing:-.01em}
.sn.nao q{color:var(--suave);text-decoration:line-through;text-decoration-color:var(--carmim);text-decoration-thickness:2px}

/* personas */
.g3.pers{grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))}
.persona{background:var(--trama);border:1px solid var(--linha);border-radius:var(--r);padding:22px;display:grid;gap:14px;align-content:start;min-width:0}
.persona dl{margin:0;display:grid;gap:10px}
.persona dt{font:500 11px/14px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--suave)}
.persona dd{margin:2px 0 0;font-size:15px}
.persona dd.entrada{font-weight:600}

/* logo */
.mostra{border-radius:var(--r);border:1px solid var(--linha);display:grid;place-items:center;padding:clamp(20px,4vw,48px);min-height:180px}
.mostra.c{background:#F5F4EF}.mostra.e{background:#18191D;border-color:#18191D}
.mostra img{width:100%;height:auto;max-height:160px;object-fit:contain}
.mostra.h img{max-width:420px}.mostra.s img{max-width:220px}.mostra.m img{max-width:150px}
.leg{display:grid;gap:2px;margin-top:8px}
.leg b{font:600 15px/1.3 var(--f-display)}
.leg span{font-size:13px;color:var(--suave)}
.respiro{position:relative;background:#F5F4EF;border:1px dashed #C42A1F;border-radius:var(--r);padding:30px;display:grid;place-items:center;max-width:460px}
.respiro img{width:100%;height:auto}
.respiro::after{content:"";position:absolute;inset:30px;border:1px solid rgba(196,42,31,.35)}

/* cores */
.sw{border:1px solid var(--linha);border-radius:var(--r);overflow:hidden;background:var(--algodao);min-width:0}
.sw__c{height:104px;padding:14px 16px;display:flex;align-items:flex-end;justify-content:space-between;gap:10px;font:600 22px/1 var(--f-display);letter-spacing:-.02em}
.sw__c small{font:500 12px/1 var(--f-mono);letter-spacing:.06em}
.sw__i{padding:14px 16px;display:grid;gap:6px;font-size:14px}
.sw__i .hex{display:flex;gap:14px;font:500 12px/1.2 var(--f-mono);color:var(--suave);flex-wrap:wrap}
.sw__i .hex i{display:inline-block;width:10px;height:10px;border-radius:2px;border:1px solid var(--linha);margin-right:5px;vertical-align:-1px}
.cx{display:inline-flex;align-items:center;justify-content:center;min-width:64px;padding:6px 10px;border-radius:var(--r);font:600 18px/1 var(--f-display)}
.ok{color:var(--floresta);font-weight:600}.av{color:var(--erro);font-weight:600}

/* tipografia */
.fonte{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:clamp(18px,4vw,48px);padding:clamp(18px,3vw,30px);background:var(--trama);border:1px solid var(--linha);border-radius:var(--r);align-items:center}
.fonte__n{display:grid;gap:8px}
.amostra-t{font:600 clamp(2.4rem,1rem + 5vw,4.6rem)/1 var(--f-display);letter-spacing:-.04em;overflow-wrap:anywhere}
.amostra-s{font:400 18px/1.55 var(--f-sans);max-width:52ch}
.amostra-m{font:400 13px/1.7 var(--f-mono);overflow-wrap:anywhere}
@media(max-width:760px){.fonte{grid-template-columns:1fr}}

/* ícones */
.icones{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}
.ic{display:grid;gap:10px;justify-items:center;padding:18px 8px 12px;background:var(--trama);border:1px solid var(--linha);border-radius:var(--r);text-align:center}
.ic svg{width:32px;height:32px;color:var(--grafite)}
.ic span{font:400 11px/1.2 var(--f-mono);color:var(--suave)}

/* componentes (vivos) */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:12px 16px;border-radius:var(--r);border:1px solid transparent;font:500 15px/20px var(--f-sans);cursor:pointer;text-decoration:none;transition:background-color .15s,color .15s,border-color .15s,opacity .15s}
.btn svg{width:18px;height:18px}
.btn-p{background:var(--carmim);color:var(--no-carmim)}.btn-p:hover{opacity:.9;text-decoration:none}
.btn-s{background:transparent;color:var(--grafite);border-color:var(--grafite)}.btn-s:hover{background:var(--cru);text-decoration:none}
.btn-c{background:var(--floresta);color:var(--algodao)}.btn-c:hover{opacity:.9}
.btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.campo{display:grid;gap:8px;max-width:340px}
.campo label{font:400 12px/16px var(--f-mono);color:var(--grafite)}
.campo input{font:400 16px/24px var(--f-sans);color:var(--grafite);background:transparent;border:1px solid var(--linha);border-radius:var(--r);padding:12px 16px;transition:border-color .15s;min-width:0}
.campo input:hover{border-color:var(--suave)}.campo input:focus{border-color:var(--grafite)}
.campo .erro{font:400 13px/18px var(--f-sans);color:var(--erro)}
.serv{background:var(--trama);border:1px solid var(--linha);border-radius:var(--r);padding:24px;display:grid;gap:12px;align-content:start;transition:border-color .15s}
.serv:hover{border-color:var(--grafite)}
.serv svg{width:32px;height:32px;color:var(--grafite)}
.serv h4{font-size:20px;line-height:26px}.serv p{font-size:15px;color:var(--suave)}
.cta{background:#18191D;color:#F5F4EF;border-radius:var(--r);padding:32px;display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between}
.cta h3{font-size:clamp(1.4rem,1.1rem + 1vw,2rem);max-width:30ch;letter-spacing:-.02em}
.cta p{margin-top:6px;font-size:15px;opacity:.8}
.cta .btn-p{background:#EC5A4D;color:#141518}
.dep{border-top:2px solid var(--grafite);padding-top:20px;display:grid;gap:12px;max-width:560px}
.dep blockquote{margin:0;font:400 22px/1.4 var(--f-display)}
.dep blockquote::before{content:"“";color:var(--carmim)}.dep blockquote::after{content:"”";color:var(--carmim)}
.janela{background:var(--algodao);border:1px solid var(--linha);border-radius:var(--r);box-shadow:var(--sombra);overflow:hidden;max-width:420px}
.janela .tb{background:var(--trama);border-bottom:1px solid var(--linha);padding:8px 14px;display:flex;gap:6px}
.janela .tb i{width:10px;height:10px;border-radius:50%;background:var(--linha)}
.janela .tb i:first-child{background:var(--carmim)}
.janela .co{padding:18px;display:grid;gap:8px}

/* rodapé */
footer.fim{margin-top:clamp(64px,10vw,120px);border-top:2px solid var(--grafite);padding-block:36px 56px}
footer.fim .wrap{display:grid;grid-template-columns:minmax(0,260px) minmax(0,1fr);gap:24px 48px;align-items:start}
footer.fim .lg-l,footer.fim .lg-d{width:100%;height:auto}
footer.fim .cols{display:flex;gap:40px;flex-wrap:wrap}
footer.fim .col{display:grid;gap:6px;font-size:15px}
@media(max-width:760px){footer.fim .wrap{grid-template-columns:1fr}.barra{grid-template-columns:1fr 1fr}.barra span:nth-child(2n){text-align:right}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
'''

# ---------------- HTML ----------------
def barra(*c):
    return '<div class="barra mono">' + ''.join('<span>%s</span>' % esc(x) for x in c) + '</div>'


def cap(num, slug, titulo, lead, corpo):
    return (f'<section class="cap" id="{slug}"><div class="wrap">'
            f'<div class="cap__topo">{barra("codimdev", "Capítulo " + num, titulo.split(".")[0] if False else slug.replace("-", " "), "Livro da marca")}'
            f'<h2>{titulo}</h2><p class="lead">{lead}</p></div>{corpo}</div></section>')


def lista(items):
    return '<ul class="lista">' + ''.join('<li><span>%s</span></li>' % inline(i) for i in items) + '</ul>'


# 01 essência
valores_h = '<div class="g3">' + ''.join(
    f'<div class="cartao"><span class="mono">Valor</span><h3>{esc(v[0])}</h3><p>{inline(v[1])}</p></div>' for v in valores[1:]) + '</div>'
c1 = f'''
<div class="g2">
  <div class="cartao escuro"><span class="mono" style="color:var(--carmim)">Em uma frase</span>
    <p class="frase-grande">Sites que vendem e sistemas que organizam, feitos pela mesma pessoa, do design ao código.</p></div>
  <div class="cartao"><span class="mono">O nome</span><h3>codim + dev</h3><p>{inline(nome.split(":** ",1)[1])}</p>
    <span class="mono" style="margin-top:8px">A grafia</span>
    <div class="btns"><span class="cx" style="background:var(--trama);color:var(--floresta);border:1px solid var(--floresta)">codimdev</span>
    <span class="cx" style="text-decoration:line-through;text-decoration-color:var(--carmim);color:var(--suave);border:1px solid var(--linha)">CodimDev</span>
    <span class="cx" style="text-decoration:line-through;text-decoration-color:var(--carmim);color:var(--suave);border:1px solid var(--linha)">Codim Dev</span>
    <span class="cx" style="text-decoration:line-through;text-decoration-color:var(--carmim);color:var(--suave);border:1px solid var(--linha)">CODIMDEV</span></div>
    <p>Tudo junto e em minúsculas, igual à logo. Vale no começo de frase e em títulos.</p></div>
</div>
<div class="bloco"><h3>Propósito, missão e visão</h3>
  <p class="frase-grande" style="max-width:34ch">{inline(prop_p)}</p>
  <div class="g2">{''.join(f'<div class="cartao"><p style="color:var(--grafite);font-size:16px">{inline(b)}</p></div>' for b in prop_b if not b.startswith('**Estado'))}</div>
  <p class="mono">{inline(next(b for b in prop_b if b.startswith('**Estado')).replace('**','').replace('Estado atual: ','Estado atual · '))}</p></div>
<div class="bloco"><h3>Valores</h3>{valores_h}</div>
<div class="bloco"><h3>O que a codimdev faz</h3><p class="suave" style="max-width:62ch">{inline(intro)}</p>{table_html(serv_t, drop=[3])}
  <p class="suave" style="font-size:14px">{inline(fora)}</p></div>
'''

# 02 público
pers_h = '<div class="g3 pers">'
for j in range(1, len(pers[0])):
    pers_h += f'<article class="persona"><h3>{esc(pers[0][j])}</h3><dl>'
    for r in pers[1:]:
        cls = ' class="entrada"' if r[0] == 'Serviço de entrada' else ''
        pers_h += f'<div><dt>{esc(r[0])}</dt><dd{cls}>{inline(r[j])}</dd></div>'
    pers_h += '</dl></article>'
pers_h += '</div>'
c2 = f'''<p class="suave" style="max-width:70ch">{inline(pub_p[0])}</p>{pers_h}
<div class="bloco"><h3>Quem decide</h3><p style="max-width:70ch">Muda com o porte.{inline(decide.split(":** ",1)[1][len("muda com o porte."):])}</p></div>'''

# 03 posicionamento
c3 = f'''<p class="frase-grande" style="font-size:clamp(1.3rem,1.05rem + 1vw,1.85rem);max-width:46ch;line-height:1.25">{inline(pos_p)}</p>
<div class="bloco"><h3>Contra o que o cliente compara</h3>{table_html(alts)}</div>
<div class="bloco"><h3>Diferenciais para repetir em todo lugar</h3><ol class="num">{''.join(f'<li><span>{inline(d)}</span></li>' for d in difs)}</ol></div>'''

# 04 voz
sn = '<div class="par-sn"><div class="sn sim"><span class="mono">Somos</span>' + ''.join(f'<p>{inline(r[0])}</p>' for r in somos[1:]) + '</div>' \
     '<div class="sn nao"><span class="mono">Não somos</span>' + ''.join(f'<p class="suave">{inline(r[1])}</p>' for r in somos[1:]) + '</div></div>'
c4 = f'''<p style="max-width:70ch" class="suave">{inline(tom_intro)}</p>{sn}
<div class="bloco"><h3>Como escrever</h3>{lista(escrever)}<p style="max-width:70ch">{inline(palavras)}</p></div>
<div class="bloco"><h3>Exemplo</h3><div class="par-sn"><div class="sn nao"><span class="mono">Assim não</span><q>{esc(ex[0].split('"',1)[1].rsplit('"',1)[0])}</q></div>
  <div class="sn sim"><span class="mono">Assim sim</span><q>{esc(ex[1].split('"',1)[1].rsplit('"',1)[0])}</q></div></div></div>
<div class="bloco"><h3>Bio do Instagram</h3><div class="g3">{''.join(f'<div class="cartao"><span class="mono">Opção {i+1}</span><p style="color:var(--grafite);font-size:16px">{inline(b)}</p></div>' for i,b in enumerate(bios))}</div>
  <p class="mono">Última linha da bio: “Orçamento pelo WhatsApp ↓” e o link</p></div>
<div class="bloco"><h3>Aberturas de post que funcionam</h3><div class="g3">{''.join(f'<div class="cartao"><p class="frase-grande" style="font-size:1.35rem;color:var(--grafite);opacity:1">{inline(a.strip(chr(34)))}</p></div>' for a in aberturas)}</div></div>'''

# 05 logo
c5 = f'''
<div class="g2"><div><div class="mostra c h"><img src="{L['fundo-claro']}" alt="Logo horizontal codimdev para fundo claro"></div><div class="leg"><b>Horizontal · fundo claro</b><span>Sobre algodão ou trama</span></div></div>
<div><div class="mostra e h"><img src="{L['fundo-escuro']}" alt="Logo horizontal codimdev para fundo escuro"></div><div class="leg"><b>Horizontal · fundo escuro</b><span>Sobre grafite</span></div></div>
<div><div class="mostra c s"><img src="{L['empilhada-fundo-claro']}" alt="Logo empilhada codimdev para fundo claro"></div><div class="leg"><b>Empilhada · fundo claro</b><span>Capas, cartões de visita e espaços quadrados</span></div></div>
<div><div class="mostra e s"><img src="{L['empilhada-fundo-escuro']}" alt="Logo empilhada codimdev para fundo escuro"></div><div class="leg"><b>Empilhada · fundo escuro</b><span>Capas, cartões de visita e espaços quadrados</span></div></div>
<div><div class="mostra c m"><img src="{L['simbolo-fundo-claro']}" alt="Símbolo codimdev para fundo claro"></div><div class="leg"><b>Só símbolo · fundo claro</b><span>Avatar do Instagram, favicon e marca d'água</span></div></div>
<div><div class="mostra e m"><img src="{L['simbolo-fundo-escuro']}" alt="Símbolo codimdev para fundo escuro"></div><div class="leg"><b>Só símbolo · fundo escuro</b><span>Avatar do Instagram, favicon e marca d'água</span></div></div></div>
<div class="bloco"><h3>Assinatura visual</h3><div class="g2">
  <div class="cartao"><p style="color:var(--grafite);font-size:16px">A barrinha inclinada em carmim, no mesmo ângulo do traço da logo e do pingo do “i”. Aparece em ícones, listas, fios e chamadas, sempre pequena e sempre em carmim.</p>
  <div class="btns" style="margin-top:6px"><span class="slash"></span><span class="slash" style="width:36px;height:24px"></span><span class="slash" style="width:54px;height:36px"></span></div></div>
  <div class="cartao"><p style="color:var(--grafite);font-size:16px">Os dois detalhes da logo, o traço do símbolo e o pingo do “i”, vão em carmim. O resto da logo segue o grafite do tema.</p></div></div></div>
<div class="bloco"><h3>Respiro e uso</h3><div class="g2"><div>
  <div class="respiro"><img src="{L['fundo-claro']}" alt=""></div><div class="leg"><b>Respiro mínimo</b><span>Pelo menos a altura do “o” do nome, em todos os lados</span></div></div>
  <div class="par-sn" style="grid-template-columns:1fr"><div class="sn sim"><span class="mono">Pode</span>{lista(['Usar a versão do tema: a de fundo claro sobre algodão e trama, a de fundo escuro sobre grafite','Trocar este arquivo pelo SVG original da marca, se ele existir: o original manda'])}</div>
  <div class="sn nao"><span class="mono">Não pode</span>{lista(['Recolorir fora dos tokens','Esticar ou deformar','Aplicar sombra ou gradiente','Usar sobre carmim ou sobre fundo de cor viva'])}</div></div></div></div>'''

# 06 cores
nomes = {'algodao': 'algodão', 'trama': 'trama', 'cru': 'cru', 'linha': 'linha', 'grafite': 'grafite', 'grafite-suave': 'grafite suave',
         'carmim': 'carmim', 'no-carmim': 'no carmim', 'floresta': 'floresta', 'erro': 'erro'}
sws = '<div class="g3">'
for t in cores:
    c, e = t['value']['claro'], t['value']['escuro']
    n = t['name']
    light_bg = n in ('algodao', 'trama', 'cru', 'linha', 'no-carmim')
    fg = '#18191D' if light_bg else '#FFFFFF'
    if n == 'no-carmim':
        c_bg, c_fg = '#C42A1F', '#FFFFFF'
    else:
        c_bg, c_fg = c, fg
    sws += f'''<div class="sw"><div class="sw__c" style="background:{c_bg};color:{c_fg}">{nomes[n]}<small>{c}</small></div>
<div class="sw__i"><div class="hex"><span><i style="background:{c}"></i>claro {c}</span><span><i style="background:{e}"></i>escuro {e}</span></div>
<span class="mono" style="color:var(--suave)">token {n}</span><span>{inline(t['usage'])}</span></div></div>'''
sws += '</div>'
sws = sws.replace('no carmim</div>', 'no carmim · texto sobre carmim</div>') if False else sws


def cx(bg, fg, label='Aa', border=False):
    b = ';box-shadow:inset 0 0 0 1px #D6D4CC' if border else ''
    return f'<span class="cx" style="background:{bg};color:{fg}{b}">{label}</span>'


contr = [
    (cx('#F5F4EF', '#18191D', border=True), 'grafite sobre algodão', '15,9', '16,1', 'ok', 'Tudo'),
    (cx('#E9E7E0', '#18191D'), 'grafite sobre trama', '14,2', '—', 'ok', 'Tudo'),
    (cx('#F5F4EF', '#5C5D63', border=True), 'grafite suave sobre algodão', '6,0', '7,3', 'ok', 'Legendas e etiquetas'),
    (cx('#E9E7E0', '#5C5D63'), 'grafite suave sobre trama', '5,3', '6,6', 'ok', 'Legendas dentro de cartões'),
    (cx('#C42A1F', '#FFFFFF'), 'no carmim sobre carmim (botão)', '5,7', '5,3', 'ok', 'Botão principal'),
    (cx('#F5F4EF', '#C42A1F', border=True), 'carmim sobre algodão', '5,2', '5,3', 'ok', 'Links e palavra em destaque'),
    (cx('#E9E7E0', '#C42A1F'), 'carmim sobre trama', '4,6', '4,8', 'ok', 'Links e palavra em destaque'),
    (cx('#F5F4EF', '#2F6E54', border=True), 'floresta sobre algodão', '5,5', '6,0', 'ok', 'Confirmação, nas telas do produto'),
    (cx('#F5F4EF', '#8E1B12', border=True), 'erro sobre algodão', '8,2', '8,0', 'ok', 'Mensagem de erro, sempre com texto'),
    (cx('#18191D', '#C42A1F'), 'carmim claro sobre grafite', '3,1', '—', 'av', 'Só texto grande (a partir de 24 px) ou a barrinha'),
]
contr_h = '<div class="tw"><table><thead><tr><th>Par</th><th>Combinação</th><th>Tema claro</th><th>Tema escuro</th><th>Uso</th></tr></thead><tbody>' + ''.join(
    f'<tr><td>{a}</td><td style="font-weight:400">{b}</td><td class="{k}">{c} : 1</td><td>{d if d=="—" else d+" : 1"}</td><td style="font-weight:400">{u}</td></tr>' for a, b, c, d, k, u in contr) + '</tbody></table></div>'
c6 = f'''<p class="suave" style="max-width:70ch">Nada de branco puro nem de preto puro nos fundos. O tema escuro troca os mesmos tokens: use os nomes, nunca os valores.</p>{sws}
<div class="bloco"><h3>Como usar o carmim</h3><div class="g2">
<div class="sn sim"><span class="mono">Faça</span>{lista(['Um botão carmim e um secundário no mesmo grupo','Uma palavra em destaque em carmim por título, no máximo','Fundo algodão e cartões em trama, separados por fios finos'])}</div>
<div class="sn nao"><span class="mono">Evite</span>{lista(['Carmim como fundo de seção inteira ou em vários botões juntos','Usar carmim para indicar erro: o erro tem a sua cor e sempo vem com texto','Branco puro, preto puro, pílulas, gradientes, brilhos e sombras azuladas'])}</div></div></div>
<div class="bloco"><h3>Contraste medido</h3><p class="suave" style="max-width:70ch">Razões calculadas pela fórmula WCAG 2.x entre os valores dos tokens. Texto normal pede 4,5; texto grande, 3.</p>{contr_h}</div>'''
c6 = c6.replace('sempo vem', 'sempre vem')

# 07 tipografia
grp = tokens['type']['groups']
esc_rows = ''
for g in grp:
    fam = {'display': 'IBM Plex Sans', 'sans': 'Inter', 'mono': 'IBM Plex Mono'}[g['family']]
    for s in g['styles']:
        esc_rows += f"<tr><td>{s['name']}</td><td>{fam} {s['fontWeight']}</td><td class='mono' style='text-transform:none'>{s['fontSize']} / {s['lineHeight']}{(' · ' + s['letterSpacing']) if 'letterSpacing' in s else ''}</td><td style='font-weight:400'>{inline(s['usage'])}</td></tr>"
c7 = f'''
<div style="display:grid;gap:16px">
<div class="fonte"><div class="fonte__n"><span class="mono">Títulos</span><h3>IBM Plex Sans</h3><p class="suave">Peso 600, com as letras mais juntas quanto maior o tamanho. Foi desenhada para engenharia e passa seriedade técnica.</p></div>
<div class="amostra-t">Sites que resolvem o <span class="destaque">problema.</span></div></div>
<div class="fonte"><div class="fonte__n"><span class="mono">Texto corrido e botões</span><h3>Inter</h3><p class="suave">Pesos 400 e 500. Lê bem em qualquer tamanho.</p></div>
<div class="amostra-s">O texto corrido usa Inter no peso normal. Fale do problema que resolve antes da tecnologia, em frases curtas e sem exclamação.</div></div>
<div class="fonte"><div class="fonte__n"><span class="mono">Etiquetas, comandos e rótulos</span><h3>IBM Plex Mono</h3><p class="suave">Peso 400, 12 px. Comandos, nomes de arquivo, etiquetas e rótulos de campo.</p></div>
<div class="amostra-m">$ npm run build<br>proposta-landing-page.pdf<br>SERVIÇO / SITE · BLUMENAU · SC</div></div></div>
<div class="bloco"><h3>Escala</h3><div class="tw"><table><thead><tr><th>Estilo</th><th>Fonte</th><th>Tamanho / linha</th><th>Uso</th></tr></thead><tbody>{esc_rows}</tbody></table></div>
<p class="suave" style="font-size:14px">As três famílias estão no Google Fonts. Os arquivos de fonte do site novo ainda não existem.</p></div>'''

# 08 ícones
ic_h = '<div class="icones">' + ''.join(f'<div class="ic">{icon(n)}<span>{n}</span></div>' for n in icon_order) + '</div>'
c8 = f'''<div class="bloco"><h3>Ícones de serviço, com detalhe carmim</h3><div class="icones">{''.join(f'<div class="ic">{icon(n)}<span>{n}</span></div>' for n in icon_order[:10])}</div>
<p class="suave" style="font-size:14px">Cards de serviço, seções do site, posts e propostas. O <code>codigo</code> é o ícone-assinatura: o detalhe vira a barra entre os sinais &lt; &gt;.</p></div>
<div class="bloco"><h3>Ícones de interface, sem detalhe</h3><div class="icones">{''.join(f'<div class="ic">{icon(n)}<span>{n}</span></div>' for n in icon_order[10:])}</div>
<p class="suave" style="font-size:14px">Botões, menus e formulários. Sem detalhe, para não competir com o botão carmim.</p></div>
<div class="bloco"><h3>Regras</h3>{lista(['Tamanhos: 24 px (padrão), 20 px em botões e 32 ou 48 px em cards e posts. Não use abaixo de 16 px','Um detalhe carmim por ícone, nunca mais. Não pinte o ícone inteiro de vermelho','Dentro do botão principal (fundo carmim), use a versão de interface, em no carmim','Ícone novo: mesma grade, mesmo traço, 2 px de respiro nas bordas','No código, o traço usa `currentColor` para seguir a cor do texto e mudar no tema escuro'])}</div>'''

# 09 componentes
c9 = f'''<p class="suave" style="max-width:70ch">Cantos de 4 px, nada de pílula. Superfícies planas separadas por fios finos e por um tom a mais de fundo, não por sombra. A sombra suave só aparece em janelas do produto. Espaços em múltiplos de 4 px. Trocas de cor de 150 ms.</p>
<div class="bloco"><h3>Botões</h3><div class="btns"><a class="btn btn-p" href="#componentes">Pedir orçamento</a><a class="btn btn-s" href="#componentes">Ver projetos</a><button class="btn btn-c" type="button">Confirmar</button><a href="#componentes">Saiba mais</a></div>
<p class="suave" style="font-size:14px">Principal em carmim, secundário com contorno de 1 px em grafite, confirmar em floresta (só nas telas do produto). Altura mínima de 44 px. O sublinhado do link só aparece ao passar o mouse.</p></div>
<div class="bloco"><h3>Campo</h3><div class="campo"><label for="whats">whatsapp</label><input id="whats" type="tel" placeholder="(47) 90000-0000" autocomplete="off"><span class="erro">Erro: confira o número com DDD.</span></div>
<p class="suave" style="font-size:14px">Rótulo em IBM Plex Mono. No foco, o contorno vira grafite. O erro usa a cor de erro, com texto que explica o problema, e nunca o carmim.</p></div>
<div class="bloco"><h3>Cartão de serviço</h3><div class="g3">
<div class="serv">{icon('site')}<h4>Landing pages focadas em conversão</h4><p>Páginas rápidas para campanhas de tráfego pago, onde o cliente mede o retorno em leads e vendas.</p></div>
<div class="serv">{icon('sistema')}<h4>Interfaces, dashboards e MVPs</h4><p>Área de membros, portais de clientes e painéis administrativos sob medida.</p></div>
<div class="serv">{icon('codigo')}<h4>Design system</h4><p>Padronização de telas e componentes para acelerar as entregas do seu time.</p></div></div></div>
<div class="bloco"><h3>Chamada final</h3><div class="cta"><div><h3>Vamos ver o que um site resolve no seu caso?</h3><p>Escopo, prazo e preço por escrito antes de começar.</p></div><a class="btn btn-p" href="#componentes">Chamar no WhatsApp</a></div>
<p class="suave" style="font-size:14px">Uma vez por página, antes do rodapé. Faixa grafite com o botão carmim.</p></div>
<div class="bloco"><h3>Depoimento e janela do produto</h3><div class="g2"><div class="dep"><blockquote>Texto real de um cliente real, com autorização.</blockquote><span class="mono">Nome do cliente · Empresa</span></div>
<div class="janela"><div class="tb"><i></i><i></i><i></i></div><div class="co"><span class="mono">painel / pedidos</span><h4>Pedidos de hoje</h4><p class="suave" style="font-size:14px">Única parte da marca com sombra suave.</p></div></div></div>
<p class="suave" style="font-size:14px">O depoimento só entra com cliente real. Nunca com texto inventado.</p></div>'''

# fotografia
def foto(cls, key, alt, leg, sub, nao=False):
    return (f'<div><div class="foto {cls}{" nao" if nao else ""}"><img src="{PH[key]}" alt="{alt}"></div>'
            f'<div class="leg"><b>{leg}</b><span>{sub}</span></div></div>')

cfoto = f'''<div class="g3">
{foto('a','moletom',ALT_M,'Sobre algodão','O fundo da página')}
{foto('t','moletom',ALT_M,'Sobre trama','Cartões e janelas')}
{foto('g','moletom',ALT_M,'Sobre grafite','Fundo escuro e tema escuro')}
</div>
<div class="bloco"><h3>Como usar</h3><div class="par-sn"><div class="sn sim"><span class="mono">Pode</span>{lista(['Mostrar o rosto e o processo: a codimdev é uma pessoa só, e isso é um diferencial','Usar o recorte com fundo transparente sobre algodão, trama ou grafite','Legendar com o nome e o papel reais: Zacarias, desenvolvedor e designer','Um destaque em carmim por peça, sem competir com o rosto'])}</div>
<div class="sn nao"><span class="mono">Não pode</span>{lista(['Aplicar filtro de cor, gradiente, brilho ou sombra por cima da foto','Fingir ser uma agência com equipe, com fotos de banco de imagem','Inventar depoimento ou legenda'])}</div></div></div>
<div class="bloco"><h3>Arquivo</h3><p class="suave" style="max-width:70ch">Este livro usa uma foto só: o recorte do moletom bege, com fundo transparente, em 840 × 1050 px. Ela funciona sobre os três fundos da marca. Outras quatro fotos estão guardadas em <code>imagens/zacarias/</code> neste repositório, para uso futuro no site.</p></div>'''

# 10 canais
c10 = f'''<p class="suave" style="max-width:70ch">{inline(paras(canais)[0])}</p>{table_html(canais_t[0])}
<div class="bloco"><h3>Pilares de conteúdo</h3>{table_html(canais_t[1])}<p class="suave" style="font-size:14px">Regra de equilíbrio: para cada post de oferta, três posts que ensinam, mostram ou contam bastidores.</p></div>
<div class="bloco"><h3>Modelos de Instagram</h3><p class="suave" style="max-width:70ch">Post de serviço, carrossel (capa, meio e final), capa de Reels, story, capas dos destaques e post de auditoria de UX estão em <code>instagram/</code> neste repositório. Todos seguem a barra de quatro colunas em mono no topo, a grade fina de fundo e a linha carmim com a barrinha no rodapé.</p></div>'''

# 11 regras
sem = '<div class="par-sn"><div class="sn sim"><span class="mono">Sempre</span>' + lista([r[0] for r in regras[1:]]) + '</div><div class="sn nao"><span class="mono">Nunca</span>' + lista([r[1] for r in regras[1:]]) + '</div></div>'
c11 = f'''<p class="suave" style="max-width:70ch">Estas regras valem para tudo o que leva o nome codimdev: site, posts, propostas, contratos e mensagens.</p>{sem}'''

chapters = [
    ('01', 'essencia', 'Essência', 'Quem é a codimdev', 'Um estúdio de desenvolvimento web feito por uma pessoa só: do protótipo ao site no ar, sem ruído entre design e código.', c1),
    ('02', 'publico', 'Público', 'Para quem a codimdev trabalha', 'Empresas que vendem, captam ou operam pela internet e não têm tempo para virar especialistas.', c2),
    ('03', 'posicionamento', 'Posicionamento', 'O que a codimdev faz diferente', 'Mais perto de um time de uma pessoa só que de uma agência, com escopo e preço por escrito.', c3),
    ('04', 'voz', 'Voz', 'Como a codimdev fala', 'O artesão: direto, calmo e que cumpre o que combinou.', c4),
    ('05', 'logo', 'Logo', 'A logo e a barrinha', 'O nome em minúsculas, a barrinha inclinada em carmim e dois detalhes de cor.', c5),
    ('06', 'cor', 'Cor', 'Algodão, grafite e um carmim só', 'Fundo claro e quente, texto grafite e um vermelho que marca só o que importa.', c6),
    ('07', 'tipografia', 'Tipografia', 'Três famílias, três papéis', 'IBM Plex Sans nos títulos, Inter no texto, IBM Plex Mono nas etiquetas.', c7),
    ('08', 'icones', 'Ícones', 'Vinte e três ícones próprios', 'Traço de 1,75 px, pontas arredondadas, grade de 24 × 24 px. O que os torna da marca é o detalhe: uma barra inclinada em carmim, no ângulo da logo.', c8),
    ('09', 'componentes', 'Componentes', 'Planos, retos e sem brilho', 'Botões, campos e cartões de cantos retos. Nada de pílula, gradiente ou brilho.', c9),
    ('10', 'fotografia', 'Fotografia', 'O rosto por trás da codimdev', 'Uma pessoa só faz o design e o código, e a marca mostra isso.', cfoto),
    ('11', 'canais', 'Canais', 'Onde a marca aparece', 'O Instagram atrai, o WhatsApp fecha e o site serve de vitrine.', c10),
    ('12', 'regras', 'Regras', 'Sempre e nunca', 'O que vale em qualquer peça com o nome codimdev.', c11),
]

indice = '<ol class="indice">' + ''.join(f'<li><a href="#{s}"><span class="mono">{n}</span>{t}</a></li>' for n, s, t, *_ in chapters) + '</ol>'
body = ''
for n, s, t, h, lead, c in chapters:
    body += (f'<section class="cap" id="{s}"><div class="wrap"><div class="cap__topo">{barra("codimdev", "Capítulo " + n, t, "Livro da marca")}'
             f'<h2>{h}</h2><p class="lead">{lead}</p></div>{c}</div></section>\n')

HTML = f'''<title>Livro da marca codimdev</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;600&family=Inter:wght@400;500&display=swap">
<style>{CSS}</style>
<header class="capa"><div class="wrap">
{barra("codimdev", "Livro da marca", "Versão 1.0", "24/11/2026")}
<div class="logo">{logo_swap("h", alt="codimdev")}</div>
<div class="capa__grid"><div><h1>Design e código pela mesma <span class="destaque">pessoa.</span></h1>
<p class="lead">Tudo o que a codimdev decidiu sobre quem é, como fala e como aparece: para quem escreve, desenha ou programa qualquer peça com o nome da marca.</p></div>
<div class="capa__foto"><img src="{PH['moletom']}" alt="{ALT_M}"></div></div>
<div class="fio"><i></i><span class="slash"></span></div>
<nav aria-label="Capítulos">{indice}</nav>
</div></header>
<main>
{body}
</main>
<footer class="fim"><div class="wrap">
<div>{logo_swap("h", alt="codimdev")}</div>
<div class="cols"><div class="col"><span class="mono">Serviços</span><span>Landing pages</span><span>Sites institucionais</span><span>Redesign e CRO/UX</span><span>Sistemas, dashboards e MVPs</span><span>Design system</span></div>
<div class="col"><span class="mono">Contato</span><span>codimdev.com.br</span><span>contato@codimdev.com.br</span><span>Blumenau, SC · atendimento online</span></div></div>
</div></footer>
'''
os.makedirs(R + '/livro-da-marca', exist_ok=True)
open(R + '/livro-da-marca/index.html', 'w', encoding='utf-8').write(HTML)
print(len(HTML))
