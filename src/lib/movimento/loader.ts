// Loader "conectando" (técnica estudada na template Sinal; código próprio).
// No mesmo canvas, os dois C do símbolo (já sólidos) entram de lados opostos conforme os bytes chegam de verdade
// (carga.ts); embaixo, o contador "CONECTANDO 64%". Em 100% os C estão encostados e a entrada (entrada.ts)
// continua dali: os elos fecham e os pontos voam. Sem corte, sem quadro em branco. Rolagem bloqueada até lá.
// Movimento reduzido ou sem WebGL: tela branca própria com o contador, que some por fusão.
// ?hd: segura até todas as imagens baixarem (para gravar vídeo), com limite de 60 s.
import { gsap } from 'gsap';
import type { Mundo } from '../mundo/mundo';
import type { Carga } from './carga';
import { ARQUIVOS_FONTES } from './carga';

const TEMPO_MIN = 0.8; // com cache, os C ainda se aproximam sem piscar
const ESPERA_MAX = 9; // rede lenta: depois disso segue com o que tiver
const ESPERA_MAX_HD = 60;

declare global {
  interface Window {
    /** id do setTimeout de segurança do <head> (Base.astro): o loader o cancela ao começar */
    __seguranca?: number;
    /** registro do progresso, para os testes de rede lenta */
    __carga?: { log: { t: number; mostrado: number; real: number }[]; entradaEm: number | null; pronto?: boolean };
  }
}

export function loader({
  mundo,
  carga,
  hd = false,
  reduzido = false,
}: {
  mundo: Mundo | null;
  carga: Carga;
  hd?: boolean;
  reduzido?: boolean;
}): Promise<void> {
  if (window.__seguranca) clearTimeout(window.__seguranca);
  const el = document.querySelector<HTMLElement>('[data-loader]');
  if (!el) return Promise.resolve();
  const numero = el.querySelector<HTMLElement>('[data-loader-n]');
  const rotulo = el.querySelector<HTMLElement>('[data-loader-rotulo]');
  const etiqueta = el.querySelector<HTMLElement>('.loader__etiqueta');
  const destravar = bloquearRolagem();
  const fusao = reduzido || !mundo;
  if (fusao) el.classList.add('loader--fusao');
  if (hd && rotulo) rotulo.textContent = el.dataset.rotuloHd ?? rotulo.textContent;

  // o contador fica embaixo do símbolo, onde o mundo o desenha
  const posicionar = () => {
    if (!mundo || fusao) return;
    const n = mundo.nucleo();
    el.style.setProperty('--lx', `${n.x}px`);
    el.style.setProperty('--ly', `${n.y + n.r * 2.9 - window.scrollY}px`);
  };
  posicionar();
  window.addEventListener('resize', posicionar);
  // a marca de antes do JS sai; o canvas assume
  const boot = document.querySelector<HTMLElement>('.loader__boot');
  if (boot) gsap.to(boot, { opacity: 0, duration: 0.3, ease: 'power1.out', onComplete: () => boot.remove() });
  // o contador aparece já com a própria fonte (a JetBrains Mono é a primeira a descer)
  void carga.arquivo(ARQUIVOS_FONTES[0]).then(() => el.classList.add('is-on'));

  let pronto = false;
  void carga.pronta.then(() => {
    pronto = true;
  });

  const t0 = performance.now();
  const mostrado = { v: 0 };
  let ultimo = -1;
  window.__carga = { log: [], entradaEm: null };

  return new Promise((resolver) => {
    const passo = () => {
      const t = (performance.now() - t0) / 1000;
      const pr = carga.progresso();
      const limite = t > (hd ? ESPERA_MAX_HD : ESPERA_MAX);
      const real = pronto ? 1 : Math.min(pr.p, 0.995);
      const alvo = Math.min(limite ? 1 : real, t / TEMPO_MIN);
      // nunca volta: o total pode crescer quando chega o tamanho real de um arquivo maior que a estimativa
      mostrado.v += Math.max(0, alvo - mostrado.v) * (limite ? 0.25 : 0.2);
      if (alvo >= 1 && mostrado.v > 0.996) mostrado.v = 1;
      const k = Math.floor(mostrado.v * 100);
      if (k !== ultimo) {
        ultimo = k;
        if (numero) numero.textContent = String(k);
        el.setAttribute('aria-valuenow', String(k));
        window.__carga?.log.push({ t: +t.toFixed(3), mostrado: k, real: +pr.p.toFixed(3) });
      }
      if (mundo && !reduzido) {
        // os C sólidos entram de lados opostos com a carga (a entrada continua desse mesmo valor)
        mundo.estado.abre = 1 - easeInOut(mostrado.v);
      }
      if (mostrado.v >= 1 && (pronto || limite)) {
        gsap.ticker.remove(passo);
        if (window.__carga) {
          window.__carga.entradaEm = +t.toFixed(3);
          window.__carga.pronto = pronto;
        }
        sair();
      }
    };
    gsap.ticker.add(passo);

    function sair() {
      window.removeEventListener('resize', posicionar);
      destravar();
      const fim = () => el?.remove();
      if (fusao) {
        resolver();
        gsap.to(el, { opacity: 0, duration: 0.6, ease: 'power1.inOut', onComplete: fim });
        return;
      }
      // o contador sai e a entrada começa logo depois, dos valores em que o loader parou
      gsap
        .timeline({ onComplete: fim })
        .to(etiqueta, { opacity: 0, y: -6, duration: 0.28, ease: 'power3.in' }, 0)
        .add(resolver, 0.1);
    }
  });
}

const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);

/** Bloqueia a rolagem sem esconder a barra (esconder muda a largura da tela e o layout pula ao liberar). */
function bloquearRolagem() {
  const teclas = new Set([' ', 'PageDown', 'PageUp', 'End', 'Home', 'ArrowDown', 'ArrowUp']);
  const parar = (e: Event) => e.preventDefault();
  const tecla = (e: KeyboardEvent) => {
    if (teclas.has(e.key)) e.preventDefault();
  };
  const topo = () => {
    if (window.scrollY) window.scrollTo(0, 0);
  };
  const op: AddEventListenerOptions = { passive: false };
  window.addEventListener('wheel', parar, op);
  window.addEventListener('touchmove', parar, op);
  window.addEventListener('keydown', tecla);
  window.addEventListener('scroll', topo);
  return () => {
    window.removeEventListener('wheel', parar, op);
    window.removeEventListener('touchmove', parar, op);
    window.removeEventListener('keydown', tecla);
    window.removeEventListener('scroll', topo);
  };
}
