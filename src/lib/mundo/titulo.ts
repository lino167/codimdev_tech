// Tipos feitos de pontos: o título do hero (e, na T9, o letreiro do rodapé).
// Cada letra é desenhada num canvas 2D na posição EXATA do DOM (um Range por caractere, então o tracking do
// CSS vale aqui também). A cobertura vira textura RG (R = tinta, G = palavra vermelha) e cada célula de tinta
// vira um ponto que voa até o lugar dela. D (0..1) diz quanto a célula fica como ponto; S é a ordem em que ela
// vira letra sólida (de fora para dentro). Técnica estudada na template Sinal (buildType); código próprio.

import { bayer8, smoothstep, textura } from './gl';

export interface Ponto2D {
  x: number;
  y: number;
}

export interface TipoPontos {
  /** origem (px CSS do documento), alinhada ao pixel de dispositivo */
  org: Ponto2D;
  W: number;
  H: number;
  texCob: WebGLTexture;
  texS: WebGLTexture;
  vao: WebGLVertexArrayObject;
  buffers: WebGLBuffer[];
  quantos: number;
  descartar(): void;
}

interface Opcoes {
  /** o elemento com as palavras em .w (só texto dentro) */
  raiz: HTMLElement;
  /** de onde os pontos saem (px CSS do documento) */
  fonte: Ponto2D;
  /** largura (px CSS) em volta da fonte em que as letras continuam como pontos */
  faixa: number;
  dpr: number;
  celula: number;
  /** a família carregada pelo carga.ts */
  familia: string;
  peso: number;
}

export function construirTitulo(gl: WebGL2RenderingContext, op: Opcoes): TipoPontos | null {
  const palavras = [...op.raiz.querySelectorAll<HTMLElement>('.w')];
  if (!palavras.length) return null;
  const { dpr, celula } = op;
  const fs = parseFloat(getComputedStyle(op.raiz).fontSize);
  const caixas = palavras.map((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height };
  });
  const folga = fs * 0.28;
  const x0 = Math.min(...caixas.map((r) => r.x)) - folga;
  const y0 = Math.min(...caixas.map((r) => r.y)) - folga;
  const x1 = Math.max(...caixas.map((r) => r.x + r.w)) + folga;
  const y1 = Math.max(...caixas.map((r) => r.y + r.h)) + folga;
  const org = { x: Math.round(x0 * dpr) / dpr, y: Math.round(y0 * dpr) / dpr };
  const W = Math.ceil((x1 - x0) * dpr);
  const H = Math.ceil((y1 - y0) * dpr);

  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.scale(dpr, dpr);
  ctx.font = `${op.peso} ${fs}px '${op.familia}'`;
  ctx.textBaseline = 'alphabetic';
  const ascent = ctx.measureText('Tudo conectado').fontBoundingBoxAscent || fs * 0.97;

  // cada palavra com uma cor "de marcação": vermelho puro = palavra em tinta, verde puro = palavra vermelha
  for (const el of palavras) {
    ctx.fillStyle = el.classList.contains('w2') ? '#00ff00' : '#ff0000';
    const no = el.firstChild;
    if (!no || no.nodeType !== Node.TEXT_NODE) continue;
    const texto = no as Text;
    const range = document.createRange();
    for (let i = 0; i < texto.length; i++) {
      range.setStart(texto, i);
      range.setEnd(texto, i + 1);
      const r = range.getBoundingClientRect();
      ctx.fillText(texto.data[i], r.left - org.x, r.top + window.scrollY - org.y + ascent);
    }
  }
  const px = ctx.getImageData(0, 0, W, H).data;
  const cob = new Uint8Array(W * H * 2);
  for (let i = 0; i < W * H; i++) {
    cob[i * 2] = px[i * 4 + 3];
    cob[i * 2 + 1] = px[i * 4 + 1] > px[i * 4] ? 255 : 0;
  }

  // D: perto dos elos as letras continuam como pontos (distância 2D: no celular as palavras ficam em cima e embaixo)
  const D = (x: number, y: number) =>
    1 - smoothstep(op.faixa * 0.55, op.faixa, Math.hypot(x - op.fonte.x, y - op.fonte.y));
  const nx = Math.ceil(W / celula);
  const ny = Math.ceil(H / celula);
  const S8 = new Uint8Array(nx * ny);
  const at: number[] = [];
  const au: number[] = [];
  let maxDist = 1;
  for (let cy = 0; cy < ny; cy++) {
    for (let cx = 0; cx < nx; cx++) {
      let soma = 0;
      let n = 0;
      let verde = 0;
      for (let yy = cy * celula; yy < Math.min(H, (cy + 1) * celula); yy++) {
        for (let xx = cx * celula; xx < Math.min(W, (cx + 1) * celula); xx++) {
          const i = yy * W + xx;
          soma += cob[i * 2];
          verde += cob[i * 2 + 1];
          n++;
        }
      }
      const c = soma / n / 255;
      const pxDoc = org.x + ((cx + 0.5) * celula) / dpr;
      const pyDoc = org.y + ((cy + 0.5) * celula) / dpr;
      const d = D(pxDoc, pyDoc);
      const S = (d + Math.random() * 0.3) / 0.5;
      S8[cy * nx + cx] = Math.min(255, Math.round((Math.min(S, 2) / 2) * 255));
      if (c >= 0.42) {
        const dist = Math.hypot(pxDoc - op.fonte.x, pyDoc - op.fonte.y);
        maxDist = Math.max(maxDist, dist);
        at.push(cx, cy, S, d);
        au.push(c + (verde / n > 127 ? 2 : 0), bayer8(cx, cy), Math.random(), dist);
      }
    }
  }
  // atraso: quem está mais longe dos elos chega depois, com um pouco de acaso
  for (let i = 3; i < au.length; i += 4) au[i] = (au[i] / maxDist) * 0.85 + au[i - 1] * 0.3;

  const texCob = textura(gl, cob, { filtro: gl.NEAREST, formato: gl.RG, interno: gl.RG8, w: W, h: H });
  const texS = textura(gl, S8, { filtro: gl.NEAREST, formato: gl.RED, interno: gl.R8, w: nx, h: ny });
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  const b1 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(at), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0);
  const b2 = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b2);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(au), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  op.raiz.classList.add('is-gl');

  return {
    org,
    W,
    H,
    texCob,
    texS,
    vao,
    buffers: [b1, b2],
    quantos: at.length / 4,
    descartar() {
      gl.deleteTexture(texCob);
      gl.deleteTexture(texS);
      gl.deleteBuffer(b1);
      gl.deleteBuffer(b2);
      gl.deleteVertexArray(vao);
    },
  };
}
