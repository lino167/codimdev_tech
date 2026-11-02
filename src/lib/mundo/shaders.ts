// Shaders do mundo da CodimDev. O canvas é limpo em branco; cada fragmento é uma cor cheia (u_cor: a tinta
// ou o vermelho) ou `discard`: sem cinza e sem alfa parcial. Saída pré-multiplicada, com blend ONE, ONE_MINUS_SRC_ALPHA.
// Convenção: coordenadas de tela com origem no canto de cima à esquerda, em px de dispositivo.
// Técnica de dither e de condensação estudada na template Sinal (MUNDO-PLANO.md); código próprio.

const COMUM = /* glsl */ `
float bayer2(vec2 a){ a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a){ return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a){ return bayer4(0.5 * a) * 0.25 + bayer2(a); }
float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
`;

// ---------- quad genérico ----------
export const QUAD_VS = /* glsl */ `#version 300 es
layout(location=0) in vec2 a_p;   // 0..1
uniform vec2 u_res;               // px de dispositivo do canvas
uniform vec4 u_rect;              // x, y, w, h em px de dispositivo (topo à esquerda)
void main(){
  vec2 p = u_rect.xy + a_p * u_rect.zw;
  gl_Position = vec4(p.x / u_res.x * 2.0 - 1.0, 1.0 - p.y / u_res.y * 2.0, 0.0, 1.0);
}`;

// Símbolo: textura RG. R = tinta dos dois C (com degradê, para o dither ter textura), G = cobertura dos elos.
// A assinatura da marca: os dois C chegam de lados opostos (u_abre, em larguras do símbolo) e se condensam dos
// pontos (u_form), cada um vindo do próprio lado; depois os elos vermelhos fecham a ligação (u_elos).
// Cada C calcula a grade de células nas PRÓPRIAS coordenadas: o pontilhado viaja junto com a forma, sem "nadar".
// O quad (u_rect) é mais largo que o símbolo (u_sym) para caber os C afastados.
export const SIMBOLO_FS = /* glsl */ `#version 300 es
precision highp float;
${COMUM}
uniform vec2 u_res;
uniform vec4 u_rect;       // o quad desenhado (px de dispositivo)
uniform vec4 u_sym;        // o símbolo no lugar final (px de dispositivo)
uniform float u_cell;
uniform sampler2D u_tex;
uniform float u_form;      // 0..1: condensação dos C
uniform float u_abre;      // 0..1: quanto os C estão afastados (1 = longe)
uniform float u_elos;      // 0..1: os elos acesos
uniform vec2 u_mouse;      // px de dispositivo
uniform float u_mr;        // raio da lente do cursor (0 = sem)
uniform float u_seed;
uniform vec3 u_tinta, u_vermelho;
out vec4 o;

// Um C (lado -1: o da esquerda; 1: o da direita). local: o fragmento nas coordenadas desse C.
bool temTinta(vec2 local, vec2 tela, float lado){
  vec2 cell = floor(local / u_cell);
  vec2 c = (cell + 0.5) * u_cell;
  float r = hash(cell + u_seed + lado * 17.0);
  // lente do cursor: o conteúdo abre espaço em volta do ponteiro
  vec2 cm = tela - u_mouse;
  float dm = length(cm);
  float push = u_mr > 0.0 ? smoothstep(u_mr, 0.0, dm) : 0.0;
  vec2 sc = c - (dm > 0.001 ? cm / dm : vec2(0.0)) * push * push * u_mr * 0.32;
  vec2 uv = sc / u_sym.zw;
  // condensação: a célula chega do próprio lado, com atraso aleatório
  float delay = r * 0.6;
  float k = smoothstep(delay, delay + 0.35, u_form);
  if (k <= 0.0) return false;
  vec2 suv = uv - lado * vec2(1.0, (fract(r * 7.13) - 0.5) * 0.5) * (1.0 - k) * (0.18 + r * 0.55);
  bool lugar = lado < 0.0 ? suv.x < 0.40 : suv.x > 0.60;
  if (!lugar || suv.x < 0.0 || suv.y < 0.0 || suv.x > 1.0 || suv.y > 1.0) return false;
  float tinta = texture(u_tex, suv).r;
  return bayer8(cell) + 0.0078 < tinta;
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 local = p - u_sym.xy;
  // elos: no centro, por pixel, sólidos; acendem em pontilhado (u_elos) até fechar
  vec2 uvPx = local / u_sym.zw;
  if (u_elos > 0.0 && uvPx.x > 0.0 && uvPx.y > 0.0 && uvPx.x < 1.0 && uvPx.y < 1.0 && texture(u_tex, uvPx).g > 0.5) {
    if (hash(floor(local / u_cell) + 7.0) <= u_elos) { o = vec4(u_vermelho, 1.0); return; }
  }
  float desl = u_abre * 0.34 * u_sym.z;
  if (temTinta(local + vec2(desl, 0.0), p, -1.0) || temTinta(local - vec2(desl, 0.0), p, 1.0)) {
    o = vec4(u_tinta, 1.0);
    return;
  }
  discard;
}`;

// Brilho em pontilhado: halo em volta dos elos (cresce no pulso), a cabeça do fluxo e a luz do fechamento.
// Com u_core, o disco também é preenchido.
export const BRILHO_FS = /* glsl */ `#version 300 es
precision highp float;
${COMUM}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform vec2 u_c;       // centro, px de dispositivo (inteiro)
uniform float u_R;      // raio do disco, px de dispositivo
uniform float u_cell;
uniform float u_int;    // intensidade
uniform float u_core;   // preenche o disco
uniform float u_halo;   // força do halo
uniform float u_onda;   // 0..1: fase da onda do pulso (anel que sai e some)
uniform vec3 u_cor;
out vec4 o;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 cell = floor((p - u_c) / u_cell);
  vec2 cc = (cell + 0.5) * u_cell;
  float d = length(cc) / u_R;
  float lum = d < 1.0 ? u_core * (1.0 - 0.35 * smoothstep(0.5, 1.0, d)) : exp(-(d - 1.0) * 3.4) * u_halo;
  // onda: um anel fino que abre de 1 a 4 raios e se apaga
  if (u_onda > 0.0 && u_onda < 1.0) lum += exp(-abs(d - (1.0 + u_onda * 3.0)) * 7.0) * (1.0 - u_onda) * 0.85;
  lum *= u_int;
  if (bayer8(cell) + 0.0078 >= lum) discard;
  o = vec4(u_cor, 1.0);
}`;
