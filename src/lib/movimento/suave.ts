// Rolagem suave: o Lenis é a ÚNICA suavização do site (lerp 0.09), movido pelo ticker do GSAP para o mundo e os
// ScrollTriggers lerem o mesmo scroll. Os links "#..." rolam pelo Lenis. Movimento reduzido: sem Lenis, a rolagem
// é a nativa (os links só pulam).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export interface Suave {
  /** trava a rolagem (menu aberto) */
  parar(): void;
  /** destrava */
  seguir(): void;
}

export function suave({ reduzido = false }: { reduzido?: boolean }): Suave | null {
  if (reduzido) {
    ligarAncoras(null);
    return null;
  }
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tempo) => lenis.raf(tempo * 1000));
  gsap.ticker.lagSmoothing(0);
  ligarAncoras(lenis);
  return { parar: () => lenis.stop(), seguir: () => lenis.start() };
}

function ligarAncoras(lenis: Lenis | null) {
  document.addEventListener('click', (ev) => {
    const a = (ev.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || ev.defaultPrevented) return;
    const id = a.getAttribute('href') ?? '';
    if (id.length < 2) return;
    const alvo = document.querySelector<HTMLElement>(id);
    if (!alvo) return;
    ev.preventDefault();
    if (lenis) lenis.scrollTo(alvo, { duration: 1.4 });
    else alvo.scrollIntoView();
    history.replaceState(null, '', id);
  });
}
