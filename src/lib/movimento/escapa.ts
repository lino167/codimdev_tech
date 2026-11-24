// Cena 02: três frases do dono em cinza. Quando cada uma chega à tela, a barrinha carmim RISCA a parte que falha
// (o risco anda da esquerda para a direita, com a barrinha na ponta) e a frase escurece. Movimento reduzido: já riscadas.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function escapa(reduzido: boolean) {
  document.querySelectorAll<HTMLElement>('[data-frase-risca]').forEach((frase) => {
    const falha = frase.querySelector<HTMLElement>('[data-falha]');
    if (!falha) return;
    if (reduzido) {
      falha.style.setProperty('--r', '1');
      frase.style.color = 'var(--color-grafite)';
      return;
    }
    ScrollTrigger.create({
      trigger: frase,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        gsap
          .timeline({ delay: 0.55 })
          .to(falha, { '--r': 1, duration: 0.9, ease: 'power2.inOut' })
          .to(frase, { color: '#18191D', duration: 0.5, ease: 'power1.out' }, '-=0.25');
      },
    });
  });
}
