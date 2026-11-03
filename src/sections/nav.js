import './nav.css';
import letreiro from '../brand/letreiro.svg?raw';

export const nav = () => `
<header class="nav" data-nav>
  <a class="nav__marca" href="#topo" aria-label="CodimDev, voltar ao início">${letreiro}</a>
  <nav class="nav__links" aria-label="Principal">
    <a class="pilula" href="#indice">Projetos</a>
    <a class="pilula" href="#sobre">Sobre</a>
    <a class="pilula" href="#contato">Contato</a>
  </nav>
</header>`;
