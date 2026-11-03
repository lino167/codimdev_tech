// Método: a seção fica presa por 2,6 telas; o scroll desliza a tira para o quadro ativo passar pelo centro.
import { gsap } from 'gsap';
import { etapas } from '../sections/metodo.js';

export function animarMetodo(secao) {
  const tira = secao.querySelector('.metodo__tira');
  const quadros = [...secao.querySelectorAll('.quadro')];
  const passos = [...secao.querySelectorAll('.etapa')];
  const cheio = secao.querySelector('.regua__cheio');
  const fraseCelular = secao.querySelector('.regua__frase');
  const ultimo = quadros.length - 1;
  let ativo = -1;

  const setX = gsap.quickSetter(tira, 'x', 'px');

  function atualizar(p) {
    const V = window.innerWidth;
    const w = quadros[0].offsetWidth;
    const pad = quadros[0].offsetLeft;
    const T = tira.scrollWidth;
    const k = p * ultimo;
    // o centro do quadro k passa pelo centro da tela, sem deixar vazio nas pontas
    const centro = pad + k * w + w / 2;
    setX(Math.min(0, Math.max(-(T - V), V / 2 - centro)));
    cheio.style.transform = `scaleX(${p})`;

    const agora = Math.round(k);
    if (agora !== ativo) {
      ativo = agora;
      quadros.forEach((q, i) => q.classList.toggle('is-ativo', i === ativo));
      passos.forEach((s, i) => s.classList.toggle('is-ativa', i === ativo));
      fraseCelular.textContent = etapas[ativo].frase;
    }
  }

  gsap.timeline({
    scrollTrigger: {
      trigger: secao,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 2.6,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (st) => atualizar(st.progress),
      onRefresh: (st) => atualizar(st.progress),
    },
  });

  atualizar(0);
}
