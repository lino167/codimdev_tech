// Entrada do hero (por tempo, uma vez): a assinatura da marca no mundo, em montagem limpa. Os dois C, já
// sólidos, chegam de lados opostos (no site, quem faz essa parte é o loader, com o download real), os elos
// vermelhos deslizam pela diagonal e travam (o clique solta uma faísca curta); os pontos saem da ligação,
// arqueiam e pousam formando "Tudo conectado.". As letras ficam sólidas de fora para dentro e, no fim, tudo
// fica sólido (o título e os C do símbolo); a rajada e o halo apagam. O pontilhado só volta sob o cursor.
// A promessa e os botões sobem durante o voo.
// Sem WebGL: o SVG do símbolo aparece e as palavras entram pelas bordas (o eco dos C).
import { gsap } from 'gsap';
import type { Mundo } from '../mundo/mundo';

const TEXTOS_RODAPE = '.hero__promessa, .hero__apoio, .hero__botoes .btn, .hero__nota';

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
    // montagem limpa: os C sólidos entram de lados opostos e encostam (sem elástico); no site, quem faz esta
    // parte é o loader, conforme os bytes chegam
    tl.to(e, { abre: 0, duration: 0.85, ease: 'power3.inOut' }, 0)
      // os elos saem do C da esquerda e deslizam pela diagonal até travar no lugar
      .to(e, { elos: 1, duration: 0.42, ease: 'expo.out' }, 0.8)
      // o clique: um pulso só e uma faísca vermelha curta; depois o halo apaga e a faísca recolhe
      .add(() => mundo.iniciarPulso(), 1.0)
      .to(e, { brilho: 1, duration: 0.25, ease: 'power2.out' }, 0.98)
      .to(e, { alcance: 1, duration: 0.5, ease: 'expo.out' }, 0.98)
      .to(e, { alcance: 0, duration: 0.8, ease: 'power2.in' }, 1.5)
      .to(e, { brilho: 0, duration: 0.8, ease: 'power2.inOut' }, 1.6);
    if (tituloNoMundo) {
      // os pontos voam da ligação até as letras; depois as letras ficam sólidas de fora para dentro
      tl.fromTo(e, { voo: 0 }, { voo: 3.2, duration: 3.2, ease: 'none' }, 1.0)
        .to(e, { solido: 1, duration: 1.5, ease: 'power2.inOut' }, 2.9)
        .add(() => {
          e.voo = 99;
        });
    }
    // fim da transformação: até as bordas do título ficam sólidas. O pontilhado só volta onde o cursor passa.
    tl.to(e, { final: 1, duration: 0.9, ease: 'power2.inOut' }, 4.1);
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
  // depois do loader os C já se condensaram e encostaram com os bytes: a entrada continua dali, nos elos
  // fechando, sem repetir a aproximação (as tweens de forma/abre partem dos valores atuais, já no fim)
  if (mundo && mundo.estado.abre < 0.02) tl.seek(PULO_APOS_LOADER);
  return tl;
}

/** Onde a entrada retoma depois do loader: logo antes de os elos deslizarem (0,8 s). */
const PULO_APOS_LOADER = 0.78;
