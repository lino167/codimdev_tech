import './indice.css';
import { projetos, filtros, TOTAL_PROJETOS } from '../data/projetos.js';

const linha = (p) => `
<li class="linha" data-filtro="${p.filtro}" data-foto="${p.foto}">
  <a class="linha__link" href="#contato" aria-label="${p.cliente}, ${p.disciplina}">
    <span class="linha__ano numero">${p.ano ?? ''}</span>
    <span class="linha__cliente titulo">${p.cliente}</span>
    <span class="linha__disciplina">${p.disciplina}</span>
    <span class="linha__cidade">${p.tipo}</span>
    <img class="linha__mini" src="${p.foto}" alt="" loading="lazy" />
  </a>
</li>`;

export const indice = () => `
<section class="indice" id="indice" aria-labelledby="indice-titulo">
  <div class="indice__topo">
    <h2 class="indice__titulo titulo" id="indice-titulo">Todos os projetos</h2>
    <div class="filtros" role="group" aria-label="Filtrar por disciplina">
      ${filtros
        .map(
          (f, i) =>
            `<button type="button" class="pilula${i === 0 ? ' pilula--tinta' : ''}" data-filtro="${f.id}" aria-pressed="${i === 0}">${f.nome}</button>`,
        )
        .join('')}
    </div>
  </div>
  <ol class="lista">${projetos.map(linha).join('')}</ol>
  <p class="indice__conta" aria-live="polite"><span data-conta>${projetos.length}</span> de ${TOTAL_PROJETOS} projetos</p>
  <div class="indice__foto" aria-hidden="true"><img alt="" /></div>
</section>`;
