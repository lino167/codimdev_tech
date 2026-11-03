// Depoimento: fotos com parallax na proporção da profundidade. Rodapé: o wordmark sobe por baixo com o scroll.
import { gsap } from 'gsap';

export function animarContato(secao, rodape, { reduzido }) {
  if (reduzido) return;

  secao.querySelectorAll('.ceu__foto').forEach((f) => {
    const prof = Number(f.dataset.prof);
    gsap.fromTo(
      f,
      { y: 160 * prof },
      {
        y: -160 * prof,
        ease: 'none',
        scrollTrigger: { trigger: secao, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  gsap.from(rodape.querySelector('.rodape__marca-in'), {
    yPercent: 60,
    ease: 'none',
    scrollTrigger: { trigger: rodape.querySelector('.rodape__marca'), start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}
