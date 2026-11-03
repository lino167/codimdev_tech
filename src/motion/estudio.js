// Estúdio: palavras que sobem em sequência, fios curvos do fim da linha até a nota e bolinhas da equipe.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SVG = 'http://www.w3.org/2000/svg';

export function animarEstudio(secao, { reduzido }) {
  const texto = secao.querySelector('.estudio__texto');
  const margem = secao.querySelector('.estudio__margem');
  const svg = secao.querySelector('.estudio__fios');
  const palavras = [...texto.querySelectorAll('.p')];
  const notas = [...secao.querySelectorAll('.nota')];
  const celular = window.matchMedia('(max-width: 760px)');

  if (!reduzido) {
    gsap.from(palavras, {
      yPercent: 45,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.022,
      scrollTrigger: { trigger: texto, start: 'top 80%', once: true },
    });
    // sem efeito elástico (Livro da Marca): entra por opacidade + 24 px
    gsap.from(secao.querySelector('.assinatura'), {
      y: 24,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: secao.querySelector('.assinatura'), start: 'top 92%', once: true },
    });
  }

  let gatilhos = [];

  // fim da linha visual em que está a palavra-âncora (posições sem transform, via offset*)
  function fimDaLinha(el) {
    const topo = el.offsetTop;
    let direita = 0;
    for (const p of palavras) {
      if (Math.abs(p.offsetTop - topo) < 4) direita = Math.max(direita, p.offsetLeft + p.offsetWidth);
    }
    return { x: direita, y: topo + el.offsetHeight * 0.56, alt: el.offsetHeight };
  }

  function montar() {
    gatilhos.forEach((g) => g.kill());
    gatilhos = [];
    svg.replaceChildren();

    if (celular.matches) {
      notas.forEach((n) => {
        n.style.top = '';
        n.style.opacity = '';
      });
      return;
    }

    const xNota = margem.offsetLeft + 22; // o ponto da nota fica no começo dela
    notas.forEach((nota, i) => {
      const ancora = texto.querySelector(`[data-ancora="${i}"]`);
      if (!ancora) return;
      const { x, y, alt } = fimDaLinha(ancora);
      nota.style.top = `${y}px`;

      const x1 = x + alt * 0.12;
      const x2 = xNota - 4;
      const dx = x2 - x1;
      const desce = alt * 0.2;
      const caminho = document.createElementNS(SVG, 'path');
      caminho.setAttribute(
        'd',
        `M${x1} ${y} C${x1 + dx * 0.35} ${y + desce}, ${x2 - dx * 0.35} ${y + desce}, ${x2} ${y}`,
      );
      svg.appendChild(caminho);
      const comp = caminho.getTotalLength();
      caminho.style.strokeDasharray = `${comp}`;

      if (reduzido) {
        caminho.style.strokeDashoffset = '0';
        nota.style.opacity = '1';
        return;
      }
      caminho.style.strokeDashoffset = `${comp}`;
      nota.style.opacity = '0';
      const tw = gsap.to(caminho, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: ancora,
          start: 'top 78%',
          end: 'top 48%',
          scrub: true,
          onUpdate: (st) => {
            gsap.to(nota, { opacity: st.progress > 0.96 ? 1 : 0, duration: 0.3, overwrite: true });
          },
        },
      });
      gatilhos.push(tw.scrollTrigger);
    });
  }

  montar();
  document.fonts?.ready.then(() => {
    montar();
    ScrollTrigger.refresh();
  });
  let espera;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(montar, 150);
  });
}
