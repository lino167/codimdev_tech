// O hero: um retrato do Zacarias num estúdio escuro. Ao rolar, a imagem faz só um zoom suave em direção ao rosto (nada de
// trocar de imagem); depois do zoom, os projetos sobem pelos dois lados da tela, sem cobrir a pessoa.
// - Computador: o palco fica preso (5 telas); 0-45% é o zoom, 20-30% o texto some, 45-100% as colunas laterais sobem.
// - Celular: o quadro fica preso por 1,2 tela com o zoom e os projetos vêm depois, em coluna, no fluxo normal.
// Movimento reduzido ou sem JS: a imagem parada e os projetos em lista (CSS).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ZOOM = 1.45; // quanto a imagem cresce até o fim do zoom

export interface Hero {
  /** resolve quando a imagem está pronta */
  pronto: Promise<void>;
  /** o texto entra por tempo (chamado quando a tela do carregador se abre) */
  entrar(): void;
}

export function prepararHero({ reduzido }: { reduzido: boolean }): Hero | null {
  const sec = document.querySelector<HTMLElement>('[data-hero]');
  const palco = sec?.querySelector<HTMLElement>('[data-palco]');
  const zoom = sec?.querySelector<HTMLElement>('[data-zoom]');
  const imagem = sec?.querySelector<HTMLImageElement>('[data-imagem]');
  if (!sec || !palco || !zoom || !imagem) return null;
  if (reduzido) return { pronto: Promise.resolve(), entrar: () => void 0 };
  sec.classList.add('hero--anima');

  const textos = Array.from(sec.querySelectorAll<HTMLElement>('[data-entra]'));
  const lados = Array.from(sec.querySelectorAll<HTMLElement>('[data-lado]'));
  const rolar = sec.querySelector<HTMLElement>('[data-rolar]');
  const quadro = sec.querySelector<HTMLElement>('.hero__quadro') as HTMLElement;
  const desktop = window.matchMedia('(min-width: 960px)').matches;
  gsap.set(textos, { opacity: 0 });

  // a imagem precisa estar decodificada antes de a tela abrir
  const pronto = (imagem.complete ? Promise.resolve() : new Promise<void>((r) => (imagem.onload = () => r()))).then(
    () => imagem.decode().catch(() => undefined),
  );

  if (desktop) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    // 0-45%: o zoom; 20-30%: o texto some; 45-100%: as colunas laterais sobem
    tl.fromTo(zoom, { scale: 1 }, { scale: ZOOM, duration: 0.45 }, 0);
    tl.to(textos, { opacity: 0, y: -24, duration: 0.1 }, 0.2);
    if (rolar) tl.to(rolar, { opacity: 0, duration: 0.04 }, 0.02);
    lados.forEach((lado) => {
      tl.fromTo(lado, { y: 0 }, { y: () => -0.86 * window.innerHeight, duration: 0.55 }, 0.45);
    });
    ScrollTrigger.create({
      trigger: palco,
      start: 'top top',
      end: '+=520%',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: tl,
    });
  } else {
    gsap.fromTo(
      zoom,
      { scale: 1 },
      {
        scale: ZOOM,
        ease: 'none',
        scrollTrigger: { trigger: quadro, start: 'top top', end: '+=120%', pin: true, scrub: 0.8 },
      },
    );
  }

  return {
    pronto,
    entrar() {
      gsap.fromTo(
        textos,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.14, delay: 0.2, ease: 'expo.out' },
      );
    },
  };
}
