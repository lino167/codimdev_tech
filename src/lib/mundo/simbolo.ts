// O símbolo da CodimDev para o mundo: os caminhos do SVG oficial (02_Logos/Simbolo/simbolo-positivo.svg,
// viewBox 468 × 288) rasterizados numa textura RGB. R = tinta dos dois C (com degradê, para o pontilhado),
// G = cobertura dos elos vermelhos, B = cobertura pura dos C (para o símbolo sólido).

export const SIMBOLO_W = 468;
export const SIMBOLO_H = 288;
/** O núcleo (centro dos dois elos), em fração do símbolo. É de onde saem a rajada e o fluxo. */
export const NUCLEO = { u: 234 / SIMBOLO_W, v: 144 / SIMBOLO_H };

const C1 =
  'M176 0L112 0C50.144 0 0 50.144 0 112C0 173.856 50.144 224 112 224L176 224L176 176L112 176C76.654 176 48 147.346 48 112C48 76.654 76.654 48 112 48L176 48L176 0Z';
const C2 =
  'M0 0L64 0C125.856 0 176 50.144 176 112C176 173.856 125.856 224 64 224L0 224L0 176L64 176C99.346 176 128 147.346 128 112C128 76.654 99.346 48 64 48L0 48L0 0Z';
const ELO = 'M0 0L20 0L84 64L84 112L64 112L0 48L0 0Z';

/** [caminho, deslocamento x, deslocamento y] de cada parte, como no SVG oficial. */
export const PARTES = {
  c: [
    [C1, 0, 0],
    [C2, 292, 64],
  ],
  elos: [
    [ELO, 192, 0],
    [ELO, 192, 176],
  ],
} as const;

/** Desenha as partes num contexto 2D já escalado para o viewBox do símbolo. */
export function desenhar(ctx: CanvasRenderingContext2D, partes: readonly (readonly [string, number, number])[]) {
  for (const [d, x, y] of partes) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fill(new Path2D(d));
    ctx.restore();
  }
}

/**
 * Rasteriza a textura do símbolo (escala fixa, independente da tela: o shader amostra com filtro linear).
 * A tinta dos C tem um degradê na diagonal e clareia perto dos elos, como se a ligação acendesse o símbolo:
 * isso dá textura ao pontilhado em vez de um bloco chapado.
 */
export function texturaSimbolo(escala = 3): HTMLCanvasElement {
  const W = SIMBOLO_W * escala;
  const H = SIMBOLO_H * escala;
  const mascara = (partes: readonly (readonly [string, number, number])[]) => {
    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('[mundo] canvas 2D indisponível');
    ctx.scale(escala, escala);
    ctx.fillStyle = '#fff';
    desenhar(ctx, partes);
    return ctx.getImageData(0, 0, W, H).data;
  };
  const c = mascara(PARTES.c);
  const elos = mascara(PARTES.elos);

  const saida = document.createElement('canvas');
  saida.width = W;
  saida.height = H;
  const ctx = saida.getContext('2d');
  if (!ctx) throw new Error('[mundo] canvas 2D indisponível');
  const img = ctx.createImageData(W, H);
  const nx = NUCLEO.u * W;
  const ny = NUCLEO.v * H;
  const raio = 0.42 * W;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const cobre = c[i + 3] / 255;
      // diagonal: mais tinta no alto à esquerda, menos embaixo à direita
      const diag = (x / W) * 0.55 + (y / H) * 0.45;
      let tinta = 1.0 - 0.42 * diag;
      // perto dos elos a tinta abre (a ligação "acende")
      const d = Math.hypot(x - nx, (y - ny) * 1.15) / raio;
      tinta *= 0.42 + 0.58 * Math.min(1, d * d);
      img.data[i] = Math.round(cobre * Math.min(1, tinta) * 255);
      img.data[i + 1] = elos[i + 3];
      img.data[i + 2] = c[i + 3]; // B: cobertura pura dos C, para o símbolo sólido de borda nítida
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return saida;
}
