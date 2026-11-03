// A linha do tempo do túnel: uma timeline com scrub, presa por 11 alturas de tela.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CAMERA_Z0, PROF_DESTAQUES } from './cena.js';

const VELOCIDADE = 9; // unidades de profundidade por unidade de tempo da timeline

export function animarPercurso(secao, cena) {
  const { estado } = cena;
  const barra = secao.querySelector('.tunel__progresso span');
  const hero = secao.querySelectorAll('.tunel__frase, .tunel__marca, .tunel__dica, .tunel__local');
  const casos = [...secao.querySelectorAll('.caso')];
  const fim = secao.querySelector('.tunel__fim');

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: cena.pedir,
    scrollTrigger: {
      trigger: secao,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 11,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (st) => {
        barra.style.transform = `scaleX(${st.progress})`;
      },
    },
  });

  // 1. o hero sobe e some
  tl.to(hero, { y: -30, autoAlpha: 0, duration: 0.9, ease: 'power1.in' }, 0);

  let z = CAMERA_Z0;
  PROF_DESTAQUES.forEach((zc, i) => {
    const itens = casos[i].querySelectorAll('.caso__item');
    const antes = zc + 10;

    // viagem até 10 unidades antes do destaque
    tl.to(estado, { camZ: antes, duration: (z - antes) / VELOCIDADE }, i === 0 ? 0.2 : '>');

    // a foto sai da parede e a câmera encosta até cobrir a tela
    tl.addLabel(`puxar${i}`);
    tl.to(estado.puxar[i], { v: 1, duration: 1.3, ease: 'power2.inOut' }, `puxar${i}`);
    tl.to(estado, { camZ: () => zc + cena.distanciaCobrir(), duration: 1.3, ease: 'power2.inOut' }, `puxar${i}`);

    // a abertura do case entra, segura e sai
    tl.fromTo(
      itens,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
      '-=0.2',
    );
    tl.to({}, { duration: 1 });
    tl.to(itens, { autoAlpha: 0, y: -12, duration: 0.3, ease: 'power1.in' });

    // a câmera atravessa a foto; o puxar volta a 0 quando ela já ficou para trás
    tl.to(estado, { camZ: zc - 0.6, duration: 0.9, ease: 'power2.in' });
    tl.set(estado.puxar[i], { v: 0 });
    z = zc - 0.6;
  });

  // 3. depois do último: até o fundo e "Quatro de 41."
  tl.to(estado, { camZ: -88, duration: (z + 88) / VELOCIDADE });
  tl.fromTo(fim, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, '-=0.7');
  tl.to({}, { duration: 0.4 });

  return tl;
}
