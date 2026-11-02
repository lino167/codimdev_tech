// Entrada do hero (por tempo, uma vez): a assinatura da marca no mundo. Os dois C chegam de lados opostos e
// se condensam dos pontos, os elos vermelhos fecham a ligação e soltam a rajada; os pontos saem da ligação,
// arqueiam e pousam formando "Tudo conectado.". As letras ficam sólidas de fora para dentro e, no fim, tudo
// fica sólido (o título e os C do símbolo); a rajada e o halo apagam. O pontilhado só volta sob o cursor.
// A promessa e os botões sobem durante o voo.
// Sem WebGL: o SVG do símbolo aparece e as palavras entram pelas bordas (o eco dos C).
import { gsap } from 'gsap';
import type { Mundo } from '../mundo/mundo';

const TEXTOS_RODAPE = '.hero__promessa, .hero__apoio, .hero__botoes .btn';

export function entrada({ mundo, reduzido = false }: { mundo: Mundo | null; reduzido?: boolean }) {
  const raiz = document.documentElement;
  const palavra1 = document.querySelector('.hero__titulo .w1');
  const palavra2 = document.querySelector('.hero__titulo .w2');
  const svg = document.querySelector('.hero__simbolo svg');
  const tituloNoMundo = !!mundo?.temTitulo();

  if (reduzido) {
    raiz.classList.remove('is-loading');
    mundo?.iniciarPulso();
    return gsap.timeline();
  }

  // estados iniciais ANTES de tirar o is-loading: nenhum quadro com o texto pronto
  gsap.set(TEXTOS_RODAPE, { y: 14, opacity: 0 });
  if (tituloNoMundo) {
    // o título é desenhado pelos pontos; o HTML fica transparente e PARADO (o mundo lê a posição das letras)
    gsap.set([palavra1, palavra2], { clearProps: 'transform,opacity' });
  } else {
    gsap.set(palavra1, { x: '-0.32em', opacity: 0 });
    gsap.set(palavra2, { x: '0.32em', opacity: 0 });
  }
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
      // o primeiro pulso é o "clique" da conexão; a rajada sai da ligação
      .add(() => mundo.iniciarPulso(), 1.0)
      .to(e, { alcance: 1, duration: 2.6, ease: 'expo.out' }, 0.95);
    if (tituloNoMundo) {
      // os pontos voam da ligação até as letras; depois as letras ficam sólidas de fora para dentro
      tl.fromTo(e, { voo: 0 }, { voo: 3.2, duration: 3.2, ease: 'none' }, 1.0)
        .to(e, { solido: 1, duration: 1.5, ease: 'power2.inOut' }, 2.9)
        .add(() => {
          e.voo = 99;
        });
    }
    // fim da transformação: tudo fica sólido (as bordas do título, os C do símbolo); a rajada recolhe e o halo
    // apaga. O pontilhado só volta onde o cursor passa (mundo.ts, lente).
    tl.to(e, { alcance: 0, duration: 1.2, ease: 'power2.in' }, 3.4)
      .to(e, { brilho: 0, duration: 0.9, ease: 'power2.inOut' }, 3.8)
      .to(e, { final: 1, duration: 0.9, ease: 'power2.inOut' }, 4.1)
      .to(e, { solidez: 1, duration: 0.9, ease: 'power2.inOut' }, 4.1);
  } else if (svg) {
    tl.to(svg, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.2);
  }
  if (!tituloNoMundo) {
    tl.to(palavra1, { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' }, 0.45).to(
      palavra2,
      { x: 0, opacity: 1, duration: 1.1, ease: 'expo.out' },
      0.53,
    );
  }
  tl.to(
    TEXTOS_RODAPE,
    { y: 0, opacity: 1, duration: 1.0, ease: 'expo.out', stagger: 0.07 },
    tituloNoMundo ? 2.4 : 1.05,
  );
  return tl;
}
