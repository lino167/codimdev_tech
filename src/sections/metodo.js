import './metodo.css';
import { caminhos, COR_TENUA } from '../data/tenua-simbolo.js';

// O Método conta um projeto real: a marca da Tenua, da logo antiga ao site no ar.
export const etapas = [
  { num: '01', nome: 'Escuta', frase: 'A logo antiga não dizia nada. Primeiro, ouvir o ateliê.' },
  { num: '02', nome: 'Símbolo', frase: 'Uma linha só, que é abraço e trama ao mesmo tempo.' },
  { num: '03', nome: 'Sistema', frase: 'Versões, selo e cor para a marca andar sozinha.' },
  { num: '04', nome: 'No ar', frase: 'O site mostra as peças e recebe as encomendas.' },
];

// Quadro 2: o símbolo oficial da Tenua desenhado em código (os caminhos do SVG dela).
const simboloEmCodigo = () => `
<svg class="quadro__simbolo" viewBox="0 0 1200 1200" role="img" aria-label="O símbolo da Tenua: uma linha que forma um abraço e uma trama">
  <rect width="1200" height="1200" fill="#f3efe8" />
  <g fill="${COR_TENUA}">${caminhos.map((d) => `<path d="${d}" />`).join('')}</g>
</svg>`;

const quadros = [
  `<img src="/trabalhos/real/metodo-escuta.webp" alt="A logo antiga da Tenua e por que ela não funcionava" loading="lazy" />`,
  simboloEmCodigo(),
  `<img src="/trabalhos/real/metodo-sistema.webp" alt="As versões da marca Tenua: vertical, horizontal e selo" loading="lazy" />`,
  `<img src="/trabalhos/real/metodo-no-ar.webp" alt="O site da Tenua no ar, com o portfólio de peças" loading="lazy" />`,
];

export const metodo = () => `
<section class="metodo" id="metodo" aria-labelledby="metodo-titulo">
  <div class="metodo__palco">
    <h2 class="metodo__titulo titulo" id="metodo-titulo">Como a marca da Tenua nasceu</h2>
    <div class="metodo__janela">
      <div class="metodo__tira">
        ${quadros.map((q, i) => `<figure class="quadro" data-quadro="${i}">${q}</figure>`).join('')}
      </div>
    </div>
    <div class="regua">
      <div class="regua__fio"><span class="regua__cheio"></span></div>
      <ol class="regua__etapas">
        ${etapas
          .map(
            (e, i) => `
        <li class="etapa${i === 0 ? ' is-ativa' : ''}" data-etapa="${i}">
          <span class="etapa__marca" aria-hidden="true"></span>
          <span class="etapa__nome"><span class="numero">${e.num}</span> ${e.nome}</span>
          <span class="etapa__frase">${e.frase}</span>
        </li>`,
          )
          .join('')}
      </ol>
      <p class="regua__frase" aria-hidden="true">${etapas[0].frase}</p>
    </div>
  </div>
</section>`;
