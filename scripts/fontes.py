# Gera as fontes do site em public/fonts/ (só latim, woff2). Rode da raiz do codimdev-site:
#   python scripts/fontes.py
# Precisa de: pip install fonttools brotli  e  npm install (traz @fontsource/inter e @fontsource/jetbrains-mono).
#
# - Archivo: instância ESTÁTICA (largura 75, peso 800) cortada da variável de 07_Motion. O canvas 2D não
#   aplica o eixo wdth de forma confiável, então o mundo desenha o título com esta face pelo nome
#   "Archivo Condensada" (registrada pelo carga.ts).
# - Inter 400/600 e JetBrains Mono 500: os woff2 de latim do Fontsource, copiados como estão.
# Todas são OFL.
import io
import os
import shutil

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, 'public', 'fonts')
ARCHIVO = os.path.join(RAIZ, '..', '..', '07_Motion', 'public', 'fontes', 'Archivo.ttf')
LATIM = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212'

os.makedirs(SAIDA, exist_ok=True)

# 1. Archivo condensada 800
fonte = TTFont(ARCHIVO)
estatica = instancer.instantiateVariableFont(fonte, {'wght': 800, 'wdth': 75}, updateFontNames=False)
nome = estatica['name']
for rec in list(nome.names):
    if rec.nameID in (1, 16):
        rec.string = 'Archivo Condensada'
    elif rec.nameID in (2, 17):
        rec.string = 'Regular'
    elif rec.nameID in (4,):
        rec.string = 'Archivo Condensada'
    elif rec.nameID == 6:
        rec.string = 'ArchivoCondensada-ExtraBold'
estatica['OS/2'].usWeightClass = 800
estatica['OS/2'].usWidthClass = 3  # condensed
buf = io.BytesIO()
estatica.save(buf)  # em memória: no Windows, um .ttf temporário fica preso pelo processo
buf.seek(0)

opts = subset.Options(flavor='woff2', layout_features=['kern', 'liga', 'calt', 'tnum', 'lnum'], name_IDs=[1, 2, 3, 4, 5, 6, 16, 17])
f = TTFont(buf)
s = subset.Subsetter(opts)
s.populate(unicodes=subset.parse_unicodes(LATIM))
s.subset(f)
subset.save_font(f, os.path.join(SAIDA, 'archivo-condensada-800.woff2'), opts)

# 2. Inter e JetBrains Mono (Fontsource)
FS = os.path.join(RAIZ, 'node_modules', '@fontsource')
for origem, destino in [
    ('inter/files/inter-latin-400-normal.woff2', 'inter-400.woff2'),
    ('inter/files/inter-latin-600-normal.woff2', 'inter-600.woff2'),
    ('jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2', 'jetbrains-mono-500.woff2'),
]:
    shutil.copyfile(os.path.join(FS, origem), os.path.join(SAIDA, destino))

for arq in sorted(os.listdir(SAIDA)):
    if arq.endswith('.woff2'):
        print(f'{arq:32s} {os.path.getsize(os.path.join(SAIDA, arq)) / 1024:6.1f} KB')
