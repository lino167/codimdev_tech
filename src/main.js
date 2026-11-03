import './styles/tokens.css';
import './styles/base.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { nav } from './sections/nav.js';
import { tunel } from './sections/tunel.js';
import { estudio } from './sections/estudio.js';
import { metodo } from './sections/metodo.js';
import { indice } from './sections/indice.js';
import { contato, rodape } from './sections/contato.js';

import { criarCena } from './motion/cena.js';
import { animarPercurso } from './motion/percurso.js';
import { animarEstudio } from './motion/estudio.js';
import { animarMetodo } from './motion/metodo.js';
import { animarIndice } from './motion/indice.js';
import { animarContato } from './motion/contato.js';
import { animarNav } from './motion/nav.js';
import { iniciarSuave } from './motion/suave.js';

gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.querySelector('#app').innerHTML = `
  ${nav()}
  <main>
    ${tunel()}
    ${estudio()}
    ${metodo()}
    ${indice()}
    ${contato()}
  </main>
  ${rodape()}
`;

const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);

// 1. os pins primeiro (túnel e método), na ordem do documento
const cena = criarCena($('.tunel__canvas'), { reduzido });
gsap.ticker.add(cena.quadro);
animarPercurso($('.tunel'), cena);
animarEstudio($('.estudio'), { reduzido });
animarMetodo($('.metodo'));

// 2. o resto
animarIndice($('.indice'), { reduzido });
animarContato($('.contato'), $('.rodape'), { reduzido });
animarNav($('[data-nav]'));

// 3. só então o Lenis (sem ele com movimento reduzido)
if (!reduzido) iniciarSuave();

document.fonts?.ready.then(() => ScrollTrigger.refresh());
