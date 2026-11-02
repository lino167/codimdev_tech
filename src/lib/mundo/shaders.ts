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
// Os C viram pontilhado de tinta em células presas ao símbolo; os elos são vermelho sólido (testados por pixel,
// para o recorte a 45° sair nítido). u_form traz as células de longe (condensação), com atraso aleatório.
export const SIMBOLO_FS = /* glsl */ `#version 300 es
precision highp float;
${COMUM}
uniform vec2 u_res;
uniform vec4 u_rect;
uniform float u_cell;
uniform sampler2D u_tex;
uniform float u_form;      // 0..1: condensação dos C
uniform float u_elos;      // 0..1: os elos acesos
uniform vec2 u_dir;        // de onde as células chegam (unitário, y para baixo)
uniform float u_seed;
uniform vec3 u_tinta, u_vermelho;
out vec4 o;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 local = p - u_rect.xy;
  vec2 uvPx = local / u_rect.zw;
  // elos: por pixel, sólidos
  float elo = texture(u_tex, uvPx).g;
  if (elo > 0.5 && u_elos > 0.0) {
    if (hash(floor(local / u_cell) + 7.0) > u_elos) discard;
    o = vec4(u_vermelho, 1.0);
    return;
  }
  // C: por célula, em pontilhado
  vec2 cell = floor(local / u_cell);
  vec2 c = (cell + 0.5) * u_cell;
  float r = hash(cell + u_seed);
  vec2 uv = c / u_rect.zw;
  float delay = r * 0.6;
  float k = smoothstep(delay, delay + 0.35, u_form);
  vec2 suv = uv - u_dir * (1.0 - k) * (0.25 + r * 0.6);
  float tinta = 0.0;
  if (suv.x > 0.0 && suv.y > 0.0 && suv.x < 1.0 && suv.y < 1.0) tinta = texture(u_tex, suv).r;
  tinta *= step(0.001, k);
  if (bayer8(cell) + 0.0078 >= tinta) discard;
  o = vec4(u_tinta, 1.0);
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
uniform vec3 u_cor;
out vec4 o;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 cell = floor((p - u_c) / u_cell);
  vec2 cc = (cell + 0.5) * u_cell;
  float d = length(cc) / u_R;
  float lum = d < 1.0 ? u_core * (1.0 - 0.35 * smoothstep(0.5, 1.0, d)) : exp(-(d - 1.0) * 3.4) * u_halo;
  lum *= u_int;
  if (bayer8(cell) + 0.0078 >= lum) discard;
  o = vec4(u_cor, 1.0);
}`;
