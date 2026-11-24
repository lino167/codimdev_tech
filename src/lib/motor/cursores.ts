// O motor, parte 1: os dois cursores da codimdev. `design` (seta grafite) risca e mede; `código` (barrinha grafite)
// escreve e preenche. Ficam num contêiner absoluto do <body> (coordenadas do documento, não da janela), com
// pointer-events: none, e saem pelas bordas. No fim da página eles se fundem na barrinha carmim (fusao.ts, depois).
import { gsap } from 'gsap';

export type Tipo = 'design' | 'codigo';

export interface Cursor {
  el: HTMLElement;
  tipo: Tipo;
  /** posição atual (coordenadas do documento) */
  pos(): { x: number; y: number };
  /** põe o cursor fora da tela, na borda mais próxima de (x, y), e o traz até (x, y) */
  entrar(x: number, y: number, dur?: number): gsap.core.Timeline;
  /** leva o cursor até (x, y) em curva */
  ir(x: number, y: number, dur?: number): gsap.core.Tween;
  /** sai pela borda direita (ou esquerda) e some */
  sair(dur?: number): gsap.core.Timeline;
}

const SETA =
  '<svg viewBox="0 0 16 20" width="16" height="20" aria-hidden="true"><path d="M1 1 L1 16 L5 12.5 L8 19 L10.6 17.9 L7.6 11.6 L13 11.4 Z" fill="currentColor"/></svg>';

let camada: HTMLElement | null = null;
function contenedor(): HTMLElement {
  if (camada) return camada;
  camada = document.createElement('div');
  camada.className = 'motor';
  camada.setAttribute('aria-hidden', 'true');
  document.body.appendChild(camada);
  return camada;
}

export function criarCursor(tipo: Tipo, rotulo: string): Cursor {
  const el = document.createElement('div');
  el.className = `cursor cursor--${tipo}`;
  el.innerHTML =
    (tipo === 'design'
      ? `<span class="cursor__ponta">${SETA}</span>`
      : '<span class="cursor__ponta"><i class="cursor__barra"></i></span>') +
    `<span class="cursor__rotulo">${rotulo}</span>`;
  contenedor().appendChild(el);
  gsap.set(el, { x: -200, y: -200, opacity: 0 });
  const pos = () => ({ x: Number(gsap.getProperty(el, 'x')), y: Number(gsap.getProperty(el, 'y')) });
  const largura = () => document.documentElement.clientWidth;
  return {
    el,
    tipo,
    pos,
    entrar(x, y, dur = 0.9) {
      const borda = x < largura() / 2 ? -80 : largura() + 80;
      const tl = gsap.timeline();
      tl.set(el, { x: borda, y: y + 120, opacity: 1 });
      tl.to(el, { x, y, duration: dur, ease: 'power3.inOut' });
      return tl;
    },
    ir(x, y, dur = 0.8) {
      return gsap.to(el, { x, y, duration: dur, ease: 'power3.inOut', overwrite: 'auto' });
    },
    sair(dur = 0.7) {
      const { x, y } = pos();
      const borda = x < largura() / 2 ? -80 : largura() + 80;
      const tl = gsap.timeline();
      tl.to(el, { x: borda, y: y + 80, duration: dur, ease: 'power3.in' });
      tl.set(el, { opacity: 0 });
      return tl;
    },
  };
}

/** ponto de uma caixa (getBoundingClientRect) em coordenadas do documento */
export function noDocumento(r: DOMRect, ax = 0, ay = 0) {
  return { x: r.left + window.scrollX + r.width * ax, y: r.top + window.scrollY + r.height * ay };
}
