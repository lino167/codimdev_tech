// O motor de partículas do hero (ogl): uma nuvem de pontos que voa das bordas e escreve o nome, desmancha em redemoinho e
// vira o retrato; o mouse afasta os pontos, a câmera tem parallax e, ao rolar, tudo recua. Se o WebGL2 falhar, devolve null
// e o hero fica com a foto parada.
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';
import type { Alvo } from './alvos';
import { semente } from './alvos';

const VERTICE = /* glsl */ `#version 300 es
in vec3 aInicio; in vec3 aTexto; in vec3 aTextoCor; in vec3 aRetrato; in vec3 aRetratoCor; in vec4 aSorte;
uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix;
uniform float uTempo; uniform float uChegada; uniform float uMorfismo; uniform float uRecuo;
uniform float uPR; uniform float uTamanho; uniform vec2 uMouse; uniform vec2 uRepele;
out vec3 vCor; out float vAlfa;
float suavizar(float t){ return t < .5 ? 4.*t*t*t : 1. - pow(-2.*t + 2., 3.) / 2.; }
void main(){
  float a = suavizar(clamp((uChegada - aSorte.x * .5) / .5, 0., 1.));
  float m = suavizar(clamp((uMorfismo - aSorte.y * .5) / .5, 0., 1.));
  vec3 base = mix(aTexto, aRetrato, m);
  // redemoinho: no meio do morfismo o ponto gira em torno do centro
  float giro = sin(m * 3.14159) * (aSorte.z - .5) * 2.4;
  float cs = cos(giro), sn = sin(giro);
  base.xy = vec2(base.x * cs - base.y * sn, base.x * sn + base.y * cs);
  base.z += sin(m * 3.14159) * (aSorte.w - .5) * .5;
  // vida: um tremor mínimo
  base += .0035 * vec3(sin(uTempo * .6 + aSorte.w * 40.), cos(uTempo * .5 + aSorte.z * 40.), sin(uTempo * .4 + aSorte.x * 30.));
  vec3 p = mix(aInicio, base, a);
  // o mouse afasta os pontos
  vec2 d = p.xy - uMouse; float dist = length(d);
  float f = pow(max(0., 1. - dist / uRepele.x), 2.);
  p.xy += normalize(d + 1e-5) * f * uRepele.y * 6.;
  p.z += f * .25;
  // recuo: ao rolar, a nuvem se afasta e se apaga
  p *= mix(1., .86, uRecuo); p.z -= uRecuo * .8;
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uTamanho * uPR * (.7 + .6 * aSorte.z) * (11.4 / -mv.z) * mix(1., .75, uRecuo);
  vCor = mix(aTextoCor, aRetratoCor, m);
  vAlfa = mix(1., .0, uRecuo) * smoothstep(0., .25, a);
}`;

const FRAGMENTO = /* glsl */ `#version 300 es
precision highp float;
in vec3 vCor; in float vAlfa; out vec4 saida;
void main(){
  float d = length(gl_PointCoord - .5);
  if (d > .5) discard;
  saida = vec4(vCor, smoothstep(.5, .12, d) * vAlfa);
}`;

export interface Particulas {
  /** a linha do tempo mexe nestes valores */
  estado: { chegada: number; morfismo: number; recuo: number };
  /** liga o mouse (coordenadas da janela) */
  mouse(x: number, y: number, dentro: boolean): void;
  /** o FPS médio dos primeiros quadros, para o plano B */
  fps(): number;
  parar(): void;
  redimensionar(): void;
  /** troca a quantidade (nuvem menor) */
  destruir(): void;
}

export function criarParticulas(canvas: HTMLCanvasElement, logo: Alvo, retrato: Alvo, n: number): Particulas | null {
  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: false,
      dpr: Math.min(2, window.devicePixelRatio || 1),
      webgl: 2,
    });
  } catch {
    return null;
  }
  const gl = renderer.gl;
  if (!gl || !('createVertexArray' in gl)) return null;
  gl.clearColor(0, 0, 0, 0);

  const camera = new Camera(gl, { fov: 10, near: 1, far: 40 });
  camera.position.set(0, 0, 11.4);
  const cena = new Transform();

  // posições de partida: espalhadas nas bordas, de onde os pontos entram voando
  const rnd = semente(99);
  const inicio = new Float32Array(n * 3);
  const sorte = new Float32Array(n * 4);
  for (let i = 0; i < n; i++) {
    const ang = rnd() * Math.PI * 2;
    const raio = 2.4 + rnd() * 2.2;
    inicio[i * 3] = Math.cos(ang) * raio * 1.6;
    inicio[i * 3 + 1] = Math.sin(ang) * raio;
    inicio[i * 3 + 2] = (rnd() - 0.5) * 2;
    // ordem de chegada: da esquerda para a direita do nome
    sorte[i * 4] = Math.min(1, Math.max(0, (logo.pos[i * 3] + 2) / 4 + (rnd() - 0.5) * 0.15));
    sorte[i * 4 + 1] = rnd();
    sorte[i * 4 + 2] = rnd();
    sorte[i * 4 + 3] = rnd();
  }
  const geometria = new Geometry(gl, {
    aInicio: { size: 3, data: inicio },
    aTexto: { size: 3, data: logo.pos },
    aTextoCor: { size: 3, data: logo.cor },
    aRetrato: { size: 3, data: retrato.pos },
    aRetratoCor: { size: 3, data: retrato.cor },
    aSorte: { size: 4, data: sorte },
  });
  const estado = { chegada: 0, morfismo: 0, recuo: 0 };
  const programa = new Program(gl, {
    vertex: VERTICE,
    fragment: FRAGMENTO,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uTempo: { value: 0 },
      uChegada: { value: 0 },
      uMorfismo: { value: 0 },
      uRecuo: { value: 0 },
      uPR: { value: renderer.dpr },
      uTamanho: { value: 1.6 },
      uMouse: { value: [9, 9] },
      uRepele: { value: [0.22, 0.037] },
    },
  });
  const malha = new Mesh(gl, { mode: gl.POINTS, geometry: geometria, program: programa });
  malha.setParent(cena);

  let aspecto = 1;
  const redimensionar = () => {
    // mede o pai: o ogl escreve width/height em px no canvas (300 × 150 no começo)
    const pai = canvas.parentElement as HTMLElement;
    const l = pai.clientWidth;
    const a = pai.clientHeight;
    renderer.setSize(l, a);
    aspecto = l / a;
    camera.perspective({ aspect: aspecto });
    programa.uniforms.uPR.value = renderer.dpr;
    programa.uniforms.uTamanho.value = (a / 900) * 2.3 * (n > 200000 ? 1 : 1.35);
  };
  redimensionar();

  // mouse (alvo) e câmera (segue o alvo com atraso)
  const alvoMouse = { x: 9, y: 9, nx: 0, ny: 0 };
  const cam = { x: 0, y: 0 };
  let tempo = 0;
  let ativo = true;
  let quadros = 0;
  let acumulado = 0;
  let ultimo = performance.now();
  let id = 0;
  const laco = (agora: number) => {
    if (!ativo) return;
    id = requestAnimationFrame(laco);
    const dt = Math.min(0.1, (agora - ultimo) / 1000);
    ultimo = agora;
    if (quadros < 120) {
      quadros++;
      acumulado += dt;
    }
    tempo += dt;
    cam.x += (alvoMouse.nx - cam.x) * 0.11;
    cam.y += (alvoMouse.ny - cam.y) * 0.11;
    cena.rotation.y = cam.x * 0.18;
    cena.rotation.x = -cam.y * 0.1;
    const u = programa.uniforms;
    u.uTempo.value = tempo;
    u.uChegada.value = estado.chegada;
    u.uMorfismo.value = estado.morfismo;
    u.uRecuo.value = estado.recuo;
    u.uMouse.value = [alvoMouse.x * aspecto, alvoMouse.y];
    renderer.render({ scene: cena, camera });
  };
  id = requestAnimationFrame(laco);

  return {
    estado,
    mouse(x, y, dentro) {
      const r = (canvas.parentElement as HTMLElement).getBoundingClientRect();
      const nx = ((x - r.left) / r.width - 0.5) * 2;
      const ny = -((y - r.top) / r.height - 0.5) * 2;
      alvoMouse.x = dentro ? nx : 9;
      alvoMouse.y = dentro ? ny : 9;
      alvoMouse.nx = dentro ? nx : 0;
      alvoMouse.ny = dentro ? ny : 0;
    },
    fps: () => (acumulado > 0 ? quadros / acumulado : 60),
    parar() {
      ativo = false;
      cancelAnimationFrame(id);
    },
    redimensionar,
    destruir() {
      ativo = false;
      cancelAnimationFrame(id);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
