// Ajudantes mínimos de WebGL2: programa com cache de uniforms, texturas e o Bayer 8×8 do lado do JS.

export interface Programa {
  p: WebGLProgram;
  usar(): Programa;
  f(nome: string, ...v: number[]): Programa;
  i(nome: string, v: number): Programa;
  v4(nome: string, arr: Float32Array): Programa;
}

export function programa(gl: WebGL2RenderingContext, vs: string, fs: string): Programa {
  const shader = (tipo: number, src: string): WebGLShader => {
    const s = gl.createShader(tipo);
    if (!s) throw new Error('[mundo] não foi possível criar o shader');
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const linhas = src
        .split('\n')
        .map((l, i) => `${i + 1}: ${l}`)
        .join('\n');
      throw new Error(`${gl.getShaderInfoLog(s)}\n${linhas}`);
    }
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, shader(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, shader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? '[mundo] link falhou');

  const cache = new Map<string, WebGLUniformLocation | null>();
  const loc = (n: string) => {
    if (!cache.has(n)) cache.set(n, gl.getUniformLocation(p, n));
    return cache.get(n) ?? null;
  };
  const prog: Programa = {
    p,
    usar() {
      gl.useProgram(p);
      return prog;
    },
    f(n, ...v) {
      const l = loc(n);
      if (l) {
        if (v.length === 1) gl.uniform1f(l, v[0]);
        else if (v.length === 2) gl.uniform2f(l, v[0], v[1]);
        else if (v.length === 3) gl.uniform3f(l, v[0], v[1], v[2]);
        else gl.uniform4f(l, v[0], v[1], v[2], v[3]);
      }
      return prog;
    },
    i(n, v) {
      const l = loc(n);
      if (l) gl.uniform1i(l, v);
      return prog;
    },
    v4(n, arr) {
      const l = loc(n);
      if (l) gl.uniform4fv(l, arr);
      return prog;
    },
  };
  return prog;
}

interface OpcoesTextura {
  filtro?: number;
  formato?: number;
  interno?: number;
  tipo?: number;
  w?: number;
  h?: number;
}

export function textura(
  gl: WebGL2RenderingContext,
  src: TexImageSource | ArrayBufferView | null,
  { filtro = gl.LINEAR, formato = gl.RGBA, interno = gl.RGBA, tipo = gl.UNSIGNED_BYTE, w, h }: OpcoesTextura = {},
): WebGLTexture {
  const t = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  if (w != null && h != null) {
    gl.texImage2D(gl.TEXTURE_2D, 0, interno, w, h, 0, formato, tipo, src as ArrayBufferView | null);
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, interno, formato, tipo, src as TexImageSource);
  }
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filtro);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filtro);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return t;
}

export const fract = (x: number) => x - Math.floor(x);

/** O mesmo Bayer 8×8 do shader (COMUM.bayer8), para decidir no JS quais células têm tinta. */
export function bayer8(x: number, y: number): number {
  const b2 = (a: number, b: number) => fract(Math.floor(a) * 0.5 + Math.floor(b) * Math.floor(b) * 0.75);
  const b4 = (a: number, b: number) => b2(a * 0.5, b * 0.5) * 0.25 + b2(a, b);
  return b4(x * 0.5, y * 0.5) * 0.25 + b2(x, y);
}

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** "#E8132E" → [r, g, b] em 0..1, para os uniforms de cor. */
export function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
