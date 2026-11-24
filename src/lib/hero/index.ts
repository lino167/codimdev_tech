// O hero: onze imagens (nada de vídeo, que pesa) trocadas em fusão num canvas, dirigidas pela rolagem, simulam o movimento:
// o Zacarias, de capuz e braços cruzados, descruza, tira o capuz, revela o rosto e põe as mãos no bolso. Depois, os projetos
// sobem pelos dois lados da tela.
// - Computador: o palco fica preso (5 telas); 0-45% é a sequência de imagens, 6-12% o texto some (antes de os braços abrirem), 45-100% as colunas laterais sobem.
// - Celular: o quadro fica preso por 1,2 tela e os projetos vêm depois, em coluna, no fluxo normal.
// As imagens baixam em ordem (as duas primeiras liberam o carregador); são cerca de 70 KB cada.
// Movimento reduzido ou sem JS: o quadro final e os projetos em lista (CSS).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL = 11;
const L = 1920;
const A = 1071;
const limitar = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export interface Hero {
  /** resolve quando os primeiros quadros estão prontos */
  pronto: Promise<void>;
  /** o texto entra por tempo (chamado quando a tela do carregador se abre) */
  entrar(): void;
}

export function prepararHero({ reduzido }: { reduzido: boolean }): Hero | null {
  const sec = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = sec?.querySelector<HTMLCanvasElement>('[data-canvas]');
  const palco = sec?.querySelector<HTMLElement>('[data-palco]');
  if (!sec || !canvas || !palco) return null;
  if (reduzido) return { pronto: Promise.resolve(), entrar: () => void 0 };

  const ctx = canvas.getContext('2d');
  if (!ctx) return { pronto: Promise.resolve(), entrar: () => void 0 };
  canvas.width = L;
  canvas.height = A;
  sec.classList.add('hero--anima');

  const textos = Array.from(sec.querySelectorAll<HTMLElement>('[data-entra]'));
  const lados = Array.from(sec.querySelectorAll<HTMLElement>('[data-lado]'));
  const rolar = sec.querySelector<HTMLElement>('[data-rolar]');
  const quadro = sec.querySelector<HTMLElement>('.hero__quadro') as HTMLElement;
  const desktop = window.matchMedia('(min-width: 960px)').matches;
  gsap.set(textos, { opacity: 0 });

  // as imagens baixam em ordem; o desenho usa as duas vizinhas que já chegaram
  const quadros: (HTMLImageElement | undefined)[] = new Array(TOTAL);
  const carregar = (i: number) =>
    new Promise<void>((resolver) => {
      const im = new Image();
      im.decoding = 'async';
      im.onload = () => {
        quadros[i] = im;
        resolver();
      };
      im.onerror = () => resolver();
      im.src = `/hero/k-${i + 1}.webp`;
    });
  const proximo = (i: number, passo: number) => {
    let k = i;
    while (k >= 0 && k < TOTAL && !quadros[k]) k += passo;
    return k >= 0 && k < TOTAL ? k : -1;
  };
  let ultimo = '';
  // p vai de 0 a 1 pelas onze imagens; cada pose segura um pouco e troca em fusão suave
  const desenhar = (p: number) => {
    const pos = limitar(p) * (TOTAL - 1);
    const i = Math.min(TOTAL - 2, Math.floor(pos));
    const t = pos - i;
    const f = limitar((t - 0.2) / 0.6);
    const mistura = f * f * (3 - 2 * f);
    const a = proximo(i, -1);
    const b = proximo(i + 1, 1);
    const chave = `${a}|${b}|${mistura.toFixed(3)}`;
    if (chave === ultimo || (a < 0 && b < 0)) return;
    ultimo = chave;
    ctx.globalAlpha = 1;
    const base = quadros[a] ?? quadros[b];
    if (base) ctx.drawImage(base, 0, 0, L, A);
    if (a >= 0 && b >= 0 && a !== b && mistura > 0) {
      ctx.globalAlpha = mistura;
      ctx.drawImage(quadros[b] as HTMLImageElement, 0, 0, L, A);
      ctx.globalAlpha = 1;
    }
  };

  const primeiros = Promise.all([carregar(0), carregar(1)]).then(() => {
    desenhar(0);
    sec.classList.add('hero--pronto');
  });
  // o resto vem logo depois (uma por vez, para não brigar com o carregador)
  void primeiros.then(async () => {
    for (let i = 2; i < TOTAL; i++) await carregar(i);
    ultimo = '';
    ScrollTrigger.refresh();
  });

  if (desktop) {
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    // 0-45%: o vídeo; 38-50%: o texto some; 45-100%: as colunas laterais sobem sem cobrir a pessoa
    tl.to({}, { duration: 0.45 }, 0);
    tl.to(textos, { opacity: 0, y: -24, duration: 0.06 }, 0.06);
    if (rolar) tl.to(rolar, { opacity: 0, duration: 0.04 }, 0.02);
    lados.forEach((lado) => {
      tl.fromTo(lado, { y: 0 }, { y: () => -0.86 * window.innerHeight, duration: 0.55 }, 0.45);
    });
    ScrollTrigger.create({
      trigger: palco,
      start: 'top top',
      end: '+=520%',
      pin: true,
      scrub: 0.5,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      animation: tl,
      onUpdate: (self) => desenhar(self.progress / 0.45),
    });
  } else {
    ScrollTrigger.create({
      trigger: quadro,
      start: 'top top',
      end: '+=120%',
      pin: true,
      scrub: 0.4,
      onUpdate: (self) => desenhar(self.progress),
    });
  }

  return {
    pronto: primeiros,
    entrar() {
      gsap.fromTo(
        textos,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.14, delay: 0.2, ease: 'expo.out' },
      );
    },
  };
}
