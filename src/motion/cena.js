// Túnel de trabalhos em Three.js: 78 planos de fotos numa parede elíptica + 4 destaques que saem da parede.
// A câmera e o "puxar" de cada destaque vêm de `estado`, que a timeline do scroll (percurso.js) anima.
// Só desenha quando algo muda (scroll, cursor, textura carregada).
import * as THREE from 'three';
import pecas from '../data/pecas.json';
import { casos } from '../data/casos.js';

export const FUNDO = 0xffffff; // = --fundo (tokens.css): o fundo e a névoa do túnel
export const N = 78;
export const Z_INICIO = 3.5;
export const Z_FIM = -96;
export const CAMERA_Z0 = 6;
export const PROF_DESTAQUES = [-14, -33, -52, -71];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

// sorteio com semente fixa: o túnel é sempre o mesmo
function semente(s) {
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// profundidade de campo barata: viés de mipmap por plano
function viesPorDistancia(d) {
  if (d < 6) return (6 - d) * 0.45;
  if (d > 22) return Math.min(3, (d - 22) * 0.12);
  return 0;
}

function criarMaterial(textura) {
  const m = new THREE.MeshBasicMaterial({
    map: textura,
    transparent: true,
    depthWrite: false,
    opacity: 0,
  });
  const vies = { value: 0 };
  m.userData.vies = vies;
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uVies = vies;
    shader.fragmentShader =
      'uniform float uVies;\n' +
      shader.fragmentShader.replace(
        '#include <map_fragment>',
        '#ifdef USE_MAP\n  diffuseColor *= texture2D( map, vMapUv, uVies );\n#endif',
      );
  };
  return m;
}

export function criarCena(canvas, { reduzido }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(FUNDO);
  scene.fog = new THREE.Fog(FUNDO, 9, 44);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 120);
  camera.position.set(0, 0, CAMERA_Z0);

  let sujo = true;
  const pedir = () => {
    sujo = true;
  };

  // uma textura por arquivo, compartilhada
  const loader = new THREE.TextureLoader();
  const texturas = new Map();
  const textura = (src) => {
    if (!texturas.has(src)) {
      const t = loader.load(src, pedir);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      texturas.set(src, t);
    }
    return texturas.get(src);
  };

  const geo = new THREE.PlaneGeometry(1, 1);

  // ---------- paredes ----------
  const rnd = semente(2016);
  const planos = [];
  for (let i = 0; i < N; i++) {
    const p = pecas[i % pecas.length];
    let ang = i * 2.39996 + (rnd() * 2 - 1) * 0.25;
    const raio = 3.5 + rnd() * 2.1;
    const z = lerp(Z_INICIO, Z_FIM, i / (N - 1)) + (rnd() - 0.5) * 0.8;
    const altura = 1.05 + rnd() * 1.15;
    // os 10 primeiros fogem do canto inferior esquerdo (onde fica o wordmark): espelha para a direita
    if (i < 10 && Math.cos(ang) < 0 && Math.sin(ang) < 0) ang = Math.PI - ang;

    const mesh = new THREE.Mesh(geo, criarMaterial(textura('/' + p.src)));
    mesh.scale.set((altura * p.w) / p.h, altura, 1);
    mesh.position.z = z;
    mesh.rotation.x = Math.sin(ang) * 0.28;
    mesh.rotation.y = -Math.cos(ang) * 0.32;
    scene.add(mesh);
    planos.push({ mesh, ang, raio, z });
  }

  // ---------- destaques ----------
  const destaques = casos.map((c, i) => {
    const mesh = new THREE.Mesh(geo, criarMaterial(textura(c.foto)));
    mesh.renderOrder = 2;
    scene.add(mesh);
    return { mesh, ang: c.parede.ang, raio: c.parede.raio, z: PROF_DESTAQUES[i] };
  });

  // ---------- estado animado pela timeline ----------
  const estado = { camZ: CAMERA_Z0, puxar: casos.map(() => ({ v: 0 })) };
  const cam = { z: CAMERA_Z0, x: 0, y: 0 };
  const alvoCursor = { x: 0, y: 0 };
  let elipse = { x: 1.45, y: 1 };
  let retrato = false;

  const fino = window.matchMedia('(pointer: fine)').matches;
  if (fino && !reduzido) {
    window.addEventListener(
      'pointermove',
      (e) => {
        alvoCursor.x = (e.clientX / window.innerWidth) * 2 - 1;
        alvoCursor.y = -((e.clientY / window.innerHeight) * 2 - 1);
      },
      { passive: true },
    );
  }

  function posicionarParedes() {
    for (const pl of planos) {
      pl.mesh.position.x = Math.cos(pl.ang) * pl.raio * elipse.x;
      pl.mesh.position.y = Math.sin(pl.ang) * pl.raio * elipse.y;
    }
  }

  function redimensionar() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    retrato = camera.aspect < 0.8;
    camera.fov = retrato ? 62 : 50;
    camera.updateProjectionMatrix();
    elipse = retrato ? { x: 0.72, y: 1.55 } : { x: 1.45, y: 1 };
    posicionarParedes();
    pedir();
  }

  // distância em que a foto 6 × 4 cobre a tela (em retrato: inteira na largura, 5% de folga de cada lado)
  function distanciaCobrir() {
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const a = camera.aspect;
    if (retrato) return 6 / (0.9 * 2 * t * a);
    return 0.94 * Math.min(4 / (2 * t), 6 / (2 * t * a));
  }

  let visivel = true;
  new IntersectionObserver(([e]) => {
    visivel = e.isIntersecting;
    if (visivel) pedir();
  }).observe(canvas);

  function quadro() {
    if (!visivel) return;
    const kz = reduzido ? 1 : 0.14;
    const kc = 0.06;
    const puxar = estado.puxar.map((o) => o.v);
    const maxP = Math.max(...puxar);
    const forca = 1 - maxP * 0.92;

    const dz = estado.camZ - cam.z;
    const dx = alvoCursor.x * forca - cam.x;
    const dy = alvoCursor.y * forca - cam.y;
    const mexendo = Math.abs(dz) > 1e-4 || Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4;
    if (!mexendo && !sujo) return;
    sujo = false;

    cam.z += dz * kz;
    cam.x += dx * kc;
    cam.y += dy * kc;
    camera.position.set(cam.x * 0.55, cam.y * 0.35, cam.z);
    camera.lookAt(cam.x * 0.55 * 0.3, cam.y * 0.35 * 0.3, cam.z - 12);

    const recuo = 1 - maxP * (retrato ? 0.985 : 0.88); // em retrato o texto fica sobre o túnel: some quase tudo
    for (const pl of planos) {
      const d = cam.z - pl.z;
      const m = pl.mesh;
      if (d < 0.05 || d > 46) {
        m.visible = false;
        continue;
      }
      m.visible = true;
      m.material.opacity = smooth(0.4, 2.2, d) * recuo;
      m.material.userData.vies.value = viesPorDistancia(d);
    }

    destaques.forEach((dq, i) => {
      const m = dq.mesh;
      const d = cam.z - dq.z;
      if (d < 0.02 || d > 46) {
        m.visible = false;
        return;
      }
      m.visible = true;
      const p = smooth(0, 1, puxar[i]);
      const outros = Math.max(0, ...puxar.filter((_, j) => j !== i));
      const wx = Math.cos(dq.ang) * dq.raio * elipse.x;
      const wy = Math.sin(dq.ang) * dq.raio * elipse.y;
      m.position.set(lerp(wx, 0, p), lerp(wy, 0, p), dq.z);
      const s = lerp(0.36, 1, p);
      m.scale.set(6 * s, 4 * s, 1);
      m.rotation.x = Math.sin(dq.ang) * 0.28 * (1 - p);
      m.rotation.y = -Math.cos(dq.ang) * 0.32 * (1 - p);
      const naParede = smooth(0.4, 2.2, d) * (1 - outros * (retrato ? 0.985 : 0.88));
      const puxado = smooth(0.04, 0.55, d); // some nos últimos centímetros ao atravessar
      m.material.opacity = lerp(naParede, puxado, p);
      m.material.userData.vies.value = viesPorDistancia(d) * (1 - p);
    });

    renderer.render(scene, camera);
  }

  redimensionar();
  window.addEventListener('resize', redimensionar);

  return { estado, quadro, pedir, distanciaCobrir, redimensionar };
}
