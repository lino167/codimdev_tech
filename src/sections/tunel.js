import './tunel.css';
import letreiro from '../brand/letreiro.svg?raw';
import { casos, metaDoCaso } from '../data/casos.js';
import { TOTAL_PROJETOS } from '../data/projetos.js';

const doisDigitos = (n) => String(n).padStart(2, '0');
const POR_EXTENSO = ['Zero', 'Um', 'Dois', 'Três', 'Quatro', 'Cinco', 'Seis'];

const caso = (c, i, total) => `
<article class="caso" data-caso="${i}" aria-label="${c.cliente}">
  <div class="caso__nevoa caso__item" aria-hidden="true"></div>
  <span class="caso__num numero caso__item">${doisDigitos(i + 1)} / ${doisDigitos(total)}</span>
  <div class="caso__base">
    <div class="caso__texto">
      <p class="caso__meta caso__item">${metaDoCaso(c)}</p>
      <h2 class="caso__nome titulo caso__item">${c.cliente}</h2>
      <p class="caso__resumo caso__item">${c.resumo}</p>
    </div>
    <a class="pilula pilula--tinta caso__abrir caso__item" href="#indice">Ver o projeto →</a>
  </div>
</article>`;

export const tunel = () => `
<section class="tunel" id="topo" aria-labelledby="tunel-frase">
  <canvas class="tunel__canvas" aria-hidden="true"></canvas>
  <div class="tunel__hero">
    <h1 class="tunel__frase titulo" id="tunel-frase">Sites, sistemas e marcas<br />que trabalham por <em>você.</em></h1>
    <div class="tunel__marca" aria-hidden="true">${letreiro}</div>
    <p class="tunel__dica"><span>Role para entrar</span></p>
    <p class="tunel__local"><span>Lino · engenheiro de software, design e motion · Blumenau</span></p>
  </div>
  <div class="tunel__casos">${casos.map((c, i) => caso(c, i, casos.length)).join('')}</div>
  <div class="tunel__fim">
    <p class="tunel__fim-texto titulo">${POR_EXTENSO[casos.length] ?? casos.length} de ${TOTAL_PROJETOS}.</p>
    <a class="pilula pilula--tinta" href="#indice">Ver todos os projetos</a>
  </div>
  <div class="tunel__progresso" aria-hidden="true"><span></span></div>
</section>`;
