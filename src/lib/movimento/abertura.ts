// Cena 01, o hero, montado por dois cursores (src/lib/motor): o `design` risca o contorno da logo gigante e depois
// mede e seleciona o título; o `código` preenche a logo, da esquerda para a direita, e depois escreve o título, letra
// a letra. A foto sobe, o apoio e os botões entram por tempo, e com o mouse a logo e a foto se deslocam em sentidos
// opostos (14 px e 6 px). Rolar no meio da montagem a acelera 6x. Movimento reduzido ou sem JS: tudo pronto.
import { gsap } from 'gsap';
import { criarCursor, noDocumento } from '../motor/cursores';
import { criarCaixa } from '../motor/caixa';

const SEG_POR_LETRA = 0.034;
const NS = 'http://www.w3.org/2000/svg';

export interface Abertura {
  /** começa a montar (chamado quando a tela do carregador se abre) */
  entrar(): void;
}

export function prepararAbertura(reduzido: boolean): Abertura | null {
  const sec = document.querySelector<HTMLElement>('#inicio');
  const titulo = document.querySelector<HTMLElement>('[data-digita]');
  const logo = document.querySelector<SVGSVGElement>('[data-logo]');
  const contorno = logo?.querySelector<SVGPathElement>('[data-contorno]');
  const preenche = logo?.querySelector<SVGGElement>('[data-preenche]');
  const foto = document.querySelector<HTMLElement>('[data-foto]');
  if (!sec || !titulo || !logo || !contorno || !preenche || !foto || reduzido) return null;
  const rotulos = JSON.parse(sec.dataset.rotulos ?? '{}') as { design: string; codigo: string };
  const resto = Array.from(
    document.querySelectorAll<HTMLElement>('.abertura__apoio, .abertura__botoes, .abertura__nota'),
  );

  // título: o texto completo fica para leitores de tela; o visual (letra por letra) espera escondido
  const completo = (titulo.textContent ?? '').replace(/\s+/g, ' ').trim();
  const letras: HTMLElement[] = [];
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');
  const dividir = (no: Node, destino: Node) => {
    if (no.nodeType === Node.TEXT_NODE) {
      for (const ch of no.textContent ?? '') {
        if (/\s/.test(ch)) {
          destino.appendChild(document.createTextNode(' '));
          continue;
        }
        const l = document.createElement('span');
        l.className = 'letra';
        l.textContent = ch;
        destino.appendChild(l);
        letras.push(l);
      }
    } else if (no instanceof HTMLElement) {
      const copia = no.cloneNode(false) as HTMLElement;
      destino.appendChild(copia);
      no.childNodes.forEach((filho) => dividir(filho, copia));
    }
  };
  titulo.childNodes.forEach((no) => dividir(no, visual));
  const leitor = document.createElement('span');
  leitor.className = 'so-leitor';
  leitor.textContent = completo;
  titulo.replaceChildren(leitor, visual);
  titulo.classList.add('digitando');

  // logo: o preenchimento fica atrás de uma máscara que cresce da esquerda; o contorno se desenha por cima
  const [vx, vy, vw, vh] = (logo.getAttribute('viewBox') ?? '').split(/\s+/).map(Number);
  const defs = document.createElementNS(NS, 'defs');
  const cp = document.createElementNS(NS, 'clipPath');
  cp.id = 'logo-mascara';
  const ret = document.createElementNS(NS, 'rect');
  ret.setAttribute('x', String(vx));
  ret.setAttribute('y', String(vy));
  ret.setAttribute('width', '0');
  ret.setAttribute('height', String(vh));
  cp.appendChild(ret);
  defs.appendChild(cp);
  logo.prepend(defs);
  preenche.setAttribute('clip-path', 'url(#logo-mascara)');
  const comprimento = contorno.getTotalLength();

  gsap.set(resto, { opacity: 0, y: 20 });
  gsap.set(foto, { opacity: 0, yPercent: 6 });

  // do ponto do SVG (unidades da logo) para o documento
  const doSvg = (px: number, py: number) => {
    const m = logo.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(px, py).matrixTransform(m);
    return { x: p.x + window.scrollX, y: p.y + window.scrollY };
  };

  return {
    entrar() {
      const design = criarCursor('design', rotulos.design);
      const codigo = criarCursor('codigo', rotulos.codigo);
      const caixa = criarCaixa();
      const tl = gsap.timeline({ onComplete: () => tl.kill() });

      // a foto sobe com os cursores entrando
      tl.to(foto, { opacity: 1, yPercent: 0, duration: 1.2, ease: 'expo.out' }, 0.2);

      // 1. o design risca o contorno
      const inicio = contorno.getPointAtLength(0);
      const pIni = doSvg(inicio.x, inicio.y);
      tl.add(design.entrar(pIni.x, pIni.y, 0.8), 0);
      tl.set(contorno, { opacity: 1 }, 0.8);
      const prog = { p: 0 };
      tl.to(
        prog,
        {
          p: 1,
          duration: 1.7,
          ease: 'power1.inOut',
          onUpdate() {
            contorno.style.strokeDashoffset = String(1 - prog.p);
            const pt = contorno.getPointAtLength(prog.p * comprimento);
            const d = doSvg(pt.x, pt.y);
            gsap.set(design.el, { x: d.x, y: d.y });
          },
        },
        0.8,
      );

      // 2. o código preenche, da esquerda para a direita
      const baixoEsq = doSvg(vx, vy + vh);
      tl.add(codigo.entrar(baixoEsq.x, baixoEsq.y, 0.8), 0.3);
      const varre = { w: 0 };
      tl.to(
        varre,
        {
          w: vw,
          duration: 1.7,
          ease: 'power1.inOut',
          onUpdate() {
            ret.setAttribute('width', String(varre.w));
            const d = doSvg(vx + varre.w, vy + vh * 0.55);
            gsap.set(codigo.el, { x: d.x, y: d.y });
          },
        },
        1.1,
      );
      tl.to(contorno, { opacity: 0, duration: 0.5 }, 2.8);

      // 3. o design seleciona o título e mostra a medida
      const rt = titulo.getBoundingClientRect();
      const topoEsq = noDocumento(rt, 0, 0);
      tl.add(design.ir(topoEsq.x, topoEsq.y, 0.7), 2.6);
      tl.add(() => {
        caixa.desenhar(topoEsq.x, topoEsq.y, rt.width, rt.height, 0.8, (cx, cy) =>
          gsap.set(design.el, { x: cx, y: cy }),
        );
      }, 3.3);
      tl.add(() => void caixa.remover(0.4), 4.3);
      tl.add(() => void design.sair(0.7), 4.3);

      // 4. o código escreve o título
      const ini = 3.3;
      letras.forEach((l, i) =>
        tl.call(
          () => {
            l.style.opacity = '1';
            const r = noDocumento(l.getBoundingClientRect(), 1, 0.3);
            gsap.set(codigo.el, { x: r.x + 4, y: r.y });
          },
          undefined,
          ini + i * SEG_POR_LETRA,
        ),
      );
      const fim = ini + letras.length * SEG_POR_LETRA;
      tl.to(resto, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'expo.out' }, fim - 0.3);
      tl.add(() => void codigo.sair(0.7), fim + 0.2);

      // rolar no meio da montagem acelera tudo
      const acelerar = () => {
        if (window.scrollY > 40) tl.timeScale(6);
      };
      window.addEventListener('scroll', acelerar, { passive: true });
      tl.eventCallback('onComplete', () => window.removeEventListener('scroll', acelerar));

      // mouse: a logo anda 14 px e a foto 6 px, em sentidos opostos (só com mouse)
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const lx = gsap.quickTo(logo, 'x', { duration: 0.8, ease: 'power3.out' });
        const ly = gsap.quickTo(logo, 'y', { duration: 0.8, ease: 'power3.out' });
        const fx = gsap.quickTo(foto, 'x', { duration: 0.8, ease: 'power3.out' });
        const fy = gsap.quickTo(foto, 'y', { duration: 0.8, ease: 'power3.out' });
        window.addEventListener(
          'pointermove',
          (e) => {
            const nx = e.clientX / innerWidth - 0.5;
            const ny = e.clientY / innerHeight - 0.5;
            lx(nx * 28);
            ly(ny * 28);
            fx(-nx * 12);
            fy(-ny * 12);
          },
          { passive: true },
        );
      }
    },
  };
}
