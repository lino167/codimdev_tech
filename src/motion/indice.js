// Índice: filtros que escondem linhas e a foto do projeto que segue o cursor (só com ponteiro fino).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function animarIndice(secao, { reduzido }) {
  const botoes = [...secao.querySelectorAll('.filtros button')];
  const linhas = [...secao.querySelectorAll('.linha')];
  const conta = secao.querySelector('[data-conta]');

  botoes.forEach((b) =>
    b.addEventListener('click', () => {
      const filtro = b.dataset.filtro;
      botoes.forEach((o) => {
        const ativo = o === b;
        o.setAttribute('aria-pressed', String(ativo));
        o.classList.toggle('pilula--tinta', ativo);
      });
      let n = 0;
      linhas.forEach((l) => {
        const mostra = filtro === 'todos' || l.dataset.filtro === filtro;
        l.hidden = !mostra;
        if (mostra) n++;
      });
      conta.textContent = n;
      ScrollTrigger.refresh();
    }),
  );

  const fino = window.matchMedia('(pointer: fine)').matches;
  if (!fino) return;

  const caixa = secao.querySelector('.indice__foto');
  const img = caixa.querySelector('img');
  const dur = reduzido ? 0 : 0.55;
  const irX = gsap.quickTo(caixa, 'x', { duration: dur, ease: 'power3.out' });
  const irY = gsap.quickTo(caixa, 'y', { duration: dur, ease: 'power3.out' });
  const lista = secao.querySelector('.lista');
  let dentro = false;

  const mover = (x, y) => {
    irX(x + 140);
    irY(y - caixa.offsetHeight / 2);
  };

  lista.addEventListener('pointermove', (e) => mover(e.clientX, e.clientY));

  linhas.forEach((l) => {
    const link = l.querySelector('a');
    const entrar = () => {
      if (img.getAttribute('src') !== l.dataset.foto) img.src = l.dataset.foto;
      const giro = (Math.random() * 2 - 1) * 5;
      if (!dentro) {
        dentro = true;
        gsap.fromTo(
          caixa,
          { scale: 0.6, autoAlpha: 0, rotation: giro },
          { scale: 1, autoAlpha: 1, rotation: giro, duration: reduzido ? 0 : 0.4, ease: 'power3.out' },
        );
      } else {
        gsap.to(caixa, { rotation: giro, duration: reduzido ? 0 : 0.4, ease: 'power3.out' });
      }
    };
    l.addEventListener('pointerenter', entrar);
    // pelo teclado: a foto aparece ao lado da linha focada
    link.addEventListener('focus', () => {
      const r = link.getBoundingClientRect();
      gsap.set(caixa, { x: r.left + r.width * 0.46 + 140, y: r.top + r.height / 2 - caixa.offsetHeight / 2 });
      entrar();
    });
    link.addEventListener('blur', () => sair());
  });

  const sair = () => {
    dentro = false;
    gsap.to(caixa, { scale: 0.6, autoAlpha: 0, duration: reduzido ? 0 : 0.3, ease: 'power2.in' });
  };
  lista.addEventListener('pointerleave', sair);
}
