"""Monta as imagens PROVISÓRIAS do portfólio com material real (telas, logos, quadros dos vídeos).

Enquanto as fotos geradas (03_imagens/portfolio/) não chegam, os cases, as paredes do túnel, o índice,
o Método e o céu do rodapé usam pranchas limpas: a tela ou a logo real sobre um fundo claro.

Uso, de dentro de codimdev-site/:
  python scripts/preparar-reais.py <pasta-raster> [--forcar]
<pasta-raster> tem os SVGs oficiais já rasterizados em PNG (tenua-*.png, val-logo.png, codimdev-*.png)
e os quadros dos vídeos (vinheta-4.jpg, bastidores-12.jpg, bastidores-18.jpg).
Grava em public/trabalhos/real/*.webp e regrava src/data/pecas.json.

As imagens de DEFINITIVAS já são fotos finais (originais em 03_imagens/portfolio/fotos/prontas/)
e nunca são regravadas com a prancha provisória. `--forcar` regrava tudo, inclusive elas.
"""

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

RAIZ = Path(__file__).resolve().parent.parent  # codimdev-site/
SITE = RAIZ.parent  # 06_Site/
MARCA = SITE.parent  # CodimDev/
TELAS = SITE / "03_imagens" / "telas"
ID = Path("C:/Users/Ramos/Pictures/Identidade visual")
SAIDA = RAIZ / "public" / "trabalhos" / "real"

SUPERFICIE = (245, 245, 246)
BRANCO = (255, 255, 255)
CREME = (243, 239, 232)  # fundo das peças da Tenua

# Fotos finais já no site: o script não as sobrescreve. Ao aprovar uma foto nova, acrescente o nome aqui.
DEFINITIVAS = {
    "destaque-tenua",  # sacola e caixa com o selo oficial (prontas/tenua-embalagem.png)
    "i-tenua-marca",
    "destaque-val",  # picape com a plotagem (prontas/val-carro-plotagem.png)
    "i-val",
    "destaque-marca",  # setup com o painel do Kraflo no monitor (prontas/codimdev-destaque-setup.png)
    "i-marca",  # papelaria (prontas/codimdev-destaque.png)
    "i-bot",  # celular com a tela do bot (prontas/destaque-bot.png)
    "destaque-kraflo",  # oficina com o painel real no monitor (prontas/kraflo-destaque.png)
    "i-kraflo",
}
FORCAR = False
pulados = []


def abrir(p):
    im = Image.open(p)
    return im.convert("RGBA")


def prancha(conteudo, tam, fundo=SUPERFICIE, caixa=(0.08, 0.08, 0.92, 0.92), sombra=True, alinhar=(0.5, 0.5)):
    """Encaixa `conteudo` dentro da caixa (frações de tam) sem cortar, com sombra suave opcional."""
    W, H = tam
    base = Image.new("RGB", tam, fundo)
    x0, y0, x1, y1 = (int(caixa[0] * W), int(caixa[1] * H), int(caixa[2] * W), int(caixa[3] * H))
    cw, ch = x1 - x0, y1 - y0
    esc = min(cw / conteudo.width, ch / conteudo.height)
    im = conteudo.resize((max(1, round(conteudo.width * esc)), max(1, round(conteudo.height * esc))), Image.Resampling.LANCZOS)
    px = x0 + round((cw - im.width) * alinhar[0])
    py = y0 + round((ch - im.height) * alinhar[1])
    if sombra:
        s = Image.new("RGBA", tam, (0, 0, 0, 0))
        ImageDraw.Draw(s).rectangle([px, py + 14, px + im.width, py + im.height + 14], fill=(10, 10, 11, 46))
        s = s.filter(ImageFilter.GaussianBlur(28))
        base.paste(s, (0, 0), s)
    base.paste(im, (px, py), im)
    return base


def recorte(im, prop, foco=(0.5, 0.5)):
    """Corta `im` na proporção w/h, centrado no foco."""
    w, h = im.size
    if w / h > prop:
        nw = round(h * prop)
        x = round((w - nw) * foco[0])
        return im.crop((x, 0, x + nw, h))
    nh = round(w / prop)
    y = round((h - nh) * foco[1])
    return im.crop((0, y, w, y + nh))


def aparar(im, folga=0.06):
    """Corta as margens brancas de uma imagem de fundo branco, deixando uma folga proporcional."""
    cinza = im.convert("L").point(lambda v: 255 if v < 235 else 0)
    x0, y0, x1, y1 = cinza.getbbox()
    f = round(max(x1 - x0, y1 - y0) * folga)
    return im.crop((max(0, x0 - f), max(0, y0 - f), min(im.width, x1 + f), min(im.height, y1 + f)))


def gravar(im, nome, lado_max=None, q=82):
    destino = SAIDA / f"{nome}.webp"
    if nome in DEFINITIVAS and destino.exists() and not FORCAR:
        pulados.append(nome)
        with Image.open(destino) as atual:
            return atual.size
    im = im.convert("RGB")
    if lado_max and max(im.size) > lado_max:
        im.thumbnail((lado_max, lado_max), Image.Resampling.LANCZOS)
    SAIDA.mkdir(parents=True, exist_ok=True)
    im.save(SAIDA / f"{nome}.webp", "WEBP", quality=q, method=6)
    return im.size


def main(raster):
    R = Path(raster)
    kraflo = abrir(TELAS / "kraflo-dashboard.jpg")
    tenua_hero = abrir(TELAS / "tenua" / "01-Hero.png")
    tenua_port = abrir(TELAS / "tenua" / "05-Portfolio.png")
    tenua_col = abrir(TELAS / "tenua" / "04-Colecoes.png")
    tenua_enc = abrir(TELAS / "tenua" / "06-Encomendar.png")
    bots = [abrir(TELAS / "bot" / f) for f in ("bot-1-abrir.png", "bot-2-foto.png", "bot-3-fechar.png")]
    # a assinatura com "Tudo conectado." vem do último quadro da vinheta (a página do manual tem rótulo)
    assinatura = aparar(abrir(R / "vinheta-4.jpg"))
    conceito = abrir(ID / "Tenua-BrandBook" / "novo conceito" / "conceituando.png")
    t_simb, t_logos, t_hor, t_selo = (abrir(R / f"tenua-{n}.png") for n in ("simbolo", "logos", "horizontal", "selo"))
    # PNG oficial: o SVG da Val tem texto vivo numa fonte que não está instalada
    val = abrir(ID / "Val_serviços" / "Logo_ValServicos.png")
    cd_simb = abrir(R / "codimdev-simbolo.png")
    vinheta = abrir(R / "vinheta-4.jpg")
    bast = [abrir(R / "bastidores-12.jpg"), abrir(R / "bastidores-18.jpg")]

    D = (1536, 1024)  # destaques 3:2: o conteúdo fica no alto à direita (o texto do case entra embaixo à esquerda)
    gravar(prancha(tenua_hero, D, caixa=(0.30, 0.09, 0.94, 0.62), alinhar=(1, 0)), "destaque-tenua")
    k = prancha(kraflo, D, caixa=(0.22, 0.10, 0.80, 0.60), alinhar=(1, 0))
    fone = bots[1].resize((round(bots[1].width * 600 / bots[1].height), 600), Image.Resampling.LANCZOS)
    s = Image.new("RGBA", D, (0, 0, 0, 0))
    fx, fy = 1180, 300
    ImageDraw.Draw(s).rounded_rectangle([fx, fy + 16, fx + fone.width, fy + fone.height + 16], 24, fill=(10, 10, 11, 60))
    s = s.filter(ImageFilter.GaussianBlur(26))
    k.paste(s, (0, 0), s)
    k.paste(fone, (fx, fy), fone)
    gravar(k, "destaque-kraflo")
    gravar(prancha(val, D, fundo=BRANCO, caixa=(0.52, 0.16, 0.9, 0.58), sombra=False, alinhar=(0.5, 0)), "destaque-val")
    gravar(prancha(assinatura, D, fundo=BRANCO, caixa=(0.34, 0.12, 0.94, 0.58), sombra=False), "destaque-marca")

    P = 760  # peças das paredes: 3:2, 1:1 e 4:5
    T32, T11, T45 = (P, round(P / 1.5)), (round(P * 0.66), round(P * 0.66)), (round(P * 0.53), round(P * 0.66))
    pecas = {
        "r01": prancha(kraflo, T32, caixa=(0.06, 0.12, 0.94, 0.88)),
        "r02": prancha(tenua_hero, T32, caixa=(0.06, 0.08, 0.94, 0.92)),
        "r03": recorte(tenua_port, 0.8, (0.5, 0.15)),
        "r04": prancha(bots[0], T45, caixa=(0.15, 0.06, 0.85, 0.94)),
        "r05": prancha(bots[1], T45, caixa=(0.15, 0.06, 0.85, 0.94)),
        "r06": prancha(bots[2], T45, caixa=(0.15, 0.06, 0.85, 0.94)),
        "r07": prancha(val, T11, fundo=BRANCO, caixa=(0.14, 0.14, 0.86, 0.86), sombra=False),
        "r08": prancha(t_simb, T11, fundo=CREME, caixa=(0.18, 0.18, 0.82, 0.82), sombra=False),
        "r09": prancha(t_hor, T32, fundo=BRANCO, caixa=(0.12, 0.2, 0.88, 0.8), sombra=False),
        "r10": prancha(cd_simb, T11, fundo=BRANCO, caixa=(0.18, 0.18, 0.82, 0.82), sombra=False),
        "r11": recorte(vinheta, 1.5),
        "r12": recorte(bast[0], 1.5),
        "r13": recorte(bast[1], 1.5),
        "r14": prancha(t_selo, T11, fundo=CREME, caixa=(0.14, 0.14, 0.86, 0.86), sombra=False),
        "r15": recorte(conceito, 0.8, (0.5, 0.3)),
        "r16": prancha(tenua_col, T32, caixa=(0.06, 0.08, 0.94, 0.92)),
        "r17": prancha(tenua_enc, T32, caixa=(0.06, 0.08, 0.94, 0.92)),
        "r18": prancha(t_logos, T45, fundo=CREME, caixa=(0.16, 0.1, 0.84, 0.9), sombra=False),
    }
    lista = []
    for id_, im in pecas.items():
        w, h = gravar(im, id_, lado_max=P)
        lista.append({"id": id_, "src": f"trabalhos/real/{id_}.webp", "w": w, "h": h})
    (RAIZ / "src" / "data" / "pecas.json").write_text(json.dumps(lista, indent=1) + "\n", encoding="utf-8")

    # Método: a marca da Tenua em 4 quadros 3:4 (o quadro 2 é SVG em código, no metodo.js)
    M = (900, 1200)
    gravar(recorte(conceito.crop((0, 0, conceito.width // 2, conceito.height)), 0.75, (0.5, 0.05)), "metodo-escuta", 1200)
    versoes = Image.new("RGB", M, CREME)
    for im, caixa in ((t_logos, (0.2, 0.06, 0.8, 0.5)), (t_hor, (0.1, 0.56, 0.9, 0.72)), (t_selo, (0.3, 0.76, 0.7, 0.97))):
        p = prancha(im, M, fundo=CREME, caixa=caixa, sombra=False)
        mascara = Image.new("L", M, 0)
        ImageDraw.Draw(mascara).rectangle([int(caixa[0] * M[0]), int(caixa[1] * M[1]), int(caixa[2] * M[0]), int(caixa[3] * M[1])], fill=255)
        versoes.paste(p, (0, 0), mascara)
    gravar(versoes, "metodo-sistema")
    gravar(recorte(tenua_port, 0.75, (0.5, 0.2)), "metodo-no-ar", 1200)

    # Estúdio: as duas fotos dentro da linha (crochê da Tenua e o painel do Kraflo)
    gravar(tenua_hero.crop((780, 430, 1400, 781)), "linha-croche", 600)
    gravar(kraflo.crop((0, 0, 900, 300)), "linha-painel", 600)

    # Índice: retrato 4:5, o assunto no meio
    I = (800, 1000)
    indice = {
        "i-tenua-marca": prancha(t_logos, I, fundo=CREME, caixa=(0.16, 0.12, 0.84, 0.88), sombra=False),
        "i-tenua-site": recorte(tenua_hero, 0.8, (0.2, 0.5)),
        "i-kraflo": prancha(kraflo, I, caixa=(0.06, 0.3, 0.94, 0.7)),
        "i-bot": prancha(bots[1], I, caixa=(0.2, 0.06, 0.8, 0.94)),
        "i-val": prancha(val, I, fundo=BRANCO, caixa=(0.12, 0.2, 0.88, 0.8), sombra=False),
        "i-marca": prancha(assinatura, I, fundo=BRANCO, caixa=(0.1, 0.3, 0.9, 0.7), sombra=False),
        "i-vinheta": recorte(vinheta, 0.8),
        "i-bastidores": recorte(bast[1], 0.8, (0.62, 0.5)),
    }
    for nome, im in indice.items():
        gravar(im, nome, 1000)
    # Avatar do Lino (Sobre), a partir do retrato no escritório
    retrato = Image.open(MARCA / "05_Fotos" / "Retrato profissional no escritório CODIMDEV.png").convert("RGB")
    # avatar: quadrado centrado no rosto (o círculo do site corta os cantos)
    gravar(retrato.crop((170, 0, 1010, 840)), "avatar-lino", 320, q=86)

    print(len(lista), "peças +", len(indice), "fotos do índice em", SAIDA)
    if pulados:
        print("mantidas (fotos definitivas):", ", ".join(pulados))


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if a != "--forcar"]
    FORCAR = "--forcar" in sys.argv[1:]
    main(args[0])
