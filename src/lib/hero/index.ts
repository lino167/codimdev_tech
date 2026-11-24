// O hero: prepara as partículas (imagens e pontos) enquanto o carregador roda e, quando a tela se abre, conta a história:
// o nome se escreve, desmancha e vira o retrato. Sem WebGL2, com movimento reduzido, economia de dados ou aparelho fraco,
// o hero fica com a foto parada (nunca uma tela vazia). `?pronto` pula direto para o retrato montado.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { alvoLogo, alvoRetrato } from './alvos';
import { criarParticulas, type Particulas } from './particulas';

gsap.registerPlugin(ScrollTrigger);

export interface Hero {
  /** resolve quando as partículas estão prontas (ou quando se sabe que ficou a foto) */
  pronto: Promise<void>;
  /** começa a história (chamado quando a tela do carregador se abre) */
  entrar(): void;
}

export function prepararHero({ reduzido }: { reduzido: boolean }): Hero | null {
  const sec = document.querySelector<HTMLElement>('[data-hero]');
  const canvas = sec?.querySelector<HTMLCanvasElement>('[data-canvas]');
  const textos = sec ? Array.from(sec.querySelectorAll<HTMLElement>('[data-entra]')) : [];
  if (!sec || !canvas) return null;

  const pronto$ = new URLSearchParams(location.search).has('pronto');
  const conexao = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const fraco = Boolean(conexao?.saveData) || (navigator.hardwareConcurrency ?? 8) <= 2;
  const celular = window.innerWidth <= 700;
  // `?particulas` mantém a nuvem mesmo com FPS baixo (para testar em máquina sem GPU)
  const forcar = new URLSearchParams(location.search).has('particulas');

  // o texto entra por tempo (por baixo da história das partículas); sem partículas, entra logo
  const mostrarTexto = (atraso: number) => {
    gsap.fromTo(
      textos,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, delay: atraso, ease: 'expo.out' },
    );
  };
  const semParticulas = () => {
    sec.classList.add('hero--foto');
    canvas.remove();
  };
  if (reduzido || fraco) {
    semParticulas();
    return { pronto: Promise.resolve(), entrar: () => void 0 };
  }

  gsap.set(textos, { opacity: 0 });
  let particulas: Particulas | null = null;
  let tela: Promise<void>;
  const preparar = async () => {
    const aspecto = sec.clientWidth / sec.clientHeight || 1.6;
    let n = celular ? 120_000 : 300_000;
    const [logo, retrato] = await Promise.all([
      Promise.resolve(alvoLogo(n, aspecto)),
      alvoRetrato(n, aspecto, '/img/zacarias.webp'),
    ]);
    particulas = criarParticulas(canvas, logo, retrato, n);
    if (!particulas) throw new Error('webgl');
    sec.classList.add('hero--webgl');
    // mouse e toque
    const mexer = (e: PointerEvent) => particulas?.mouse(e.clientX, e.clientY, true);
    sec.addEventListener('pointermove', mexer, { passive: true });
    sec.addEventListener('pointerleave', () => particulas?.mouse(0, 0, false));
    window.addEventListener('resize', () => particulas?.redimensionar());
    // ao rolar, a nuvem recua
    ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        if (particulas) particulas.estado.recuo = self.progress;
      },
    });
    n = 0;
  };
  tela = preparar().catch(() => semParticulas());

  return {
    pronto: tela,
    entrar() {
      void tela.then(() => {
        if (!particulas) {
          mostrarTexto(0.1);
          return;
        }
        const e = particulas.estado;
        if (pronto$) {
          e.chegada = 1;
          e.morfismo = 1;
          mostrarTexto(0);
          return;
        }
        const tl = gsap.timeline();
        tl.to(e, { chegada: 1, duration: 1.6, ease: 'none' }, 0.2);
        tl.to(e, { morfismo: 1, duration: 1.8, ease: 'none' }, 2.1); // 0,3 s de pausa depois de escrever o nome
        mostrarTexto(3.2);
        // plano B: se o FPS médio ficar abaixo de 40 nos primeiros 2 s, a nuvem cai para a foto
        window.setTimeout(() => {
          if (!forcar && particulas && particulas.fps() < 28) {
            particulas.destruir();
            particulas = null;
            tl.kill();
            semParticulas();
            gsap.set(textos, { opacity: 1, y: 0 });
          }
        }, 2600);
      });
    },
  };
}
