// A travessia entre o hero e o resto: a rolagem (presa por 3,2 telas) dirige uma câmera que voa por um túnel de palavras e
// molduras de janela (CSS 3D, sem WebGL). Fases: 0-10% uma linha fina se abre ao meio e o fundo escurece; 10-82% o voo
// (a frase "Eu desenho. Eu programo. Eu publico." aparece e se dissolve, as palavras passam voando); 80-100% uma última
// moldura cresce até cobrir a tela e vira a cena seguinte. Movimento reduzido ou sem JS: a seção nem aparece.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PROFUNDIDADE = 3600; // distância total do túnel, em px
const QUADROS = 9; // molduras de janela ao longo do túnel
const limitar = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const suave = (x: number) => x * x * (3 - 2 * x);

interface Item {
  el: HTMLElement;
  x: number;
  y: number;
  k: number; // distância da câmera no início, em px
  rz: number;
}

export function tunel({ reduzido }: { reduzido: boolean }) {
  const sec = document.querySelector<HTMLElement>('[data-tunel]');
  if (!sec || reduzido) return;
  const fundo = sec.querySelector<HTMLElement>('[data-fundo]');
  const linha = sec.querySelector<HTMLElement>('[data-linha]');
  const mundo = sec.querySelector<HTMLElement>('[data-mundo]');
  const portal = sec.querySelector<HTMLElement>('[data-portal]');
  const frase = sec.querySelector<HTMLElement>('[data-frase]');
  if (!fundo || !linha || !mundo || !portal || !frase) return;
  const palavras = JSON.parse(sec.dataset.dados ?? '[]') as string[];
  if (!palavras.length) return;
  sec.classList.add('tunel--animado');

  const celular = window.innerWidth <= 700;
  const N = celular ? 22 : 38;
  const itens: Item[] = [];
  const L = () => window.innerWidth;
  const A = () => window.innerHeight;

  // palavras em espiral ao redor do centro (nunca no meio, onde a câmera passa)
  for (let i = 0; i < N; i++) {
    const el = document.createElement('span');
    el.className = 'tunel__item';
    el.textContent = palavras[i % palavras.length];
    el.style.fontSize = `${(celular ? 2 : 3.2) * (0.8 + ((i * 0.37) % 0.8))}rem`;
    mundo.appendChild(el);
    const ang = i * 2.39996;
    const raio = 0.2 + ((i * 0.618) % 1) * 0.3;
    itens.push({
      el,
      x: Math.cos(ang) * raio * L(),
      y: Math.sin(ang) * raio * A() * 1.3,
      k: ((i + 1) / N) * PROFUNDIDADE,
      rz: ((i % 5) - 2) * 4,
    });
  }
  // molduras de janela: os anéis do túnel
  for (let j = 0; j < QUADROS; j++) {
    const el = document.createElement('span');
    el.className = 'tunel__item tunel__moldura';
    el.style.width = `${L() * (celular ? 0.9 : 0.7)}px`;
    el.style.height = `${L() * (celular ? 0.9 : 0.7) * 0.62}px`;
    mundo.appendChild(el);
    itens.push({ el, x: 0, y: 0, k: ((j + 1) / (QUADROS + 1)) * PROFUNDIDADE, rz: j * 5 - 12 });
  }

  const render = (p: number) => {
    // 1. a linha se abre e o fundo escurece
    const w = suave(limitar(p / 0.1));
    linha.style.transform = `scaleX(${limitar(p / 0.04)})`;
    linha.style.opacity = String(1 - w);
    fundo.style.clipPath = `inset(${(1 - w) * 49.8}% 0)`;
    // 2. o voo
    const q = limitar((p - 0.08) / 0.74);
    const cz = q * PROFUNDIDADE * 0.96;
    mundo.style.transform = `rotateZ(${q * 16}deg)`;
    for (const it of itens) {
      const r = it.k - cz;
      const o = limitar(1 - r / (PROFUNDIDADE * 0.85)) * limitar((r + 60) / 360) * w;
      if (o <= 0.003) {
        it.el.style.opacity = '0';
        continue;
      }
      it.el.style.opacity = o.toFixed(3);
      it.el.style.transform = `translate(-50%,-50%) translate3d(${it.x}px,${it.y}px,${-r}px) rotateZ(${it.rz}deg)`;
    }
    // a frase de abertura
    const f = limitar((p - 0.1) / 0.1) * (1 - limitar((p - 0.3) / 0.08));
    frase.style.opacity = f.toFixed(3);
    // 3. a moldura final cresce e vira a cena seguinte
    const u = limitar((p - 0.8) / 0.2);
    portal.style.transform = `translate(-50%,-50%) scale(${u === 0 ? 0 : 0.04 + 0.96 * u * u * u})`;
    // a nav lê este atributo: escura enquanto o fundo é escuro
    sec.dataset.tema = w > 0.5 && u < 0.45 ? 'escuro' : 'claro';
  };
  render(0);

  ScrollTrigger.create({
    trigger: sec,
    start: 'top top',
    end: () => `+=${window.innerWidth <= 700 ? 260 : 320}%`,
    pin: true,
    scrub: 0.5,
    anticipatePin: 1,
    onUpdate: (self) => render(self.progress),
  });
}
