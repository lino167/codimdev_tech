// Shaders do mundo da CodimDev. O canvas é limpo em branco; cada fragmento é uma cor cheia (u_cor: a tinta
// ou o vermelho) ou `discard`: sem cinza e sem alfa parcial, exceto a borda antisserrilhada de 1 px das formas
// SÓLIDAS (letras do título, C e elos do símbolo). Saída pré-multiplicada, com blend ONE, ONE_MINUS_SRC_ALPHA.
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
// Depois da entrada o símbolo fica SÓLIDO (u_solidez → 1, borda nítida por pixel, canal B); só em volta do
// cursor ele volta a ser pontilhado. A troca é por célula, com sorteio: a fronteira se dissolve, não corta.
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
uniform float u_solidez;   // 0..1: o símbolo sólido (fim da entrada)
uniform float u_seed;
uniform vec3 u_tinta, u_vermelho;
out vec4 o;

// Cobertura de um canal por pixel, com borda antisserrilhada de 1 px (fwidth). Chamada sempre, fora de qualquer
// desvio, porque as derivadas só são confiáveis em fluxo uniforme. mascara = 0 fora da região válida.
float borda(float v, float mascara){
  v *= mascara;
  return clamp((v - 0.5) / max(fwidth(v), 1e-3) + 0.5, 0.0, 1.0);
}
float cobertura(vec2 local, float lado){
  vec2 uvp = local / u_sym.zw;
  bool dentro = uvp.x > 0.0 && uvp.y > 0.0 && uvp.x < 1.0 && uvp.y < 1.0 && (lado < 0.0 ? uvp.x < 0.40 : uvp.x > 0.60);
  return borda(texture(u_tex, clamp(uvp, 0.0, 1.0)).b, dentro ? 1.0 : 0.0);
}

// Um C (lado -1: o da esquerda; 1: o da direita). local: o fragmento nas coordenadas desse C.
// Devolve a tinta do fragmento: 0, 1 (pontilhado) ou a cobertura antisserrilhada (sólido).
float tintaC(vec2 local, vec2 tela, float lado, float solidoPx){
  vec2 cell = floor(local / u_cell);
  vec2 c = (cell + 0.5) * u_cell;
  float r = hash(cell + u_seed + lado * 17.0);
  // lente do cursor: em volta do ponteiro o símbolo volta a ser pontilhado e abre espaço
  vec2 cm = tela - u_mouse;
  float dm = length(cm);
  float push = u_mr > 0.0 ? smoothstep(u_mr, 0.0, dm) : 0.0;
  // sólido: célula sorteada contra a solidez (menos perto do cursor); a borda vem pronta, antisserrilhada
  if (fract(r * 3.71) < u_solidez * (1.0 - smoothstep(0.15, 0.6, push))) return solidoPx;
  // empurrão proporcional à distância: perto do centro ele some, então nunca passa do cursor (sem ponto preso nele)
  vec2 sc = c - cm * push * push * 0.55;
  vec2 uv = sc / u_sym.zw;
  // condensação: a célula chega do próprio lado, com atraso aleatório
  float delay = r * 0.6;
  float k = smoothstep(delay, delay + 0.35, u_form);
  if (k <= 0.0) return 0.0;
  vec2 suv = uv - lado * vec2(1.0, (fract(r * 7.13) - 0.5) * 0.5) * (1.0 - k) * (0.18 + r * 0.55);
  bool lugar = lado < 0.0 ? suv.x < 0.40 : suv.x > 0.60;
  if (!lugar || suv.x < 0.0 || suv.y < 0.0 || suv.x > 1.0 || suv.y > 1.0) return 0.0;
  float tinta = texture(u_tex, suv).r;
  return bayer8(cell) + 0.0078 < tinta ? 1.0 : 0.0;
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 local = p - u_sym.xy;
  float desl = u_abre * 0.34 * u_sym.z;
  vec2 locE = local + vec2(desl, 0.0);
  vec2 locD = local - vec2(desl, 0.0);
  // tudo o que usa derivada, antes de qualquer desvio
  vec2 uvPx = local / u_sym.zw;
  bool noSimbolo = uvPx.x > 0.0 && uvPx.y > 0.0 && uvPx.x < 1.0 && uvPx.y < 1.0;
  float elo = borda(texture(u_tex, clamp(uvPx, 0.0, 1.0)).g, noSimbolo ? 1.0 : 0.0);
  float solE = cobertura(locE, -1.0);
  float solD = cobertura(locD, 1.0);

  // elos: no centro, sólidos com borda suave; acendem em pontilhado (u_elos) até fechar
  if (u_elos > 0.0 && elo > 0.0 && hash(floor(local / u_cell) + 7.0) <= u_elos) {
    o = vec4(u_vermelho * elo, elo);
    if (elo >= 1.0) return;
    // borda do elo: o C pode estar por baixo; mistura pré-multiplicada
    float t = max(tintaC(locE, p, -1.0, solE), tintaC(locD, p, 1.0, solD)) * (1.0 - elo);
    o += vec4(u_tinta * t, t);
    return;
  }
  float a = max(tintaC(locE, p, -1.0, solE), tintaC(locD, p, 1.0, solD));
  if (a <= 0.0) discard;
  o = vec4(u_tinta * a, a);
}`;

// ---------- título feito de pontos ----------
// Título sólido: só as células cuja ordem de solidificação (S) já passou; o resto ainda é feito de pontos.
// u_cov é RG: R = cobertura da letra (px de dispositivo), G = 1 se a letra é da palavra vermelha.
// A borda antisserrilhada das letras é o único alfa parcial do canvas (saída pré-multiplicada).
export const TITULO_FS = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform vec4 u_rect;
uniform float u_cell;
uniform float u_solid;
uniform sampler2D u_cov;
uniform sampler2D u_S;      // ordem de solidificação por célula (0..1 → 0..2)
uniform float u_final;      // 0..1: até as bordas perto do símbolo ficam sólidas (fim da entrada)
uniform vec2 u_mouse;       // px de dispositivo
uniform float u_mr;         // raio em que o cursor desfaz as letras em pontos (0 = sem)
uniform vec3 u_tinta, u_vermelho;
out vec4 o;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 local = p - u_rect.xy;
  vec2 cell = floor(local / u_cell);
  float S = texelFetch(u_S, ivec2(cell), 0).r * 2.0;
  // o MESMO limite do TITULO_VS: onde a letra sólida apaga, os pontos aparecem
  vec2 cc = u_rect.xy + (cell + 0.5) * u_cell;
  float lente = u_mr > 0.0 ? smoothstep(u_mr, u_mr * 0.2, length(cc - u_mouse)) : 0.0;
  if (u_solid + u_final * 2.0 - lente * 3.0 <= S) discard;
  vec2 cg = texelFetch(u_cov, ivec2(floor(local)), 0).rg;
  if (cg.r < 0.004) discard;
  o = vec4(mix(u_tinta, u_vermelho, step(0.5, cg.g)) * cg.r, cg.r);
}`;

// Pontos do título: cada célula de tinta sai dos elos, arqueia e pousa no lugar dela (Bézier quadrática).
// Depois as de fora viram letra sólida (TITULO_FS) e as de perto do símbolo ficam como pontos que respiram,
// afastando-se dos elos (u_radial) ou numa direção fixa (u_drift, para o letreiro do rodapé).
export const TITULO_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location=0) in vec4 a_t;   // célula x, y; S; D (quanto fica como ponto)
layout(location=1) in vec4 a_u;   // cobertura (+2 se vermelha), bayer, aleatório, atraso
uniform vec2 u_res;
uniform vec2 u_org;               // origem do título, px de dispositivo (inteiro)
uniform vec2 u_src;               // de onde os pontos saem, px de dispositivo de tela
uniform vec2 u_arc, u_drift;
uniform float u_radial;           // 1: respira para longe de u_src na horizontal
uniform float u_spread, u_amp;
uniform float u_cell, u_dpr, u_tT, u_solid, u_time, u_pulse;
uniform float u_final;            // 0..1: até as bordas perto do símbolo ficam sólidas
uniform vec2 u_mouse;             // px de dispositivo
uniform float u_mr;               // raio em que o cursor desfaz as letras em pontos (0 = sem)
out float v_red;
#define HIDE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
void main(){
  float S = a_t.z, D = a_t.w;
  float red = step(1.5, a_u.x);
  float cov = a_u.x - red * 2.0;
  float bay = a_u.y, r = a_u.z, delay = a_u.w;
  v_red = red;
  vec2 tgt0 = u_org + (a_t.xy + 0.5) * u_cell;
  // o MESMO limite do TITULO_FS: perto do cursor a letra sólida apaga e o ponto aparece
  vec2 dm = tgt0 - u_mouse;
  float lente = u_mr > 0.0 ? smoothstep(u_mr, u_mr * 0.2, length(dm)) : 0.0;
  if (u_solid + u_final * 2.0 - lente * 3.0 > S) HIDE
  float th = mix(1.01, cov * (1.0 - D * 0.86), max(u_solid, lente));
  if (bay >= th) HIDE
  float k = clamp((u_tT - delay) / 1.25, 0.0, 1.0);
  if (k <= 0.0) HIDE
  float e = 1.0 - pow(1.0 - k, 4.0);
  vec2 tgt = u_org + (a_t.xy + 0.5) * u_cell;
  vec2 s0 = u_src + (vec2(r, fract(r * 13.17)) - 0.5) * vec2(u_spread * 0.5, u_spread);
  vec2 ctrl = mix(s0, tgt, 0.45) + u_arc * length(tgt - s0) * 0.38;
  vec2 pos = mix(mix(s0, ctrl, e), mix(ctrl, tgt, e), e);
  vec2 drift = u_radial > 0.5 ? normalize(vec2(sign(tgt.x - u_src.x), -0.35)) : u_drift;
  float amp = D * D * (12.0 + 30.0 * r) * u_solid * u_amp;
  pos += drift * u_dpr * (amp * (0.5 - 0.5 * cos(u_time * 0.7 + r * 6.2831)) + u_pulse * D * D * 22.0);
  // os pontos revelados pelo cursor se afastam um pouco dele
  pos += (length(dm) > 0.5 ? normalize(dm) : vec2(0.0)) * lente * lente * (4.0 + 8.0 * r) * u_dpr;
  vec2 c = floor(pos - u_cell * 0.5) + u_cell * 0.5;
  gl_Position = vec4(c.x / u_res.x * 2.0 - 1.0, 1.0 - c.y / u_res.y * 2.0, 0.0, 1.0);
  gl_PointSize = u_cell;
}`;

// Cor dos pontos (título e rajada): tinta ou vermelho, cheia.
export const PONTO_FS = /* glsl */ `#version 300 es
precision highp float;
in float v_red;
uniform vec3 u_tinta, u_vermelho;
out vec4 o;
void main(){ o = vec4(mix(u_tinta, u_vermelho, v_red), 1.0); }`;

// Rajada: pontos que saem dos elos e correm numa direção (u_bdir), sem parar, com leque gaussiano.
// u_alcance cresce na entrada (0..1); o pulso empurra os pontos novos. O cursor afasta os pontos (95 px).
// Na fatia T6, este shader ganha o fluxo que desce a página e o desvio de texto.
export const RAJADA_VS = /* glsl */ `#version 300 es
precision highp float;
layout(location=0) in vec4 a_r;
uniform vec2 u_vp, u_res;
uniform float u_dpr, u_cell, u_time, u_scroll;
uniform vec2 u_mouse, u_mpar;
uniform vec2 u_src;               // os elos (px css do documento)
uniform float u_srcR;
uniform vec2 u_bdir;
uniform float u_blen, u_alcance, u_pulse;
uniform float u_inicio;           // a que distância dos elos a rajada começa (em raios)
out float v_red;
#define HIDE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
float gauss(float a, float b){ return sqrt(-2.0 * log(max(a, 1e-4))) * cos(6.2831853 * b); }
void main(){
  float t = fract(a_r.x + u_time * (0.035 + 0.04 * a_r.y));
  float g1 = gauss(fract(a_r.z * 91.7), a_r.w);
  float g2 = gauss(fract(a_r.w * 37.3), fract(a_r.z * 5.3));
  float reach = 0.35 + 0.65 * fract(a_r.y * 17.1);
  float dist = u_srcR * u_inicio + pow(t, 1.5) * u_blen * reach;
  float ang = g1 * 0.13;
  vec2 d = mat2(cos(ang), sin(ang), -sin(ang), cos(ang)) * u_bdir;
  vec2 n = vec2(-d.y, d.x);
  vec2 doc = u_src + d * dist + n * g2 * (u_srcR * 0.25 + dist * 0.045);
  doc += d * u_pulse * 30.0 * (1.0 - t);
  if (dist > u_srcR + u_alcance * u_blen) HIDE
  if (t > 0.8 + 0.2 * fract(a_r.y * 7.7)) HIDE
  vec2 p = vec2(doc.x, doc.y - u_scroll) + u_mpar;
  vec2 dm = p - u_mouse;
  float dl = length(dm);
  p += dm / max(dl, 1.0) * 26.0 * smoothstep(95.0, 0.0, dl);
  if (p.y < -60.0 || p.y > u_vp.y + 60.0) HIDE
  // sobre o branco, um rastro de tinta pesa como fumaça: a rajada é da cor da ligação (8 em cada 10 vermelhos),
  // em pontos finos, e poucos ficam um pouco maiores
  v_red = fract(a_r.w * 41.3) > 0.2 ? 1.0 : 0.0;
  float size = a_r.z > 0.97 ? 2.0 : 1.0;
  float sz = size * u_cell;
  vec2 c = floor(p * u_dpr) + mod(sz, 2.0) * 0.5;
  gl_Position = vec4(c.x / u_res.x * 2.0 - 1.0, 1.0 - c.y / u_res.y * 2.0, 0.0, 1.0);
  gl_PointSize = sz;
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
uniform float u_ondaMax; // até quantos raios a onda abre (menor no celular, para não passar pelo texto)
uniform vec3 u_cor;
out vec4 o;
void main(){
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 cell = floor((p - u_c) / u_cell);
  vec2 cc = (cell + 0.5) * u_cell;
  float d = length(cc) / u_R;
  float lum = d < 1.0 ? u_core * (1.0 - 0.35 * smoothstep(0.5, 1.0, d)) : exp(-(d - 1.0) * 3.4) * u_halo;
  // onda: um anel fino que abre de 1 a u_ondaMax raios e se apaga
  if (u_onda > 0.0 && u_onda < 1.0) lum += exp(-abs(d - (1.0 + u_onda * (u_ondaMax - 1.0))) * 7.0) * (1.0 - u_onda) * 0.85;
  lum *= u_int;
  if (bayer8(cell) + 0.0078 >= lum) discard;
  o = vec4(u_cor, 1.0);
}`;
