// Entrada do hero (por tempo, uma vez): a assinatura da marca no mundo. Os dois C chegam de lados opostos e
// se condensam dos pontos, os elos vermelhos fecham a ligação, o halo acende e o pulso começa. Ao mesmo tempo,
// "Tudo" entra pela esquerda e "conectado." pela direita (o eco dos C), e depois a promessa e os botões sobem.
// Na fatia T3, as palavras passam a ser montadas pelos pontos que saem dos elos; esta coreografia é a base.
import { gsap } from 'gsap';
import type { Mundo } from '../mundo/mundo';

const TEXTOS_RODAPE = '.hero__promessa, .hero__apoio, .hero__botoes .btn';

export function entrada({ mundo, reduzido = false }: { mundo: Mundo | null; reduzido?: boolean }) {
  const raiz = document.documentElement;
  const palavra1 = document.querySelector('.hero__titulo .w1');
  const palavra2 = document.querySelector('.hero__titulo .w2');
  const svg = document.querySelector('.hero__simbolo svg');

  if (reduzido) {
    raiz.classList.remove('is-loading');
    mundo?.iniciarPulso();
    return gsap.timeline();
  }

  // estados iniciais ANTES de tirar o is-loading: nenhum quadro com o texto pronto
  gsap.set(palavra1, { x: '-0.32em', opacity: 0 });
  gsap.set(palavra2, { x: '0.32em', opacity: 0 });
  gsap.set(TEXTOS_RODAPE, { y: 14, opacity: 0 });
  if (!mundo && svg) gsap.set(svg, { opacity: 0, scale: 0.94 });
  raiz.classList.remove('is-loading');

  const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
  if (mundo) {
    const e = mundo.estado;
    tl.to(e, { forma: 1, duration: 1.15, ease: 'power2.out' }, 0)
      // os C se aproximam e encostam (cerca de 0,6 s de assinatura, sem elástico)
      .to(e, { abre: 0, duration: 0.85, ease: 'power3.inOut' }, 0.1)
      // os elos fecham a ligação: acendem em pontilhado até ficarem sólidos
      .to(e, { elos: 1, duration: 0.32, ease: 'power2.out' }, 0.82)
      .to(e, { brilho: 1, duration: 0.6, ease: 'expo.out' }, 0.9)
      // o primeiro pulso é o "clique" da conexão
      .add(() => mundo.iniciarPulso(), 1.0);
  } else if (svg) {
    tl.to(svg, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.2);
  }
  tl.to(palavra1, { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, 0.45)
    .to(palavra2, { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, 0.53)
    .to(TEXTOS_RODAPE, { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', stagger: 0.07 }, 1.05);
  return tl;
}
