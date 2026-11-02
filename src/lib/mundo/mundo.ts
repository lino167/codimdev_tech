// O mundo da CodimDev: um único canvas WebGL2 fixo atrás da página, sobre o branco.
// Fatia T2 (MUNDO-PLANO.md): o símbolo do hero em pontilhado de tinta, os elos em vermelho sólido e o halo
// pontilhado em volta deles. As próximas fatias acrescentam o título de pontos (T3), o loader (T4), os objetos
// e o fluxo (T6) sobre esta mesma base: quad, programas, medida no documento e quadro no ticker.

import { QUAD_VS, SIMBOLO_FS, BRILHO_FS } from './shaders';
import { programa, textura, rgb, smoothstep } from './gl';
import { NUCLEO, SIMBOLO_W, texturaSimbolo } from './simbolo';

const CELULA_CSS = 2; // lado da célula do pontilhado, em px CSS (1,67 no celular)
const PULSO_S = 3.8; // intervalo do pulso dos elos
const TINTA = rgb('#0A0A0B');
const VERMELHO = rgb('#E8132E');

export interface EstadoMundo {
  /** 0..1: condensação dos C do símbolo */
  forma: number;
  /** 0..1: quanto os dois C estão afastados (1 = longe, 0 = encostados) */
  abre: number;
  /** 0..1: os elos acesos */
  elos: number;
  /** 0..1: o halo vermelho em volta dos elos */
  brilho: number;
  /** 0..1: o pulso (calculado no quadro depois de iniciarPulso) */
  pulso: number;
  /** 0..1: fase da onda do pulso */
  onda: number;
}

export interface Mundo {
  estado: EstadoMundo;
  quadro(): void;
  medir(): void;
  /** O núcleo do símbolo em px CSS do documento, e o raio de referência (metade da altura de um elo). */
  nucleo(): { x: number; y: number; r: number };
  /** Liga o pulso dos elos (a cada PULSO_S segundos). */
  iniciarPulso(): void;
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

  // A entrada (movimento/entrada.ts) parte de tudo apagado e com os C afastados; com movimento reduzido, já formado.
  const estado: EstadoMundo = reduzido
    ? { forma: 1, abre: 0, elos: 1, brilho: 1, pulso: 0, onda: 0 }
    : { forma: 0, abre: 1, elos: 0, brilho: 0, pulso: 0, onda: 0 };
  const t0 = performance.now();
  let pulsoDesde = -1; // segundos desde t0 em que o pulso começou (-1 = desligado)

  // mouse: o mundo cede por mola (só desktop) e a lente abre em volta do cursor
  const mouse = { x: -9999, y: -9999, alvoX: 0, alvoY: 0, molaX: 0, molaY: 0 };
  const aoMover = (e: PointerEvent) => {
    if (vw < 760 || e.pointerType === 'touch') return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.alvoX = (e.clientX / vw) * 2 - 1;
    mouse.alvoY = (e.clientY / vh) * 2 - 1;
  };

  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let celula = 2;
  let cw = 0;
  let ch = 0;
  let simbolo: Retangulo = { x: 0, y: 0, w: 0, h: 0 };

  const medir = () => {
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
  };

  const nucleo = () => {
    return {
      x: simbolo.x + NUCLEO.u * simbolo.w,
      y: simbolo.y + NUCLEO.v * simbolo.h,
      r: (56 / SIMBOLO_W) * simbolo.w,
    };
  };

  const quadro = () => {
    const s = window.scrollY;
    const agora = (performance.now() - t0) / 1000;

    // pulso dos elos: a cada 3,8 s um brilho rápido que decai, e a onda que abre
    if (pulsoDesde >= 0 && !reduzido) {
      const fase = ((agora - pulsoDesde) % PULSO_S) / PULSO_S;
      estado.pulso = fase < 0.06 ? smoothstep(0, 0.06, fase) : Math.exp(-(fase - 0.06) * 7);
      estado.onda = Math.min(1, fase / 0.6);
    }
    // mola do mouse (o símbolo cede alguns px, como o resto do mundo vai ceder)
    if (!reduzido) {
      mouse.molaX += (mouse.alvoX - mouse.molaX) * 0.06;
      mouse.molaY += (mouse.alvoY - mouse.molaY) * 0.06;
    }
    const mx = -mouse.molaX * 9 * 0.8;
    const my = -mouse.molaY * 6 * 0.8;

    gl.viewport(0, 0, cw, ch);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindVertexArray(quadVao);

    // halo dos elos (atrás do símbolo)
    const n = nucleo();
    const y = n.y - s + my;
    if (estado.brilho > 0.001 && y > -n.r * 6 && y < vh + n.r * 6) {
      const R = n.r * (1 + estado.pulso * 0.08);
      const ext = R * 4.4;
      const cx = Math.round((n.x + mx) * dpr);
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
        .f('u_onda', reduzido ? 0 : estado.onda)
        .f('u_cor', ...VERMELHO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // símbolo (o quad é mais largo para caber os C afastados na entrada)
    const sy = simbolo.y - s + my;
    if (sy < vh && sy + simbolo.h > 0) {
      const sx = Math.round((simbolo.x + mx) * dpr);
      const syd = Math.round(sy * dpr);
      const sw = simbolo.w * dpr;
      const folga = estado.abre * 0.36 * sw;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texSimbolo);
      pSimbolo
        .usar()
        .f('u_res', cw, ch)
        .f('u_rect', sx - folga, syd, sw + folga * 2, simbolo.h * dpr)
        .f('u_sym', sx, syd, sw, simbolo.h * dpr)
        .f('u_cell', celula)
        .i('u_tex', 0)
        .f('u_form', estado.forma)
        .f('u_abre', estado.abre)
        .f('u_elos', estado.elos)
        .f('u_mouse', mouse.x * dpr, mouse.y * dpr)
        .f('u_mr', vw < 760 || reduzido ? 0 : 110 * dpr)
        .f('u_seed', semente)
        .f('u_tinta', ...TINTA)
        .f('u_vermelho', ...VERMELHO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  };

  medir();
  let raf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(medir);
  });
  const main = document.querySelector('main');
  if (main) new ResizeObserver(() => medir()).observe(main);
  document.fonts.addEventListener('loadingdone', () => medir());
  window.addEventListener('pointermove', aoMover, { passive: true });
  document.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -9999;
    mouse.alvoX = mouse.alvoY = 0;
  });

  const iniciarPulso = () => {
    if (pulsoDesde < 0) pulsoDesde = (performance.now() - t0) / 1000;
  };

  return { estado, quadro, medir, nucleo, iniciarPulso };
}
