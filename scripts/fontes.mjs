// Copia as fontes do site para public/fonts/ (latim, woff2, licença OFL) a partir do Fontsource.
// Rode da raiz: npm run fontes   (precisa de npm install). Quem registra as fontes no navegador é o carga.ts.
import { copyFileSync, mkdirSync } from 'node:fs';

const origem = 'node_modules/@fontsource';
const arquivos = {
  [`${origem}/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2`]: 'ibm-plex-sans-400.woff2',
  [`${origem}/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2`]: 'ibm-plex-sans-600.woff2',
  [`${origem}/inter/files/inter-latin-400-normal.woff2`]: 'inter-400.woff2',
  [`${origem}/inter/files/inter-latin-500-normal.woff2`]: 'inter-500.woff2',
  [`${origem}/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2`]: 'ibm-plex-mono-400.woff2',
};
mkdirSync('public/fonts', { recursive: true });
for (const [de, para] of Object.entries(arquivos)) copyFileSync(de, `public/fonts/${para}`);
console.log(`${Object.keys(arquivos).length} fontes copiadas para public/fonts/`);
