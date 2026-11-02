// O mundo da CodimDev: um único canvas WebGL2 fixo atrás da página, sobre o branco.
// Fatia T2 (MUNDO-PLANO.md): o símbolo do hero em pontilhado de tinta, os elos em vermelho sólido e o halo
// pontilhado em volta deles. As próximas fatias acrescentam o título de pontos (T3), o loader (T4), os objetos
// e o fluxo (T6) sobre esta mesma base: quad, programas, medida no documento e quadro no ticker.

import { QUAD_VS, SIMBOLO_FS, BRILHO_FS } from './shaders';
import { programa, textura, rgb } from './gl';
import { NUCLEO, SIMBOLO_W, texturaSimbolo } from './simbolo';

const CELULA_CSS = 2; // lado da célula do pontilhado, em px CSS (1,67 no celular)
const TINTA = rgb('#0A0A0B');
const VERMELHO = rgb('#E8132E');

export interface EstadoMundo {
  /** 0..1: condensação dos C do símbolo */
  forma: number;
  /** 0..1: os elos acesos */
  elos: number;
  /** 0..1: o halo vermelho em volta dos elos */
  brilho: number;
  /** 0..1: o pulso (brilho extra e onda) */
  pulso: number;
}

export interface Mundo {
  estado: EstadoMundo;
  quadro(): void;
  medir(): void;
  /** O núcleo do símbolo em px CSS do documento, e o raio de referência (metade da altura de um elo). */
  nucleo(): { x: number; y: number; r: number };
}

interface Retangulo {
  x: number;
  y: number;
  w: number;
  h: number;
}

function retanguloNoDocumento(el: Element): Retangulo {
  const r = el.getBoundingClientRect();
  return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height };
}

export function criarMundo({ reduzido = false }: { reduzido?: boolean } = {}): Mundo | null {
  const canvas = document.querySelector<HTMLCanvasElement>('canvas.mundo');
  const elSimbolo = document.querySelector<HTMLElement>('[data-obj="simbolo"]');
  if (!canvas || !elSimbolo) return null;
  const gl = canvas.getContext('webgl2', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  });
  if (!gl) return null;

  const pSimbolo = programa(gl, QUAD_VS, SIMBOLO_FS);
  const pBrilho = programa(gl, QUAD_VS, BRILHO_FS);

  // quad unitário
  const quadVao = gl.createVertexArray();
  gl.bindVertexArray(quadVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const texSimbolo = textura(gl, texturaSimbolo());
  const semente = Math.random() * 100;

  // T2: tudo formado. A entrada (T3) parte de zero, exceto com movimento reduzido.
  const estado: EstadoMundo = { forma: 1, elos: 1, brilho: 1, pulso: 0 };
  void reduzido;

  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let celula = 2;
  let cw = 0;
  let ch = 0;
  let simbolo: Retangulo = { x: 0, y: 0, w: 0, h: 0 };

  function medir() {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    const celular = vw < 760;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    celula = Math.max(1, Math.round((celular ? 1.67 : CELULA_CSS) * dpr));
    cw = Math.round(canvas.clientWidth * dpr);
    ch = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    simbolo = retanguloNoDocumento(elSimbolo);
  }

  function nucleo() {
    return {
      x: simbolo.x + NUCLEO.u * simbolo.w,
      y: simbolo.y + NUCLEO.v * simbolo.h,
      r: (56 / SIMBOLO_W) * simbolo.w,
    };
  }

  function quadro() {
    const s = window.scrollY;
    gl.viewport(0, 0, cw, ch);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(quadVao);

    // halo dos elos (atrás do símbolo)
    const n = nucleo();
    const y = n.y - s;
    if (estado.brilho > 0.001 && y > -n.r * 6 && y < vh + n.r * 6) {
      const R = n.r * (1 + estado.pulso * 0.08);
      const ext = R * 3.6;
      const cx = Math.round(n.x * dpr);
      const cy = Math.round(y * dpr);
      pBrilho
        .usar()
        .f('u_res', cw, ch)
        .f('u_rect', cx - ext * dpr, cy - ext * dpr, ext * 2 * dpr, ext * 2 * dpr)
        .f('u_c', cx, cy)
        .f('u_R', R * dpr)
        .f('u_cell', celula)
        .f('u_int', estado.brilho)
        .f('u_core', 0)
        .f('u_halo', 0.34 + estado.pulso * 0.3)
        .f('u_cor', ...VERMELHO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // símbolo
    const sy = simbolo.y - s;
    if (sy < vh && sy + simbolo.h > 0) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texSimbolo);
      pSimbolo
        .usar()
        .f('u_res', cw, ch)
        .f('u_rect', Math.round(simbolo.x * dpr), Math.round(sy * dpr), simbolo.w * dpr, simbolo.h * dpr)
        .f('u_cell', celula)
        .i('u_tex', 0)
        .f('u_form', estado.forma)
        .f('u_elos', estado.elos)
        .f('u_dir', 0.64, 0.77)
        .f('u_seed', semente)
        .f('u_tinta', ...TINTA)
        .f('u_vermelho', ...VERMELHO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  medir();
  let raf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(medir);
  });
  const main = document.querySelector('main');
  if (main) new ResizeObserver(() => medir()).observe(main);
  document.fonts.addEventListener('loadingdone', () => medir());

  return { estado, quadro, medir, nucleo };
}
