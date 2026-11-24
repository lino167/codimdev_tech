// Carregador da codimdev. O símbolo da logo é DESENHADO em traço fino conforme o progresso REAL (carga.ts: bytes das
// fontes e do JS e do CSS que já chegaram), nunca um timer; o número nunca volta. Tempo mínimo de 1,1 s; limite de
// 9 s em rede lenta (60 s no ?hd). Em 100%: o corpo se preenche, a barrinha carmim risca o símbolo e TRAVA no lugar
// (o clique), o contador sai e a tela se abre para cima sobre a página já pronta, sem quadro em branco no meio.
// Rolagem travada durante a carga, sem esconder a barra. Movimento reduzido: sem carregador, só espera as fontes.
import { gsap } from 'gsap';
import type { Carga } from './carga';
import { ARQUIVOS_FONTES } from './carga';

const TEMPO_MIN = 1.1; // com cache, o símbolo ainda se desenha sem piscar
const ESPERA_MAX = 9; // rede lenta: depois disso segue com o que tiver
const ESPERA_MAX_HD = 60;

declare global {
  interface Window {
    /** id do setTimeout de segurança do <head> (Base.astro): o carregador o cancela ao começar */
    __seguranca?: number;
  }
}

export function loader({
  carga,
  hd = false,
  reduzido = false,
}: {
  carga: Carga;
  hd?: boolean;
  reduzido?: boolean;
}): Promise<void> {
  const raiz = document.documentElement;
  if (window.__seguranca) clearTimeout(window.__seguranca);
  const el = document.querySelector<HTMLElement>('[data-loader]');

  // movimento reduzido (ou sem o bloco): nada de carregador; a página aparece depois das fontes (no máximo 3 s)
  if (!el || reduzido) {
    return Promise.race([carga.pronta, new Promise<void>((r) => setTimeout(r, 3000))]).then(() => {
      raiz.classList.remove('is-loading');
      el?.remove();
    });
  }

  const numero = el.querySelector<HTMLElement>('[data-loader-n]');
  const corpo = el.querySelector<SVGPathElement>('.loader__corpo');
  const barra = el.querySelector<SVGPathElement>('.loader__barra');
  const etiqueta = el.querySelector<HTMLElement>('.loader__etiqueta');
  const destravar = bloquearRolagem();

  // o contador aparece já na fonte dele (a IBM Plex Mono é a primeira a descer)
  void carga.arquivo(ARQUIVOS_FONTES[0]).then(() => el.classList.add('is-on'));
  gsap.set(corpo, { strokeDashoffset: 1 });
  gsap.set(barra, { opacity: 0 });

  let pronto = false;
  void carga.pronta.then(() => {
    pronto = true;
  });

  const t0 = performance.now();
  const mostrado = { v: 0 };
  let ultimo = -1;

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
      }
      // o traço do símbolo acompanha o número
      if (corpo) corpo.style.strokeDashoffset = String(1 - easeSaida(mostrado.v));
      if (mostrado.v >= 1 && (pronto || limite)) {
        gsap.ticker.remove(passo);
        sair();
      }
    };
    gsap.ticker.add(passo);

    function sair() {
      destravar();
      // o bloco continua visível enquanto a tela sobe, mesmo depois de is-loading sair do <html>
      el?.classList.add('loader--saindo');
      gsap
        .timeline({
          onComplete: () => {
            el?.remove();
          },
        })
        // o corpo se preenche e a barrinha risca o símbolo na diagonal e trava (o clique, 120 ms)
        .to(corpo, { fill: 'currentColor', duration: 0.18, ease: 'power1.out' }, 0)
        .fromTo(
          barra,
          { opacity: 0, x: -160, y: 160 },
          { opacity: 1, x: 0, y: 0, duration: 0.12, ease: 'power4.out' },
          0.12,
        )
        .to(etiqueta, { opacity: 0, y: -6, duration: 0.25, ease: 'power3.in' }, 0.2)
        // a página (já pronta embaixo) aparece e a tela se abre para cima em 0,7 s
        .add(() => {
          raiz.classList.remove('is-loading');
        }, 0.42)
        .add(() => resolver(), 0.5)
        .to(el, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' }, 0.42);
    }
  });
}

const easeSaida = (x: number) => 1 - Math.pow(1 - x, 2);

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
