// Os dois alvos de pontos do hero: o logo oficial (a máscara vem do Path2D do SVG da marca) e o retrato do Zacarias (alfa
// do recorte + profundidade calculada). Tudo em unidades de cena: a altura visível vai de -1 a 1; a largura, de -aspecto a aspecto.
import { LOGO } from '../marca/logo';

export interface Alvo {
  /** x, y, z por ponto */
  pos: Float32Array;
  /** r, g, b por ponto (0 a 1) */
  cor: Float32Array;
}

const ALGODAO: [number, number, number] = [0xf5 / 255, 0xf4 / 255, 0xef / 255];
const CARMIM: [number, number, number] = [0xc4 / 255, 0x2a / 255, 0x1f / 255];

/** Aleatório determinístico (as partículas caem no mesmo lugar toda vez). */
export function semente(n: number) {
  let s = n >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

function canvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  return { c, ctx };
}

/** O logo `codimdev` desenhado em pontos; o trecho carmim da marca sai em carmim. */
export function alvoLogo(n: number, aspecto: number): Alvo {
  const W = 1800;
  const H = Math.round((W * LOGO.altura) / LOGO.largura);
  const desenha = (d: string) => {
    const { c, ctx } = canvas(W, H);
    const k = W / LOGO.largura;
    ctx.setTransform(k, 0, 0, k, -106 * k, -87 * k);
    ctx.fill(new Path2D(d), 'evenodd');
    return ctx.getImageData(0, 0, W, H).data;
  };
  const cinza = desenha(LOGO.cinza);
  const carmim = desenha(LOGO.carmim);
  const dentro: number[] = [];
  for (let i = 0; i < W * H; i++) if (cinza[i * 4 + 3] > 128 || carmim[i * 4 + 3] > 128) dentro.push(i);
  const rnd = semente(7);
  // o logo ocupa 78% da largura da cena (90% no celular), centrado
  const largura = 2 * aspecto * (aspecto < 1 ? 0.9 : 0.78);
  const escala = largura / W;
  const pos = new Float32Array(n * 3);
  const cor = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const idx = dentro[Math.floor(rnd() * dentro.length)];
    const x = (idx % W) + rnd();
    const y = Math.floor(idx / W) + rnd();
    pos[i * 3] = (x - W / 2) * escala;
    pos[i * 3 + 1] = -(y - H / 2) * escala;
    pos[i * 3 + 2] = (rnd() - 0.5) * 0.02;
    const c = carmim[idx * 4 + 3] > 128 ? CARMIM : ALGODAO;
    cor[i * 3] = c[0];
    cor[i * 3 + 1] = c[1];
    cor[i * 3 + 2] = c[2];
  }
  return { pos, cor };
}

/** Relevo a partir do alfa: desfoque em vários passes (travesseiro) e um pouco de luminância. */
function profundidade(alfa: Float32Array, lum: Float32Array, w: number, h: number) {
  let a = alfa;
  const tmp = new Float32Array(w * h);
  const raio = Math.round(w * 0.035);
  const passe = (src: Float32Array, dst: Float32Array, horizontal: boolean) => {
    const passo = horizontal ? 1 : w;
    const limite = horizontal ? w : h;
    const linhas = horizontal ? h : w;
    for (let l = 0; l < linhas; l++) {
      const base = horizontal ? l * w : l;
      let soma = 0;
      for (let k = -raio; k <= raio; k++) soma += src[base + Math.min(limite - 1, Math.max(0, k)) * passo];
      for (let p = 0; p < limite; p++) {
        dst[base + p * passo] = soma / (2 * raio + 1);
        const sai = Math.max(0, p - raio);
        const entra = Math.min(limite - 1, p + raio + 1);
        soma += src[base + entra * passo] - src[base + sai * passo];
      }
    }
  };
  for (let i = 0; i < 3; i++) {
    passe(a, tmp, true);
    const b = new Float32Array(w * h);
    passe(tmp, b, false);
    a = b;
  }
  const d = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) d[i] = Math.min(1, a[i] * 1.6) * 0.8 + lum[i] * 0.2 * alfa[i];
  return d;
}

/** O retrato do Zacarias em pontos, com relevo, à esquerda da cena (ao centro no celular). */
export async function alvoRetrato(n: number, aspecto: number, url: string): Promise<Alvo> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const W = 420;
  const H = Math.round((W * img.naturalHeight) / img.naturalWidth);
  const { ctx } = canvas(W, H);
  ctx.drawImage(img, 0, 0, W, H);
  const px = ctx.getImageData(0, 0, W, H).data;
  const alfa = new Float32Array(W * H);
  const lum = new Float32Array(W * H);
  const dentro: number[] = [];
  for (let i = 0; i < W * H; i++) {
    alfa[i] = px[i * 4 + 3] / 255;
    lum[i] = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
    if (px[i * 4 + 3] > 140) dentro.push(i);
  }
  const prof = profundidade(alfa, lum, W, H);
  const rnd = semente(21);
  const altura = aspecto < 1 ? 0.82 : 1.9;
  const escala = altura / H;
  const cx = aspecto < 1 ? 0 : -aspecto * 0.52;
  const cy = aspecto < 1 ? 0.44 : -0.05;
  const pos = new Float32Array(n * 3);
  const cor = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const idx = dentro[Math.floor(rnd() * dentro.length)];
    const x = (idx % W) + rnd();
    const y = Math.floor(idx / W) + rnd();
    pos[i * 3] = cx + (x - W / 2) * escala;
    pos[i * 3 + 1] = cy - (y - H / 2) * escala;
    pos[i * 3 + 2] = prof[idx] * 0.34;
    // tons de algodão pela luz da foto, com um pouco da cor original
    const l = 0.34 + 1.1 * Math.pow(lum[idx], 0.7);
    for (let c = 0; c < 3; c++) {
      const mono = ALGODAO[c] * l;
      const orig = (px[idx * 4 + c] / 255) * 1.1;
      cor[i * 3 + c] = Math.min(1, mono * 0.72 + orig * 0.28);
    }
  }
  return { pos, cor };
}
