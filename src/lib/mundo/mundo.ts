// O mundo da CodimDev: um único canvas WebGL2 fixo atrás da página, sobre o branco.
// Hoje (MUNDO-PLANO.md, T2 e T3): o símbolo do hero em pontilhado de tinta com os elos em vermelho sólido,
// o halo e o pulso dos elos, a rajada de pontos que sai da ligação e o título "Tudo conectado." montado pelos
// pontos que voam dos elos. Depois da entrada tudo fica SÓLIDO; o pontilhado só volta em volta do cursor. Próximas fatias: o loader (T4), os objetos e o fluxo que desce a página (T6).

import { QUAD_VS, SIMBOLO_FS, BRILHO_FS, TITULO_FS, TITULO_VS, PONTO_FS, RAJADA_VS } from './shaders';
import { programa, textura, rgb, smoothstep } from './gl';
import { NUCLEO, SIMBOLO_W, texturaSimbolo } from './simbolo';
import { construirTitulo, type TipoPontos } from './titulo';

const CELULA_CSS = 2; // lado da célula do pontilhado, em px CSS (1,67 no celular)
const PULSO_S = 3.8; // intervalo do pulso dos elos
const TINTA = rgb('#0A0A0B');
const VERMELHO = rgb('#E8132E');
const FAMILIA_TITULO = 'Archivo Condensada';

export interface EstadoMundo {
  /** 0..1: condensação dos C do símbolo */
  forma: number;
  /** 0..1: quanto os dois C estão afastados (1 = longe, 0 = encostados) */
  abre: number;
  /** 0..1: os elos acesos */
  elos: number;
  /** 0..1: o halo vermelho em volta dos elos */
  brilho: number;
  /** 0..1: até onde a rajada chega */
  alcance: number;
  /** tempo do voo dos pontos do título (s; -1 = não começou; 99 = pousados) */
  voo: number;
  /** 0..1: as letras ficando sólidas de fora para dentro */
  solido: number;
  /** 0..1: fim da entrada: até as bordas perto do símbolo ficam sólidas (o pontilhado só volta sob o cursor) */
  final: number;
  /** 0..1: os C do símbolo ficando sólidos */
  solidez: number;
  /** 0..1: o pulso (calculado no quadro depois de iniciarPulso) */
  pulso: number;
  /** 0..1: fase da onda do pulso */
  onda: number;
}

export interface Mundo {
  estado: EstadoMundo;
  quadro(): void;
  /** Mede o layout de novo; com forcar, rasteriza o título de novo (fontes aplicadas, por exemplo). */
  medir(forcar?: boolean): void;
  /** O núcleo do símbolo em px CSS do documento, e o raio de referência (metade da altura de um elo). */
  nucleo(): { x: number; y: number; r: number };
  /** Liga o pulso dos elos (a cada PULSO_S segundos). */
  iniciarPulso(): void;
  /** O título já foi rasterizado pelos pontos (o HTML dele está transparente). */
  temTitulo(): boolean;
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
  const elTitulo = document.querySelector<HTMLElement>('[data-title]');
  if (!canvas || !elSimbolo || !elTitulo) return null;
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
  const pTitulo = programa(gl, QUAD_VS, TITULO_FS);
  const pTituloPontos = programa(gl, TITULO_VS, PONTO_FS);
  const pRajada = programa(gl, RAJADA_VS, PONTO_FS);

  // quad unitário
  const quadVao = gl.createVertexArray();
  gl.bindVertexArray(quadVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  // rajada: buffer fixo de números aleatórios; a forma sai toda do shader
  const celular0 = matchMedia('(max-width: 760px)').matches;
  const QTD_RAJADA = celular0 ? 1500 : 3500; // leve: sobre o branco, muitos pontos viram mancha
  const aleatorios = new Float32Array(QTD_RAJADA * 4).map(() => Math.random());
  const rajadaVao = gl.createVertexArray();
  gl.bindVertexArray(rajadaVao);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, aleatorios, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);

  const texSimbolo = textura(gl, texturaSimbolo());
  const semente = Math.random() * 100;

  // A entrada (movimento/entrada.ts) parte de tudo apagado e com os C afastados; com movimento reduzido, já formado.
  const estado: EstadoMundo = reduzido
    ? { forma: 1, abre: 0, elos: 1, brilho: 0, alcance: 0, voo: 99, solido: 1, final: 1, solidez: 1, pulso: 0, onda: 0 }
    : {
        forma: 0,
        abre: 1,
        elos: 0,
        brilho: 0,
        alcance: 0,
        voo: -1,
        solido: 0,
        final: 0,
        solidez: 0,
        pulso: 0,
        onda: 0,
      };
  const t0 = performance.now();
  let pulsoDesde = -1; // segundos desde t0 em que o pulso começou (-1 = desligado)

  let vw = 0;
  let vh = 0;
  let dpr = 1;
  let celula = 2;
  let cw = 0;
  let ch = 0;
  let celular = false;
  let simbolo: Retangulo = { x: 0, y: 0, w: 0, h: 0 };
  let rajadaDir: [number, number] = [0, -1];
  let rajadaLen = 400;
  let titulo: TipoPontos | null = null;
  let ultimaLargura = 0;

  // mouse: o mundo cede por mola (só desktop) e a lente abre em volta do cursor
  const mouse = { x: -9999, y: -9999, alvoX: 0, alvoY: 0, molaX: 0, molaY: 0 };
  const aoMover = (e: PointerEvent) => {
    if (vw < 760 || e.pointerType === 'touch') return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.alvoX = (e.clientX / vw) * 2 - 1;
    mouse.alvoY = (e.clientY / vh) * 2 - 1;
  };

  const nucleo = () => ({
    x: simbolo.x + NUCLEO.u * simbolo.w,
    y: simbolo.y + NUCLEO.v * simbolo.h,
    r: (56 / SIMBOLO_W) * simbolo.w,
  });

  const medir = (forcar = false) => {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    celular = vw < 760;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    celula = Math.max(1, Math.round((celular ? 1.67 : CELULA_CSS) * dpr));
    cw = Math.round(canvas.clientWidth * dpr);
    ch = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }
    simbolo = retanguloNoDocumento(elSimbolo);

    // rajada: no desktop sobe (o espaço vazio acima do título); no celular vai para o alto à direita, onde
    // não há texto ("Tudo" fica em cima à esquerda e "conectado." embaixo) e sem cruzar o vão do C da esquerda
    const n = nucleo();
    const alvo = celular ? { x: vw * 1.08, y: n.y - vh * 0.34 } : { x: n.x - vw * 0.07, y: vh * 0.04 };
    const dx = alvo.x - n.x;
    const dy = alvo.y - n.y;
    const dl = Math.hypot(dx, dy) || 1;
    rajadaDir = [dx / dl, dy / dl];
    rajadaLen = dl * 0.62; // um rastro curto, que se apaga antes de chegar ao topo

    // título de pontos: refeito quando a largura muda ou quando pedido (fontes aplicadas)
    if (forcar || vw !== ultimaLargura || !titulo) {
      titulo?.descartar();
      const fs = parseFloat(getComputedStyle(elTitulo).fontSize);
      titulo = construirTitulo(gl, {
        raiz: elTitulo,
        fonte: { x: n.x, y: n.y },
        faixa: (celular ? simbolo.h : simbolo.w) * 0.5 + fs * 0.75,
        dpr,
        celula,
        familia: FAMILIA_TITULO,
        peso: 800,
      });
    }
    ultimaLargura = vw;
  };

  const quadro = () => {
    const s = window.scrollY;
    const agora = (performance.now() - t0) / 1000;
    const t = reduzido ? 12 : agora;

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
    const n = nucleo();
    // raio da lente do cursor (px de dispositivo): só no desktop, e nunca com movimento reduzido
    const lenteR = celular || reduzido ? 0 : 120 * dpr;

    gl.viewport(0, 0, cw, ch);
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // halo dos elos (atrás de tudo)
    gl.bindVertexArray(quadVao);
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
        .f('u_ondaMax', celular ? 2.6 : 4.0)
        .f('u_cor', ...VERMELHO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // rajada que sai da ligação
    if (estado.alcance > 0.001 && y > -rajadaLen && y < vh + rajadaLen) {
      gl.bindVertexArray(rajadaVao);
      pRajada
        .usar()
        .f('u_vp', vw, vh)
        .f('u_res', cw, ch)
        .f('u_dpr', dpr)
        .f('u_cell', celula)
        .f('u_time', t)
        .f('u_scroll', s)
        .f('u_mouse', mouse.x, mouse.y)
        .f('u_mpar', mx, my)
        .f('u_src', n.x, n.y)
        .f('u_srcR', n.r)
        .f('u_bdir', ...rajadaDir)
        .f('u_blen', rajadaLen)
        .f('u_alcance', estado.alcance)
        .f('u_inicio', celular ? 1.6 : 0.6)
        .f('u_pulse', estado.pulso)
        .f('u_tinta', ...TINTA)
        .f('u_vermelho', ...VERMELHO);
      gl.drawArrays(gl.POINTS, 0, QTD_RAJADA);
    }

    // símbolo (o quad é mais largo para caber os C afastados na entrada)
    gl.bindVertexArray(quadVao);
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
        .f('u_mr', lenteR)
        .f('u_solidez', estado.solidez)
        .f('u_seed', semente)
        .f('u_tinta', ...TINTA)
        .f('u_vermelho', ...VERMELHO);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // título: as letras sólidas e os pontos (voando, ou respirando perto dos elos)
    const ti = titulo;
    if (ti && ti.org.y - s < vh && ti.org.y + ti.H / dpr - s > 0) {
      const ox = Math.round(ti.org.x * dpr);
      const oy = Math.round((ti.org.y - s) * dpr);
      if (estado.solido > 0) {
        gl.bindVertexArray(quadVao);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, ti.texCob);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, ti.texS);
        pTitulo
          .usar()
          .f('u_res', cw, ch)
          .f('u_rect', ox, oy, ti.W, ti.H)
          .f('u_cell', celula)
          .f('u_solid', estado.solido)
          .f('u_final', estado.final)
          .f('u_mouse', mouse.x * dpr, mouse.y * dpr)
          .f('u_mr', lenteR)
          .i('u_cov', 0)
          .i('u_S', 1)
          .f('u_tinta', ...TINTA)
          .f('u_vermelho', ...VERMELHO);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      if (estado.voo >= 0) {
        gl.bindVertexArray(ti.vao);
        pTituloPontos
          .usar()
          .f('u_res', cw, ch)
          .f('u_org', ox, oy)
          .f('u_src', (n.x + mx) * dpr, (n.y - s + my) * dpr)
          .f('u_arc', ...(celular ? ([-1, 0] as const) : ([0, -1] as const)))
          .f('u_drift', 0, -1)
          .f('u_radial', 1)
          .f('u_spread', n.r * 1.4 * dpr)
          .f('u_amp', 1)
          .f('u_cell', celula)
          .f('u_dpr', dpr)
          .f('u_tT', estado.voo)
          .f('u_solid', estado.solido)
          .f('u_final', estado.final)
          .f('u_mouse', mouse.x * dpr, mouse.y * dpr)
          .f('u_mr', lenteR)
          .f('u_time', t)
          .f('u_pulse', estado.pulso)
          .f('u_tinta', ...TINTA)
          .f('u_vermelho', ...VERMELHO);
        gl.drawArrays(gl.POINTS, 0, ti.quantos);
      }
    }
  };

  medir();
  let raf = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => medir());
  });
  const main = document.querySelector('main');
  if (main) new ResizeObserver(() => medir()).observe(main);
  document.fonts.addEventListener('loadingdone', () => medir(true));
  window.addEventListener('pointermove', aoMover, { passive: true });
  document.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -9999;
    mouse.alvoX = mouse.alvoY = 0;
  });

  const iniciarPulso = () => {
    if (pulsoDesde < 0) pulsoDesde = (performance.now() - t0) / 1000;
  };

  return { estado, quadro, medir, nucleo, iniciarPulso, temTitulo: () => titulo !== null };
}
